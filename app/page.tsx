/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Footer from "@/component/Footer";
import NewNotable from "@/component/NewNotable";
import Slider from "@/component/Slider";
import HeaderOption2 from "@/src/components/Header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Featured Products এর জন্য স্টেট
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    // ১. সবচেয়ে দামি ৩টি প্রোডাক্ট ফেচ করা
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          // দাম অনুযায়ী বড় থেকে ছোট (Descending order) সর্ট করে প্রথম ৩টি নেওয়া
          const top3 = data
            .sort((a: any, b: any) => b.price - a.price)
            .slice(0, 3);
          setFeaturedProducts(top3);
        }
      } catch (error) {
        console.error("Featured fetch error:", error);
      }
    };
    fetchFeatured();

    // Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Animations (SplitText, Hero, Parallax ইত্যাদি আপনার আগের কোড অনুযায়ী থাকবে...)
    if (heroTitleRef.current) {
      const split = new SplitText(heroTitleRef.current, {
        type: "chars,words",
      });
      gsap.from(split.chars, {
        duration: 1.2,
        y: 200,
        rotationX: -90,
        opacity: 0,
        stagger: 0.04,
        ease: "back.out(1.7)",
      });
    }

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.7,
          ease: "power3.out",
        });
      }
    };
    window.addEventListener("mousemove", moveCursor);

    // Parallax Effect
    gsap.utils.toArray(".parallax").forEach((el: any) => {
      gsap.to(el, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <HeaderOption2 />
      <div
        ref={cursorRef}
        className="fixed w-10 h-10 bg-white rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block -translate-x-1/2 -translate-y-1/2"
      />

      <div className="bg-black text-white min-h-screen">

        <section className="h-screen relative overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-8">
            <h1
              ref={heroTitleRef}
              className="text-8xl md:text-[200px] font-black leading-none tracking-tighter"
            >
              LUXE
            </h1>
            <p className="text-3xl md:text-5xl mt-8 font-light opacity-80">
              Minimal • Timeless • Yours
            </p>
            <button className="mt-16 px-20 py-6 text-2xl font-bold border-4 border-white hover:bg-white hover:text-black transition-all duration-500 rounded-full">
              Shop Now
            </button>
          </div>
        </section>

        <Slider />

        {/* Dynamic Featured Products Section */}
        <section className="py-40">
          <h2 className="text-center text-8xl md:text-9xl font-black opacity-10 mb-32">
            FEATURED
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-[40px] aspect-square bg-gray-900 border border-white/5">
                    {/* Product Image */}
                    <Image
                      src={product.images[0] || "/poster.jpg"}
                      alt={product.name}
                      fill
                      className="parallax object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-10 left-10 translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
                      <p className="text-white/50 text-sm tracking-widest uppercase mb-2">
                        Luxury Tier
                      </p>
                      <h3 className="text-5xl font-black italic tracking-tighter uppercase">
                        {product.name}
                      </h3>
                      <p className="text-3xl mt-4 font-bold text-white">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center opacity-20 text-2xl italic">
                Loading Featured Masterpieces...
              </div>
            )}
          </div>
        </section>

        <NewNotable />

        {/* Crafted with Precision & Footer */}
        <section className="h-screen relative flex items-center justify-center overflow-hidden">
          {/* Banner Background */}
          <Image
            src="https://png.pngtree.com/thumb_back/fw800/background/20251015/pngtree-luxury-watch-with-silver-case-on-black-marble-image_19852132.webp" 
            alt="Luxury Banner"
            fill
            className="object-cover opacity-30" // opacity 20-40% 
            priority
          />

          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/40" />

          <h2 className="parallax absolute inset-0 flex items-center justify-center text-9xl md:text-[300px] font-black leading-none text-center opacity-5 pointer-events-none">
            CRAFTED
            <br />
            WITH
            <br />
            PRECISION
          </h2>
          <div className="relative z-10 text-center px-8">
            <h2 className="text-8xl md:text-9xl font-black mb-16">
              Ready to
              <br />
              Elevate?
            </h2>
            <button className="px-24 py-8 text-4xl font-bold bg-white text-black rounded-full hover:scale-110 transition-all duration-500 shadow-2xl">
              Start Shopping
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
