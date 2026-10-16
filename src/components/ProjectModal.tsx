import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowUpRight, Calendar, User, Briefcase } from 'lucide-react';
import type { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProjectForContact?: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProjectForContact,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#160c08] border border-[#F4510B]/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 my-auto text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close Case Study"
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-black/40">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#160c08] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F4510B] text-white text-xs font-semibold tracking-wider uppercase mb-2">
                {project.categoryLabel}
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
                {project.title}
              </h3>
              <p className="text-neutral-300 text-sm mt-1">{project.subtitle}</p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FF9D00]" />
                <div>
                  <div className="text-neutral-400">Client</div>
                  <div className="font-semibold text-white">{project.client}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF9D00]" />
                <div>
                  <div className="text-neutral-400">Year</div>
                  <div className="font-semibold text-white">{project.year}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <User className="w-4 h-4 text-[#FF9D00]" />
                <div>
                  <div className="text-neutral-400">Role</div>
                  <div className="font-semibold text-white">{project.role}</div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-lg font-display font-bold text-white mb-2">
                Project Overview
              </h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <h5 className="text-sm font-bold text-[#FF9D00] uppercase tracking-wider mb-2">
                  The Challenge
                </h5>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <h5 className="text-sm font-bold text-[#F4510B] uppercase tracking-wider mb-2">
                  The Creative Solution
                </h5>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Color Palette Swatches */}
            <div>
              <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Color Harmonization
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {project.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div
                      className="w-5 h-5 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-xs text-neutral-300 uppercase">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">
                Key Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-200">
                    <Check className="w-4 h-4 text-[#FF9D00] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-neutral-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onSelectProjectForContact) {
                    onSelectProjectForContact(project.title);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:scale-105 transition-all"
              >
                <span>Inquire About Similar Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
