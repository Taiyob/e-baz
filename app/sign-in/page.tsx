"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        alert("Invalid Credentials");
      } else {
        router.push("/dashboard");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful! Please Login.");
        setIsLogin(true);
      } else {
        alert(data.error || "Registration failed");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    const children = formRef.current?.children;
    if (children && children.length > 0) {
      gsap.fromTo(
        children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: "power3.out",
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
            className={`px-8 py-3 text-lg font-bold transition ${
              isLogin ? "text-white" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <span className="mx-8 text-gray-600">/</span>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-8 py-3 text-lg font-bold transition ${
              !isLogin ? "text-white" : "text-gray-500"
            }`}
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-6 top-6 text-gray-500" size={24} />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-6 text-gray-500" size={24} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-6 top-6 text-gray-500" size={24} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full pl-16 pr-6 py-6 bg-gray-900 border border-gray-800 rounded-3xl text-xl focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-6 bg-white text-black text-2xl font-bold rounded-full hover:scale-105 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            {!loading && (
              <ArrowRight
                className="group-hover:translate-x-2 transition"
                size={28}
              />
            )}
          </button>

          {isLogin && (
            <p className="text-center text-lg opacity-70">
              Forgot password?{" "}
              <span className="underline hover:text-white cursor-pointer">
                Reset here
              </span>
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
