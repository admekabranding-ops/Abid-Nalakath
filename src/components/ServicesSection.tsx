import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';
import { 
  ArrowUpRight, 
  Palette, 
  Sparkles, 
  Layers, 
  Target, 
  Compass, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenVideoModal?: (title: string, videoUrl?: string) => void;
  onSelectServiceForContact?: (serviceName: string) => void;
}

// 6 Central Words matching the 6 services exactly
const CENTRAL_WORDS = [
  { full: 'BRANDING', first: 'BRAND', second: 'ING', color: '#FF9D00', italicColor: '#F4510B' },
  { full: 'CREATIVITY', first: 'CREAT', second: 'IVITY', color: '#F4510B', italicColor: '#FF9D00' },
  { full: 'DESIGN', first: 'DES', second: 'IGN', color: '#FF9D00', italicColor: '#C63D08' },
  { full: 'VISUALS', first: 'VIS', second: 'UALS', color: '#C63D08', italicColor: '#FF9D00' },
  { full: 'IDENTITY', first: 'IDEN', second: 'TITY', color: '#FF9D00', italicColor: '#F4510B' },
  { full: 'IMPACT', first: 'IMP', second: 'ACT', color: '#F4510B', italicColor: '#FF9D00' },
];

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
};

// Unique interactive visual composition widget for each service
const ServiceVisualComposition: React.FC<{ serviceId: string; index: number }> = ({ serviceId }) => {
  switch (serviceId) {
    case 'brand-identity':
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#FF9D00]">Brand Design Specimen</span>
            <span>SYSTEM v2.6</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-12 rounded-lg bg-[#F4510B] flex flex-col justify-end p-1.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-white">#F4510B</span>
            </div>
            <div className="h-12 rounded-lg bg-[#FF9D00] flex flex-col justify-end p-1.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-black">#FF9D00</span>
            </div>
            <div className="h-12 rounded-lg bg-[#C63D08] flex flex-col justify-end p-1.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-white">#C63D08</span>
            </div>
            <div className="h-12 rounded-lg bg-[#0B0B0B] border border-white/20 flex flex-col justify-end p-1.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-white/70">#0B0B0B</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-white/70">
            <span className="font-serif italic text-[#FF9D00]">Editorial Serif / Bold Sans</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90">RATIO 1:1.618</span>
          </div>
        </div>
      );

    case 'graphic-design':
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#F4510B]">Poster Grid Architecture</span>
            <span>300 DPI · CMYK</span>
          </div>
          <div className="h-20 rounded-xl border border-dashed border-[#F4510B]/30 relative overflow-hidden flex items-center justify-center bg-white/[0.02]">
            <div className="absolute inset-x-0 h-px bg-[#F4510B]/20 top-1/2" />
            <div className="absolute inset-y-0 w-px bg-[#F4510B]/20 left-1/3" />
            <div className="absolute inset-y-0 w-px bg-[#F4510B]/20 right-1/3" />
            <div className="relative z-10 text-center">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white/90">
                ART DIRECTION
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#FF9D00]">
                Precision Alignment
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>BLEED 3MM</span>
            <span className="flex items-center gap-1 text-[#F4510B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4510B]" />
              PRESS READY
            </span>
          </div>
        </div>
      );

    case 'social-media-design':
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#FF9D00]">Multichannel Ratios</span>
            <span>VIRAL ENGAGEMENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 py-3 px-2 rounded-xl bg-white/5 border border-white/10 text-center hover:border-[#FF9D00]/50 transition-colors">
              <span className="block text-xs font-mono font-bold text-white">1:1</span>
              <span className="text-[10px] text-white/50">Feed Post</span>
            </div>
            <div className="flex-1 py-3 px-2 rounded-xl bg-[#F4510B]/15 border border-[#F4510B]/40 text-center">
              <span className="block text-xs font-mono font-bold text-[#FF9D00]">9:16</span>
              <span className="text-[10px] text-white/80">Reels / Story</span>
            </div>
            <div className="flex-1 py-3 px-2 rounded-xl bg-white/5 border border-white/10 text-center hover:border-[#FF9D00]/50 transition-colors">
              <span className="block text-xs font-mono font-bold text-white">4:5</span>
              <span className="text-[10px] text-white/50">Carousel</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
            <span>RETENTION BOOST</span>
            <span className="text-[#FF9D00] font-bold">+184% REACH</span>
          </div>
        </div>
      );

    case 'advertising-creatives':
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#F4510B]">Performance Billboard</span>
            <span>HIGH CTR SUITE</span>
          </div>
          <div className="h-16 rounded-xl bg-gradient-to-r from-[#651B0D] via-[#C63D08] to-[#F4510B] p-3 flex items-center justify-between relative overflow-hidden shadow-inner">
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/70 block">OOH & DIGITAL</span>
              <span className="text-sm font-black text-white uppercase tracking-tight">CAMPAIGN KEY VISUAL</span>
            </div>
            <span className="relative z-10 px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider shadow">
              CLICK +48%
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>HEATMAP OPTIMIZED</span>
            <span>A/B TESTED</span>
          </div>
        </div>
      );

    case 'logo-design':
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#FF9D00]">Golden Ratio Mark Matrix</span>
            <span>VECTOR MASTER</span>
          </div>
          <div className="h-20 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center bg-black/60">
            {/* Concentric blueprint circles */}
            <div className="absolute w-16 h-16 rounded-full border border-[#FF9D00]/30" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-[#F4510B]/25" />
            <div className="absolute w-32 h-32 rounded-full border border-white/5" />
            <div className="relative z-10 flex items-center gap-1.5 text-white">
              <span className="text-2xl font-black tracking-tighter">AN</span>
              <span className="text-xs font-mono text-[#FF9D00]">Φ 1.618</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>SVG · EPS · AI · PDF</span>
            <span className="text-[#FF9D00]">SCALABLE ∞</span>
          </div>
        </div>
      );

    case 'promotional-design':
    default:
      return (
        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#F4510B]">Event & Product Collateral</span>
            <span>EXCLUSIVE SUITE</span>
          </div>
          <div className="h-16 rounded-xl bg-gradient-to-r from-[#1A1A1A] to-[#252525] border border-white/10 p-3 flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4510B]/20 border border-[#F4510B]/40 flex items-center justify-center text-[#F4510B]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">VIP Launch Pass</span>
                <span className="text-[10px] text-white/50">Metallic Foil Finish</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4510B]/20 text-[#FF9D00] border border-[#F4510B]/30 font-bold">
              LIMITED
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>BOOTH BACKDROPS</span>
            <span>MERCHANDISE</span>
          </div>
        </div>
      );
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectServiceForContact 
}) => {
  const { content } = usePortfolioContent();
  const services = content.servicesData;
  const sectionRef = useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const manualOverrideRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Calculate active index from scroll progress on desktop
  useEffect(() => {
    if (!isDesktop) return;
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (manualOverrideRef.current) return;
      const idx = Math.min(5, Math.floor(latest * 6));
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [isDesktop, scrollYProgress]);

  // Orbit rotation based on scroll
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const counterOrbitRotation = useTransform(scrollYProgress, [0, 1], [0, -720]);

  // Direct manual jump to service
  const handleJumpToService = (idx: number) => {
    manualOverrideRef.current = true;
    setActiveIndex(idx);
    if (isDesktop && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const scrollHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const targetScroll = scrollTop + (idx / 5.5) * scrollHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
    setTimeout(() => {
      manualOverrideRef.current = false;
    }, 1000);
  };

  const activeService = services[activeIndex] || services[0];
  const activeWord = CENTRAL_WORDS[activeIndex] || CENTRAL_WORDS[0];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#0B0B0B] text-white selection:bg-[#F4510B] selection:text-white overflow-hidden lg:overflow-visible"
    >
      {/* Ambient background glow accents clipped to container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#F4510B]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF9D00]/10 blur-[120px]" />
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-[#651B0D]/20 blur-[100px]" />
      </div>

      {/* ========================================================= */}
      {/* DESKTOP EXPERIENCE: Multi-Screen Sticky Scroll Interaction */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative min-h-[420vh]">
        {/* Sticky Viewport Stage */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-8 xl:px-14 pt-24 pb-8 xl:pt-28 xl:pb-10">
          
          {/* Top Bar: Section Title & Fast Jump Navigation */}
          <header className="relative z-30 flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F4510B] font-bold flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                INTERACTIVE SERVICES SHOWCASE
              </span>
              <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                Creative Solutions. <span className="text-white/60 font-normal">Meaningful Impact.</span>
              </h2>
            </div>

            {/* Direct Service Selector Buttons */}
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 p-1.5 rounded-full backdrop-blur-md">
              {services.map((svc, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleJumpToService(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#F4510B] text-white shadow-lg shadow-[#F4510B]/30 scale-105'
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

          {/* Main Stage Grid: Left Orbit Typography + Right Floating Card */}
          <div className="flex-1 grid grid-cols-12 gap-8 xl:gap-12 items-center relative z-20 py-4">
            
            {/* LEFT 6 COLS: Rotating Circular Typography & Central Word */}
            <div className="col-span-6 flex flex-col items-center justify-center relative min-h-[460px]">
              
              {/* Outer Decorative Orbit Ring */}
              <motion.div 
                style={{ rotate: orbitRotation }}
                className="absolute w-[440px] h-[440px] xl:w-[500px] xl:h-[500px] rounded-full border border-dashed border-[#F4510B]/25 pointer-events-none"
              >
                {/* Orbiting Satellite Dots */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F4510B] shadow-[0_0_16px_rgba(244,81,11,0.9)]" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9D00] shadow-[0_0_12px_rgba(255,157,0,0.8)]" />
              </motion.div>

              {/* Middle Concentric Ring */}
              <div className="absolute w-[360px] h-[360px] xl:w-[410px] xl:h-[410px] rounded-full border border-white/10 pointer-events-none" />

              {/* Rotating Circular Typography SVG */}
              <motion.div 
                style={{ rotate: counterOrbitRotation }}
                className="absolute w-[360px] h-[360px] xl:w-[410px] xl:h-[410px] pointer-events-none flex items-center justify-center"
              >
                <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_24s_linear_infinite]">
                  <path
                    id="circleOrbitText"
                    d="M 200, 200 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
                    fill="none"
                  />
                  <text className="text-[11px] font-mono uppercase tracking-[0.28em] fill-white/40">
                    <textPath href="#circleOrbitText" startOffset="0%">
                      • CREATIVE SERVICES • ABID NALAKATH • SCROLL TO EXPLORE •
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Central Dynamic Typography with Morph Transition */}
              <div className="relative z-10 text-center max-w-md px-6">
                <span className="text-xs font-mono text-[#F4510B] font-bold tracking-widest uppercase block mb-2">
                  0{activeIndex + 1} / 06 · CORE SPECIALTY
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWord.full}
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 1.08 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="leading-none"
                  >
                    <span className="text-5xl xl:text-7xl font-black uppercase tracking-tight text-white block">
                      {activeWord.first}
                    </span>
                    <span 
                      style={{ color: activeWord.italicColor }}
                      className="text-5xl xl:text-7xl font-serif italic font-normal tracking-wide block mt-1"
                    >
                      {activeWord.second}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <p className="text-xs xl:text-sm text-white/50 mt-4 max-w-xs mx-auto leading-relaxed">
                  Scroll continuously to cycle through specialties or click any pill above to jump directly.
                </p>
              </div>

              {/* Bottom Progress Bar */}
              <div className="absolute bottom-2 flex items-center gap-2">
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#F4510B] to-[#FF9D00] transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / 6) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/40">
                  {Math.round(((activeIndex + 1) / 6) * 100)}%
                </span>
              </div>
            </div>

            {/* RIGHT 6 COLS: Premium Transforming Floating Service Card */}
            <div className="col-span-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-xl rounded-[28px] p-7 xl:p-9 bg-[#121212]/95 border border-white/15 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[#F4510B]/50 transition-colors"
                >
                  {/* Subtle top glow bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#F4510B] via-[#FF9D00] to-[#C63D08]" />

                  {/* Top: Service Category Badge & Outlined Number */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F4510B] shadow-inner">
                        {SERVICE_ICONS[activeService.iconName] || <Sparkles className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF9D00] font-bold block">
                          SERVICE NO. 0{activeIndex + 1}
                        </span>
                        <span className="text-xs text-white/50">
                          {activeService.category}
                        </span>
                      </div>
                    </div>

                    {/* Oversized Number Watermark */}
                    <span className="text-4xl xl:text-5xl font-black font-mono text-[#F4510B]/30 tracking-tight">
                      0{activeIndex + 1}
                    </span>
                  </div>

                  {/* Service Heading & Editable Title */}
                  <div className="mt-5">
                    <EditableElement
                      id={`svc-title-${activeService.id}`}
                      section="services"
                      type="text"
                      label={`Service Title: 0${activeIndex + 1}`}
                      propertyPath={`servicesData.${activeIndex}.title`}
                      currentValue={activeService.title}
                    >
                      <h3 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight">
                        {activeService.title}
                      </h3>
                    </EditableElement>

                    <EditableElement
                      id={`svc-desc-${activeService.id}`}
                      section="services"
                      type="text"
                      label={`Service Description: 0${activeIndex + 1}`}
                      propertyPath={`servicesData.${activeIndex}.description`}
                      currentValue={activeService.description}
                      options={{ multiline: true }}
                    >
                      <p className="text-sm xl:text-[15px] text-white/70 mt-2.5 leading-relaxed">
                        {activeService.description}
                      </p>
                    </EditableElement>
                  </div>

                  {/* Unique Interactive Composition Widget */}
                  <div className="my-5">
                    <ServiceVisualComposition serviceId={activeService.id} index={activeIndex} />
                  </div>

                  {/* Core Deliverables List */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold block mb-2.5">
                      KEY DELIVERABLES & EXPERTISE
                    </span>
                    <ul className="grid grid-cols-2 gap-2">
                      {activeService.deliverables.slice(0, 6).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-white/80 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F4510B] shrink-0 mt-0.5" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <a
                      href="#contact"
                      onClick={() => {
                        if (onSelectServiceForContact) {
                          onSelectServiceForContact(activeService.category);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F4510B] hover:bg-[#F4510B]/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#F4510B]/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Discuss Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href="#projects"
                      className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors group/link"
                    >
                      <span>View Projects</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9D00] transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <footer className="relative z-30 flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5 font-mono">
            <span>ABID NALAKATH CREATIVE STUDIO</span>
            <span className="flex items-center gap-1.5 text-[#FF9D00]">
              <span className="w-2 h-2 rounded-full bg-[#FF9D00] animate-pulse" />
              AVAILABLE FOR NEW COLLABORATIONS
            </span>
          </footer>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE & TABLET EXPERIENCE: Fluid Touch-Friendly Layout   */}
      {/* ========================================================= */}
      <div className="lg:hidden px-4 sm:px-6 py-16 sm:py-24 max-w-3xl mx-auto">
        
        {/* Mobile Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F4510B] inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            WHAT I DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Creative Solutions <br />
            <span className="text-[#FF9D00]">for Modern Brands</span>
          </h2>
          <p className="text-sm text-white/60 mt-3 max-w-md mx-auto">
            From brand identity systems to high-converting creative visuals designed to elevate business impact.
          </p>
        </div>

        {/* Compact Orbit Badge with Cycling Typography */}
        <div className="relative my-8 py-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center text-center overflow-hidden">
          {/* Subtle spinning circular border */}
          <div className="w-28 h-28 rounded-full border border-dashed border-[#F4510B]/30 flex items-center justify-center relative mb-3">
            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-[#FF9D00]">
                0{activeIndex + 1}/06
              </span>
            </div>
          </div>

          <div className="leading-tight">
            <span className="text-2xl sm:text-3xl font-black uppercase text-white block">
              {activeWord.first}
            </span>
            <span 
              style={{ color: activeWord.italicColor }}
              className="text-2xl sm:text-3xl font-serif italic block"
            >
              {activeWord.second}
            </span>
          </div>

          <span className="text-[11px] font-mono text-white/40 mt-2 uppercase tracking-wider">
            {activeService.title}
          </span>
        </div>

        {/* Mobile Service Selector Pills */}
        <div className="flex items-center justify-start gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar max-w-full">
          {services.map((svc, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#F4510B] text-white shadow-lg shadow-[#F4510B]/30 scale-105'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                0{idx + 1} · {svc.shortTitle || svc.title}
              </button>
            );
          })}
        </div>

        {/* Active Mobile Service Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#141414] border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#F4510B] to-[#FF9D00]" />

          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F4510B]">
                {SERVICE_ICONS[activeService.iconName] || <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9D00] font-bold block">
                  SERVICE NO. 0{activeIndex + 1}
                </span>
                <span className="text-xs text-white/60">
                  {activeService.category}
                </span>
              </div>
            </div>

            <span className="text-3xl font-black font-mono text-[#F4510B]/40">
              0{activeIndex + 1}
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {activeService.title}
            </h3>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              {activeService.description}
            </p>
          </div>

          {/* Visual Composition Widget */}
          <div className="my-5">
            <ServiceVisualComposition serviceId={activeService.id} index={activeIndex} />
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold block mb-1">
              CORE DELIVERABLES
            </span>
            {activeService.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F4510B] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              onClick={() => {
                if (onSelectServiceForContact) {
                  onSelectServiceForContact(activeService.category);
                }
              }}
              className="flex-1 py-3 px-5 rounded-full bg-[#F4510B] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg shadow-[#F4510B]/25"
            >
              <span>Discuss Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#projects"
              className="py-3 px-5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
            >
              <span>View Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF9D00]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
