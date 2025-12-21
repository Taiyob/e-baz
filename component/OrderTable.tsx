import { format } from "date-fns";

export default function OrderTable({ orders }: { orders: any[] }) {
  return (
    <div className="w-full overflow-x-auto bg-gray-900/30 rounded-[32px] border border-gray-800 p-6 tab-content">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 uppercase text-sm tracking-widest">
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Products</th>
            <th className="px-6 py-4">Total Amount</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
              {/* Order ID & Transaction */}
              <td className="px-6 py-6 font-mono text-sm">
                #{order.id}
                <div className="text-[10px] text-gray-500 mt-1">{order.transactionId || 'No Trx ID'}</div>
              </td>

              {/* Customer Info */}
              <td className="px-6 py-6">
                <div className="font-bold text-white">{order.user?.name || 'Guest'}</div>
                <div className="text-xs text-gray-500">{order.user?.email}</div>
              </td>

              {/* Product Summary */}
              <td className="px-6 py-6">
                <div className="max-w-[200px]">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm text-gray-300 truncate">
                      {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </td>

              {/* Price */}
              <td className="px-6 py-6 font-black text-white text-lg">
                ${order.totalPrice.toLocaleString()}
              </td>

              {/* Payment Status Badge */}
              <td className="px-6 py-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  order.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {order.paymentStatus}
                </span>
                <div className="text-[9px] text-gray-600 mt-1 italic">{order.paymentMethod}</div>
              </td>

              {/* Order Status */}
              <td className="px-6 py-6 uppercase tracking-tighter italic font-bold text-sm">
                {order.status}
              </td>

              {/* Date */}
              <td className="px-6 py-6 text-right text-gray-500 text-sm">
                {format(new Date(order.createdAt), "MMM dd, yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-20 opacity-20 italic text-2xl">
          No orders found in the vault.
        </div>
      )}
    </div>
  );
}