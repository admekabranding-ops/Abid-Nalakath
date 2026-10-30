import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Intro Label & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF5A1F] font-bold">
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

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilitiesList.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,90,31,0.2)] flex flex-col justify-between min-h-[170px]"
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
            </motion.div>
          ))}
        </div>

        {/* Dynamic Continuous Ticker Marquee */}
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
      </div>
    </section>
  );
};
