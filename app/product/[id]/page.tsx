/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState, use } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/src/lib/cartStore";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: { name: string };
};

// Skeleton for Product Details Page
function ProductSkeleton() {
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0.6,
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    if (detailsRef.current) {
      const children = detailsRef.current.children;
      gsap.to(children, {
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.1,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="px-8 py-8">
        <div className="flex items-center gap-2 text-lg uppercase tracking-widest font-bold opacity-50">
          <ArrowLeft size={24} /> Back to Shop
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Skeleton Image */}
          <div
            ref={imageRef}
            className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-900/50 border border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Skeleton Details */}
          <div ref={detailsRef} className="flex flex-col space-y-8">
            <div className="h-6 w-32 bg-gray-800 rounded" />
            <div className="h-16 w-3/4 bg-gray-800 rounded" />
            <div className="h-12 w-48 bg-gray-800 rounded" />
            <div className="space-y-4">
              <div className="h-8 w-full bg-gray-800 rounded" />
              <div className="h-8 w-full bg-gray-800 rounded" />
              <div className="h-8 w-3/4 bg-gray-800 rounded" />
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center border border-white/20 rounded-full p-2 bg-white/5">
                <div className="w-12 h-12 bg-gray-800 rounded-full" />
                <div className="w-12 h-12 bg-gray-800 rounded-full mx-2" />
                <div className="w-12 h-12 bg-gray-800 rounded-full" />
              </div>
              <div className="flex-1 min-w-[200px] py-6 bg-gray-800 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) setProduct(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!loading && product) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
      );

      const children = detailsRef.current?.children;
      if (children) {
        gsap.fromTo(
          children,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1, stagger: 0.1, ease: "power3.out" }
        );
      }
    }
  }, [loading, product]);

  const handleAddToCart = () => {
    if (!product) return;

    const imageContainer = imageRef.current;
    const basket = document.querySelector("#basket-icon") as HTMLElement;

    if (imageContainer && basket) {
      const clone = imageContainer.cloneNode(true) as HTMLElement;
      const rect = imageContainer.getBoundingClientRect();
      const basketRect = basket.getBoundingClientRect();

      Object.assign(clone.style, {
        position: "fixed",
        zIndex: "100",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: "none",
      });

      document.body.appendChild(clone);

      gsap.to(clone, {
        x: basketRect.left - rect.left,
        y: basketRect.top - rect.top,
        scale: 0.1,
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          clone.remove();
          gsap.to(basket, { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1 });

          for (let i = 0; i < quantity; i++) {
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
            });
          }
        },
      });
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="px-8 py-8">
        <Link
          href="/shop"
          className="flex items-center gap-2 text-lg hover:opacity-50 transition uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={24} /> Back to Shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Product Image */}
          <div
            ref={imageRef}
            className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-900 border border-white/5"
          >
            <Image
              src={product.images[0] || "/poster.jpg"}
              alt={product.name}
              fill
              className="object-cover opacity-80"
            />
          </div>

          {/* Product Details */}
          <div ref={detailsRef} className="flex flex-col">
            <p className="text-white/40 uppercase tracking-[0.3em] font-bold mb-4">
              {product.category.name}
            </p>
            <h1 className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter leading-none">
              {product.name}
            </h1>

            <p className="text-4xl font-bold mb-10 text-white/90">
              ${product.price.toLocaleString()}
            </p>

            <p className="text-xl opacity-60 mb-12 leading-relaxed font-light max-w-xl">
              {product.description ||
                "A timeless creation designed for those who appreciate the finer things in life. Each piece tells a story of craftsmanship."}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center border border-white/20 rounded-full p-2 bg-white/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black rounded-full transition"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center text-2xl font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black rounded-full transition"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] py-6 text-2xl font-black bg-white text-black rounded-full hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] uppercase tracking-widest"
              >
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
