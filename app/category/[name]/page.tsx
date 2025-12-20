/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gsap } from "gsap";

gsap.registerPlugin();

// Skeleton Product Card (exact match with your design)
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
    <div ref={cardRef} className="group">
      <div className="relative aspect-4/5 rounded-[40px] overflow-hidden bg-gray-900/50 border border-white/5 mb-6">
        {/* Image placeholder with shimmer */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      {/* Title placeholder */}
      <div className="h-10 w-3/4 bg-gray-800 rounded mb-2" />
      {/* Price placeholder */}
      <div className="h-6 w-24 bg-gray-800 rounded" />
    </div>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.name);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const filtered = data.filter(
          (p: any) => p.category.name === categoryName
        );
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-8 md:px-16">
      <Link
        href="/"
        className="flex items-center gap-2 mb-12 hover:opacity-50 transition uppercase tracking-widest font-bold"
      >
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <header className="mb-24 text-center">
        <h1 className="text-8xl md:text-[150px] font-black italic tracking-tighter uppercase leading-none">
          {categoryName}
        </h1>
        <p className="mt-8 text-xl opacity-50 uppercase tracking-[0.5em]">
          Exclusive Collection
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading
            ? // 6 ta skeleton card (tumar grid er moto)
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))
            : products.map((product) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group"
                >
                  <div className="relative aspect-4/5 rounded-[40px] overflow-hidden bg-gray-900 border border-white/5 mb-6">
                    <Image
                      src={product.images?.[0] || "/poster.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold opacity-60">
                    ${product.price}
                  </p>
                </Link>
              ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-20 opacity-20 text-2xl italic">
            No pieces found in this collection yet.
          </div>
        )}
      </div>
    </div>
  );
}
