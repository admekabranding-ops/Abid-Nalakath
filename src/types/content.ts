import type { ServiceItem, ProjectItem, ProcessStep, SocialLink } from './index';

export interface HeroServiceHighlight {
  number: string;
  title: string;
  href: string;
}

export interface CapabilityItem {
  name: string;
  icon: string;
  tag: string;
}

export interface AboutCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
}

export interface PersonalInfoContent {
  name: string;
  title: string;
  tagline: string;
  heroIntro: string;
  heroHeading: string;
  heroQuote: string;
  heroSupporting: string;
  portraitUrl: string;
  portraitPosition: string; // e.g. "center 32%"
  portraitScale: number;
  viewWorkText: string;
  viewWorkLink: string;
  letsTalkText: string;
  letsTalkLink: string;
  aboutLabel: string;
  aboutHeadline: string;
  aboutBio: string;
  aboutSupporting: string;
  location: string;
  email: string;
  whatsapp: string;
  instagram: string;
  behance: string;
  linkedin: string;
  github: string;
}

export interface SiteSettings {
  accentColor: string;
  cardBorderRadius: number; // in pixels (e.g. 28)
  enableSmoothScroll: boolean;
  enableHairAnimation: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface SectionVisibility {
  navigation: boolean;
  hero: boolean;
  capabilities: boolean;
  about: boolean;
  services: boolean;
  portfolio: boolean;
  process: boolean;
  contact: boolean;
  footer: boolean;
}

export interface SectionCustomization {
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface SiteContent {
  personalInfo: PersonalInfoContent;
  heroServiceHighlights: HeroServiceHighlight[];
  capabilitiesList: CapabilityItem[];
  aboutShowcaseCards: AboutCard[];
  servicesData: ServiceItem[];
  portfolioProjects: ProjectItem[];
  processSteps: ProcessStep[];
  socialLinks: SocialLink[];
  siteSettings: SiteSettings;
  seoSettings: SeoSettings;
  sectionVisibility: SectionVisibility;
  sectionStyles: Record<string, SectionCustomization>;
}

export interface MediaAsset {
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

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  filename: string;
}

export interface SelectedElement {
  id: string;
  section: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  label: string;
  propertyPath: string;
  currentValue?: any;
  options?: {
    multiline?: boolean;
    fontSize?: number;
    fontWeight?: string;
    textColor?: string;
    textAlignment?: 'left' | 'center' | 'right';
    lineHeight?: number;
    maxWidth?: number;
    altText?: string;
    destinationUrl?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
    borderRadius?: number;
    backgroundColor?: string;
  };
}
