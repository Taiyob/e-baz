import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    // একটি র‍্যান্ডম টোকেন তৈরি (এটি ইমেইলে পাঠাতে হবে)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // টোকেনটি ডাটাবেসে সেভ করার জন্য তোমার মডেলে ফিল্ড থাকতে হবে। 
    // যদি ফিল্ড না থাকে, তবে আপাতত ওটিপি সিস্টেম বা টেম্পোরারি স্টোরেজ লাগবে।
    
    return NextResponse.json({ 
      message: "Reset link/OTP sent to your email",
      token: resetToken // বাস্তবে এটি ইমেইলে যাবে, রেসপন্সে নয়
    });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}