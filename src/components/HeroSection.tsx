import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { AnimatedHeroPortrait } from './AnimatedHeroPortrait';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';

export const HeroSection: React.FC = () => {
  const { content } = usePortfolioContent();
  const personalInfo = content.personalInfo;
  const heroServiceHighlights = content.heroServiceHighlights;

  const heroRef = useRef<HTMLElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  // Normalized cursor coordinates (-1 to +1) for desktop parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics-based spring configuration for organic interpolation without re-renders
  const springConfig = { damping: 28, stiffness: 130, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scroll parallax & Subject-Only Scroll Zoom (Desktop)
  const { scrollY } = useScroll();
  const scrollPortraitY = useTransform(scrollY, [0, 800], [0, 80]);
  const contentY = useTransform(scrollY, [0, 600], [0, 40]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  // Subject-Only Scroll Zoom: smoothly zooms the portrait subject (1.0 -> 1.22x) focused on face
  const subjectScrollScale = useTransform(scrollY, [0, 500], [1.0, 1.22], { clamp: true });

  // Depth displacement transforms (Desktop)
  const layer1BgX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const layer1BgY = useTransform(smoothY, [-1, 1], [-6, 6]);

  const layer2PortraitX = useTransform(smoothX, [-1, 1], [10, -10]);
  const layer2MouseY = useTransform(smoothY, [-1, 1], [8, -8]);
  const combinedPortraitY = useTransform(
    [scrollPortraitY, layer2MouseY],
    ([sVal, mVal]) => (isInteractive ? Number(sVal) + Number(mVal) : Number(sVal))
  );

  const layer2RotateX = useTransform(smoothY, [-1, 1], [0.8, -0.8]);
  const layer2RotateY = useTransform(smoothX, [-1, 1], [-1.2, 1.2]);

  const layer3TextX = useTransform(smoothX, [-1, 1], [-3, 3]);
  const layer3TextY = useTransform(smoothY, [-1, 1], [-3, 3]);

  const layer4ServicesX = useTransform(smoothX, [-1, 1], [4, -4]);
  const layer4ServicesY = useTransform(smoothY, [-1, 1], [3, -3]);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) {
      setIsInteractive(false);
      return;
    }
    setIsInteractive(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0B0B0B]"
      style={{ perspective: 1200 }}
    >
      {/* SHARED BACKGROUND GRADIENT ATMOSPHERE */}
      <motion.div
        style={{
          x: isInteractive ? layer1BgX : 0,
          y: isInteractive ? layer1BgY : 0,
        }}
        className="absolute inset-0 pointer-events-none z-0 will-change-transform"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px] bg-gradient-radial from-[#FF5A1F]/20 via-[#F52E36]/10 to-transparent rounded-full blur-[100px] sm:blur-[140px] opacity-75" />
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[500px] bg-gradient-to-bl from-[#FF5A1F]/15 via-transparent to-transparent rounded-full blur-[100px] opacity-60" />
      </motion.div>

      {/* ============================================================== */}
      {/* 1. MOBILE & TABLET HERO COMPOSITION (< 1024px)                 */}
      {/* Strict focal hierarchy: Face 100% visible, zero overlap        */}
      {/* ============================================================== */}
      <div className="lg:hidden relative z-10 w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-12 flex flex-col items-center text-center max-w-lg sm:max-w-xl mx-auto my-auto">
        {/* 1. Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-3"
        >
          <EditableElement
            id="hero-intro"
            section="hero"
            type="text"
            label="Intro Badge"
            propertyPath="personalInfo.heroIntro"
            currentValue={personalInfo.heroIntro}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_8px_#FF5A1F] animate-pulse indicator-dot" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F]">
                {personalInfo.heroIntro}
              </span>
            </div>
          </EditableElement>
        </motion.div>

        {/* 2. Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full"
        >
          <EditableElement
            id="hero-heading"
            section="hero"
            type="text"
            label="Main Heading"
            propertyPath="personalInfo.heroHeading"
            currentValue={personalInfo.heroHeading}
            options={{ multiline: true }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.0] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none whitespace-pre-line">
              {personalInfo.heroHeading}
            </h1>
          </EditableElement>
        </motion.div>

        {/* 3. Centered Main Portrait with Complete Face Visibility & Ambient Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/3] sm:aspect-[16/11] my-5 sm:my-6"
        >
          {/* Subtle Warm Atmospheric Glow Halo behind card */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#FF5A1F]/30 via-[#F52E36]/20 to-[#FF5A1F]/30 rounded-[32px] blur-xl opacity-80 pointer-events-none" />

          {/* Portrait Container Frame */}
          <div className="relative z-10 w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/15 bg-[#141414] shadow-2xl shadow-black/80">
            <EditableElement
              id="hero-portrait"
              section="hero"
              type="image"
              label="Main Portrait"
              propertyPath="personalInfo.portraitUrl"
              currentValue={personalInfo.portraitUrl || '/images/abid-portrait.png'}
              className="w-full h-full"
            >
              <AnimatedHeroPortrait
                src={personalInfo.portraitUrl || '/images/abid-portrait.png'}
                alt="Abid Nalakath — Creative Designer"
                className="w-full h-full object-cover object-[53%_26%] sm:object-[53%_27%] filter brightness-[0.98] contrast-[1.04]"
              />

              {/* Gentle bottom shadow bleed for visual integration */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            </EditableElement>
          </div>
        </motion.div>

        {/* 4. Supporting Introduction Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
          className="w-full"
        >
          <EditableElement
            id="hero-supporting"
            section="hero"
            type="text"
            label="Hero Description"
            propertyPath="personalInfo.heroSupporting"
            currentValue={personalInfo.heroSupporting}
            options={{ multiline: true }}
          >
            <p className="text-xs sm:text-sm md:text-base text-white/85 font-medium max-w-sm sm:max-w-md mx-auto leading-relaxed drop-shadow-sm">
              {personalInfo.heroSupporting}
            </p>
          </EditableElement>
        </motion.div>

        {/* 5. Mobile CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          <EditableElement
            id="btn-view-work"
            section="hero"
            type="button"
            label="View Work CTA"
            propertyPath="personalInfo.viewWorkText"
            currentValue={personalInfo.viewWorkText || 'View My Work'}
            className="w-full sm:w-auto"
          >
            <a
              href={personalInfo.viewWorkLink || '#projects'}
              className="w-full sm:w-auto pill-button-orange group text-xs sm:text-sm font-extrabold tracking-wider uppercase px-6 py-3.5 shadow-lg shadow-[#FF5A1F]/30 text-center justify-center shrink-0 active:scale-95 inline-flex items-center gap-2"
              aria-label="View My Work Portfolio Projects"
            >
              <span>{personalInfo.viewWorkText || 'View My Work'}</span>
              <span className="pill-arrow-white scale-90">
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </EditableElement>

          <EditableElement
            id="btn-lets-talk"
            section="hero"
            type="button"
            label="Let's Talk CTA"
            propertyPath="personalInfo.letsTalkText"
            currentValue={personalInfo.letsTalkText || "Let's Talk"}
            className="w-full sm:w-auto"
          >
            <a
              href={personalInfo.letsTalkLink || '#contact'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md text-center shrink-0"
              aria-label="Let's Talk Contact Abid Nalakath"
            >
              <span>{personalInfo.letsTalkText || "Let's Talk"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            </a>
          </EditableElement>
        </motion.div>

        {/* 6. Core Services Highlight Chips on Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="w-full mt-8 pt-6 border-t border-white/10"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mb-3.5 font-semibold text-center">
            Core Services
          </p>
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {heroServiceHighlights.map((highlight) => (
              <a
                key={highlight.number}
                href={highlight.href}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FF5A1F]/40 active:scale-[0.98] transition-all group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono font-bold text-[#FF5A1F]">
                    {highlight.number}
                  </span>
                  <span className="text-xs font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors tracking-tight">
                    {highlight.title}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF5A1F] transition-colors shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP HERO COMPOSITION (>= 1024px)                        */}
      {/* Exact 3-column desktop composition with parallax preserved    */}
      {/* ============================================================== */}
      <div className="hidden lg:block">
        {/* Full-Screen Desktop Background Portrait */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
          <motion.div
            style={{
              x: isInteractive ? layer2PortraitX : 0,
              y: combinedPortraitY,
              rotateX: isInteractive ? layer2RotateX : 0,
              rotateY: isInteractive ? layer2RotateY : 0,
              scale: subjectScrollScale,
              transformOrigin: '53% 32%',
            }}
            className="relative w-full h-full will-change-transform transform-gpu"
          >
            <EditableElement
              id="hero-portrait"
              section="hero"
              type="image"
              label="Main Portrait"
              propertyPath="personalInfo.portraitUrl"
              currentValue={personalInfo.portraitUrl || '/images/abid-portrait.png'}
              className="w-full h-full"
            >
              <AnimatedHeroPortrait
                src={personalInfo.portraitUrl || '/images/abid-portrait.png'}
                alt="Abid Nalakath — Creative Designer"
                className="w-full h-full object-cover object-[53%_35%] xl:object-[53%_35%] filter brightness-[0.98] contrast-[1.04]"
              />
            </EditableElement>

            {/* Top Vignette strictly for Navigation Bar legibility */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/15 to-transparent pointer-events-none" />

            {/* Desktop Bottom Fade transitioning into Section 02 */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent pointer-events-none" />

            {/* Subtle tactile noise texture */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          </motion.div>
        </div>

        {/* Top Spacer for Fixed Navigation Bar */}
        <div className="h-28 shrink-0 relative z-10" />

        {/* Desktop 3-Column Layout */}
        <motion.div
          style={{
            y: contentY,
            opacity: contentOpacity,
          }}
          className="relative z-10 w-full max-w-[1920px] mx-auto lg:pl-[4.5%] lg:pr-[4.5%] xl:pl-[5.5%] xl:pr-[5.5%] 2xl:pl-[6.5%] 2xl:pr-[6.5%] flex items-center justify-between my-auto"
        >
          {/* LAYER 3: LEFT SIDE SAFE AREA */}
          <motion.div
            style={{
              x: isInteractive ? layer3TextX : 0,
              y: isInteractive ? layer3TextY : 0,
            }}
            className="w-[28%] max-w-[340px] xl:max-w-[380px] 2xl:max-w-[420px] flex flex-col items-start text-left z-20 shrink-0 will-change-transform"
          >
            {/* Small Introduction */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mb-3"
            >
              <EditableElement
                id="hero-intro"
                section="hero"
                type="text"
                label="Intro Badge"
                propertyPath="personalInfo.heroIntro"
                currentValue={personalInfo.heroIntro}
              >
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_10px_#FF5A1F] animate-pulse indicator-dot" />
                  <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F] drop-shadow-sm">
                    {personalInfo.heroIntro}
                  </span>
                </div>
              </EditableElement>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              <EditableElement
                id="hero-heading"
                section="hero"
                type="text"
                label="Main Heading"
                propertyPath="personalInfo.heroHeading"
                currentValue={personalInfo.heroHeading}
                options={{ multiline: true }}
              >
                <h1 className="text-[3rem] xl:text-[3.6rem] 2xl:text-[4.2rem] font-black leading-[0.92] tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none whitespace-pre-line">
                  {personalInfo.heroHeading}
                </h1>
              </EditableElement>
            </motion.div>

            {/* Supporting Text */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              <EditableElement
                id="hero-supporting"
                section="hero"
                type="text"
                label="Hero Description"
                propertyPath="personalInfo.heroSupporting"
                currentValue={personalInfo.heroSupporting}
                options={{ multiline: true }}
              >
                <p className="text-[14px] xl:text-base text-white/90 font-medium max-w-[320px] xl:max-w-[350px] mt-4 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {personalInfo.heroSupporting}
                </p>
              </EditableElement>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mt-6 flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-auto"
            >
              <EditableElement
                id="btn-view-work"
                section="hero"
                type="button"
                label="View Work CTA"
                propertyPath="personalInfo.viewWorkText"
                currentValue={personalInfo.viewWorkText || 'View My Work'}
              >
                <a
                  href={personalInfo.viewWorkLink || '#projects'}
                  className="pill-button-orange group text-xs sm:text-sm font-extrabold tracking-wider uppercase px-5 py-2.5 shadow-lg shadow-[#FF5A1F]/30 text-center justify-center shrink-0 transition-transform duration-200 active:scale-95 inline-flex items-center gap-2"
                  aria-label="View My Work Portfolio Projects"
                >
                  <span>{personalInfo.viewWorkText || 'View My Work'}</span>
                  <span className="pill-arrow-white scale-90">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </EditableElement>

              <EditableElement
                id="btn-lets-talk"
                section="hero"
                type="button"
                label="Let's Talk CTA"
                propertyPath="personalInfo.letsTalkText"
                currentValue={personalInfo.letsTalkText || "Let's Talk"}
              >
                <a
                  href={personalInfo.letsTalkLink || '#contact'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 hover:border-white/50 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md text-center shrink-0"
                  aria-label="Let's Talk Contact Abid Nalakath"
                >
                  <span>{personalInfo.letsTalkText || "Let's Talk"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                </a>
              </EditableElement>
            </motion.div>
          </motion.div>

          {/* ZONE 2: PROTECTED CENTER SILHOUETTE */}
          <div className="flex-1 min-w-[220px] pointer-events-none" aria-hidden="true" />

          {/* LAYER 4: RIGHT SIDE SAFE AREA */}
          <motion.div
            style={{
              x: isInteractive ? layer4ServicesX : 0,
              y: isInteractive ? layer4ServicesY : 0,
            }}
            className="w-auto max-w-[200px] xl:max-w-[230px] flex flex-col items-start text-left z-20 shrink-0 will-change-transform"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 mb-5 font-semibold"
            >
              Core Services
            </motion.p>

            <div className="grid grid-cols-1 gap-5 xl:gap-6 w-full">
              {heroServiceHighlights.map((highlight) => (
                <motion.a
                  key={highlight.number}
                  href={highlight.href}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group flex flex-col text-left transition-all duration-300 cursor-pointer"
                >
                  <span className="text-[11px] font-mono font-bold text-[#FF5A1F] tracking-widest group-hover:text-white transition-colors duration-200">
                    {highlight.number}
                  </span>
                  <span className="text-[14px] xl:text-[15px] font-extrabold text-white group-hover:text-[#FF5A1F] group-hover:translate-x-1.5 transition-all duration-300 tracking-tight flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    <span>{highlight.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#FF5A1F] transition-all duration-300 shrink-0" />
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM DESKTOP SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex absolute bottom-8 right-[4.5%] xl:right-[5.5%] 2xl:right-[6.5%] z-20 items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white/40 hover:text-[#FF5A1F] transition-colors cursor-pointer select-none"
          onClick={() => {
            const capSection = document.getElementById('capabilities');
            if (capSection) capSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#FF5A1F] animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};
