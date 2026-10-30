import React from 'react';
import { motion } from 'framer-motion';
import { servicesData } from '../data/portfolioData';
import { 
  ArrowUpRight, 
  Palette, 
  Sparkles, 
  Video, 
  Layers, 
  Globe, 
  CheckCircle2, 
  Play
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenVideoModal?: (title: string, videoUrl?: string) => void;
  onSelectServiceForContact?: (serviceName: string) => void;
}

const serviceIcons: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onOpenVideoModal,
  onSelectServiceForContact 
}) => {
  return (
    <section id="services" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                WHAT I DO
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Creative Solutions <br className="hidden sm:inline" />
              <span className="text-white/80">for Modern Brands</span>
            </h2>
          </div>

          <p className="text-sm md:text-base text-white/65 max-w-md">
            From high-concept visual identity systems and generative AI cinema to full-stack digital web and application experiences.
          </p>
        </div>

        {/* 5 Distinct Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {servicesData.map((service, index) => {
            const isWide = index === 0 || index === 2; // Varied editorial grid composition
            const colSpan = isWide ? 'lg:col-span-7' : 'lg:col-span-5';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${colSpan} group relative rounded-3xl p-6 sm:p-8 md:p-10 bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/50 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(255,90,31,0.25)]`}
              >
                {/* Background ambient glow on hover */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF5A1F]/15 via-[#F52E36]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Card Top: Number, Icon & Category */}
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300">
                        {serviceIcons[service.iconName]}
                      </div>
                      <span className="text-xs font-mono tracking-widest text-[#FF5A1F] font-bold">
                        {service.number}
                      </span>
                    </div>

                    <a
                      href="#contact"
                      onClick={() => onSelectServiceForContact && onSelectServiceForContact(service.category)}
                      className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45"
                      aria-label={`Inquire about ${service.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Card Title & Description */}
                  <div className="mt-6">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#FF5A1F] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 mt-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Deliverables / Showcase list */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3">
                      Core Offerings & Deliverables
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-white/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interactive Visual Direction / Media Card at bottom */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  {service.id === 'ai-video-creation' ? (
                    <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-4 flex items-center justify-between group/video">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onOpenVideoModal && onOpenVideoModal(service.title, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                          className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#FF5A1F]/30"
                          aria-label="Play AI Video Demo Reel"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white">Watch AI Motion Reel</p>
                          <p className="text-[11px] text-white/50">4K Generative Cinema Showcase (0:45)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-white/10 text-white/80">
                        AI Film
                      </span>
                    </div>
                  ) : service.id === 'application-development' ? (
                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        </div>
                        <span className="text-[10px] font-mono text-white/40">app.analytics.preview</span>
                      </div>
                      <div className="h-10 bg-white/5 rounded-lg flex items-center px-3 justify-between">
                        <div className="w-1/3 h-2 bg-white/20 rounded" />
                        <div className="flex gap-1.5">
                          <div className="w-4 h-4 rounded bg-[#FF5A1F]/60" />
                          <div className="w-4 h-4 rounded bg-white/20" />
                        </div>
                      </div>
                    </div>
                  ) : service.id === 'website-development' ? (
                    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FF6A00]">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Responsive Web Architectures</p>
                          <p className="text-[11px] text-white/50">Vite, React, Next.js & Modern CSS</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold">
                        60 FPS
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="italic">{service.visualDirection}</span>
                      <a
                        href="#projects"
                        className="text-[#FF5A1F] hover:text-white font-semibold flex items-center gap-1 shrink-0 ml-2"
                      >
                        View Projects <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
