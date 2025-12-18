import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ১. নির্দিষ্ট প্রোডাক্ট দেখা (Get Single)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// ২. প্রোডাক্ট আপডেট করা (Update)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        images: body.images,
        categoryId: body.categoryId,
        inStock: body.inStock,
        featured: body.featured
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ৩. প্রোডাক্ট ডিলিট করা (OrderItem হ্যান্ডেল করে)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const productId = parseInt(params.id);

  try {
    // ডাটাবেস কনস্ট্যান্ট ঠিক রাখতে আগে এই প্রোডাক্টের সব অর্ডার আইটেম ডিলিট করো
    await prisma.orderItem.deleteMany({
      where: { productId }
    });

    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}