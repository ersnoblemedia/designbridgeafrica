"use client";

import React from "react";

export default function TrusteesSection() {
  return (
    <div id="trustee-organizations" className="space-y-12 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Section Summary & Highlight Stats */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Trusted by global brands and creative startups
          </h2>
          <p className="text-base text-slate-400 leading-relaxed font-semibold">
            Our platform bridges the gap between premium African talent and companies seeking world-class creative solutions.
          </p>

          {/* Key Metrics block */}
          <div className="flex gap-12 pt-6 border-t border-slate-900">
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#8e6fff] block">500+</span>
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 block mt-2">
                COMPLETED JOBS
              </span>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-black text-[#5b4dff] block">98%</span>
              <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 block mt-2">
                CLIENT SATISFACTION
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Stacked Testimonial Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Julianne Meyers */}
          <div className="bg-[#100f24]/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <p className="text-sm sm:text-base text-slate-350 font-medium italic leading-relaxed">
              &ldquo;Finding high-quality design talent used to be a challenge. DesignBridge connected us with Kofi, whose branding work transformed our entire market presence in months.&rdquo;
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 font-extrabold text-xs text-[#8e6fff] flex items-center justify-center select-none font-mono">
                JM
              </div>
              <div>
                <strong className="text-sm font-black text-white block">Julianne Meyers</strong>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mt-0.5">
                  CEO, TechFlow Global
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Marcus Chen */}
          <div className="bg-[#100f24]/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <p className="text-sm sm:text-base text-slate-350 font-medium italic leading-relaxed">
              &ldquo;The level of creativity coming out of Africa is incredible. This platform makes it easy to tap into that potential with zero friction.&rdquo;
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 font-extrabold text-xs text-[#5b4dff] flex items-center justify-center select-none font-mono">
                MC
              </div>
              <div>
                <strong className="text-sm font-black text-white block">Marcus Chen</strong>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mt-0.5">
                  Creative Director, Artic Studio
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
