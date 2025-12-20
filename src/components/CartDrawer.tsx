"use client";

import { useCart } from "@/src/lib/cartStore";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    addItem,
    removeItem,
    getTotalPrice,
  } = useCart();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isDrawerOpen) {
      gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isDrawerOpen]);

  // GSAP Animation for Drawer
  // useEffect(() => {
  //   if (isOpen) {
  //     gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
  //   } else {
  //     gsap.to(drawerRef.current, {
  //       x: "100%",
  //       duration: 0.5,
  //       ease: "power3.in",
  //     });
  //   }
  // }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black border-l border-white/10 z-[101] translate-x-full flex flex-col text-white shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} />
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              Your Basket
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
              <ShoppingBag size={64} className="mb-4" />
              <p className="text-xl">Your basket is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                {/* Product Image */}
                <div className="relative w-24 h-32 bg-zinc-900 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                  <Image
                    src={item.image || "/poster.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-white/40 text-sm mt-1">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-white/10 rounded-full p-1 bg-white/5">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        useCart.setState((state) => ({
                          items: state.items.filter((i) => i.id !== item.id),
                        }));
                      }}
                      className="text-red-500/50 hover:text-red-500 transition p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Total & Checkout */}
        {items.length > 0 && (
          <div className="p-8 border-t border-white/10 bg-zinc-900/50 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-white/40 uppercase tracking-widest text-xs">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xl font-light">Subtotal</span>
                <span className="text-3xl font-black">
                  ${getTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="w-full py-6 cursor-pointer bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              onClick={() => {
                alert("Redirecting to payment...");
                // এখানে আপনার পেমেন্ট বা চেকআউট পেজের পাথ দিবেন
                // window.location.href = "/checkout";
              }}
            >
              Proceed to Checkout
            </button>

            <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
              Secure encryption • Timeless Luxury
            </p>
          </div>
        )}
      </div>
    </>
  );
}
