import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('You have been signed out.');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 py-1.5 px-3 rounded-lg ${
      isActive
        ? 'text-amber-400 bg-amber-400/10'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090a0f]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider font-display text-white group-hover:text-amber-300 transition-colors">
                VERDICT
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 -mt-1">
                Don't Buy Blind
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClasses}>
              Discover
            </NavLink>
            <NavLink to="/products" className={navLinkClasses}>
              Catalog
            </NavLink>
          </nav>
        </div>

        {/* Right side: Search, Auth, Admin, Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick search button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs text-slate-400 bg-[#12151e] hover:bg-[#1a1e2b] border border-white/10 hover:border-white/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer group"
            aria-label="Search products"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            <span className="hidden sm:inline">Search products...</span>
            <kbd className="hidden lg:inline-block font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">
              /
            </kbd>
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" icon={ShieldCheck} className="border-amber-500/30 text-amber-300">
                      Admin
                    </Button>
                  </Link>
                )}

                <Link to="/profile">
                  <Button variant="outline" size="sm" icon={User}>
                    <span className="max-w-[120px] truncate">{user?.name || 'Profile'}</span>
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Join Verdict
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c0e15] px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/5 hover:text-amber-400 text-sm font-medium"
            >
              <Compass className="w-4 h-4 text-amber-500" />
              Discover
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-white/5 hover:text-amber-400 text-sm font-medium"
            >
              <LayoutGrid className="w-4 h-4 text-amber-500" />
              Catalog
            </NavLink>
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-xs font-mono text-slate-400">
                  Signed in as <span className="text-white font-medium">{user?.name}</span> ({user?.role})
                </div>

                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="md" icon={ShieldCheck} className="w-full justify-start text-amber-300">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" icon={User} className="w-full justify-start">
                    My Profile & Reviews
                  </Button>
                </Link>

                <Button variant="danger" size="md" icon={LogOut} onClick={handleLogout} className="w-full justify-start">
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Join Verdict
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
