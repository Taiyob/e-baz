/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/src/lib/cartStore";
import { useSession } from "next-auth/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  images: string[];
  category: {
    name: string;
  };
};

export default function NewNotable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading || products.length === 0) return;

    const cards = sliderRef.current?.querySelectorAll(".product-card");
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
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
          },
        }
      );
    }
  }, [loading, products]);

  const handleQuickAdd = async (product: any) => {
    if (!session) return (window.location.href = "/sign-in");

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      },
      session.user.id
    );

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="py-32 bg-black text-center text-white italic opacity-50">
        Loading Latest Arrivals...
      </div>
    );

  return (
    <section
      ref={containerRef}
      className="py-32 bg-black text-white overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter">
            New and Notable
          </h2>
          <p className="mt-6 text-xl opacity-60 max-w-3xl mx-auto font-light">
            A collection of longstanding formulations and recent additions to
            the range—each likely to make for a memorable gift.
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/3 -translate-y-1/2 z-20 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition opacity-0 group-hover:opacity-100 shadow-2xl"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/3 -translate-y-1/2 z-20 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition opacity-0 group-hover:opacity-100 shadow-2xl"
          >
            <ChevronRight size={40} />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-12"
          >
            {products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="product-card flex-shrink-0 w-80 md:w-96 group cursor-pointer snap-start"
              >
                <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-gray-900 border border-white/5">
                  {/* Product Image */}
                  <Image
                    src={product.images[0] || "/poster.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  />

                  {/* Category Badge */}
                  <span className="absolute top-6 left-6 px-5 py-2 bg-black/50 backdrop-blur-md text-xs font-bold rounded-full border border-white/10 uppercase tracking-widest">
                    {product.category.name}
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                <div className="mt-10 space-y-4">
                  <h3 className="text-3xl font-black group-hover:text-gray-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg opacity-50 line-clamp-2 font-light leading-relaxed">
                    {product.description ||
                      "No description available for this formulation."}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <p className="text-2xl font-black">
                      ${product.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="px-8 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
