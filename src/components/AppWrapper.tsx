'use client';

import { useState } from 'react';
import { SessionProvider } from "next-auth/react";
import HeaderOption2 from '@/src/components/Header';
import CartDrawer from '@/src/components/CartDrawer';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <SessionProvider>
        {children}
      </SessionProvider>
      {/* <HeaderOption2 onCartClick={() => setIsCartOpen(true)} />
      {children}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}