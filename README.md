# Abid Nalakath — Creative Designer Portfolio & Visual Editor

A premium, editorial personal portfolio website and full-screen Photoshop/Figma-style visual website design editor built for **Abid Nalakath — Creative Designer**.

![Palette](https://img.shields.io/badge/Theme-Burnt_Orange_%26_White-F4510B?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_TypeScript_%7C_Vite_%7C_Tailwind-38BDF8?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-SQLite_(WAL_mode)-003B57?style=for-the-badge)
![Storage](https://img.shields.io/badge/Local_Storage-100%25_Offline-10B981?style=for-the-badge)

---

## 🌟 Overview

This project is a modern creative agency-style portfolio designed with editorial aesthetics, paired with an integrated **Local Administration CMS** and a **Photoshop/Figma-style Visual Canvas Editor**.

- **Exact Design Reference Match:** Signature warm orange gradient background on the left merged seamlessly with a clean white content panel on the right.
- **Overlapping Center Portrait:** Distinctive cutout portrait rising from the bottom with floating social pills across the boundary.
- **100% Local & Offline:** Powered by an embedded Node.js/Express API with SQLite in WAL mode and permanent local media uploads. Zero external cloud dependencies.

---

## 🚀 Quick Access URLs

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Public Portfolio** | [http://localhost:5173/](http://localhost:5173/) | Live website with exact editorial design and orange/white merged layout |
| **Visual Website Editor** | [http://localhost:5173/admin/editor](http://localhost:5173/admin/editor) | Full graphical canvas design workspace (Photoshop / Figma style) |
| **Admin Dashboard** | [http://localhost:5173/admin](http://localhost:5173/admin) | CMS management (Hero, Projects, Services, Inquiries, Media, Backups) |
| **Admin Login** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Administrator sign-in |

### 🔑 Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

---

## 🎨 Visual Website Editor Features

Inspired by Adobe Photoshop, Figma, and Framer, the visual editor allows editing the live website directly on an interactive canvas:

1. **Center Canvas Direct Manipulation:**
   - **Click to Select:** Displays an orange bounding box with live dimensions (`W × H`).
   - **8 Resize Handles:** Corner (`nw`, `ne`, `se`, `sw`) and Edge (`n`, `e`, `s`, `w`) handles for scaling elements.
   - **Drag to Reposition:** Move elements across the canvas with real-time translation offsets.
   - **Keyboard Nudges:** `1px` movement via arrow keys; `10px` movement with `Shift + Arrow`.
   - **Inline Text Editing:** Double-click headlines, paragraphs, or buttons to edit text directly on canvas.
   - **Drag & Drop Assets:** Drag logos and photos directly from the Assets panel into any section or drop them over existing images to replace them.

2. **Top Application Toolbar:**
   - Viewport Switcher: **Desktop** (`1440px`), **Tablet** (`768px`), **Mobile** (`375px`).
   - Zoom Controls: `50%` to `150%` with one-click reset to `100%`.
   - 50-step Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) history stack.
   - Preview Mode & Alignment Grid.
   - Save Draft, Publish Locally (applies live), Export/Import JSON backup, Reset to Template.

3. **Left Sidebar Workspace:**
   - **Layers Tree:** Hierarchical element tree with search, hide/show, lock/unlock, duplication, and reordering.
   - **Add Elements:** Component palette for Headlines, Paragraphs, Pill CTA Buttons, Obsidian Cards, Badges, and Glow Orbs.
   - **Asset Manager:** Local image library with one-click apply and direct canvas drag-and-drop.
   - **Sections Jump:** Smoothly scrolls the canvas to any target section.

4. **Right Properties Inspector Panel:**
   - Transform dimensions (`W`, `H`) and position offsets (`X`, `Y`).
   - Typography controls (font family, size, weight, letter spacing, alignment, color swatches).
   - Solid fills & curated warm orange gradient presets.
   - Border radius, border widths, shadows, and spacing.
   - Responsive visibility per viewport.

---

## 🛠️ How to Run Locally

### Option 1: One-Click Startup (Windows)
Double-click [`start-website.bat`](start-website.bat) in the project directory.

### Option 2: Manual Terminal Startup
```bash
# Terminal 1: Start Backend API & SQLite Database
node server/index.js

# Terminal 2: Start Vite Dev Server
npm run dev
```

Visit [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 📁 Project Architecture

```
d:\WEB\ABID\
├── data\
│   ├── database.sqlite       # Local SQLite database (WAL mode)
│   └── uploads\              # Permanent local media uploads
├── server\
│   ├── db.js                 # SQLite database schema, seeding, and PBKDF2 hashing
│   └── index.js              # Express REST API (port 3001)
├── src\
│   ├── components\           # Public website sections (Hero, About, Projects, etc.)
│   ├── pages\
│   │   ├── PublicPortfolio.tsx # Live portfolio with visual layout overrides
│   │   └── admin\
│   │       ├── AdminDashboard.tsx # CMS dashboard
│   │       ├── AdminLogin.tsx     # Secure administrator login
│   │       ├── editor\            # Visual Editor components (Canvas, Toolbar, Layers, Inspector)
│   │       └── tabs\              # CMS tab modules (Hero, Projects, Services, Backup, etc.)
├── ADMIN_GUIDE.md            # Detailed administration & editor user guide
├── start-website.bat         # One-click Windows startup script
└── package.json
```

---

## 📄 License & Credits
Built for **Abid Nalakath — Creative Designer**.  
All design assets, layout compositions, and branding materials reserved.
