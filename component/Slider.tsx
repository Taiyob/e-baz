/* eslint-disable prefer-const */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type Category = {
  id: number;
  name: string;
  image: string | null;
};

// --- Skeleton Component ---
const SliderSkeleton = () => (
  <div className="h-screen flex items-center bg-black overflow-hidden px-8">
    <div className="flex gap-8 w-max">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="w-[450px] h-[550px] bg-gray-900/50 rounded-[40px] relative overflow-hidden animate-pulse border border-white/5"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

          <div className="absolute bottom-12 left-12 space-y-4">
            <div className="h-8 w-48 bg-gray-800 rounded-lg" />
            <div className="h-4 w-32 bg-gray-800/50 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (
      loading ||
      categories.length === 0 ||
      !containerRef.current ||
      !sliderRef.current
    )
      return;

    const container = containerRef.current;
    const slider = sliderRef.current;

    let ctx = gsap.context(() => {
      const totalWidth = slider.scrollWidth - container.offsetWidth;

      gsap.to(slider, {
        x: () => -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading, categories]);

  if (loading) return <SliderSkeleton />;

  return (
    <section
      ref={containerRef}
      className="h-screen flex items-center relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />
      <div ref={sliderRef} className="flex gap-8 px-8 w-max relative z-10">
        {categories.map((cat) => (
          <Link
            href={`/category/${encodeURIComponent(cat.name)}`}
            key={cat?.id}
            className="product-card w-[450px] h-[550px] bg-gray-900 rounded-[40px] overflow-hidden relative group cursor-pointer"
          >
            <Image
              src={cat?.image || "/poster.jpg"}
              alt={cat?.name}
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
              <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">
                {cat?.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
