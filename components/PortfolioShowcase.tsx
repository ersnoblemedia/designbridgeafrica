"use client";
 
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Sparkles } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { resilientDB } from "../lib/supabase";

interface Artwork {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  image: string;
}

const ARTWORKS: Artwork[] = [
  {
    id: "editorial-mockup",
    title: "CREATIVE BRAND MOCKUP",
    subtitle: "SERENE BRAND SERVICING",
    category: "Minimalist Editorial",
    description: "Empowering high-end regional labels with physical book packaging and visual brand narratives.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "spiral-sculpture",
    title: "Symmetrical Spiral",
    category: "3D Art & Architecture",
    description: "Architectural structure artwork inspired by structural elegance and golden spirals.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dark-interface",
    title: "Aesthetic Dark Interface",
    category: "UI/UX Design",
    description: "Dark mode interface tablet layout screen simulation.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "afrofuturistic-flora",
    title: "Afrofuturistic Flora",
    category: "Illustration Portfolio",
    description: "Warm earth tone botanical concepts optimized for luxury package integration layouts.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80"
  }
];
 
export default function PortfolioShowcase() {
  const { user, profile } = useAuth();
  const [filter, setFilter] = useState<"all" | "saved">("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const syncToDatabase = useCallback(async (ids: string[]) => {
    if (!user) return;
    try {
      await resilientDB.upsert("users", {
        uid: user.uid,
        savedPortfolios: ids,
        updatedAt: new Date().toISOString()
      }, "uid");
    } catch (e) {
      console.error("Error updating saved portfolios in database: ", e);
    }
  }, [user]);

  // Load and sync saved portfolios
  useEffect(() => {
    const localSaved = localStorage.getItem("savedPortfolios");
    let localIds: string[] = [];
    if (localSaved) {
      try {
        localIds = JSON.parse(localSaved);
      } catch (e) {
        console.error("Failed to parse local saved portfolios", e);
      }
    }

    if (profile?.savedPortfolios) {
      // Merge unique local IDs with Firestore IDs
      const merged = Array.from(new Set([...localIds, ...profile.savedPortfolios]));
      setSavedIds(merged);
      
      // Update local storage to stay in sync
      localStorage.setItem("savedPortfolios", JSON.stringify(merged));

      // Sync back to Database if the merged collection is larger than what was in database
      if (merged.length > profile.savedPortfolios.length) {
        syncToDatabase(merged);
      }
    } else {
      setSavedIds(localIds);
    }
  }, [profile, syncToDatabase]);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let updatedIds: string[];
    if (savedIds.includes(id)) {
      updatedIds = savedIds.filter(savedId => savedId !== id);
    } else {
      updatedIds = [...savedIds, id];
    }

    setSavedIds(updatedIds);
    localStorage.setItem("savedPortfolios", JSON.stringify(updatedIds));

    if (user) {
      await syncToDatabase(updatedIds);
    }
  };

  const savedArtworks = ARTWORKS.filter(artwork => savedIds.includes(artwork.id));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15
      }
    }
  };

  return (
    <div id="creative-galleries" className="space-y-8 pb-12">
      
      {/* Structural header block */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-4 pb-2"
      >
        <span className="text-xs font-mono font-black uppercase tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3.5 py-1.5 rounded-full border border-[#8e6fff]/20">
          Curated Talents Showcase
        </span>
        <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Portfolio Showcase</h2>
        <p className="text-base text-slate-400 font-medium">
          Witness the creative pulse of the continent. From minimalist logos to complex digital ecosystems.
        </p>

        {/* Dynamic Filter Tab Header */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <button 
            onClick={() => setFilter("all")} 
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              filter === "all"
                ? "bg-[#5b4dff] text-white border-[#5b4dff] shadow-lg shadow-[#5b4dff]/25"
                : "bg-[#111026] text-slate-400 border-slate-900 hover:text-white"
            }`}
          >
            All Masterpieces
          </button>
          <button 
            onClick={() => setFilter("saved")} 
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              filter === "saved"
                ? "bg-[#5b4dff] text-white border-[#5b4dff] shadow-lg shadow-[#5b4dff]/25"
                : "bg-[#111026] text-slate-400 border-slate-900 hover:text-white"
            }`}
          >
            Saved Collection
            {savedIds.length > 0 && (
              <span className="bg-[#1e1a4f] text-[#8e6fff] text-[10px] px-2 py-0.5 rounded-full font-extrabold flex items-center justify-center font-mono">
                {savedIds.length}
              </span>
            )}
          </button>
        </div>
      </motion.div>
 
      {/* Dynamic Content Views */}
      <AnimatePresence mode="wait">
        {filter === "all" ? (
          <motion.div 
            key="all-projects-collage"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left Side: Long Vertical Card (Book & Pencil Mockup) */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-slate-900 bg-[#121124] group shadow-2xl min-h-[480px] sm:min-h-[550px] flex flex-col justify-between"
            >
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80" 
                  alt="Brand Mockup Book Artwork" 
                  fill
                  className="object-cover transition-transform group-hover:scale-102 duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              </div>
     
              {/* Book text overlay matching the mock layout in reference image */}
              <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs uppercase tracking-widest font-black text-[#8e6fff]">Minimalist Editorial</span>
                  <button
                    onClick={(e) => handleToggleSave("editorial-mockup", e)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus:outline-none ${
                      savedIds.includes("editorial-mockup")
                        ? "bg-[#5b4dff] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/30 scale-105"
                        : "bg-[#0c0b1e]/80 border-slate-800 text-slate-400 hover:text-white hover:bg-[#151336]"
                    }`}
                    title={savedIds.includes("editorial-mockup") ? "Unsave Project" : "Save Project"}
                  >
                    <Bookmark className={`w-4 h-4 ${savedIds.includes("editorial-mockup") ? "fill-current" : ""}`} />
                  </button>
                </div>
                
                <div className="space-y-4 max-w-sm">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest block font-mono">SERENE BRAND SERVICING</span>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase select-none drop-shadow-sm font-sans mix-blend-difference">
                    CREATIVE <br />BRAND <br />MOCKUP
                  </h3>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    Empowering high-end regional labels with physical book packaging and visual brand narratives.
                  </p>
                </div>
              </div>
            </motion.div>
     
            {/* Right Side: Bento Nest Grid (2x1 top row, full width bottom row) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Top Row: Two Squares side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Square 1: Gold/Sand Spiral Structure artwork */}
                <motion.div 
                  variants={itemVariants}
                  className="aspect-square relative rounded-3xl overflow-hidden border border-slate-900 bg-[#0c0b1a] group shadow-xl"
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80" 
                    alt="Golden spiral sculpture" 
                    fill
                    className="object-cover transition-transform group-hover:scale-103 duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1d] via-transparent to-transparent opacity-70" />
                  
                  {/* Floating save button */}
                  <button
                    onClick={(e) => handleToggleSave("spiral-sculpture", e)}
                    className={`absolute top-4 right-4 z-20 p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus:outline-none ${
                      savedIds.includes("spiral-sculpture")
                        ? "bg-[#5b4dff] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/30 scale-105"
                        : "bg-[#060514]/90 border-slate-900 text-slate-400 hover:text-white hover:bg-[#110f2c]"
                    }`}
                    title={savedIds.includes("spiral-sculpture") ? "Unsave Project" : "Save Project"}
                  >
                    <Bookmark className={`w-4 h-4 ${savedIds.includes("spiral-sculpture") ? "fill-current" : ""}`} />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] uppercase font-bold text-[#8e6fff] tracking-widest block mb-1">3D Art &amp; Architecture</span>
                    <strong className="text-sm font-black text-white block">Symmetrical Spiral</strong>
                  </div>
                </motion.div>
     
                {/* Square 2: Dark Mode interface tablet mockup */}
                <motion.div 
                  variants={itemVariants}
                  className="aspect-square relative rounded-3xl overflow-hidden border border-slate-900 bg-[#0c0b1a] group shadow-xl"
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" 
                    alt="Dark mode screen layout" 
                    fill
                    className="object-cover transition-transform group-hover:scale-103 duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1d] via-transparent to-transparent opacity-70" />
                  
                  {/* Floating save button */}
                  <button
                    onClick={(e) => handleToggleSave("dark-interface", e)}
                    className={`absolute top-4 right-4 z-20 p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus:outline-none ${
                      savedIds.includes("dark-interface")
                        ? "bg-[#5b4dff] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/30 scale-105"
                        : "bg-[#060514]/90 border-slate-900 text-slate-400 hover:text-white hover:bg-[#110f2c]"
                    }`}
                    title={savedIds.includes("dark-interface") ? "Unsave Project" : "Save Project"}
                  >
                    <Bookmark className={`w-4 h-4 ${savedIds.includes("dark-interface") ? "fill-current" : ""}`} />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] uppercase font-bold text-[#8e6fff] tracking-widest block mb-1">UI/UX Design</span>
                    <strong className="text-sm font-black text-white block">Aesthetic Dark Interface</strong>
                  </div>
                </motion.div>
     
              </div>
     
              {/* Bottom Row: Large Horizontal banner card (Green leaf vectors / botanical illustrations) */}
              <motion.div 
                variants={itemVariants}
                className="flex-1 relative rounded-3xl overflow-hidden border border-slate-900 bg-[#101915] group shadow-xl min-h-[220px] flex flex-col justify-between p-8"
              >
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80" 
                    alt="Botanical Leaf Art" 
                    fill
                    className="object-cover transition-transform group-hover:scale-102 duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />
                </div>

                {/* Floating save button top-right */}
                <div className="w-full flex justify-end z-10 relative">
                  <button
                    onClick={(e) => handleToggleSave("afrofuturistic-flora", e)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus:outline-none ${
                       savedIds.includes("afrofuturistic-flora")
                         ? "bg-[#5b4dff] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/30 scale-105"
                         : "bg-[#060514]/80 border-slate-800 text-slate-400 hover:text-white hover:bg-[#110f2c]"
                     }`}
                     title={savedIds.includes("afrofuturistic-flora") ? "Unsave Project" : "Save Project"}
                  >
                    <Bookmark className={`w-4 h-4 ${savedIds.includes("afrofuturistic-flora") ? "fill-current" : ""}`} />
                  </button>
                </div>
     
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8e6fff] tracking-widest block mb-1">Illustration Portfolio</span>
                  <strong className="text-lg font-black text-white block">Afrofuturistic Flora</strong>
                  <p className="text-xs text-slate-300 font-semibold max-w-sm mt-1">
                    Warm earth tone botanical concepts optimized for luxury package integration layouts.
                  </p>
                </div>
              </motion.div>
     
            </div>
     
          </motion.div>
        ) : (
          <motion.div 
            key="saved-projects-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {savedArtworks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center border border-dashed border-slate-800/80 rounded-3xl bg-[#0f0e24]/40"
              >
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 mx-auto mb-4">
                  <Bookmark className="w-5 h-5 text-slate-500" />
                </div>
                <span className="text-sm font-black text-white block">Discovery gallery is empty</span>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Pin your favorite creative masterpieces by hitting the bookmark badges inside the showcase. They will appear here for immediate access.
                </p>
                <button 
                  onClick={() => setFilter("all")}
                  className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14122d] hover:bg-[#1b193d] border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8e6fff]" />
                  Browse All Work
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArtworks.map((artwork) => (
                  <motion.div
                    key={artwork.id}
                    layoutId={`saved-card-${artwork.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-3xl overflow-hidden border border-slate-900 bg-[#121124] group shadow-2xl h-[340px] flex flex-col justify-end p-6"
                  >
                    <div className="absolute inset-0 z-0">
                      <Image 
                        src={artwork.image} 
                        alt={artwork.title} 
                        fill
                        className="object-cover transition-transform group-hover:scale-102 duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                    </div>
  
                    {/* Absolute top save button wrapper */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => handleToggleSave(artwork.id, e)}
                        className="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center focus:outline-none bg-[#5b4dff] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/30 scale-105"
                        title="Unsave Project"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
  
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8e6fff] tracking-widest block font-mono">
                        {artwork.category}
                      </span>
                      <strong className="text-base font-black text-white block leading-tight text-left">
                        {artwork.title}
                      </strong>
                      {artwork.subtitle && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block text-left">
                          {artwork.subtitle}
                        </span>
                      )}
                      <p className="text-xs text-slate-400 leading-relaxed pt-1.5 font-medium line-clamp-2 text-left">
                        {artwork.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
  
    </div>
  );
}
