import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirm,
      });
      showToast('Account created successfully. Welcome to VERDICT!');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Unable to complete registration.');
    } finally {
      setLoading(false);
    }
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
              Join The Community
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2 leading-tight">
              Honest hardware criticism.
            </h2>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Create an account to submit your verdicts, edit and curate your reviews, and help the community make clear-eyed decisions.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full review ownership and edit privileges</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct score aggregation impact</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Access to developer and administrative features</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Create your account
            </h3>
            <p className="text-xs text-slate-400 mb-8">
              Join thousands of creators and engineers evaluating premium hardware.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                icon={User}
                placeholder="e.g. Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

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
                helperText="Minimum 8 characters"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                icon={Lock}
                placeholder="••••••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
                className="w-full mt-2"
                isLoading={loading}
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold ml-1">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
