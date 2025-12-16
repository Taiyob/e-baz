import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="bg-black text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Orders & Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Orders & Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="text-white font-bold mb-6">About</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/story" className="hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-white transition"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Subscribe</h4>
            <p className="text-sm mb-4">
              Get exclusive offers and new arrivals
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="bg-gray-900 px-4 py-3 flex-1 text-white"
              />
              <button className="bg-white text-black px-6 py-3 font-bold">
                Submit
              </button>
            </form>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="text-white font-bold mb-6">Follow Us</h4>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition">
                Instagram
              </Link>
              <Link href="#" className="hover:text-white transition">
                Facebook
              </Link>
              <Link href="#" className="hover:text-white transition">
                Pinterest
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 text-center text-xs border-t border-gray-800 pt-8">
          <p>
            © 2025 LUXE. All rights reserved.{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            •{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </p>
        </div>
      </footer>
      ;
    </>
  );
};

export default Footer;
