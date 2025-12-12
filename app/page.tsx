'use client';


import HeaderOption2 from '@/src/components/Header';
import HeaderOption1 from '@/src/components/Header';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    // SplitText Animation
    if (heroTitleRef.current) {
      const split = new SplitText(heroTitleRef.current, { type: "chars,words" });
      gsap.from(split.chars, {
        duration: 1.2,
        y: 200,
        rotationX: -90,
        opacity: 0,
        stagger: 0.04,
        ease: "back.out(1.7)",
      });
    }

    // Tagline
    gsap.fromTo("p.font-light", {
      opacity: 0,
      y: 50
    }, {
      opacity: 0.8,
      y: 0,
      duration: 1.5,
      delay: 1.2,
      ease: "power3.out"
    });

    // Button
    gsap.fromTo("button", {
      opacity: 0,
      y: 80
    }, {
      opacity: 1,
      y: 0,
      duration: 1.8,
      delay: 1.5,
      ease: "back.out(1.4)"
    });

    // Scroll indicator pulse
    gsap.to(".animate-bounce", {
      y: 12,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Custom Cursor
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.7,
          ease: "power3.out"
        });
      }
    };
    window.addEventListener("mousemove", moveCursor);

    // Parallax
    gsap.utils.toArray(".parallax").forEach((el: any) => {
      gsap.to(el, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      {/* <HeaderOption1 /> */}
      <HeaderOption2 />
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-10 h-10 bg-white rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block -translate-x-1/2 -translate-y-1/2"
      />

      <div className="bg-black text-white min-h-screen">
        {/* Hero */}

        <section className="h-screen relative overflow-hidden flex items-center justify-center">
          {/* Desktop Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/poster.jpg"
            className="absolute inset-0 w-full h-full object-cover -z-10"
          >
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Mobile Fallback Image (video hide থাকলে দেখাবে) */}
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/poster.jpg')" }}  // same poster image
          />

          {/* Dark overlay (text যাতে readable হয়) */}
          <div className="absolute inset-0 bg-black/50 -z-10" />

          {/* Content on top */}
          <div className="relative z-10 text-center px-8">
            <h1
              ref={heroTitleRef}
              className="text-8xl md:text-[200px] font-black leading-none tracking-tighter text-white"
            >
              LUXE
            </h1>

            <p className="text-3xl md:text-5xl mt-8 font-light opacity-80 text-white">
              Minimal • Timeless • Yours
            </p>

            <button className="mt-16 px-20 py-6 text-2xl font-bold border-4 border-white hover:bg-white hover:text-black transition-all duration-500 rounded-full">
              Shop Now
            </button>
          </div>

          {/* Subtle scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </section>

        {/* <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
              <div className="relative z-10 text-center px-8">
              <h1 ref={heroTitleRef} className="text-8xl md:text-[200px] font-black leading-none tracking-tighter">
                LUXE
              </h1>

              <p className="text-2xl md:text-4xl mt-12 font-light tracking-wide opacity-80">
                Minimal • Timeless • Yours
              </p>

              <button className="mt-20 px-20 py-6 text-xl md:text-2xl font-medium border-2 border-white rounded-full hover:bg-white hover:text-black hover:shadow-2xl hover:shadow-white/20 transition-all duration-700 relative overflow-hidden group">
                <span className="relative z-10">Shop Now</span>
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
                </div>
              </div>
            </div>
        </section> */}

        {/* Featured Products */}
        <section className="py-40">
          <h2 className="text-center text-8xl md:text-9xl font-black opacity-10 mb-32">
            FEATURED
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl aspect-square bg-gray-900 border border-gray-800">
                  <div className="parallax absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                  <div className="absolute bottom-8 left-8 translate-y-32 group-hover:translate-y-0 transition-transform duration-700">
                    <h3 className="text-5xl font-black">Product {i}</h3>
                    <p className="text-3xl mt-4 opacity-70">$999</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Big Text */}
        <section className="h-screen flex items-center justify-center">
          <h2 className="parallax text-9xl md:text-[300px] font-black leading-none text-center opacity-5">
            CRAFTED<br />WITH<br />PRECISION
          </h2>
        </section>

        {/* CTA */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-8xl md:text-9xl font-black mb-16">
              Ready to<br />Elevate?
            </h2>
            <button className="px-24 py-8 text-4xl font-bold bg-white text-black rounded-full hover:scale-110 transition-all duration-500 shadow-2xl">
              Start Shopping
            </button>
          </div>
        </section>
      </div>
    </>
  );
}