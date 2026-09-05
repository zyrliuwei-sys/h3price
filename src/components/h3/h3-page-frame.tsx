import type { ReactNode } from 'react';

import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

export function H3PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090a] text-white">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
