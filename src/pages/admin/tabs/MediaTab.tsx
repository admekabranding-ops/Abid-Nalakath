import React, { useState, useEffect } from 'react';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../api/client';

export const MediaTab: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/media');
      setMediaList(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        await apiRequest('/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
      }
      setSuccessMsg(`Successfully uploaded ${files.length} file(s)`);
      await loadMedia();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media file permanently?')) return;
    try {
      await apiRequest(`/admin/media/${id}`, { method: 'DELETE' });
      setMediaList(mediaList.filter((m) => m.id !== id));
      setSuccessMsg('Media deleted');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Media Library &amp; Uploads
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Permanent local file storage located at <code className="text-[#FF9D00]">data/uploads/</code>
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid of uploaded images */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading Media Library...</div>
      ) : mediaList.length === 0 ? (
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-12 text-center text-neutral-500 flex flex-col items-center justify-center">
          <ImageIcon className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-xs">No uploaded media files found yet. Click "Upload New Image" above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((m) => (
            <div
              key={m.id}
              className="bg-[#140a07] border border-white/10 rounded-2xl overflow-hidden group shadow-lg flex flex-col justify-between"
            >
              <div className="aspect-square bg-black/60 relative overflow-hidden flex items-center justify-center p-2">
                <img
                  src={m.url}
                  alt={m.original_name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-3 bg-black/30 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-semibold text-white truncate" title={m.original_name}>
                  {m.original_name}
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{(m.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleCopyUrl(m.url, m.id)}
                    className="flex-grow py-1 px-2 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-medium text-neutral-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Path</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
