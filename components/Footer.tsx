"use client";

import React from "react";
import { Sparkles, Globe, Mail, Share2, Instagram, Twitter, Linkedin, Facebook, ArrowRight, MessageSquare } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: any) => void;
  setCategoryFilter: (cat: string) => void;
  onOpenSupportPage?: (pageId: string) => void;
}

export default function Footer({ setActiveTab, setCategoryFilter, onOpenSupportPage }: FooterProps) {
  const handleCategoryClick = (cat: string) => {
    setCategoryFilter(cat);
    setActiveTab("designers");
  };

  return (
    <div className="space-y-16 mt-20">
      
      {/* 1. GORGEOUS BLUE/VIOLET ACTION BANNER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-650 to-indigo-500 bg-[#5b4dff] p-12 md:p-16 text-center space-y-6 shadow-2xl">
          {/* Decorative glowing backdrops */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/25 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Ready to bridge your brand with African excellence?
          </h2>
          <p className="text-sm md:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed font-semibold">
            Join the DesignBridge Africa community today and start collaborating with the continent&apos;s top 1% creative talent.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 relative z-10">
            <button 
              onClick={() => { setActiveTab("designers"); }}
              className="group bg-white hover:bg-[#f6f5ff] text-[#5b4dff] text-sm md:text-base font-black px-8 py-3.5 rounded-full shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-[#5b4dff]/20 transition-all duration-350 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-350 group-hover:translate-x-1 text-[#5b4dff]" />
            </button>
            <button 
              onClick={() => { setActiveTab("messaging"); }}
              className="group bg-indigo-650/40 hover:bg-indigo-600/60 border border-white/20 hover:border-white/40 text-white text-sm md:text-base font-black px-8 py-3.5 rounded-full shadow-lg transition-all duration-350 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200 group-hover:text-white transition-colors duration-350" />
              <span>Talk to Sales</span>
            </button>
          </div>
        </div>
      </div>

      <footer id="global-footer" className="border-t border-slate-900 bg-[#070613]/98 pt-16 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 text-left w-full">
          
          {/* Logo & Intro column */}
          <div id="footer-logo-pane" className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                className="h-8 w-auto object-contain" 
                alt="DesignBridge Africa Logo" 
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Connecting the world to Africa&apos;s premier design talent through a curated, high-impact marketplace.
            </p>
            <div className="space-y-3 pt-2">
              <span className="text-xs uppercase font-black tracking-widest text-[#8e6fff] block">Follow Us</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a 
                  href="https://instagram.com/designbridgeafrica" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#111026] border border-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5b4dff]/20 hover:border-[#5b4dff]/40 transition-all"
                  aria-label="Instagram"
                  title="@designbridgeafrica on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com/designbridge_af" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#111026] border border-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5b4dff]/20 hover:border-[#5b4dff]/40 transition-all"
                  aria-label="Twitter"
                  title="@designbridgeafrica on Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com/company/designbridgeafrica" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#111026] border border-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5b4dff]/20 hover:border-[#5b4dff]/40 transition-all"
                  aria-label="LinkedIn"
                  title="DesignBridge Africa on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://facebook.com/designbridgeafrica" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#111026] border border-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5b4dff]/20 hover:border-[#5b4dff]/40 transition-all"
                  aria-label="Facebook"
                  title="DesignBridge Africa on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
              <span className="text-xs font-mono font-bold tracking-tight text-slate-400 block">@designbridgeafrica</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-black tracking-widest text-[#8e6fff]">Product</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button onClick={() => setActiveTab("designers")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Browse Designers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("jobs")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Browse Active Briefs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("services")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Browse Services
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("help")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Pricing & Escrow Rates
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-black tracking-widest text-[#8e6fff]">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button onClick={() => onOpenSupportPage?.("about")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("careers")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("blog")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Insights & Blog
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("contact")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-black tracking-widest text-[#8e6fff]">Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button onClick={() => onOpenSupportPage?.("community")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Creative Community
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("help")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Help Center / FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("guidelines")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Code Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("api-docs")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  API Docs & Sandbox
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-black tracking-widest text-[#8e6fff]">Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button onClick={() => onOpenSupportPage?.("privacy")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("terms")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenSupportPage?.("cookie")} className="hover:text-white transition-colors cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                  Cookie Strategy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div id="footer-bottom-bar" className="max-w-[1600px] mx-auto px-6 pt-12 mt-12 border-t border-slate-905/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 w-full">
          <span>© {new Date().getFullYear()} DesignBridge Africa. All rights reserved.</span>
          <span>English (US)</span>
        </div>
      </footer>

    </div>
  );
}
