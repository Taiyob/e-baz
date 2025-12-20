"use client";

import { useCart } from "@/src/lib/cartStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("online");

  const subtotal = getTotalPrice();
  const shipping = 50;
  const total = subtotal + shipping;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert("Processing Payment...");
      setLoading(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-black">
        <h2 className="text-3xl font-bold mb-4">Your basket is empty!</h2>
        <button
          onClick={() => router.push("/")}
          className="text-zinc-400 hover:text-white underline"
        >
          Go back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side: Shipping & Address Form */}
          <div className="space-y-12">
            <section>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">
                Shipping Details
              </h2>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                  />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                />
                <input
                  required
                  type="text"
                  placeholder="Phone Number"
                  className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                />
                <input
                  required
                  type="text"
                  placeholder="Full Address (Street, House No)"
                  className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="City"
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Postal Code"
                    className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl focus:border-white outline-none transition"
                  />
                </div>

                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={20} /> Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Online Payment */}
                    <label
                      className={`border p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                        selectedPayment === "online"
                          ? "border-white/20 bg-white/5"
                          : "border-white/10 opacity-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={selectedPayment === "online"}
                        onChange={() => setSelectedPayment("online")}
                        className="hidden" // hide default radio
                      />
                      <span className="text-white">Online Payment</span>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`border p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                        selectedPayment === "cod"
                          ? "border-white/20 bg-white/5"
                          : "border-white/10 opacity-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={selectedPayment === "cod"}
                        onChange={() => setSelectedPayment("cod")}
                        className="hidden"
                      />
                      <span className="text-white">Cash on Delivery</span>
                    </label>
                  </div>
                  s
                </div>

                <button
                  disabled={loading}
                  className="w-full py-6 cursor-pointer bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay $${total.toLocaleString()}`}
                </button>
              </form>
            </section>
          </div>

          {/* Right Side: Order Summary */}
          <div className="bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-white/5 h-fit sticky top-12">
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">
              Order Summary
            </h2>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-black rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={item.image || "/poster.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-zinc-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Fee</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-4 border-t border-white/5">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-xs text-zinc-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Truck size={14} /> Fast Global Shipping
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} /> Secure SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
