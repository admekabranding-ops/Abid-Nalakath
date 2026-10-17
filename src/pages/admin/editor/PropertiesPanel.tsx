import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import type { VisualElement, ElementStyles } from './editorTypes';

interface PropertiesPanelProps {
  element: VisualElement | null;
  onUpdateStyles: (styles: Partial<ElementStyles>) => void;
  onUpdateContent: (content: Record<string, any>) => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdateStyles,
  onUpdateContent,
  onToggleLock,
  onToggleVisibility,
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'responsive'>('design');

  if (!element) {
    return (
      <div className="w-80 h-full bg-[#120a08] border-l border-white/10 p-6 flex flex-col items-center justify-center text-center text-neutral-500 select-none">
        <Sliders className="w-10 h-10 mb-3 opacity-30 text-[#FF9D00]" />
        <span className="text-xs font-semibold text-neutral-400">No Element Selected</span>
        <p className="text-[11px] text-neutral-500 mt-1 max-w-[200px]">
          Click on any text, button, card, image or layer on the canvas to inspect &amp; edit its properties
        </p>
      </div>
    );
  }

  const { styles = {}, content = {} } = element;

  // Brand Palette Swatches
  const colorSwatches = [
    '#F4510B', // Vibrant Orange
    '#FF9D00', // Golden Orange
    '#C63D08', // Burnt Orange
    '#651B0D', // Deep Reddish Brown
    '#3A160F', // Dark Warm Brown
    '#FFFFFF', // Pure White
    '#F7F6F4', // Soft White
    '#151515', // Dark Neutral
    '#686868', // Muted Gray
    '#000000', // Black
  ];

  const gradientPresets = [
    {
      name: 'Hero Orange Gradient',
      value: 'linear-gradient(135deg, #3A160F 0%, #651B0D 25%, #C63D08 60%, #F4510B 85%, #FF9D00 100%)',
    },
    {
      name: 'Vibrant Glow',
      value: 'linear-gradient(90deg, #F4510B 0%, #FF9D00 100%)',
    },
    {
      name: 'Obsidian Warm Dark',
      value: 'linear-gradient(180deg, #180c09 0%, #0d0605 100%)',
    },
    {
      name: 'Stats Section Gradient',
      value: 'linear-gradient(90deg, #200d07 0%, #33140b 50%, #200d07 100%)',
    },
    {
      name: 'Transparent',
      value: 'transparent',
    },
  ];

  const shadowPresets = [
    { name: 'None', value: 'none' },
    { name: 'Soft Warm Glow', value: '0 8px 30px rgba(244, 81, 11, 0.25)' },
    { name: 'Intense Button Glow', value: '0 0 25px rgba(244, 81, 11, 0.5)' },
    { name: 'Deep Card Shadow', value: '0 20px 60px rgba(0, 0, 0, 0.6)' },
    { name: 'Light Card Elevation', value: '0 4px 20px rgba(0, 0, 0, 0.08)' },
  ];

