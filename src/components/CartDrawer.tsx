'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../lib/cartStore';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(drawerRef.current, 
        { x: "100%" },
        { x: "0%", duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 z-40" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div ref={drawerRef} className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-gray-800 z-50 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black">Your Basket</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-900 rounded-full transition">
              <X size={32} />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-xl opacity-70 py-16">Your basket is empty</p>
          ) : (
            <>
              <div className="space-y-8">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-8 border-b border-gray-800">
                    <div className="w-24 h-24 bg-gray-900 rounded-xl flex items-center justify-center text-3xl opacity-20">
                      {item.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-lg opacity-70 mt-1">${item.price}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-700 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-4 py-2 hover:bg-gray-900"
                          >-</button>
                          <span className="px-6">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-4 py-2 hover:bg-gray-900"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-500 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-xl font-bold">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <div className="flex justify-between text-2xl font-bold mb-8">
                  <span>Total</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <button className="w-full py-6 text-2xl font-bold bg-white text-black rounded-full hover:scale-105 transition">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}