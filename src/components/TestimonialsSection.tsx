import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import { testimonialsData } from '../data/portfolioData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4510B]/30 bg-[#F4510B]/10 text-[#FF9D00] text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client Trust &amp; Feedback</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Words from <span className="text-[#F4510B]">Collaborators</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          Direct feedback from marketing leaders, creative directors, and founders who trusted Abid with their visual brand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonialsData.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="bg-[#140a07] border border-white/10 hover:border-[#F4510B]/40 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative"
          >
            <div>
              <div className="flex items-center gap-1 text-[#FF9D00] mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-[#F4510B]/25 mb-4" />

              <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                “{t.quote}”
              </p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="font-bold text-sm text-white">{t.author}</h3>
              <p className="text-xs text-[#FF9D00] font-medium">{t.role}</p>
              <p className="text-[11px] text-neutral-400">{t.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
