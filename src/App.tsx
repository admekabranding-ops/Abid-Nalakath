import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExperienceStats } from './components/ExperienceStats';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import type { Project } from './types';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('');

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
        />

        {/* Experience Metrics */}
        <ExperienceStats />

        {/* About Section: Design With Purpose */}
        <AboutSection />

        {/* Featured Case Studies Gallery */}
        <ProjectsSection onOpenProject={(project) => setSelectedProject(project)} />

        {/* Services & Specializations */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* Collaborator Testimonials */}
        <TestimonialsSection />

        {/* Contact & Inquiries */}
        <ContactSection preselectedService={selectedServiceForContact} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProjectForContact={handleSelectProjectForContact}
      />
    </div>
  );
}

export default App;
