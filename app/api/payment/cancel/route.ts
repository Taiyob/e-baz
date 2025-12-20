import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = await prisma.order.findFirst({
      where: { transactionId: body.tran_id },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "REFUNDED",
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.redirect("/orders?error=payment_cancelled");
  } catch (error) {
    console.error("Cancel callback error:", error);
    return NextResponse.redirect("/orders?error=payment_cancelled");
  }
}
