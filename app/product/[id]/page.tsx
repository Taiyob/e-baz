'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/src/lib/cartStore';

const product = {
  id: 1,
  name: "Chronos Master",
  price: 12999,
  description: "A timeless masterpiece crafted with precision and elegance. The Chronos Master combines traditional watchmaking with modern innovation.",
  scent: "Woody notes with hints of leather and spice",
  sizes: ["40mm", "42mm", "44mm"],
};

export default function ProductDetails() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    gsap.fromTo(imageRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    const children = detailsRef.current?.children;
    if (children && children.length > 0) {
      gsap.fromTo(children, 
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1.2, stagger: 0.2, delay: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  // Image placeholder খুঁজে নেই (left side-এর image div)
  const imageContainer = document.querySelector('.aspect-square .bg-gray-900') as HTMLElement;

  if (!imageContainer) return;

  // Clone the image container for flying effect
  const clone = imageContainer.cloneNode(true) as HTMLElement;
  clone.classList.add('fixed', 'z-50', 'pointer-events-none', 'rounded-3xl', 'overflow-hidden');
  document.body.appendChild(clone);

  const rect = imageContainer.getBoundingClientRect();
  gsap.set(clone, {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  });

  const basket = document.querySelector('#basket-icon') as HTMLElement;
  if (!basket) return;

  const basketRect = basket.getBoundingClientRect();

  gsap.to(clone, {
    x: basketRect.left + basketRect.width / 2 - rect.width / 2,
    y: basketRect.top + basketRect.height / 2 - rect.height / 2,
    scale: 0.3,
    duration: 1.2,
    ease: "power3.inOut",
    onComplete: () => {
      clone.remove();
      gsap.to(basket, { scale: 1.4, duration: 0.2, yoyo: true, repeat: 1 });

      // Add to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    }
  });
};

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      <div className="px-8 py-8">
        <button className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
          <ArrowLeft size={24} />
          Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div ref={imageRef} className="relative overflow-hidden rounded-3xl aspect-square">
            <div className="h-full bg-gray-900 border border-gray-800 flex items-center justify-center text-9xl opacity-20">
              C
            </div>
          </div>

          <div ref={detailsRef} className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-8xl font-black mb-8">
              {product.name}
            </h1>

            <p className="text-4xl font-bold mb-8">
              ${product.price.toLocaleString()}
            </p>

            <p className="text-xl opacity-80 mb-12 leading-relaxed">
              {product.description}
            </p>

            <p className="text-lg opacity-70 mb-8">
              <span className="font-bold">Notes:</span> {product.scent}
            </p>

            <div className="mb-12">
              <p className="text-lg mb-4">Size</p>
              <div className="flex gap-4">
                {product.sizes.map(size => (
                  <button key={size} className="px-6 py-3 border border-gray-600 rounded-full hover:border-white hover:bg-white hover:text-black transition">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center border border-gray-600 rounded-full">
                <button className="px-6 py-4 hover:bg-gray-900 transition">-</button>
                <span className="px-8 py-4 text-xl">1</span>
                <button className="px-6 py-4 hover:bg-gray-900 transition">+</button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 py-6 text-2xl font-bold bg-white text-black rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500"
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