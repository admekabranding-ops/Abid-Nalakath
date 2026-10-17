import React from 'react';
import { 
  FolderKanban, 
  Briefcase, 
  Mail, 
  HardDrive, 
  ArrowUpRight, 
  Clock, 
  Image as ImageIcon 
} from 'lucide-react';

interface OverviewTabProps {
  dashboardData: any;
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ dashboardData, onNavigateTab }) => {
  if (!dashboardData) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#200d07] via-[#33140b] to-[#200d07] border border-[#F4510B]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF9D00]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4510B]/20 text-[#FF9D00] text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Local System Active</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Welcome back, Admin
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              Manage Abid Nalakath's portfolio content, curate project case studies, review client inquiries, and maintain local database backups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('projects')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs uppercase tracking-wider shadow-glow-orange hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <span>Manage Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span>View Public Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Projects */}
        <div className="bg-[#140a07] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white tracking-tight">
            {dashboardData.totalProjects}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
            <span className="text-emerald-400 font-medium">{dashboardData.publishedProjects} Published</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">{dashboardData.draftProjects} Drafts</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#140a07] border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Active Services</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white tracking-tight">
            {dashboardData.totalServices}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Tailored creative offerings
          </div>
        </div>

        {/* Unread Inquiries */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="bg-[#140a07] border border-white/10 hover:border-[#F4510B]/50 rounded-2xl p-5 shadow-lg cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <span>{dashboardData.totalMessages}</span>
            {dashboardData.unreadMessages > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                {dashboardData.unreadMessages} New
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#FF9D00] mt-2 flex items-center gap-1 font-medium">
            <span>View Client Messages</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Media Library */}
        <div 
          onClick={() => onNavigateTab('media')}
          className="bg-[#140a07] border border-white/10 hover:border-[#F4510B]/50 rounded-2xl p-5 shadow-lg cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400 font-semibold uppercase">Media Files</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white tracking-tight">
            {dashboardData.totalMedia}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Permanently saved locally
          </div>
        </div>
      </div>

      {/* Database & Storage Status Banner */}
      <div className="bg-[#140a07] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              Storage Engine: SQLite (Local)
            </div>
            <div className="text-[11px] text-neutral-400">
              Path: <code className="text-[#FF9D00]">{dashboardData.storagePath}</code>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('backup')}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-200 transition-colors self-start sm:self-auto"
        >
          Export Database Backup
        </button>
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Recent Client Inquiries
            </h3>
            <p className="text-xs text-neutral-400">
              Messages received through the website contact form
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs text-[#FF9D00] hover:text-[#F4510B] font-semibold transition-colors flex items-center gap-1"
          >
            <span>View All ({dashboardData.totalMessages})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dashboardData.recentMessages && dashboardData.recentMessages.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentMessages.map((msg: any) => (
              <div
                key={msg.id}
                onClick={() => onNavigateTab('messages')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#F4510B]/30 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-white">{msg.name}</span>
                    <span className="text-xs text-neutral-400">({msg.email})</span>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#F4510B]" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-1 italic">
                    "{msg.message}"
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400 self-end sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px]">
                    {msg.project_type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No client messages received yet. Test the contact form on the public website!
          </div>
        )}
      </div>
    </div>
  );
};
