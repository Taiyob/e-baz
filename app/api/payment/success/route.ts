import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // SSLCommerz POST data

    // Basic validation (SSLCommerz er response)
    if (!body.status || !body.tran_id || !body.val_id) {
      return NextResponse.json(
        { error: "Invalid payment response" },
        { status: 400 }
      );
    }

    // Find order by tran_id (tumi checkout e tran_id generate korechile)
    const order = await prisma.order.findFirst({
      where: { transactionId: body.tran_id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify with SSLCommerz Validation API (recommended)
    const validationRes = await fetch(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl&val_id=${body.val_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&type=json`
    );

    const validationData = await validationRes.json();

    if (
      validationData.status !== "VALID" &&
      validationData.status !== "VALIDATED"
    ) {
      return NextResponse.json(
        { error: "Payment validation failed" },
        { status: 400 }
      );
    }

    // Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        transactionId: body.tran_id,
        // Optional: add payment details
      },
    });

    // Optional: Send email to customer (nodemailer ba Resend use koro)

    return NextResponse.redirect("/orders?success=true&orderId=" + order.id);
  } catch (error) {
    console.error("Success callback error:", error);
    return NextResponse.redirect("/orders?error=payment_failed");
  }
}
