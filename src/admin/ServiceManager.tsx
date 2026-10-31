import React, { useState } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import type { ServiceItem } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  X, 
  Palette, 
  Sparkles, 
  Video, 
  Layers, 
  Globe, 
  TrendingUp, 
  Compass, 
  Lightbulb, 
  Target 
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Palette', icon: <Palette className="w-4 h-4" /> },
  { name: 'Sparkles', icon: <Sparkles className="w-4 h-4" /> },
  { name: 'Video', icon: <Video className="w-4 h-4" /> },
  { name: 'Layers', icon: <Layers className="w-4 h-4" /> },
  { name: 'Globe', icon: <Globe className="w-4 h-4" /> },
  { name: 'TrendingUp', icon: <TrendingUp className="w-4 h-4" /> },
  { name: 'Compass', icon: <Compass className="w-4 h-4" /> },
  { name: 'Lightbulb', icon: <Lightbulb className="w-4 h-4" /> },
  { name: 'Target', icon: <Target className="w-4 h-4" /> },
];

export const ServiceManager: React.FC = () => {
  const { content, updateContent } = usePortfolioContent();
  const services = content.servicesData;

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deliverablesText, setDeliverablesText] = useState('');

  const openNewService = () => {
    const nextNum = (services.length + 1).toString().padStart(2, '0');
    const newSvc: ServiceItem = {
      id: 'svc-' + Date.now().toString(36),
      number: `#${nextNum}`,
      title: 'New Creative Service',
      shortTitle: 'Service',
      category: 'Graphic Designing',
      description: 'High-impact solutions engineered to solve complex branding and digital communication challenges.',
      deliverables: [
        'Strategic consultation & discovery roadmap',
        'Creative art direction & visual assets',
        'Design guidelines & production assets',
        'Multi-platform collateral deployment',
        'Performance optimization & testing',
        'Dedicated post-launch design support',
      ],
      visualDirection: 'Visual exploration, typography systems, and modern digital art direction.',
      iconName: 'Sparkles',
      accentGradient: 'from-[#FF5A1F] to-[#EA580C]',
      featuredMockup: {
        title: 'Bespoke Solutions',
        subtitle: 'Scalable visual architecture',
        badge: 'Craft & Code',
      },
    };
    setEditingService(newSvc);
    setDeliverablesText(newSvc.deliverables.join('\n'));
  };

  const startEdit = (svc: ServiceItem) => {
    setEditingService({ ...svc });
    setDeliverablesText(svc.deliverables.join('\n'));
  };

  const saveService = () => {
    if (!editingService) return;

    const delivArray = deliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedService = {
      ...editingService,
      deliverables: delivArray.length > 0 ? delivArray : editingService.deliverables,
    };

    updateContent((prev) => {
      const exists = prev.servicesData.some((s) => s.id === updatedService.id);
      let updated: ServiceItem[];
      if (exists) {
        updated = prev.servicesData.map((s) => (s.id === updatedService.id ? updatedService : s));
      } else {
        updated = [...prev.servicesData, updatedService];
      }
      return { ...prev, servicesData: updated };
    });

    setEditingService(null);
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    updateContent((prev) => {
      const list = [...prev.servicesData];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, servicesData: list };
    });
  };

  const deleteService = (id: string) => {
    updateContent((prev) => ({
      ...prev,
      servicesData: prev.servicesData.filter((s) => s.id !== id),
    }));
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Services ({services.length})
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Customize offerings, titles, deliverables, icons, and display order.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewService}
          className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc, idx) => (
          <div
            key={svc.id}
            className="group p-5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/50 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-[#FF5A1F]">
                    {svc.number}
                  </span>
                  <span className="text-xs text-white/40 font-mono">({svc.iconName})</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveService(idx, 'up')}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === services.length - 1}
                    onClick={() => moveService(idx, 'down')}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-bold text-white group-hover:text-[#FF5A1F] transition-colors">
                {svc.title}
              </h4>
              <p className="text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-2">
                {svc.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-[10px] font-mono uppercase text-white/40 mb-2">
                  Deliverables ({svc.deliverables.length})
                </p>
                <div className="space-y-1">
                  {svc.deliverables.slice(0, 3).map((d, i) => (
                    <p key={i} className="text-xs text-white/70 truncate">
                      • {d}
                    </p>
                  ))}
                  {svc.deliverables.length > 3 && (
                    <p className="text-[10px] text-white/40 italic">
                      +{svc.deliverables.length - 3} more deliverables
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-white/40 italic truncate max-w-[60%]">
                {svc.visualDirection}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(svc)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-[#FF5A1F]" />
                  <span>Edit</span>
                </button>

                {deleteConfirmId === svc.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deleteService(svc.id)}
                      className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 rounded bg-white/10 text-white text-xs"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(svc.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingService.id.startsWith('svc-') ? 'Add New Service' : 'Edit Service'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Number
                  </label>
                  <input
                    type="text"
                    value={editingService.number}
                    onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-sm focus:outline-none"
                    placeholder="#01"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-sm focus:outline-none"
                    placeholder="e.g. Branding & Identity"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Select Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setEditingService({ ...editingService, iconName: item.name })}
                      className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                        editingService.iconName === item.name
                          ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] font-mono">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Deliverables (One per line)
                </label>
                <textarea
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none font-mono leading-relaxed"
                  placeholder="Enter each deliverable on a new line..."
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Footer Visual Direction Note
                </label>
                <input
                  type="text"
                  value={editingService.visualDirection}
                  onChange={(e) => setEditingService({ ...editingService, visualDirection: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2.5 bg-black/20">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveService}
                className="px-5 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/20"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
