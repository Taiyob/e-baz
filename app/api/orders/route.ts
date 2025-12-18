import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ১. নতুন অর্ডার তৈরি (Create)
export async function POST(req: Request) {
  try {
    const { userId, addressId, items, totalPrice } = await req.json();

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalPrice,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}

// ২. সব অর্ডার দেখা (Admin-এর জন্য)
export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
      address: true,
    },
  });
  return NextResponse.json(orders);
}