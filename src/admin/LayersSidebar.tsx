import React, { useState } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import { 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Folder, 
  FolderOpen 
} from 'lucide-react';

export const LayersSidebar: React.FC = () => {
  const {
    content,
    selectedElement,
    setSelectedElement,
    updateContent,
  } = usePortfolioContent();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    about: true,
    services: false,
    portfolio: false,
    process: false,
    contact: false,
  });

  const toggleExpand = (sec: string) => {
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const toggleVisibility = (secKey: keyof typeof content.sectionVisibility, e: React.MouseEvent) => {
    e.stopPropagation();
    updateContent((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [secKey]: !prev.sectionVisibility[secKey],
      },
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-72 h-full bg-[#121212] border-r border-white/10 flex flex-col shadow-2xl z-20 select-none overflow-hidden">
      {/* Title */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121212]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#FF5A1F]" />
          <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Layers & Sections
          </h3>
        </div>
        <span className="text-[10px] font-mono text-white/40">Tree View</span>
      </div>

      {/* Layer Tree List */}
      <div className="p-2 space-y-1 overflow-y-auto flex-1 font-sans text-xs">
        {/* 1. HERO / HOME SECTION */}
        <div className="rounded-xl overflow-hidden bg-white/[0.02]">
          <div
            onClick={() => {
              toggleExpand('hero');
              scrollToSection('home');
            }}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
          >
            <div className="flex items-center gap-2">
              {expandedSections.hero ? (
                <FolderOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
              )}
              <span className="font-semibold text-white">Home / Hero</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => toggleVisibility('hero', e)}
                className="text-white/30 hover:text-white"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.hero ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-red-400" />
                )}
              </button>
              {expandedSections.hero ? (
                <ChevronDown className="w-3 h-3 text-white/40" />
              ) : (
                <ChevronRight className="w-3 h-3 text-white/40" />
              )}
            </div>
          </div>

          {expandedSections.hero && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-white/5 ml-4 mb-1">
              {/* Portrait */}
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'hero-portrait',
                    section: 'hero',
                    type: 'image',
                    label: 'Hero Portrait Image',
                    propertyPath: 'personalInfo.portraitUrl',
                    currentValue: content.personalInfo.portraitUrl,
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'hero-portrait'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3 h-3 shrink-0" />
                <span className="truncate">Main Portrait</span>
              </div>

              {/* Intro */}
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'hero-intro',
                    section: 'hero',
                    type: 'text',
                    label: 'Hero Intro Badge',
                    propertyPath: 'personalInfo.heroIntro',
                    currentValue: content.personalInfo.heroIntro,
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'hero-intro'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Type className="w-3 h-3 shrink-0" />
                <span className="truncate">Intro: "{content.personalInfo.heroIntro}"</span>
              </div>

              {/* Heading */}
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'hero-heading',
                    section: 'hero',
                    type: 'text',
                    label: 'Hero Main Heading',
                    propertyPath: 'personalInfo.heroHeading',
                    currentValue: content.personalInfo.heroHeading,
                    options: { multiline: true },
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'hero-heading'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Type className="w-3 h-3 shrink-0 text-[#FF5A1F]" />
                <span className="truncate">Heading: "Creative Designer"</span>
              </div>

              {/* Description */}
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'hero-supporting',
                    section: 'hero',
                    type: 'text',
                    label: 'Hero Description',
                    propertyPath: 'personalInfo.heroSupporting',
                    currentValue: content.personalInfo.heroSupporting,
                    options: { multiline: true },
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'hero-supporting'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Type className="w-3 h-3 shrink-0" />
                <span className="truncate">Description text</span>
              </div>

              {/* Buttons */}
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'btn-view-work',
                    section: 'hero',
                    type: 'button',
                    label: 'View My Work CTA',
                    propertyPath: 'personalInfo.viewWorkText',
                    currentValue: content.personalInfo.viewWorkText,
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'btn-view-work'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Square className="w-3 h-3 shrink-0" />
                <span className="truncate">Button: View My Work</span>
              </div>

              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'btn-lets-talk',
                    section: 'hero',
                    type: 'button',
                    label: "Let's Talk CTA",
                    propertyPath: 'personalInfo.letsTalkText',
                    currentValue: content.personalInfo.letsTalkText,
                  });
                  scrollToSection('home');
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  selectedElement?.id === 'btn-lets-talk'
                    ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] font-semibold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Square className="w-3 h-3 shrink-0" />
                <span className="truncate">Button: Let's Talk</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. CREATIVE CORE */}
        <div
          onClick={() => scrollToSection('capabilities')}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
            <span className="font-semibold text-white">Creative Core</span>
          </div>
          <button
            type="button"
            onClick={(e) => toggleVisibility('capabilities', e)}
            className="text-white/30 hover:text-white"
          >
            {content.sectionVisibility.capabilities ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>

        {/* 3. ABOUT SECTION */}
        <div className="rounded-xl overflow-hidden bg-white/[0.02]">
          <div
            onClick={() => {
              toggleExpand('about');
              scrollToSection('about');
            }}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
          >
            <div className="flex items-center gap-2">
              {expandedSections.about ? (
                <FolderOpen className="w-3.5 h-3.5 text-[#FF5A1F]" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
              )}
              <span className="font-semibold text-white">About Me</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => toggleVisibility('about', e)}
                className="text-white/30 hover:text-white"
              >
                {content.sectionVisibility.about ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
              </button>
              {expandedSections.about ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronRight className="w-3 h-3 text-white/40" />}
            </div>
          </div>

          {expandedSections.about && (
            <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-white/5 ml-4 mb-1">
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'about-headline',
                    section: 'about',
                    type: 'text',
                    label: 'About Main Headline',
                    propertyPath: 'personalInfo.aboutHeadline',
                    currentValue: content.personalInfo.aboutHeadline,
                    options: { multiline: true },
                  });
                  scrollToSection('about');
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-white/60 hover:bg-white/5 hover:text-white"
              >
                <Type className="w-3 h-3 shrink-0" />
                <span className="truncate">Headline</span>
              </div>
              <div
                onClick={() => {
                  setSelectedElement({
                    id: 'about-bio',
                    section: 'about',
                    type: 'text',
                    label: 'About Bio Paragraph',
                    propertyPath: 'personalInfo.aboutBio',
                    currentValue: content.personalInfo.aboutBio,
                    options: { multiline: true },
                  });
                  scrollToSection('about');
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-white/60 hover:bg-white/5 hover:text-white"
              >
                <Type className="w-3 h-3 shrink-0" />
                <span className="truncate">Bio Paragraph</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. SERVICES */}
        <div
          onClick={() => scrollToSection('services')}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
            <span className="font-semibold text-white">Services ({content.servicesData.length})</span>
          </div>
          <button
            type="button"
            onClick={(e) => toggleVisibility('services', e)}
            className="text-white/30 hover:text-white"
          >
            {content.sectionVisibility.services ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>

        {/* 5. PORTFOLIO */}
        <div
          onClick={() => scrollToSection('projects')}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
            <span className="font-semibold text-white">Portfolio ({content.portfolioProjects.length})</span>
          </div>
          <button
            type="button"
            onClick={(e) => toggleVisibility('portfolio', e)}
            className="text-white/30 hover:text-white"
          >
            {content.sectionVisibility.portfolio ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>

        {/* 6. PROCESS */}
        <div
          onClick={() => scrollToSection('process')}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
            <span className="font-semibold text-white">Process</span>
          </div>
          <button
            type="button"
            onClick={(e) => toggleVisibility('process', e)}
            className="text-white/30 hover:text-white"
          >
            {content.sectionVisibility.process ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>

        {/* 7. CONTACT */}
        <div
          onClick={() => scrollToSection('contact')}
          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 group"
        >
          <div className="flex items-center gap-2">
            <Folder className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F]" />
            <span className="font-semibold text-white">Contact & Social</span>
          </div>
          <button
            type="button"
            onClick={(e) => toggleVisibility('contact', e)}
            className="text-white/30 hover:text-white"
          >
            {content.sectionVisibility.contact ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
