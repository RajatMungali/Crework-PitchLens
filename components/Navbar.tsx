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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/images.jpg"
              alt="Crework Labs"
              className="h-12 w-12 rounded-lg object-contain"
            />
            <span className="font-grotesk text-lg tracking-tight text-black">
              <span className="font-bold">CREWORK</span>{" "}
              <span className="font-medium text-neutral-500">DECK REVIEW</span>
            </span>
          </Link>

          <a
            href="#analyze"
            className="hidden sm:inline-flex items-center rounded-full border-2 border-black bg-black px-5 py-2 font-grotesk text-sm font-semibold text-white shadow-comic-sm comic-press"
          >
            Analyze a deck
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