  return (
    <div className="w-80 h-full bg-[#120a08] border-l border-white/10 flex flex-col text-white select-none overflow-hidden">
      {/* Element Header */}
      <div className="p-3.5 border-b border-white/10 space-y-2 bg-[#170c09]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <span className="px-1.5 py-0.5 rounded bg-[#F4510B]/20 text-[#FF9D00] text-[10px] font-mono uppercase font-bold tracking-wider">
              {element.type}
            </span>
            <span className="text-xs font-bold text-white truncate">
              {element.name}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onToggleLock}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                element.locked ? 'text-[#FF9D00]' : 'text-neutral-400'
              }`}
              title={element.locked ? 'Locked' : 'Unlocked'}
            >
              {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onToggleVisibility}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                element.hidden ? 'text-red-400' : 'text-neutral-400'
              }`}
              title={element.hidden ? 'Hidden' : 'Visible'}
            >
              {element.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tabs: Design, Content, Responsive */}
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('design')}
            className={`py-1 rounded font-medium transition-all ${
              activeTab === 'design' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-1 rounded font-medium transition-all ${
              activeTab === 'content' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('responsive')}
            className={`py-1 rounded font-medium transition-all ${
              activeTab === 'responsive' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Adaptive
          </button>
        </div>
      </div>

      {/* Main Inspector Form Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 custom-scrollbar text-xs">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Text content if text or heading */}
            {(element.type === 'text' || element.type === 'heading' || element.type === 'button' || element.type === 'badge') && (
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Text Content
                </label>
                <textarea
                  rows={4}
                  value={content.text || ''}
                  onChange={(e) => onUpdateContent({ text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                />
              </div>
            )}

            {/* Target URL if button */}
            {element.type === 'button' && (
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Link / Target Anchor
                </label>
                <input
                  type="text"
                  value={content.linkUrl || '#projects'}
                  onChange={(e) => onUpdateContent({ linkUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                />
              </div>
            )}

            {/* Image src if image element */}
            {element.type === 'image' && (
              <div className="space-y-3">
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Image Source
                </label>
                <input
                  type="text"
                  value={content.imageSrc || ''}
                  onChange={(e) => onUpdateContent({ imageSrc: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                />
                {content.imageSrc && (
                  <div className="h-28 w-full rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={content.imageSrc}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Stat card fields */}
            {element.type === 'stat' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                    Metric Value
                  </label>
                  <input
                    type="text"
                    value={content.statValue || ''}
                    onChange={(e) => onUpdateContent({ statValue: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={content.statLabel || ''}
                    onChange={(e) => onUpdateContent({ statLabel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <span className="font-semibold text-xs text-white block">
                Viewport Visibility
              </span>
              <p className="text-[11px] text-neutral-400">
                Choose which screen sizes this element appears on:
              </p>

              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Show on Desktop</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={styles.display !== 'none'}
                    onChange={(e) => onUpdateStyles({ display: e.target.checked ? 'block' : 'none' })}
                    className="rounded accent-[#F4510B]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <Tablet className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Show on Tablet</span>
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded accent-[#F4510B]"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Show on Mobile</span>
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded accent-[#F4510B]"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-5">
            {/* 1. POSITION & DIMENSIONS */}
            <div className="space-y-2.5">
              <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                Dimensions &amp; Position
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">WIDTH (W)</label>
                  <input
                    type="text"
                    value={styles.width || 'auto'}
                    onChange={(e) => onUpdateStyles({ width: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">HEIGHT (H)</label>
                  <input
                    type="text"
                    value={styles.height || 'auto'}
                    onChange={(e) => onUpdateStyles({ height: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">OFFSET X</label>
                  <input
                    type="number"
                    value={styles.x || 0}
                    onChange={(e) => onUpdateStyles({ x: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">OFFSET Y</label>
                  <input
                    type="number"
                    value={styles.y || 0}
                    onChange={(e) => onUpdateStyles({ y: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F4510B]"
                  />
                </div>
              </div>

              {/* Opacity Slider */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mb-1">
                  <span>OPACITY</span>
                  <span>{Math.round((styles.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={styles.opacity ?? 1}
                  onChange={(e) => onUpdateStyles({ opacity: Number(e.target.value) })}
                  className="w-full accent-[#F4510B] cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* 2. TYPOGRAPHY (If applicable) */}
            {(element.type === 'heading' || element.type === 'text' || element.type === 'button' || element.type === 'badge') && (
              <div className="space-y-3">
                <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                  Typography
                </span>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-neutral-500 font-mono mb-1 block">SIZE</label>
                    <input
                      type="text"
                      value={styles.fontSize || '16px'}
                      onChange={(e) => onUpdateStyles({ fontSize: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F4510B]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 font-mono mb-1 block">WEIGHT</label>
                    <select
                      value={styles.fontWeight || '400'}
                      onChange={(e) => onUpdateStyles({ fontWeight: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#F4510B]"
                    >
                      <option value="300">Light 300</option>
                      <option value="400">Regular 400</option>
                      <option value="500">Medium 500</option>
                      <option value="600">SemiBold 600</option>
                      <option value="700">Bold 700</option>
                      <option value="800">ExtraBold 800</option>
                    </select>
                  </div>
                </div>

                {/* Alignment & Transform */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
                    <button
                      onClick={() => onUpdateStyles({ textAlign: 'left' })}
                      className={`p-1.5 rounded ${styles.textAlign === 'left' ? 'bg-white/20 text-white' : 'text-neutral-400'}`}
                      title="Align Left"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateStyles({ textAlign: 'center' })}
                      className={`p-1.5 rounded ${styles.textAlign === 'center' ? 'bg-white/20 text-white' : 'text-neutral-400'}`}
                      title="Align Center"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateStyles({ textAlign: 'right' })}
                      className={`p-1.5 rounded ${styles.textAlign === 'right' ? 'bg-white/20 text-white' : 'text-neutral-400'}`}
                      title="Align Right"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateStyles({ textAlign: 'justify' })}
                      className={`p-1.5 rounded ${styles.textAlign === 'justify' ? 'bg-white/20 text-white' : 'text-neutral-400'}`}
                      title="Justify"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <select
                    value={styles.textTransform || 'none'}
                    onChange={(e) => onUpdateStyles({ textTransform: e.target.value as any })}
                    className="px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  >
                    <option value="none">Normal Case</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1.5 block">TEXT COLOR</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={styles.color || '#FFFFFF'}
                      onChange={(e) => onUpdateStyles({ color: e.target.value })}
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styles.color || '#FFFFFF'}
                      onChange={(e) => onUpdateStyles({ color: e.target.value })}
                      className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-xs"
                    />
                  </div>

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1.5">
                    {colorSwatches.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateStyles({ color })}
                        style={{ backgroundColor: color }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-white/10" />

            {/* 3. FILLS & BACKGROUNDS */}
            <div className="space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                Fill &amp; Background
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#000000'}
                  onChange={(e) => onUpdateStyles({ backgroundColor: e.target.value, backgroundGradient: '' })}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="e.g. #F4510B or rgba(...)"
                  value={styles.backgroundColor || ''}
                  onChange={(e) => onUpdateStyles({ backgroundColor: e.target.value, backgroundGradient: '' })}
                  className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-xs"
                />
              </div>

              {/* Gradient Presets */}
              <div>
                <label className="text-[10px] text-neutral-500 font-mono mb-1 block">GRADIENT PRESETS</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {gradientPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => onUpdateStyles({ backgroundGradient: preset.value })}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-left truncate text-neutral-300 hover:text-white transition-colors"
                      title={preset.name}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* 4. BORDERS & CORNER RADIUS */}
            <div className="space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                Borders &amp; Radius
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">BORDER WIDTH</label>
                  <input
                    type="text"
                    value={styles.borderWidth || '0px'}
                    onChange={(e) => onUpdateStyles({ borderWidth: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">RADIUS (R)</label>
                  <input
                    type="text"
                    value={styles.borderRadius || '0px'}
                    onChange={(e) => onUpdateStyles({ borderRadius: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-500 font-mono mb-1 block">BORDER COLOR</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.borderColor || '#F4510B'}
                    onChange={(e) => onUpdateStyles({ borderColor: e.target.value, borderStyle: 'solid' })}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.borderColor || ''}
                    onChange={(e) => onUpdateStyles({ borderColor: e.target.value, borderStyle: 'solid' })}
                    className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* 5. SHADOWS & EFFECTS */}
            <div className="space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                Shadows &amp; Glow Effects
              </span>

              <div className="space-y-1.5">
                {shadowPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateStyles({ boxShadow: preset.value })}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      styles.boxShadow === preset.value
                        ? 'bg-[#F4510B]/20 border-[#F4510B] text-white'
                        : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <Sparkles className="w-3 h-3 text-[#FF9D00]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* 6. PADDING & SPACING */}
            <div className="space-y-3">
              <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 block">
                Padding &amp; Margin
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">PADDING TOP/BOTTOM</label>
                  <input
                    type="text"
                    value={styles.paddingTop || '0px'}
                    onChange={(e) => onUpdateStyles({ paddingTop: e.target.value, paddingBottom: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-mono mb-1 block">PADDING LEFT/RIGHT</label>
                  <input
                    type="text"
                    value={styles.paddingLeft || '0px'}
                    onChange={(e) => onUpdateStyles({ paddingLeft: e.target.value, paddingRight: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
