import type { Project, Service, Testimonial } from '../types';

export const personalInfo = {
  name: "Abid Nalakath",
  title: "Creative Designer",
  subtitle: "Creative Designer • Digital Artist",
  email: "hello@abidnalakath.design",
  phone: "+91 98765 43210", // Configurable placeholder
  location: "Kerala, India • Available Worldwide",
  status: "Available for Projects",
  heroImage: "/assets/abid-hero.png",
  heroHeadingLines: [
    "Creative",
    "Designs",
    "That Make",
    "Brands Stand Out."
  ],
  heroIntro: {
    greeting: "Hi, I'm",
    nameHighlight: "Abid Nalakath.",
    statement1: "I create",
    highlight1: "bold visuals,",
    statement2: "distinctive branding and",
    highlight2: "creative designs",
    statement3: "for modern businesses.",
    subtext1: "Helping brands communicate better through thoughtful design, strong visual identities and engaging digital content.",
    subtext2: "Creative thinking. Clean execution. Memorable visuals."
  },
  floatingCard: {
    avatar: "/assets/abid-avatar.jpg",
    name: "Abid Nalakath",
    role: "Creative Designer",
    quote: "“I create meaningful visual experiences that make brands memorable.”"
  },
  stats: [
    { label: "Creative Projects", value: "100+", detail: "Completed with precision" },
    { label: "Design Focus", value: "24/7", detail: "Dedicated creative output" },
    { label: "Years Experience", value: "6+", detail: "Industry experience" },
    { label: "Satisfied Clients", value: "40+", detail: "Global collaborations" }
  ],
  socials: {
    instagram: "https://instagram.com",
    behance: "https://behance.net",
    dribbble: "https://dribbble.com",
    linkedin: "https://linkedin.com"
  }
};

