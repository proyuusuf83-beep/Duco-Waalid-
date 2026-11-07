import React, { useState } from 'react';
import { Language } from '../types';
import { api } from '../services/api';
import { ShieldCheck, Lock, Mail, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentLang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang
}) => {
  // Secured: Never pre-fill credentials for public visitors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.adminLogin(email.trim(), password);
      if (res.success) {
        sessionStorage.setItem('dw_admin_token', res.token || 'logged_in');
        localStorage.setItem('dw_admin_token', res.token || 'logged_in');
        onLoginSuccess();
        onClose();
        // Clear password state after successful login
        setPassword('');
      } else {
        setError(res.message || (currentLang === 'so' ? 'Email-ka ama Furaha sirta ah waa qalad' : 'Invalid administrator credentials'));
      }
    } catch (err) {
      console.error(err);
      setError(currentLang === 'so' ? 'Khalad xagga xiriirka ah, fadlan mar kale isku day.' : 'Connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B5130]">
                {currentLang === 'so' ? 'Galka Maamulka (Admin Portal)' : 'Admin Portal'}
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                {currentLang === 'so' ? 'Shaqaalaha Idman oo Kaliya' : 'Authorized Personnel Only'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {currentLang === 'so' ? 'Email-ka Maamulka' : 'Admin Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ducowaalid.com"
                className="w-full text-xs p-3.5 pl-10 border border-neutral-200 rounded-xl focus:border-[#168447] focus:ring-1 focus:ring-[#168447] focus:outline-none bg-neutral-50/50"
                required
                autoComplete="username"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              {currentLang === 'so' ? 'Furaha Sirta ah (Password)' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs p-3.5 pl-10 pr-10 border border-neutral-200 rounded-xl focus:border-[#168447] focus:ring-1 focus:ring-[#168447] focus:outline-none bg-neutral-50/50"
                required
                autoComplete="current-password"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-[#168447]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {loading 
                ? (currentLang === 'so' ? 'Waa la hubinayaa...' : 'Verifying...') 
                : (currentLang === 'so' ? 'Gal Maamulka (Sign In)' : 'Sign In to Dashboard')}
            </span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center text-center">
          <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#168447]" />
            <span>
              {currentLang === 'so' 
                ? 'Albaab sir ah oo u gaar ah maamulka shirkadda Duco Waalid'
                : 'Restricted access for Duco Waalid administrators only'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
