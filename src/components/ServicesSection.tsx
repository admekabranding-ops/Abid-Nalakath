import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';
import { 
  Sparkles, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenVideoModal?: (title: string, videoUrl?: string) => void;
  onSelectServiceForContact?: (serviceName: string) => void;
}

// Background Media Layer Component with Video Autoplay / Pause
const BackgroundMediaLayer: React.FC<{
  service: ServiceItem;
  isActive: boolean;
}> = ({ service, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback (poster image will show)
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  const overlayOpacity = service.overlayOpacity ?? 0.72;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-out pointer-events-none ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      {/* Background Image or Video */}
      {service.bgVideo ? (
        <video
          ref={videoRef}
          src={service.bgVideo}
          poster={service.bgImage}
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isActive ? 'scale-100' : 'scale-105'
          }`}
        />
      ) : (
        <img
          src={service.bgImage || '/images/editorial-jacket.png'}
          alt={service.title}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isActive ? 'scale-100' : 'scale-105'
          }`}
          loading="lazy"
        />
      )}

      {/* Cinematic Dark & Vignette Overlays for Maximum Typography Legibility */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Radial Vignette (Darker at edges, subtle glow in center) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,11,11,0.65)_70%,#0B0B0B_100%)]" />

      {/* Top & Bottom Seamless Blends */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent" />
    </div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectServiceForContact 
}) => {
  const { content } = usePortfolioContent();
  const services = content.servicesData;
  const sectionRef = useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const manualOverrideRef = useRef(false);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Calculate active index from scroll progress (both touch scroll on mobile and wheel on desktop)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (manualOverrideRef.current) return;
      const idx = Math.min(5, Math.floor(latest * 6));
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Orbit rotation based on scroll
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const counterOrbitRotation = useTransform(scrollYProgress, [0, 1], [0, -720]);

  // Direct manual jump to service (works smoothly on both mobile touch and desktop click)
  const handleJumpToService = (idx: number) => {
    manualOverrideRef.current = true;
    setActiveIndex(idx);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const scrollHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const targetScroll = scrollTop + (idx / 5.5) * scrollHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    setTimeout(() => {
      manualOverrideRef.current = false;
    }, 1200);
  };

  const activeService = services[activeIndex] || services[0];
  const totalServices = services.length || 6;
  const progressPercent = Math.round(((activeIndex + 1) / totalServices) * 100);

  // Dynamic Word Split: First word in Bold Sans, Second in Editorial Italic Serif
  const getWordSplit = (svc: ServiceItem) => {
    if (svc.centralWord) {
      return svc.centralWord;
    }
    const words = svc.title.trim().split(' ');
    if (words.length === 1) {
      return { first: words[0].toUpperCase(), second: '', full: words[0].toUpperCase() };
    }
    const first = words[0].toUpperCase();
    const second = words.slice(1).join(' ').toUpperCase();
    return { first, second, full: `${first} ${second}` };
  };

  const wordSplit = getWordSplit(activeService);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#0B0B0B] text-white selection:bg-[#F4510B] selection:text-white overflow-visible touch-pan-y scroll-mt-20 sm:scroll-mt-24"
    >
      {/* ========================================================= */}
      {/* 1. FULLSCREEN IMMERSIVE BACKGROUND MEDIA STACK            */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {services.map((svc, idx) => (
          <BackgroundMediaLayer
            key={svc.id}
            service={svc}
            isActive={activeIndex === idx}
          />
        ))}

        {/* Ambient Brand Color Glow Accents */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#F4510B]/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#FF9D00]/10 blur-[140px]" />
      </div>

      {/* ========================================================= */}
      {/* 2. SHARED TOUCH & SCROLL STAGE (Mobile & Desktop)         */}
      {/* Natural finger scroll scrubbing on mobile, wheel on PC    */}
      {/* ========================================================= */}
      <div className="relative min-h-[380vh] sm:min-h-[420vh] lg:min-h-[460vh]">
        {/* Sticky Viewport Stage: Pinned perfectly in the viewport */}
        <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-14 pt-20 sm:pt-22 lg:pt-24 pb-4 sm:pb-6 lg:pb-8 xl:pt-26 xl:pb-10 relative z-20 touch-pan-y">
          
          {/* Top Bar: Section Title & Fast Jump Navigation */}
          {/* A. Desktop Header (>= 1024px) */}
          <header className="hidden lg:flex relative z-30 items-center justify-between border-b border-white/10 pb-5 max-w-7xl mx-auto w-full">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F4510B] font-bold flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                IMMERSIVE CREATIVE SERVICES
              </span>
              <h2 className="text-xl xl:text-2xl font-extrabold text-white tracking-tight">
                Designing Ideas. <span className="text-white/60 font-normal">Creating Impact.</span>
              </h2>
            </div>

            {/* Direct Service Selector Buttons */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 p-1.5 rounded-full backdrop-blur-md shadow-2xl">
              {services.map((svc, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleJumpToService(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#F4510B] text-white shadow-lg shadow-[#F4510B]/40 scale-105'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="hidden xl:inline text-[11px] font-sans font-semibold">
                      {svc.shortTitle || svc.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* B. Mobile & Tablet Header (< 1024px) */}
          <header className="flex lg:hidden relative z-30 flex-col gap-2 w-full max-w-lg mx-auto">
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
              <span className="text-[11px] uppercase tracking-wider text-[#F4510B] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                IMMERSIVE SERVICES
              </span>
              <span className="text-[10px] font-mono font-bold text-[#FF9D00] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                0{activeIndex + 1} / 0{totalServices}
              </span>
            </div>

            {/* Mobile Horizontal Fast Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
              {services.map((svc, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleJumpToService(idx)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#F4510B] text-white shadow-md shadow-[#F4510B]/40 scale-105'
                        : 'bg-black/50 border border-white/10 text-white/60 active:bg-white/10'
                    }`}
                  >
                    0{idx + 1} · {svc.shortTitle || svc.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </header>

          {/* Main Stage: MASSIVE CENTERED CIRCULAR ANIMATION */}
          {/* A. Desktop Circular Stage (>= 1024px) */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative z-20 my-auto">
            
            {/* The Perfect Center Circle: 65-75% viewport width, up to 850px max, bounded by viewport height */}
            <div className="relative w-[min(72vw,68vh)] h-[min(72vw,68vh)] max-w-[800px] max-h-[800px] min-w-[440px] min-h-[440px] rounded-full flex items-center justify-center aspect-square">
              
              {/* Outer Dashed Orbit Ring with Glow */}
              <motion.div 
                style={{ rotate: orbitRotation }}
                className="absolute inset-0 rounded-full border border-dashed border-[#F4510B]/35 pointer-events-none"
              >
                {/* Orbiting Satellite Dot (Top) */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F4510B] shadow-[0_0_18px_rgba(244,81,11,1)]" />
                {/* Orbiting Satellite Dot (Bottom) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FF9D00] shadow-[0_0_14px_rgba(255,157,0,0.9)]" />
                {/* Orbiting Satellite Dot (Right) */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#C63D08] shadow-[0_0_12px_rgba(198,61,8,0.9)]" />
              </motion.div>

              {/* Middle Concentric Ring */}
              <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />

              {/* Rotating Circular Typography SVG */}
              <motion.div 
                style={{ rotate: counterOrbitRotation }}
                className="absolute inset-6 pointer-events-none flex items-center justify-center"
              >
                <svg viewBox="0 0 600 600" className="w-full h-full animate-[spin_32s_linear_infinite]">
                  <path
                    id="centerCircleOrbitText"
                    d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                    fill="none"
                  />
                  <text className="text-[12px] font-mono uppercase tracking-[0.32em] fill-white/45">
                    <textPath href="#centerCircleOrbitText" startOffset="0%">
                      ✦ CREATIVE SERVICES ✦ ABID NALAKATH ✦ IMMERSIVE STUDIO EXPERIENCE ✦
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Inner Glowing Backdrop Disc */}
              <div className="absolute inset-14 rounded-full bg-[#0B0B0B]/75 border border-white/15 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.85)] pointer-events-none" />

              {/* Central Dynamic Typography & Service Narrative */}
              <div className="relative z-10 text-center max-w-lg px-6 flex flex-col items-center justify-center">
                
                {/* Active Service Counter Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#F4510B] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#FF9D00] uppercase">
                    0{activeIndex + 1} / 0{totalServices} · {activeService.category}
                  </span>
                </div>

                {/* Central Massive Word Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 1.05 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="leading-none text-center"
                  >
                    <EditableElement
                      id={`svc-title-${activeService.id}`}
                      section="services"
                      type="text"
                      label={`Service Title 0${activeIndex + 1}`}
                      propertyPath={`servicesData.${activeIndex}.title`}
                      currentValue={activeService.title}
                    >
                      <h3 className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                        <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white block drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                          {wordSplit.first}
                        </span>
                        {wordSplit.second && (
                          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif italic font-normal tracking-wide text-[#FF9D00] block drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                            {wordSplit.second}
                          </span>
                        )}
                      </h3>
                    </EditableElement>

                    {/* Minimalist Service Description Overlay */}
                    <EditableElement
                      id={`svc-desc-${activeService.id}`}
                      section="services"
                      type="text"
                      label={`Service Description 0${activeIndex + 1}`}
                      propertyPath={`servicesData.${activeIndex}.description`}
                      currentValue={activeService.description}
                      options={{ multiline: true }}
                    >
                      <p className="text-xs sm:text-sm text-white/80 mt-3 max-w-md mx-auto leading-relaxed drop-shadow">
                        {activeService.description}
                      </p>
                    </EditableElement>
                  </motion.div>
                </AnimatePresence>

                {/* Interactive CTA Button */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <a
                    href="#contact"
                    onClick={() => {
                      if (onSelectServiceForContact) {
                        onSelectServiceForContact(activeService.category);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4510B] hover:bg-[#F4510B]/90 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#F4510B]/35 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Discuss Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="#projects"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 backdrop-blur-md transition-all"
                  >
                    <span>View Projects</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9D00]" />
                  </a>
                </div>

                {/* Progress Indicator at Circle Bottom */}
                <div className="mt-4 flex items-center justify-center gap-2.5">
                  <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F4510B] to-[#FF9D00] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white/60">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* B. Mobile & Tablet Circular Stage (< 1024px) */}
          <div className="flex lg:hidden flex-1 items-center justify-center relative z-20 my-auto w-full">
            {/* Perfectly Scaled Circle for Mobile: 70dvw to 50vh, bounded within 380px */}
            <div className="relative w-[min(88vw,70dvw,48vh)] h-[min(88vw,70dvw,48vh)] max-w-[380px] max-h-[380px] min-w-[280px] min-h-[280px] rounded-full flex items-center justify-center aspect-square my-auto">
              
              {/* Outer Dashed Orbit Ring with Rotating Satellite Dots */}
              <motion.div 
                style={{ rotate: orbitRotation }}
                className="absolute inset-0 rounded-full border border-dashed border-[#F4510B]/40 pointer-events-none"
              >
                {/* Orbiting Satellite Dot (Top) */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#F4510B] shadow-[0_0_14px_rgba(244,81,11,1)]" />
                {/* Orbiting Satellite Dot (Bottom) */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9D00] shadow-[0_0_12px_rgba(255,157,0,0.9)]" />
                {/* Orbiting Satellite Dot (Right) */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C63D08] shadow-[0_0_10px_rgba(198,61,8,0.9)]" />
              </motion.div>

              {/* Middle Concentric Ring */}
              <div className="absolute inset-3 sm:inset-4 rounded-full border border-white/10 pointer-events-none" />

              {/* Rotating Circular Typography SVG */}
              <motion.div 
                style={{ rotate: counterOrbitRotation }}
                className="absolute inset-3 sm:inset-4 pointer-events-none flex items-center justify-center"
              >
                <svg viewBox="0 0 600 600" className="w-full h-full animate-[spin_32s_linear_infinite]">
                  <path
                    id="centerCircleOrbitTextMobile"
                    d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                    fill="none"
                  />
                  <text className="text-[13px] font-mono uppercase tracking-[0.32em] fill-white/45">
                    <textPath href="#centerCircleOrbitTextMobile" startOffset="0%">
                      ✦ CREATIVE SERVICES ✦ ABID NALAKATH ✦ IMMERSIVE STUDIO EXPERIENCE ✦
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Inner Glowing Disc */}
              <div className="absolute inset-7 sm:inset-8 rounded-full bg-[#0B0B0B]/85 border border-white/15 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.85)] pointer-events-none" />

              {/* Mobile Service Narrative & Dynamic Typography */}
              <div className="relative z-10 text-center max-w-[270px] sm:max-w-xs px-3 sm:px-4 flex flex-col items-center justify-center">
                {/* Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4510B] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#FF9D00] uppercase">
                    0{activeIndex + 1} / 0{totalServices} · {activeService.category}
                  </span>
                </div>

                {/* Dynamic Service Title */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 1.04 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="leading-tight text-center"
                  >
                    <h3 className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white block drop-shadow-md">
                        {wordSplit.first}
                      </span>
                      {wordSplit.second && (
                        <span className="text-2xl sm:text-3xl font-serif italic font-normal tracking-wide text-[#FF9D00] block drop-shadow-md">
                          {wordSplit.second}
                        </span>
                      )}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-white/75 mt-1.5 line-clamp-2 max-w-[220px] sm:max-w-[250px] leading-relaxed mx-auto">
                      {activeService.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* CTAs */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <a
                    href="#contact"
                    onClick={() => {
                      if (onSelectServiceForContact) {
                        onSelectServiceForContact(activeService.category);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#F4510B] text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-[#F4510B]/30 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <span>Discuss</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>

                  <a
                    href="#projects"
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold border border-white/10 active:scale-95 transition-all"
                  >
                    <span>Work ↗</span>
                  </a>
                </div>

                {/* Progress Bar inside circle */}
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F4510B] to-[#FF9D00] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/60 font-bold">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          {/* A. Desktop Footer (>= 1024px) */}
          <footer className="hidden lg:flex relative z-30 items-center justify-between text-xs text-white/40 pt-2 border-t border-white/10 font-mono max-w-7xl mx-auto w-full">
            <span>ABID NALAKATH CREATIVE STUDIO</span>
            <span className="flex items-center gap-1.5 text-[#FF9D00]">
              <span className="w-2 h-2 rounded-full bg-[#FF9D00] animate-pulse" />
              SCROLL TO EXPLORE ALL 6 SERVICES
            </span>
          </footer>

          {/* B. Mobile Footer (< 1024px) */}
          <footer className="flex lg:hidden relative z-30 items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10 font-mono w-full max-w-lg mx-auto">
            <span>ABID NALAKATH</span>
            <span className="flex items-center gap-1.5 text-[#FF9D00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D00] animate-pulse" />
              SWIPE TO EXPLORE · 0{activeIndex + 1}/0{totalServices}
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
};
