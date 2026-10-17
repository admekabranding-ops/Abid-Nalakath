import React from 'react';
import {
  Sparkles,
  TrendingUp,
  User,
  FolderKanban,
  Briefcase,
  Quote,
  Mail,
  Layout,
  ExternalLink,
} from 'lucide-react';
import type { VisualLayoutState } from './editorTypes';

interface SectionsPanelProps {
  layout: VisualLayoutState;
  onScrollToSection: (sectionId: string) => void;
  activeSectionId: string;
}

export const SectionsPanel: React.FC<SectionsPanelProps> = ({
  layout,
  onScrollToSection,
  activeSectionId,
}) => {
  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'hero':
        return <Sparkles className="w-4 h-4 text-[#F4510B]" />;
      case 'stats':
        return <TrendingUp className="w-4 h-4 text-[#FF9D00]" />;
      case 'about':
        return <User className="w-4 h-4 text-emerald-400" />;
      case 'projects':
        return <FolderKanban className="w-4 h-4 text-cyan-400" />;
      case 'services':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'testimonials':
        return <Quote className="w-4 h-4 text-amber-400" />;
      case 'contact':
        return <Mail className="w-4 h-4 text-[#FF9D00]" />;
      case 'footer':
      default:
        return <Layout className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#120a08] text-white select-none">
      <div className="p-3 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          Page Sections
        </span>
        <p className="text-[10px] text-neutral-500 mt-0.5">
          Click any section to smooth scroll canvas into view
        </p>
      </div>

      <div className="p-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
        {layout.sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <div
              key={section.id}
              onClick={() => onScrollToSection(section.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#F4510B]/20 border-[#F4510B] text-white shadow-sm'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-neutral-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center">
                  {getSectionIcon(section.id)}
                </div>
                <div>
                  <div className="text-xs font-semibold">{section.name}</div>
                  <div className="text-[10px] text-neutral-500">
                    {section.elementIds.length} Layers
                  </div>
                </div>
              </div>

              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
