import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    // ১. টোকেন ভ্যালিডেশন লজিক (ডাটাবেসের সাথে চেক)
    // ২. নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ৩. পাসওয়ার্ড আপডেট
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password has been reset successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}