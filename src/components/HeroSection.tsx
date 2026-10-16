import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

interface HeroSectionProps {
  onExploreWork: () => void;
  onNavigate: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreWork, onNavigate }) => {
  return (
    <section id="hero" className="relative pt-24 pb-12 md:py-28 px-3 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Outer Rounded Container with Signature Orange Border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] border border-[#F4510B]/35 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.7)] bg-[#0e0705]"
      >
        {/* ================= DESKTOP LAYOUT (lg & above) ================= */}
        <div className="hidden lg:grid grid-cols-12 min-h-[660px] xl:min-h-[720px] relative">
          
          {/* LEFT SIDE — RICH WARM ORANGE HERO AREA (cols 1-7) */}
          <div className="col-span-7 relative p-10 xl:p-14 flex flex-col justify-between overflow-hidden z-10 hero-orange-gradient">
            {/* Background Watermark Geometric Rings */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg viewBox="0 0 800 800" className="w-full h-full text-white/30" fill="none">
                <circle cx="560" cy="380" r="260" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="560" cy="380" r="380" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                <path d="M 280 120 C 420 200, 500 480, 720 540" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>

            {/* Radial glow highlight */}
            <div className="absolute top-1/4 right-0 w-[450px] h-[450px] rounded-full bg-[#FF9D00]/30 blur-[90px] pointer-events-none" />

            {/* Top Area: Logo + Outlined Badge */}
            <div className="relative z-10">
              {/* Reference Monogram Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 flex items-center gap-3"
              >
                <div className="w-10 h-10 text-white flex items-center justify-center">
                  <svg viewBox="0 0 52 40" fill="none" className="w-full h-full text-white">
                    <path
                      d="M14 8C23 13 23 27 14 32C28 32 28 8 14 8Z"
                      fill="currentColor"
                    />
                    <path
                      d="M38 8C29 13 29 27 38 32C24 32 24 8 38 8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Outlined Pill Badge */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white/95 text-xs font-medium tracking-wide mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
                <span>{personalInfo.subtitle}</span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-md xl:max-w-lg mb-8"
              >
                <h1 className="font-display text-[44px] xl:text-[58px] font-light text-white tracking-tight leading-[1.08]">
                  {personalInfo.heroHeadingLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </motion.div>

              {/* White Pill CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={onExploreWork}
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-[#151515] font-semibold text-sm xl:text-base glow-pill-btn hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                  <span>View My Work</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F4510B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Bottom-Left Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative z-10 flex items-center gap-3.5 pt-10"
            >
              {/* Stat Card 1 */}
              <div className="bg-white rounded-2xl p-4 xl:p-5 shadow-lg border border-black/5 min-w-[135px]">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[11px] font-medium text-gray-500">Projects Built</span>
                  <div className="w-5 h-5 rounded-full bg-[#F4510B]/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-[#F4510B]" />
                  </div>
                </div>
                <div className="text-2xl xl:text-3xl font-display font-bold text-[#151515] tracking-tight">
                  100+
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-2xl p-4 xl:p-5 shadow-lg border border-black/5 min-w-[135px]">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[11px] font-medium text-gray-500">Client Support</span>
                  <div className="w-5 h-5 rounded-full bg-[#F4510B]/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#F4510B]" />
                  </div>
                </div>
                <div className="text-2xl xl:text-3xl font-display font-bold text-[#151515] tracking-tight">
                  24/7
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE — LARGE WHITE INTRODUCTION PANEL (cols 8-12) */}
          <div className="col-span-5 bg-[#FFFFFF] relative p-10 xl:p-14 flex flex-col justify-between rounded-tl-[48px] rounded-bl-[48px] shadow-[-15px_0_40px_rgba(0,0,0,0.06)] z-10">
            {/* Top Navigation Row */}
            <div>
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-end gap-7 xl:gap-9 mb-12"
              >
                {['about', 'projects', 'services', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => onNavigate(item)}
                    className="capitalize text-xs xl:text-sm font-medium text-[#151515] hover:text-[#F4510B] transition-colors relative group py-1"
                  >
                    <span>{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4510B] group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </motion.nav>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50/80 text-[11px] font-medium text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for Projects</span>
                </div>
              </motion.div>

              {/* Main Introduction Statement with Reference Orange Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="space-y-4 max-w-md"
              >
                <h2 className="text-xl xl:text-2xl 2xl:text-[27px] font-normal text-[#151515] leading-[1.35] tracking-tight">
                  Hi, I’m{' '}
                  <span className="text-[#F4510B] font-semibold">
                    {personalInfo.name}
                  </span>
                  .<br />
                  I build{' '}
                  <span className="text-[#F4510B] font-semibold">
                    bold visuals
                  </span>
                  , distinctive branding &amp;{' '}
                  <span className="text-[#F4510B] font-semibold">
                    creative designs
                  </span>{' '}
                  for modern businesses.
                </h2>

                <p className="text-xs xl:text-sm text-[#686868] leading-relaxed pt-2">
                  {personalInfo.heroIntro.subtext1}
                </p>

                <div className="pt-2 flex flex-col gap-1 text-[11px] xl:text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4510B]" />
                    <span>Clean editorial design.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4510B]" />
                    <span>Smooth motion &amp; micro-interactions.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4510B]" />
                    <span>Distinctive brand systems.</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom-Right Floating Profile / Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 self-end w-full max-w-xs"
            >
              <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-4 xl:p-5 shadow-card-soft">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={personalInfo.floatingCard.avatar}
                    alt={personalInfo.name}
                    className="w-11 h-11 rounded-xl object-cover border border-black/10 shadow-sm"
                  />
                  <div>
                    <h3 className="font-display font-bold text-xs xl:text-sm text-[#151515] leading-tight">
                      {personalInfo.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {personalInfo.title}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed italic">
                  {personalInfo.floatingCard.quote}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ================= CENTER OVERLAPPING PORTRAIT (DESKTOP) ================= */}
          <div className="absolute inset-y-0 left-[53%] xl:left-[51%] -translate-x-1/2 z-20 flex flex-col items-center justify-end pointer-events-none w-[560px] xl:w-[650px] 2xl:w-[720px]">
            {/* Cutout Portrait Image of Abid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex items-end justify-center origin-bottom"
            >
              <img
                src="/assets/abid-hero.png"
                alt="Abid Nalakath — Creative Designer"
                className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] select-none scale-105 xl:scale-115 origin-bottom"
              />

              {/* Bottom Center Social Media Icons overlapping chest/waist */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3">
                <a
                  href={personalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.socials.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  className="w-10 h-10 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md"
                >
                  <DribbbleIcon className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ================= MOBILE & TABLET LAYOUT (< lg) ================= */}
        <div className="lg:hidden flex flex-col">
          
          {/* Top Orange Hero Container */}
          <div className="p-6 sm:p-8 relative overflow-hidden hero-orange-gradient">
            {/* Watermark Rings */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full border border-white/15 pointer-events-none" />

            {/* Top row: Monogram Logo & Status */}
            <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
              <div className="w-8 h-8 text-white">
                <svg viewBox="0 0 52 40" fill="none" className="w-full h-full text-white">
                  <path d="M14 8C23 13 23 27 14 32C28 32 28 8 14 8Z" fill="currentColor" />
                  <path d="M36 8C29 13 29 27 38 32C24 32 24 8 36 8Z" fill="currentColor" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
                <span>{personalInfo.subtitle}</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="relative z-10 mb-6">
              <h1 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight leading-[1.12]">
                {personalInfo.heroHeadingLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 mb-8">
              <button
                onClick={onExploreWork}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#151515] font-semibold text-sm glow-pill-btn hover:bg-neutral-50 transition-all duration-300"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4 text-[#F4510B]" />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-0.5">
                  <span>Projects Built</span>
                  <TrendingUp className="w-3 h-3 text-[#F4510B]" />
                </div>
                <div className="text-xl font-display font-bold text-[#151515]">100+</div>
              </div>

              <div className="bg-white rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-0.5">
                  <span>Client Support</span>
                  <Sparkles className="w-3 h-3 text-[#F4510B]" />
                </div>
                <div className="text-xl font-display font-bold text-[#151515]">24/7</div>
              </div>
            </div>
          </div>

          {/* Central Portrait on Mobile with Smooth Transition */}
          <div className="relative bg-gradient-to-b from-[#C63D08] via-[#651B0D] to-[#151515] pt-6 pb-2 flex flex-col items-center justify-end overflow-hidden">
            <div className="relative w-full max-w-sm sm:max-w-md flex items-end justify-center px-4">
              <img
                src="/assets/abid-hero.png"
                alt="Abid Nalakath"
                className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-contain object-bottom drop-shadow-2xl scale-110 origin-bottom"
              />

              {/* Mobile Social Buttons */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                <a
                  href={personalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.socials.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <DribbbleIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom White Panel on Mobile */}
          <div className="bg-[#FFFFFF] p-6 sm:p-8 flex flex-col gap-6">
            {/* Status */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Projects</span>
              </div>
            </div>

            {/* Intro text */}
            <h2 className="text-lg sm:text-xl font-normal text-[#151515] leading-snug">
              Hi, I’m{' '}
              <span className="text-[#F4510B] font-semibold">
                {personalInfo.name}
              </span>
              .<br />
              I build{' '}
              <span className="text-[#F4510B] font-semibold">
                bold visuals
              </span>
              , distinctive branding &amp;{' '}
              <span className="text-[#F4510B] font-semibold">
                creative designs
              </span>{' '}
              for modern businesses.
            </h2>

            <p className="text-xs sm:text-sm text-[#686868] leading-relaxed">
              {personalInfo.heroIntro.subtext1}
            </p>

            {/* Testimonial Quote Card */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={personalInfo.floatingCard.avatar}
                  alt={personalInfo.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-display font-bold text-xs text-[#151515]">
                    {personalInfo.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {personalInfo.title}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-700 italic">
                {personalInfo.floatingCard.quote}
              </p>
            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
};
