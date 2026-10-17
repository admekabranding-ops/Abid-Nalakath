import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { ExperienceStats } from '../components/ExperienceStats';
import { AboutSection } from '../components/AboutSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ServicesSection } from '../components/ServicesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { ProjectModal } from '../components/ProjectModal';
import type { Project, Service } from '../types';
import { personalInfo, projectsData, servicesData } from '../data/portfolioData';

// Helper with static JSON fallback for static hosts like Vercel
const fetchWithFallback = async <T,>(apiUrl: string, staticUrl: string): Promise<T | null> => {
  try {
    const res = await fetch(apiUrl);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
  } catch {
    // API endpoint unavailable
  }
  try {
    const staticRes = await fetch(staticUrl);
    const contentType = staticRes.headers.get('content-type') || '';
    if (staticRes.ok && (contentType.includes('application/json') || staticUrl.endsWith('.json'))) {
      return (await staticRes.json()) as T;
    }
  } catch {
    // Static fallback unavailable
  }
  return null;
};

export const PublicPortfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');

  // Dynamic database states
  const [content, setContent] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [services, setServices] = useState<Service[]>(servicesData);
  const [stats, setStats] = useState<any[]>(personalInfo.stats);
  const [visualLayout, setVisualLayout] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch site content (local API or static content.json on Vercel)
    fetchWithFallback<any>('/api/content', '/content.json').then((data) => {
      if (data) setContent(data);
    });

    // 2. Fetch published projects
    fetchWithFallback<Project[]>('/api/projects', '/projects.json').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    });

    // 3. Fetch services
    fetchWithFallback<Service[]>('/api/services', '/services.json').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      }
    });

    // 4. Fetch stats
    fetchWithFallback<any[]>('/api/stats', '/stats.json').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setStats(data);
      }
    });

    // 5. Fetch published visual layout overrides
    fetchWithFallback<any>('/api/visual-layout', '/visual-layout.json').then((data) => {
      if (data) {
        if (data.exists && data.layout) {
          setVisualLayout(data.layout);
        } else if (data.elements) {
          setVisualLayout(data);
        }
      }
    });
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForContact(serviceTitle);
    scrollTo('contact');
  };

  const handleSelectProjectForContact = (projectTitle: string) => {
    setSelectedServiceForContact(projectTitle);
    scrollTo('contact');
  };

  // Convert visual element styles to CSS properties
  const toCSSProperties = (styles: any): React.CSSProperties => {
    if (!styles) return {};
    const res: React.CSSProperties = {};
    if (styles.x !== undefined || styles.y !== undefined) {
      res.transform = `translate(${styles.x || 0}px, ${styles.y || 0}px)`;
    }
    if (styles.fontSize) res.fontSize = styles.fontSize;
    if (styles.fontWeight) res.fontWeight = styles.fontWeight;
    if (styles.fontFamily) res.fontFamily = styles.fontFamily;
    if (styles.lineHeight) res.lineHeight = styles.lineHeight;
    if (styles.letterSpacing) res.letterSpacing = styles.letterSpacing;
    if (styles.color) res.color = styles.color;
    if (styles.backgroundColor) res.backgroundColor = styles.backgroundColor;
    if (styles.backgroundGradient) res.background = styles.backgroundGradient;
    if (styles.borderRadius) res.borderRadius = styles.borderRadius;
    if (styles.borderWidth) res.borderWidth = styles.borderWidth;
    if (styles.borderColor) res.borderColor = styles.borderColor;
    if (styles.boxShadow) res.boxShadow = styles.boxShadow;
    if (styles.opacity !== undefined) res.opacity = styles.opacity;
    if (styles.width) res.width = styles.width;
    if (styles.maxWidth) res.maxWidth = styles.maxWidth;
    if (styles.height) res.height = styles.height;
    if (styles.filter) res.filter = styles.filter;
    return res;
  };

  // Merge visual layout overrides into content
  const mergedHero: any = {
    ...(content?.hero || {}),
  };
  const mergedStats = [...stats];

  if (visualLayout && visualLayout.elements) {
    const el = visualLayout.elements;

    if (el['hero.heading']) {
      if (el['hero.heading'].content?.text) {
        mergedHero.heroHeadingLines = el['hero.heading'].content.text.split('\n');
      }
      mergedHero.headingStyles = toCSSProperties(el['hero.heading'].styles);
    }

    if (el['hero.subheading']) {
      if (el['hero.subheading'].content?.text) {
        mergedHero.subtitle = el['hero.subheading'].content.text;
      }
    }

    if (el['hero.logo']?.content?.imageSrc) {
      mergedHero.logoImage = el['hero.logo'].content.imageSrc;
    }

    if (el['hero.badge']) {
      if (el['hero.badge'].content?.text) {
        mergedHero.availableStatus = el['hero.badge'].content.text;
      }
      mergedHero.badgeStyles = toCSSProperties(el['hero.badge'].styles);
    }

    if (el['hero.cta']) {
      if (el['hero.cta'].content?.text) {
        mergedHero.ctaText = el['hero.cta'].content.text;
      }
      mergedHero.ctaStyles = toCSSProperties(el['hero.cta'].styles);
    }

    if (el['hero.portrait']) {
      if (el['hero.portrait'].content?.imageSrc) {
        mergedHero.heroImage = el['hero.portrait'].content.imageSrc;
      }
      mergedHero.portraitStyles = toCSSProperties(el['hero.portrait'].styles);
    }

    if (el['hero.intro']) {
      if (el['hero.intro'].content?.text) {
        mergedHero.introStatement = el['hero.intro'].content.text;
      }
      mergedHero.introStyles = toCSSProperties(el['hero.intro'].styles);
    }

    if (el['hero.quote']?.content) {
      mergedHero.quoteCard = {
        name: el['hero.quote'].content.authorName || 'Abid',
        role: el['hero.quote'].content.authorRole || 'Creative Designer',
        quote: el['hero.quote'].content.quoteText || '“I create premium designs that look clean and convert.”',
        avatar: el['hero.quote'].content.avatarUrl || '/assets/abid-avatar.jpg',
      };
    }

    if (el['hero.stats1']?.content) {
      mergedStats[0] = {
        ...(mergedStats[0] || {}),
        label: el['hero.stats1'].content.label || mergedStats[0]?.label || 'Projects Built',
        value: el['hero.stats1'].content.number || mergedStats[0]?.value || '100+',
      };
    }

    if (el['hero.stats2']?.content) {
      mergedStats[1] = {
        ...(mergedStats[1] || {}),
        label: el['hero.stats2'].content.label || mergedStats[1]?.label || 'Client Support',
        value: el['hero.stats2'].content.number || mergedStats[1]?.value || '24/7',
      };
    }
  }

  // Render custom dragged elements (logos, photos, cards) for a section
  const renderCustomSectionElements = (sectionId: string) => {
    if (!visualLayout || !visualLayout.elements) return null;
    const items = Object.values(visualLayout.elements).filter(
      (item: any) => item.section === sectionId && item.id.startsWith('custom_') && !item.hidden
    );
    if (items.length === 0) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 flex flex-wrap gap-6 items-center justify-center">
        {items.map((item: any) => {
          const s = item.styles || {};
          return (
            <div
              key={item.id}
              style={toCSSProperties(s)}
              className="transition-transform"
            >
              {item.type === 'image' && (
                <img
                  src={item.content?.imageSrc || '/assets/abid-hero.png'}
                  alt={item.content?.altText || item.name}
                  style={{
                    width: s.width || 'auto',
                    height: s.height || 'auto',
                    maxWidth: s.maxWidth || '100%',
                    maxHeight: s.maxHeight || '450px',
                    objectFit: s.objectFit || 'contain',
                    borderRadius: s.borderRadius || '16px',
                    boxShadow: s.boxShadow || 'none',
                  }}
                  className="block"
                />
              )}
              {item.type === 'heading' && (
                <h3 className="font-display font-bold text-white text-2xl">
                  {item.content?.text || item.name}
                </h3>
              )}
              {item.type === 'text' && (
                <p className="text-sm text-neutral-300">
                  {item.content?.text || item.name}
                </p>
              )}
              {item.type === 'button' && (
                <a
                  href={item.content?.linkUrl || '#'}
                  className="px-6 py-2.5 rounded-full bg-[#F4510B] text-white font-semibold text-sm shadow-md inline-block hover:scale-105 transition-transform"
                >
                  {item.content?.text || item.name}
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0e0705] text-neutral-100 font-sans selection:bg-[#F4510B] selection:text-white">
      {/* Sticky Header */}
      <Navbar onNavigate={scrollTo} />

      {/* Main Content Flow */}
      <main>
        {/* Exact Reference Hero Canvas */}
        <HeroSection
          onExploreWork={() => scrollTo('projects')}
          onNavigate={scrollTo}
          heroContent={mergedHero}
          statsContent={mergedStats}
          socialsContent={content?.contact?.socials}
        />
        {renderCustomSectionElements('hero')}

        {/* Experience Metrics */}
        <ExperienceStats statsContent={mergedStats} />
        {renderCustomSectionElements('stats')}

        {/* About Section: Design With Purpose */}
        <AboutSection aboutContent={content?.about} />
        {renderCustomSectionElements('about')}

        {/* Featured Case Studies Gallery */}
        <ProjectsSection
          onOpenProject={(project) => setSelectedProject(project)}
          projects={projects}
        />
        {renderCustomSectionElements('projects')}

        {/* Services & Specializations */}
        <ServicesSection
          onSelectService={handleSelectService}
          services={services}
        />
        {renderCustomSectionElements('services')}

        {/* Collaborator Testimonials */}
        <TestimonialsSection />
        {renderCustomSectionElements('testimonials')}

        {/* Contact & Inquiries */}
        <ContactSection
          preselectedService={selectedServiceForContact}
          contactContent={content?.contact}
          socialsContent={content?.contact?.socials}
        />
        {renderCustomSectionElements('contact')}
      </main>

      {/* Footer */}
      <Footer
        contactContent={content?.contact}
        socialsContent={content?.contact?.socials}
      />

      {/* Interactive Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProjectForContact={handleSelectProjectForContact}
      />
    </div>
  );
};

export default PublicPortfolio;
