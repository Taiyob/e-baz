/* eslint-disable prefer-const */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type Category = {
  id: number;
  name: string;
  image: string | null;
};

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটা ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ২. GSAP এনিমেশন এবং ক্লিনআপ (এরর ফিক্স)
  useEffect(() => {
    // ডাটা না আসা পর্যন্ত বা এলিমেন্ট না পাওয়া পর্যন্ত কিছুই করবে না
    if (
      loading ||
      categories.length === 0 ||
      !containerRef.current ||
      !sliderRef.current
    )
      return;

    const container = containerRef.current;
    const slider = sliderRef.current;

    // GSAP Context ব্যবহার করা হয়েছে যাতে ক্লিনআপ নির্ভুল হয়
    let ctx = gsap.context(() => {
      const totalWidth = slider.scrollWidth - container.offsetWidth;

      gsap.to(slider, {
        x: () => -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true, // পিন করার সময় অনেক সময় removeChild এরর আসে
          scrub: 1,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          // refresh করলে যাতে পিন করা এলিমেন্ট হারিয়ে না যায়
          anticipatePin: 1,
        },
      });
    }, containerRef); // Scope ডিফাইন করা হয়েছে

    return () => {
      ctx.revert(); // কম্পোনেন্ট আনমাউন্ট হলে সব এনিমেশন রিমুভ করে দিবে
      ScrollTrigger.getAll().forEach((t) => t.kill()); // সব ট্রিগার কিল করবে
    };
  }, [loading, categories]);

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading Collections...
      </div>
    );

  return (
    <section
      ref={containerRef}
      className="h-screen flex items-center relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />
      <div ref={sliderRef} className="flex gap-8 px-8 w-max relative z-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="product-card w-[450px] h-[550px] bg-gray-900 rounded-[40px] overflow-hidden relative group cursor-pointer"
          >
            <Image
              src={cat.image || "/poster.jpg"}
              alt={cat.name}
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
              <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
