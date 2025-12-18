'use client';

import { useCart } from "@/src/lib/cartStore";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";

export default function CartDrawer() {
  const { data: session } = useSession();
  const { items, isDrawerOpen, closeDrawer, removeItem } = useCart();
  
  const currentUserItems = items.filter(item => item.userId === session?.user?.id);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={closeDrawer} />
      <div className="relative w-full max-w-md bg-gray-900 h-full p-8 text-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black">YOUR BASKET</h2>
          <button onClick={closeDrawer}><X size={32} /></button>
        </div>

        <div className="space-y-6 overflow-y-auto h-[calc(100vh-200px)]">
          {currentUserItems.length === 0 ? (
            <p className="opacity-50 italic">Your basket is empty.</p>
          ) : (
            currentUserItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm opacity-50">Qty: {item.quantity} × ${item.price}</p>
                </div>
                <button onClick={() => removeItem(item.id, session?.user?.id)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}