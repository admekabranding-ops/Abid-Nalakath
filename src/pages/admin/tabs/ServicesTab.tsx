import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../api/client';
import type { Service } from '../../../types';

export const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const icons = ['Palette', 'Share2', 'Megaphone', 'TrendingUp', 'Layout'];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/services');
      setServices(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService({ ...s });
    setModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingService({
      id: '',
      title: '',
      short_desc: '',
      full_desc: '',
      icon_name: 'Palette',
      deliverables: ['Primary Deliverable 1', 'Primary Deliverable 2'],
      timeline: '1 - 2 Weeks',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (editingService.id) {
        await apiRequest(`/admin/services/${editingService.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingService),
        });
        setSuccessMsg('Service updated');
      } else {
        await apiRequest('/admin/services', {
          method: 'POST',
          body: JSON.stringify(editingService),
        });
        setSuccessMsg('Service added');
      }

      setModalOpen(false);
      setEditingService(null);
      await loadServices();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
      await loadServices();
      setSuccessMsg('Service removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Services &amp; Specializations
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage creative service packages, turnaround times, and deliverables
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
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

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-400">Loading services from SQLite database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#140a07] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#FF9D00] font-semibold tracking-wider uppercase">
                  {service.timeline}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                {service.shortDesc}
              </p>

              <div className="space-y-1.5 border-t border-white/5 pt-3">
                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Deliverables</div>
                {(service.deliverables || []).map((d: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-[#F4510B]" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Edit Modal */}
      {modalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#160c08] border border-[#F4510B]/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-neutral-400 mb-1 font-semibold">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-semibold">Timeline</label>
                  <input
                    type="text"
                    value={editingService.timeline || ''}
                    onChange={(e) => setEditingService({ ...editingService, timeline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                    placeholder="e.g. 2 - 3 Weeks"
                  />
                </div>
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-semibold">Icon</label>
                  <select
                    value={editingService.icon_name || 'Palette'}
                    onChange={(e) => setEditingService({ ...editingService, icon_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  >
                    {icons.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-neutral-400 mb-1 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.short_desc || editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-neutral-400 mb-1 font-semibold">
                  Deliverables (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingService.deliverables || []).join(', ')}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    deliverables: e.target.value.split(',').map((d: string) => d.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold shadow-glow-orange"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
