import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';

export const AboutSection: React.FC = () => {
  const { content } = usePortfolioContent();
  const personalInfo = content.personalInfo;
  const aboutShowcaseCards = content.aboutShowcaseCards;

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
        {/* Top Two-Column Editorial Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 md:mb-24">
          {/* Left Column: Orange Tag & Line-by-Line Striking Heading */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4"
            >
              <EditableElement
                id="about-label"
                section="about"
                type="text"
                label="Section Tag"
                propertyPath="personalInfo.aboutLabel"
                currentValue={personalInfo.aboutLabel}
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {personalInfo.aboutLabel}
                  </span>
                </div>
              </EditableElement>
            </motion.div>

            {/* Main heading */}
            <EditableElement
              id="about-headline"
              section="about"
              type="text"
              label="Main Headline"
              propertyPath="personalInfo.aboutHeadline"
              currentValue={personalInfo.aboutHeadline}
              options={{ multiline: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.08] tracking-tight text-white whitespace-pre-line">
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
            </EditableElement>
          </div>

          {/* Right Column: Descriptions & Orange Rounded CTA Button */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1">
            <div className="space-y-4">
              <EditableElement
                id="about-bio"
                section="about"
                type="text"
                label="Bio Paragraph"
                propertyPath="personalInfo.aboutBio"
                currentValue={personalInfo.aboutBio}
                options={{ multiline: true }}
              >
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg md:text-xl font-medium text-white/95 leading-relaxed"
                >
                  {personalInfo.aboutBio}
                </motion.p>
              </EditableElement>

              <EditableElement
                id="about-supporting"
                section="about"
                type="text"
                label="Supporting Text"
                propertyPath="personalInfo.aboutSupporting"
                currentValue={personalInfo.aboutSupporting}
                options={{ multiline: true }}
              >
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm md:text-base text-white/65 leading-relaxed"
                >
                  {personalInfo.aboutSupporting}
                </motion.p>
              </EditableElement>
            </div>

            {/* CTA Button & Link */}
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

        {/* Visual Showcase: 3 More Generously Rounded Editorial Cards */}
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
              className="group relative h-[360px] sm:h-[400px] md:h-[440px] rounded-[24px] sm:rounded-[26px] md:rounded-[28px] lg:rounded-[30px] overflow-hidden bg-[#141414] border border-white/12 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/25 hover:shadow-[0_20px_40px_-10px_rgba(255,90,31,0.18)]"
            >
              <EditableElement
                id={`about-card-${card.id}`}
                section="about"
                type="image"
                label={`Card Image: ${card.title}`}
                propertyPath={`aboutShowcaseCards.${idx}.image`}
                currentValue={card.image}
                className="w-full h-full"
              >
                {/* Background Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 font-bold border border-white/10">
                      {card.category}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:bg-[#FF5A1F] group-hover:border-[#FF5A1F] transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-[#FF5A1F] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-2 font-medium tracking-wide">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </EditableElement>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
