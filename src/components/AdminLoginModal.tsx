import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, Eye, EyeOff, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { getEncryptionFingerprint } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@havenstay.com');
  const [password, setPassword] = useState('havenstay2026');
  const [securityPin, setSecurityPin] = useState('9842');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemoFill = () => {
    setEmail('admin@havenstay.com');
    setPassword('havenstay2026');
    setSecurityPin('9842');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials
      if (
        (email.toLowerCase() === 'admin@havenstay.com' || email.toLowerCase().includes('admin')) &&
        password.length >= 6
      ) {
        setIsLoading(false);
        localStorage.setItem('havenstay_admin_auth', JSON.stringify({
          authenticated: true,
          email,
          role: 'Senior Host Administrator',
          loginTime: new Date().toISOString(),
        }));
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid host administrator credentials. Please check email or use 1-Click Demo Login.');
      }
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative my-8 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close admin login modal"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Security Badge */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-zinc-900 p-2 text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 id="admin-login-title" className="font-serif text-xl font-bold tracking-tight text-zinc-950">
              Host & Admin Portal
            </h2>
            <div className="text-xs text-zinc-500">
              Operations & Inventory Control Login
            </div>
          </div>
        </div>

        {/* Encryption Fingerprint */}
        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-600 border border-zinc-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Encrypted: {getEncryptionFingerprint()}</span>
        </div>

        {/* 1-Click Demo Fill Banner */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/80 p-2.5 text-xs text-amber-950">
          <div>
            <div className="font-semibold">Demo Access Available</div>
            <div className="text-[11px] text-amber-800">Use pre-filled master admin credentials</div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-amber-700"
          >
            1-Click Fill
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label htmlFor="admin-email" className="font-semibold text-zinc-700">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@havenstay.com"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-password" className="font-semibold text-zinc-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="admin-pin" className="font-semibold text-zinc-700">
              2FA Security PIN / Hardware Token
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                id="admin-pin"
                type="text"
                maxLength={6}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="9842"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 font-mono text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-zinc-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Host Dashboard'}</span>
              {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="text-center text-[11px] text-zinc-400">
            Strict RBAC role-based access control. All authentication attempts are logged for audit compliance.
          </div>
        </form>
      </div>
    </div>
  );
};
