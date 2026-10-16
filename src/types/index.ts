export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Branding' | 'Social Media' | 'Posters' | 'Digital Art' | 'Packaging';
  categoryLabel: string;
  image: string;
  description: string;
  client: string;
  year: string;
  role: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  colors: string[];
  tags: string[];
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  deliverables: string[];
  timeline: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
}
