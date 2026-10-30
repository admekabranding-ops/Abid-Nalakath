import React, { useState } from 'react';
import { personalInfo, socialLinks } from '../data/portfolioData';
import { 
  ArrowUpRight, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';
import { InstagramIcon, LinkedInIcon, GitHubIcon, BehanceIcon } from './BrandIcons';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  initialService?: string;
}

const serviceOptions = [
  'Graphic Designing',
  'Branding',
  'AI Videos',
  'Applications',
  'Websites',
  'Other',
];

const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail className="w-5 h-5" />,
  Instagram: <InstagramIcon className="w-5 h-5" />,
  Behance: <BehanceIcon className="w-5 h-5" />,
  LinkedIn: <LinkedInIcon className="w-5 h-5" />,
  GitHub: <GitHubIcon className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
};

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService = 'Graphic Designing' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: initialService,
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.details.trim()) {
      errs.details = 'Please briefly describe your project goals';
    } else if (formData.details.trim().length < 10) {
      errs.details = 'Project details must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Construct mailto link
      const subject = encodeURIComponent(`Project Inquiry: ${formData.service} from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Abid,\n\nName: ${formData.name}\nEmail: ${formData.email}\nService Required: ${formData.service}\n\nProject Details:\n${formData.details}\n\nSent from your portfolio website.`
      );
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5A1F', '#FF6A00', '#F52E36', '#ffffff'],
        });
      } catch (e) {
        // Ignore if confetti blocked
      }

      // Open mailto fallback client
      window.location.href = mailtoUrl;

      setSubmitStatus('success');
      setStatusMessage(
        `Thank you, ${formData.name}! Your message details are ready. We also launched your email client to send directly to ${personalInfo.email}.`
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        service: 'Graphic Designing',
        details: '',
      });
      setErrors({});
    } catch (err) {
      setSubmitStatus('error');
      setStatusMessage('Something went wrong. Please email directly at ' + personalInfo.email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-10 bg-[#0B0B0B] text-white overflow-hidden">
      {/* Background Atmospheric Orange-Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF5A1F]/20 via-[#F52E36]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading, Catchphrase & Direct Social Links */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  LET'S WORK TOGETHER
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.05] whitespace-pre-line mb-6">
                Have an Idea? <br />
                <span className="text-[#FF5A1F]">Let's Create</span> <br />
                Something Great.
              </h2>

              <p className="text-base text-white/75 leading-relaxed max-w-md mb-8">
                Have a project in mind? Let's discuss how creative design, brand systems, and technology can bring your ideas to life.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/90 mb-10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Currently Accepting New Projects & Collaborations</span>
              </div>
            </div>

            {/* Direct Contact & Social Links List */}
            <div className="pt-8 border-t border-white/10 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                Direct Channels & Social
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF5A1F]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white/70 group-hover:text-[#FF5A1F] transition-colors">
                        {iconMap[link.name] || <Sparkles className="w-4 h-4" />}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{link.name}</p>
                        <p className="text-[11px] text-white/50">{link.displayValue}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 md:p-12 rounded-[32px] bg-[#141414] border border-white/10 shadow-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs md:text-sm text-white/60 mb-8">
                Fill in the details below. All inquiries are directly sent to Abid's verified inbox.
              </p>

              {/* Success / Error Banners */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs md:text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Message Initiated Successfully!</p>
                    <p className="text-emerald-300/80 mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs md:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Submission Notice</p>
                    <p className="text-red-300/80 mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                      Full Name <span className="text-[#FF5A1F]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full px-4 py-3.5 rounded-xl bg-black/40 border text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#FF5A1F]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                      Email Address <span className="text-[#FF5A1F]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@company.com"
                      className={`w-full px-4 py-3.5 rounded-xl bg-black/40 border text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#FF5A1F]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Service Dropdown */}
                <div>
                  <label htmlFor="service" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                    Service Required
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF5A1F] transition-colors"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#141414] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Details */}
                <div>
                  <label htmlFor="details" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                    Project Details <span className="text-[#FF5A1F]">*</span>
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Tell me about your project, timeline, scope, and goals..."
                    className={`w-full px-4 py-3.5 rounded-xl bg-black/40 border text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none ${
                      errors.details ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#FF5A1F]'
                    }`}
                  />
                  {errors.details && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.details}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full pill-button-orange justify-center py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending message...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-between w-full px-2">
                        <span>Send Project Inquiry</span>
                        <span className="pill-arrow-white">
                          <Send className="w-4 h-4 ml-0.5" />
                        </span>
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-center text-[11px] text-white/40 pt-2">
                  Prefer direct email? Reach out directly at{' '}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-[#FF5A1F] hover:underline font-medium"
                  >
                    {personalInfo.email}
                  </a>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
