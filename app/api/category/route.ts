import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name, image } = await req.json();
  const category = await prisma.category.create({
    data: { name, image }
  });
  return NextResponse.json(category);
}