import sharp from "sharp";
import fs from "fs";
import path from "path";

const projectsDir = path.resolve("public/assets/projects");
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

const projects = [
  {
    filename: "project-1.jpg",
    title: "Aura Botanicals",
    category: "Brand Identity + Packaging",
    bgGradient: ["#16120F", "#3B1E12", "#C63D08"],
    accent: "#FF9D00",
    motif: "botanical",
  },
  {
    filename: "project-2.jpg",
    title: "Nova Sound Festival",
    category: "Advertising + Poster Design",
    bgGradient: ["#0C0714", "#261138", "#F4510B"],
    accent: "#FF6B00",
    motif: "soundwave",
  },
  {
    filename: "project-3.jpg",
    title: "Kroma Creative Suite",
    category: "Social Media Campaign",
    bgGradient: ["#0B0D18", "#112038", "#FF9D00"],
    accent: "#F4510B",
    motif: "kinetic",
  },
  {
    filename: "project-4.jpg",
    title: "Solstice Kinetic Studio",
    category: "Creative Artwork + 3D Visuals",
    bgGradient: ["#1A0C08", "#4A1A0C", "#F4510B"],
    accent: "#FFA500",
    motif: "sphere",
  },
  {
    filename: "project-5.jpg",
    title: "Vortex Motion Lab",
    category: "Digital Marketing Visuals",
    bgGradient: ["#0A0A0E", "#201322", "#C63D08"],
    accent: "#FF8400",
    motif: "abstract",
  },
  {
    filename: "project-6.jpg",
    title: "Elysian Luxe Collective",
    category: "Promotional + Packaging System",
    bgGradient: ["#140E0A", "#33160D", "#FF9D00"],
    accent: "#F4510B",
    motif: "monogram",
  },
];

async function generateProjectImages() {
  for (const p of projects) {
    const width = 800;
    const height = 540;

    let motifSvg = "";
    if (p.motif === "botanical") {
      motifSvg = `
        <circle cx="600" cy="220" r="140" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.3"/>
        <circle cx="600" cy="220" r="100" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.4"/>
        <path d="M 520 220 Q 600 120 680 220 Q 600 320 520 220" fill="url(#accG)" opacity="0.6"/>
        <circle cx="600" cy="220" r="16" fill="#FFF"/>
      `;
    } else if (p.motif === "soundwave") {
      motifSvg = `
        <g opacity="0.5">
          <line x1="450" y1="270" x2="450" y2="170" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
          <line x1="480" y1="310" x2="480" y2="130" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
          <line x1="510" y1="340" x2="510" y2="100" stroke="#FFF" stroke-width="8" stroke-linecap="round"/>
          <line x1="540" y1="290" x2="540" y2="150" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
          <line x1="570" y1="360" x2="570" y2="80" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
          <line x1="600" y1="300" x2="600" y2="140" stroke="#FFF" stroke-width="8" stroke-linecap="round"/>
          <line x1="630" y1="320" x2="630" y2="120" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
          <line x1="660" y1="280" x2="660" y2="160" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
        </g>
      `;
    } else if (p.motif === "kinetic") {
      motifSvg = `
        <rect x="500" y="120" width="180" height="180" rx="32" transform="rotate(45 590 210)" fill="url(#accG)" opacity="0.6"/>
        <rect x="520" y="140" width="140" height="140" rx="24" transform="rotate(25 590 210)" fill="none" stroke="#FFF" stroke-width="2" opacity="0.5"/>
      `;
    } else if (p.motif === "sphere") {
      motifSvg = `
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FFF" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="${p.accent}"/>
            <stop offset="100%" stop-color="#200A04"/>
          </radialGradient>
        </defs>
        <circle cx="580" cy="220" r="110" fill="url(#sphereGrad)"/>
        <ellipse cx="580" cy="220" rx="140" ry="40" fill="none" stroke="#FFF" stroke-width="2" opacity="0.4" transform="rotate(-20 580 220)"/>
      `;
    } else if (p.motif === "abstract") {
      motifSvg = `
        <path d="M 460 280 C 500 120, 640 100, 700 240 C 740 340, 560 380, 460 280 Z" fill="url(#accG)" opacity="0.5"/>
        <circle cx="580" cy="210" r="45" fill="#FFF" opacity="0.8"/>
      `;
    } else {
      motifSvg = `
        <rect x="520" y="140" width="160" height="160" rx="28" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.7"/>
        <circle cx="600" cy="220" r="40" fill="url(#accG)"/>
      `;
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${p.bgGradient[0]}"/>
            <stop offset="50%" stop-color="${p.bgGradient[1]}"/>
            <stop offset="100%" stop-color="${p.bgGradient[2]}"/>
          </linearGradient>
          <linearGradient id="accG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${p.accent}"/>
            <stop offset="100%" stop-color="#F4510B"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="30" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="${width}" height="${height}" fill="url(#bgG)"/>

        <circle cx="580" cy="220" r="160" fill="${p.accent}" opacity="0.25" filter="url(#glow)"/>

        <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
          <line x1="60" y1="0" x2="60" y2="${height}"/>
          <line x1="740" y1="0" x2="740" y2="${height}"/>
          <line x1="0" y1="80" x2="${width}" y2="80"/>
          <line x1="0" y1="${height - 80}" x2="${width}" y2="${height - 80}"/>
        </g>

        ${motifSvg}

        <g transform="translate(60, 360)">
          <rect x="0" y="-30" width="${p.category.length * 8 + 35}" height="28" rx="14" fill="rgba(255,255,255,0.12)"/>
          <text x="15" y="-12" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="${p.accent}" letter-spacing="1">
            ${p.category.toUpperCase()}
          </text>

          <text x="0" y="32" font-family="'Outfit', sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">
            ${p.title}
          </text>
          
          <text x="0" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="400" fill="rgba(255,255,255,0.7)">
            Identity, Art Direction and Digital Production • By Abid Nalakath
          </text>
        </g>
      </svg>
    `;

    const outPath = path.join(projectsDir, p.filename);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 92 })
      .toFile(outPath);
    console.log(`Generated: ${p.filename}`);
  }
}

generateProjectImages().then(() => console.log("All project images generated successfully!"));