export const projectsData: Project[] = [
  {
    id: "aura-botanicals",
    title: "Aura Botanicals",
    subtitle: "Organic Luxury Skincare & Fragrance Packaging",
    category: "Branding",
    categoryLabel: "Brand Identity + Packaging",
    image: "/assets/projects/project-1.jpg",
    client: "Aura Botanicals Lab",
    year: "2025",
    role: "Lead Creative Designer",
    challenge: "Develop an earthy yet ultra-luxurious brand identity and sustainable packaging system for an organic botanical skincare line entering global retail.",
    solution: "Crafted a bespoke serif monogram paired with warm earthen tones (#C63D08, #FF9D00) and tactile packaging textures that communicate purity and prestige.",
    deliverables: ["Brand Identity System", "Custom Typography & Monogram", "Packaging & Label Mockups", "Print Production Guides", "Digital Brand Guidelines"],
    colors: ["#16120F", "#3B1E12", "#C63D08", "#FF9D00", "#FAF8F5"],
    tags: ["Brand Identity", "Luxury Packaging", "Art Direction", "Print Production"],
    description: "Comprehensive visual identity and packaging architecture for Aura Botanicals, emphasizing organic sustainability through modern minimalist typography and warm amber accents.",
    featured: true
  },
  {
    id: "nova-sound-festival",
    title: "Nova Sound Festival",
    subtitle: "High-Energy Music & Arts Festival Campaign",
    category: "Posters",
    categoryLabel: "Advertising + Poster Design",
    image: "/assets/projects/project-2.jpg",
    client: "Nova Entertainment Co.",
    year: "2025",
    role: "Visual Designer & Art Director",
    challenge: "Produce an electric, dynamic poster and billboard visual system that captures the sonic pulse of an international music festival.",
    solution: "Used rhythmic geometric soundwave patterns, intense fluorescent-orange chromatic contrast, and bold kinetic type layouts across physical and digital billboards.",
    deliverables: ["Festival Key Visuals", "Transit Billboards (OOH)", "Merchandise Design", "Motion Poster Animation", "Social Media Rollout Assets"],
    colors: ["#0C0714", "#261138", "#F4510B", "#FF6B00", "#FFFFFF"],
    tags: ["Poster Design", "Advertising", "Typography", "Motion Graphics"],
    description: "A high-octane advertising and poster design campaign featuring kinetic typography, vivid neon gradients, and layered soundwave motifs for Nova Sound.",
    featured: true
  },
  {
    id: "kroma-creative-suite",
    title: "Kroma Creative Suite",
    subtitle: "Multi-Platform Social Media Campaign",
    category: "Social Media",
    categoryLabel: "Social Media Campaign",
    image: "/assets/projects/project-3.jpg",
    client: "Kroma Tech Interactive",
    year: "2024",
    role: "Creative Campaign Lead",
    challenge: "Create a cohesive, viral social media campaign for the launch of a new AI-powered design assistant for creative professionals.",
    solution: "Engineered high-converting Instagram carousels, animated reels templates, and punchy promotional stories with crisp 3D geometric accents.",
    deliverables: ["30+ Social Feed Templates", "Animated Reels & Story System", "Interactive Ad Visuals", "Design Asset Kit", "Social Brand Book"],
    colors: ["#0B0D18", "#112038", "#FF9D00", "#F4510B", "#F7F6F4"],
    tags: ["Social Media", "Digital Marketing", "Content Strategy", "Creative Ads"],
    description: "Dynamic social media graphics and advertising templates that drove 340% increase in app store pre-registrations for Kroma Creative Suite.",
    featured: true
  },
  {
    id: "solstice-kinetic-studio",
    title: "Solstice Kinetic Studio",
    subtitle: "Abstract 3D Visual Art & Brand Identity",
    category: "Digital Art",
    categoryLabel: "Creative Artwork + 3D Visuals",
    image: "/assets/projects/project-4.jpg",
    client: "Solstice Architecture & Design",
    year: "2024",
    role: "Visual Concept Artist",
    challenge: "Develop an avant-garde visual language for an architecture and kinetic installation studio.",
    solution: "Combined tactile 3D orb compositions, metallic orange sheen, and mathematical grid overlays to reflect physical craftsmanship and spatial innovation.",
    deliverables: ["Visual Key Artworks", "Spatial Monogram", "Exhibition Catalogue", "Web Visual Assets", "Architectural Signage"],
    colors: ["#1A0C08", "#4A1A0C", "#F4510B", "#FFA500", "#FFFFFF"],
    tags: ["3D Artwork", "Visual Identity", "Generative Art", "Exhibition"],
    description: "An evocative visual identity featuring custom 3D fluid sculptures and mathematical geometry tailored for Solstice Kinetic Studio.",
    featured: false
  },
  {
    id: "vortex-motion-lab",
    title: "Vortex Motion Lab",
    subtitle: "Digital Marketing Visuals & Brand System",
    category: "Branding",
    categoryLabel: "Digital Marketing Visuals",
    image: "/assets/projects/project-5.jpg",
    client: "Vortex Studio",
    year: "2024",
    role: "Senior Visual Designer",
    challenge: "Rebrand a high-end visual effects and animation agency for global enterprise clients.",
    solution: "Designed a dark-mode editorial identity highlighted with burnt orange accents, sharp typographic rhythm, and fluid organic shapes.",
    deliverables: ["Full Brand System", "Sales Deck & Pitch Decks", "Web Visual Design", "Digital Marketing Banners", "Merch Collection"],
    colors: ["#0A0A0E", "#201322", "#C63D08", "#FF8400", "#E8E8E8"],
    tags: ["Brand System", "Digital Marketing", "Visual Identity", "Art Direction"],
    description: "A dark-mode brand identity system created for Vortex Motion Lab with high-impact editorial layouts and luminous orange visual markers.",
    featured: false
  },
  {
    id: "elysian-luxe-collective",
    title: "Elysian Luxe Collective",
    subtitle: "Promotional Creatives & Premium Unboxing",
    category: "Packaging",
    categoryLabel: "Promotional + Packaging System",
    image: "/assets/projects/project-6.jpg",
    client: "Elysian Lifestyle Group",
    year: "2023",
    role: "Packaging & Creative Designer",
    challenge: "Establish a luxury visual identity and unboxing experience for an artisan specialty coffee and lifestyle brand.",
    solution: "Structured gold-embossed typography, custom seal monograms, and warm earthy tones that celebrate heritage craftsmanship.",
    deliverables: ["Custom Monogram Seal", "Coffee Bag Packaging", "Promotional Gift Boxes", "Direct-to-Consumer Cards", "Retail POS Collateral"],
    colors: ["#140E0A", "#33160D", "#FF9D00", "#F4510B", "#FAF7F2"],
    tags: ["Packaging Design", "Promotional Creatives", "Luxury", "Print Production"],
    description: "Bespoke unboxing packaging and promotional creatives for Elysian Luxe, winning accolades for sustainable luxury presentation.",
    featured: true
  }
];

