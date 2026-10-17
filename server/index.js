import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { db, initDb, hashPassword, verifyPassword } from './db.js';
import { syncToPublic } from './sync.js';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

initDb();
syncToPublic(db);

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory active tokens set: token -> { username, expiresAt }
const activeTokens = new Map();

function generateToken(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeTokens.set(token, { username, expiresAt });
  return token;
}

// Auth Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeTokens.get(token);

  if (!session || session.expiresAt < Date.now()) {
    activeTokens.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  req.user = session;
  next();
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed: JPG, PNG, WebP, SVG, GIF'));
    }
  }
});

// ================= PUBLIC ROUTES =================

// Public Site Content
app.get('/api/content', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_content').all();
    const content = {};
    for (const row of rows) {
      try {
        content[row.key] = JSON.parse(row.value);
      } catch {
        content[row.key] = row.value;
      }
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Projects (Only Published)
app.get('/api/projects', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM projects 
      WHERE status = 'published' 
      ORDER BY sort_order ASC, created_at DESC
    `).all();

    const projects = rows.map((p) => ({
      ...p,
      deliverables: p.deliverables ? JSON.parse(p.deliverables) : [],
      colors: p.colors ? JSON.parse(p.colors) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      featured: Boolean(p.featured)
    }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Services
app.get('/api/services', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
    const services = rows.map((s) => ({
      ...s,
      deliverables: s.deliverables ? JSON.parse(s.deliverables) : []
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Contact Form Submission (Stored Locally)
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, projectType, message } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, project_type, message, created_at, is_read)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    stmt.run(name.trim(), email.trim(), projectType || 'General Inquiry', message.trim(), new Date().toISOString());

    res.json({
      success: true,
      message: 'Your message has been securely recorded locally. Abid will respond within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AUTH ROUTES =================

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last_login
    db.prepare('UPDATE admin_users SET last_login = ? WHERE id = ?').run(new Date().toISOString(), user.id);

    const token = generateToken(user.username);
    res.json({
      success: true,
      token,
      user: { username: user.username, lastLogin: user.last_login }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ authenticated: true, user: { username: req.user.username } });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(req.user.username);
    if (!verifyPassword(currentPassword, user.password_hash, user.salt)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const { hash, salt } = hashPassword(newPassword);
    db.prepare('UPDATE admin_users SET password_hash = ?, salt = ? WHERE id = ?').run(hash, salt, user.id);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/change-username', requireAuth, (req, res) => {
  try {
    const { newUsername, password } = req.body;
    if (!newUsername || !password) {
      return res.status(400).json({ error: 'New username and current password are required' });
    }

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(req.user.username);
    if (!verifyPassword(password, user.password_hash, user.salt)) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    db.prepare('UPDATE admin_users SET username = ? WHERE id = ?').run(newUsername.trim(), user.id);
    req.user.username = newUsername.trim();

    res.json({ success: true, message: 'Username updated successfully', username: newUsername.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN DASHBOARD & CONTENT =================

app.get('/api/admin/dashboard', requireAuth, (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const publishedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'published'").get().count;
    const draftProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'draft'").get().count;
    const totalServices = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
    const unreadMessages = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0').get().count;
    const totalMedia = db.prepare('SELECT COUNT(*) as count FROM media').get().count;

    const recentMessages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5').all();

    res.json({
      totalProjects,
      publishedProjects,
      draftProjects,
      totalServices,
      totalMessages,
      unreadMessages,
      totalMedia,
      recentMessages,
      dbStatus: 'Connected (SQLite Local)',
      storagePath: DATA_DIR
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Content Management
app.get('/api/admin/content/:key', requireAuth, (req, res) => {
  try {
    const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get(req.params.key);
    if (!row) return res.status(404).json({ error: 'Content key not found' });
    res.json(JSON.parse(row.value));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/content/:key', requireAuth, (req, res) => {
  try {
    const key = req.params.key;
    const valueStr = JSON.stringify(req.body);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO site_content (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(key, valueStr, now);

    syncToPublic(db);

    res.json({ success: true, message: `Updated ${key} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= VISUAL WEBSITE EDITOR ROUTES =================

// Public Visual Layout
app.get('/api/visual-layout', (req, res) => {
  try {
    const row = db.prepare("SELECT value FROM site_content WHERE key = 'visual_layout_published'").get();
    if (!row) {
      const fallback = db.prepare("SELECT value FROM site_content WHERE key = 'visual_layout'").get();
      if (!fallback) return res.json({ exists: false, layout: null });
      return res.json({ exists: true, layout: JSON.parse(fallback.value) });
    }
    res.json({ exists: true, layout: JSON.parse(row.value) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Get Visual Layout (both draft and published)
app.get('/api/admin/visual-layout', requireAuth, (req, res) => {
  try {
    const draftRow = db.prepare("SELECT value FROM site_content WHERE key = 'visual_layout_draft'").get();
    const publishedRow = db.prepare("SELECT value FROM site_content WHERE key = 'visual_layout_published'").get();

    res.json({
      draft: draftRow ? JSON.parse(draftRow.value) : null,
      published: publishedRow ? JSON.parse(publishedRow.value) : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Save Draft Visual Layout
app.put('/api/admin/visual-layout', requireAuth, (req, res) => {
  try {
    const layout = req.body.layout || req.body;
    const now = new Date().toISOString();
    const val = JSON.stringify(layout);

    db.prepare(`
      INSERT INTO site_content (key, value, updated_at)
      VALUES ('visual_layout_draft', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(val, now);

    res.json({ success: true, message: 'Draft visual layout saved locally' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Publish Visual Layout (Applies to Public Website)
app.post('/api/admin/visual-layout/publish', requireAuth, (req, res) => {
  try {
    const layout = req.body.layout || req.body;
    const now = new Date().toISOString();
    const val = JSON.stringify(layout);

    // Save as published
    db.prepare(`
      INSERT INTO site_content (key, value, updated_at)
      VALUES ('visual_layout_published', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(val, now);

    // Also mirror to visual_layout and draft
    db.prepare(`
      INSERT INTO site_content (key, value, updated_at)
      VALUES ('visual_layout', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(val, now);

    db.prepare(`
      INSERT INTO site_content (key, value, updated_at)
      VALUES ('visual_layout_draft', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).run(val, now);

    syncToPublic(db);

    res.json({ success: true, message: 'Visual layout published live to the public portfolio!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Reset Visual Layout
app.post('/api/admin/visual-layout/reset', requireAuth, (req, res) => {
  try {
    db.prepare("DELETE FROM site_content WHERE key IN ('visual_layout', 'visual_layout_published', 'visual_layout_draft')").run();
    syncToPublic(db);
    res.json({ success: true, message: 'Visual layout reset to original design template' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN PROJECTS CRUD =================

// Get all projects (including drafts)
app.get('/api/admin/projects', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();
    const projects = rows.map((p) => ({
      ...p,
      deliverables: p.deliverables ? JSON.parse(p.deliverables) : [],
      colors: p.colors ? JSON.parse(p.colors) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      featured: Boolean(p.featured)
    }));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Project
app.post('/api/admin/projects', requireAuth, (req, res) => {
  try {
    const p = req.body;
    const id = p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const now = new Date().toISOString();

    // Max sort order
    const maxSort = db.prepare('SELECT MAX(sort_order) as max FROM projects').get().max || 0;

    const stmt = db.prepare(`
      INSERT INTO projects (
        id, title, subtitle, category, category_label, image, description,
        client, year, role, challenge, solution, deliverables, colors, tags,
        featured, status, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      p.title || 'Untitled Project',
      p.subtitle || '',
      p.category || 'Branding',
      p.category_label || p.category || 'Branding',
      p.image || '/assets/projects/project-1.jpg',
      p.description || '',
      p.client || 'Client Name',
      p.year || new Date().getFullYear().toString(),
      p.role || 'Creative Designer',
      p.challenge || '',
      p.solution || '',
      JSON.stringify(p.deliverables || []),
      JSON.stringify(p.colors || ['#151515', '#F4510B', '#FF9D00']),
      JSON.stringify(p.tags || []),
      p.featured ? 1 : 0,
      p.status || 'published',
      p.sort_order !== undefined ? p.sort_order : maxSort + 1,
      now,
      now
    );

    res.json({ success: true, id, message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Project
app.put('/api/admin/projects/:id', requireAuth, (req, res) => {
  try {
    const p = req.body;
    const id = req.params.id;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE projects SET
        title = ?, subtitle = ?, category = ?, category_label = ?, image = ?, description = ?,
        client = ?, year = ?, role = ?, challenge = ?, solution = ?, deliverables = ?,
        colors = ?, tags = ?, featured = ?, status = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      p.title,
      p.subtitle,
      p.category,
      p.category_label || p.category,
      p.image,
      p.description,
      p.client,
      p.year,
      p.role,
      p.challenge,
      p.solution,
      JSON.stringify(p.deliverables || []),
      JSON.stringify(p.colors || []),
      JSON.stringify(p.tags || []),
      p.featured ? 1 : 0,
      p.status || 'published',
      p.sort_order || 0,
      now,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Project
app.delete('/api/admin/projects/:id', requireAuth, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder Projects
app.put('/api/admin/projects/reorder', requireAuth, (req, res) => {
  try {
    const { items } = req.body; // Array of { id, sort_order }
    const stmt = db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?');
    const updateMany = db.transaction((list) => {
      for (const item of list) {
        stmt.run(item.sort_order, item.id);
      }
    });
    updateMany(items);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN SERVICES CRUD =================

app.get('/api/admin/services', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
    const services = rows.map((s) => ({
      ...s,
      deliverables: s.deliverables ? JSON.parse(s.deliverables) : []
    }));
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/services', requireAuth, (req, res) => {
  try {
    const s = req.body;
    const id = s.id || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const maxSort = db.prepare('SELECT MAX(sort_order) as max FROM services').get().max || 0;

    db.prepare(`
      INSERT INTO services (id, title, short_desc, full_desc, icon_name, deliverables, timeline, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      s.title,
      s.short_desc || '',
      s.full_desc || '',
      s.icon_name || 'Palette',
      JSON.stringify(s.deliverables || []),
      s.timeline || '1 - 2 Weeks',
      s.sort_order !== undefined ? s.sort_order : maxSort + 1
    );

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id', requireAuth, (req, res) => {
  try {
    const s = req.body;
    db.prepare(`
      UPDATE services SET
        title = ?, short_desc = ?, full_desc = ?, icon_name = ?, deliverables = ?, timeline = ?, sort_order = ?
      WHERE id = ?
    `).run(
      s.title,
      s.short_desc,
      s.full_desc,
      s.icon_name,
      JSON.stringify(s.deliverables || []),
      s.timeline,
      s.sort_order || 0,
      req.params.id
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN STATS CRUD =================

app.get('/api/admin/stats', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/stats/:id', requireAuth, (req, res) => {
  try {
    const { label, value, detail, sort_order } = req.body;
    db.prepare(`
      UPDATE stats SET label = ?, value = ?, detail = ?, sort_order = ? WHERE id = ?
    `).run(label, value, detail, sort_order || 0, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN MESSAGES INBOX =================

app.get('/api/admin/messages', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/messages/:id/read', requireAuth, (req, res) => {
  try {
    const { is_read } = req.body;
    db.prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?').run(is_read ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/messages/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN MEDIA LIBRARY & UPLOADS =================

app.get('/api/admin/media', requireAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/media/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const stmt = db.prepare(`
      INSERT INTO media (filename, original_name, mime_type, size, url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      fileUrl,
      new Date().toISOString()
    );

    syncToPublic(db);

    res.json({
      success: true,
      id: result.lastInsertRowid,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/media/:id', requireAuth, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Media not found' });

    const filePath = path.join(UPLOADS_DIR, row.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Media removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= BACKUP & RESTORE =================

// Export Complete Backup (.json)
app.get('/api/admin/backup/export', requireAuth, (req, res) => {
  try {
    const site_content = db.prepare('SELECT * FROM site_content').all();
    const projects = db.prepare('SELECT * FROM projects').all();
    const services = db.prepare('SELECT * FROM services').all();
    const stats = db.prepare('SELECT * FROM stats').all();
    const contact_messages = db.prepare('SELECT * FROM contact_messages').all();
    const media = db.prepare('SELECT * FROM media').all();

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      site_content,
      projects,
      services,
      stats,
      contact_messages,
      media
    };

    const filename = `backup-abid-portfolio-${Date.now()}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restore from Backup JSON
app.post('/api/admin/backup/restore', requireAuth, (req, res) => {
  try {
    const { backup } = req.body;
    if (!backup || !backup.projects || !backup.site_content) {
      return res.status(400).json({ error: 'Invalid backup file structure' });
    }

    const restoreTransaction = db.transaction(() => {
      // Clear current content
      db.exec('DELETE FROM site_content');
      db.exec('DELETE FROM projects');
      db.exec('DELETE FROM services');
      db.exec('DELETE FROM stats');

      // Restore site_content
      const insertContent = db.prepare('INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, ?)');
      for (const c of backup.site_content) {
        insertContent.run(c.key, c.value, c.updated_at || new Date().toISOString());
      }

      // Restore projects
      const insertProject = db.prepare(`
        INSERT INTO projects (
          id, title, subtitle, category, category_label, image, description,
          client, year, role, challenge, solution, deliverables, colors, tags,
          featured, status, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of backup.projects) {
        insertProject.run(
          p.id, p.title, p.subtitle, p.category, p.category_label, p.image, p.description,
          p.client, p.year, p.role, p.challenge, p.solution, p.deliverables, p.colors, p.tags,
          p.featured, p.status, p.sort_order, p.created_at || new Date().toISOString(), p.updated_at || new Date().toISOString()
        );
      }

      // Restore services
      if (backup.services) {
        const insertService = db.prepare(`
          INSERT INTO services (id, title, short_desc, full_desc, icon_name, deliverables, timeline, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const s of backup.services) {
          insertService.run(s.id, s.title, s.short_desc, s.full_desc, s.icon_name, s.deliverables, s.timeline, s.sort_order);
        }
      }

      // Restore stats
      if (backup.stats) {
        const insertStat = db.prepare('INSERT INTO stats (label, value, detail, sort_order) VALUES (?, ?, ?, ?)');
        for (const st of backup.stats) {
          insertStat.run(st.label, st.value, st.detail, st.sort_order);
        }
      }
    });

    restoreTransaction();
    res.json({ success: true, message: 'Website content restored successfully from backup!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`[SERVER] Abid Nalakath Portfolio Local Backend running on http://localhost:${PORT}`);
  console.log(`[SERVER] Database: SQLite WAL mode at ${path.join(DATA_DIR, 'database.sqlite')}`);
  console.log(`[SERVER] Media Uploads: ${UPLOADS_DIR}`);
});
