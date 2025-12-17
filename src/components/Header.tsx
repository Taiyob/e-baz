// // src/components/HeaderOption1.tsx

// 'use client';

// import Link from 'next/link';
// import { ShoppingBag } from 'lucide-react';
// import { useState } from 'react';

// export default function HeaderOption1() {
//   const [cartCount] = useState(0); // পরে cart থেকে নিবে

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white mix-blend-difference">
//       {/* Left: SHOP */}
//       <Link href="/shop" className="text-lg tracking-wider hover:opacity-70 transition">
//         SHOP
//       </Link>

//       {/* Center: Logo (optional, তুমি চাইলে রাখো) */}
//       {/* <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
//         E-BAZ
//       </Link> */}

//       {/* Right: Basket */}
//       <Link href="/cart" className="flex items-center gap-2 text-lg tracking-wider hover:opacity-70 transition">
//         BASKET
//         <div className="relative">
//           <ShoppingBag size={24} />
//           {cartCount > 0 && (
//             <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black rounded-full text-xs flex items-center justify-center font-bold">
//               {cartCount}
//             </span>
//           )}
//         </div>
//       </Link>
//     </header>
//   );
// }

// src/components/HeaderOption2.tsx

'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useCart } from '@/src/lib/cartStore';

export default function HeaderOption2({ onCartClick }: { onCartClick: () => void }) {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [visible, setVisible] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true); // scroll up
      } else {
        setVisible(false); // scroll down
      }
      
      lastScrollY = currentScrollY;
    };

    const handleMouse = (e: MouseEvent) => {
      if (e.clientY < 100) setVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  useEffect(() => {
    gsap.to("header", {
      y: visible ? 0 : -100,
      duration: 0.6,
      ease: "power3.out"
    });
  }, [visible]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white mix-blend-difference bg-black/30 backdrop-blur-md">
      <Link href="/shop" className="text-lg tracking-wider hover:opacity-70 transition">
        SHOP
      </Link>

      <button 
        onClick={onCartClick}
        className="flex items-center gap-2 text-lg tracking-wider hover:opacity-70 transition"
      >
        BASKET
        <div id="basket-icon" className="relative">
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-white text-black rounded-full text-xs flex items-center justify-center font-bold animate-bounce">
              {cartCount}
            </span>
          )}
        </div>
      </button>
    </header>
  );
}