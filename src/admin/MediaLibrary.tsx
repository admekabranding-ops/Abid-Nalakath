import React, { useState, useEffect } from 'react';
import type { MediaAsset } from '../types/content';
import { 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Folder 
} from 'lucide-react';

interface MediaLibraryProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectImage?: (url: string) => void;
  isModal?: boolean;
}

const CATEGORIES = [
  'All',
  'Hero Images',
  'Portfolio',
  'Branding',
  'Graphic Design',
  'AI Videos',
  'Website Assets',
  'General Media',
];

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  isOpen = true,
  onClose,
  onSelectImage,
  isModal = false,
}) => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.media) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          try {
            await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: file.name,
                base64Data,
                category: activeCategory === 'All' ? 'General Media' : activeCategory,
              }),
            });
          } catch (e) {
            console.error('Upload error:', e);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setUploading(false);
    fetchMedia();
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteAsset = async (id: string, filename: string) => {
    try {
      await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, filename }),
      });
      setMedia((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirmId(null);
    } catch (e) {
      console.error('Failed to delete media asset:', e);
    }
  };

  if (!isOpen) return null;

  // Filter & Sort
  const filtered = media.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'size') return b.fileSize - a.fileSize;
    if (sortBy === 'name') return a.filename.localeCompare(b.filename);
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  const content = (
    <div className="flex flex-col h-full bg-[#121212] text-white">
      {/* Top Header */}
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-[#FF5A1F]" />
            <h2 className="text-xl font-bold tracking-tight text-white">Media Library</h2>
          </div>
          <p className="text-xs text-white/50">
            Upload, organize, and inspect persistent assets for your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shadow-lg shadow-[#FF5A1F]/20">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#FF5A1F] text-white'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white/80 focus:outline-none"
          >
            <option value="date">Newest</option>
            <option value="size">Largest</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-white/40 text-sm">
            Loading media assets...
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-2xl text-center p-6">
            <Folder className="w-10 h-10 text-white/20 mb-3" />
            <p className="text-sm font-semibold text-white/60">No Media Files Found</p>
            <p className="text-xs text-white/40 mt-1 max-w-sm">
              Drag & drop files or click "Upload Media" to add images to your persistent library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sorted.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-[#181818] border border-white/10 hover:border-[#FF5A1F]/50 overflow-hidden flex flex-col transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-black/60 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {onSelectImage && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectImage(item.url);
                          if (onClose) onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FF5A1F] text-white text-xs font-bold hover:scale-105 transition-transform shadow-md"
                      >
                        Select Asset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url, item.id)}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="p-3 border-t border-white/5 flex flex-col justify-between flex-1">
                  <p className="text-xs font-semibold text-white/90 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/40 mt-1.5">
                    <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                    <span className="font-mono">{item.fileType}</span>
                  </div>

                  {/* Delete Confirmation */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                      {item.category}
                    </span>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => deleteAsset(item.id, item.filename)}
                          className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return <div className="h-full w-full">{content}</div>;
};
