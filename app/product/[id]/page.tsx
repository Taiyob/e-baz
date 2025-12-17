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
  images: ["/product1-1.jpg", "/product1-2.jpg", "/product1-3.jpg"], 
};

export default function ProductDetails() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const children = detailsRef.current?.children;
  const { addItem } = useCart();
  

  useEffect(() => {
    gsap.fromTo(imageRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    if (children && children.length > 0) {
    gsap.fromTo(children, 
        { opacity: 0, x: 100 },
        { 
        opacity: 1, 
        x: 0, 
        duration: 1.2, 
        stagger: 0.2, 
        delay: 0.5,
        ease: "power3.out" 
        }
    );
    }
  }, []);

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
      const button = e.currentTarget;
      const img = button.closest('.group')?.querySelector('.absolute.inset-0 div') || button;

      const clone = img.cloneNode(true) as HTMLElement;
      clone.classList.add('fixed', 'z-50', 'pointer-events-none');
      document.body.appendChild(clone);

      const rect = img.getBoundingClientRect();
      gsap.set(clone, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      const basket = document.querySelector('#basket-icon'); 
      const basketRect = basket?.getBoundingClientRect();

      gsap.to(clone, {
        x: basketRect?.left || 0,
        y: basketRect?.top || 0,
        scale: 0.3,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          clone.remove();
          addItem(product);
        }
      });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* Back button */}
      <div className="px-8 py-8">
        <button className="flex items-center gap-2 text-lg hover:text-gray-400 transition">
          <ArrowLeft size={24} />
          Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div ref={imageRef} className="relative overflow-hidden rounded-3xl aspect-square">
            <div className="h-full bg-gray-900 border border-gray-800 flex items-center justify-center text-9xl opacity-20">
              C
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-8">
              <p className="text-xl">Hover to zoom</p>
            </div>
          </div>

          {/* Product Details */}
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

            {/* Size Selector */}
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

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-8">
              <div className="flex items-center border border-gray-600 rounded-full">
                <button className="px-6 py-4 hover:bg-gray-900 transition">-</button>
                <span className="px-8 py-4 text-xl">1</span>
                <button className="px-6 py-4 hover:bg-gray-900 transition">+</button>
              </div>

              <button onClick={handleAddToCart} className="flex-1 py-6 text-2xl font-bold bg-white text-black rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500">
                Add to Basket
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32">
          <h2 className="text-6xl font-black text-center mb-16 opacity-70">
            Related Pieces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square bg-gray-900 rounded-3xl border border-gray-800 flex items-center justify-center text-6xl opacity-20">
                  R
                </div>
                <h3 className="mt-6 text-2xl font-bold text-center">Related {i}</h3>
                <p className="text-xl text-center mt-2 opacity-70">$9999</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}