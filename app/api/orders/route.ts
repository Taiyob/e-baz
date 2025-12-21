import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

const orders = await prisma.order.findMany({
  include: {
    user: {
      select: {
        name: true,
        email: true,
      },
    },
    items: {
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    },
    address: true, 
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { userId, addressId, items, totalPrice } = await req.json();

//     const order = await prisma.order.create({
//       data: {
//         userId,
//         addressId,
//         totalPrice,
//         status: "PENDING",
//         items: {
//           create: items.map((item: any) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//         },
//       },
//       include: { items: true },
//     });

//     return NextResponse.json(order, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Order failed" }, { status: 500 });
//   }
// }

// export async function GET() {
//   const orders = await prisma.order.findMany({
//     include: {
//       user: { select: { name: true, email: true } },
//       items: { include: { product: true } },
//       address: true,
//     },
//   });
//   return NextResponse.json(orders);
// }
