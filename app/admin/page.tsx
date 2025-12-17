'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';

export default function SuperAdminLogin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background subtle animation
    gsap.fromTo(containerRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power2.out" }
    );

    // Form entrance
    gsap.fromTo(formRef.current, 
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.4, delay: 0.5, ease: "power4.out" }
    );

    // Fields stagger
    const fields = formRef.current?.querySelectorAll('.input-group');
    if (fields) {
      gsap.fromTo(fields, 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white flex items-center justify-center px-8 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-50" />

      <div ref={formRef} className="relative z-10 max-w-md w-full">
        {/* Shield Icon + Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-8 backdrop-blur-md">
            <Shield size={48} className="text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-4">ADMIN</h1>
          <p className="text-xl opacity-60">Exclusive Access Panel</p>
        </div>

        {/* Form */}
        <form className="space-y-12">
          <div className="input-group relative">
            <Mail className="absolute left-6 top-6 text-gray-500" size={28} />
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full pl-20 pr-8 py-8 bg-gray-900/50 border border-gray-800 rounded-3xl text-2xl focus:outline-none focus:border-white focus:bg-gray-900 transition-all duration-500 backdrop-blur-md"
            />
          </div>

          <div className="input-group relative">
            <Lock className="absolute left-6 top-6 text-gray-500" size={28} />
            <input
              type="password"
              placeholder="Master Password"
              className="w-full pl-20 pr-8 py-8 bg-gray-900/50 border border-gray-800 rounded-3xl text-2xl focus:outline-none focus:border-white focus:bg-gray-900 transition-all duration-500 backdrop-blur-md"
            />
          </div>

          <button className="w-full py-8 bg-white text-black text-3xl font-black rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-700 shadow-xl">
            Access Dashboard
          </button>
        </form>

        <p className="text-center mt-12 text-sm opacity-40">
          Restricted Access • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}