import OrdersClient from "@/component/OrdersClient";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-2xl">
          Loading orders...
        </div>
      }
    >
      <OrdersClient />
    </Suspense>
  );
}
