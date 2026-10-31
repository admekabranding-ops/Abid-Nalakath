import React, { useState } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import { 
  X, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Layers, 
  Sliders, 
  Upload, 
  Check,
  ExternalLink,
  Palette,
  RotateCcw
} from 'lucide-react';

interface PropertiesPanelProps {
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
}

const COLOR_PRESETS = [
  { name: 'Pure White', color: '#FFFFFF' },
  { name: 'Signature Orange', color: '#FF5A1F' },
  { name: 'Warm Amber', color: '#F59E0B' },
  { name: 'Soft Muted', color: '#9CA3AF' },
  { name: 'Electric Cyan', color: '#06B6D4' },
  { name: 'Vivid Rose', color: '#F43F5E' },
  { name: 'Neon Purple', color: '#A855F7' },
  { name: 'Emerald Green', color: '#10B981' },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onOpenMediaLibrary }) => {
  const {
    selectedElement,
    setSelectedElement,
    content,
    updateField,
    updateElementColor,
    removeElementColor,
  } = usePortfolioContent();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  if (!selectedElement) {
    return (
      <aside className="w-80 h-full bg-[#121212] border-l border-white/10 flex flex-col items-center justify-center p-6 text-center text-white/40">
        <Sliders className="w-10 h-10 mb-3 text-white/20" />
        <p className="text-sm font-semibold text-white/60">No Element Selected</p>
        <p className="text-xs mt-1 text-white/40 leading-relaxed max-w-[200px]">
          Click on any text, image, card, or button on the live canvas to edit its properties.
        </p>
      </aside>
    );
  }

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1200);
  };

  // Helper to read current value from content
  const getValue = () => {
    const parts = selectedElement.propertyPath.split('.');
    let curr: any = content;
    for (const p of parts) {
      if (curr === undefined || curr === null) return '';
      curr = curr[p];
    }
    return curr !== undefined ? curr : '';
  };

  const currentValue = getValue();

  // Helper to read current active custom color
  const getActiveColor = () => {
    if (!selectedElement) return '';
    if (content.customColors?.[selectedElement.id]) {
      return content.customColors[selectedElement.id];
    }
    const parts = (selectedElement.propertyPath + 'Color').split('.');
    let curr: any = content;
    for (const p of parts) {
      if (curr === undefined || curr === null) return '';
      curr = curr[p];
    }
    return typeof curr === 'string' ? curr : '';
  };

  const activeColor = getActiveColor();

  const handleColorChange = (newColor: string) => {
    if (!selectedElement) return;
    updateElementColor(selectedElement.id, newColor, selectedElement.propertyPath);
    triggerToast();
  };

  const handleResetColor = () => {
    if (!selectedElement) return;
    removeElementColor(selectedElement.id, selectedElement.propertyPath);
    triggerToast();
  };

  // Handle direct file upload from computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            category: selectedElement.section === 'hero' ? 'Hero Images' : 'General Media',
          }),
        });
        const data = await res.json();
        if (data.success && data.asset) {
          updateField(selectedElement.propertyPath, data.asset.url);
          triggerToast();
        }
        setUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      setUploadLoading(false);
    }
  };

  return (
    <aside className="w-80 h-full bg-[#121212] border-l border-white/10 flex flex-col shadow-2xl z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F]">
            {selectedElement.type === 'text' && <Type className="w-4 h-4" />}
            {selectedElement.type === 'image' && <ImageIcon className="w-4 h-4" />}
            {selectedElement.type === 'button' && <Square className="w-4 h-4" />}
            {selectedElement.type === 'card' && <Layers className="w-4 h-4" />}
            {selectedElement.type === 'section' && <Sliders className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide uppercase line-clamp-1">
              {selectedElement.label}
            </h3>
            <span className="text-[10px] text-white/40 font-mono">
              {selectedElement.section}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedElement(null)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
          title="Deselect"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Properties Form */}
      <div className="p-5 space-y-6 flex-1">
        {/* TEXT ELEMENT CONTROLS */}
        {selectedElement.type === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Text Content
              </label>
              <textarea
                value={String(currentValue || '')}
                onChange={(e) => {
                  updateField(selectedElement.propertyPath, e.target.value);
                  triggerToast();
                }}
                rows={selectedElement.options?.multiline ? 4 : 2}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-sm text-white placeholder-white/30 focus:outline-none transition-colors leading-relaxed"
                placeholder="Enter text..."
              />
            </div>

            {/* Typography Quick Color */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Text Color</span>
                </label>
                {activeColor && (
                  <button
                    type="button"
                    onClick={handleResetColor}
                    className="text-[10px] text-white/40 hover:text-white/80 flex items-center gap-1 transition-colors"
                    title="Reset to default theme color"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Color Presets Grid */}
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((item) => {
                  const isSelected = activeColor?.toUpperCase() === item.color.toUpperCase();
                  return (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => handleColorChange(item.color)}
                      className={`h-8 rounded-lg border transition-all flex items-center justify-center relative group ${
                        isSelected
                          ? 'border-white scale-105 shadow-md shadow-black/50 ring-2 ring-white/30'
                          : 'border-white/10 hover:border-white/30 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${item.color === '#FFFFFF' ? 'text-black' : 'text-white'} drop-shadow`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom HEX Picker Row */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={activeColor || '#FFFFFF'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                    title="Choose custom color from spectrum"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: activeColor || '#FFFFFF' }}
                  />
                </div>

                <input
                  type="text"
                  value={activeColor || ''}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="e.g. #FF5A1F"
                  maxLength={7}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-xs font-mono text-white placeholder-white/30 focus:outline-none transition-colors uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* IMAGE ELEMENT CONTROLS */}
        {selectedElement.type === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Current Image
              </label>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-3 group">
                <img
                  src={String(currentValue || '/hero.png')}
                  alt="Element preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenMediaLibrary((url) => {
                      updateField(selectedElement.propertyPath, url);
                      triggerToast();
                    })}
                    className="px-2.5 py-1 rounded bg-[#FF5A1F] text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMediaLibrary((url) => {
                    updateField(selectedElement.propertyPath, url);
                    triggerToast();
                  })}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Media Library</span>
                </button>

                <label className="px-3 py-2 rounded-xl bg-[#FF5A1F]/15 hover:bg-[#FF5A1F]/25 border border-[#FF5A1F]/40 text-xs font-semibold text-[#FF5A1F] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadLoading ? 'Uploading...' : 'Upload PC'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                </label>
              </div>
            </div>

            {/* Direct Image URL input */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Image URL / Path
              </label>
              <input
                type="text"
                value={String(currentValue || '')}
                onChange={(e) => {
                  updateField(selectedElement.propertyPath, e.target.value);
                  triggerToast();
                }}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-xs text-white focus:outline-none transition-colors"
                placeholder="e.g. /images/... or https://..."
              />
            </div>
          </div>
        )}

        {/* BUTTON ELEMENT CONTROLS */}
        {selectedElement.type === 'button' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Button Label
              </label>
              <input
                type="text"
                value={String(currentValue || '')}
                onChange={(e) => {
                  updateField(selectedElement.propertyPath, e.target.value);
                  triggerToast();
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-sm text-white focus:outline-none transition-colors"
                placeholder="Button label..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Destination Link / Anchor
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={String(
                    selectedElement.id === 'btn-view-work'
                      ? content.personalInfo.viewWorkLink
                      : selectedElement.id === 'btn-lets-talk'
                      ? content.personalInfo.letsTalkLink
                      : '#contact'
                  )}
                  onChange={(e) => {
                    const linkPath =
                      selectedElement.id === 'btn-view-work'
                        ? 'personalInfo.viewWorkLink'
                        : selectedElement.id === 'btn-lets-talk'
                        ? 'personalInfo.letsTalkLink'
                        : selectedElement.propertyPath + 'Link';
                    updateField(linkPath, e.target.value);
                    triggerToast();
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-xs text-white focus:outline-none transition-colors"
                  placeholder="#projects or https://..."
                />
                <a
                  href={String(content.personalInfo.viewWorkLink || '#')}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  title="Test link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Button Color Override */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Button Text / Accent Color</span>
                </label>
                {activeColor && (
                  <button
                    type="button"
                    onClick={handleResetColor}
                    className="text-[10px] text-white/40 hover:text-white/80 flex items-center gap-1 transition-colors"
                    title="Reset to default theme color"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Color Presets Grid */}
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((item) => {
                  const isSelected = activeColor?.toUpperCase() === item.color.toUpperCase();
                  return (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => handleColorChange(item.color)}
                      className={`h-8 rounded-lg border transition-all flex items-center justify-center relative group ${
                        isSelected
                          ? 'border-white scale-105 shadow-md shadow-black/50 ring-2 ring-white/30'
                          : 'border-white/10 hover:border-white/30 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${item.color === '#FFFFFF' ? 'text-black' : 'text-white'} drop-shadow`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom HEX Picker Row */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={activeColor || '#FFFFFF'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="absolute -inset-2 w-12 h-12 cursor-pointer opacity-0"
                    title="Choose custom color from spectrum"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: activeColor || '#FFFFFF' }}
                  />
                </div>

                <input
                  type="text"
                  value={activeColor || ''}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="e.g. #FF5A1F"
                  maxLength={7}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-xs font-mono text-white placeholder-white/30 focus:outline-none transition-colors uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* CARD ELEMENT CONTROLS */}
        {selectedElement.type === 'card' && (
          <div className="space-y-4">
            <p className="text-xs text-white/60 leading-relaxed">
              To customize complete cards, add new deliverables, or reorder items, use the dedicated{' '}
              <span className="text-[#FF5A1F] font-semibold">Manage Projects</span> or{' '}
              <span className="text-[#FF5A1F] font-semibold">Manage Services</span> dashboards.
            </p>
          </div>
        )}
      </div>

      {/* Save Toast Indicator */}
      {saveToast && (
        <div className="p-3 bg-emerald-950/80 border-t border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-1.5 font-semibold animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Draft Updated</span>
        </div>
      )}
    </aside>
  );
};