export const servicesData: Service[] = [
  {
    id: "brand-identity",
    title: "Brand Identity & Logo Design",
    shortDesc: "Distinctive visual identities, logo marks, color systems, and comprehensive brand guidelines that make your company unforgettable.",
    fullDesc: "I create timeless visual identity systems that capture your brand's unique soul and values. From bespoke logotypes and responsive brand marks to curated color harmony and typography hierarchy, your brand will stand out in any competitive landscape.",
    iconName: "Palette",
    deliverables: [
      "Primary & Secondary Logo Marks",
      "Comprehensive Brand Guidelines",
      "Typography & Color System",
      "Brand Collateral (Stationery, Decks)",
      "Vector Source Files (AI, SVG, PDF, PNG)"
    ],
    timeline: "2 - 3 Weeks"
  },
  {
    id: "social-media-design",
    title: "Social Media Design",
    shortDesc: "Scroll-stopping social templates, carousel storytelling, and campaign visuals that grow engagement and build loyal communities.",
    fullDesc: "Transform your social channels with cohesive, aesthetically commanding design systems. I design tailored Instagram, LinkedIn, and YouTube creative systems that elevate perceived brand value and maximize engagement.",
    iconName: "Share2",
    deliverables: [
      "Curated Feed & Carousel Templates",
      "Animated Story & Reel Cover Kits",
      "Platform-Optimized Formats",
      "Figma / Photoshop Master Templates",
      "Visual Content Style Guide"
    ],
    timeline: "1 - 2 Weeks"
  },
  {
    id: "advertising-promotional",
    title: "Advertising & Promotional Creatives",
    shortDesc: "High-impact advertising posters, billboards, digital display ads, and promotional banners with clear visual hierarchy.",
    fullDesc: "Whether launching a flagship product or promoting a major festival, I craft high-converting print and digital advertising campaigns that demand attention and drive decisive action.",
    iconName: "Megaphone",
    deliverables: [
      "Print Billboards & Poster Series",
      "Digital Display Ads & Google Banners",
      "Event & Festival Key Visuals",
      "Retargeting Ad Creative Sets",
      "High-Res Print-Ready Production Files"
    ],
    timeline: "1 - 2 Weeks"
  },
  {
    id: "marketing-visuals",
    title: "Marketing Campaign Visuals",
    shortDesc: "End-to-end campaign visual direction, pitch deck design, infographic storytelling, and launch collateral.",
    fullDesc: "Cohesive multi-touchpoint marketing design for product launches, seasonal campaigns, and brand expansions. I ensure every customer touchpoint resonates with unified artistic direction.",
    iconName: "TrendingUp",
    deliverables: [
      "Campaign Concept & Moodboards",
      "High-Stakes Pitch Decks & Keynotes",
      "Landing Page Art Direction & Graphics",
      "Email Marketing Visual Templates",
      "Digital Marketing Collateral"
    ],
    timeline: "2 - 3 Weeks"
  },
  {
    id: "digital-creative-design",
    title: "Digital Creative Design",
    shortDesc: "Modern UI art direction, 3D abstract compositions, custom graphics, and responsive web visual assets.",
    fullDesc: "Bringing digital experiences to life with bespoke 3D motifs, crisp vector iconography, and cutting-edge editorial layouts that elevate digital products from functional to extraordinary.",
    iconName: "Layout",
    deliverables: [
      "Website Hero Visuals & Concepts",
      "Custom 3D / Vector Illustrations",
      "Interactive UI Component Styling",
      "App Store Showcase Graphics",
      "Exported Web-Ready SVG & WebP Assets"
    ],
    timeline: "2 - 4 Weeks"
  }
];

export const processSteps = [
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
];

export const skillsList = [
  { name: "Brand Identity", level: 98 },
  { name: "Visual Art Direction", level: 96 },
  { name: "Editorial Typography", level: 95 },
  { name: "Packaging Design", level: 92 },
  { name: "Social Media Campaigns", level: 96 },
  { name: "3D & Digital Graphics", level: 90 },
];

export const toolsMastered = [
  { name: "Adobe Illustrator", category: "Vector & Logos" },
  { name: "Adobe Photoshop", category: "Retouching & Key Art" },
  { name: "Figma", category: "UI & Layout Systems" },
  { name: "Adobe InDesign", category: "Editorial & Print" },
  { name: "Adobe After Effects", category: "Motion Graphics" },
  { name: "Blender / C4D", category: "3D Visuals" },
];

export const testimonialsData: Testimonial[] = [
  {
    id: "1",
    quote: "Abid transformed our brand from looking like a standard startup into an industry-defining luxury benchmark. His command of typography, color, and spacing is world-class.",
    author: "Elena Rostova",
    role: "Founder & Creative Director",
    company: "Aura Botanicals",
    rating: 5
  },
  {
    id: "2",
    quote: "The advertising campaign Abid designed for our festival generated the highest ticket presale in our 5-year history. Clean, electrifying visuals that stopped people in their tracks.",
    author: "Marcus Chen",
    role: "Head of Marketing",
    company: "Nova Sound Festival",
    rating: 5
  },
  {
    id: "3",
    quote: "Working with Abid is an absolute breeze. He understands the commercial impact of good design and delivers assets that are as practical to deploy as they are beautiful.",
    author: "Sophie Laurent",
    role: "Brand Strategy VP",
    company: "Elysian Luxe",
    rating: 5
  }
];
