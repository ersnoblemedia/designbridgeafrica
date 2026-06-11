"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

const disciplines = [
  "Creative Talent",
  "UI/UX Designers",
  "Brand Architects",
  "3D Illustrators",
  "Visual Innovators"
];

interface HeroSectionProps {
  setActiveTab: (tab: "home" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
  setOnboardingStep: (step: number) => void;
}

export default function HeroSection({ setActiveTab, setOnboardingStep }: HeroSectionProps) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % disciplines.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchCreativeZone = () => {
    if (!user) {
      setOnboardingStep(1); // Fast track choosing simulated role or sign-in invitation
    } else {
      setActiveTab("designers");
    }
  };

  return (
    <section id="hero-showcase" className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
      
      {/* Lights background */}
      <div className="absolute top-[-40px] right-[20%] w-[350px] h-[350px] rounded-full bg-[#5b4dff]/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20px] left-[10%] w-[250px] h-[250px] rounded-full bg-violet-500/15 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column Text details */}
        <div id="hero-left-col" className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-[#0f0e22]/95 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-[#8e6fff] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#9c82ff]">
              NOW LIVE: THE 2026 DESIGN TALENT REPORT
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] lg:leading-[1.12] tracking-tight">
            <span>Africa&apos;s Premium </span>
            <span className="inline-block text-[#8e6fff] relative whitespace-nowrap">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 15, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -15, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-[#8e6fff] via-[#ae9eff] to-[#5b4dff] bg-clip-text text-transparent inline-block py-1 pl-1 pr-4 whitespace-nowrap"
                >
                  {disciplines[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="block min-[480px]:inline-block min-[480px]:ml-2"> Marketplace</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-405 leading-relaxed max-w-2xl font-medium">
            Discover vetted African creatives through immaculate, verified portfolios. By prioritizing rich artistic discovery and AI matching over saturated job boards, we foster high-margin client trust and swift direct-hiring paths.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={handleLaunchCreativeZone}
              className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-sm sm:text-base font-black px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#5b4dff]/25 hover:scale-[1.01] cursor-pointer"
            >
              Hire a Designer
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab("jobs")}
              className="bg-[#1a183d] border border-slate-800/80 hover:border-[#5b4dff]/40 hover:bg-[#16143c] text-white text-sm sm:text-base font-bold px-8 py-4 rounded-full transition-all cursor-pointer"
            >
              Find Work
            </button>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-slate-905/60 max-w-lg">
            <div className="flex -space-x-3">
              <Image 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="user avatar 1" 
                width={40}
                height={40}
                className="rounded-full border-2 border-[#0d0c1d] object-cover bg-slate-900" 
                referrerPolicy="no-referrer"
              />
              <Image 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                alt="user avatar 2" 
                width={40}
                height={40}
                className="rounded-full border-2 border-[#0d0c1d] object-cover bg-slate-900" 
                referrerPolicy="no-referrer"
              />
              <Image 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                alt="user avatar 3" 
                width={40}
                height={40}
                className="rounded-full border-2 border-[#0d0c1d] object-cover bg-slate-900" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-sm text-slate-400 font-semibold leading-none">
              Joined by 2,000+ top-tier creatives across Africa
            </span>
          </div>
        </div>

        {/* Right Column Design Assets Collage (A perfect 2x2 grid representing luxury artwork) */}
        <div id="hero-right-col" className="lg:col-span-12 xl:col-span-5 relative mt-8 lg:mt-0">
          <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-md mx-auto">
            
            {/* Card 1: Top Left - Wooden stationery mockups */}
            <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-[#0d0c1d] shadow-2xl transition-transform hover:scale-[1.02] duration-300 relative">
              <Image 
                src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80" 
                alt="Luxury design mockup 1" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 2: Top Right - Organic design waveforms */}
            <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-[#0d0c1d] shadow-2xl transition-transform hover:scale-[1.02] duration-300 relative">
              <Image 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80" 
                alt="Luxury design mockup 2" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 3: Bottom Left - Smartphone mockup */}
            <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-[#0d0c1d] shadow-2xl transition-transform hover:scale-[1.02] duration-300 relative">
              <Image 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80" 
                alt="Luxury design mockup 3" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 4: Bottom Right - Modern book layouts */}
            <div className="aspect-square rounded-3xl overflow-hidden border border-[#1e1d30]/60 bg-[#0d0c1d] shadow-2xl transition-transform hover:scale-[1.02] duration-300 relative">
              <Image 
                src="https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=80" 
                alt="Luxury design mockup 4" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
