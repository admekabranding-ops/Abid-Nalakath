import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  User,
  FolderKanban,
  Briefcase,
  Mail,
  Image as ImageIcon,
  HardDrive,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api/client';
import { OverviewTab } from './tabs/OverviewTab';
import { HeroTab } from './tabs/HeroTab';
import { AboutTab } from './tabs/AboutTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { MessagesTab } from './tabs/MessagesTab';
import { MediaTab } from './tabs/MediaTab';
import { BackupTab } from './tabs/BackupTab';
import { SettingsTab } from './tabs/SettingsTab';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify session
    apiRequest('/auth/verify')
      .then((data) => {
        setUser(data.user);
        loadDashboardStats();
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      const data = await apiRequest('/admin/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {}
    clearAuthToken();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'visual-editor', label: 'Visual Website Editor', icon: Palette, badge: 'Canvas', badgeColor: 'bg-[#F4510B]', isEditorLink: true },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About Section', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: dashboardData?.totalProjects },
    { id: 'services', label: 'Services', icon: Briefcase, badge: dashboardData?.totalServices },
    { id: 'messages', label: 'Client Inquiries', icon: Mail, badge: dashboardData?.unreadMessages, badgeColor: 'bg-red-500' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, badge: dashboardData?.totalMedia },
    { id: 'backup', label: 'Backup & Restore', icon: HardDrive },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0e0705] text-white flex flex-col font-sans">
      {/* Top Fixed Header */}
      <header className="h-16 bg-[#140a07] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center p-1.5 shadow-glow-orange text-white">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <path d="M12 10C21 15 21 33 12 38C26 38 26 10 12 10Z" fill="currentColor" />
                <path d="M36 10C27 15 27 33 36 38C22 38 22 10 36 10Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-wide text-white">
                ABID NALAKATH
              </span>
              <span className="text-[10px] text-[#FF9D00] block -mt-1 font-semibold uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Visual Editor Quick Launch Button */}
          <button
            onClick={() => navigate('/admin/editor')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white text-xs font-bold shadow-glow-orange hover:brightness-115 transition-all cursor-pointer"
            title="Open Photoshop / Figma Style Visual Website Editor"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual Canvas Editor</span>
            <span className="sm:hidden">Editor</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF9D00]" />
          </a>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">
                {user?.username || 'admin'}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Local Session</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Active Tab Content */}
      <div className="flex flex-grow relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 bottom-0 z-30 w-64 bg-[#140a07] border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 px-3 py-2">
              Management Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if ((item as any).isEditorLink) {
                      navigate('/admin/editor');
                      return;
                    }
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                    loadDashboardStats();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-glow-orange'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (typeof item.badge === 'string' || item.badge > 0) && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-white/5 px-2">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQLite Database</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">
                data/database.sqlite
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          />
        )}

        {/* Tab Content Canvas */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <OverviewTab
              dashboardData={dashboardData}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                loadDashboardStats();
              }}
            />
          )}

          {activeTab === 'hero' && <HeroTab />}

          {activeTab === 'about' && <AboutTab />}

          {activeTab === 'projects' && <ProjectsTab />}

          {activeTab === 'services' && <ServicesTab />}

          {activeTab === 'messages' && <MessagesTab />}

          {activeTab === 'media' && <MediaTab />}

          {activeTab === 'backup' && <BackupTab />}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};
