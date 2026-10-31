import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@abidnalakath.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
      else window.location.href = '/admin';
    } else {
      setErrorMsg(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-between p-6 relative overflow-hidden selection:bg-[#FF5A1F] selection:text-white">
      {/* Background ambient orange glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF5A1F]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto z-10">
        <a
          href="/"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </a>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
          <Shield className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>Encrypted Admin Portal</span>
        </div>
      </header>

      {/* Center Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className="p-8 sm:p-10 rounded-[32px] bg-[#121212] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] mx-auto mb-4 shadow-lg shadow-[#FF5A1F]/20">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Sign In</h2>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Enter your credentials to manage and visually edit your portfolio.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abidnalakath.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FF5A1F] text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF5A1F]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Setup Hint */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-[11px] text-white/40 font-mono">
            Default Admin: <span className="text-white/80">admin@abidnalakath.com</span>
            <br />
            Initial Password: <span className="text-[#FF5A1F]">AbidAdmin@2026</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-white/30 font-mono z-10 py-2">
        © {new Date().getFullYear()} Abid Nalakath · Creative Designer Portfolio CMS
      </footer>
    </div>
  );
};
