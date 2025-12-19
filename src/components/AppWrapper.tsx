'use client';

import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from "next-auth/react";
import HeaderOption2 from '@/src/components/Header';
import CartDrawer from '@/src/components/CartDrawer';
import { useCart } from '../lib/cartStore';

  function CartSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { setItems, clearCart } = useCart();

  useEffect(() => {
    if (session?.user) {
      const syncCart = async () => {
        try {
          const res = await fetch("/api/cart");
          const data = await res.json();
          
          if (res.ok && Array.isArray(data)) {
            const formattedItems = data.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.images?.[0],
              quantity: item.quantity,
              userId: session.user.id 
            }));
            setItems(formattedItems);
          }
        } catch (err) {
          console.error("Cart fetch error:", err);
        }
      };
      syncCart();
    } else {
      clearCart();
    }
  }, [session, setItems, clearCart]);

  return <>{children}</>;
}

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartSync>
        {children}
      </CartSync>
    </SessionProvider>
    /* <HeaderOption2 onCartClick={() => setIsCartOpen(true)} />
      {children}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */
  );
}


