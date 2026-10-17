import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Share2, Megaphone, TrendingUp, Layout, Check, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { servicesData } from '../data/portfolioData';
import type { Service } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  services?: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, services }) => {
  const displayServices = services && services.length > 0 ? services : servicesData;
  const getIcon = (name: string) => {
    switch (name) {
      case 'Palette':
        return <Palette className="w-6 h-6 text-[#FF9D00]" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-[#FF9D00]" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-[#FF9D00]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#FF9D00]" />;
      case 'Layout':
      default:
        return <Layout className="w-6 h-6 text-[#FF9D00]" />;
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative ambient light */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#C63D08]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4510B]/30 bg-[#F4510B]/10 text-[#FF9D00] text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services &amp; Specializations</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Bespoke <span className="text-[#F4510B]">Creative Solutions</span>
        </h2>
        <p className="text-base text-neutral-300 leading-relaxed">
          Comprehensive visual design capabilities tailored for modern ventures seeking bold, unmistakable distinction across digital and physical touchpoints.
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`bg-[#140a07] border border-white/10 hover:border-[#F4510B]/50 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group ${
              idx === 0 ? 'lg:col-span-2' : ''
            }`}
          >
            <div>
              {/* Header: Icon + Timeline */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F4510B]/15 border border-[#F4510B]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(service.iconName)}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300">
                  <Clock className="w-3 h-3 text-[#FF9D00]" />
                  <span>{service.timeline}</span>
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-[#FF9D00] transition-colors">
                {service.title}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {service.shortDesc}
              </p>

              {/* Deliverables List */}
              <div className="space-y-2 mb-8">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#FF9D00] mb-2">
                  What You Receive
                </div>
                {service.deliverables.map((item: string, dIdx: number) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-[#F4510B] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 border-t border-white/5">
              <button
                onClick={() => onSelectService(service.title)}
                className="w-full py-3 px-5 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-[#F4510B] hover:to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 group-hover:shadow-glow-orange transition-all duration-300"
              >
                <span>Request This Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
