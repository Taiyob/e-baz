import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ১. নির্দিষ্ট একটি ক্যাটাগরি দেখা (Get Single)
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = parseInt(params.id);
//     const category = await prisma.category.findUnique({
//       where: { id },
//       include: { products: true } // এই ক্যাটাগরির আন্ডারে কি কি প্রোডাক্ট আছে তাও দেখাবে
//     });

//     if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

//     return NextResponse.json(category);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
//   }
// }

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // ei ta change koro
) {
  const params = await context.params; // await diye unwrap
  const id = parseInt(params.id); // string ke number e convert (database ID int hole)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true }, // jodi products include korte chao, na hole remove
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const body = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: body.name,
        image: body.image,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    await prisma.product.deleteMany({
      where: { categoryId },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      message: "Category and related products deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

