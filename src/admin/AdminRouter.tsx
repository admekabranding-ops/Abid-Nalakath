import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ContentProvider, usePortfolioContent } from '../context/ContentContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { VisualEditor } from './VisualEditor';
import { MediaLibrary } from './MediaLibrary';
import { ProjectManager } from './ProjectManager';
import { ServiceManager } from './ServiceManager';
import { ArrowLeft, Edit3, Save, Send } from 'lucide-react';

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

interface AdminSubHeaderProps {
  title: string;
  onBack: () => void;
  onOpenEditor?: () => void;
}

const AdminSubHeader: React.FC<AdminSubHeaderProps> = ({ title, onBack, onOpenEditor }) => {
  const { saveDraft, publishContent } = usePortfolioContent();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  return (
    <div className="h-14 bg-[#141414] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 relative z-[100]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all hover:-translate-x-0.5"
          title="Return to Admin Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF5A1F]" />
          <span>Back to Dashboard</span>
        </button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        <span className="text-xs font-bold text-white uppercase font-mono tracking-wider hidden sm:inline">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {onOpenEditor && (
          <button
            type="button"
            onClick={onOpenEditor}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span className="hidden md:inline">Visual Editor</span>
          </button>
        )}

        <button
          type="button"
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);
            await saveDraft();
            setIsSaving(false);
          }}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>

        <button
          type="button"
          disabled={isPublishing}
          onClick={async () => {
            setIsPublishing(true);
            await publishContent();
            setIsPublishing(false);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#FF5A1F]/20 hover:scale-105 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
        </button>
      </div>
    </div>
  );
};

export const AdminRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'media' | 'projects' | 'services' | 'preview'>('dashboard');

  const navigate = (view: 'dashboard' | 'editor' | 'media' | 'projects' | 'services' | 'preview') => {
    setCurrentView(view);
    const targetHash = view === 'dashboard' ? '' : `#${view}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  };

  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === '#editor' || path === '/admin/editor') {
        setCurrentView('editor');
      } else if (hash === '#media' || path === '/admin/media') {
        setCurrentView('media');
      } else if (hash === '#projects' || hash === '#projects-mgr' || path === '/admin/projects') {
        setCurrentView('projects');
      } else if (hash === '#services' || hash === '#services-mgr' || path === '/admin/services') {
        setCurrentView('services');
      } else if (hash === '#preview' || path === '/admin/preview') {
        setCurrentView('preview');
      } else {
        setCurrentView('dashboard');
      }
    };

    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#070707] flex items-center justify-center text-white/50 text-sm font-mono">
        Authenticating Admin Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => navigate('dashboard')} />;
  }

  return (
    <ContentProvider mode="draft">
      {currentView === 'editor' && (
        <VisualEditor onBackToDashboard={() => navigate('dashboard')} />
      )}

      {currentView === 'media' && (
        <div className="h-screen flex flex-col bg-[#0B0B0B]">
          <AdminSubHeader
            title="Asset Manager"
            onBack={() => navigate('dashboard')}
            onOpenEditor={() => navigate('editor')}
          />
          <div className="flex-1 overflow-hidden">
            <MediaLibrary />
          </div>
        </div>
      )}

      {currentView === 'projects' && (
        <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
          <AdminSubHeader
            title="Portfolio Projects Manager"
            onBack={() => navigate('dashboard')}
            onOpenEditor={() => navigate('editor')}
          />
          <div className="flex-1 overflow-y-auto">
            <ProjectManager />
          </div>
        </div>
      )}

      {currentView === 'services' && (
        <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
          <AdminSubHeader
            title="Services Manager"
            onBack={() => navigate('dashboard')}
            onOpenEditor={() => navigate('editor')}
          />
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
              onClick={() => navigate('editor')}
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Visually</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              Exit to Dashboard
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
          onOpenVisualEditor={() => navigate('editor')}
          onOpenMediaLibrary={() => navigate('media')}
          onOpenProjects={() => navigate('projects')}
          onOpenServices={() => navigate('services')}
          onOpenPreview={() => navigate('preview')}
        />
      )}
    </ContentProvider>
  );
};
