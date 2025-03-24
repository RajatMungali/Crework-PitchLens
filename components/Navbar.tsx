'use client';

import { motion } from 'framer-motion';
import { PresentationIcon } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <PresentationIcon className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">CreworkAI</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/result" className="text-gray-600 hover:text-purple-600 transition-colors">
                Analyze Your Deck
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;