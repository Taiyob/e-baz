'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: "Hwyl Eau de Parfum",
    scent: "Cypress, Frankincense, Vetiver",
    size: "1.6 fl oz",
    price: 190,
    badge: "Beloved formulation",
  },
  {
    id: 2,
    name: "Purifying Facial Exfoliant Paste",
    scent: "For dry skin, frequent travellers, shavers, winter and cool climates",
    size: "2.5 oz",
    price: 59,
    badge: "",
  },
  {
    id: 3,
    name: "Eleos Nourishing Body Cleanser",
    scent: "Herbaceous, woody, spicy",
    size: "6.2 oz",
    price: 37,
    badge: "New addition",
  },
];

export default function NewNotable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sliderRef.current?.querySelectorAll('.product-card');

    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { x: "+=300", duration: 0.8, ease: "power3.out" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { x: "-=300", duration: 0.8, ease: "power3.out" });
    }
  };

  return (
    <section ref={containerRef} className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black">New and Notable</h2>
          <p className="mt-6 text-xl opacity-70 max-w-3xl mx-auto">
            A collection of longstanding formulations and recent additions to the range—each likely to make for a memorable gift.
          </p>
        </div>

        {/* Horizontal Slider */}
        <div className="relative">
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
            <ChevronLeft size={32} />
          </button>
          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
            <ChevronRight size={32} />
          </button>

          <div ref={sliderRef} className="flex gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-8 px-8" style={{ scrollBehavior: "smooth" }}>
            {products.map(product => (
              <div key={product.id} className="product-card flex-shrink-0 w-80 group cursor-pointer">
                <div className="relative">
                  {/* Placeholder image - পরে real image দিবে */}
                  <div className="aspect-[3/4] bg-gray-900 rounded-3xl border border-gray-800 flex items-center justify-center text-6xl opacity-20">
                    {product.name[0]}
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-4 py-1 bg-white/10 text-sm rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-3xl font-black">{product.name}</h3>
                  <p className="mt-4 text-lg opacity-70">{product.scent}</p>

                  <div className="mt-8 flex items-center justify-center gap-4">
                    <select className="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
                      <option>{product.size}</option>
                    </select>
                    <p className="text-2xl font-bold">${product.price}.00</p>
                  </div>

                  <button className="mt-8 px-12 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}