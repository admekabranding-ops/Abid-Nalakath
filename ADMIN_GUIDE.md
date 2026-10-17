# ABID NALAKATH — LOCAL ADMIN PANEL GUIDE

Welcome to your standalone, local administration panel for the **Abid Nalakath — Creative Designer** portfolio.

This system runs **100% locally on your computer** without any external cloud subscriptions, third-party databases, or paid services.

---

## 1. Quick Access Links

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Public Portfolio** | [http://localhost:5173/](http://localhost:5173/) | Live website with exact editorial design and orange/white merged layout |
| **Admin Login** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Secure administrator sign-in page |
| **Admin Dashboard** | [http://localhost:5173/admin](http://localhost:5173/admin) | Full CMS dashboard (Hero, Projects, Services, Inquiries, Media, Backup) |
| **Visual Website Editor** | [http://localhost:5173/admin/editor](http://localhost:5173/admin/editor) | Full graphical Photoshop/Figma-style canvas design editor |

---

## 2. Administrator Credentials

- **Default Username:** `admin`
- **Default Password:** `admin123`

> [!IMPORTANT]
> **Change Your Password:**  
> Once logged in, go to **Settings & Security** in the sidebar. You can update both your username and password at any time.

---

## 3. How to Launch the Website & Admin Panel

Double-click the **`start-website.bat`** file in your project folder (`d:\WEB\ABID\start-website.bat`).

The script will automatically:
1. Start your local SQLite Express backend server on **port 3001** (minimized).
2. Start the Vite development frontend on **port 5173**.
3. Open your default web browser to [http://localhost:5173/](http://localhost:5173/).

---

## 4. Local Data Storage Architecture

All your website content, case studies, client inquiries, and uploaded images are saved permanently on your computer in the `data/` directory:

```
d:\WEB\ABID\
├── data\
│   ├── database.sqlite       <-- SQLite database (WAL mode enabled)
│   └── uploads\              <-- Uploaded portraits, project covers, and media files
├── server\
│   ├── db.js                 <-- Database schemas & auto-seeding engine
│   └── index.js              <-- Express REST API (port 3001)
├── src\                      <-- React + Tailwind + Framer Motion frontend
└── start-website.bat         <-- One-click application launcher
```

> [!TIP]
> **No Cloud Required:** Your computer is the primary server. Data persists across reboots and browser cache resets.

---

## 5. Admin Panel Features

### 🌟 Dashboard Overview
- Real-time counts of total projects, published projects, draft projects, and services.
- Real-time indicator of SQLite database health and connection status.
- Notification badge for new client inquiries submitted through the contact form.

### 🎨 Hero Section Editor
- **Left Orange Side:** Edit designer name, professional title, outlined pill badge, 4-line editorial heading, and white pill CTA button text.
- **Center Portrait:** Upload transparent cutout PNG portraits directly. Uploaded images are stored in `data/uploads/` and update on the live site immediately.
- **Right White Panel:** Edit greeting, short name, intro headline, and 3 clean supporting lines.
- **Floating Quote Card:** Edit avatar photo, designer name, title, and quote.
- **Quick Stat Cards:** Update the projects built and client support figures.

### 💼 Projects (CRUD + Draft/Published Toggle)
- **Add New Projects:** Fill in project title, subtitle, category, client, year, deliverables, tags, challenge, and solution.
- **Cover Image Upload:** Upload custom cover artwork directly from your computer.
- **Draft vs. Published:** Only projects marked as **Published** appear on the public website. Keep work-in-progress projects as **Draft**.
- **Reordering:** Use the Up/Down arrow buttons to change the order in which case studies appear on the portfolio.
- **Delete:** Permanent deletion with safety confirmation modal.

### 🛠️ Services & Specializations
- Create and edit bespoke design offerings.
- Set turnaround timelines (e.g. *2–3 Weeks*) and itemized deliverables.

### 💬 Client Inquiries Inbox
- Inquiries submitted through the public contact form are validated and written straight into SQLite.
- View sender name, email, project category, and project brief.
- Mark messages as read or delete inquiries after reviewing.

### 🖼️ Media Library
- Upload high-resolution images, logos, and mockups into `data/uploads/`.
- Preview uploaded assets and copy their permanent local URL with one click.

### 💾 Backup & Restore
- **One-Click Backup Export:** Download a complete JSON snapshot of your entire database (`site_content`, `projects`, `services`, `stats`, `messages`, `media`).
- **One-Click Restore:** Upload a previously saved `.json` backup file. The system will prompt you for confirmation before restoring to prevent accidental data loss.

---

## 6. Local Security & Architecture Notes

- Passwords are encrypted with **PBKDF2-SHA512** using unique random salts and 100,000 hashing iterations.
- Passwords and private API keys are never stored in plaintext and never leaked to frontend client scripts.
- Session authorization uses high-entropy 256-bit cryptographic tokens stored in local browser storage.
- This admin panel is built for **local, single-PC administration**. If you ever decide to deploy this website publicly on the internet in the future, ensure you configure HTTPS and strict rate-limiting.

---

## 7. Photoshop & Figma Style Visual Website Editor

Launch URL: [http://localhost:5173/admin/editor](http://localhost:5173/admin/editor)

Upgrade your portfolio design using a visual drag-and-drop workspace inspired by Adobe Photoshop, Figma, and Framer:

### 🎛️ Four Workspace Areas:
1. **Top Application Toolbar:**
   - **Viewport Modes:** Desktop (`1440px`), Tablet (`768px`), Mobile (`375px`).
   - **Canvas Zoom:** Zoom In, Zoom Out, or Reset to 100% (50% – 150% range).
   - **History Stack:** Full Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) with 50-step state history.
   - **Preview Mode:** Hide selection boxes and handles to inspect your clean live website.
   - **Layout Actions:** Save Draft, Publish Locally (applies to public site), Export Backup, Import Backup, and Reset to Template.

2. **Left Sidebar Panel:**
   - **Layers Tree:** Hierarchical list of every element grouped by section. Features element search, eye icon (hide/show), lock icon (prevent accidental drags), inline renaming, duplication, and reordering. Two-way synchronized with the canvas.
   - **Add Elements:** Component palette with pre-styled Headings, Paragraphs, White Pill CTA buttons, Obsidian Cards, Stat Badges, Glow Orbs, Dividers, and Images.
   - **Asset Manager:** Upload local pictures, browse previously uploaded files, and apply images directly to canvas elements with one click.
   - **Sections Jump:** Quick navigation to smoothly scroll the canvas to Hero, Stats, About, Projects, Services, Testimonials, or Contact sections.

3. **Center Interactive Canvas:**
   - **Click to Select:** High-visibility 1.5px orange selection bounding box displaying the element name and exact pixel dimensions (`W × H`).
   - **8 Resize Handles:** Corner (`nw`, `ne`, `se`, `sw`) and Edge (`n`, `e`, `s`, `w`) handles for direct resizing.
   - **Drag to Reposition:** Drag elements across the artboard with live transform offsets.
   - **Keyboard Nudging:** Move selected elements by `1px` using Arrow keys, or by `10px` holding `Shift + Arrow`.
   - **Inline Text Editing:** Double-click any headline, paragraph, or button to edit text directly on canvas.
   - **Delete:** Press `Delete` or `Backspace` to remove custom elements or hide core layout items.

4. **Right Properties Inspector Panel:**
   - **Design Tab:** Edit Width, Height, Offset X/Y, Opacity, Typography (font size, weight, letter spacing, alignment, color swatches), Backgrounds (solid colors + curated orange gradients), Borders & Radius, Shadow/Glow presets, and Padding/Margins.
   - **Content Tab:** Edit raw text strings, button links, image URLs, and author quotes.
   - **Adaptive Tab:** Toggle element visibility specifically for Desktop, Tablet, and Mobile viewports.

