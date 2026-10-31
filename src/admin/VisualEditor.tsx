import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import { LayersSidebar } from './LayersSidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { MediaLibrary } from './MediaLibrary';
import { 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Save, 
  Send, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  X 
} from 'lucide-react';

// Import the real website components
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CapabilitiesSection } from '../components/CapabilitiesSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { ProcessSection } from '../components/ProcessSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { ProjectModal } from '../components/ProjectModal';
import { VideoModal } from '../components/VideoModal';
import type { ProjectItem } from '../types';

interface VisualEditorProps {
  onBackToDashboard: () => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ onBackToDashboard }) => {
  const {
    content,
    isDraftDirty,
    saveDraft,
    publishContent,
    undo,
    redo,
    canUndo,
    canRedo,
    editorViewport,
    setEditorViewport,
    previewMode,
    setPreviewMode,
    setSelectedElement,
  } = usePortfolioContent();

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveSuccessTick, setSaveSuccessTick] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const [publishErrorMsg, setPublishErrorMsg] = useState<string | null>(null);

  // Media Library Modal state
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  // Modals inside preview
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalTitle, setVideoModalTitle] = useState('AI Motion Cinema');

  const handleSaveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    const res = await saveDraft();
    setIsSavingDraft(false);
    if (res.success) {
      setSaveSuccessTick(true);
      setTimeout(() => setSaveSuccessTick(false), 2500);
    }
  }, [saveDraft]);

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    setPublishErrorMsg(null);
    const res = await publishContent();
    setIsPublishing(false);
    if (res.success) {
      setPublishSuccessMsg('Website successfully published to live visitors!');
    } else {
      setPublishErrorMsg(res.error || 'Failed to publish website');
    }
  };

  // Keyboard Shortcuts: Ctrl+S to save, Ctrl+Z to undo, Ctrl+Y to redo, Esc to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPublishModal) {
          setShowPublishModal(false);
        } else if (mediaPickerCallback) {
          setMediaPickerCallback(null);
        } else if (selectedProject) {
          setSelectedProject(null);
        } else if (isVideoModalOpen) {
          setIsVideoModalOpen(false);
        } else {
          onBackToDashboard();
        }
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          undo();
        }
      }

      if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          redo();
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPublishModal, mediaPickerCallback, selectedProject, isVideoModalOpen, onBackToDashboard, undo, redo, handleSaveDraft]);

  // Viewport container width styling
  const viewportWidthClass = {
    desktop: 'w-full max-w-[1440px]',
    laptop: 'w-full max-w-[1200px]',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[editorViewport];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0B0B] text-white overflow-hidden select-none">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 bg-[#141414] border-b border-white/10 px-4 flex items-center justify-between relative z-[100] shrink-0">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all hover:-translate-x-0.5"
            title="Return to Admin Dashboard (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF5A1F]" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div
            onClick={onBackToDashboard}
            className="hidden sm:flex items-center gap-2 cursor-pointer group"
            title="Return to Admin Dashboard"
          >
            <span className="text-xs font-black text-white group-hover:text-[#FF5A1F] tracking-wide transition-colors">
              ABID NALAKATH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] font-bold">
              Visual Editor
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher & Undo/Redo */}
        <div className="flex items-center gap-2">
          {/* Viewport Toggles */}
          <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => setEditorViewport('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${
                editorViewport === 'desktop'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Desktop Viewport (1440px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditorViewport('laptop')}
              className={`p-1.5 rounded-lg transition-colors ${
                editorViewport === 'laptop'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Laptop Viewport (1200px)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditorViewport('tablet')}
              className={`p-1.5 rounded-lg transition-colors ${
                editorViewport === 'tablet'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Tablet Viewport (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setEditorViewport('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${
                editorViewport === 'mobile'
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Mobile Viewport (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!canUndo}
              onClick={undo}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-25 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={redo}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-25 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Preview Toggle, Save Draft, Publish */}
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            {isDraftDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Draft Changes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Draft Saved</span>
              </span>
            )}
          </div>

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              previewMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
            }`}
            title="Toggle live interaction preview without editing chrome"
          >
            {previewMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{previewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            disabled={isSavingDraft}
            onClick={handleSaveDraft}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              saveSuccessTick
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Save changes to draft file (Ctrl+S)"
          >
            {saveSuccessTick ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                <span>Draft Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
              </>
            )}
          </button>

          {/* Publish Website */}
          <button
            type="button"
            onClick={() => {
              setPublishSuccessMsg(null);
              setPublishErrorMsg(null);
              setShowPublishModal(true);
            }}
            className="px-4 py-1.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#FF5A1F]/25 hover:scale-105 transition-all"
            title="Publish changes to live visitors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Layers Sidebar */}
        {!previewMode && <LayersSidebar />}

        {/* Center Live Canvas */}
        <main
          className="flex-1 bg-[#050505] overflow-y-auto flex flex-col items-center p-2 sm:p-4 md:p-6 transition-all"
          onClick={() => {
            if (!previewMode) setSelectedElement(null);
          }}
        >
          {/* Viewport Frame */}
          <div
            className={`${viewportWidthClass} transition-all duration-300 min-h-full bg-[#0B0B0B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative`}
            style={{ isolation: 'isolate' }}
            onClick={(e) => {
              e.stopPropagation();
              // Smooth-scroll anchor links clicked inside canvas without changing router hash
              const target = e.target as HTMLElement;
              const anchor = target.closest('a');
              if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
                const targetId = anchor.hash.substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                  e.preventDefault();
                  targetEl.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            {/* Viewport Label Bar */}
            <div className="h-6 bg-black/60 border-b border-white/10 px-3 flex items-center justify-between text-[10px] font-mono text-white/40 sticky top-0 z-40 backdrop-blur-md">
              <span>{editorViewport.toUpperCase()} CANVAS PREVIEW</span>
              <span>{editorViewport === 'desktop' ? '1440px' : editorViewport === 'laptop' ? '1200px' : editorViewport === 'tablet' ? '768px' : '390px'}</span>
            </div>

            {/* LIVE WEBSITE COMPONENTS */}
            <div className="relative text-white selection:bg-[#FF5A1F] selection:text-white">
              {content.sectionVisibility.navigation && <Navbar isEditor={true} activeSection="home" />}

              <main>
                {content.sectionVisibility.hero && <HeroSection />}
                {content.sectionVisibility.capabilities && <CapabilitiesSection />}
                {content.sectionVisibility.about && <AboutSection />}
                {content.sectionVisibility.services && (
                  <ServicesSection
                    onOpenVideoModal={(title) => {
                      setVideoModalTitle(title);
                      setIsVideoModalOpen(true);
                    }}
                  />
                )}
                {content.sectionVisibility.portfolio && (
                  <PortfolioSection onSelectProject={setSelectedProject} />
                )}
                {content.sectionVisibility.process && <ProcessSection />}
                {content.sectionVisibility.contact && <ContactSection />}
              </main>

              {content.sectionVisibility.footer && <Footer />}

              {/* Modals for case study & video */}
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
              <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                title={videoModalTitle}
              />
            </div>
          </div>
        </main>

        {/* Right Properties Panel */}
        {!previewMode && (
          <PropertiesPanel
            onOpenMediaLibrary={(onSelect) => setMediaPickerCallback(() => onSelect)}
          />
        )}
      </div>

      {/* Media Library Modal Picker */}
      {mediaPickerCallback && (
        <MediaLibrary
          isModal
          onClose={() => setMediaPickerCallback(null)}
          onSelectImage={(url) => {
            mediaPickerCallback(url);
            setMediaPickerCallback(null);
          }}
        />
      )}

      {/* Publish Confirmation Dialog */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Publish Website Changes?</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              This will update your live public portfolio immediately. All visitors will see your updated text, images, projects, and services.
            </p>

            {publishSuccessMsg ? (
              <div className="space-y-4 mb-2 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{publishSuccessMsg}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-transform hover:scale-105"
                  >
                    <span>View Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : publishErrorMsg ? (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{publishErrorMsg}</span>
              </div>
            ) : null}

            {!publishSuccessMsg && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                >
                  Keep as Draft
                </button>
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handleConfirmPublish}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/25 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublishing ? 'Publishing...' : 'Confirm & Publish'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
