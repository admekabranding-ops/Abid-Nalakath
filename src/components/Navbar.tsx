import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface NavbarProps {
  onNavigate?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Active section spy
      const sections = ['about', 'projects', 'services', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#0e0705]/85 backdrop-blur-md border-b border-[#F4510B]/20 shadow-lg'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center p-2 shadow-glow-orange group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full text-white">
                  <path d="M12 10C21 15 21 33 12 38C26 38 26 10 12 10Z" fill="currentColor" />
                  <path d="M36 10C27 15 27 33 36 38C22 38 22 10 36 10Z" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-base tracking-wide leading-none group-hover:text-[#FF9D00] transition-colors">
                  ABID NALAKATH
                </span>
                <span className="text-[10px] tracking-widest text-[#FF9D00] font-medium uppercase mt-0.5">
                  Creative Designer
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
              {['about', 'projects', 'services', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`capitalize text-sm font-medium transition-colors hover:text-[#F4510B] ${
                    activeSection === item ? 'text-[#FF9D00] font-semibold' : 'text-white/80'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Right Action */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-2 bg-[#F4510B] hover:bg-[#FF9D00] text-white text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-full shadow-glow-orange transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden flex flex-col pt-24 px-6 pb-8 transition-all animate-fadeIn">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 px-2 pb-4 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-white/70 font-medium">Available for Projects</span>
            </div>

            {['about', 'projects', 'services', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="text-left text-2xl font-display font-semibold capitalize text-white hover:text-[#F4510B] transition-colors py-2 flex items-center justify-between border-b border-white/5"
              >
                <span>{item}</span>
                <ArrowUpRight className="w-5 h-5 text-[#F4510B]" />
              </button>
            ))}

            <div className="mt-8 pt-4 flex flex-col gap-4">
              <button
                onClick={() => scrollTo('contact')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-center shadow-glow-orange flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start a Project</span>
              </button>

              <div className="text-center text-xs text-white/50 pt-4">
                {personalInfo.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
