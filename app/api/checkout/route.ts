import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const body = await request.json();
  const { paymentMethod, addressData } = body;

  try {
    // 1. Cart items fetch
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Total calculate
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 3. New address create or update (user er default address)
    let address;
    if (addressData) {
      address = await prisma.address.create({
        data: {
          userId,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country || "Bangladesh",
          isDefault: true,
        },
      });
    }

    // 4. Order create
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "PENDING",
        paymentStatus: paymentMethod === "online" ? "UNPAID" : "UNPAID",
        paymentMethod,
        addressId: address?.id,
      },
    });

    // 5. OrderItems create
    await Promise.all(
      cartItems.map((item) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        })
      )
    );

    // 6. Cart clear
    await prisma.cartItem.deleteMany({ where: { userId } });

    // 7. Payment method handling
    if (paymentMethod === "online") {
      console.log("Initiating SSLCommerz for order:", order.id);
      const paymentResponse = await initiateSSLCommerzPayment(
        order.id,
        totalPrice
      );
      console.log("SSLCommerz response:", paymentResponse);

      if (!paymentResponse.GatewayPageURL) {
        console.error("No GatewayPageURL received");
        return NextResponse.json(
          { error: "Payment initiation failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentUrl: paymentResponse.GatewayPageURL, // SSLCommerz er redirect URL
      });
    } else {
      // COD: Order complete, email send or admin notify
      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: "Order placed successfully! Pay on delivery.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

// SSLCommerz payment initiate function (example)
async function initiateSSLCommerzPayment(orderId: number, amount: number) {
  const storeId = process.env.SSLCOMMERZ_STORE_ID!;
  const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD!;

  const response = await fetch(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        store_id: storeId,
        store_passwd: storePass,
        total_amount: amount.toString(),
        currency: "BDT",
        tran_id: `ORDER_${orderId}_${Date.now()}`,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
        fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
        cus_name: "Customer", // from form
        cus_email: "customer@email.com",
        cus_phone: "017xxxxxxxx",
        cus_add1: "Address",
        cus_city: "City",
        cus_country: "Bangladesh",
        shipping_method: "NO",
        product_name: "E-Baz Products",
        product_category: "Ecommerce",
        product_profile: "physical-goods",
      }),
    }
  );

  const data = await response.json();
  return data;
}
