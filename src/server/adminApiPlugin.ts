import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  width?: number;
  height?: number;
  uploadDate: string;
  category: string;
}

export function adminApiPlugin(): Plugin {
  const rootDir = process.cwd();
  const dataDir = path.join(rootDir, 'data');
  const versionsDir = path.join(dataDir, 'versions');
  const uploadsDir = path.join(rootDir, 'public', 'uploads');
  const draftFile = path.join(dataDir, 'draftContent.json');
  const publishedFile = path.join(dataDir, 'publishedContent.json');
  const mediaFile = path.join(dataDir, 'mediaLibrary.json');
  const authFile = path.join(dataDir, 'adminAuth.json');

  // Ensure directories exist
  [dataDir, versionsDir, uploadsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Helper to hash password
  function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
  }

  // Initialize admin auth file if not present
  if (!fs.existsSync(authFile)) {
    const defaultSalt = crypto.randomBytes(16).toString('hex');
    const defaultHash = hashPassword('AbidAdmin@2026', defaultSalt);
    fs.writeFileSync(
      authFile,
      JSON.stringify(
        {
          email: 'admin@abidnalakath.com',
          salt: defaultSalt,
          passwordHash: defaultHash,
          lastPasswordChange: new Date().toISOString(),
        },
        null,
        2
      )
    );
  }

  // Helper to parse JSON body
  function readJsonBody(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  }

  return {
    name: 'vite-admin-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Only handle /api/admin/* endpoints
        if (!url.startsWith('/api/admin/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        try {
          // 1. Auth: Login
          if (url === '/api/admin/login' && req.method === 'POST') {
            const { email, password } = await readJsonBody(req);
            if (!fs.existsSync(authFile)) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Auth config missing' }));
              return;
            }
            const authData = JSON.parse(fs.readFileSync(authFile, 'utf8'));

            const givenHash = hashPassword(password || '', authData.salt);
            if (email?.toLowerCase() === authData.email.toLowerCase() && givenHash === authData.passwordHash) {
              const token = crypto.randomBytes(32).toString('hex');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  token,
                  user: { email: authData.email, role: 'admin' },
                })
              );
            } else {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Invalid email or password' }));
            }
            return;
          }

          // 2. Auth: Change Password
          if (url === '/api/admin/change-password' && req.method === 'POST') {
            const { currentPassword, newPassword, newEmail } = await readJsonBody(req);
            const authData = JSON.parse(fs.readFileSync(authFile, 'utf8'));
            const currentHash = hashPassword(currentPassword || '', authData.salt);

            if (currentHash !== authData.passwordHash) {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Current password is incorrect' }));
              return;
            }

            if (!newPassword || newPassword.length < 6) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'New password must be at least 6 characters' }));
              return;
            }

            const newSalt = crypto.randomBytes(16).toString('hex');
            const newHash = hashPassword(newPassword, newSalt);
            authData.salt = newSalt;
            authData.passwordHash = newHash;
            if (newEmail) authData.email = newEmail;
            authData.lastPasswordChange = new Date().toISOString();

            fs.writeFileSync(authFile, JSON.stringify(authData, null, 2));
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Password updated successfully' }));
            return;
          }

          // 3. Content: GET all (draft, published, meta)
          if (url === '/api/admin/content' && req.method === 'GET') {
            const draft = fs.existsSync(draftFile) ? JSON.parse(fs.readFileSync(draftFile, 'utf8')) : null;
            const published = fs.existsSync(publishedFile) ? JSON.parse(fs.readFileSync(publishedFile, 'utf8')) : null;
            
            // List versions
            const versionFiles = fs.existsSync(versionsDir) ? fs.readdirSync(versionsDir) : [];
            const versions = versionFiles
              .filter(f => f.endsWith('.json'))
              .sort()
              .reverse()
              .slice(0, 10)
              .map(f => ({
                id: f.replace('.json', ''),
                timestamp: f.replace('.json', '').replace(/-/g, ':'),
                filename: f
              }));

            res.statusCode = 200;
            res.end(JSON.stringify({ draft, published, versions }));
            return;
          }

          // 4. Content: Save Draft
          if (url === '/api/admin/save-draft' && req.method === 'POST') {
            const { content } = await readJsonBody(req);
            if (!content) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No content payload provided' }));
              return;
            }

            const payload = {
              content,
              lastSaved: new Date().toISOString(),
              version: Date.now(),
            };

            fs.writeFileSync(draftFile, JSON.stringify(payload, null, 2));
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, lastSaved: payload.lastSaved }));
            return;
          }

          // 5. Content: Publish
          if (url === '/api/admin/publish' && req.method === 'POST') {
            const { content } = await readJsonBody(req);
            if (!content) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'No content payload provided' }));
              return;
            }

            const timestamp = new Date().toISOString();
            const safeName = timestamp.replace(/:/g, '-');

            // Snapshot existing published file as version history
            if (fs.existsSync(publishedFile)) {
              const oldPub = fs.readFileSync(publishedFile, 'utf8');
              fs.writeFileSync(path.join(versionsDir, `${safeName}.json`), oldPub);
            }

            const payload = {
              content,
              publishedAt: timestamp,
              version: Date.now(),
            };

            fs.writeFileSync(publishedFile, JSON.stringify(payload, null, 2));
            // Also align draft file with published content
            fs.writeFileSync(draftFile, JSON.stringify({ content, lastSaved: timestamp }, null, 2));

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, publishedAt: timestamp }));
            return;
          }

          // 6. Content: Rollback
          if (url === '/api/admin/rollback' && req.method === 'POST') {
            const { versionId } = await readJsonBody(req);
            const targetVersionFile = path.join(versionsDir, `${versionId}.json`);

            if (!fs.existsSync(targetVersionFile)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Version not found' }));
              return;
            }

            const versionData = JSON.parse(fs.readFileSync(targetVersionFile, 'utf8'));
            fs.writeFileSync(publishedFile, JSON.stringify(versionData, null, 2));
            fs.writeFileSync(draftFile, JSON.stringify({ content: versionData.content, lastSaved: new Date().toISOString() }, null, 2));

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, restoredContent: versionData.content }));
            return;
          }

          // 7. Media: GET list
          if (url === '/api/admin/media' && req.method === 'GET') {
            let library: MediaAsset[] = [];
            if (fs.existsSync(mediaFile)) {
              library = JSON.parse(fs.readFileSync(mediaFile, 'utf8'));
            }

            // Sync with actual files in public/uploads and public/images
            const actualUploads = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir).map(f => ({ name: f, dir: uploadsDir, prefix: '/uploads/' })) : [];
            const imagesDir = path.join(rootDir, 'public', 'images');
            const actualImages = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).map(f => ({ name: f, dir: imagesDir, prefix: '/images/' })) : [];
            const allFiles = [...actualUploads, ...actualImages];
            const existingUrls = new Set(library.map(m => m.url));

            for (const file of allFiles) {
              const fileUrl = `${file.prefix}${file.name}`;
              if (!existingUrls.has(fileUrl)) {
                const stat = fs.statSync(path.join(file.dir, file.name));
                const ext = path.extname(file.name).toLowerCase();
                let category = 'General Media';
                if (file.name.toLowerCase().includes('hero') || file.name.toLowerCase().includes('portrait')) category = 'Hero Images';
                else if (file.name.toLowerCase().includes('brand') || file.name.toLowerCase().includes('jacket')) category = 'Branding';
                else if (file.name.toLowerCase().includes('video')) category = 'AI Videos';
                else if (file.name.toLowerCase().includes('app') || file.name.toLowerCase().includes('headphone')) category = 'Website Assets';
                else if (file.name.toLowerCase().includes('bottle') || file.name.toLowerCase().includes('editorial')) category = 'Portfolio';

                library.unshift({
                  id: 'med_' + crypto.randomBytes(6).toString('hex'),
                  filename: file.name,
                  url: fileUrl,
                  fileType: ext.replace('.', '').toUpperCase(),
                  fileSize: stat.size,
                  uploadDate: stat.mtime.toISOString(),
                  category,
                });
              }
            }

            fs.writeFileSync(mediaFile, JSON.stringify(library, null, 2));
            res.statusCode = 200;
            res.end(JSON.stringify({ media: library }));
            return;
          }

          // 8. Media: Upload
          if (url === '/api/admin/upload' && req.method === 'POST') {
            const { filename, base64Data, category = 'General Media' } = await readJsonBody(req);
            if (!filename || !base64Data) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Filename and base64Data are required' }));
              return;
            }

            // Strip metadata prefix like "data:image/png;base64,"
            const match = base64Data.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
            const rawBase64 = match ? match[2] : base64Data;
            const mimeType = match ? match[1] : 'image/jpeg';
            const buffer = Buffer.from(rawBase64, 'base64');

            // Sanitize filename
            const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
            const ext = path.extname(cleanName) || '.jpg';
            const base = path.basename(cleanName, ext);
            const finalName = `${base}_${Date.now().toString(36)}${ext}`;
            const targetPath = path.join(uploadsDir, finalName);

            fs.writeFileSync(targetPath, buffer);

            const newAsset: MediaAsset = {
              id: 'med_' + crypto.randomBytes(6).toString('hex'),
              filename: finalName,
              url: `/uploads/${finalName}`,
              fileType: ext.replace('.', '').toUpperCase() || mimeType,
              fileSize: buffer.length,
              uploadDate: new Date().toISOString(),
              category,
            };

            let library: MediaAsset[] = [];
            if (fs.existsSync(mediaFile)) {
              library = JSON.parse(fs.readFileSync(mediaFile, 'utf8'));
            }
            library.unshift(newAsset);
            fs.writeFileSync(mediaFile, JSON.stringify(library, null, 2));

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, asset: newAsset }));
            return;
          }

          // 9. Media: Delete
          if (url.startsWith('/api/admin/media') && req.method === 'DELETE') {
            const { id, filename } = await readJsonBody(req);
            let library: MediaAsset[] = [];
            if (fs.existsSync(mediaFile)) {
              library = JSON.parse(fs.readFileSync(mediaFile, 'utf8'));
            }

            const targetAsset = library.find(m => m.id === id || m.filename === filename);
            if (targetAsset) {
              const filePath = path.join(uploadsDir, targetAsset.filename);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
              library = library.filter(m => m.id !== targetAsset.id);
              fs.writeFileSync(mediaFile, JSON.stringify(library, null, 2));
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (err: any) {
          console.error('[AdminAPI Plugin Error]', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Server error' }));
        }
      });
    },
  };
}
