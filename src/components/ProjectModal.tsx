import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectItem } from '../types';
import { X, ArrowUpRight, CheckCircle2, Calendar, Tag, User, Layers, Play } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenVideoModal?: (title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  onClose,
  onOpenVideoModal 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 text-white shadow-2xl p-6 sm:p-8 md:p-12 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#FF5A1F] text-white">
              {project.categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" />
              {project.year}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <User className="w-3.5 h-3.5 text-[#FF6A00]" />
              {project.client}
            </span>
          </div>

          {/* Title */}
          <h2 id="modal-title" className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {project.title}
          </h2>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/50 mb-8 border border-white/10 group">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.videoPreview && (
              <button
                type="button"
                onClick={() => onOpenVideoModal && onOpenVideoModal(project.title)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-[#FF5A1F]/50"
                aria-label="Play video preview"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            )}
          </div>

          {/* Description & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-7 space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF5A1F] mb-2 font-bold">
                  Overview
                </h3>
                <p className="text-base text-white/90 leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF5A1F] mb-2 font-bold">
                  Creative Approach
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {project.creativeApproach}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-white/50 mb-1">Challenge</h4>
                  <p className="text-xs text-white/80 leading-relaxed">{project.challenge}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-[#FF6A00] mb-1">Solution</h4>
                  <p className="text-xs text-white/80 leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Deliverables & Tags */}
            <div className="md:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#1A1A1A] border border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4 font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF5A1F]" />
                  Deliverables
                </h3>
                <ul className="space-y-2.5">
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-white/85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Technologies & Disciplines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs bg-white/5 border border-white/10 text-white/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="w-full pill-button-orange justify-center py-3 text-sm"
                >
                  <span>Request Similar Project</span>
                  <span className="pill-arrow-white">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          {project.galleryImages && project.galleryImages.length > 1 && (
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 font-bold">
                Project Gallery Visuals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.galleryImages.map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-[4/3] bg-black/40 border border-white/10">
                    <img
                      src={imgUrl}
                      alt={`${project.title} detail ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
