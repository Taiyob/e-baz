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
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.redirect("/orders?error=payment_failed");
  } catch (error) {
    console.error("Fail callback error:", error);
    return NextResponse.redirect("/orders?error=payment_failed");
  }
}
