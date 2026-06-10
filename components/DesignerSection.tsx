"use client";
 
import React from "react";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { DESIGNERS } from "../lib/data";
import { Designer } from "../types";
 
interface DesignerSectionProps {
  setSelectedDesigner: (d: Designer) => void;
  setActiveTab: (tab: "home" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
}
 
export default function DesignerSection({ setSelectedDesigner, setActiveTab }: DesignerSectionProps) {
  // Let's create beautiful static mock portfolio items to match the layout in the image precisely
  const designerThumbnails: Record<string, string[]> = {
    abebe: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80", // circle vector sculpture
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80", // stationery mockup
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"  // modern geometric arches render
    ],
    fatima: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80", // interface system
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Fatima&backgroundColor=ffdfbf",             // avatar illustrated art
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&auto=format&fit=crop&q=80"  // mobile mockup device
    ],
    kofi: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=300&auto=format&fit=crop&q=80", // luxury gold foil packaging boxes
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80", // amber drop glass bottle
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&auto=format&fit=crop&q=80"  // luxury packaging box
    ]
  };
 
  const getCustomLabels = (id: string) => {
    if (id === "abebe") return ["Logo Design", "Branding", "48 reviews"];
    if (id === "fatima") return ["UI/UX", "Illustration", "132 reviews"];
    return ["Packaging", "Visual Identity", "95 reviews"];
  };
 
  const getCleanNameAndCity = (id: string, defName: string, defCity: string) => {
    if (id === "abebe") return { name: "Abebe Selassie", city: "Addis Ababa, Ethiopia" };
    if (id === "fatima") return { name: "Fatima Kone", city: "Dakar, Senegal" };
    return { name: "Kofi Mensah", city: "Accra, Ghana" };
  };
 
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Available Now":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Available This Week":
        return "text-[#8e6fff] bg-[#8e6fff]/10 border-[#8e6fff]/20";
      case "Limited Availability":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Busy":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/25";
    }
  };

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

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 65,
        damping: 14
      }
    }
  };
 
  return (
    <div id="vetted-designers-strip" className="space-y-8">
      
      {/* Title block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-900 pb-4"
      >
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Featured Designers</h2>
          <p className="text-slate-400 max-w-sm text-sm font-medium mt-1">
            The most vetted and highly-rated talent this month.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab("designers")}
          className="text-base font-black text-[#8e6fff] hover:text-[#a08aff] transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
        >
          View all designers <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
 
      {/* Grid of 3 designers */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {DESIGNERS.map((designer) => {
          const labels = getCustomLabels(designer.id);
          const meta = getCleanNameAndCity(designer.id, designer.name, designer.city);
          const thumbnails = designerThumbnails[designer.id] || [];
 
          return (
            <motion.div 
              key={designer.id}
              variants={cardVariants}
              onClick={() => setSelectedDesigner(designer)}
              className="group relative bg-[#100f24] border border-slate-900/80 hover:border-[#5b4dff]/40 rounded-3xl p-6 transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Profile Header Block */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Image 
                      src={designer.avatar} 
                      alt={designer.name} 
                      width={56}
                      height={56}
                      className="rounded-full border-2 border-slate-800 object-cover bg-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-lg font-black text-white block group-hover:text-[#8e6fff] transition-colors leading-tight">
                        {meta.name}
                      </span>
                      <span className="text-xs text-slate-505 block mt-0.5">
                        {meta.city}
                      </span>
                    </div>
                  </div>
 
                  {/* Elegant availability status badge */}
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${getStatusStyle(designer.availability)}`}>
                    {designer.availability}
                  </span>
                </div>
 
                {/* Tags labels row */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs font-bold px-3 py-1 rounded bg-[#1a1738] text-[#8e6fff] border border-[#8e6fff]/10">
                    {labels[0]}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded bg-[#1a1738] text-[#8e6fff] border border-[#8e6fff]/10">
                    {labels[1]}
                  </span>
                </div>
 
                {/* Rating review block */}
                <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-slate-300">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>5.0</span>
                  <span className="text-slate-500">({labels[2]})</span>
                </div>
              </div>
 
              {/* Row of three portfolio view frames */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-905/40">
                {thumbnails.map((thumbUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-850 relative">
                    <Image 
                      src={thumbUrl} 
                      alt="portfolio thumbnail preview" 
                      fill
                      className="object-cover transition-transform group-hover:scale-102 duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
 
            </motion.div>
          );
        })}
      </motion.div>
 
    </div>
  );
}
