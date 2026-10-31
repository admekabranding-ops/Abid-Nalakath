import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioContent } from '../context/ContentContext';
import { EditableElement } from '../admin/EditableElement';
import { 
  ArrowUpRight, 
  Palette, 
  Sparkles, 
  Video, 
  Layers, 
  Globe, 
  TrendingUp,
  Compass,
  Lightbulb,
  Target,
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
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onOpenVideoModal,
  onSelectServiceForContact 
}) => {
  const { content } = usePortfolioContent();
  const servicesData = content.servicesData;

  return (
    <section id="services" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <EditableElement
              id="services-tag"
              section="services"
              type="text"
              label="Services Tag"
              propertyPath="personalInfo.servicesTag"
              currentValue="WHAT I DO"
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  WHAT I DO
                </span>
              </div>
            </EditableElement>

            <EditableElement
              id="services-heading"
              section="services"
              type="text"
              label="Services Heading"
              propertyPath="personalInfo.servicesHeading"
              currentValue="Creative Solutions for Modern Brands"
              options={{ multiline: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
                Creative Solutions <br className="hidden sm:inline" />
                <span className="text-white/80">for Modern Brands</span>
              </h2>
            </EditableElement>
          </div>

          <EditableElement
            id="services-desc"
            section="services"
            type="text"
            label="Services Description"
            propertyPath="personalInfo.servicesDesc"
            currentValue="From high-concept visual identity systems and generative AI cinema to full-stack digital web, application architectures, and data-driven marketing."
            options={{ multiline: true }}
          >
            <p className="text-sm md:text-base text-white/65 max-w-md">
              From high-concept visual identity systems and generative AI cinema to full-stack digital web, application architectures, and data-driven marketing.
            </p>
          </EditableElement>
        </div>

        {/* Equal-Sized Poster Cards in a 2-Column Desktop Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
          style={{ perspective: 1200 }}
        >
          {servicesData.map((service, index) => {
            return (
              <motion.div
                key={service.id}
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  scale: 0.86, 
                  rotateX: 5,
                  rotateY: index % 2 === 0 ? -2.5 : 2.5 
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1, 
                  rotateX: 0,
                  rotateY: 0 
                }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.12, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                className="group relative rounded-[28px] p-6 sm:p-8 md:p-9 bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/50 transition-colors duration-500 flex flex-col h-full overflow-hidden shadow-xl hover:shadow-[0_24px_48px_-15px_rgba(255,90,31,0.22)]"
              >
                {/* Background ambient glow on hover */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF5A1F]/15 via-[#F52E36]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* 1. Card Top: Number, Icon & Contact Action */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 shadow-sm">
                      {serviceIcons[service.iconName] || <TrendingUp className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-mono tracking-widest text-[#FF5A1F] font-bold">
                      {service.number}
                    </span>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => {
                      if (onSelectServiceForContact) {
                        onSelectServiceForContact(service.category);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45 group-hover:scale-105 shadow-sm"
                    aria-label={`Inquire about ${service.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* 2 & 3 & 4. Card Title & Short Description */}
                <div className="mt-6 relative z-10">
                  <EditableElement
                    id={`svc-title-${service.id}`}
                    section="services"
                    type="text"
                    label={`Service Title: ${service.number}`}
                    propertyPath={`servicesData.${index}.title`}
                    currentValue={service.title}
                  >
                    <h3 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight group-hover:text-[#FF5A1F] transition-colors leading-tight">
                      {service.title}
                    </h3>
                  </EditableElement>

                  <EditableElement
                    id={`svc-desc-${service.id}`}
                    section="services"
                    type="text"
                    label={`Service Description: ${service.number}`}
                    propertyPath={`servicesData.${index}.description`}
                    currentValue={service.description}
                    options={{ multiline: true }}
                  >
                    <p className="text-sm text-white/70 mt-2.5 leading-relaxed min-h-[64px] sm:min-h-[70px]">
                      {service.description}
                    </p>
                  </EditableElement>
                </div>

                {/* 5. Divider */}
                <div className="h-px bg-white/10 my-6 relative z-10" />

                {/* 6 & 7. Category Label & Deliverables List */}
                <div className="relative z-10">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-3 font-semibold">
                    Core Offerings & Deliverables
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-white/80 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 8. Bottom Divider with mt-auto for equal alignment */}
                <div className="h-px bg-white/10 my-6 mt-auto relative z-10" />

                {/* 9. Card Footer */}
                <div className="flex items-center justify-between text-xs text-white/50 pt-1 relative z-10">
                  <span className="italic truncate max-w-[55%] sm:max-w-[62%]">
                    {service.visualDirection}
                  </span>
                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {service.id === 'ai-video-creation' && onOpenVideoModal && (
                      <button
                        type="button"
                        onClick={() => onOpenVideoModal(service.title, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF5A1F]/15 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white text-[11px] font-semibold transition-all duration-200"
                        aria-label="Play AI Video Demo Reel"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Reel</span>
                      </button>
                    )}
                    <a
                      href="#projects"
                      className="text-[#FF5A1F] hover:text-white font-semibold flex items-center gap-1 transition-colors group/link"
                    >
                      <span>View Projects</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
