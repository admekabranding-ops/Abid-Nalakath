import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { capabilitiesList } from '../data/portfolioData';
import { Palette, Sparkles, Video, Globe, Layout } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
};

export const CapabilitiesSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setDeviceType('mobile');
      else if (w < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');

      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll tracking: scrubbed animation as section enters and reaches center
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Physics spring smoothing to absorb wheel notches and trackpad jitters
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.2,
    restDelta: 0.001,
  });

  // Stage 1 -> Stage 2 -> Stage 3 Transforms (reactive, GPU-accelerated, zero re-renders)
  // 1. Massive Scale-Up (2.8x desktop, 2.2x tablet, 1.8x mobile) zooming out to natural 1.0x
  const scale = useTransform(smoothProgress, (p) => {
    if (reducedMotion) return 1;
    const clamped = Math.max(0, Math.min(1, p));
    const maxScale = deviceType === 'mobile' ? 1.8 : deviceType === 'tablet' ? 2.2 : 2.8;
    return maxScale - (maxScale - 1) * clamped;
  });

  // 2. Rising from below viewport (32vh / 24vh / 16vh) upward to natural 0vh
  const y = useTransform(smoothProgress, (p) => {
    if (reducedMotion) return '0vh';
    const clamped = Math.max(0, Math.min(1, p));
    const startY = deviceType === 'mobile' ? 16 : deviceType === 'tablet' ? 24 : 32;
    return `${startY * (1 - clamped)}vh`;
  });

  // 3. Smooth opacity interpolation (0 -> 1 between scroll progress 0 and 0.35)
  const opacity = useTransform(smoothProgress, (p) => {
    if (reducedMotion) return 1;
    const clamped = Math.max(0, Math.min(1, p));
    if (clamped <= 0) return 0;
    if (clamped >= 0.35) return 1;
    return clamped / 0.35;
  });

  // 4. Subtle 3D perspective depth tilt (5° / 3.5° / 2° leveling off to 0°)
  const rotateX = useTransform(smoothProgress, (p) => {
    if (reducedMotion) return 0;
    const clamped = Math.max(0, Math.min(1, p));
    const maxRot = deviceType === 'mobile' ? 2 : deviceType === 'tablet' ? 3.5 : 5;
    return maxRot * (1 - clamped);
  });

  return (
    <section
      ref={containerRef}
      id="capabilities"
      style={{ perspective: 1400 }}
      className="relative z-20 w-full py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] overflow-hidden"
    >
      {/* Coordinated Composition Wrapper: Scales and zooms out as one unified 3D interface */}
      <motion.div
        style={{
          scale,
          y,
          opacity,
          rotateX,
          transformOrigin: 'center 35%',
        }}
        className="max-w-7xl mx-auto will-change-transform transform-gpu"
      >
        {/* Intro Label & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF5A1F] font-bold block">
              Creative Core
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1">
              Creative Thinking. Meaningful Results.
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/60 max-w-md">
            Specialized multi-disciplinary expertise engineered to deliver distinctive visual identity, motion narrative, and digital excellence.
          </p>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-white/10 mb-12" />

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilitiesList.map((item, index) => (
            <div
              key={item.name}
              className="group relative p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-8px_rgba(255,90,31,0.25)] flex flex-col justify-between min-h-[170px] h-full cursor-pointer"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FF5A1F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-[#FF5A1F] group-hover:border-[#FF5A1F]/30 transition-colors">
                  {iconMap[item.icon] || <Sparkles className="w-5 h-5" />}
                </div>
                <span className="text-xs font-mono text-white/40 group-hover:text-white/70 transition-colors">
                  0{index + 1}
                </span>
              </div>

              <div className="relative z-10 mt-6">
                <span className="text-[11px] uppercase tracking-wider text-[#FF5A1F]/90 font-semibold block mb-1">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Continuous Expertise Marquee */}
        <div className="mt-12 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center">
          <div className="flex shrink-0 items-center gap-8 animate-marquee whitespace-nowrap text-xs md:text-sm uppercase tracking-widest text-white/40 font-mono">
            <span>• Graphic Designing</span>
            <span>• Brand Architecture</span>
            <span>• AI Cinematic Direction</span>
            <span>• Full-Stack Web Development</span>
            <span>• Application UI/UX</span>
            <span>• Motion Storytelling</span>
            <span>• Graphic Designing</span>
            <span>• Brand Architecture</span>
            <span>• AI Cinematic Direction</span>
            <span>• Full-Stack Web Development</span>
            <span>• Application UI/UX</span>
            <span>• Motion Storytelling</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
