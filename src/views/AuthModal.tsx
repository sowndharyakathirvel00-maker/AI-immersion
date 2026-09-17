import React, { useState } from 'react';
import { Leaf, ArrowRight, CheckCircle2, Users, Mail, Lock, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginUser, updateUserProfile } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('Ananya Sharma');
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [householdSize, setHouseholdSize] = useState(3);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'signup') {
      updateUserProfile({
        name: name || 'ShelfSense User',
        email,
        householdSize: Number(householdSize) || 2,
        isAuthenticated: true,
      });
      loginUser(email, name || 'ShelfSense User');
    } else {
      loginUser(email, name || 'Ananya Sharma');
    }

    onClose();
  };

  const handleDemoFill = () => {
    setName('Ananya Sharma');
    setEmail('ananya.sharma@example.com');
    setPassword('demoPass123');
    setHouseholdSize(3);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md bg-[#FBF9F5] rounded-3xl shadow-2xl border border-[#E8E4DA] p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#52685B] hover:bg-[#EAE5D9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#3F6E4E] flex items-center justify-center text-white shadow-sm shadow-[#3F6E4E]/20">
            <Leaf className="w-5 h-5 text-[#D3E2D6]" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#1A2820]">ShelfSense</h3>
            <p className="text-xs text-[#52685B]">Smart Grocery & Food Waste Manager</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#EAE5D9] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-[#1A2820] shadow-xs'
                : 'text-[#52685B] hover:text-[#1A2820]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#1A2820] shadow-xs'
                : 'text-[#52685B] hover:text-[#1A2820]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2820] mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#52685B]" />
                  Household Size (people)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
                />
                <p className="text-[11px] text-[#697D71] mt-1">
                  Used by our smart algorithm to calibrate purchase pace.
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#52685B]" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2820] mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#52685B]" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5DDD7] text-sm text-[#1A2820] focus:ring-2 focus:ring-[#3F6E4E]"
            />
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#485D51]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D5DDD7] text-[#3F6E4E] focus:ring-[#3F6E4E]"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[#3F6E4E] font-medium hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Quick Demo Fill
              </button>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 bg-[#3F6E4E] hover:bg-[#345B40] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#3F6E4E]/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to ShelfSense' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Prototype note */}
        <div className="mt-5 pt-4 border-t border-[#E8E4DA] text-center">
          <p className="text-[11px] text-[#788C80] flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6E4E]" />
            Local prototype authentication active. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};
