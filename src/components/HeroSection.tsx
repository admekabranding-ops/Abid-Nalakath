import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { personalInfo, heroServiceHighlights } from '../data/portfolioData';
import { AnimatedHeroPortrait } from './AnimatedHeroPortrait';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  // Normalized cursor coordinates (-1 to +1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics-based spring configuration for organic interpolation without re-renders
  const springConfig = { damping: 28, stiffness: 130, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scroll parallax & Subject-Only Scroll Zoom
  const { scrollY } = useScroll();
  const scrollPortraitY = useTransform(scrollY, [0, 800], [0, 80]);
  const contentY = useTransform(scrollY, [0, 600], [0, 40]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  // Subject-Only Scroll Zoom: smoothly zooms the portrait subject (1.0 -> 1.22x) focused on face
  const subjectScrollScale = useTransform(scrollY, [0, 500], [1.0, 1.22], { clamp: true });

  // =========================================================================
  // MULTI-LAYER 3D DEPTH DISPLACEMENT CALCULATIONS
  // Layer 1: Background Gradient (4–8px)
  // Layer 2: Portrait Photography (6–12px with subtle perspective tilt)
  // Layer 3: Left Main Heading (2–4px foreground response)
  // Layer 4: Right Service List (3–6px distinct parallax rate)
  // =========================================================================
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

  const layer4ServicesX = useTransform(smoothX, [-1, 1], [4.5, -4.5]);
  const layer4ServicesY = useTransform(smoothY, [-1, 1], [4.5, -4.5]);

  useEffect(() => {
    // Only enable mouse parallax on devices with fine pointer (mouse/trackpad) and no reduced motion
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsInteractive(pointerFine && !prefersReducedMotion);
  }, []);

  // Track cursor relative to hero container bounds
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isInteractive || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100svh] h-auto lg:h-[100svh] overflow-hidden flex flex-col justify-between select-none bg-[#0B0B0B]"
    >
      {/* =========================================================================
          LAYER 1 & 2: FULL-SCREEN CINEMATIC PORTRAIT & 3D DEPTH BACKGROUND
          - Layer 1: Background Atmospheric Lighting mesh moves at (4–8px)
          - Layer 2: Portrait moves at (6–12px) with subtle 3D perspective rotation
          - Protected central silhouette keeps Abid completely clear of text
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 [perspective:1200px]">
        {/* Layer 1: Atmospheric Background Glow (subtle depth response) */}
        <motion.div
          style={{
            x: isInteractive ? layer1BgX : 0,
            y: isInteractive ? layer1BgY : 0,
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
            style={{
              background: `
                radial-gradient(circle at 65% 32%, rgba(255, 90, 31, 0.65) 0%, rgba(245, 46, 54, 0.4) 32%, rgba(180, 25, 12, 0.15) 60%, transparent 80%),
                radial-gradient(circle at 25% 20%, rgba(255, 106, 0, 0.2) 0%, transparent 50%)
              `,
            }}
          />
        </motion.div>

        {/* Layer 2: Authentic Portrait with Continuous Wind-Blown Hair & Subject-Only Scroll Zoom */}
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
          <AnimatedHeroPortrait
            src="/images/abid-portrait.png"
            alt="Abid Nalakath — Creative Designer"
            className="w-full h-[50vh] sm:h-[54vh] lg:h-full object-cover object-[53%_25%] sm:object-[53%_28%] lg:object-[53%_35%] xl:object-[53%_35%] filter brightness-[0.98] contrast-[1.04]"
          />

          {/* Top Vignette strictly for Navigation Bar legibility */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/15 to-transparent pointer-events-none" />

          {/* Desktop Bottom Fade transitioning into Section 02 */}
          <div className="hidden lg:block absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent pointer-events-none" />

          {/* Subtle tactile noise texture */}
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        </motion.div>
      </div>

      {/* Top Spacer for Fixed Navigation Bar */}
      <div className="h-20 sm:h-24 lg:h-28 shrink-0 relative z-10" />

      {/* =========================================================================
          HERO COMPOSITION WITH STRICT PORTRAIT PROTECTION
          - Layer 3 (LEFT SAFE ZONE): Main Text & CTAs (depth: 2–4px)
          - Center Zone: 100% Protected Portrait Silhouette (ZERO text overlap)
          - Layer 4 (RIGHT SAFE ZONE): Vertical Service Highlights (depth: 3–6px)
          ========================================================================= */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:pl-[4.5%] lg:pr-[4.5%] xl:pl-[5.5%] xl:pr-[5.5%] 2xl:pl-[6.5%] 2xl:pr-[6.5%] flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0 my-auto pt-[48vh] sm:pt-[52vh] lg:pt-0 pb-12 lg:pb-0"
      >
        {/* =====================================================================
            LAYER 3: LEFT SIDE SAFE AREA (Interactive Depth: 2–4px)
            Strictly bounded to left <30vw, ensuring zero overlap with the subject
            ===================================================================== */}
        <motion.div
          style={{
            x: isInteractive ? layer3TextX : 0,
            y: isInteractive ? layer3TextY : 0,
          }}
          className="w-full lg:w-[28%] lg:max-w-[340px] xl:max-w-[380px] 2xl:max-w-[420px] flex flex-col items-start text-left z-20 shrink-0 will-change-transform"
        >
          {/* Small Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-2 sm:mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_10px_#FF5A1F] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F] drop-shadow-sm">
              {personalInfo.heroIntro}
            </span>
          </motion.div>

          {/* Main Heading: "Creative" and "Designer" on Separate Lines */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[3rem] xl:text-[3.6rem] 2xl:text-[4.2rem] font-black leading-[0.92] tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none"
          >
            Creative <br />
            <span className="text-white drop-shadow-md">Designer</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-xs sm:text-sm lg:text-[14px] xl:text-base text-white/90 font-medium max-w-[280px] sm:max-w-[320px] xl:max-w-[350px] mt-3 sm:mt-4 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {personalInfo.heroSupporting}
          </motion.p>

          {/* Layer 5: Interactive CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-6 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-3 w-full sm:w-auto"
          >
            {/* Primary CTA: VIEW MY WORK */}
            <a
              href="#projects"
              className="pill-button-orange group text-xs sm:text-sm font-extrabold tracking-wider uppercase px-5 py-2.5 shadow-lg shadow-[#FF5A1F]/30 text-center justify-center shrink-0 transition-transform duration-200 active:scale-95"
              aria-label="View My Work Portfolio Projects"
            >
              <span>View My Work</span>
              <span className="pill-arrow-white scale-90">
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            {/* Secondary CTA: LET'S TALK */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 hover:border-white/50 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md text-center shrink-0"
              aria-label="Let's Talk Contact Abid Nalakath"
            >
              <span>Let's Talk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            </a>
          </motion.div>
        </motion.div>

        {/* =====================================================================
            ZONE 2: PROTECTED CENTER VIEWPORT (The Portrait Subject)
            On desktop, this space is 100% empty and transparent.
            No text, buttons, boxes, or overlays ever appear here.
            ===================================================================== */}
        <div className="hidden lg:block flex-1 min-w-[220px] pointer-events-none" aria-hidden="true" />

        {/* =====================================================================
            LAYER 4: RIGHT SIDE SAFE AREA (Vertical Service Highlights)
            Interactive Depth: 3–6px rate, distinct from portrait and left text
            ===================================================================== */}
        <motion.div
          style={{
            x: isInteractive ? layer4ServicesX : 0,
            y: isInteractive ? layer4ServicesY : 0,
          }}
          className="w-full lg:w-auto lg:max-w-[200px] xl:max-w-[230px] flex flex-col items-start text-left z-20 shrink-0 mt-4 lg:mt-0 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0 will-change-transform"
        >
          {/* Subtle category label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 mb-3 lg:mb-5 font-semibold"
          >
            Core Services
          </motion.p>

          {/* Vertical Stack: #01, #02, #03, #04 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 sm:gap-6 lg:gap-5 xl:gap-6 w-full">
            {heroServiceHighlights.map((highlight) => (
              <motion.a
                key={highlight.number}
                href={highlight.href}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group flex flex-col text-left transition-all duration-300 cursor-pointer"
              >
                {/* Small Orange Service Number */}
                <span className="text-[11px] font-mono font-bold text-[#FF5A1F] tracking-widest group-hover:text-white transition-colors duration-200">
                  {highlight.number}
                </span>

                {/* White Service Name with restrained hover interaction */}
                <span className="text-xs sm:text-sm lg:text-[14px] xl:text-[15px] font-extrabold text-white group-hover:text-[#FF5A1F] group-hover:translate-x-1.5 transition-all duration-300 tracking-tight flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  <span>{highlight.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#FF5A1F] transition-all duration-300 shrink-0" />
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* =========================================================================
          BOTTOM: Repositioned Subtle Scroll Cue Indicator
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 w-full px-6 sm:px-10 lg:px-[5.5%] pb-4 pt-2 flex items-center justify-center lg:justify-end"
      >
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
          aria-label="Scroll to explore next section"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#FF5A1F] animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};
