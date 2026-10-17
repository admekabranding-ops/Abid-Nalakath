import React, { useRef } from 'react';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Save,
  Send,
  RotateCcw,
  Download,
  Upload,
  Grid,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import type { ViewportMode } from './editorTypes';

interface EditorToolbarProps {
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  previewMode: boolean;
  onTogglePreview: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isDirty: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onResetDefault: () => void;
  onExportBackup: () => void;
  onImportBackup: (json: any) => void;
  onExit: () => void;
  savingDraft: boolean;
  publishing: boolean;
  statusMessage?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  previewMode,
  onTogglePreview,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isDirty,
  onSaveDraft,
  onPublish,
  onResetDefault,
  onExportBackup,
  onImportBackup,
  onExit,
  savingDraft,
  publishing,
  statusMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportBackup(json);
      } catch (err) {
        alert('Invalid visual layout backup file: ' + err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-14 bg-[#120a08] border-b border-white/10 px-4 flex items-center justify-between select-none z-30 flex-shrink-0">
      {/* LEFT: Branding, Title, Status & History */}
      <div className="flex items-center gap-4">
        {/* Exit back to dashboard */}
        <button
          onClick={onExit}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
          title="Return to Admin Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center p-1 text-white shadow-glow-orange">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-xs tracking-wider text-white uppercase">
              Visual Design Studio
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Abid Nalakath Portfolio Canvas
            </span>
          </div>
        </div>

        {/* Unsaved / Saved Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isDirty ? 'bg-[#FF9D00] animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className={isDirty ? 'text-[#FF9D00]' : 'text-emerald-400'}>
            {isDirty ? 'Unsaved Changes' : 'Synced'}
          </span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-white/10 my-auto" />
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CENTER: Viewport Device Switcher & Zoom */}
      <div className="flex items-center gap-3">
        {/* Viewport Mode Switcher */}
        <div className="flex items-center bg-[#1c0f0a] border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => onViewportChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === 'desktop'
                ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Desktop Viewport (1440px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => onViewportChange('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === 'tablet'
                ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => onViewportChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === 'mobile'
                ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1 gap-1 text-xs text-neutral-300">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 15))}
            className="px-1.5 hover:text-white font-mono"
            title="Zoom Out"
          >
            -
          </button>
          <select
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="bg-transparent text-white font-mono text-[11px] focus:outline-none cursor-pointer"
          >
            <option value="50" className="bg-[#1a0f0a]">50%</option>
            <option value="75" className="bg-[#1a0f0a]">75%</option>
            <option value="90" className="bg-[#1a0f0a]">90%</option>
            <option value="100" className="bg-[#1a0f0a]">100%</option>
            <option value="115" className="bg-[#1a0f0a]">115%</option>
            <option value="125" className="bg-[#1a0f0a]">125%</option>
            <option value="150" className="bg-[#1a0f0a]">150%</option>
          </select>
          <button
            onClick={() => onZoomChange(Math.min(150, zoom + 15))}
            className="px-1.5 hover:text-white font-mono"
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* Grid Overlay Toggle */}
        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded-lg border transition-all ${
            showGrid
              ? 'bg-[#F4510B]/20 border-[#F4510B] text-[#FF9D00]'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          title="Toggle Grid / Guidelines"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Preview Mode Toggle */}
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
            previewMode
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
          }`}
          title={previewMode ? 'Exit Preview Mode' : 'Clean Preview Mode (Hide Guides)'}
        >
          {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{previewMode ? 'Editing' : 'Preview'}</span>
        </button>
      </div>

      {/* RIGHT: Actions (Save Draft, Publish Live, Reset, Export/Import) */}
      <div className="flex items-center gap-2">
        {/* Status Notification Toast */}
        {statusMessage && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4510B]/15 border border-[#F4510B]/30 text-[#FF9D00] text-[11px] animate-fadeIn">
            <Check className="w-3 h-3 text-[#FF9D00]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Reset to Default */}
        <button
          onClick={onResetDefault}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Reset to Original Design Template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Export JSON Backup */}
        <button
          onClick={onExportBackup}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Export Visual Layout JSON"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Import JSON Backup */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors"
          title="Import Visual Layout JSON"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Save Draft Button */}
        <button
          onClick={onSaveDraft}
          disabled={savingDraft}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
        </button>

        {/* Publish Changes Button */}
        <button
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white text-xs font-semibold tracking-wide uppercase shadow-glow-orange hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
          title="Apply Changes to Public Website"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{publishing ? 'Publishing...' : 'Publish'}</span>
        </button>
      </div>
    </header>
  );
};
