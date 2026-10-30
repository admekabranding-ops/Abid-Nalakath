import React from 'react';
import { personalInfo, socialLinks } from '../data/portfolioData';
import { ArrowUp, Mail, MessageCircle } from 'lucide-react';
import { InstagramIcon, LinkedInIcon, GitHubIcon, BehanceIcon } from './BrandIcons';

const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail className="w-4 h-4" />,
  Instagram: <InstagramIcon className="w-4 h-4" />,
  Behance: <BehanceIcon className="w-4 h-4" />,
  LinkedIn: <LinkedInIcon className="w-4 h-4" />,
  GitHub: <GitHubIcon className="w-4 h-4" />,
  MessageCircle: <MessageCircle className="w-4 h-4" />,
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="w-full bg-[#070707] border-t border-white/10 text-white pt-16 pb-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10 items-start">
          
          {/* Left Brand Col */}
          <div className="md:col-span-4">
            <a
              href="#home"
              className="group flex items-center gap-2 text-white font-extrabold text-xl tracking-tight"
            >
              <span className="w-3 h-3 rounded-full bg-[#FF5A1F]" />
              <span className="tracking-wider uppercase font-black">{personalInfo.name}</span>
            </a>
            <p className="text-sm text-white/50 mt-1 font-mono">
              {personalInfo.title}
            </p>
            <p className="text-xs text-white/60 mt-4 max-w-xs leading-relaxed">
              Crafting meaningful visual identities, AI-powered cinema, and fluid digital software experiences.
            </p>
          </div>

          {/* Middle Navigation Links */}
          <div className="md:col-span-4 flex flex-col sm:items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#FF5A1F] mb-4 font-bold">
                Navigation
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Socials & Back to Top */}
          <div className="md:col-span-4 flex flex-col sm:items-end justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4 font-bold sm:text-right">
                Connect
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#FF5A1F] hover:text-white border border-white/10 flex items-center justify-center text-white/70 transition-all duration-300"
                    aria-label={s.name}
                  >
                    {iconMap[s.name] || <span>{s.name[0]}</span>}
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors group cursor-pointer"
            >
              <span>Back to Top</span>
              <span className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#FF5A1F] text-white flex items-center justify-center transition-colors">
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>
            Designed with creativity by{' '}
            <span className="text-white/80 font-semibold">{personalInfo.name}</span>.
          </p>
          <p className="font-mono">
            © {currentYear} {personalInfo.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
