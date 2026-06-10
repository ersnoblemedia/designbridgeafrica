"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, MapPin, Link as LinkIcon, Briefcase, FileText, UserPlus, Palette, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function AccountCompletionModal() {
  const { user, profile, updateProfile } = useAuth();
  const [role, setRole] = useState<"Client" | "Designer">("Designer");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user is not logged in, or already completed their account, don't show the modal
  if (!user || !profile || profile.accountCompleted) {
    return null;
  }

  const africanCities = [
    "Lagos, Nigeria",
    "Nairobi, Kenya",
    "Johannesburg, South Africa",
    "Kigali, Rwanda",
    "Accra, Ghana",
    "Cairo, Egypt",
    "Dakar, Senegal",
    "Casablanca, Morocco",
    "Addis Ababa, Ethiopia",
    "Dar es Salaam, Tanzania"
  ];

  const handleSelectCity = (city: string) => {
    setLocation(city);
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Optional in technical sense, but nice to let them skip or validate
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Basic Validation
    if (!location.trim()) {
      setErrorMsg("Please specify your current location/city.");
      setIsSubmitting(false);
      return;
    }

    if (!bio.trim() || bio.length < 15) {
      setErrorMsg("Please tell us a bit more about yourself (at least 15 characters).");
      setIsSubmitting(false);
      return;
    }

    if (portfolioUrl.trim() && !validateUrl(portfolioUrl.trim())) {
      setErrorMsg("Please enter a valid URL (e.g. portfolio.com or behance.net/you).");
      setIsSubmitting(false);
      return;
    }

    // Clean URL
    let finalUrl = portfolioUrl.trim();
    if (finalUrl && !finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    try {
      await updateProfile({
        role,
        portfolioUrl: finalUrl,
        location: location.trim(),
        bio: bio.trim(),
        accountCompleted: true
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred saving your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050512]/95 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Background radial highlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5b4dff]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#0b0a1a] border border-[#1e293b] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden my-8">
        {/* Brand visual banner */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#5b4dff] via-[#8e6fff] to-[#5b4dff]" />

        {/* Modal Header */}
        <div className="space-y-3 text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5b4dff]/10 border border-[#5b4dff]/20 text-xs font-bold text-[#8e6fff]">
            <Sparkles className="w-3.5 h-3.5 text-[#5b4dff] animate-spin-slow" />
            <span>Welcome to DesignBridge Africa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Complete Your Professional Profile
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {"You are one step away from joining Africa's premier creative collaboration ecosystem. Give us a brief overview of who you are."}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: ROLE DESIGNATION */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 block uppercase font-mono">
              Determine Workspace Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("Designer")}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                  role === "Designer"
                    ? "bg-[#18153b] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/10 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-755 hover:text-slate-200"
                }`}
              >
                <Palette className={`w-7 h-7 ${role === "Designer" ? "text-[#8e6fff]" : "text-slate-500"}`} />
                <span className="text-sm sm:text-base font-black tracking-tight block">African Creative / Designer</span>
                <span className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Showcase portfolios, apply for design briefs, and secure rewarding creative contracts.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("Client")}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                  role === "Client"
                    ? "bg-[#18153b] border-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/10 scale-[1.02]"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-755 hover:text-slate-200"
                }`}
              >
                <Briefcase className={`w-7 h-7 ${role === "Client" ? "text-[#8e6fff]" : "text-slate-500"}`} />
                <span className="text-sm sm:text-base font-black tracking-tight block">Work Provider / Client</span>
                <span className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-semibold">
                  Hire elite African designers, coordinate reviews, and manage secure milestones.
                </span>
              </button>
            </div>
          </div>

          {/* STEP 2: PROFESSIONAL PORTFOLIO LINKS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="portfolio-url-field" className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 block uppercase font-mono">
                Professional URL / Website Link
              </label>
              <span className="text-xs font-mono text-slate-500 select-none">Optional</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <LinkIcon className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <input
                id="portfolio-url-field"
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="behance.net/username or github.com/username"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm sm:text-base text-white placeholder-slate-505 focus:outline-none focus:border-[#5b4dff] hover:border-slate-750 transition-all font-sans"
              />
            </div>
          </div>

          {/* STEP 3: WORK LOCATION GEOGRAPHY */}
          <div className="space-y-2.5">
            <label htmlFor="location-field" className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 block uppercase font-mono">
              Current City & Country Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <input
                id="location-field"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g. Lagos, Nigeria or Nairobi, Kenya"
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm sm:text-base text-white placeholder-slate-505 focus:outline-none focus:border-[#5b4dff] hover:border-slate-750 transition-all font-sans"
                required
              />
            </div>

            {/* Quick Select African Landmark Cities */}
            <div className="flex flex-wrap gap-2 pt-1">
              {africanCities.slice(0, 5).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="text-[11px] sm:text-xs font-bold tracking-tight px-3.5 py-2 rounded-lg bg-slate-900/80 border border-slate-805 hover:border-[#5b4dff]/40 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  + {city.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: BIO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="bio-field" className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 block uppercase font-mono">
                Professional Bio & Creative Essence
              </label>
              <span className="text-xs font-mono text-slate-400 select-none font-bold">
                {bio.length} characters
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-4 left-4 pointer-events-none">
                <FileText className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <textarea
                id="bio-field"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="E.g. Senior product designer based in Accra with 6+ years designing interactive mobile fintech applications and local visual brand identity programs."
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm sm:text-base text-white placeholder-slate-505 focus:outline-none focus:border-[#5b4dff] hover:border-slate-750 transition-all font-sans resize-none leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4.5 px-6 rounded-xl bg-[#5b4dff] text-white font-black text-sm sm:text-base shadow-xl shadow-[#5b4dff]/20 hover:bg-[#6c5eff] transition-all cursor-pointer disabled:opacity-50 select-none uppercase tracking-widest font-mono"
            >
              <span>{isSubmitting ? "Saving Profile..." : "Submit Profile & Enter Workspace"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
