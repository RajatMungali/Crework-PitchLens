"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images.jpg"
              alt="Crework Labs"
              className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="flex flex-col leading-none">
              <span className="font-grotesk text-2xl font-bold tracking-tight text-black">
                PitchLens
              </span>
              <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                by Crework Labs
              </span>
            </span>
          </Link>

          <a
            href="https://www.creworklabs.com/overnight-cto"
            className="hidden sm:inline-flex items-center rounded-full border-2 border-black bg-black px-6 py-2.5 font-grotesk text-sm font-semibold text-white shadow-comic-sm comic-press"
          >
            Need an MVP built?
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
