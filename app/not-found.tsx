"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import { 
  Sparkles, 
  Home, 
  Compass, 
  Palette, 
  Users, 
  LifeBuoy, 
  Lock, 
  Mail, 
  Linkedin, 
  Facebook,
  Wrench,
  Globe,
  Menu,
  X,
  FileText
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Helper redirect triggers
  const handleNavigate = (tabId: string) => {
    router.push(`/?tab=${tabId}`);
  };

  return (
    <div id="not-found-layer" className="min-h-screen bg-[#0d0c1d] relative text-slate-300 pb-16 pt-0 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Absolute Decorative Glowing Accents */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5b4dff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[140px] pointer-events-none" />

      {/* 1. NAVIGATION HEADER PANEL */}
      <nav id="navbar-notfound" className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#0d0c1d]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between w-full">
          
          {/* Logo */}
          <button 
            onClick={() => router.push("/")} 
            className="flex items-center text-left cursor-pointer bg-transparent border-none p-0 focus:outline-none group"
          >
            <img 
              src="/logo.png" 
              className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-102" 
              alt="DesignBridge Africa Logo" 
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Nav Menus - desktop navigation that redirects to home page with specified tabs */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest font-bold text-slate-400">
            <button 
              onClick={() => handleNavigate("home")} 
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Gallery
            </button>
            <button 
              onClick={() => handleNavigate("designers")} 
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Designers
            </button>
            <button 
              onClick={() => handleNavigate("about")} 
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigate("contact")} 
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Contact
            </button>
          </div>

          {/* Authentic CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => router.push("/login")}
              className="text-white hover:text-slate-200 text-xs font-black px-6 py-3 rounded-full cursor-pointer transition-colors bg-transparent border-none"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push("/login")}
              className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-[1.02] cursor-pointer border-none"
            >
              Join Now
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl border border-slate-800 bg-[#0f0e22] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center h-10 w-10 focus:outline-none"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* Mobile menu dropdown drawer */}
        {showMobileMenu && (
          <div className="lg:hidden w-full bg-[#0d0c1d] border-t border-slate-800 px-4 py-4 space-y-3.5 shadow-2xl text-slate-300 text-sm font-bold font-sans">
            <button 
              onClick={() => { handleNavigate("home"); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-900/60 block"
            >
              Gallery
            </button>
            <button 
              onClick={() => { handleNavigate("designers"); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-900/60 block"
            >
              Designers
            </button>
            <button 
              onClick={() => { handleNavigate("about"); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-900/60 block"
            >
              About
            </button>
            <button 
              onClick={() => { handleNavigate("contact"); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-900/60 block"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-4">
              <button 
                onClick={() => router.push("/login")}
                className="flex-1 text-center py-2.5 rounded-xl border border-slate-800 font-bold text-xs"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push("/login")}
                className="flex-1 text-center py-2.5 rounded-xl bg-[#5b4dff] text-white font-bold text-xs"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. CHIC MAIN DISPLAY BODY */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-10 sm:pt-16 pb-16 w-full relative z-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Lobe Column: Text and CTA action triggers */}
          <div className="lg:col-span-7 space-y-8 relative">
            
            {/* Pulsating system alert state badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800/80 bg-[#0f0e22] text-[10px] font-mono uppercase tracking-widest text-[#8e6fff] font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
              Connection Interrupted
            </div>

            {/* Glowing 404 watermark behind header text */}
            <div className="relative">
              <div className="absolute -top-16 -left-4 text-[130px] sm:text-[180px] md:text-[250px] font-black text-slate-800/10 tracking-tight leading-none pointer-events-none select-none font-sans">
                404
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none relative z-10 font-sans">
                Lost in the <br />
                <span className="bg-gradient-to-r from-[#8e6fff] to-[#5b4dff] bg-clip-text text-transparent">
                  Creative Pulse?
                </span>
              </h1>
            </div>

            {/* Sub-text summary block */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-semibold max-w-xl">
              The bridge you&apos;re looking for doesn&apos;t exist or has been moved to a new destination. Even the best designers lose their way sometimes. Let&apos;s get you back to the main stage.
            </p>

            {/* Premium actionable anchors */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.push("/")}
                className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs sm:text-sm font-black px-8 py-4 rounded-xl shadow-lg shadow-[#5b4dff]/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              
              <button
                onClick={() => handleNavigate("designers")}
                className="bg-[#18153b]/80 hover:bg-[#201d4a] border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Designers</span>
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic circular orbits, 3D Mock Preview screen with glassmorphic overlay */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-8 sm:py-12">
            
            {/* Ambient Back Glow */}
            <div className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Outer dotted orbit ring */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-dashed border-slate-800/40 animate-[spin_100s_linear_infinite]" />

            {/* Middle thin ring */}
            <div className="absolute w-56 h-56 rounded-full border border-slate-800/60" />

            {/* Inner indigo pulsing ring */}
            <div className="absolute w-40 h-40 rounded-full border border-indigo-500/10 animate-pulse" />

            {/* 3D Angled Screen Container with real isometric CSS styles */}
            <div 
              className="relative transition-transform duration-700 hover:scale-[1.03]"
              style={{ 
                perspective: "1000px",
              }}
            >
              <div 
                className="w-44 h-60 sm:w-52 sm:h-72 rounded-2xl bg-[#0f0e22]/90 border border-slate-800 shadow-2xl p-4 overflow-hidden relative flex flex-col justify-between"
                style={{ 
                  transform: "rotateY(-15deg) rotateX(12deg) rotateZ(-2deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Simulated Grid backdrop details inside screen */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:14px_14px]" />
                
                {/* Screen Header mock */}
                <div className="flex items-center justify-between relative z-10 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div className="w-12 h-1.5 rounded-full bg-slate-800" />
                </div>

                {/* Main graphic model mock inside card */}
                <div className="flex-grow flex flex-col justify-center space-y-3 relative z-10 pt-4 px-1">
                  
                  {/* Visual mountain peaks outline */}
                  <div className="w-full h-16 rounded-lg bg-slate-900/60 border border-slate-800/40 relative overflow-hidden flex items-end">
                    <div className="w-full h-2/3 bg-[#5b4dff]/5 relative">
                      {/* Stylized custom drawing lines */}
                      <svg className="w-full h-full text-slate-800" viewBox="0 0 100 40" fill="none">
                        <path d="M0 40 L30 15 L50 28 L80 8 L100 40 Z" fill="rgba(91, 77, 255, 0.08)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>

                  {/* Horizontal visual element slots */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded bg-slate-800" />
                    <div className="w-5/6 h-2 rounded bg-slate-800/40" />
                    <div className="w-2/3 h-2 rounded bg-slate-800/40" />
                  </div>
                </div>

                {/* Bottom coordinates label */}
                <div className="relative z-10 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[8px] font-mono text-slate-500">
                  <span>DISC_X</span>
                  <span>404_ERR</span>
                </div>
              </div>

              {/* Floating wrench instrument overlay to indicate broken context */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-20 -translate-y-8 w-12 h-12 rounded-xl bg-[#0f0e22] border border-slate-700/60 shadow-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200"
                style={{ 
                  transform: "translate3d(60px, -10px, 40px) rotate(15deg)",
                }}
                title="Under Maintenance"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-[#5b4dff]/10 animate-ping duration-1000" />
                  <Wrench className="w-5 h-5 text-indigo-400 relative z-10" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3. DYNAMIC THREE CARDS SUB-RESOURCES REGION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 sm:mt-24">
          
          {/* Card 1: Gallery */}
          <div 
            onClick={() => handleNavigate("home")}
            className="p-6 rounded-2xl bg-[#080715]/45 border border-slate-900 hover:border-slate-800/80 hover:bg-[#0f0e22]/50 transition-all space-y-4 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/10 border border-[#5b4dff]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5 text-[#8e6fff]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white group-hover:text-[#8e6fff] transition-colors flex items-center gap-2">
                <span>Curated Gallery</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Discover top-tier branding and UI/UX projects from the continent&apos;s best.
              </p>
            </div>
          </div>

          {/* Card 2: Find Designers */}
          <div 
            onClick={() => handleNavigate("designers")}
            className="p-6 rounded-2xl bg-[#080715]/45 border border-slate-900 hover:border-slate-800/80 hover:bg-[#0f0e22]/50 transition-all space-y-4 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                <span>Find Designers</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Browse our vetted community of industry-leading African creatives.
              </p>
            </div>
          </div>

          {/* Card 3: Need Assistance */}
          <div 
            onClick={() => handleNavigate("contact")}
            className="p-6 rounded-2xl bg-[#080715]/45 border border-slate-900 hover:border-slate-800/80 hover:bg-[#0f0e22]/50 transition-all space-y-4 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span>Need Assistance?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Can&apos;t find what you need? Reach out to our concierge support team directly.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* 4. HIGH-FIDELITY GLOBAL BRAND FOOTER */}
      <div className="relative z-10 w-full">
        <Footer 
          setActiveTab={handleNavigate}
          setCategoryFilter={() => {}}
          onOpenSupportPage={(pageId) => handleNavigate(pageId)}
        />
      </div>

    </div>
  );
}
