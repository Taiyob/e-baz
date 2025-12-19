/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  images: string[];
  category: {
    name: string;
  };
};

// Skeleton for Sidebar Category Item
function SkeletonCategoryItem() {
  return <div className="h-8 w-32 bg-gray-800 rounded animate-pulse" />;
}

// Skeleton for Product Card (exact match with your design)
function SkeletonProductCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0.6,
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div ref={cardRef} className="product-card group block">
      <div className="relative overflow-hidden rounded-[40px] aspect-[4/5] bg-gray-900/50 border border-white/5">
        {/* Image placeholder with shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-40" />
      </div>

      <div className="mt-8 space-y-4">
        {/* Title & Price */}
        <div className="flex justify-between items-start">
          <div className="h-8 w-2/3 bg-gray-800 rounded" />
          <div className="h-8 w-20 bg-gray-800 rounded" />
        </div>
        {/* Category */}
        <div className="h-4 w-24 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/products"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category.name === selectedCategory);

  useEffect(() => {
    if (loading) return;

    const cards = gridRef.current?.querySelectorAll(".product-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [filteredProducts, loading]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="py-32 text-center">
        <h1 className="text-8xl md:text-[180px] font-black tracking-tighter italic uppercase leading-none">
          All Gazats
        </h1>
        <p className="mt-8 text-xl opacity-50 font-light tracking-widest uppercase">
          Timeless pieces crafted with precision
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar Filter - Skeleton */}
          <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 self-start">
            <h3 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-white/30 border-b border-white/10 pb-4">
              Collections
            </h3>
            <ul className="flex md:flex-col gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {loading ? (
                // Sidebar skeleton: 1 "All" + 5 categories
                <>
                  <SkeletonCategoryItem />
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCategoryItem key={i} />
                  ))}
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`text-lg uppercase tracking-wider transition-all duration-300 ${
                        selectedCategory === "All"
                          ? "text-white font-black pl-4 border-l-2 border-white"
                          : "text-gray-600 hover:text-white"
                      }`}
                    >
                      All Pieces
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat?.id}>
                      <button
                        onClick={() => setSelectedCategory(cat?.name)}
                        className={`text-lg uppercase tracking-wider transition-all duration-300 ${
                          selectedCategory === cat?.name
                            ? "text-white font-black pl-4 border-l-2 border-white"
                            : "text-gray-600 hover:text-white"
                        }`}
                      >
                        {cat?.name}
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </aside>

          {/* Product Grid - Skeleton */}
          <div ref={gridRef} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {loading
                ? // 6 ta product skeleton (tumar grid er moto)
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonProductCard key={i} />
                  ))
                : filteredProducts.map((product) => (
                    <Link
                      href={`/product/${product.id}`}
                      key={product?.id}
                      className="product-card group block"
                    >
                      <div className="relative overflow-hidden rounded-[40px] aspect-[4/5] bg-gray-900 border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-40 group-hover:opacity-10 transition-opacity duration-700" />
                        <Image
                          src={product?.images[0] || "/poster.jpg"}
                          alt={product?.name}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <button className="w-full cursor-pointer py-4 bg-white text-black font-black uppercase tracking-widest rounded-full scale-90 group-hover:scale-100 transition-transform duration-500">
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                            {product?.name}
                          </h3>
                          <p className="text-xl font-bold opacity-80">
                            ${product?.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] opacity-30 font-bold">
                          {product?.category?.name}
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="h-64 flex items-center justify-center text-2xl opacity-20 italic">
                No items found in this collection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
