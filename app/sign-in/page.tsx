'use client';

import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  gsap.fromTo(containerRef.current, 
    { opacity: 0, y: 100 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
  );

  const children = formRef.current?.children;
  if (children && children.length > 0) {
    gsap.fromTo(children, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2, 
        delay: 0.5,
        ease: "power3.out" 
      }
    );
  }
}, [isLogin]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      <div ref={containerRef} className="max-w-md w-full">
        {/* Logo / Title */}
        <div className="text-center mb-16">
          <h1 className="text-8xl md:text-9xl font-black mb-4">LUXE</h1>
          <p className="text-xl opacity-70">Minimal • Timeless • Yours</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-8 py-3 text-lg font-bold transition ${isLogin ? 'text-white' : 'text-gray-500'}`}
          >
            Login
          </button>
          <span className="mx-8 text-gray-600">/</span>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 text-lg font-bold transition ${!isLogin ? 'text-white' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div ref={formRef} className="space-y-8">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-6 top-6 text-gray-500" size={24} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-6 text-gray-500" size={24} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-6 text-gray-500" size={24} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-6 top-6 text-gray-500" size={24} />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <button className="w-full py-6 bg-white text-black text-2xl font-bold rounded-full hover:scale-105 transition-all duration-500 flex items-center justify-center gap-4 group">
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="group-hover:translate-x-2 transition" size={28} />
          </button>

          {isLogin && (
            <p className="text-center text-lg opacity-70">
              Forgot password? <span className="underline hover:text-white cursor-pointer">Reset here</span>
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-12 flex items-center">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="px-6 text-gray-600">OR</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Social Login (optional) */}
        <button className="w-full py-6 border border-gray-600 rounded-full text-xl hover:bg-gray-900 transition">
          Continue with Google
        </button>
      </div>
    </div>
  );
}