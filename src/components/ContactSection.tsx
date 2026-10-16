import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Clock, Check, Copy, Sparkles } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from './SocialIcons';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Brand Identity',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({
        ...prev,
        projectType: preselectedService,
        message: `Hi Abid, I am interested in collaborating on a ${preselectedService} project.`,
      }));
    }
  }, [preselectedService]);

  const projectTypes = [
    'Brand Identity',
    'Social Media Design',
    'Advertising Posters',
    'Marketing Campaign',
    'Digital Art & 3D',
    'Other Creative',
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide details about your project (at least 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Simulate API processing
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F4510B', '#FF9D00', '#FFFFFF', '#C63D08'],
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#F4510B]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4510B]/30 bg-[#F4510B]/10 text-[#FF9D00] text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Initiate Collaboration</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Let’s Create Something <span className="text-[#F4510B]">Extraordinary</span>
        </h2>
        <p className="text-base text-neutral-300 leading-relaxed">
          Have an upcoming brand launch, campaign, or creative project? Send a message and let’s discuss how to bring your visual presence to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Contact Cards & Info (cols 1-5) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Quick Email Card with Copy Action */}
            <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#F4510B]/20 flex items-center justify-center text-[#FF9D00] mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">
                Direct Inquiries
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mb-4">
                {personalInfo.email}
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-200 border border-white/10 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Turnaround & Location Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#140a07] border border-white/10 rounded-2xl p-5 shadow-lg">
                <Clock className="w-5 h-5 text-[#FF9D00] mb-2" />
                <div className="text-xs text-neutral-400 font-semibold uppercase">Response Time</div>
                <div className="text-sm font-bold text-white mt-1">Within 24 Hours</div>
              </div>

              <div className="bg-[#140a07] border border-white/10 rounded-2xl p-5 shadow-lg">
                <MapPin className="w-5 h-5 text-[#FF9D00] mb-2" />
                <div className="text-xs text-neutral-400 font-semibold uppercase">Availability</div>
                <div className="text-sm font-bold text-white mt-1">Worldwide Remote</div>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-[#140a07] border border-white/10 rounded-2xl p-6">
            <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-4">
              Find Me On Socials
            </div>
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F4510B]/30 hover:border-[#F4510B] transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F4510B]/30 hover:border-[#F4510B] transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F4510B]/30 hover:border-[#F4510B] transition-all"
                aria-label="Dribbble"
              >
                <DribbbleIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Contact Form (cols 6-12) */}
        <div className="lg:col-span-7 bg-[#140a07] border border-[#F4510B]/25 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                Thank you for reaching out, <span className="text-white font-semibold">{formData.name}</span>. Abid will review your project details and get back to you within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', projectType: 'Brand Identity', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Your Name <span className="text-[#F4510B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B] transition-all placeholder:text-neutral-500 ${
                      errors.name ? 'border-red-500/80' : 'border-white/10'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Email Address <span className="text-[#F4510B]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="alex@company.com"
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B] transition-all placeholder:text-neutral-500 ${
                      errors.email ? 'border-red-500/80' : 'border-white/10'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Project Type Pills */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
                  Project Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({ ...formData, projectType: type })}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        formData.projectType === type
                          ? 'bg-[#F4510B] text-white shadow-glow-orange font-semibold'
                          : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Project Details &amp; Objectives <span className="text-[#F4510B]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="Tell me about your brand, timeline, and what you aim to achieve..."
                  className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B] transition-all placeholder:text-neutral-500 resize-none ${
                    errors.message ? 'border-red-500/80' : 'border-white/10'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-sm tracking-wider uppercase shadow-glow-orange hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Project Message</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                Strict privacy. No spam. Direct communication with Abid Nalakath.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
