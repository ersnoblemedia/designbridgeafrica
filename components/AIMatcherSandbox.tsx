"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, CheckCircle2, Sliders, Cpu } from "lucide-react";
import { DESIGNERS } from "../lib/data";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

interface AIMatcherSandboxProps {
  setSelectedDesigner: (d: any) => void;
  setChatDesigner: (d: any) => void;
  setActiveTab: (tab: "home" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
  setMatchedScore: (skills: string[]) => void;
}

export default function AIMatcherSandbox({
  setSelectedDesigner,
  setChatDesigner,
  setActiveTab,
  setMatchedScore,
}: AIMatcherSandboxProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [promptInput, setPromptInput] = useState(
    "I need premium luxury packaging with traditional geometric patterns and a modern 3D showcase representation."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<any[] | null>(null);

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

  const triggerAnalyze = () => {
    setAnalyzing(true);
    setMatchResults(null);

    setTimeout(() => {
      // Calculate scores dynamically based on keyword search
      const inputLower = promptInput.toLowerCase();
      const results = DESIGNERS.map((designer) => {
        let matchedKeywords: string[] = [];
        let score = 30; // base score

        designer.skills.forEach((skill) => {
          if (inputLower.includes(skill.toLowerCase()) || skill.split(" ").some(word => inputLower.includes(word.toLowerCase()))) {
            score += 18;
            matchedKeywords.push(skill);
          }
        });

        if (inputLower.includes("3d") || inputLower.includes("blender") || inputLower.includes("render")) {
          if (designer.id === "abebe") score += 20;
        }
        if (inputLower.includes("figma") || inputLower.includes("ux") || inputLower.includes("ui") || inputLower.includes("web")) {
          if (designer.id === "fatima") score += 20;
        }
        if (inputLower.includes("package") || inputLower.includes("pack") || inputLower.includes("box") || inputLower.includes("wrap") || inputLower.includes("geometry")) {
          if (designer.id === "kofi") score += 20;
        }

        // Limit score to max 99%
        score = Math.min(score, 99);

        return {
          designer,
          score,
          matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : ["High Adaptability"],
        };
      }).sort((a,b) => b.score - a.score);

      setMatchResults(results);
      setMatchedScore(results[0].matchedKeywords);
      setAnalyzing(false);
    }, 1800);
  };

  const handleStartContractChat = (designer: any) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setChatDesigner(designer);
    setSelectedDesigner(null);
    setActiveTab("messaging");
  };

  return (
    <div id="ai-deep-matcher-playground" className="bg-[#100f24] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      
      {/* Decorative Light Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#5b4dff]/5 blur-[80px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900/80 pb-6 mb-6">
        <div>
          <span className="text-xs uppercase font-black tracking-widest text-[#8e6fff] flex items-center gap-1.5 mb-1">
            <Cpu className="w-4 h-4" /> Creative Matcher
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Smart Design Matchmaker</h2>
        </div>
        <p className="text-sm text-slate-400 max-w-sm font-medium">
          Describe what you want to create and let our smart system suggest the perfect creative talent for your vision.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Input Text Area block */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-350 block">Tell us about what you want to make:</label>
          <div className="relative">
            <textarea 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-[#0d0c1d] border border-slate-800/80 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5b4dff]/60 resize-none h-24 font-sans leading-relaxed"
              placeholder="e.g., a premium luxury packaging box with warm traditional motifs..."
            />
            <button 
              onClick={triggerAnalyze}
              disabled={analyzing || !promptInput.trim()}
              className="absolute bottom-3 right-3 bg-[#5b4dff] hover:bg-[#7546ff] text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <span className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Find My Designer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Display results */}
        {analyzing && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#5b4dff] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Finding the best local talent for your style...</p>
          </div>
        )}

        {matchResults && !analyzing && (
          <div id="ai-match-results-cards" className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {matchResults.map(({ designer, score, matchedKeywords }, idx) => (
              <div 
                key={designer.id}
                className={`relative rounded-2xl border p-5 space-y-4 transition-all ${idx === 0 ? "border-[#5b4dff] bg-[#141235]/40 shadow-lg shadow-[#141235]" : "border-slate-800 bg-[#0d0c1d]/60"}`}
              >
                {idx === 0 && (
                  <span className="absolute top-3 right-3 bg-[#8e6fff] text-[10px] uppercase font-black text-white px-2 py-0.5 rounded tracking-wider">
                    Best Match
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <Image src={designer.avatar} alt="avatar" width={44} height={44} className="rounded-full border border-slate-800 object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-sm font-bold text-white block">{designer.name}</span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                      <span className="text-xs text-slate-400">{designer.city}, {designer.country}</span>
                      <span className="text-slate-700 text-xs font-mono">&bull;</span>
                      <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyle(designer.availability || "Available Now")}`}>
                        {designer.availability || "Available Now"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold font-mono">Compatibility</span>
                    <span className="text-[#8e6fff] font-black">{score}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#5b4dff] to-[#8e6fff]" style={{ width: `${score}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {matchedKeywords.slice(0, 2).map((word: string) => (
                    <span key={word} className="text-xs font-mono select-none px-2.5 py-0.5 rounded bg-slate-900/80 text-[#9d8aff] border border-slate-800/40">
                      {word}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => handleStartContractChat(designer)}
                  className="w-full bg-slate-900 hover:bg-[#1a183d] text-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  Message Designer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
