import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ContentProvider } from '../context/ContentContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { VisualEditor } from './VisualEditor';
import { MediaLibrary } from './MediaLibrary';
import { ProjectManager } from './ProjectManager';
import { ServiceManager } from './ServiceManager';
import { ArrowLeft, Edit3 } from 'lucide-react';

// Live Components for Preview Mode
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CapabilitiesSection } from '../components/CapabilitiesSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { ProcessSection } from '../components/ProcessSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

export const AdminRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'media' | 'projects' | 'services' | 'preview'>('dashboard');

  useEffect(() => {
    // Parse sub-route from path or hash if present
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path === '/admin/editor' || hash === '#editor') {
      setCurrentView('editor');
    } else if (path === '/admin/media' || hash === '#media') {
      setCurrentView('media');
    } else if (path === '/admin/projects' || hash === '#projects-mgr') {
      setCurrentView('projects');
    } else if (path === '/admin/services' || hash === '#services-mgr') {
      setCurrentView('services');
    } else if (path === '/admin/preview' || hash === '#preview') {
      setCurrentView('preview');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#070707] flex items-center justify-center text-white/50 text-sm font-mono">
        Authenticating Admin Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setCurrentView('dashboard')} />;
  }

  return (
    <ContentProvider mode="draft">
      {currentView === 'editor' && (
        <VisualEditor onBackToDashboard={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'media' && (
        <div className="h-screen flex flex-col bg-[#0B0B0B]">
          <div className="h-14 bg-[#141414] border-b border-white/10 px-6 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Asset Manager
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MediaLibrary />
          </div>
        </div>
      )}

      {currentView === 'projects' && (
        <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
          <div className="h-14 bg-[#141414] border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Portfolio Projects Manager
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ProjectManager />
          </div>
        </div>
      )}

      {currentView === 'services' && (
        <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
          <div className="h-14 bg-[#141414] border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Services Manager
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ServiceManager />
          </div>
        </div>
      )}

      {currentView === 'preview' && (
        <div className="relative min-h-screen bg-[#0B0B0B] text-white">
          {/* Floating Admin Banner */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/85 border border-[#FF5A1F]/50 shadow-2xl backdrop-blur-xl flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#FF5A1F] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
              DRAFT PREVIEW MODE
            </span>
            <div className="h-3 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => setCurrentView('editor')}
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Visually</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              Exit Preview
            </button>
          </div>

          <Navbar activeSection="home" />
          <main>
            <HeroSection />
            <CapabilitiesSection />
            <AboutSection />
            <ServicesSection />
            <PortfolioSection />
            <ProcessSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}

      {currentView === 'dashboard' && (
        <AdminDashboard
          onOpenVisualEditor={() => setCurrentView('editor')}
          onOpenMediaLibrary={() => setCurrentView('media')}
          onOpenProjects={() => setCurrentView('projects')}
          onOpenServices={() => setCurrentView('services')}
          onOpenPreview={() => setCurrentView('preview')}
        />
      )}
    </ContentProvider>
  );
};
