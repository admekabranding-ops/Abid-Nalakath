import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo, aboutShowcaseCards } from '../data/portfolioData';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Two-Column Editorial Intro (Matches Reference "Behind the Designs") */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 md:mb-24">
          {/* Left Column: Orange Tag & Large Striking Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-start"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {personalInfo.aboutLabel}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.08] tracking-tight text-white whitespace-pre-line">
              {personalInfo.aboutHeadline}
            </h2>
          </motion.div>

          {/* Right Column: Descriptions & Orange Rounded CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-between h-full pt-1"
          >
            <div className="space-y-4">
              <p className="text-lg md:text-xl font-medium text-white/95 leading-relaxed">
                {personalInfo.aboutBio}
              </p>
              <p className="text-sm md:text-base text-white/65 leading-relaxed">
                {personalInfo.aboutSupporting}
              </p>
            </div>

            {/* Rounded Orange Contact Button (Matches Reference) */}
            <div className="mt-8 pt-4 flex flex-wrap items-center gap-6">
              <a
                href="#contact"
                className="pill-button-orange group"
                aria-label="Let's Work Together with Abid Nalakath"
              >
                <span>Let's Work Together</span>
                <span className="pill-arrow-white">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>

              <a
                href="#services"
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>Explore Services</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5A1F]" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Visual Showcase: 3 Editorial Cards (Matching Reference Trio) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {aboutShowcaseCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-3xl overflow-hidden bg-[#141414] border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col"
            >
              {/* Card Image Container with Smooth Zoom */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1c1c1c]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-black/20 pointer-events-none" />

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {card.category}
                  </span>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                  <h3 className="text-xl font-bold text-white leading-snug group-hover:text-[#FF5A1F] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
