import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

[DATA_DIR, UPLOADS_DIR, BACKUPS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Password security helpers
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const newHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(newHash, 'hex'));
}

// Initialize tables
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      category_label TEXT,
      image TEXT NOT NULL,
      description TEXT,
      client TEXT,
      year TEXT,
      role TEXT,
      challenge TEXT,
      solution TEXT,
      deliverables TEXT,
      colors TEXT,
      tags TEXT,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      short_desc TEXT,
      full_desc TEXT,
      icon_name TEXT,
      deliverables TEXT,
      timeline TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      detail TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_type TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_read INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default admin if none exists
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get().count;
  if (adminCount === 0) {
    const { hash, salt } = hashPassword('admin123');
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, salt, created_at)
      VALUES (?, ?, ?, ?)
    `).run('admin', hash, salt, new Date().toISOString());
    console.log('[DB] Created default admin account: admin / admin123');
  }

  // Seed default site content if empty
  const contentCount = db.prepare('SELECT COUNT(*) as count FROM site_content').get().count;
  if (contentCount === 0) {
    const defaultHero = {
      name: "Abid Nalakath",
      title: "Creative Designer",
      subtitle: "Creative Designer • Digital Artist",
      heroHeadingLines: [
        "Creative",
        "Designs",
        "That Make",
        "Brands Stand Out."
      ],
      heroImage: "/assets/abid-hero.png",
      ctaText: "View My Work",
      ctaLink: "#projects",
      availableStatus: "Available for Projects",
      introGreeting: "Hi, I'm",
      introName: "Abid",
      introStatement: "I build modern, bold visuals for brands, businesses & creators.",
      introLines: [
        "Clean design.",
        "Smooth animations.",
        "Distinctive branding."
      ],
      quoteCard: {
        avatar: "/assets/abid-avatar.jpg",
        name: "Abid",
        role: "Creative Designer",
        quote: "“I create premium designs that look clean and convert.”"
      }
    };

    const defaultAbout = {
      heading: "Design With Purpose.",
      highlight: "Purpose.",
      story: "I’m Abid Nalakath, a creative designer passionate about transforming bold ideas into clear, engaging and visually distinctive experiences. With a deep respect for minimalism, deliberate typography, and high-energy color systems, I help companies build timeless visual authority.",
      philosophyTitle: "Where Strategy Meets Pure Visual Artistry",
      philosophyDesc: "Great design is never just decoration. It is visual problem solving that bridges emotion and business outcomes. Every color gradient, kerning choice, and spatial composition is engineered to provoke curiosity, communicate trust, and solidify brand recognition.",
      focus: "Identity & High-Impact Campaigns",
      philosophyText: "Obsessive Simplicity & Raw Energy",
      experienceYears: "6+ Years Crafting Global Brand Narratives",
      processSteps: [
        {
          step: "01",
          title: "Discovery & Strategy",
          desc: "Deep dive into your brand mission, target demographic, competitive space, and core creative ambitions to formulate a bulletproof design brief."
        },
        {
          step: "02",
          title: "Visual Direction & Moodboard",
          desc: "Exploration of visual territories, color palettes, typographic pairings, and atmospheric textures to align on the perfect aesthetic direction."
        },
        {
          step: "03",
          title: "High-Fidelity Craft",
          desc: "Detailed execution of logos, marketing assets, and design systems with obsessive attention to proportion, contrast, and visual rhythm."
        },
        {
          step: "04",
          title: "Delivery & Guidelines",
          desc: "Providing organized production files in all modern formats along with crystal-clear brand documentation so your team can deploy with total confidence."
        }
      ],
      skills: [
        { name: "Brand Identity", level: 98 },
        { name: "Visual Art Direction", level: 96 },
        { name: "Editorial Typography", level: 95 },
        { name: "Packaging Design", level: 92 },
        { name: "Social Media Campaigns", level: 96 },
        { name: "3D & Digital Graphics", level: 90 }
      ],
      tools: [
        { name: "Adobe Illustrator", category: "Vector & Logos" },
        { name: "Adobe Photoshop", category: "Retouching & Key Art" },
        { name: "Figma", category: "UI & Layout Systems" },
        { name: "Adobe InDesign", category: "Editorial & Print" },
        { name: "Adobe After Effects", category: "Motion Graphics" },
        { name: "Blender / C4D", category: "3D Visuals" }
      ]
    };

    const defaultContact = {
      email: "hello@abidnalakath.design",
      phone: "+91 98765 43210",
      location: "Kerala, India • Available Worldwide",
      responseTime: "Within 24 Hours",
      statusText: "Taking Q1 / Q2 Projects",
      socials: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        dribbble: "https://dribbble.com",
        behance: "https://behance.net"
      }
    };

    const now = new Date().toISOString();
    const insertContent = db.prepare('INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, ?)');
    insertContent.run('hero', JSON.stringify(defaultHero), now);
    insertContent.run('about', JSON.stringify(defaultAbout), now);
    insertContent.run('contact', JSON.stringify(defaultContact), now);
    console.log('[DB] Seeded default site_content');
  }

  // Seed projects if empty
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectCount === 0) {
    const defaultProjects = [
      {
        id: "aura-botanicals",
        title: "Aura Botanicals",
        subtitle: "Organic Luxury Skincare & Fragrance Packaging",
        category: "Branding",
        category_label: "Brand Identity + Packaging",
        image: "/assets/projects/project-1.jpg",
        client: "Aura Botanicals Lab",
        year: "2025",
        role: "Lead Creative Designer",
        challenge: "Develop an earthy yet ultra-luxurious brand identity and sustainable packaging system for an organic botanical skincare line entering global retail.",
        solution: "Crafted a bespoke serif monogram paired with warm earthen tones (#C63D08, #FF9D00) and tactile packaging textures that communicate purity and prestige.",
        deliverables: JSON.stringify(["Brand Identity System", "Custom Typography & Monogram", "Packaging & Label Mockups", "Print Production Guides", "Digital Brand Guidelines"]),
        colors: JSON.stringify(["#16120F", "#3B1E12", "#C63D08", "#FF9D00", "#FAF8F5"]),
        tags: JSON.stringify(["Brand Identity", "Luxury Packaging", "Art Direction", "Print Production"]),
        description: "Comprehensive visual identity and packaging architecture for Aura Botanicals, emphasizing organic sustainability through modern minimalist typography and warm amber accents.",
        featured: 1,
        status: "published",
        sort_order: 1
      },
      {
        id: "nova-sound-festival",
        title: "Nova Sound Festival",
        subtitle: "High-Energy Music & Arts Festival Campaign",
        category: "Posters",
        category_label: "Advertising + Poster Design",
        image: "/assets/projects/project-2.jpg",
        client: "Nova Entertainment Co.",
        year: "2025",
        role: "Visual Designer & Art Director",
        challenge: "Produce an electric, dynamic poster and billboard visual system that captures the sonic pulse of an international music festival.",
        solution: "Used rhythmic geometric soundwave patterns, intense fluorescent-orange chromatic contrast, and bold kinetic type layouts across physical and digital billboards.",
        deliverables: JSON.stringify(["Festival Key Visuals", "Transit Billboards (OOH)", "Merchandise Design", "Motion Poster Animation", "Social Media Rollout Assets"]),
        colors: JSON.stringify(["#0C0714", "#261138", "#F4510B", "#FF6B00", "#FFFFFF"]),
        tags: JSON.stringify(["Poster Design", "Advertising", "Typography", "Motion Graphics"]),
        description: "A high-octane advertising and poster design campaign featuring kinetic typography, vivid neon gradients, and layered soundwave motifs for Nova Sound.",
        featured: 1,
        status: "published",
        sort_order: 2
      },
      {
        id: "kroma-creative-suite",
        title: "Kroma Creative Suite",
        subtitle: "Multi-Platform Social Media Campaign",
        category: "Social Media",
        category_label: "Social Media Campaign",
        image: "/assets/projects/project-3.jpg",
        client: "Kroma Tech Interactive",
        year: "2024",
        role: "Creative Campaign Lead",
        challenge: "Create a cohesive, viral social media campaign for the launch of a new AI-powered design assistant for creative professionals.",
        solution: "Engineered high-converting Instagram carousels, animated reels templates, and punchy promotional stories with crisp 3D geometric accents.",
        deliverables: JSON.stringify(["30+ Social Feed Templates", "Animated Reels & Story System", "Interactive Ad Visuals", "Design Asset Kit", "Social Brand Book"]),
        colors: JSON.stringify(["#0B0D18", "#112038", "#FF9D00", "#F4510B", "#F7F6F4"]),
        tags: JSON.stringify(["Social Media", "Digital Marketing", "Content Strategy", "Creative Ads"]),
        description: "Dynamic social media graphics and advertising templates that drove 340% increase in app store pre-registrations for Kroma Creative Suite.",
        featured: 1,
        status: "published",
        sort_order: 3
      },
      {
        id: "solstice-kinetic-studio",
        title: "Solstice Kinetic Studio",
        subtitle: "Abstract 3D Visual Art & Brand Identity",
        category: "Digital Art",
        category_label: "Creative Artwork + 3D Visuals",
        image: "/assets/projects/project-4.jpg",
        client: "Solstice Architecture & Design",
        year: "2024",
        role: "Visual Concept Artist",
        challenge: "Develop an avant-garde visual language for an architecture and kinetic installation studio.",
        solution: "Combined tactile 3D orb compositions, metallic orange sheen, and mathematical grid overlays to reflect physical craftsmanship and spatial innovation.",
        deliverables: JSON.stringify(["Visual Key Artworks", "Spatial Monogram", "Exhibition Catalogue", "Web Visual Assets", "Architectural Signage"]),
        colors: JSON.stringify(["#1A0C08", "#4A1A0C", "#F4510B", "#FFA500", "#FFFFFF"]),
        tags: JSON.stringify(["3D Artwork", "Visual Identity", "Generative Art", "Exhibition"]),
        description: "An evocative visual identity featuring custom 3D fluid sculptures and mathematical geometry tailored for Solstice Kinetic Studio.",
        featured: 0,
        status: "published",
        sort_order: 4
      },
      {
        id: "vortex-motion-lab",
        title: "Vortex Motion Lab",
        subtitle: "Digital Marketing Visuals & Brand System",
        category: "Branding",
        category_label: "Digital Marketing Visuals",
        image: "/assets/projects/project-5.jpg",
        client: "Vortex Studio",
        year: "2024",
        role: "Senior Visual Designer",
        challenge: "Rebrand a high-end visual effects and animation agency for global enterprise clients.",
        solution: "Designed a dark-mode editorial identity highlighted with burnt orange accents, sharp typographic rhythm, and fluid organic shapes.",
        deliverables: JSON.stringify(["Full Brand System", "Sales Deck & Pitch Decks", "Web Visual Design", "Digital Marketing Banners", "Merch Collection"]),
        colors: JSON.stringify(["#0A0A0E", "#201322", "#C63D08", "#FF8400", "#E8E8E8"]),
        tags: JSON.stringify(["Brand System", "Digital Marketing", "Visual Identity", "Art Direction"]),
        description: "A dark-mode brand identity system created for Vortex Motion Lab with high-impact editorial layouts and luminous orange visual markers.",
        featured: 0,
        status: "published",
        sort_order: 5
      },
      {
        id: "elysian-luxe-collective",
        title: "Elysian Luxe Collective",
        subtitle: "Promotional Creatives & Premium Unboxing",
        category: "Packaging",
        category_label: "Promotional + Packaging System",
        image: "/assets/projects/project-6.jpg",
        client: "Elysian Lifestyle Group",
        year: "2023",
        role: "Packaging & Creative Designer",
        challenge: "Establish a luxury visual identity and unboxing experience for an artisan specialty coffee and lifestyle brand.",
        solution: "Structured gold-embossed typography, custom seal monograms, and warm earthy tones that celebrate heritage craftsmanship.",
        deliverables: JSON.stringify(["Custom Monogram Seal", "Coffee Bag Packaging", "Promotional Gift Boxes", "Direct-to-Consumer Cards", "Retail POS Collateral"]),
        colors: JSON.stringify(["#140E0A", "#33160D", "#FF9D00", "#F4510B", "#FAF7F2"]),
        tags: JSON.stringify(["Packaging Design", "Promotional Creatives", "Luxury", "Print Production"]),
        description: "Bespoke unboxing packaging and promotional creatives for Elysian Luxe, winning accolades for sustainable luxury presentation.",
        featured: 1,
        status: "published",
        sort_order: 6
      }
    ];

    const now = new Date().toISOString();
    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, title, subtitle, category, category_label, image, description,
        client, year, role, challenge, solution, deliverables, colors, tags,
        featured, status, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of defaultProjects) {
      insertProject.run(
        p.id, p.title, p.subtitle, p.category, p.category_label, p.image, p.description,
        p.client, p.year, p.role, p.challenge, p.solution, p.deliverables, p.colors, p.tags,
        p.featured, p.status, p.sort_order, now, now
      );
    }
    console.log('[DB] Seeded default projects');
  }

  // Seed services if empty
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (serviceCount === 0) {
    const defaultServices = [
      {
        id: "brand-identity",
        title: "Brand Identity & Logo Design",
        short_desc: "Distinctive visual identities, logo marks, color systems, and comprehensive brand guidelines that make your company unforgettable.",
        full_desc: "I create timeless visual identity systems that capture your brand's unique soul and values. From bespoke logotypes and responsive brand marks to curated color harmony and typography hierarchy, your brand will stand out in any competitive landscape.",
        icon_name: "Palette",
        deliverables: JSON.stringify([
          "Primary & Secondary Logo Marks",
          "Comprehensive Brand Guidelines",
          "Typography & Color System",
          "Brand Collateral (Stationery, Decks)",
          "Vector Source Files (AI, SVG, PDF, PNG)"
        ]),
        timeline: "2 - 3 Weeks",
        sort_order: 1
      },
      {
        id: "social-media-design",
        title: "Social Media Design",
        short_desc: "Scroll-stopping social templates, carousel storytelling, and campaign visuals that grow engagement and build loyal communities.",
        full_desc: "Transform your social channels with cohesive, aesthetically commanding design systems. I design tailored Instagram, LinkedIn, and YouTube creative systems that elevate perceived brand value and maximize engagement.",
        icon_name: "Share2",
        deliverables: JSON.stringify([
          "Curated Feed & Carousel Templates",
          "Animated Story & Reel Cover Kits",
          "Platform-Optimized Formats",
          "Figma / Photoshop Master Templates",
          "Visual Content Style Guide"
        ]),
        timeline: "1 - 2 Weeks",
        sort_order: 2
      },
      {
        id: "advertising-promotional",
        title: "Advertising & Promotional Creatives",
        short_desc: "High-impact advertising posters, billboards, digital display ads, and promotional banners with clear visual hierarchy.",
        full_desc: "Whether launching a flagship product or promoting a major festival, I craft high-converting print and digital advertising campaigns that demand attention and drive decisive action.",
        icon_name: "Megaphone",
        deliverables: JSON.stringify([
          "Print Billboards & Poster Series",
          "Digital Display Ads & Google Banners",
          "Event & Festival Key Visuals",
          "Retargeting Ad Creative Sets",
          "High-Res Print-Ready Production Files"
        ]),
        timeline: "1 - 2 Weeks",
        sort_order: 3
      },
      {
        id: "marketing-visuals",
        title: "Marketing Campaign Visuals",
        short_desc: "End-to-end campaign visual direction, pitch deck design, infographic storytelling, and launch collateral.",
        full_desc: "Cohesive multi-touchpoint marketing design for product launches, seasonal campaigns, and brand expansions. I ensure every customer touchpoint resonates with unified artistic direction.",
        icon_name: "TrendingUp",
        deliverables: JSON.stringify([
          "Campaign Concept & Moodboards",
          "High-Stakes Pitch Decks & Keynotes",
          "Landing Page Art Direction & Graphics",
          "Email Marketing Visual Templates",
          "Digital Marketing Collateral"
        ]),
        timeline: "2 - 3 Weeks",
        sort_order: 4
      },
      {
        id: "digital-creative-design",
        title: "Digital Creative Design",
        short_desc: "Modern UI art direction, 3D abstract compositions, custom graphics, and responsive web visual assets.",
        full_desc: "Bringing digital experiences to life with bespoke 3D motifs, crisp vector iconography, and cutting-edge editorial layouts that elevate digital products from functional to extraordinary.",
        icon_name: "Layout",
        deliverables: JSON.stringify([
          "Website Hero Visuals & Concepts",
          "Custom 3D / Vector Illustrations",
          "Interactive UI Component Styling",
          "App Store Showcase Graphics",
          "Exported Web-Ready SVG & WebP Assets"
        ]),
        timeline: "2 - 4 Weeks",
        sort_order: 5
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (id, title, short_desc, full_desc, icon_name, deliverables, timeline, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of defaultServices) {
      insertService.run(s.id, s.title, s.short_desc, s.full_desc, s.icon_name, s.deliverables, s.timeline, s.sort_order);
    }
    console.log('[DB] Seeded default services');
  }

  // Seed stats if empty
  const statCount = db.prepare('SELECT COUNT(*) as count FROM stats').get().count;
  if (statCount === 0) {
    const defaultStats = [
      { label: "Projects Built", value: "100+", detail: "Completed with precision", sort_order: 1 },
      { label: "Client Support", value: "24/7", detail: "Dedicated creative output", sort_order: 2 },
      { label: "Years Experience", value: "6+", detail: "Industry experience", sort_order: 3 },
      { label: "Satisfied Clients", value: "40+", detail: "Global collaborations", sort_order: 4 }
    ];

    const insertStat = db.prepare('INSERT INTO stats (label, value, detail, sort_order) VALUES (?, ?, ?, ?)');
    for (const st of defaultStats) {
      insertStat.run(st.label, st.value, st.detail, st.sort_order);
    }
    console.log('[DB] Seeded default stats');
  }
}
