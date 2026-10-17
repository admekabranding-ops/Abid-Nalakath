import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Award, Users } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface ExperienceStatsProps {
  statsContent?: any[];
}

export const ExperienceStats: React.FC<ExperienceStatsProps> = ({ statsContent }) => {
  const displayStats = statsContent && statsContent.length > 0 ? statsContent : personalInfo.stats;
  const statIcons = [
    <TrendingUp className="w-5 h-5 text-[#FF9D00]" />,
    <Clock className="w-5 h-5 text-[#FF9D00]" />,
    <Award className="w-5 h-5 text-[#FF9D00]" />,
    <Users className="w-5 h-5 text-[#FF9D00]" />,
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#200d07] via-[#33140b] to-[#200d07] border border-[#F4510B]/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-[#F4510B]/10 blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {displayStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-6 sm:pt-0 sm:pl-8' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-[#F4510B]/20 flex items-center justify-center mb-3">
                {statIcons[idx]}
              </div>
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-[#FF9D00] uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-neutral-400">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
