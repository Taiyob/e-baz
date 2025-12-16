"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  "All",
  "Watches",
  "Jewelry",
  "Accessories",
  "Limited Edition",
];

const products = [
  { id: 1, name: "Chronos Master", price: 12999, category: "Watches" },
  { id: 2, name: "Eternal Ring", price: 8999, category: "Jewelry" },
  { id: 3, name: "Signature Leather", price: 5499, category: "Accessories" },
  { id: 4, name: "Phantom Edition", price: 24999, category: "Limited Edition" },
  { id: 5, name: "Luxe Chronograph", price: 15999, category: "Watches" },
  { id: 6, name: "Diamond Eternity", price: 18999, category: "Jewelry" },
  { id: 7, name: "Minimal Wallet", price: 3999, category: "Accessories" },
  { id: 8, name: "Shadow Limited", price: 29999, category: "Limited Edition" },
  { id: 9, name: "Chronos Master Pro", price: 17999, category: "Watches" },
  { id: 10, name: "Eternal Diamond", price: 22999, category: "Jewelry" },
  // আরও যোগ করো
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".product-card");

    if (!cards) return;

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // card screen এর 85% এ আসলে animate হবে
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="py-24 text-center">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter">
          Shop All
        </h1>
        <p className="mt-8 text-xl opacity-70">
          Timeless pieces crafted with precision
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex gap-16">
          {/* Sidebar Filter */}
          <aside className="w-64 flex-shrink-0 hidden md:block sticky top-32 self-start">
            <h3 className="text-2xl font-bold mb-8">Categories</h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-lg block w-full text-left hover:text-white transition ${
                      selectedCategory === cat
                        ? "text-white font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Product Grid */}
          <div ref={gridRef} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-3xl aspect-square bg-gray-900 border border-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 font-black">
                      {product.name[0]}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-32 group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-4xl font-black">{product.name}</h3>
                      <p className="text-2xl mt-4 opacity-80">
                        ${product.price.toLocaleString()}
                      </p>
                      <button className="mt-6 px-8 py-3 text-sm font-bold border border-white rounded-full hover:bg-white hover:text-black transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
