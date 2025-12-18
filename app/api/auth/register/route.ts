import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs'; // Password hash korar jonno lagbe

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const user = await prisma.user.create({
      data: { email, name, password, role: 'USER' }
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}