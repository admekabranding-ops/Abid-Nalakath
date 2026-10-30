import React from 'react';
import { motion } from 'framer-motion';
import { processSteps } from '../data/portfolioData';
import { Compass, Lightbulb, Layers, CheckCircle2, Sparkles } from 'lucide-react';

const processIcons: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6" />,
};

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                HOW I WORK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
              From Idea to Impact
            </h2>
          </div>

          <p className="text-sm md:text-base text-white/65 max-w-md">
            A structured, collaborative creative methodology engineered to turn abstract ambitions into measurable, high-craft digital realities.
          </p>
        </div>

        {/* Timeline Desktop & Mobile */}
        <div className="relative">
          {/* Subtle glowing horizontal connector line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5A1F]/30 to-transparent -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 relative z-10">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-3xl p-6 sm:p-8 bg-[#141414] border border-white/10 hover:border-[#FF5A1F]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header with Step Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A1F] group-hover:scale-110 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300">
                      {processIcons[step.icon] || <Sparkles className="w-6 h-6" />}
                    </div>

                    <span className="text-2xl font-black font-mono text-white/20 group-hover:text-[#FF5A1F] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A1F] block mb-1">
                      {step.tagline}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables list */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2">
                    Key Outcomes
                  </p>
                  <ul className="space-y-1.5">
                    {step.deliverables.map((item, i) => (
                      <li key={i} className="text-xs text-white/75 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
