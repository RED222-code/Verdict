import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';

export function Shell() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />

      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
