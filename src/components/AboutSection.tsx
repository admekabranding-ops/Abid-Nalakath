import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo, aboutShowcaseCards } from '../data/portfolioData';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const headlineLines = personalInfo.aboutHeadline.split('\n');

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Two-Column Editorial Intro (Matches Reference "Behind the Designs") */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 md:mb-24">
          {/* Left Column: Orange Tag & Line-by-Line Striking Heading */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* 1. Orange section label with subtle fade-in and upward movement */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {personalInfo.aboutLabel}
              </span>
            </motion.div>

            {/* 2. Main heading with smooth line-by-line text reveal */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.08] tracking-tight text-white">
              {headlineLines.map((line, i) => (
                <div key={i} className="overflow-hidden py-0.5">
                  <motion.span
                    initial={prefersReducedMotion ? false : { y: '100%', opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: prefersReducedMotion ? 0 : 0.08 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </h2>
          </div>

          {/* Right Column: Descriptions & Orange Rounded CTA Button */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1">
            <div className="space-y-4">
              {/* 3. Right-side description with gentle fade-in and upward motion */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl font-medium text-white/95 leading-relaxed"
              >
                {personalInfo.aboutBio}
              </motion.p>

              {/* 4. Supporting paragraph shortly afterward */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm md:text-base text-white/65 leading-relaxed"
              >
                {personalInfo.aboutSupporting}
              </motion.p>
            </div>

            {/* 5. CTA Button & Link with slight upward movement and fade-in */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 pt-4 flex flex-wrap items-center gap-6"
            >
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
                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5 font-medium group"
              >
                <span>Explore Services</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5A1F] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Visual Showcase: 3 More Generously Rounded Editorial Cards (24–30px radius) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {aboutShowcaseCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 60,
                      scale: 0.92,
                    }
              }
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }
                  : {}
              }
              transition={{
                duration: 0.7,
                delay: prefersReducedMotion ? 0 : 0.45 + idx * 0.13,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative rounded-[24px] sm:rounded-[26px] md:rounded-[28px] lg:rounded-[30px] overflow-hidden bg-[#141414] border border-white/12 hover:border-white/25 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col will-change-transform"
            >
              {/* Card Image Container with Restrained Smooth Zoom (1.05x) and Rounded Clipping */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1c1c1c] rounded-[24px] sm:rounded-[26px] md:rounded-[28px] lg:rounded-[30px]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  loading="lazy"
                />

                {/* Subtle Enhanced Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/35 to-black/25 group-hover:from-[#0B0B0B]/95 group-hover:via-[#0B0B0B]/40 transition-opacity duration-500 pointer-events-none" />

                {/* Top Row: Category Pill Tag + Interactive Arrow Indicator */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white/90 border border-white/15">
                    {card.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/75 group-hover:text-[#FF5A1F] group-hover:border-[#FF5A1F]/40 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10 pointer-events-none">
                  <h3 className="text-xl font-bold text-white leading-snug group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-normal">
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
