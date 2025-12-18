import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, street, city, zipCode, country, isDefault } = await req.json();
  
  // যদি এই অ্যাড্রেসটি ডিফল্ট হয়, তবে আগের ডিফল্টগুলো ফলস করে দেওয়া
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { userId, street, city, zipCode, country, isDefault },
  });
  return NextResponse.json(address);
}