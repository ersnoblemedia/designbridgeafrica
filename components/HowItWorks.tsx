"use client";

import React, { useState } from "react";
import { 
  Compass, 
  ShieldCheck, 
  Cpu, 
  Briefcase, 
  Coins, 
  Zap, 
  Sparkles, 
  Layers, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Building,
  Key
} from "lucide-react";

export default function HowItWorks() {
  const [activePlaybookTab, setActivePlaybookTab] = useState<"layers" | "revenue" | "hiring">("layers");
  
  // Custom interactive simulator states
  const [matchingQuery, setMatchingQuery] = useState("Fintech UI Designer");
  const [matchedResults, setMatchedResults] = useState<any[]>([]);
  const [isMatchingSim, setIsMatchingSim] = useState(false);

  const simulateAIMatch = () => {
    setIsMatchingSim(true);
    setMatchedResults([]);
    setTimeout(() => {
      // Mock elite matching results representing Layer 3
      setMatchedResults([
        { name: "Fatima Al-Mansoor", specialty: "Fintech UI/UX", country: "Egypt", rating: "4.9", matchPercent: "98%" },
        { name: "Kofi Mensah", specialty: "Packaging & Brand Tech", country: "Ghana", rating: "4.8", matchPercent: "94%" },
        { name: "Abebe Bikila", specialty: "3D Product Artifacts", country: "Ethiopia", rating: "5.0", matchPercent: "91%" }
      ]);
      setIsMatchingSim(false);
    }, 1200);
  };

  const layersInfo = [
    {
      level: "Layer 1",
      title: "Portfolio Discovery Platform (The Foundation)",
      desc: "Clients discover talent through actual visual evidence first. We displace generic resumes with real creative work. The natural workflow is: See incredible work → Trust designer → Hire immediately.",
      accent: "from-sky-500/20 to-indigo-500/10 border-sky-500/20",
      textColor: "text-sky-450 text-sky-400",
      icon: <Compass className="w-5 h-5 text-sky-400" />
    },
    {
      level: "Layer 2",
      title: "Curated Vetted Talent Marketplace",
      desc: "We reject the 'anyone can join' low-barrier approach. Creative candidates undergo structural manual checks. When a designer is live on DesignBridge Africa, an international client knows they are fully certified.",
      accent: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20",
      textColor: "text-[#8e6fff]",
      icon: <ShieldCheck className="w-5 h-5 text-[#8e6fff]" />
    },
    {
      level: "Layer 3",
      title: "AI talent Matching Engine",
      desc: "Avoid endless matching friction. State your distinct constraints—like 'Fintech Mobile UI design'—and our tailored system highlights the 5 best matching African professionals based on verified historic projects.",
      accent: "from-[#5b4dff]/20 to-violet-500/10 border-[#5b4dff]/20",
      textColor: "text-purple-300",
      icon: <Cpu className="w-5 h-5 text-[#8e6fff]" />
    },
    {
      level: "Layer 4",
      title: "Dynamic Hiring Ecosystem",
      desc: "Flexible project formats to bridge local talent to global brands—enabling Path A (Direct Hire portfolios), Path B (Strategic Job Briefings), and Path C (AI Automated recommended matching).",
      accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
      textColor: "text-emerald-450 text-emerald-400",
      icon: <Briefcase className="w-5 h-5 text-emerald-400" />
    }
  ];

  const streamsInfo = [
    {
      title: "Marketplace Commission",
      payout: "12% Standard / 8% Enterprise",
      desc: "Commission is deducted directly from designer payouts (12% for standard projects, and reduced to 8% for premier Enterprise projects). This aligns platform operations directly with creative success.",
      icon: <Coins className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Designer Pro Subscription",
      payout: "$19.00 / Month",
      desc: "A premium monthly subscription of $19/mo globally, processed entirely in USD. Unlocks the Verified Pro badge, priority recommendation visibility weight, AI profile/portfolio/SEO optimization, and advanced metrics.",
      icon: <Zap className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Featured Listings",
      payout: "Sponsored Placements",
      desc: "Promote Designers, high-impact Portfolios, or urgent regional Jobs across the ecosystem. Placement pricing guidelines are managed directly through the centralized Admin Dashboard.",
      icon: <Sparkles className="w-5 h-5 text-sky-400" />
    },
    {
      title: "Escrow Protection Fee",
      payout: "2.5% Escrow (Phase 2)",
      desc: "Charged to clients to support secure payment holding, milestone protection, dispute coverage, and fraud prevention. Actively safeguards payouts for peace of mind.",
      icon: <Layers className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "Enterprise Talent Sourcing",
      payout: "Custom Retainers & Fees",
      desc: "For companies hiring teams or multiple creatives. Encompasses talent sourcing, advanced screening, shortlisting, and managed hiring under custom contract retainers.",
      icon: <Building className="w-5 h-5 text-[#8e6fff]" />
    }
  ];

  return (
    <div id="strategic-playbook-frame" className="space-y-12 py-8 relative">
      
      {/* Absolute high contrast grid highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-[#5b4dff]/4 to-transparent opacity-50 pointer-events-none" />

      {/* Playbook Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] font-mono font-black text-[#8e6fff] uppercase tracking-widest bg-[#5b4dff]/15 px-3.5 py-1.5 rounded-full border border-[#5b4dff]/20 inline-block">
          Ecosystem Blueprint
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">The DesignBridge Framework</h2>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          How we empower pan-African artistic excellence and build ironclad commercial avenues.
        </p>
      </div>

      {/* TAB SELECTOR NAVIGATION BAR */}
      <div className="flex justify-center w-full px-4">
        <div className="bg-[#121124] border border-slate-900 rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActivePlaybookTab("layers")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto ${
              activePlaybookTab === "layers"
                ? "bg-[#5b4dff] text-white shadow-xl"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>The 4-Layer Product Architecture</span>
          </button>
          
          <button
            onClick={() => setActivePlaybookTab("hiring")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto ${
              activePlaybookTab === "hiring"
                ? "bg-[#5b4dff] text-white shadow-xl"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>3 Hiring Paths</span>
          </button>

          <button
            onClick={() => setActivePlaybookTab("revenue")}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto ${
              activePlaybookTab === "revenue"
                ? "bg-[#5b4dff] text-[#ffffff] shadow-xl"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>5 Revenue Monetizations</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 4 PRINCIPLED LAYERS */}
      {activePlaybookTab === "layers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scaleUp">
          {layersInfo.map((layer, index) => (
            <div 
              key={index} 
              className={`bg-[#0a091a] border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#5b4dff]/40 transition-all ${layer.accent}`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center">
                    {layer.icon}
                  </div>
                  <span className={`text-[10px] uppercase font-black font-mono tracking-wider ${layer.textColor}`}>
                    {layer.level}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white tracking-tight">{layer.title}</h3>
                <p className="text-[11.5px] text-slate-400 font-medium leading-relaxed">{layer.desc}</p>
              </div>
              
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-bold font-mono">
                <span>Vetted Gateway Match</span>
                <span className="text-emerald-400">✓ Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: THE 3 DISTINCT HIRING PATHWAYS WITH INTERACTIVE DEMO */}
      {activePlaybookTab === "hiring" && (
        <div className="space-y-8 animate-scaleUp">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Direct Hire */}
            <div className="bg-[#121124]/40 border border-slate-900 rounded-3xl p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-black tracking-widest block">Path A</span>
                  <h3 className="text-sm font-black text-white">Direct Hire from Portfolios</h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                The most organic, trust-oriented path. A client browses the portfolio feed, falls in love with custom designs, and taps <strong>&ldquo;Hire Now&rdquo;</strong> to secure those exact creative hands on milestones. Zero wait time.
              </p>
              <div className="bg-[#0b0a1a] p-3 rounded-2xl border border-slate-900/60 text-[10.5px] font-mono text-[#8e6fff] text-center">
                Workflow: Browse Portfolio → Tap Hire → Lock Escrow
              </div>
            </div>

            {/* Job Board Briefing */}
            <div className="bg-[#121124]/40 border border-slate-900 rounded-3xl p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase font-black tracking-widest block">Path B</span>
                  <h3 className="text-sm font-black text-white">Curated Job Briefing Board</h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                For complex or multi-specialty projects. Client sets a custom budget blueprint and releases the brief. Handpicked, manually-vetted local designers review specifications and apply with direct proposals.
              </p>
              <div className="bg-[#0b0a1a] p-3 rounded-2xl border border-slate-900/60 text-[10.5px] font-mono text-emerald-450 text-emerald-450 text-center">
                Workflow: Create Brief → Specialist Application → Select Matches
              </div>
            </div>

            {/* AI Automated Recommendation Sourcing */}
            <div className="bg-[#5b4dff]/5 border border-[#5b4dff]/25 rounded-3xl p-7 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#5b4dff] text-white text-[8px] font-black uppercase font-mono px-3 py-1 rounded-bl-xl tracking-widest">
                High Growth Value
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/20 border border-[#5b4dff]/40 flex items-center justify-center text-[#8e6fff] animate-pulse">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#8e6fff] font-mono uppercase font-black tracking-widest block">Path C</span>
                  <h3 className="text-sm font-black text-white">AI Recommended Matchmaking</h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                The future of automated design headhunting. Clients skip the list search: they define precise requirements, and our algorithms pinpoint the 5 best local designers with matching past design profiles in moments.
              </p>
              <div className="bg-[#0b0a1a] p-3 rounded-2xl border border-slate-900/60 text-[10.5px] font-mono text-purple-350 text-center">
                Workflow: Type Prompt → AI Pinpoints 5 Best Candidates → Hire Spot On
              </div>
            </div>

          </div>

          {/* REAL TIME AI MATCHING SIMULATOR AREA */}
          <div className="bg-[#0b0a1a] border border-[#5b4dff]/15 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-black text-[#8e6fff] uppercase tracking-wider font-mono">
                <Cpu className="w-4 h-4" /> Live Matchmaking Experience
              </div>
              <h3 className="text-base font-black text-white">Experience AI Sourcing (Path C)</h3>
              <p className="text-xs text-slate-400 font-medium">Type a professional requirement to query the verified registry instantly.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. Fintech UI Designer, 3D blender packaging artist..."
                value={matchingQuery}
                onChange={(e) => setMatchingQuery(e.target.value)}
                className="flex-1 bg-[#121124] border border-slate-900 rounded-xl p-3.5 text-xs text-white placeholder-slate-650 font-semibold focus:outline-none focus:border-[#5b4dff]"
              />
              <button
                onClick={simulateAIMatch}
                disabled={isMatchingSim}
                className="bg-[#5b4dff] hover:bg-[#7245ff] text-white font-black text-xs px-6 py-3.5 rounded-xl shrink-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMatchingSim ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mapping registry...</span>
                  </>
                ) : (
                  <>
                    <span>Sift Verified Talent</span>
                    <ArrowRight className="w-4 h-4 text-purple-200" />
                  </>
                )}
              </button>
            </div>

            {/* Matched outcomes row */}
            {matchedResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 animate-scaleUp">
                {matchedResults.map((res, i) => (
                  <div key={i} className="bg-[#121124] border border-[#5b4dff]/20 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-black px-2 py-0.5 rounded-md">
                      {res.matchPercent} Match
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white">{res.name}</h4>
                      <span className="text-[10px] text-[#8e6fff] font-bold block">{res.specialty}</span>
                      <span className="text-[9px] text-slate-500 block">{res.country}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-900">
                      <span className="text-slate-400 font-bold">Rating: {res.rating}</span>
                      <span className="text-[#8e6fff] font-black flex items-center gap-0.5">Vetted <ShieldCheck className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: THE 5-STREAM PORTFOLIO REVENUE REVOLUTION */}
      {activePlaybookTab === "revenue" && (
        <div className="space-y-6 animate-scaleUp">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {streamsInfo.map((stream, idx) => (
              <div 
                key={idx} 
                className="bg-[#0b0a1a] border border-slate-900 rounded-3xl p-5 flex flex-col justify-between space-y-5 hover:bg-[#121124]/40 transition-all"
              >
                <div className="space-y-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center">
                    {stream.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white tracking-tight">{stream.title}</h4>
                    <span className="text-[10px] uppercase font-bold font-mono text-emerald-400 mt-1 block">
                      {stream.payout}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed">
                    {stream.desc}
                  </p>
                </div>

                <div className="text-[9px] text-slate-500 uppercase font-mono tracking-wider pt-2 border-t border-slate-950 font-bold">
                  Stream Model 0{idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#121124] border border-[#5b4dff]/15 rounded-2xl p-5 text-center leading-normal max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-405 text-slate-350 block">
               <strong>Core Business Rule:</strong> Escrow protection fees are <strong>not</strong> a primary revenue source. Platform growth centers entirely on Marketplace commissions, Pro designer subscriptions, and Custom Enterprise talent sourcing solutions.
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
               Escrow exists primarily to maximize regional trust benchmarks, increase project milestone approval metrics, and amplify cumulative transaction volume.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
