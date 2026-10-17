import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import type { Project } from '../types';

interface ProjectsSectionProps {
  onOpenProject: (project: Project) => void;
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProject, projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Branding', 'Social Media', 'Posters', 'Digital Art', 'Packaging'];

  const projectList = projects && projects.length > 0 ? projects : projectsData;

  const filteredProjects = activeCategory === 'All'
    ? projectList
    : projectList.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#F4510B]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4510B]/30 bg-[#F4510B]/10 text-[#FF9D00] text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Featured <span className="text-[#F4510B]">Case Studies</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
            A selection of brand identities, advertising key visuals, social campaigns, and digital art created for ambitious modern clients.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#140a07] p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white shadow-glow-orange'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer bg-[#140a07] rounded-3xl border border-white/10 hover:border-[#F4510B]/50 overflow-hidden shadow-xl hover:shadow-[0_20px_45px_rgba(244,81,11,0.2)] transition-all duration-500 flex flex-col justify-between"
            >
              {/* Project Preview Image */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-900">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140a07] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FF9D00] text-[10px] font-semibold tracking-wider uppercase">
                    {project.category}
                  </span>
                </div>

                {/* View Case Study Hover Pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#151515] font-semibold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-3.5 h-3.5 text-[#F4510B]" />
                    <span>View Case Study</span>
                  </span>
                </div>
              </div>

              {/* Project Details Bottom */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-[#FF9D00] transition-colors">
                      {project.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#F4510B] flex items-center justify-center text-white/70 group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {project.subtitle}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {project.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] text-neutral-400 px-2 py-0.5 rounded-md bg-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
