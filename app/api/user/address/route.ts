import { prisma } from "@/lib/prisma";
import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { isDefault: 'desc' }, 
  });

  return NextResponse.json(addresses);
}