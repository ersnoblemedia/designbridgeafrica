"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MapPin, Star, Sparkles, FolderOpen, Heart, Mail, CheckCircle, Quote, Sparkle, ArrowLeft } from "lucide-react";
import { Designer } from "../types";

interface DesignerDetailsModalProps {
  designer: Designer | null;
  onClose: () => void;
  onContact: (d: Designer) => void;
}

export default function DesignerDetailsModal({
  designer,
  onClose,
  onContact,
}: DesignerDetailsModalProps) {
  const [favoriteState, setFavoriteState] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  if (!designer) return null;

  // Curated list of high-quality abstract design artworks to populate 6 gorgeous bento-style cards matching the second screenshot mockup
  const getBentoArtworks = (designerId: string) => {
    switch (designerId) {
      case "abebe": // 3D Modeling Focus
        return [
          { title: "Eco-Lalibela Pavilion Render", tag: "3D Architecture", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" },
          { title: "Symmetrical Earth Clay Vessels", tag: "Clay Sculptures", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" },
          { title: "Modernist Archways & Shadows", tag: "3D Environment", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80" },
          { title: "Retro African Cyberpunk Room", tag: "Interior Design", src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80" },
          { title: "Geometric Monumental Pillars", tag: "Sci-Fi Render", src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80" },
          { title: "Organic Terracotta Study", tag: "Abstract Art", src: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500&q=80" },
        ];
      case "fatima": // UI/UX Systems Focus
        return [
          { title: "Dakar Mobile Banking Dashboard", tag: "UI/UX App", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" },
          { title: "Neomorphic Crypto Trading Hub", tag: "Design Systems", src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80" },
          { title: "Sleek Pastel Creative Portfolio App", tag: "Web App", src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&q=80" },
          { title: "Empathetic Healthcare Telemedicine", tag: "Wireframe Design", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80" },
          { title: "E-Learning Hub Interface Guideline", tag: "Design System", src: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80" },
          { title: "African Artisan Marketplace Checkout", tag: "E-Commerce Screen", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" },
        ];
      case "kofi": // Packaging and branding focus
        return [
          { title: "Asante Chocolate Luxury Box", tag: "Foil Packaging", src: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80" },
          { title: "Ananse Botanical Craft Gin Wrap", tag: "Dielines & Labels", src: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500&q=80" },
          { title: "Earthy Clay Coffee Cup Holders", tag: "Eco Packaging", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" },
          { title: "Minimalist Wood Stationery Box", tag: "Branded Merch", src: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80" },
          { title: "Cosmetics Pure Organic Tubes Set", tag: "Vector Mockup", src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80" },
          { title: "Savannah Tea Loose Leaves Wrap", tag: "Artistic Canister", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" },
        ];
      default:
        return [
          { title: "Modernist Minimalist Grid Study", tag: "Branding", src: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80" },
          { title: "Eco-Conscious Brand Identity System", tag: "Mockups", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" },
          { title: "Abstract Visual Packaging Layout", tag: "Packaging", src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80" },
          { title: "Fashion Branding Portrait Series", tag: "Graphic Art", src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80" },
          { title: "Digital Interface Mobile Dashboard", tag: "UI/UX Layout", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" },
          { title: "Earthy Clay Pottery Geometry Renders", tag: "3D Assets", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80" },
        ];
    }
  };

  const artworks = getBentoArtworks(designer.id);

  // Creative testimonials reviews list to match Kind Words in second screenshot mockup
  const testimonials = [
    { author: "Kofi Mensah", role: "CEO, BioSavannah", text: `"${designer.name} delivered an exceptionally clean visual identity system. Collaboration was seamless from design briefs to final handoff."` },
    { author: "Sarah Jenkins", role: "Creative Dir, Velo Global", text: `"A brilliant creative mind with extreme focus, outstanding work ethic, and spectacular cultural awareness!"` },
    { author: "Tunde Adeyemi", role: "Founder, FintechLagos", text: `"Absolute masterpiece results. Understood our complex fintech parameters instantly. Highly recommended partner!"` }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d0c1d] overflow-y-auto overflow-x-hidden animate-fadeIn">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5b4dff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-violet-605/5 blur-[140px] pointer-events-none" />

      {/* STICKY TOP MODAL HEADER CONTROL BAR */}
      <header className="sticky top-0 z-50 bg-[#0d0c1d]/95 backdrop-blur-md border-b border-slate-900/80 px-4 sm:px-6 md:px-8 lg:px-12 py-3.5 flex items-center justify-between w-full max-w-[1550px] mx-auto rounded-b-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="group flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black transition-all cursor-pointer bg-slate-950/80 border border-slate-900 hover:border-[#5b4dff]/40 px-4 py-2.5 rounded-xl shadow-lg relative"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#8e6fff]" />
            <span>Return to Discover</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4 h-8 animate-fadeIn">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#5b4dff]/30">
              <Image 
                src={designer.avatar} 
                alt={designer.name} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-black text-white block leading-none">{designer.name}</span>
              <span className="text-[10px] text-[#8e6fff] font-bold block">{designer.title || "Top Rated Creator"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onContact(designer)}
            className="hidden xs:flex bg-[#5b4dff]/15 hover:bg-[#5b4dff] text-white hover:text-white text-[11px] font-black px-4 py-2.5 rounded-xl shadow border border-[#5b4dff]/30 transition-all hover:scale-[1.01] items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Hire {designer.name.split(" ")[0]}</span>
          </button>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-850 hover:border-red-500/40 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow"
            title="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="w-full min-h-screen bg-[#0d0c1d] relative pb-28 max-w-[1550px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-6">
        
        <div className="w-full bg-[#0b0a1a] border border-slate-905 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* CLOSE CONTROL ACTION BUTTON */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-slate-950/80 border border-slate-800 hover:border-[#5b4dff]/40 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer scale-100 hover:scale-105 active:scale-95 shadow"
          >
            <X className="w-5 h-5" />
          </button>

        {/* FEATURE BANNER ACCENTS HERO */}
        <div className="h-64 relative bg-slate-950">
          <Image 
            src={designer.featuredProjectImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"} 
            alt="Feature decorative backdrop banner" 
            fill
            className="object-cover opacity-35 filter saturate-50 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a1a] via-[#0b0a1a]/40 to-transparent" />
          <div className="absolute bottom-6 left-8 z-10 hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono font-black tracking-widest uppercase bg-[#5b4dff]/25 text-purple-200 px-3 py-1 rounded-full border border-[#8e6fff]/30 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkle className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              Verified Top Rated Artist
            </span>
            <span className="text-[10px] font-mono font-black tracking-widest uppercase bg-slate-950/70 text-slate-300 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 backdrop-blur-md">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Identity Vetted NGA-45902
            </span>
          </div>
        </div>

        {/* PRIMARY INFO SECTION LAYER */}
        <div className="p-6 sm:p-10 -mt-20 relative z-20 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Profile Image with Ring border */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[#0b0a1a] shadow-2xl bg-slate-900 shrink-0">
                <Image 
                  src={designer.avatar} 
                  alt={designer.name} 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="pb-1 space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                    {designer.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-slate-400">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#5b4dff]" />
                    {designer.city}, {designer.country}
                  </span>
                  <span className="text-slate-700 font-bold">&bull;</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-450 fill-yellow-450" />
                    <span className="text-white text-sm font-black">{designer.rating} / 5</span>
                    <span className="text-xs text-slate-500 font-bold">({designer.completedJobs} Reviews)</span>
                  </div>
                </div>

                {/* Creative specialized skills tags row */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {designer.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950 text-[#9d8aff] border border-[#5b4dff]/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium action triggers on the right */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setFavoriteState(!favoriteState)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  favoriteState 
                    ? "bg-red-500/10 border-red-500/50 text-red-500" 
                    : "border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-950"
                }`}
                title="Bookmark designer"
              >
                <Heart className={`w-5 h-5 ${favoriteState ? "fill-red-500" : ""}`} />
              </button>

              <button 
                onClick={() => {
                  setCopiedContact(true);
                  setTimeout(() => setCopiedContact(false), 2000);
                }}
                className="p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#0d0c1d] text-slate-450 hover:text-white transition-all cursor-pointer relative"
                title="Copy direct mail handle"
              >
                <Mail className="w-5 h-5" />
                {copiedContact && (
                  <div className="absolute bottom-14 left-1/2 -translate-y-1 -translate-x-1/2 bg-black text-white text-[10px] font-black px-2 py-1 rounded shadow animate-fadeIn whitespace-nowrap">
                    Mail copied!
                  </div>
                )}
              </button>

              <button 
                onClick={() => onContact(designer)}
                className="bg-[#5b4dff] hover:bg-[#7140ff] text-white text-xs font-black px-6 py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-bounce" />
                <span>Hire Now</span>
              </button>
            </div>
          </div>

          {/* THREE STAT INDICATORS ROW BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0f0e22] border border-slate-900 p-5 rounded-2xl space-y-1 shadow-sm text-center sm:text-left">
              <span className="text-[10px] uppercase font-mono font-black text-slate-500 block tracking-wider">COMPLETED CONTRACTS</span>
              <strong className="text-2xl sm:text-3xl font-black text-white block">
                {designer.completedJobs * 2 || 124}
              </strong>
              <span className="text-[10px] text-emerald-400 font-bold block">100% On-Time Delivery</span>
            </div>
            
            <div className="bg-[#0f0e22] border border-slate-900 p-5 rounded-2xl space-y-1 shadow-sm text-center sm:text-left">
              <span className="text-[10px] uppercase font-mono font-black text-slate-500 block tracking-wider">EXPERIENCE SPECTRUM</span>
              <strong className="text-2xl sm:text-3xl font-black text-white block">
                {designer.experienceYears || 8}+ Years
              </strong>
              <span className="text-[10px] text-slate-550 font-bold block">Senior Level Expertise</span>
            </div>

            <div className="bg-[#0f0e22] border border-slate-900 p-5 rounded-2xl space-y-1 shadow-sm text-center sm:text-left">
              <span className="text-[10px] uppercase font-mono font-black text-slate-500 block tracking-wider">AVERAGE RESPONSE</span>
              <strong className="text-2xl sm:text-3xl font-black text-slate-350 block">
                &lt; 2 hours
              </strong>
              <span className="text-[10px] text-[#8e6fff] font-bold block">Highly responsive designer</span>
            </div>
          </div>

          {/* SPLIT COLUMN LAYOUT GRID (8 Columns Left / 4 Columns Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            
            {/* LEFT 8-COLUMN MAIN WRITTEN DETAILS & BENTO WORKGRID */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* About description text */}
              <div className="space-y-3.5">
                <div className="border-l-4 border-[#5b4dff] pl-3">
                  <h3 className="text-md uppercase font-black text-white tracking-widest font-mono">
                    About {designer.name.split(" ")[0]}
                  </h3>
                </div>
                <p className="text-sm sm:text-md text-slate-300 leading-relaxed font-semibold">
                  {designer.bio || "Crafting premium layouts with clean typography, cultural empathy and visual-oriented focus. Dedicated to delivering absolute masterworks."}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Over the past decade, I have collaborated with various fast-growing teams, seed agencies, and established retail companies to design and engineer design systems, box layouts, packaging wrappers, and tactile products centered around pristine brand narratives and exceptional modern visual rhythms.
                </p>
              </div>

              {/* Six Bento-styled selected works grid matching second screenshot mockup exactly */}
              <div className="space-y-4 pt-2">
                <div className="border-l-4 border-[#5b4dff] pl-3">
                  <h3 className="text-md uppercase font-black text-white tracking-widest font-mono flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#8e6fff]" />
                    Selected Works Portfolio
                  </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {artworks.map((art, aIdx) => (
                    <div 
                      key={aIdx} 
                      className="group relative rounded-2xl overflow-hidden aspect-square bg-[#080718] border border-slate-900 shadow hover:border-slate-700 transition-all duration-300 cursor-pointer"
                    >
                      <Image 
                        src={art.src} 
                        alt={art.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />
                      <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                        <span className="text-[8px] font-mono uppercase bg-[#5b4dff]/20 text-[#a08aff] border border-[#5b4dff]/40 px-2 py-0.5 rounded-full inline-block font-black leading-none">
                          {art.tag}
                        </span>
                        <strong className="text-[10px] md:text-xs text-white block truncate leading-tight font-sans tracking-tight">
                          {art.title}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section matching screenshots testimonials quotes */}
              <div className="space-y-5 pt-3">
                <div className="border-l-4 border-[#5b4dff] pl-3">
                  <h3 className="text-md uppercase font-black text-white tracking-widest font-mono">
                    Kind Words From Clients
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((test, tIdx) => (
                    <div key={tIdx} className="bg-slate-950/40 border border-slate-930 p-4.5 rounded-2xl space-y-3 shadow-inner relative">
                      <Quote className="w-5 h-5 text-[#8e6fff]/30 absolute top-3 right-3" />
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold italic">
                        {test.text}
                      </p>
                      <div className="pt-2 border-t border-slate-900 leading-none">
                        <strong className="text-xs text-white block truncate">{test.author}</strong>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-1 font-mono">{test.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT 4-COLUMN CRITICAL INTEL PANEL */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Creative philosophy checklist matching screens exactly */}
              <div className="bg-[#0f0e22] border border-slate-900 p-6 rounded-3xl space-y-4 shadow-sm">
                <strong className="text-xs uppercase font-mono tracking-widest text-[#8e6fff] block border-b border-slate-900 pb-3">
                  CREATIVE PHILOSOPHY
                </strong>
                
                <div className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-sans text-[8px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="text-white block">Design with cultural empathy</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                        Anchoring modern digital solutions in local heritage, typography patterns, and community-aware graphic context.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-sans text-[8px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="text-white block">Simplicity is sophistication</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                        Removing secondary noise to focus entirely on pristine visual hierarchy, generous space, and pixel precision.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-sans text-[8px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="text-white block">Purpose-driven visual layouts</span>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                        Building functional aesthetics that empower usability, conversion systems, and memorable brand recognition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Stack details card */}
              <div className="bg-[#0f0e22] border border-slate-900 p-6 rounded-3xl space-y-3 shadow-sm">
                <strong className="text-xs uppercase font-mono tracking-widest text-white block border-b border-slate-900 pb-3">
                  HARDWARE &amp; STACK LABS
                </strong>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                  <span className="bg-slate-950 border border-slate-900 px-2 py-1 rounded">Figma Professional</span>
                  <span className="bg-slate-950 border border-slate-900 px-2 py-1 rounded">MacBook Pro M3 Max</span>
                  <span className="bg-slate-950 border border-slate-900 px-2 py-1 rounded">Blender 4.2 Cycles</span>
                  <span className="bg-slate-950 border border-slate-900 px-2 py-1 rounded">Adobe CC Suite</span>
                  <span className="bg-slate-950 border border-slate-900 px-2 py-1 rounded">Wacom Intuos Pro</span>
                </div>
              </div>

            </div>

          </div>

          {/* FULL-WIDTH BOTTOM INDIGO GRADIENT BANNER REDIRECT CTA */}
          <div className="bg-gradient-to-r from-[#171444] via-[#0e0c24] to-[#121035] border border-[#5b4dff]/30 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-60 h-60 bg-[#5b4dff]/5 rounded-full blur-[70px] pointer-events-none" />
            <div className="relative z-10 max-w-xl space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Ready to elevate your brand?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Collaborate with {designer.name} to build a visual work layout that stands out and drives results. Use our secure milestone registry to safeguard all payments.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
              <button 
                onClick={() => onContact(designer)}
                className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg tracking-tight hover:scale-[1.01]"
              >
                Start a Project
              </button>
              <button 
                onClick={() => onContact(designer)}
                className="bg-transparent border border-white/20 hover:border-white text-white font-bold text-xs px-5 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Book a Consultation
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
    </div>
  );
}
