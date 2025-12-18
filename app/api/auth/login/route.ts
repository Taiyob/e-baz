import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ১. ইউজার খুঁজে বের করা
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ২. ইউজার না থাকলে বা পাসওয়ার্ড ভুল হলে এরর দেওয়া
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ৩. পাসওয়ার্ড কম্পেয়ার করা
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // পাসওয়ার্ড বাদে ইউজার ডাটা পাঠানো
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      message: "Login successful", 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}