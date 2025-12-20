/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.id) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/orders");
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setOrders(data);
        } catch (err) {
          console.error(err);
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-12">Your Orders</h1>

        {success && (
          <div className="bg-green-900/50 border border-green-500 p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-green-400">
              Order #{orderId} Placed Successfully!
            </h2>
            <p className="mt-2">Thank you for your purchase.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-red-400">
              Payment {error.replace("payment_", "").toUpperCase()}
            </h2>
            <p className="mt-2">
              Your order may have been cancelled. Please try again or contact
              support.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-2xl">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-2xl opacity-50">
            No orders found.
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Order #{order.id}</h3>
                  <span
                    className={`px-4 py-1 rounded-full text-sm ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-900 text-green-300"
                        : order.paymentStatus === "UNPAID"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="text-zinc-400">
                  Total: ${order.totalPrice.toLocaleString()}
                </p>
                <p className="text-zinc-400">Status: {order.status}</p>
                <p className="text-zinc-400">
                  Payment Method: {order.paymentMethod || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
