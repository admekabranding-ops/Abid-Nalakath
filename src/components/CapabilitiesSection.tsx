import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMedia = () => {
      setIsMobile(window.innerWidth < 768);
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    checkMedia();
    window.addEventListener('resize', checkMedia);
    return () => window.removeEventListener('resize', checkMedia);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Intro Label & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4">
          <div>
            {/* 1. The orange "CREATIVE CORE" label falls from above */}
            <motion.span
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : (isMobile ? -25 : -40) }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-widest text-[#FF5A1F] font-bold block"
            >
              Creative Core
            </motion.span>

            {/* 2. The "Creative Thinking. Meaningful Results." heading drops down smoothly */}
            <motion.h2
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : (isMobile ? -35 : -55) }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1"
            >
              Creative Thinking. Meaningful Results.
            </motion.h2>
          </div>

          {/* 3. The description on the right falls into position */}
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : (isMobile ? -25 : -40) }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm md:text-base text-white/60 max-w-md"
          >
            Specialized multi-disciplinary expertise engineered to deliver distinctive visual identity, motion narrative, and digital excellence.
          </motion.p>
        </div>

        {/* 4. The horizontal divider appears with a smooth reveal */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px bg-white/10 mb-12 origin-left"
        />

        {/* 5 Service Cards — Sequential Falling Animation with Physics Bounce */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilitiesList.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : (isMobile ? -75 : -145),
                rotate: prefersReducedMotion ? 0 : (index % 2 === 0 ? -4 : 3.5),
                scale: prefersReducedMotion ? 1 : 0.96,
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                    }
                  : {}
              }
              transition={{
                type: prefersReducedMotion ? 'tween' : 'spring',
                stiffness: 105,
                damping: 14,
                mass: 0.85,
                delay: prefersReducedMotion ? 0 : (0.36 + index * 0.10),
                duration: prefersReducedMotion ? 0.3 : undefined,
              }}
              className="will-change-transform"
            >
              <div className="group relative p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-8px_rgba(255,90,31,0.25)] flex flex-col justify-between min-h-[170px] h-full cursor-pointer">
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
            </motion.div>
          ))}
        </div>

        {/* Bottom Marquee Animation — Reveals after cards settle */}
        <motion.div
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : -30,
            scale: prefersReducedMotion ? 1 : 0.98,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: prefersReducedMotion ? 0 : 0.95,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-12 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center will-change-transform"
        >
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
        </motion.div>
      </div>
    </section>
  );
};
