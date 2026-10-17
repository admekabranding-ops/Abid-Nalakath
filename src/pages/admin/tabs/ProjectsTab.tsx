import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Upload, 
  AlertTriangle 
} from 'lucide-react';
import { apiRequest } from '../../../api/client';
import type { Project } from '../../../types';

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['Branding', 'Social Media', 'Posters', 'Digital Art', 'Packaging'];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/projects');
      setProjects(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingProject({
      id: '',
      title: '',
      subtitle: '',
      category: 'Branding',
      category_label: 'Brand Identity',
      image: '/assets/projects/project-1.jpg',
      client: 'Client Name',
      year: new Date().getFullYear().toString(),
      role: 'Creative Designer',
      challenge: '',
      solution: '',
      deliverables: ['Brand Guidelines', 'Logo System', 'Vector Files'],
      colors: ['#151515', '#F4510B', '#FF9D00', '#FAF8F5'],
      tags: ['Branding', 'Identity', 'Visual Design'],
      featured: true,
      status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (!editingProject.title.trim()) {
        setErrorMsg('Project title is required');
        return;
      }

      if (editingProject.id) {
        // Update
        await apiRequest(`/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(editingProject),
        });
        setSuccessMsg('Project updated successfully');
      } else {
        // Create
        await apiRequest('/admin/projects', {
          method: 'POST',
          body: JSON.stringify(editingProject),
        });
        setSuccessMsg('Project created successfully');
      }

      setModalOpen(false);
      setEditingProject(null);
      await loadProjects();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/admin/projects/${id}`, { method: 'DELETE' });
      setDeletingId(null);
      setSuccessMsg('Project deleted');
      await loadProjects();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    // Swap sort_order
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Re-assign sort_orders
    const items = newProjects.map((p, idx) => ({ id: p.id, sort_order: idx + 1 }));
    setProjects(newProjects);

    try {
      await apiRequest('/admin/projects/reorder', {
        method: 'PUT',
        body: JSON.stringify({ items }),
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest<{ success: boolean; url: string }>('/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.url) {
        setEditingProject({ ...editingProject, image: res.url });
      }
    } catch (err: any) {
      setErrorMsg(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const filtered = filterCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Project Case Studies Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Create, edit, reorder, and manage Draft / Published status for portfolio projects
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#140a07] p-1.5 rounded-2xl border border-white/10">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-glow-orange'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Table / Card List */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-neutral-400">Loading projects from SQLite database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-neutral-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4 w-20">Preview</th>
                  <th className="py-3.5 px-4">Title &amp; Subtitle</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Client / Year</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filtered.map((project, idx) => (
                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                  {/* Order */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="text-neutral-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[10px] text-neutral-400">{idx + 1}</span>
                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filtered.length - 1}
                        className="text-neutral-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="w-16 h-11 rounded-lg bg-black/60 overflow-hidden border border-white/10">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Title & Subtitle */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-sm text-white">{project.title}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1">{project.subtitle}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#FF9D00] font-medium">
                      {project.category}
                    </span>
                  </td>

                  {/* Client & Year */}
                  <td className="py-3 px-4 text-neutral-300 text-[11px]">
                    <div>{project.client}</div>
                    <div className="text-neutral-500">{project.year}</div>
                  </td>

                  {/* Status: Published vs Draft */}
                  <td className="py-3 px-4">
                    {(project as any).status === 'draft' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-[10px]">
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                        Published
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#160c08] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Delete Project?</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to delete this case study? This action will permanently remove it from the local SQLite database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs text-white font-semibold shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal Form */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#160c08] border border-[#F4510B]/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display font-bold text-xl text-white">
                {editingProject.id ? 'Edit Case Study' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              {/* Status & Featured */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-semibold text-neutral-300 uppercase">Status:</label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#200d07] border border-white/20 text-white text-xs font-semibold"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden from public)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded bg-black/50 border-white/20 text-[#F4510B] focus:ring-0"
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Aura Botanicals"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value, category_label: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                  Subtitle / Summary
                </label>
                <input
                  type="text"
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  placeholder="Organic Luxury Skincare &amp; Fragrance Packaging"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-neutral-300 uppercase">
                  Cover Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-black overflow-hidden border border-white/15 flex-shrink-0">
                    <img
                      src={editingProject.image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow space-y-2 w-full">
                    <input
                      type="text"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                      placeholder="/assets/projects/project-1.jpg"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-[#FF9D00]" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Client, Year, Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Client</label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Design Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">
                    Strategic Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* Tags & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.tags || []).join(', ')}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Palette HEX Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.colors || []).join(', ')}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs uppercase tracking-wider shadow-glow-orange"
                >
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
