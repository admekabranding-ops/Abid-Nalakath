import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { personalInfo, heroServiceHighlights } from '../data/portfolioData';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const { scrollY } = useScroll();

  // Subtle scroll parallax on desktop
  const portraitY = useTransform(scrollY, [0, 800], [0, 80]);
  const contentY = useTransform(scrollY, [0, 600], [0, 40]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (motionQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = (e.clientY / innerHeight - 0.5) * 6;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-[100svh] h-auto lg:h-[100svh] overflow-hidden flex flex-col justify-between select-none bg-[#0B0B0B]"
    >
      {/* =========================================================================
          FULL-SCREEN CINEMATIC PORTRAIT BACKGROUND
          - Desktop (lg+): Full 100vw x 100svh cover, Abid centered in central zone
          - Mobile (<lg): Preserves Abid in the upper viewport (h-[48vh] to h-[52vh])
            so text and UI elements NEVER touch his face, hair, neck, or body.
          ========================================================================= */}
      <motion.div
        style={{
          y: isReducedMotion ? 0 : portraitY,
        }}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: isReducedMotion
              ? 'none'
              : `translate3d(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px, 0)`,
          }}
        >
          {/* Authentic Portrait Image */}
          <picture className="w-full h-full block">
            <source srcSet="/images/abid-portrait.png" type="image/png" />
            <img
              src="/images/abid-portrait.png"
              alt="Abid Nalakath — Creative Designer"
              className="w-full h-[50vh] sm:h-[54vh] lg:h-full object-cover object-[53%_25%] sm:object-[53%_28%] lg:object-[53%_35%] xl:object-[53%_35%] filter brightness-[0.98] contrast-[1.04]"
              loading="eager"
              fetchPriority="high"
            />
          </picture>

          {/* Top Vignette strictly for Navigation Bar legibility */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0B]/80 via-[#0B0B0B]/15 to-transparent pointer-events-none" />

          {/* Desktop Bottom Fade transitioning into Section 02 */}
          <div className="hidden lg:block absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Top Spacer for Fixed Navigation Bar */}
      <div className="h-20 sm:h-24 lg:h-28 shrink-0 relative z-10" />

      {/* =========================================================================
          HERO COMPOSITION WITH STRICT PORTRAIT PROTECTION
          - Desktop (lg+): 
              Left Zone (<30vw): Typography & CTAs
              Center Zone (32vw - 74vw): Protected Portrait (ZERO text overlap)
              Right Zone (>76vw): Vertically Stacked Services
          - Mobile (<lg):
              Top Viewport: Protected Portrait (face, head, hair, body visible)
              Lower Viewport (pt-[46vh] sm:pt-[50vh]): Text & Services flow cleanly below
          ========================================================================= */}
      <motion.div
        style={{
          y: isReducedMotion ? 0 : contentY,
          opacity: contentOpacity,
        }}
        className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 lg:pl-[4.5%] lg:pr-[4.5%] xl:pl-[5.5%] xl:pr-[5.5%] 2xl:pl-[6.5%] 2xl:pr-[6.5%] flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0 my-auto pt-[48vh] sm:pt-[52vh] lg:pt-0 pb-12 lg:pb-0"
      >
        {/* =====================================================================
            ZONE 1: LEFT SIDE SAFE AREA (Strictly bounded to left <30% of viewport)
            Guarantees zero overlap with Abid's face, hair, neck, or body
            ===================================================================== */}
        <div className="w-full lg:w-[28%] lg:max-w-[340px] xl:max-w-[380px] 2xl:max-w-[420px] flex flex-col items-start text-left z-20 shrink-0">
          {/* Small Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-2 sm:mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] shadow-[0_0_10px_#FF5A1F] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F] drop-shadow-sm">
              {personalInfo.heroIntro}
            </span>
          </motion.div>

          {/* Main Heading: "Creative" and "Designer" on Separate Lines */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[3rem] xl:text-[3.6rem] 2xl:text-[4.2rem] font-black leading-[0.92] tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none"
          >
            Creative <br />
            <span className="text-white drop-shadow-md">Designer</span>
          </motion.h1>

          {/* Supporting Text strictly confined within left safe area */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm lg:text-[14px] xl:text-base text-white/90 font-medium max-w-[280px] sm:max-w-[320px] xl:max-w-[350px] mt-3 sm:mt-4 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {personalInfo.heroSupporting}
          </motion.p>

          {/* CTA Buttons: Left-Aligned within safe column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-3 w-full sm:w-auto"
          >
            {/* Primary CTA: VIEW MY WORK */}
            <a
              href="#projects"
              className="pill-button-orange group text-xs sm:text-sm font-extrabold tracking-wider uppercase px-5 py-2.5 shadow-lg shadow-[#FF5A1F]/30 text-center justify-center shrink-0"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 hover:border-white/50 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] shadow-md text-center shrink-0"
              aria-label="Let's Talk Contact Abid Nalakath"
            >
              <span>Let's Talk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            </a>
          </motion.div>
        </div>

        {/* =====================================================================
            ZONE 2: PROTECTED CENTER VIEWPORT (The Portrait Subject)
            On desktop, this space is 100% empty and transparent.
            No text, buttons, boxes, or overlays ever appear here.
            ===================================================================== */}
        <div className="hidden lg:block flex-1 min-w-[220px] pointer-events-none" aria-hidden="true" />

        {/* =====================================================================
            ZONE 3: RIGHT SIDE SAFE AREA (Vertical Service Highlights)
            Positioned strictly in the right ~20% of the screen away from the subject
            ===================================================================== */}
        <div className="w-full lg:w-auto lg:max-w-[200px] xl:max-w-[230px] flex flex-col items-start text-left z-20 shrink-0 mt-4 lg:mt-0 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0">
          {/* Subtle category label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 mb-3 lg:mb-5 font-semibold"
          >
            Core Services
          </motion.p>

          {/* Vertical Stack: #01, #02, #03, #04 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 sm:gap-6 lg:gap-5 xl:gap-6 w-full">
            {heroServiceHighlights.map((highlight, index) => (
              <motion.a
                key={highlight.number}
                href={highlight.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.28 + index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col text-left transition-all duration-300 cursor-pointer"
              >
                {/* Small Orange Service Number */}
                <span className="text-[11px] font-mono font-bold text-[#FF5A1F] tracking-widest group-hover:text-white transition-colors duration-200">
                  {highlight.number}
                </span>

                {/* White Service Name with restrained hover interaction */}
                <span className="text-xs sm:text-sm lg:text-[14px] xl:text-[15px] font-extrabold text-white/95 group-hover:text-[#FF5A1F] group-hover:translate-x-1.5 transition-all duration-300 tracking-tight flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <span>{highlight.title}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#FF5A1F] transition-all duration-300 shrink-0" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
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
          <ArrowDown className="w-3 h-3 text-[#FF5A1F] animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};
