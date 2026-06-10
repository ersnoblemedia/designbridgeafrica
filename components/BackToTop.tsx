"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="back-to-top-btn"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.1, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          type="button"
          aria-label="Back to top"
          className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 md:right-8 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-[#0a081e]/90 hover:bg-[#5b4dff] text-[#c7d2fe] hover:text-white border border-[#5b4dff]/40 hover:border-transparent backdrop-blur-md shadow-lg shadow-[#5b4dff]/10 hover:shadow-[#5b4dff]/30 transition-colors duration-300 focus:outline-none pointer-events-auto cursor-pointer group"
        >
          <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
