import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ScrollVideoHeroCanvas } from './ScrollVideoHeroCanvas';
import { AnimatedTypographyMarquee } from './AnimatedTypographyMarquee';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';

export const HeroSection: React.FC = () => {
  const { content, editorViewport } = usePortfolioContent();
  const personalInfo = content.personalInfo;
  const heroServiceHighlights = content.heroServiceHighlights;
  const isMobileEditor = editorViewport === 'mobile' || editorViewport === 'tablet';

  const heroRef = useRef<HTMLElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  // Normalized cursor coordinates (-1 to +1) for desktop parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics-based spring configuration for organic interpolation without re-renders
  const springConfig = { damping: 28, stiffness: 130, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Dedicated motion value for hero scroll progress (0 to 1)
  // Decoupled from buggy Chromium ViewTimeline WAAPI to ensure flawless cross-browser execution
  const heroScrollProgress = useMotionValue(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!heroRef.current) return;
      const totalHeight = heroRef.current.offsetHeight;
      const maxScroll = totalHeight - window.innerHeight;
      if (maxScroll <= 0) {
        heroScrollProgress.set(0);
        return;
      }
      const currentScroll = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
      heroScrollProgress.set(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [heroScrollProgress]);

  // 1. Hero UI elements smoothly fade and elevate as video frame scrubbing initiates
  // 0% - 18%: fully visible
  // 18% - 38%: smoothly fades out and translates up
  // > 38%: completely hidden
  const heroUiOpacity = useTransform(heroScrollProgress, [0, 0.18, 0.38], [1, 1, 0]);
  const heroUiY = useTransform(heroScrollProgress, [0, 0.18, 0.38], [0, 0, -36]);
  const heroPointerEvents = useTransform(heroScrollProgress, (v) => (v > 0.25 ? 'none' : 'auto'));

  // 2. Rising Animated Typography Marquee (Synchronized Transition Timeline)
  // 0% - 20%: Below viewport (y: '100%'), invisible (opacity: 0)
  // 20% - 45%: Starts rising into view from bottom, typography gradually visible
  // 45% - 75%: Moves further upward, overlapping lower hero / chest, fully prominent
  // 75% - 100%: Anchored in its main prominent position while head is held at Frame 65
  const marqueeY = useTransform(
    heroScrollProgress,
    [0, 0.20, 0.45, 0.75, 1.0],
    ['100%', '100%', '35%', '0%', '0%']
  );
  const marqueeOpacity = useTransform(
    heroScrollProgress,
    [0, 0.20, 0.35, 0.65, 1.0],
    [0, 0, 0.85, 1.0, 1.0]
  );
  const marqueePointerEvents = useTransform(heroScrollProgress, (v) => (v >= 0.30 ? 'auto' : 'none'));

  // 3. Continuation cue emerges during 75% - 100% to guide user into Services section
  const transitionCueOpacity = useTransform(heroScrollProgress, [0.72, 0.86, 1.0], [0, 1.0, 1.0]);

  // Subject-Only Scroll Zoom & depth transforms (Desktop)
  const subjectScrollScale = useTransform(heroScrollProgress, [0, 0.75], [1.0, 1.08], { clamp: true });
  const scrollPortraitY = useTransform(heroScrollProgress, [0, 0.75], [0, 25]);

  // Depth displacement transforms (Desktop)
  const layer1BgX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const layer1BgY = useTransform(smoothY, [-1, 1], [-6, 6]);

  const layer2PortraitX = useTransform(smoothX, [-1, 1], [8, -8]);
  const layer2MouseY = useTransform(smoothY, [-1, 1], [6, -6]);
  const combinedPortraitY = useTransform(
    [scrollPortraitY, layer2MouseY],
    ([sVal, mVal]) => (isInteractive ? Number(sVal) + Number(mVal) : Number(sVal))
  );

  const layer2RotateX = useTransform(smoothY, [-1, 1], [0.6, -0.6]);
  const layer2RotateY = useTransform(smoothX, [-1, 1], [-0.9, 0.9]);

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
      className="relative w-full bg-[#0B0B0B] text-white selection:bg-[#FF5A1F] selection:text-white overflow-visible touch-pan-y"
      style={{ minHeight: '240vh' }}
    >
      {/* Pinned Sticky Viewport: remains locked at top while scrubbing through the 240vh scroll track */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden relative z-10 touch-pan-y">
        
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
        {/* 1. SCROLL-DRIVEN CINEMATIC VIDEO BACKGROUND LAYER              */}
        {/* ============================================================== */}
        {/* A. Mobile & Tablet Frame Canvas (< 1024px) */}
        <div className={`${isMobileEditor ? 'block' : 'lg:hidden'} absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0`}>
          <div className="relative w-full h-full">
            <ScrollVideoHeroCanvas scrollYProgress={heroScrollProgress} isMobileEditor={true} />

            {/* Seamless Atmospheric Gradient Overlays for Pure Readability & Face Glow */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_46%_28%,transparent_0%,rgba(11,11,11,0.15)_52%,rgba(11,11,11,0.85)_100%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent pointer-events-none" />
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] bg-gradient-radial from-[#FF5A1F]/20 via-[#F52E36]/10 to-transparent rounded-full blur-[90px] pointer-events-none" />
          </div>
        </div>

        {/* B. Desktop Frame Canvas (>= 1024px) */}
        <div className={`${isMobileEditor ? 'hidden' : 'hidden lg:block'} absolute inset-0 w-full h-full pointer-events-none z-0`}>
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
            <ScrollVideoHeroCanvas scrollYProgress={heroScrollProgress} isMobileEditor={false} />

            {/* Top Vignette strictly for Navigation Bar legibility */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/15 to-transparent pointer-events-none" />
            {/* Desktop Bottom Fade transitioning into Section 02 */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent pointer-events-none" />
            {/* Subtle tactile noise texture */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* 2. MOBILE & TABLET HERO COMPOSITION (< 1024px)                 */}
        {/* Balanced hierarchy with zero face overlap, smooth scroll fade  */}
        {/* ============================================================== */}
        <motion.div
          style={{
            opacity: heroUiOpacity,
            y: heroUiY,
            pointerEvents: heroPointerEvents as any,
          }}
          className={`${isMobileEditor ? 'flex' : 'lg:hidden flex'} absolute inset-0 z-10 w-full px-4 sm:px-6 pt-20 sm:pt-24 pb-8 flex-col justify-between items-center text-center max-w-lg sm:max-w-xl mx-auto h-full pointer-events-auto`}
        >
          {/* Top Group: Intro Badge & Main Headline (Above hairline) */}
          <div className="w-full flex flex-col items-center">
            {/* 1. Intro Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-2"
            >
              <EditableElement
                id="hero-intro"
                section="hero"
                type="text"
                label="Intro Badge"
                propertyPath="personalInfo.heroIntro"
                currentValue={personalInfo.heroIntro}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_8px_#FF5A1F] animate-pulse indicator-dot" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F]">
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] select-none whitespace-pre-line">
                  {personalInfo.heroHeading}
                </h1>
              </EditableElement>
            </motion.div>
          </div>

          {/* Dedicated Clear Center Focal Area: Face completely unobstructed */}
          <div 
            className="w-full h-44 sm:h-56 my-auto pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Bottom Group: Supporting Intro, CTA Buttons, and Core Services (Below chin / chest) */}
          <div className="w-full flex flex-col items-center max-w-sm">
            {/* 3. Supporting Introduction Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
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
                <p className="text-xs text-white/90 font-medium max-w-xs mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {personalInfo.heroSupporting}
                </p>
              </EditableElement>
            </motion.div>

            {/* 4. Mobile CTA Buttons: Clean stacked pills with full text visibility */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: 'easeOut' }}
              className="mt-3 flex flex-col items-center justify-center gap-2 w-full max-w-[280px]"
            >
              <EditableElement
                id="btn-view-work"
                section="hero"
                type="button"
                label="View Work CTA"
                propertyPath="personalInfo.viewWorkText"
                currentValue={personalInfo.viewWorkText || 'View My Work'}
                className="w-full"
              >
                <a
                  href={personalInfo.viewWorkLink || '#projects'}
                  className="w-full pill-button-orange group text-xs font-extrabold tracking-wider uppercase px-5 py-2.5 shadow-lg shadow-[#FF5A1F]/30 text-center justify-center shrink-0 active:scale-95 inline-flex items-center gap-2"
                  aria-label="View My Work Portfolio Projects"
                >
                  <span>{personalInfo.viewWorkText || 'View My Work'}</span>
                  <span className="pill-arrow-white scale-80">
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
                className="w-full"
              >
                <a
                  href={personalInfo.letsTalkLink || '#contact'}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/40 text-white text-xs font-extrabold tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md text-center shrink-0"
                  aria-label="Let's Talk Contact Abid Nalakath"
                >
                  <span>{personalInfo.letsTalkText || "Let's Talk"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                </a>
              </EditableElement>
            </motion.div>

            {/* 5. Core Services Highlight Chips on Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full mt-4 pt-3.5 border-t border-white/10"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mb-2 font-semibold text-center">
                Core Services
              </p>
              <div className="grid grid-cols-2 gap-2 w-full">
                {heroServiceHighlights.map((highlight) => (
                  <a
                    key={highlight.number}
                    href={highlight.href}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10 hover:border-[#FF5A1F]/40 active:scale-[0.98] transition-all group backdrop-blur-md shadow-sm"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-mono font-bold text-[#FF5A1F]">
                        {highlight.number}
                      </span>
                      <span className="text-[11px] font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors tracking-tight">
                        {highlight.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-[#FF5A1F] transition-colors shrink-0 ml-1" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. DESKTOP HERO COMPOSITION (>= 1024px)                        */}
        {/* Exact 3-column desktop composition with parallax preserved    */}
        {/* ============================================================== */}
        <motion.div
          style={{
            opacity: heroUiOpacity,
            y: heroUiY,
            pointerEvents: heroPointerEvents as any,
          }}
          className={`${isMobileEditor ? 'hidden' : 'hidden lg:flex'} absolute inset-0 z-10 flex-col justify-between h-full w-full pointer-events-auto`}
        >
          {/* Top Spacer for Fixed Navigation Bar */}
          <div className="h-28 shrink-0 relative z-10" />

          {/* Desktop 3-Column Layout */}
          <div className="relative z-10 w-full max-w-[1920px] mx-auto lg:pl-[4.5%] lg:pr-[4.5%] xl:pl-[5.5%] xl:pr-[5.5%] 2xl:pl-[6.5%] 2xl:pr-[6.5%] flex items-center justify-between my-auto">
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
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_8px_#FF5A1F] shrink-0 indicator-dot" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-white select-none">
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
          </div>

          {/* BOTTOM DESKTOP SCROLL INDICATOR */}
          <div className="flex justify-between items-center px-[4.5%] xl:px-[5.5%] 2xl:px-[6.5%] pb-6 relative z-20 text-[11px] font-mono text-white/40 tracking-wider">
            <span>ABID NALAKATH PORTFOLIO</span>
            <div
              className="flex items-center gap-2 hover:text-[#FF5A1F] transition-colors cursor-pointer select-none"
              onClick={() => {
                const nextSection = document.getElementById('marquee') || document.getElementById('services');
                if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>SCROLL TO LOWER HEAD</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#FF5A1F] animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* 4. RISING ANIMATED TYPOGRAPHY MARQUEE (SYNCHRONIZED TRANSITION) */}
        {/* Progressively enters viewport from bottom as head lowers        */}
        {/* ============================================================== */}
        <motion.div
          style={{
            y: marqueeY,
            opacity: marqueeOpacity,
            pointerEvents: marqueePointerEvents as any,
          }}
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end w-full will-change-transform"
        >
          {/* Seamless Dark Gradient Vignette for smooth contrast over hero */}
          <div className="absolute inset-x-0 -top-28 h-28 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent pointer-events-none" />

          {/* Marquee Content Wrapper */}
          <div className="relative w-full bg-[#0B0B0B]/85 backdrop-blur-md pt-2 pb-5 sm:pb-7 border-t border-white/[0.08] shadow-[0_-25px_60px_rgba(0,0,0,0.85)]">
            <AnimatedTypographyMarquee transparentBg={true} />

            {/* Subtle continue to services cue during 75%-100% */}
            <motion.div
              style={{ opacity: transitionCueOpacity }}
              className="w-full flex items-center justify-center pt-2 sm:pt-3 pb-1 text-center pointer-events-auto"
            >
              <div
                onClick={() => {
                  const services = document.getElementById('services');
                  if (services) services.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#FF5A1F]/30 backdrop-blur-md transition-all cursor-pointer select-none group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white/70 group-hover:text-white uppercase transition-colors">
                  EXPLORE SERVICES
                </span>
                <ArrowDown className="w-3 h-3 text-[#FF5A1F] group-hover:translate-y-0.5 transition-transform" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
