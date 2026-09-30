import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      showToast('Welcome back to VERDICT.');
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#12151e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side: Editorial Presentation */}
        <div className="lg:col-span-5 p-8 sm:p-12 bg-gradient-to-br from-[#1a2030] via-[#12151e] to-[#0a0c12] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-xl mb-6 shadow-lg shadow-amber-500/20">
              V
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Authentic Review Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2 leading-tight">
              Know before you commit.
            </h2>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Sign in to contribute your verdicts, curate personal collections, and engage with verified hardware reviews.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-8 border-t border-white/10 mt-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Quick Dev Access:
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@verdict.io', 'Password123!')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-mono text-amber-300 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Curator
                </span>
                <span className="text-[10px] text-amber-400/80">admin@verdict.io</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('alex@verdict.io', 'Password123!')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Community Reviewer
                </span>
                <span className="text-[10px] text-slate-400">alex@verdict.io</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Welcome back
            </h3>
            <p className="text-xs text-slate-400 mb-8">
              Enter your email credentials to access your VERDICT account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                required
                icon={Mail}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
              >
                <span>Sign in to Verdict</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-semibold ml-1">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
