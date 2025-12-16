"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;

    if (!container || !slider) return;

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
      },
    });

    // Card hover animation
    const cards = slider.querySelectorAll(".product-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.05, duration: 0.6, ease: "power3.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.6, ease: "power3.out" });
      });
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-screen flex items-center relative overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black" />

      <div ref={sliderRef} className="flex gap-8 px-8 w-max">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="product-card w-80 h-96 bg-gray-800 rounded-3xl overflow-hidden relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-black text-white">
                Product {i + 1}
              </h3>
              <p className="text-xl text-gray-300 mt-2">$999</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-2xl font-light opacity-70">
        Scroll to explore
      </div>
    </section>
  );
}
