import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioProjects } from '../data/portfolioData';
import type { PortfolioCategory, ProjectItem } from '../types';
import { Sparkles, ArrowUpRight, Play, Eye } from 'lucide-react';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

const categories: PortfolioCategory[] = [
  'All',
  'Graphic Design',
  'Branding',
  'AI Videos',
  'Applications',
  'Websites',
];

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('All');

  const filteredProjects = selectedCategory === 'All'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SELECTED WORK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Creativity in <br className="hidden sm:inline" />
              <span className="text-white/80">Every Detail.</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-white/65 max-w-md">
            A collection of visual ideas, digital experiences, and creative projects across brand identity, generative cinema, and software architectures.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar" role="tablist">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                role="tab"
                aria-selected={isActive}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{category}</span>
                {category !== 'All' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-white/60'
                  }`}>
                    {portfolioProjects.filter((p) => p.category === category).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filterable Editorial Project Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              // Asymmetric editorial grid sizing
              const isLarge = index % 3 === 0;
              const colClass = isLarge ? 'lg:col-span-7' : 'lg:col-span-5';

              return (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onSelectProject(project)}
                  className={`${colClass} group relative rounded-3xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 cursor-pointer transition-all duration-500 flex flex-col justify-between`}
                >
                  {/* Card Thumbnail Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1c1c1c]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/25 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {project.categoryLabel}
                      </span>
                      {project.videoPreview ? (
                        <span className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF5A1F]/30">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-mono text-white/40">{project.year}</span>
                        <span className="text-xs text-white/50">{project.client}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#FF5A1F] transition-colors leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs md:text-sm text-white/70 mt-2 line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Bottom Details Row */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-[#FF5A1F] transition-colors">
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
