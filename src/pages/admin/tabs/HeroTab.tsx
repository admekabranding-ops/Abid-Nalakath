import React, { useState, useEffect } from 'react';
import { Save, Upload, Check, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../api/client';

export const HeroTab: React.FC = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/content/hero');
      setHeroData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      await apiRequest('/admin/content/hero', {
        method: 'PUT',
        body: JSON.stringify(heroData),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.url) {
        setHeroData({ ...heroData, heroImage: res.url });
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.url) {
        setHeroData({
          ...heroData,
          quoteCard: { ...heroData.quoteCard, avatar: res.url }
        });
      }
    } catch (err: any) {
      setError(`Avatar upload failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-neutral-400 text-sm py-12 text-center">Loading Hero Section Settings...</div>;
  }

  if (!heroData) {
    return <div className="text-red-400 text-sm py-12 text-center">Error loading hero data</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Hero Section Editor
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Customize headings, portrait photo, CTA, status badge, and stats
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Hero section saved to SQLite database! Public website updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Left Side: Headlines & Badges */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9D00]" />
            <span>Left Hero Canvas (Orange Side)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Designer Name
              </label>
              <input
                type="text"
                value={heroData.name || ''}
                onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={heroData.title || ''}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Outlined Pill Badge Text
            </label>
            <input
              type="text"
              value={heroData.subtitle || ''}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          {/* Heading Lines */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Main Heading Lines (Lightweight Editorial Sans)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(heroData.heroHeadingLines || []).map((line: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-mono w-6">L{i+1}:</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const updated = [...heroData.heroHeadingLines];
                      updated[i] = e.target.value;
                      setHeroData({ ...heroData, heroHeadingLines: updated });
                    }}
                    className="flex-grow px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                White Pill CTA Text
              </label>
              <input
                type="text"
                value={heroData.ctaText || 'View My Work'}
                onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                CTA Target Anchor
              </label>
              <input
                type="text"
                value={heroData.ctaLink || '#projects'}
                onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>
          </div>
        </div>

        {/* Center: Hero Portrait Image Management */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#FF9D00]" />
            <span>Center Cutout Portrait Image</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-44 h-44 rounded-2xl bg-black/60 border border-white/10 p-2 flex items-center justify-center overflow-hidden relative shadow-lg">
              <img
                src={heroData.heroImage || '/assets/abid-hero.png'}
                alt="Portrait Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="space-y-4 flex-grow">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={heroData.heroImage || ''}
                  onChange={(e) => setHeroData({ ...heroData, heroImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-[#FF9D00]" />
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload New Cutout PNG'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Upload transparent PNG. Image will be saved permanently to <code className="text-[#FF9D00]">data/uploads/</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Introduction & Quote Card */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9D00]" />
            <span>Right Panel (White Merged Side)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Available Pill Badge
              </label>
              <input
                type="text"
                value={heroData.availableStatus || 'Available for Projects'}
                onChange={(e) => setHeroData({ ...heroData, availableStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Greeting &amp; Short Name
              </label>
              <input
                type="text"
                value={heroData.introName || 'Abid'}
                onChange={(e) => setHeroData({ ...heroData, introName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Introduction Headline Statement
            </label>
            <input
              type="text"
              value={heroData.introStatement || ''}
              onChange={(e) => setHeroData({ ...heroData, introStatement: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          {/* 3 Clean Lines */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              3 Short Supporting Lines
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(heroData.introLines || ['Clean design.', 'Smooth animations.', 'Distinctive branding.']).map((line: string, i: number) => (
                <input
                  key={i}
                  type="text"
                  value={line}
                  onChange={(e) => {
                    const updated = [...(heroData.introLines || [])];
                    updated[i] = e.target.value;
                    setHeroData({ ...heroData, introLines: updated });
                  }}
                  className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#F4510B]"
                />
              ))}
            </div>
          </div>

          {/* Floating Quote Card */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF9D00]">
              Floating Profile / Quote Card (Bottom-Right)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Card Name
                </label>
                <input
                  type="text"
                  value={heroData.quoteCard?.name || ''}
                  onChange={(e) => setHeroData({
                    ...heroData,
                    quoteCard: { ...heroData.quoteCard, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Card Role
                </label>
                <input
                  type="text"
                  value={heroData.quoteCard?.role || ''}
                  onChange={(e) => setHeroData({
                    ...heroData,
                    quoteCard: { ...heroData.quoteCard, role: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                Quote Statement
              </label>
              <input
                type="text"
                value={heroData.quoteCard?.quote || ''}
                onChange={(e) => setHeroData({
                  ...heroData,
                  quoteCard: { ...heroData.quoteCard, quote: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-4">
              <img
                src={heroData.quoteCard?.avatar || '/assets/abid-avatar.jpg'}
                alt="Avatar"
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Change Avatar Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Hero Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
