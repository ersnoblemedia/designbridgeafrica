"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { resilientDB } from "../lib/supabase";
import { useAuth } from "./AuthProvider";
import { Job } from "../types";
import { Briefcase, DollarSign, MapPin, Sparkles, Send, Trash2, Search, Sliders, ChevronDown, Clock, HelpCircle } from "lucide-react";

interface JobsWorkspaceProps {
  jobsData: Job[];
  handleApplyToJob: (jobId: string) => void;
  setIsPostingJob: (open: boolean) => void;
}

export default function JobsWorkspace({
  jobsData: fallbackJobs,
  handleApplyToJob,
  setIsPostingJob,
}: JobsWorkspaceProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Filtering selections matching the screenshots mockup
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [postedTime, setPostedTime] = useState("All");

  const categories = [
    "All", 
    "Graphic Design & Print",
    "UI/UX Design", 
    "Branding & Packaging", 
    "3D Art & Modeling",
    "Digital Illustration",
    "Motion Graphics",
    "Logo Design",
    "Textile & Fashion",
    "Typography & Fonts",
    "Web & No-Code Design"
  ];

  // Stacked preview bidder avatar bubbles
  const bidderAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80"
  ];

  // Subscribe to real-time database jobs
  useEffect(() => {
    if (!user) return;

    const unsubscribe = resilientDB.subscribe("jobs", (data) => {
      if (!data || data.length === 0) {
        setJobs(fallbackJobs);
      } else {
        setJobs(data as Job[]);
      }
    });

    return () => unsubscribe();
  }, [user, fallbackJobs]);

  const handleDeleteJob = async (id: string, creatorId?: string) => {
    if (!user || user.uid !== creatorId) return;
    try {
      await resilientDB.delete("jobs", id, "id");
    } catch (err) {
      console.error("Error deleting job: ", err);
    }
  };

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setBudgetRange("All");
    setJobType("All");
    setPostedTime("All");
    setSearchTerm("");
    setCategoryFilter("All");
  };

  // Advanced clients filter implementation to handle the mockups
  const filteredJobs = jobs.filter((job) => {
    // 1. Search keyword matching
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(term);
      const matchDesc = job.description.toLowerCase().includes(term);
      const matchComp = job.company.toLowerCase().includes(term);
      if (!matchTitle && !matchDesc && !matchComp) return false;
    }

    // 2. Categories Checkbox Filters
    if (selectedCategories.length > 0) {
      const matchCat = selectedCategories.some(cat => {
        const jobCatLower = job.category.toLowerCase();
        const catLower = cat.toLowerCase();
        if (catLower === "branding") return jobCatLower.includes("branding") || jobCatLower.includes("packaging");
        if (catLower === "logo design") return jobCatLower.includes("logo") || jobCatLower.includes("branding");
        if (catLower === "ui/ux design") return jobCatLower.includes("ui/ux") || jobCatLower.includes("interface");
        if (catLower === "illustration") return jobCatLower.includes("illustrat") || jobCatLower.includes("art");
        return jobCatLower.includes(catLower);
      });
      if (!matchCat) return false;
    }

    // 3. Category Filter tabs
    if (categoryFilter !== "All") {
      if (job.category !== categoryFilter) return false;
    }

    // 4. Budget range parser matching
    if (budgetRange !== "All") {
      const budgetNum = typeof job.budget === "number" ? job.budget : parseInt(String(job.budget).replace(/[^0-9]/g, "")) || 0;
      if (budgetRange === "Under $1k" && budgetNum >= 1000) return false;
      if (budgetRange === "$1k - $3k" && (budgetNum < 1000 || budgetNum > 3000)) return false;
      if (budgetRange === "$3k+" && budgetNum < 3000) return false;
    }

    return true;
  });

  return (
    <div id="jobs-workspace" className="space-y-10">
      
      {/* PREMIUM HEADER SEARCH HERO CONTAINER */}
      <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-8 sm:p-12 relative shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#5b4dff]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3.5 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight shrink-0">
            Find your next design challenge
          </h1>
          <p className="text-sm sm:text-md text-slate-400 font-semibold max-w-xl leading-relaxed">
            Connecting Africa&apos;s finest creative talent with global opportunities and high-impact projects.
          </p>

          {/* Quick info tabs selector */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer rounded-full ${
                  categoryFilter === cat 
                    ? "bg-[#5b4dff]/25 text-[#a08aff] border-[#5b4dff]/50 shadow" 
                    : "bg-slate-950/40 text-slate-500 border-slate-900 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Floating post job trigger on the right side */}
        <div className="relative z-10 bg-slate-950/70 border border-slate-850 p-6 rounded-2xl space-y-4 max-w-sm text-center md:text-left">
          <strong className="text-xs uppercase tracking-widest font-mono text-[#8e6fff] block font-bold">RECRUITMENT CORNER</strong>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Are you a global brand looking to hire certified, vetted African talent? Post your brief in minutes.
          </p>
          <button 
            onClick={() => setIsPostingJob(true)}
            className="w-full bg-[#5b4dff] hover:bg-[#7140ff] text-white text-xs font-black py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            + Post Creative Brief
          </button>
        </div>
      </div>

      {/* THREE INTERACTIVE SEARCH TOOLS */}
      <div className="bg-[#090815] border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 max-w-5xl mx-auto shadow">
        
        {/* Search input field */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5b4dff]"
            placeholder="Search jobs by keyword, company, design skill..."
          />
        </div>

        {/* Quick select selector dropdown */}
        <div className="w-full md:w-56 shrink-0 relative">
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-300 appearance-none focus:outline-none focus:border-[#5b4dff]"
          >
            <option value="All">All Budget Levels</option>
            <option value="Under $1k">Under $1,000 USD</option>
            <option value="$1k - $3k">$1,000 - $3,000 USD</option>
            <option value="$3k+">$3,000+ USD Project-based</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Large violet search action trigger */}
        <button 
          onClick={() => setSelectedCategories([])} // Reset checkbox filter if custom run
          className="w-full md:w-40 bg-[#5b4dff] hover:bg-[#7140ff] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow cursor-pointer active:scale-95 text-center leading-none"
        >
          Search Jobs
        </button>
      </div>

      {/* DUAL-COLUMN LAYOUT SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: FILTERS SIDEBAR */}
        <div className="lg:col-span-1 bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-930 pb-4 mb-6">
            <h3 className="text-xs uppercase font-black text-white tracking-widest flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#8e6fff]" />
              <span>FILTERS</span>
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#8e6fff] hover:text-[#a08aff] bg-transparent cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 md:gap-8 lg:gap-6">
            {/* Core categories list checkboxes exactly like screenshots */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider block font-mono">Category</span>
              <div className="space-y-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                {[
                  "Graphic Design & Print",
                  "UI/UX Design", 
                  "Branding & Packaging", 
                  "3D Art & Modeling", 
                  "Digital Illustration",
                  "Motion Graphics",
                  "Logo Design",
                  "Textile & Fashion",
                  "Typography & Fonts",
                  "Web & No-Code Design"
                ].map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCategory(cat)}
                        className="rounded border-slate-805 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="group-hover:text-white transition-colors">{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Job budget presets group */}
            <div className="space-y-3 md:pt-0 border-t border-slate-930 pt-6 md:border-t-0 lg:border-t lg:border-slate-930 lg:pt-6">
              <span className="text-xs uppercase font-extrabold text-slate-505 tracking-wider block font-mono">Budget Range</span>
              <div className="space-y-2">
                {["All", "Under $1k", "$1k - $3k", "$3k+"].map((bRange) => (
                  <button
                    key={bRange}
                    onClick={() => setBudgetRange(bRange)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                      budgetRange === bRange 
                        ? "bg-[#5b4dff]/10 text-white border-[#5b4dff]/30" 
                        : "bg-slate-950/20 text-slate-400 border-slate-900 hover:text-slate-205"
                    }`}
                  >
                    <span>{bRange === "All" ? "Any Budget" : bRange}</span>
                    {budgetRange === bRange && <span className="text-emerald-400">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type Options */}
            <div className="space-y-3 md:pt-0 border-t border-slate-930 pt-6 md:border-t-0 lg:border-t lg:border-slate-930 lg:pt-6">
              <span className="text-xs uppercase font-extrabold text-slate-555 tracking-wider block font-mono">Job Type</span>
              <div className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="jType" 
                    checked={jobType === "All"}
                    onChange={() => setJobType("All")}
                    className="bg-[#080715] text-[#5b4dff]" 
                  />
                  <span>Fixed-price</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="jType" 
                    checked={jobType === "Hourly"}
                    onChange={() => setJobType("Hourly")}
                    className="bg-[#080715] text-[#5b4dff]" 
                  />
                  <span>Hourly rate basis</span>
                </label>
              </div>
            </div>
          </div>

          {/* Help details */}
          <div className="pt-4 mt-6 border-t border-slate-930 text-[10px] text-slate-500 leading-relaxed font-semibold flex gap-1.5 items-start">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
            <span>All briefs listed on DesignBridgeAfrica undergo strict curation to verify budgets targets and real payments escrows.</span>
          </div>

        </div>

        {/* RIGHT COLUMN: JOBS LISTS */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              Open Design Roles ({filteredJobs.length})
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="py-20 text-center space-y-3 border border-dashed border-slate-900 rounded-3xl animate-fadeIn">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto opacity-70" />
              <span className="text-sm font-black text-slate-300 block font-sans">No open design briefs listed</span>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                Try adjusting your checkbox filter selections or search terms in your search box to discover fits.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all shadow relative flex flex-col justify-between"
                >
                  
                  {/* Job Header: Category pill + Time post duration info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] uppercase tracking-widest font-mono font-black text-[#8e6fff] bg-[#5b4dff]/10 px-3 py-1 rounded-full border border-[#8e6fff]/15">
                      {job.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2 hours ago
                    </span>
                  </div>

                  {/* Title & Organization Info */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                      <div className="space-y-1.5">
                        <h3 className="text-md sm:text-lg font-black text-white tracking-tight leading-snug">
                          {job.title}
                        </h3>
                        <span className="text-xs text-slate-400 block font-medium">
                          Company: <strong className="text-slate-300">{job.company}</strong>
                        </span>
                      </div>

                      {/* Budget Target Label Badge layout */}
                      <div className="text-left sm:text-right bg-slate-950/60 sm:bg-transparent border sm:border-transparent border-slate-900 p-2.5 sm:p-0 rounded-xl shrink-0">
                        <span className="text-[9px] text-[#8e6fff] block uppercase font-mono font-black tracking-widest leading-none">Budget Target</span>
                        <span className="text-md sm:text-lg font-black text-emerald-450 flex items-center sm:justify-end gap-1 mt-1 font-mono">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          {job.budget} USD
                        </span>
                      </div>
                    </div>

                    {/* Specifications prose text */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold font-sans pt-1">
                      {job.description}
                    </p>

                    {/* Required expertise tag collections */}
                    <div className="flex flex-wrap gap-1 pt-2.5">
                      {job.skillsNeeded?.map((skill) => (
                        <span key={skill} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-slate-400 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Overlapping Bidder bubbles & Apply Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-930 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Avatars bubble with Proposal counter string matching specs */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      
                      <div className="flex items-center">
                        <div className="flex -space-x-2.5 select-none shrink-0">
                          {bidderAvatars.map((src, avIndex) => (
                            <div key={avIndex} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-[#0f0e22] shadow">
                              <Image 
                                src={src} 
                                alt="Bidder avatar placeholder" 
                                fill 
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-bold ml-2.5 leading-none">
                          {job.proposals || 12} proposals submitted
                        </span>
                      </div>
                    </div>

                    {/* Action buttons list */}
                    <div className="flex items-center gap-2">
                      {/* Trash action for creator */}
                      {(user && user.uid === (job as any).creatorId) && (
                        <button 
                          onClick={() => handleDeleteJob(job.id, (job as any).creatorId)}
                          className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors cursor-pointer"
                          title="Delete Project Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button 
                        onClick={() => handleApplyToJob(job.id)}
                        disabled={job.applied}
                        className={`text-xs font-black px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                          job.applied 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed" 
                            : "bg-[#5b4dff] hover:bg-[#7140ff] text-white shadow shadow-[#5b4dff]/25"
                        }`}
                      >
                        {job.applied ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                            Application Submitted
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Apply Now
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Centered outline load action button at the bottom matching third screenshot specs */}
          <div className="pt-8 text-center">
            <button 
              onClick={handleResetFilters}
              className="px-8 py-3.5 rounded-full border border-slate-900 bg-[#0f0e22]/50 hover:bg-slate-950 text-slate-400 hover:text-white transition-all text-xs font-extrabold cursor-pointer hover:border-slate-805"
            >
              Load More Jobs
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
