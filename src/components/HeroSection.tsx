import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

interface HeroSectionProps {
  onExploreWork: () => void;
  onNavigate: (id: string) => void;
  heroContent?: any;
  statsContent?: any[];
  socialsContent?: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWork,
  onNavigate,
  heroContent,
  statsContent,
  socialsContent,
}) => {
  const subtitle = heroContent?.subtitle || `${heroContent?.name || "Abid Nalakath"} • ${heroContent?.title || "Creative Designer"}`;
  const headingLines: string[] = heroContent?.heroHeadingLines && heroContent.heroHeadingLines.length > 0
    ? heroContent.heroHeadingLines
    : personalInfo.heroHeadingLines;
  const ctaText = heroContent?.ctaText || "View My Work";
  const stat1 = statsContent?.[0] || { label: "Projects Built", value: "100+" };
  const stat2 = statsContent?.[1] || { label: "Client Support", value: "24/7" };
  const heroImage = heroContent?.heroImage || "/assets/abid-hero.png";
  const socials = socialsContent || personalInfo.socials;
  const availableStatus = heroContent?.availableStatus || "Available";
  const introGreeting = heroContent?.introGreeting || "Hi, I'm";
  const introName = heroContent?.introName || "Abid";
  const introStatement = heroContent?.introStatement || "I build modern, bold visuals for brands, businesses & creators.";
  const introLines: string[] = heroContent?.introLines || [
    "Clean design.",
    "Smooth animations.",
    "Distinctive branding."
  ];
  const quoteCard = heroContent?.quoteCard || personalInfo.floatingCard;
  const headingStyles: React.CSSProperties = heroContent?.headingStyles || {};
  const badgeStyles: React.CSSProperties = heroContent?.badgeStyles || {};
  const ctaStyles: React.CSSProperties = heroContent?.ctaStyles || {};
  const portraitStyles: React.CSSProperties = heroContent?.portraitStyles || {};
  const introStyles: React.CSSProperties = heroContent?.introStyles || {};
  return (
    <section id="hero" className="relative pt-24 pb-12 md:py-24 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      {/* Outer Rounded Container with Signature Warm Orange Border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] border border-[#F4510B]/40 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.6)] bg-[#0e0705]"
      >
        {/* ================= DESKTOP INTEGRATED MERGED LAYOUT (lg & above) ================= */}
        <div className="hidden lg:grid grid-cols-12 min-h-[640px] xl:min-h-[680px] relative">
          
          {/* LEFT SIDE — RICH WARM ORANGE HERO AREA (cols 1-7) */}
          <div className="col-span-7 relative p-10 xl:p-12 flex flex-col justify-between overflow-hidden z-10 hero-orange-gradient">
            {/* Background Watermark Concentric Geometric Rings */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg viewBox="0 0 800 800" className="w-full h-full text-white/40" fill="none">
                <circle cx="560" cy="380" r="260" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="560" cy="380" r="380" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                <path d="M 280 120 C 420 200, 500 480, 720 540" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>

            {/* Ambient Radial Golden Glow */}
            <div className="absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full bg-[#FF9D00]/30 blur-[90px] pointer-events-none" />

            {/* Top Area: Reference Monogram Logo + Outlined Badge */}
            <div className="relative z-10">
              {/* Monogram Logo / Custom Uploaded Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-5 flex items-center gap-3"
              >
                {heroContent?.logoImage ? (
                  <img
                    src={heroContent.logoImage}
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 text-white flex items-center justify-center">
                    <svg viewBox="0 0 52 40" fill="none" className="w-full h-full text-white">
                      <path d="M14 8C23 13 23 27 14 32C28 32 28 8 14 8Z" fill="currentColor" />
                      <path d="M38 8C29 13 29 27 38 32C24 32 24 8 38 8Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Outlined Pill Badge */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={badgeStyles}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white/95 text-xs font-medium tracking-wide mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
                <span>{subtitle}</span>
              </motion.div>

              {/* Main Headline — Exact Reference Line-breaks & Lightweight Font */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-md xl:max-w-lg mb-7"
              >
                <h1 style={headingStyles} className="font-display text-[42px] xl:text-[54px] font-light text-white tracking-tight leading-[1.08]">
                  {headingLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < headingLines.length - 1 && <br />}
                    </React.Fragment>
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
                  style={ctaStyles}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#151515] font-semibold text-sm glow-pill-btn hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                  <span>{ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F4510B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Bottom-Left Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative z-10 flex items-center gap-3 pt-8"
            >
              {/* Stat Card 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-black/5 min-w-[130px]">
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <span className="text-[11px] font-medium text-gray-500">{stat1.label}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#F4510B]" />
                </div>
                <div className="text-2xl font-display font-bold text-[#151515] tracking-tight">
                  {stat1.value}
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-black/5 min-w-[130px]">
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <span className="text-[11px] font-medium text-gray-500">{stat2.label}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F4510B]" />
                </div>
                <div className="text-2xl font-display font-bold text-[#151515] tracking-tight">
                  {stat2.value}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE — SEAMLESS MERGED WHITE PANEL (cols 8-12) */}
          {/* Notice: rounded-tl-[36px] xl:rounded-tl-[44px] and rounded-bl-none with NO harsh drop shadow so it seamlessly merges! */}
          <div className="col-span-5 bg-[#FFFFFF] relative p-8 xl:p-12 flex flex-col justify-between rounded-tl-[36px] xl:rounded-tl-[44px] rounded-bl-none z-10">
            {/* Top Navigation Row */}
            <div>
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-end gap-6 xl:gap-8 mb-10"
              >
                {['about', 'projects', 'services', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => onNavigate(item)}
                    className="capitalize text-xs xl:text-sm font-medium text-[#151515] hover:text-[#F4510B] transition-colors py-1"
                  >
                    {item}
                  </button>
                ))}
              </motion.nav>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{availableStatus}</span>
                </div>
              </motion.div>

              {/* Clean Minimal Statement — Exactly Like Reference (No Over-Content!) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="space-y-4 max-w-sm xl:max-w-md"
              >
                <h2 style={introStyles} className="text-xl xl:text-2xl 2xl:text-[26px] font-normal text-[#151515] leading-[1.32] tracking-tight">
                  {introGreeting}{' '}
                  <span className="text-[#F4510B] font-semibold">
                    {introName}
                  </span>
                  .<br />
                  {introStatement}
                </h2>

                {/* 3 Clean Short Lines — Exact Reference Style */}
                <div className="pt-2 space-y-1 text-xs xl:text-sm text-[#686868] font-normal">
                  {introLines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom-Right Floating Profile / Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 self-end w-full max-w-xs"
            >
              <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={quoteCard.avatar || personalInfo.floatingCard.avatar}
                    alt={quoteCard.name || "Abid"}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-display font-bold text-xs text-[#151515]">
                      {quoteCard.name || "Abid"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {quoteCard.role || "Creative Designer"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#151515] leading-snug font-medium italic">
                  {quoteCard.quote || "“I create premium designs that look clean and convert.”"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ================= CENTER PORTRAIT (DESKTOP) ================= */}
          {/* Overlapping the boundary between orange and white seamlessly, rising cleanly from the bottom! */}
          <div style={portraitStyles} className="absolute bottom-0 left-[49%] xl:left-[49%] -translate-x-1/2 z-20 flex flex-col items-center justify-end pointer-events-none w-[520px] xl:w-[580px] 2xl:w-[620px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex items-end justify-center"
            >
              <img
                src={heroImage}
                alt={`${heroContent?.name || "Abid Nalakath"} — Creative Designer`}
                className="w-full h-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] select-none"
              />

              {/* Circular Social Outline Buttons across chest at the bottom */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2.5">
                <a
                  href={socials.instagram || personalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={socials.linkedin || personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={socials.dribbble || personalInfo.socials.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:border-[#FF9D00] hover:bg-[#F4510B]/50 hover:scale-110 active:scale-95 transition-all shadow-md"
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
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/20 pointer-events-none" />

            {/* Top row: Logo & Status */}
            <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
              <div className="w-8 h-8 text-white">
                <svg viewBox="0 0 52 40" fill="none" className="w-full h-full text-white">
                  <path d="M14 8C23 13 23 27 14 32C28 32 28 8 14 8Z" fill="currentColor" />
                  <path d="M36 8C29 13 29 27 38 32C24 32 24 8 36 8Z" fill="currentColor" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
                <span>{subtitle}</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="relative z-10 mb-5">
              <h1 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight leading-[1.12]">
                {headingLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < headingLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 mb-6">
              <button
                onClick={onExploreWork}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#151515] font-semibold text-xs glow-pill-btn hover:bg-neutral-50 transition-all duration-300"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F4510B]" />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-0.5">
                  <span>{stat1.label}</span>
                  <TrendingUp className="w-3 h-3 text-[#F4510B]" />
                </div>
                <div className="text-xl font-display font-bold text-[#151515]">{stat1.value}</div>
              </div>

              <div className="bg-white rounded-xl p-3 shadow-md">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-0.5">
                  <span>{stat2.label}</span>
                  <Sparkles className="w-3 h-3 text-[#F4510B]" />
                </div>
                <div className="text-xl font-display font-bold text-[#151515]">{stat2.value}</div>
              </div>
            </div>
          </div>

          {/* Central Portrait on Mobile */}
          <div className="relative bg-gradient-to-b from-[#C63D08] via-[#651B0D] to-[#151515] pt-6 pb-2 flex flex-col items-center justify-end overflow-hidden">
            <div className="relative w-full max-w-xs sm:max-w-sm flex items-end justify-center px-4">
              <img
                src={heroImage}
                alt={`${heroContent?.name || "Abid Nalakath"}`}
                className="w-full max-w-[290px] sm:max-w-[340px] h-auto object-contain object-bottom drop-shadow-2xl"
              />

              {/* Mobile Social Buttons */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
                <a
                  href={socials.instagram || personalInfo.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={socials.linkedin || personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={socials.dribbble || personalInfo.socials.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  className="w-8 h-8 rounded-full border border-white/30 bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <DribbbleIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Merged White Panel on Mobile */}
          <div className="bg-[#FFFFFF] p-6 sm:p-8 flex flex-col gap-5">
            {/* Status */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{availableStatus}</span>
              </div>
            </div>

            {/* Intro text */}
            <h2 className="text-lg sm:text-xl font-normal text-[#151515] leading-snug">
              {introGreeting}{' '}
              <span className="text-[#F4510B] font-semibold">
                {introName}
              </span>
              .<br />
              {introStatement}
            </h2>

            <div className="space-y-0.5 text-xs text-[#686868]">
              {introLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            {/* Testimonial Quote Card */}
            <div className="bg-[#FAF9F6] border border-black/5 rounded-xl p-3.5 shadow-sm mt-2">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={quoteCard.avatar || personalInfo.floatingCard.avatar}
                  alt={quoteCard.name || "Abid"}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-display font-bold text-xs text-[#151515]">
                    {quoteCard.name || "Abid"}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {quoteCard.role || "Creative Designer"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#151515] italic">
                {quoteCard.quote || "“I create premium designs that look clean and convert.”"}
              </p>
            </div>
          </div>

        </div>

      </motion.div>
    </section>
  );
};
