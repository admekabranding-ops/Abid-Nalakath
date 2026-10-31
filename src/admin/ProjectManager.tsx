import React, { useState } from 'react';
import { usePortfolioContent } from '../context/ContentContext';
import type { ProjectItem, PortfolioCategory } from '../types';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Image as ImageIcon, 
  X 
} from 'lucide-react';
import { MediaLibrary } from './MediaLibrary';

const CATEGORIES: PortfolioCategory[] = [
  'Graphic Design',
  'Branding',
  'AI Videos',
  'Applications',
  'Websites',
  'Digital Marketing',
];

export const ProjectManager: React.FC = () => {
  const { content, updateContent, saveDraft } = usePortfolioContent();
  const projects = content.portfolioProjects;

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openNewProject = () => {
    const newProj: ProjectItem = {
      id: 'proj-' + Date.now().toString(36),
      title: 'New Creative Project',
      category: 'Branding',
      categoryLabel: 'Brand Identity',
      year: new Date().getFullYear().toString(),
      client: 'Client Name',
      shortDescription: 'Compelling short summary of the creative design and execution.',
      fullDescription: 'Comprehensive case study details detailing design thinking, typography, motion, and digital craftsmanship.',
      creativeApproach: 'Strategic minimalism and high-contrast art direction.',
      challenge: 'Solving market noise with clear visual distinction.',
      solution: 'Custom typography system and bespoke digital assets.',
      deliverables: ['Brand Guidelines', 'Identity System', 'Digital Assets'],
      tags: ['Design', 'Creative', 'Modern'],
      color: '#FF5A1F',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      aspectRatio: 'wide',
    };
    setEditingProject(newProj);
  };

  const saveProject = (proj: ProjectItem) => {
    updateContent((prev) => {
      const exists = prev.portfolioProjects.some((p) => p.id === proj.id);
      let updated: ProjectItem[];
      if (exists) {
        updated = prev.portfolioProjects.map((p) => (p.id === proj.id ? proj : p));
      } else {
        updated = [proj, ...prev.portfolioProjects];
      }
      return { ...prev, portfolioProjects: updated };
    });
    setEditingProject(null);
    setTimeout(() => saveDraft(), 100);
  };

  const duplicateProject = (proj: ProjectItem) => {
    const duplicated: ProjectItem = {
      ...proj,
      id: 'proj-' + Date.now().toString(36),
      title: `${proj.title} (Copy)`,
    };
    updateContent((prev) => ({
      ...prev,
      portfolioProjects: [duplicated, ...prev.portfolioProjects],
    }));
    setTimeout(() => saveDraft(), 100);
  };

  const deleteProject = (id: string) => {
    updateContent((prev) => ({
      ...prev,
      portfolioProjects: prev.portfolioProjects.filter((p) => p.id !== id),
    }));
    setDeleteConfirmId(null);
    setTimeout(() => saveDraft(), 100);
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    updateContent((prev) => {
      const list = [...prev.portfolioProjects];
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, portfolioProjects: list };
    });
    setTimeout(() => saveDraft(), 100);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Portfolio Projects
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Add, reorder, edit, and organize selected works displayed on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProject}
          className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 transition-all gap-4 shadow-md"
          >
            {/* Left Info */}
            <div className="flex items-center gap-4">
              {/* Order buttons */}
              <div className="flex flex-col gap-1 text-white/30">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveProject(idx, 'up')}
                  className="hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === projects.length - 1}
                  onClick={() => moveProject(idx, 'down')}
                  className="hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Image thumbnail */}
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                    {proj.category}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">{proj.year}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#FF5A1F] transition-colors">
                  {proj.title}
                </h4>
                <p className="text-xs text-white/50 line-clamp-1 max-w-lg mt-0.5">
                  {proj.shortDescription}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setEditingProject({ ...proj })}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => duplicateProject(proj)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {deleteConfirmId === proj.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => deleteProject(proj.id)}
                    className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 rounded bg-white/10 text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(proj.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingProject.id.startsWith('proj-') ? 'Add Portfolio Project' : 'Edit Project'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-sm focus:outline-none"
                    placeholder="e.g. Lumina Fragrance Identity"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-sm focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#141414]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Short Description
                </label>
                <textarea
                  value={editingProject.shortDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                  placeholder="Summary displayed on portfolio cards..."
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Full Case Study Description
                </label>
                <textarea
                  value={editingProject.fullDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                  placeholder="In-depth details for case study modal..."
                />
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                  Cover Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMediaPickerOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FF5A1F]/15 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media Library</span>
                  </button>
                </div>
              </div>

              {/* Deliverables / Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Deliverables (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.deliverables.join(', ')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        deliverables: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                    placeholder="Monogram, Packaging, Brand Guidelines"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1.5 font-semibold font-mono uppercase tracking-wider">
                    Client & Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingProject.client}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-2/3 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                      placeholder="Client Name"
                    />
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-1/3 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-white text-xs focus:outline-none"
                      placeholder="Year"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2.5 bg-black/20">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveProject(editingProject)}
                className="px-5 py-2 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/20"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <MediaLibrary
          isModal
          onClose={() => setIsMediaPickerOpen(false)}
          onSelectImage={(url) => {
            if (editingProject) {
              setEditingProject({ ...editingProject, image: url });
            }
            setIsMediaPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};
