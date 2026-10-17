import React, { useState } from 'react';
import { User, ShieldCheck, Check, AlertCircle, KeyRound } from 'lucide-react';
import { apiRequest } from '../../../api/client';

export const SettingsTab: React.FC = () => {
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Username change states
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [changingUsername, setChangingUsername] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordSuccess(res.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');

    setChangingUsername(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string; username: string }>('/auth/change-username', {
        method: 'POST',
        body: JSON.stringify({ newUsername, password: usernamePassword }),
      });
      setUsernameSuccess(res.message || 'Username updated');
      setNewUsername('');
      setUsernamePassword('');
      setTimeout(() => setUsernameSuccess(''), 4000);
    } catch (err: any) {
      setUsernameError(err.message);
    } finally {
      setChangingUsername(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="pb-6 border-b border-white/10">
        <h2 className="font-display text-2xl font-bold text-white">
          Admin Portal Settings &amp; Security
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Manage local login credentials and review local security architecture
        </p>
      </div>

      {/* Change Password Card */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4510B]/20 flex items-center justify-center text-[#FF9D00]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Change Admin Password
            </h3>
            <p className="text-xs text-neutral-400">
              Passwords are salted and securely hashed using PBKDF2 (SHA-512) before being stored in SQLite.
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              New Password (minimum 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all disabled:opacity-50"
          >
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Change Username Card */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Change Admin Username
            </h3>
            <p className="text-xs text-neutral-400">
              Update the handle used to access the local admin dashboard.
            </p>
          </div>
        </div>

        {usernameSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{usernameSuccess}</span>
          </div>
        )}

        {usernameError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{usernameError}</span>
          </div>
        )}

        <form onSubmit={handleUsernameChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              New Username
            </label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. abid_admin"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Verify Current Password
            </label>
            <input
              type="password"
              required
              value={usernamePassword}
              onChange={(e) => setUsernamePassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#F4510B]"
            />
          </div>

          <button
            type="submit"
            disabled={changingUsername}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50"
          >
            {changingUsername ? 'Updating...' : 'Update Username'}
          </button>
        </form>
      </div>

      {/* Local Security & Architecture Documentation */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="font-display font-bold text-base text-white">
            Local Security Architecture &amp; Limitations
          </h3>
        </div>

        <div className="space-y-3 text-xs text-neutral-300 leading-relaxed pt-2">
          <p>
            <strong className="text-white">1. Single-PC Local Deployment:</strong> This administrative system operates entirely locally on your machine via a lightweight Node.js Express server and SQLite WAL database (<code className="text-[#FF9D00]">data/database.sqlite</code>).
          </p>
          <p>
            <strong className="text-white">2. No Cloud Dependency:</strong> No external databases (Firebase, Supabase, AWS), no cloud APIs, and no internet access are required for full day-to-day operation.
          </p>
          <p>
            <strong className="text-white">3. Zero Plaintext Passwords:</strong> Passwords are cryptographically salted and hashed using PBKDF2 with 100,000 iterations before being saved to SQLite. Frontend JavaScript never receives password hashes.
          </p>
          <p>
            <strong className="text-white">4. Local Security Scope:</strong> Anyone with direct physical administrative access to this computer's file system can read local files. Ensure your operating system account has a strong password.
          </p>
          <p>
            <strong className="text-white">5. Future Online Migration:</strong> The data model in SQLite is structured with standard relational tables (`projects`, `services`, `site_content`, `contact_messages`), allowing seamless future migration to PostgreSQL or MySQL whenever you decide to host online.
          </p>
        </div>
      </div>
    </div>
  );
};
