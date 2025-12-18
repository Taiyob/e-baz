import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    
    // ১. ইউজার আগে থেকে আছে কিনা চেক করা
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // ২. পাসওয়ার্ড হ্যাশ করা (সল্ট রাউন্ড ১০ দেওয়া হয়েছে)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৩. ডাটাবেসে ইউজার তৈরি করা
    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        password: hashedPassword, // হ্যাশ করা পাসওয়ার্ড সেভ হবে
        role: 'USER' 
      }
    });

    // নিরাপত্তা নিশ্চিত করতে রেসপন্স থেকে পাসওয়ার্ড সরিয়ে ফেলা
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      message: "User created successfully", 
      user: userWithoutPassword 
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}