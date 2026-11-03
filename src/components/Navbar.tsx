import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/portfolioData';
import { useSafePortfolioContent } from '../context/ContentContext';
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  isEditor?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, isEditor = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const contentContext = useSafePortfolioContent();
  const currentPersonalInfo = contentContext?.content.personalInfo || personalInfo;

  useEffect(() => {
    const handleScroll = () => {
      // Toggle sticky appearance
      setIsScrolled(window.scrollY > 30);

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Scroll Progress Bar at very top (hidden inside Visual Editor) */}
      {!isEditor && (
        <div 
          className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#FF5A1F] via-[#FF6A00] to-[#F52E36] z-50 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}

      <header
        className={
          isEditor
            ? 'sticky top-0 z-20 w-full py-3 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10 transition-colors'
            : `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                isScrolled
                  ? 'py-2.5 sm:py-3 bg-[#0B0B0B]/85 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/40'
                  : 'py-3.5 sm:py-5 lg:py-6 bg-transparent'
              }`
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <a
            href="#home"
            className="group flex items-center gap-2 text-white font-extrabold text-base sm:text-lg md:text-xl tracking-tight transition-transform duration-300 hover:scale-[1.02] shrink-0"
            aria-label="Abid Nalakath Portfolio Home"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] group-hover:scale-125 transition-transform duration-300 shrink-0" />
            <span className="tracking-wider uppercase font-black truncate max-w-[190px] sm:max-w-none">
              {currentPersonalInfo.name}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-white bg-white/15 shadow-sm'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF5A1F]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Pill Button (matches reference "Get in touch ->") */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="pill-button group focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]"
              aria-label="Get in touch with Abid"
            >
              <span>Get in touch</span>
              <span className="pill-arrow-orange">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button with 44px min tap target */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Enhanced dedicated full-screen drawer with close button) */}
      <div
        className={`${
          isEditor ? 'absolute' : 'fixed'
        } inset-0 z-50 bg-[#0B0B0B]/98 backdrop-blur-2xl md:hidden transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        {/* Mobile Drawer Top Bar: Brand Logo + Explicit Close Button */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
          <a
            href="#home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F]" />
            <span className="tracking-wider uppercase font-black">{currentPersonalInfo.name}</span>
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:text-[#FF5A1F] hover:bg-white/20 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links with large touch targets (min 48px) */}
        <div className="flex flex-col gap-2 py-6 my-auto">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#FF5A1F] font-bold flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Navigation
          </p>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl sm:text-3xl font-bold text-white hover:text-[#FF5A1F] transition-colors py-3 flex items-center justify-between border-b border-white/5 active:scale-[0.98]"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-5 h-5 text-white/40" />
            </a>
          ))}
        </div>

        {/* Drawer Footer CTA */}
        <div className="space-y-4 pt-4 border-t border-white/10 shrink-0">
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full pill-button-orange justify-center py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A1F]/25 flex items-center gap-2 text-center"
          >
            <span>Get in touch</span>
            <span className="pill-arrow-white">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>

          <div className="text-center">
            <p className="text-xs text-white/50 font-mono">{currentPersonalInfo.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};
