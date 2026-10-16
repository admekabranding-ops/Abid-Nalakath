import { ArrowUp } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#F4510B]/20 bg-[#0a0503] relative pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info (cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center p-2 text-white shadow-glow-orange">
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                  <path d="M12 10C21 15 21 33 12 38C26 38 26 10 12 10Z" fill="currentColor" />
                  <path d="M36 10C27 15 27 33 36 38C22 38 22 10 36 10Z" fill="currentColor" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-wide">
                ABID NALAKATH
              </span>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Creative Designer specializing in high-impact visual systems, distinctive branding, advertising key art, and modern digital experiences.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={personalInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#F4510B] transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#F4510B] transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={personalInfo.socials.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dribbble"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#F4510B] transition-all"
              >
                <DribbbleIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links (cols 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FF9D00]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              {['about', 'projects', 'services', 'contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo(item)}
                    className="capitalize hover:text-[#F4510B] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Work Inquiries (cols 9-12) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FF9D00]">
              Project Inquiries
            </h4>
            <p className="text-sm text-white font-medium">
              {personalInfo.email}
            </p>
            <p className="text-xs text-neutral-400">
              Open for selective brand identity collaborations, art direction, and digital creative commissions.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Taking Q1 / Q2 Projects</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} Abid Nalakath. All rights reserved. Built with precision.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-300 hover:text-[#FF9D00] transition-colors py-1 group"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#F4510B] group-hover:text-white transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
