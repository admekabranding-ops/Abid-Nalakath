import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DATA_DIR = path.join(ROOT, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PUBLIC_UPLOADS = path.join(PUBLIC_DIR, 'uploads');
const PUBLIC_ASSETS = path.join(PUBLIC_DIR, 'assets');

export function syncToPublic(db) {
  try {
    [PUBLIC_DIR, PUBLIC_UPLOADS, PUBLIC_ASSETS].forEach((d) => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    // 1. Export content & visual layout
    const contentRows = db.prepare('SELECT key, value FROM site_content').all();
    const contentObj = {};
    let visualLayout = null;

    for (const row of contentRows) {
      let val;
      try {
        val = JSON.parse(row.value);
      } catch {
        val = row.value;
      }

      if (row.key === 'visual_layout_published') {
        visualLayout = val;
      } else if (row.key === 'visual_layout' && !visualLayout) {
        visualLayout = val;
      } else if (!row.key.startsWith('visual_layout')) {
        contentObj[row.key] = val;
      }
    }

    if (visualLayout) {
      fs.writeFileSync(
        path.join(PUBLIC_DIR, 'visual-layout.json'),
        JSON.stringify(visualLayout, null, 2),
        'utf-8'
      );
    }

    fs.writeFileSync(
      path.join(PUBLIC_DIR, 'content.json'),
      JSON.stringify(contentObj, null, 2),
      'utf-8'
    );

    // 2. Export projects
    try {
      const projects = db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY sort_order ASC, created_at DESC').all('published');
      const mappedProjects = projects.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        categoryLabel: p.category_label || p.category,
        image: p.image,
        client: p.client,
        year: p.year,
        role: p.role,
        challenge: p.challenge,
        solution: p.solution,
        deliverables: p.deliverables ? JSON.parse(p.deliverables) : [],
        colors: p.colors ? JSON.parse(p.colors) : [],
        tags: p.tags ? JSON.parse(p.tags) : [],
        description: p.description,
        gallery: p.gallery ? JSON.parse(p.gallery) : [],
        featured: Boolean(p.featured),
      }));
      fs.writeFileSync(
        path.join(PUBLIC_DIR, 'projects.json'),
        JSON.stringify(mappedProjects, null, 2),
        'utf-8'
      );
    } catch {}

    // 3. Export services
    try {
      const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all();
      const mappedServices = services.map(s => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        features: s.features ? JSON.parse(s.features) : [],
        deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
        icon: s.icon,
        startingPrice: s.starting_price,
        timeline: s.timeline,
      }));
      fs.writeFileSync(
        path.join(PUBLIC_DIR, 'services.json'),
        JSON.stringify(mappedServices, null, 2),
        'utf-8'
      );
    } catch {}

    // 4. Export stats
    try {
      const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
      fs.writeFileSync(
        path.join(PUBLIC_DIR, 'stats.json'),
        JSON.stringify(stats, null, 2),
        'utf-8'
      );
    } catch {}

    // 5. Copy uploaded files
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const f of files) {
        const src = path.join(UPLOADS_DIR, f);
        const dest = path.join(PUBLIC_UPLOADS, f);
        try {
          fs.copyFileSync(src, dest);
          if (f.startsWith('Relaxed-Office-Portrait')) {
            fs.copyFileSync(src, path.join(PUBLIC_ASSETS, 'abid-hero.png'));
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('Error syncing to public:', err);
  }
}
