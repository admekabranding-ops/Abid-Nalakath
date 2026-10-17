import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Award, Palette } from 'lucide-react';
import { processSteps, skillsList, toolsMastered } from '../data/portfolioData';

interface AboutSectionProps {
  aboutContent?: any;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutContent }) => {
  const heading = aboutContent?.heading || "Design With Purpose.";
  const story = aboutContent?.story || "I’m Abid Nalakath, a creative designer passionate about transforming bold ideas into clear, engaging and visually distinctive experiences. With a deep respect for minimalism, deliberate typography, and high-energy color systems, I help companies build timeless visual authority.";
  const philosophyTitle = aboutContent?.philosophyTitle || "Where Strategy Meets Pure Visual Artistry";
  const philosophyDesc = aboutContent?.philosophyDesc || "Great design is never just decoration. It is visual problem solving that bridges emotion and business outcomes. Every color gradient, kerning choice, and spatial composition is engineered to provoke curiosity, communicate trust, and solidify brand recognition.";
  const focus = aboutContent?.focus || "Identity & High-Impact Campaigns";
  const philosophyText = aboutContent?.philosophyText || "Obsessive Simplicity & Raw Energy";
  const experienceYears = aboutContent?.experienceYears || "6+ Years Crafting Global Brand Narratives";
  const skills = aboutContent?.skills && aboutContent.skills.length > 0 ? aboutContent.skills : skillsList;
  const steps = aboutContent?.processSteps && aboutContent.processSteps.length > 0 ? aboutContent.processSteps : processSteps;
  const tools = aboutContent?.tools && aboutContent.tools.length > 0 ? aboutContent.tools : toolsMastered;

  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#F4510B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#FF9D00]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4510B]/30 bg-[#F4510B]/10 text-[#FF9D00] text-xs font-semibold tracking-wider uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>About My Practice</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6"
        >
          {heading.includes('Purpose.') ? (
            <>
              {heading.replace('Purpose.', '')}<span className="text-[#F4510B]">Purpose.</span>
            </>
          ) : (
            heading
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed"
        >
          {story}
        </motion.p>
      </div>

      {/* Grid: Story Card + Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        {/* Left Column: Creative Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 bg-[#140a07] border border-[#F4510B]/20 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center text-white mb-6 shadow-glow-orange">
              <Compass className="w-6 h-6" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              {philosophyTitle}
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
              {philosophyDesc}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#FF9D00] font-semibold mb-1">
                  Focus
                </div>
                <div className="text-white text-sm font-medium">
                  {focus}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[#FF9D00] font-semibold mb-1">
                  Philosophy
                </div>
                <div className="text-white text-sm font-medium">
                  {philosophyText}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Skills Matrix */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 bg-[#140a07] border border-[#F4510B]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#F4510B]/15 flex items-center justify-center text-[#FF9D00]">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Core Competencies
              </h3>
            </div>

            <div className="space-y-4">
              {skills.map((skill: any, index: number) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-neutral-200">{skill.name}</span>
                    <span className="text-[#FF9D00] font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 * index, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#C63D08] via-[#F4510B] to-[#FF9D00] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-3">
            <Award className="w-5 h-5 text-[#FF9D00]" />
            <span className="text-xs text-neutral-400">
              {experienceYears}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 4-Step Design Workflow */}
      <div className="mb-24">
        <div className="text-center mb-14">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            The Creative Process
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            A tested, iterative methodology that guarantees visual consistency from concept to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#140a07] border border-white/10 hover:border-[#F4510B]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 group relative"
            >
              <div className="text-3xl font-display font-extrabold text-[#F4510B]/30 group-hover:text-[#F4510B] transition-colors mb-4">
                {step.step}
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF9D00] transition-colors">
                {step.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tools Mastered */}
      <div className="bg-[#140a07] border border-[#F4510B]/20 rounded-3xl p-8 sm:p-12 text-center">
        <h3 className="text-xs uppercase tracking-widest text-[#FF9D00] font-semibold mb-3">
          Software &amp; Digital Arsenal
        </h3>
        <p className="text-xl sm:text-2xl font-display font-bold text-white mb-8">
          Crafting with the Industry’s Premier Creative Tools
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tools.map((tool: any, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#F4510B]/40 hover:bg-[#F4510B]/10 transition-all text-center group"
            >
              <div className="font-semibold text-sm text-white group-hover:text-[#FF9D00] transition-colors">
                {tool.name}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {tool.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
