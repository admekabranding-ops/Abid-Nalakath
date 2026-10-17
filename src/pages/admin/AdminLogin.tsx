import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiRequest, setAuthToken, getAuthToken } from '../../api/client';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to /admin
    if (getAuthToken()) {
      apiRequest('/auth/verify')
        .then(() => navigate('/admin'))
        .catch(() => {});
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest<{ success: boolean; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (data.token) {
        setAuthToken(data.token);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0503] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-[#F4510B]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF9D00]/10 blur-[100px] pointer-events-none" />

      {/* Top Bar Back to Site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#140a07] border border-[#F4510B]/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4510B] to-[#C63D08] flex items-center justify-center mx-auto mb-4 p-2.5 shadow-glow-orange text-white">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <path d="M12 10C21 15 21 33 12 38C26 38 26 10 12 10Z" fill="currentColor" />
                <path d="M36 10C27 15 27 33 36 38C22 38 22 10 36 10Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              Local Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Abid Nalakath Creative Designer Management
            </p>
          </div>

          {/* First Time Setup Hint */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#FF9D00]/10 border border-[#FF9D00]/20 flex items-start gap-2.5 text-xs text-neutral-300">
            <Sparkles className="w-4 h-4 text-[#FF9D00] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">First-time Login:</span> Username is <code className="text-[#FF9D00] font-mono">admin</code>, Password is <code className="text-[#FF9D00] font-mono">admin123</code>. (Change password inside Settings anytime).
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F4510B] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Local Single-PC Mode • SQLite Database</span>
          </div>
        </div>
      </div>
    </div>
  );
};
