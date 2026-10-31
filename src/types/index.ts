export type ServiceCategory = 
  | 'Graphic Designing'
  | 'Branding & Identity'
  | 'AI Video Creation'
  | 'Application Development'
  | 'Website Design & Development'
  | 'Digital Marketing & SEO';

export type PortfolioCategory = 
  | 'All'
  | 'Graphic Design'
  | 'Branding'
  | 'AI Videos'
  | 'Applications'
  | 'Websites'
  | 'Digital Marketing';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  description: string;
  deliverables: string[];
  visualDirection: string;
  iconName: string;
  accentGradient: string;
  featuredMockup: {
    title: string;
    subtitle: string;
    badge: string;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  categoryLabel: string;
  year: string;
  client: string;
  shortDescription: string;
  fullDescription: string;
  creativeApproach: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  tags: string[];
  color: string;
  image: string;
  galleryImages: string[];
  aspectRatio?: 'tall' | 'wide' | 'square';
  videoPreview?: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  displayValue?: string;
}
