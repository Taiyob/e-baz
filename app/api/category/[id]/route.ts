import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ১. নির্দিষ্ট একটি ক্যাটাগরি দেখা (Get Single)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true } // এই ক্যাটাগরির আন্ডারে কি কি প্রোডাক্ট আছে তাও দেখাবে
    });

    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// ২. ক্যাটাগরি আপডেট করা (Update)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        image: body.image,
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ৩. ক্যাটাগরি ডিলিট করা (Delete - Parent/Child Handling)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id);

  try {
    // আগে এই ক্যাটাগরির সব প্রোডাক্ট ডিলিট করতে হবে (যেহেতু স্কিমাতে প্রোডাক্টের জন্য ক্যাটাগরি ম্যান্ডেটরি)
    await prisma.product.deleteMany({
      where: { categoryId }
    });

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ message: "Category and related products deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}