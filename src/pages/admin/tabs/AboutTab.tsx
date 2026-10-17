import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../api/client';

export const AboutTab: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/content/about');
      setAboutData(data);
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
      await apiRequest('/admin/content/about', {
        method: 'PUT',
        body: JSON.stringify(aboutData),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-neutral-400 text-sm py-12 text-center">Loading About Section...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            About Section Editor
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Edit philosophy, bio story, creative process steps, and skill metrics
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>About section updated in SQLite database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Story & Philosophy */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-white">
            Bio &amp; Design Philosophy
          </h3>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Section Heading
            </label>
            <input
              type="text"
              value={aboutData.heading || 'Design With Purpose.'}
              onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Story Paragraph
            </label>
            <textarea
              rows={3}
              value={aboutData.story || ''}
              onChange={(e) => setAboutData({ ...aboutData, story: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Philosophy Title
              </label>
              <input
                type="text"
                value={aboutData.philosophyTitle || ''}
                onChange={(e) => setAboutData({ ...aboutData, philosophyTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Experience Badge
              </label>
              <input
                type="text"
                value={aboutData.experienceYears || ''}
                onChange={(e) => setAboutData({ ...aboutData, experienceYears: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Philosophy Description
            </label>
            <textarea
              rows={3}
              value={aboutData.philosophyDesc || ''}
              onChange={(e) => setAboutData({ ...aboutData, philosophyDesc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm resize-none"
            />
          </div>
        </div>

        {/* 4 Process Steps */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-white">
            4-Step Creative Workflow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(aboutData.processSteps || []).map((step: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#FF9D00]">{step.step}</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...aboutData.processSteps];
                      updated[i].title = e.target.value;
                      setAboutData({ ...aboutData, processSteps: updated });
                    }}
                    className="flex-grow px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-bold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={step.desc}
                  onChange={(e) => {
                    const updated = [...aboutData.processSteps];
                    updated[i].desc = e.target.value;
                    setAboutData({ ...aboutData, processSteps: updated });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Skills List */}
        <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">
              Skills &amp; Mastery Levels (%)
            </h3>
            <button
              type="button"
              onClick={() => {
                const updated = [...(aboutData.skills || []), { name: 'New Skill', level: 90 }];
                setAboutData({ ...aboutData, skills: updated });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#FF9D00] font-semibold hover:text-[#F4510B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(aboutData.skills || []).map((skill: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...aboutData.skills];
                    updated[i].name = e.target.value;
                    setAboutData({ ...aboutData, skills: updated });
                  }}
                  className="flex-grow px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={skill.level}
                  onChange={(e) => {
                    const updated = [...aboutData.skills];
                    updated[i].level = Number(e.target.value);
                    setAboutData({ ...aboutData, skills: updated });
                  }}
                  className="w-16 px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs text-center font-bold text-[#FF9D00]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = aboutData.skills.filter((_: any, idx: number) => idx !== i);
                    setAboutData({ ...aboutData, skills: updated });
                  }}
                  className="text-neutral-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            <span>{saving ? 'Saving...' : 'Save About Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
