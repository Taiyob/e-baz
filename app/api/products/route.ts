// api/products
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Sob product list kora
export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  return NextResponse.json(products);
}

// Notun product add kora
export async function POST(req: Request) {
  try {
    const { name, price, description, images, categoryId } = await req.json();
    const product = await prisma.product.create({
      data: { name, price, description, images, categoryId },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
