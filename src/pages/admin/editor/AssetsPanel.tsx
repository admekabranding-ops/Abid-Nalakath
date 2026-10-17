import React, { useState, useEffect, useRef } from 'react';
import { Upload, Copy, Check, AlertCircle, RefreshCw, GripVertical, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { apiRequest } from '../../../api/client';

interface AssetsPanelProps {
  onApplyImageToSelected?: (url: string) => void;
  selectedElementId: string | null;
  onAddImageToCanvas?: (url: string, name: string) => void;
}

export const AssetsPanel: React.FC<AssetsPanelProps> = ({
  onApplyImageToSelected,
  selectedElementId,
  onAddImageToCanvas,
}) => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const staticDefaultAssets = [
    { name: 'Abid Hero Portrait', url: '/assets/abid-hero.png' },
    { name: 'Abid Quote Avatar', url: '/assets/abid-avatar.jpg' },
    { name: 'Aura Botanicals Cover', url: '/assets/projects/project-1.jpg' },
    { name: 'Nova Sound Festival Cover', url: '/assets/projects/project-2.jpg' },
    { name: 'Kroma Creative Suite Cover', url: '/assets/projects/project-3.jpg' },
    { name: 'Velvet Noir Spirits Cover', url: '/assets/projects/project-4.jpg' },
    { name: 'Zenith Architecture Cover', url: '/assets/projects/project-5.jpg' },
    { name: 'HyperDrive Kinetic Cover', url: '/assets/projects/project-6.jpg' },
  ];

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/media');
      if (Array.isArray(data)) {
        setMediaList(data);
      }
    } catch (err: any) {
      console.warn('Media library offline/fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.url) {
        await loadMedia();
        if (onApplyImageToSelected && selectedElementId) {
          onApplyImageToSelected(res.url);
        }
      }
    } catch (err: any) {
      setErrorMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = '';
  };

  const handleCopy = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDragStart = (e: React.DragEvent, asset: { name: string; url: string }) => {
    e.dataTransfer.effectAllowed = 'copyMove';
    const payload = JSON.stringify({
      type: 'asset-image',
      url: asset.url,
      name: asset.name,
    });
    e.dataTransfer.setData('application/json', payload);
    e.dataTransfer.setData('text/plain', asset.url);

    // Create a compact custom drag image preview
    try {
      const dragGhost = document.createElement('div');
      dragGhost.style.position = 'absolute';
      dragGhost.style.top = '-9999px';
      dragGhost.style.left = '-9999px';
      dragGhost.style.padding = '6px 12px';
      dragGhost.style.background = '#F4510B';
      dragGhost.style.color = '#FFFFFF';
      dragGhost.style.borderRadius = '8px';
      dragGhost.style.fontSize = '11px';
      dragGhost.style.fontWeight = 'bold';
      dragGhost.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
      dragGhost.innerText = `🖼️ Dragging: ${asset.name}`;
      document.body.appendChild(dragGhost);
      e.dataTransfer.setDragImage(dragGhost, 20, 20);
      setTimeout(() => document.body.removeChild(dragGhost), 100);
    } catch {
      // Fallback to default drag ghost
    }
  };

  const allAssets = [
    ...mediaList.map((m) => ({ name: m.original_name || m.filename, url: m.url })),
    ...staticDefaultAssets,
  ];

  return (
    <div className="flex flex-col h-full bg-[#120a08] text-white select-none">
      {/* Upload Zone */}
      <div className="p-3 border-b border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#FF9D00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Photos & Logos
            </span>
          </div>
          <button
            onClick={loadMedia}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Drag Helper Tip Badge */}
        <div className="p-2 rounded-lg bg-gradient-to-r from-[#F4510B]/15 to-[#FF9D00]/10 border border-[#F4510B]/30 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#FF9D00] flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight text-neutral-300">
            <span className="font-bold text-white block mb-0.5">Drag & Drop Direct to Canvas:</span>
            Drag any logo or photo onto the design canvas to insert or replace an image!
          </div>
        </div>

        {/* Upload Button / Drop Target Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverUpload(true);
          }}
          onDragLeave={() => setIsDragOverUpload(false)}
          onDrop={async (e) => {
            e.preventDefault();
            setIsDragOverUpload(false);
            const file = e.dataTransfer.files?.[0];
            if (file) await uploadFile(file);
          }}
          className={`p-3.5 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
            isDragOverUpload
              ? 'border-[#FF9D00] bg-[#FF9D00]/20 scale-[0.99]'
              : 'border-[#F4510B]/50 hover:border-[#F4510B] bg-[#F4510B]/5 hover:bg-[#F4510B]/10'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#F4510B]/20 flex items-center justify-center text-[#FF9D00] mb-1.5 group-hover:scale-110 transition-transform">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-white">
            {uploading ? 'Saving to data/uploads/...' : isDragOverUpload ? 'Drop file to upload!' : 'Add Logo or Photo'}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5">
            Click to browse or drop file here (PNG, JPG, SVG)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadInput}
            className="hidden"
          />
        </div>

        {errorMsg && (
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-1.5 text-[11px] text-red-300">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {selectedElementId && (
          <div className="text-[10px] text-[#FF9D00] bg-[#FF9D00]/10 border border-[#FF9D00]/20 rounded-lg p-1.5 text-center font-medium">
            Click any asset to apply it to the selected element
          </div>
        )}
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 custom-scrollbar">
        {allAssets.map((asset, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, asset)}
            onClick={() => {
              if (onApplyImageToSelected) {
                onApplyImageToSelected(asset.url);
              }
            }}
            className="group relative rounded-xl bg-black/40 border border-white/10 hover:border-[#F4510B] overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-[0_4px_15px_rgba(244,81,11,0.25)] transition-all flex flex-col justify-between"
            title="Click to apply to selected element, or drag into canvas"
          >
            {/* Drag Handle Badge */}
            <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md text-[9px] text-[#FF9D00] px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold pointer-events-none">
              <GripVertical className="w-2.5 h-2.5" />
              <span>Drag</span>
            </div>

            {/* Quick Add Button */}
            {onAddImageToCanvas && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddImageToCanvas(asset.url, asset.name);
                }}
                className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-[#F4510B] text-white hover:bg-[#FF9D00] shadow-md"
                title="Add directly to active section"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}

            {/* Image Preview */}
            <div className="h-20 w-full overflow-hidden bg-neutral-900/60 flex items-center justify-center p-1 relative">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              />
            </div>

            {/* Asset Name & Copy Button */}
            <div className="p-1.5 bg-[#170c09] border-t border-white/5 flex items-center justify-between gap-1">
              <span className="text-[10px] text-neutral-300 truncate font-mono">
                {asset.name}
              </span>
              <button
                onClick={(e) => handleCopy(asset.url, e)}
                className="p-1 hover:text-[#FF9D00] text-neutral-500 transition-colors"
                title="Copy Image URL"
              >
                {copiedUrl === asset.url ? (
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
