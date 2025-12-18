import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);
  
  const items = await prisma.cartItem.findMany({
    where: { userId: Number(session.user.id) },
    include: { product: true }
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { productId, quantity } = await req.json();
  const uId = Number(session.user.id);

  try {
    // সহজ করার জন্য আগে চেক করি আছে কিনা
    const existing = await prisma.cartItem.findFirst({
      where: { userId: uId, productId: Number(productId) }
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 }
      });
      return NextResponse.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: { userId: uId, productId: Number(productId), quantity: 1 }
    });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}