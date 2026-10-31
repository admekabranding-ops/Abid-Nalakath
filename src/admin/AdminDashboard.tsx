import React, { useState } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Layers, 
  FolderGit2, 
  ImageIcon, 
  Send, 
  Save, 
  Eye, 
  LogOut, 
  ExternalLink, 
  Shield, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Globe, 
  KeyRound, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenVisualEditor: () => void;
  onOpenMediaLibrary: () => void;
  onOpenProjects: () => void;
  onOpenServices: () => void;
  onOpenPreview: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenVisualEditor,
  onOpenMediaLibrary,
  onOpenProjects,
  onOpenServices,
  onOpenPreview,
}) => {
  const {
    content,
    updateContent,
    isDraftDirty,
    lastSaved,
    lastPublished,
    saveDraft,
    publishContent,
  } = usePortfolioContent();

  const { user, logout, changePassword } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  // Password Change Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // SEO Modal
  const [showSeoModal, setShowSeoModal] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await saveDraft();
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishMessage(null);
    const res = await publishContent();
    setIsPublishing(false);
    if (res.success) {
      setPublishMessage('Website changes published live to visitors!');
      setTimeout(() => setPublishMessage(null), 3000);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);
    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess('Admin password updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } else {
      setPassError(res.error || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <header className="h-16 bg-[#121212] border-b border-white/10 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A1F] to-[#EA580C] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#FF5A1F]/30">
            A
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>ABID NALAKATH</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F]">
                ADMIN
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
            <ExternalLink className="w-3 h-3 text-white/40" />
          </a>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Admin Security & Password"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowSeoModal(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="SEO & Metadata"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Status Notification Banner */}
        {publishMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{publishMessage}</span>
          </div>
        )}

        {/* Dashboard Status Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF5A1F]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF5A1F] uppercase">
                WEBSITE STATUS
              </span>
              {isDraftDirty ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Draft Changes Pending
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  All Changes Published
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, Abid
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-xl">
              Use the Visual Editor to modify your portfolio live, manage media files, add projects, or publish new changes.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-mono text-white/40">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-white/30" />
                <span>Last Saved: {lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'Never'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                <span>Last Published: {lastPublished ? new Date(lastPublished).toLocaleTimeString() : 'Default'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/30 hover:scale-105 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Website'}</span>
            </button>
          </div>
        </div>

        {/* 6 Core Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. VISUAL EDITOR */}
          <div
            onClick={onOpenVisualEditor}
            className="group relative p-7 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                EDIT WEBSITE
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Photoshop-style visual editor. Click on text, portrait, buttons, or cards directly on the live preview to edit them.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Open Visual Canvas</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* 2. MEDIA LIBRARY */}
          <div
            onClick={onOpenMediaLibrary}
            className="group relative p-7 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                MEDIA LIBRARY
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Persistent asset manager. Upload images, organize into folders (Hero, Portfolio, Branding), and inspect dimensions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Manage Assets</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* 3. MANAGE PROJECTS */}
          <div
            onClick={onOpenProjects}
            className="group relative p-7 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                MANAGE PROJECTS
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Add new portfolio items, reorder showcase items, update descriptions, gallery images, and project details ({content.portfolioProjects.length} projects).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Portfolio Editor</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* 4. MANAGE SERVICES */}
          <div
            onClick={onOpenServices}
            className="group relative p-7 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                MANAGE SERVICES
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Edit existing services (#01–#06), customize deliverables, change line icons, or add new services ({content.servicesData.length} active).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Services Editor</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* 5. PREVIEW WEBSITE */}
          <div
            onClick={onOpenPreview}
            className="group relative p-7 rounded-3xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                PREVIEW WEBSITE
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Preview your exact website with current draft changes before publishing. Test animations, modals, and responsive layout.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Full Preview</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* 6. PUBLISH WEBSITE */}
          <div
            onClick={handlePublish}
            className="group relative p-7 rounded-3xl bg-gradient-to-br from-[#1C120C] to-[#141414] border border-[#FF5A1F]/30 hover:border-[#FF5A1F] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F] flex items-center justify-center text-white mb-5 shadow-lg shadow-[#FF5A1F]/30 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">
                PUBLISH WEBSITE
              </h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Make draft changes live. Creates a version snapshot in history and updates what public visitors see immediately.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span>Publish Now</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF5A1F]" />
              <span>Admin Security Settings</span>
            </h3>
            <p className="text-xs text-white/50 mb-5">
              Logged in as <span className="text-white font-mono">{user?.email}</span>. Update your administrative password.
            </p>

            {passSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white focus:outline-none text-sm"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase font-semibold">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white focus:outline-none text-sm"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-bold uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/20"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO Modal */}
      {showSeoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF5A1F]" />
              <span>SEO & Meta Configuration</span>
            </h3>
            <p className="text-xs text-white/50 mb-5">
              Control search engine metadata, page title, and social sharing previews.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase font-semibold">
                  Page Title (Meta Title)
                </label>
                <input
                  type="text"
                  value={content.seoSettings.metaTitle}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      seoSettings: { ...prev.seoSettings, metaTitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase font-semibold">
                  Meta Description
                </label>
                <textarea
                  value={content.seoSettings.metaDescription}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      seoSettings: { ...prev.seoSettings, metaDescription: e.target.value },
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-mono uppercase font-semibold">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={content.seoSettings.keywords}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      seoSettings: { ...prev.seoSettings, keywords: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSeoModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-bold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
