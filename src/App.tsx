import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ProcessSection } from './components/ProcessSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { VideoModal } from './components/VideoModal';
import { CustomCursor } from './components/CustomCursor';
import type { ProjectItem } from './types';

export function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalTitle, setVideoModalTitle] = useState('AI Motion Cinema');
  const [contactInitialService, setContactInitialService] = useState('Graphic Designing');

  // Initialize Lenis Ultra-Smooth Scrolling
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth navigation anchor click handler
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, { offset: 0, duration: 1.2 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Pause scroll when modal is open
    if (selectedProject || isVideoModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [selectedProject, isVideoModalOpen]);

  // Section Tracking for Navbar
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'projects', 'process', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenVideoModal = (title: string) => {
    setVideoModalTitle(title);
    setIsVideoModalOpen(true);
  };

  const handleSelectServiceForContact = (serviceName: string) => {
    setContactInitialService(serviceName);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative selection:bg-[#FF5A1F] selection:text-white">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Main Header / Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main>
        {/* Section 01: Hero Landing Page */}
        <HeroSection />

        {/* Section 02: Trust & Creative Capabilities */}
        <CapabilitiesSection />

        {/* Section 03: About Me / "Behind the Creative" */}
        <AboutSection />

        {/* Section 04: Services */}
        <ServicesSection 
          onOpenVideoModal={handleOpenVideoModal}
          onSelectServiceForContact={handleSelectServiceForContact}
        />

        {/* Section 05: Selected Projects / Portfolio */}
        <PortfolioSection onSelectProject={setSelectedProject} />

        {/* Section 06: Creative Process */}
        <ProcessSection />

        {/* Section 07: Contact / Let's Work Together */}
        <ContactSection initialService={contactInitialService} />
      </main>

      {/* Section 08: Minimal Premium Footer */}
      <Footer />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenVideoModal={handleOpenVideoModal}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        title={videoModalTitle}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}

export default App;
