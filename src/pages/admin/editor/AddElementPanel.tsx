import React, { useState } from 'react';
import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  MousePointer,
  Square,
  Circle,
  Minus,
  Sparkles,
  TrendingUp,
  Share2,
  Plus,
} from 'lucide-react';
import type { VisualElement, ElementType } from './editorTypes';

interface AddElementPanelProps {
  onAddElement: (element: VisualElement, targetSectionId: string) => void;
  activeSectionId: string;
}

interface ComponentPreset {
  type: ElementType;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultElement: Omit<VisualElement, 'id' | 'section'>;
}

export const AddElementPanel: React.FC<AddElementPanelProps> = ({
  onAddElement,
  activeSectionId,
}) => {
  const [selectedSection, setSelectedSection] = useState(activeSectionId || 'hero');

  const presets: ComponentPreset[] = [
    {
      type: 'heading',
      title: 'Editorial Headline',
      description: 'Oversized, lightweight editorial sans headline',
      icon: <Type className="w-5 h-5 text-[#F4510B]" />,
      defaultElement: {
        name: 'New Headline',
        type: 'heading',
        styles: {
          fontSize: '44px',
          fontWeight: '300',
          fontFamily: 'Outfit, sans-serif',
          color: '#FFFFFF',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        },
        content: {
          text: 'Crafting Iconic Visual Distinction.',
        },
      },
    },
    {
      type: 'text',
      title: 'Paragraph / Subtitle',
      description: 'Clean readable descriptive text block',
      icon: <AlignLeft className="w-5 h-5 text-[#FF9D00]" />,
      defaultElement: {
        name: 'New Paragraph',
        type: 'text',
        styles: {
          fontSize: '15px',
          fontWeight: '400',
          color: '#A3A3A3',
          lineHeight: '1.6',
          marginBottom: '16px',
          maxWidth: '540px',
        },
        content: {
          text: 'Helping modern ventures communicate better through thoughtful design, deliberate typography, and high-impact visual branding.',
        },
      },
    },
    {
      type: 'button',
      title: 'Pill CTA Button',
      description: 'Rounded pill button with warm orange glow',
      icon: <MousePointer className="w-5 h-5 text-emerald-400" />,
      defaultElement: {
        name: 'Pill Action Button',
        type: 'button',
        styles: {
          fontSize: '13px',
          fontWeight: '600',
          color: '#151515',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '24px',
          paddingRight: '24px',
          boxShadow: '0 8px 25px rgba(244, 81, 11, 0.35)',
          display: 'inline-block',
        },
        content: {
          text: 'Explore Portfolio',
          linkUrl: '#projects',
        },
      },
    },
    {
      type: 'image',
      title: 'Image / Cutout Frame',
      description: 'Photo container or transparent cutout element',
      icon: <ImageIcon className="w-5 h-5 text-cyan-400" />,
      defaultElement: {
        name: 'Image Element',
        type: 'image',
        styles: {
          width: '320px',
          height: '240px',
          borderRadius: '20px',
          objectFit: 'cover',
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderStyle: 'solid',
        },
        content: {
          imageSrc: '/assets/projects/project-1.jpg',
          altText: 'Custom Image',
        },
      },
    },
    {
      type: 'stat',
      title: 'Statistics Card',
      description: 'White floating stat card with icon & bold number',
      icon: <TrendingUp className="w-5 h-5 text-[#FF9D00]" />,
      defaultElement: {
        name: 'Custom Stat Card',
        type: 'stat',
        styles: {
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          paddingTop: '14px',
          paddingBottom: '14px',
          paddingLeft: '16px',
          paddingRight: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
          width: '140px',
        },
        content: {
          statValue: '99%',
          statLabel: 'Client Satisfaction',
        },
      },
    },
    {
      type: 'badge',
      title: 'Outlined Status Badge',
      description: 'Pill badge with animated pulsing indicator',
      icon: <Sparkles className="w-5 h-5 text-[#F4510B]" />,
      defaultElement: {
        name: 'Status Badge',
        type: 'badge',
        styles: {
          fontSize: '11px',
          fontWeight: '500',
          color: '#FFFFFF',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '9999px',
          paddingTop: '4px',
          paddingBottom: '4px',
          paddingLeft: '12px',
          paddingRight: '12px',
          display: 'inline-block',
        },
        content: {
          text: 'Available Worldwide • Q1 Collaborations',
        },
      },
    },
    {
      type: 'container',
      title: 'Card Container',
      description: 'Dark obsidian card box with orange border accent',
      icon: <Square className="w-5 h-5 text-neutral-300" />,
      defaultElement: {
        name: 'Obsidian Card Box',
        type: 'container',
        styles: {
          backgroundColor: '#140a07',
          borderColor: 'rgba(244, 81, 11, 0.25)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '24px',
          paddingTop: '28px',
          paddingBottom: '28px',
          paddingLeft: '28px',
          paddingRight: '28px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        },
        content: {
          text: 'Custom container card box',
        },
      },
    },
    {
      type: 'circle',
      title: 'Glowing Radial Orb',
      description: 'Warm golden/orange blurred lighting orb',
      icon: <Circle className="w-5 h-5 text-[#FF9D00]" />,
      defaultElement: {
        name: 'Radial Glow Orb',
        type: 'circle',
        styles: {
          width: '260px',
          height: '260px',
          borderRadius: '9999px',
          backgroundGradient: 'radial-gradient(circle, rgba(255, 157, 0, 0.35) 0%, rgba(244, 81, 11, 0.15) 50%, transparent 70%)',
          positionMode: 'absolute',
          opacity: 0.8,
        },
        content: {
          text: 'Ambient glow orb',
        },
      },
    },
    {
      type: 'divider',
      title: 'Accent Divider Line',
      description: 'Warm subtle horizontal separator',
      icon: <Minus className="w-5 h-5 text-neutral-400" />,
      defaultElement: {
        name: 'Divider Line',
        type: 'divider',
        styles: {
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(244, 81, 11, 0.25)',
          marginTop: '20px',
          marginBottom: '20px',
        },
        content: {},
      },
    },
    {
      type: 'social_group',
      title: 'Social Profile Links',
      description: 'Connected Instagram, LinkedIn and Dribbble buttons',
      icon: <Share2 className="w-5 h-5 text-neutral-300" />,
      defaultElement: {
        name: 'Social Links Group',
        type: 'social_group',
        styles: {
          display: 'flex',
          gap: '12px',
        },
        content: {
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          dribbble: 'https://dribbble.com',
        },
      },
    },
  ];

  const handleInsert = (preset: ComponentPreset) => {
    const newElement: VisualElement = {
      ...preset.defaultElement,
      id: `custom_${preset.type}_${Date.now().toString().slice(-5)}`,
      section: selectedSection,
      isCustom: true,
      locked: false,
      hidden: false,
    };

    onAddElement(newElement, selectedSection);
  };

  return (
    <div className="flex flex-col h-full bg-[#120a08] text-white select-none">
      {/* Header */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Add Elements
          </span>
          <span className="text-[10px] text-neutral-400">Click to insert</span>
        </div>

        {/* Section Target Selector */}
        <div>
          <label className="block text-[10px] text-neutral-400 font-semibold uppercase mb-1">
            Insert Into Section:
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F4510B]"
          >
            <option value="hero">Hero Section</option>
            <option value="stats">Stats Bar</option>
            <option value="about">About Section</option>
            <option value="projects">Projects Section</option>
            <option value="services">Services Section</option>
            <option value="contact">Contact Section</option>
            <option value="footer">Footer</option>
          </select>
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {presets.map((preset, idx) => (
          <div
            key={idx}
            onClick={() => handleInsert(preset)}
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#F4510B]/50 hover:bg-[#F4510B]/10 cursor-pointer transition-all group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {preset.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white group-hover:text-[#FF9D00] transition-colors truncate">
                  {preset.title}
                </span>
                <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                {preset.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
