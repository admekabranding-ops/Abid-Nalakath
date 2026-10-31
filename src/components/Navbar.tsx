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
      setIsScrolled(window.scrollY > 40);

      // Scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            ? 'sticky top-0 z-20 w-full py-3.5 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10 transition-colors'
            : `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                isScrolled
                  ? 'py-3 bg-[#0B0B0B]/85 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/40'
                  : 'py-6 bg-transparent'
              }`
        }
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <a
            href="#home"
            className="group flex items-center gap-2 text-white font-extrabold text-lg md:text-xl tracking-tight transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Abid Nalakath Portfolio Home"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] group-hover:scale-125 transition-transform duration-300" />
            <span className="tracking-wider uppercase font-black">{currentPersonalInfo.name}</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`${
          isEditor ? 'absolute' : 'fixed'
        } inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden transition-all duration-300 flex flex-col justify-between p-8 pt-24 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-5">
          <p className="text-xs uppercase tracking-widest text-[#FF5A1F] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Navigation
          </p>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-[#FF5A1F] transition-colors py-1 flex items-center justify-between border-b border-white/5"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-5 h-5 text-white/40" />
            </a>
          ))}
        </div>

        <div className="space-y-4 pt-6">
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full pill-button justify-center py-3.5 text-base"
          >
            <span>Get in touch</span>
            <span className="pill-arrow-orange">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>

          <div className="text-center">
            <p className="text-xs text-white/50">{currentPersonalInfo.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};
