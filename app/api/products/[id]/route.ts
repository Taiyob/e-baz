// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const productId = parseInt(id);

//   if (isNaN(productId)) {
//     return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//   }

//   const product = await prisma.product.findUnique({
//     where: { id: productId },
//     include: { category: true },
//   });

//   if (!product) {
//     return NextResponse.json({ error: "Product not found" }, { status: 404 });
//   }

//   return NextResponse.json(product);
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
//     const body = await req.json();

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name: body.name,
//         price: body.price,
//         description: body.description,
//         images: body.images,
//         categoryId: body.categoryId,
//         inStock: body.inStock,
//         featured: body.featured,
//       },
//     });

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const productId = parseInt(params.id);

//   try {
//     await prisma.orderItem.deleteMany({
//       where: { productId },
//     });

//     await prisma.product.delete({
//       where: { id: productId },
//     });

//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }



import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        images: body.images,
        categoryId: body.categoryId,
        inStock: body.inStock,
        featured: body.featured,
      },
    });

    return NextResponse.json(updatedProduct);
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
    const productId = parseInt(id);

    await prisma.orderItem.deleteMany({
      where: { productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

