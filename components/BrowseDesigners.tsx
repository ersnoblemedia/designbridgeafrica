"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Search, MapPin, Star, Sparkles, Cpu, Layers, 
  Activity, CheckCircle2, UploadCloud, Clock, 
  ArrowRight, ChevronDown, ChevronUp, Sliders, Check,
  Users
} from "lucide-react";
import { DESIGNERS } from "../lib/data";
import { Designer } from "../types";
import { resilientDB } from "../lib/supabase";

interface BrowseDesignersProps {
  setSelectedDesigner: (d: Designer) => void;
  setChatDesigner: (d: Designer) => void;
  setActiveTab: (tab: "home" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
  initialCategory?: string;
  globalSearchTerm?: string;
  setGlobalSearchTerm?: (term: string) => void;
}

interface WeightedScore {
  total: number;
  skills: number;
  portfolio: number;
  experience: number;
  ratings: number;
  availability: number;
  responsiveness: number;
  matchedDetails: {
    skills: string[];
    styles: string[];
    industries: string[];
  }
}

export default function BrowseDesigners({
  setSelectedDesigner,
  setChatDesigner,
  setActiveTab,
  initialCategory = "All Talents",
  globalSearchTerm,
  setGlobalSearchTerm
}: BrowseDesignersProps) {
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm || "");

  React.useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (setGlobalSearchTerm) {
      setGlobalSearchTerm(val);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory === "All" ? "All Talents" : initialCategory);
  const [designersList, setDesignersList] = useState<Designer[]>(DESIGNERS);

  // Sync / load registered designers from the database
  useEffect(() => {
    const unsub = resilientDB.subscribe("users", (usersData) => {
      try {
        if (usersData && usersData.length > 0) {
          const dbDesigners: Designer[] = usersData
            .filter((u: any) => u.role === "Designer" || u.role === "designer")
            .map((u: any) => ({
              id: u.uid || `d_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              name: u.displayName || "Anonymous Designer",
              avatar: u.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${u.uid || 'def'}`,
              title: u.title || "Vetted Designer Specialist",
              city: u.city || u.location?.split(",")[0]?.trim() || "Lagos",
              country: u.country || u.location?.split(",")[1]?.trim() || "Nigeria",
              rating: u.rating || 5.0,
              completedJobs: u.completedJobs || 0,
              skills: u.skills || ["Branding", "UI/UX Design", "Illustration"],
              bio: u.bio || "Crafting professional visual bridge infrastructure for enterprises globally.",
              featuredProjectImg: u.featuredProjectImg || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
              portfolioItems: u.portfolioItems || [],
              availability: u.availability || "Available Now",
              recentlyActiveMinutes: u.recentlyActiveMinutes || 10,
              responseTimeHours: u.responseTimeHours || 0.1,
              activeJobs: u.activeJobs || 0,
              experienceYears: u.experienceYears || 5,
              industries: u.industries || ["Enterprises", "Cultural Branding"],
              designStyles: u.designStyles || ["Geometric Minimalism"],
              complexityLevel: u.complexityLevel || "Clean & Modern",
              talentType: u.talentType || "individual"
            }));

          // Merge without overriding existing matching ones to support visual previews gracefully
          const combined = [...DESIGNERS];
          dbDesigners.forEach((dbD) => {
            if (!combined.some(d => d.id === dbD.id || d.name.toLowerCase() === dbD.name.toLowerCase())) {
              combined.unshift(dbD); // insert newly joined designers at top
            }
          });
          setDesignersList(combined);
        } else {
          setDesignersList(DESIGNERS);
        }
      } catch (err) {
        console.error("Failed to load and sync DB designers:", err);
        setDesignersList(DESIGNERS);
      }
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);
  
  // Custom filter selections based on design screenshots
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [minRatingFilter, setMinRatingFilter] = useState<number | null>(null);
  const [talentTypeFilter, setTalentTypeFilter] = useState<"all" | "individual" | "agency">("all");
  const [showAiDeepMatcher, setShowAiDeepMatcher] = useState<boolean>(false);

  // Scoring parameters & breakdown display state tracker
  const [expandedScoreDesignerId, setExpandedScoreDesignerId] = useState<string | null>(null);
  
  // Portfolio analyzer playground state
  const [selectedDesignerForUpload, setSelectedDesignerForUpload] = useState<string>("abebe");
  const [uploadPresetImg, setUploadPresetImg] = useState<string>("");
  const [analyzingPortfolio, setAnalyzingPortfolio] = useState(false);
  const [analyzerStep, setAnalyzerStep] = useState<string>("");
  const [extracLog, setExtracLog] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    "All Talents", 
    "Graphic Design",
    "Branding", 
    "UI/UX Design", 
    "Illustration", 
    "Motion Graphics", 
    "Packaging", 
    "3D Design",
    "Textiles & Fashion",
    "Typography & Fonts",
    "Web & No-Code"
  ];

  const searchSuggestions = [
    { label: "Luxury branding & traditional motifs", text: "Luxury branding with traditional geometric patterns" },
    { label: "Fintech UI/UX Available Now", text: "Fintech UI/UX designer Available Now" },
    { label: "Premium chocolate packaging", text: "Premium packaging for chocolate and organic beverages" }
  ];

  // Helper colors for availability badges
  const getStatusColor = (availability: string) => {
    switch (availability) {
      case "Available":
      case "Available Now":
        return "text-emerald-450 bg-emerald-500/10 border-emerald-500/20";
      case "Limited Availability":
        return "text-amber-450 bg-amber-500/10 border-amber-500/20";
      case "Busy":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-450 bg-slate-500/10 border-slate-500/20";
    }
  };

  // AI-inspired core ranking logic
  const calculateMatchScore = (designer: Designer, query: string): WeightedScore => {
    const qLower = query.toLowerCase().trim();
    if (!qLower) {
      // Return baseline rankings with default weights
      return {
        total: 80,
        skills: 25,
        portfolio: 20,
        experience: 12,
        ratings: 9,
        availability: designer.availability === "Available" ? 9 : 6,
        responsiveness: 5,
        matchedDetails: { skills: [], styles: [], industries: [] }
      };
    }

    let skillsScore = 15;
    let portfolioScore = 15;
    let experienceScore = 10;
    let ratingsScore = 8;
    let availabilityScore = designer.availability === "Available" ? 10 : 5;
    let responsivenessScore = designer.recentlyActiveMinutes <= 20 ? 5 : 3;

    const matchedSkills: string[] = [];
    const matchedStyles: string[] = [];
    const matchedIndustries: string[] = [];

    // Semantic matching for skills
    designer.skills.forEach(skill => {
      if (qLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(qLower)) {
        skillsScore += 5;
        matchedSkills.push(skill);
      }
    });
    if (skillsScore > 35) skillsScore = 35;

    // Semantic matching for custom properties if present
    if (designer.designStyles) {
      designer.designStyles.forEach(style => {
        if (qLower.includes(style.toLowerCase())) {
          portfolioScore += 4;
          matchedStyles.push(style);
        }
      });
    }
    if (designer.title.toLowerCase().includes(qLower)) {
      portfolioScore += 5;
    }
    if (portfolioScore > 25) portfolioScore = 25;

    // Experience Years Matcher
    if (designer.experienceYears >= 5) {
      experienceScore = 15;
    } else if (designer.experienceYears >= 3) {
      experienceScore = 12;
    }

    // Ratings Matcher
    if (designer.rating >= 4.9) {
      ratingsScore = 10;
    } else if (designer.rating >= 4.7) {
      ratingsScore = 9;
    }

    const total = skillsScore + portfolioScore + experienceScore + ratingsScore + availabilityScore + responsivenessScore;

    return {
      total: Math.min(100, total),
      skills: skillsScore,
      portfolio: portfolioScore,
      experience: experienceScore,
      ratings: ratingsScore,
      availability: availabilityScore,
      responsiveness: responsivenessScore,
      matchedDetails: {
        skills: matchedSkills,
        styles: matchedStyles,
        industries: matchedIndustries
      }
    };
  };

  const uploadPresetOptions = [
    { title: "Kofi Packaging Gold Foil Box", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80", designer: "kofi", extraStyles: ["Gold Foil", "Asante Patterns"] },
    { title: "Fatima Finance App Screens", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80", designer: "fatima", extraStyles: ["Figma Systems", "SaaS Minimalist"] },
    { title: "Abebe 3D Architectural Clay Render", image: "https://images.unsplash.com/photo-161805182384-a83a8bd57fbe?w=400&q=80", designer: "abebe", extraStyles: ["Blender Cycles", "Earthy Sculptures"] }
  ];

  const handleSimulatePortfolioUpload = () => {
    if (!uploadPresetImg) return;
    setAnalyzingPortfolio(true);
    setUploadSuccess(false);
    setExtracLog([]);

    const preset = uploadPresetOptions.find(o => o.image === uploadPresetImg);
    const designerObj = designersList.find(d => d.id === selectedDesignerForUpload);

    if (!designerObj || !preset) {
      setAnalyzingPortfolio(false);
      return;
    }

    const steps = [
      "Connecting to Vision Engine API...",
      `Scanning preset vector space of matching ${preset.title}...`,
      "Deconstructing design elements & complexity hierarchies...",
      `Synthesizing custom parameters: [${preset.extraStyles.join(", ")}]`,
      "Submitting vector scores to neural ranker..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAnalyzerStep(step);
        setExtracLog(prev => [...prev, step]);

        if (idx === steps.length - 1) {
          // Injection updates
          setDesignersList(prev => prev.map(d => {
            if (d.id === selectedDesignerForUpload) {
              const updatedStyles = Array.from(new Set([...(d.designStyles || []), ...preset.extraStyles]));
              return {
                ...d,
                designStyles: updatedStyles,
                complexityLevel: "Professional Grade",
                rating: Math.min(5.0, Number((d.rating + 0.1).toFixed(1))),
                completedJobs: d.completedJobs + 1
              };
            }
            return d;
          }));
          
          setAnalyzingPortfolio(false);
          setUploadSuccess(true);
        }
      }, (idx + 1) * 600);
    });
  };

  const handleToggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(prev => prev.filter(l => l !== loc));
    } else {
      setSelectedLocations(prev => [...prev, loc]);
    }
  };

  const handleToggleExperience = (exp: string) => {
    if (selectedExperiences.includes(exp)) {
      setSelectedExperiences(prev => prev.filter(e => e !== exp));
    } else {
      setSelectedExperiences(prev => [...prev, exp]);
    }
  };

  const handleToggleCompetency = (comp: string) => {
    if (selectedCompetencies.includes(comp)) {
      setSelectedCompetencies(prev => prev.filter(c => c !== comp));
    } else {
      setSelectedCompetencies(prev => [...prev, comp]);
    }
  };

  const handleResetFilters = () => {
    setSelectedLocations([]);
    setSelectedExperiences([]);
    setSelectedCompetencies([]);
    setMinRatingFilter(null);
  };

  // Helper generator to map stylish designer custom category label monogram boxes to match screens 
  const getBrandMonogramInfo = (designerId: string, designerName: string) => {
    switch (designerId) {
      case "abebe":
        return { text: "Art_sci", bgClass: "bg-[#4f503d]", textClass: "text-[#dcdcaa]" };
      case "fatima":
        return { text: "De_ner", bgClass: "bg-[#415346]", textClass: "text-[#aae2b7]" };
      case "kofi":
        return { text: "Pack_co", bgClass: "bg-[#54483a]", textClass: "text-[#fcdcaa]" };
      case "kilimanjaro":
        return { text: "Kili_Labs", bgClass: "bg-[#5c2d3a] border border-red-500/20", textClass: "text-red-350 font-black tracking-wider text-[8px]" };
      case "ndebele_collective":
        return { text: "Ndeb_Coll", bgClass: "bg-[#25425c] border border-sky-500/20", textClass: "text-sky-350 font-black tracking-wider text-[8px]" };
      default:
        return { text: "Studio", bgClass: "bg-[#3e3d54]", textClass: "text-[#dcaafc]" };
    }
  };

  // Pre-configured custom asset portfolios for matching the preview squares in screens
  const getDesignerThumbnails = (designerId: string) => {
    switch (designerId) {
      case "abebe": // 3D/Modeling
        return [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80"
        ];
      case "fatima": // UI/UX
        return [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80",
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80",
          "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&q=80"
        ];
      case "kofi": // Packaging/Branding
        return [
          "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=300&q=80",
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=80",
          "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=300&q=80"
        ];
      default:
        return [
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80"
        ];
    }
  };

  // Compute final elements
  const computedList = designersList.map(designer => {
    const scoreBreakdown = calculateMatchScore(designer, searchTerm);
    return {
      designer,
      scoreBreakdown
    };
  }).filter(({ designer }) => {
    // 0. Search Keyword Filters (Skills, City, Country, Name, Title, or Bio matching)
    if (searchTerm.trim() !== "") {
      const qLower = searchTerm.toLowerCase().trim();
      const nameMatch = designer.name.toLowerCase().includes(qLower);
      const titleMatch = designer.title.toLowerCase().includes(qLower);
      const cityMatch = designer.city.toLowerCase().includes(qLower);
      const countryMatch = designer.country.toLowerCase().includes(qLower);
      const skillMatch = designer.skills.some(skill => skill.toLowerCase().includes(qLower));
      const bioMatch = designer.bio.toLowerCase().includes(qLower);
      
      if (!nameMatch && !titleMatch && !cityMatch && !countryMatch && !skillMatch && !bioMatch) {
         return false;
      }
    }

    // 1. Sidebar Location Filters
    if (selectedLocations.length > 0) {
      const deLoc = `${designer.city}, ${designer.country}`.toLowerCase();
      const locMatch = selectedLocations.some(l => {
        const checkTerm = l.toLowerCase().split(",")[0].trim(); // e.g. "lagos" from "Lagos, Nigeria"
        return deLoc.includes(checkTerm);
      });
      if (!locMatch) return false;
    }

    // 2. Sidebar Experience Years Filters
    if (selectedExperiences.length > 0) {
      const expMatch = selectedExperiences.some(e => {
        if (e.includes("Junior")) return designer.experienceYears <= 2;
        if (e.includes("Mid-weight")) return designer.experienceYears >= 3 && designer.experienceYears <= 5;
        if (e.includes("Senior")) return designer.experienceYears >= 5;
        return false;
      });
      if (!expMatch) return false;
    }

    // 3. Sidebar Min Rating Filters
    if (minRatingFilter !== null) {
      if (designer.rating < minRatingFilter) return false;
    }

    // 3.5 Talent Type filtering (Individuals vs. Agencies)
    if (talentTypeFilter !== "all") {
      const deType = designer.talentType || "individual";
      if (deType !== talentTypeFilter) return false;
    }

    // 3.7 Competency tagging Filters
    if (selectedCompetencies.length > 0) {
      const matchComp = (skillsList: string[], jobTitle: string, competency: string) => {
        const lowerSkills = skillsList.map(s => s.toLowerCase());
        const lowerTitle = jobTitle.toLowerCase();
        const c = competency.toLowerCase();
        
        if (c === "ui/ux") {
          return lowerSkills.some(s => s.includes("ui") || s.includes("ux") || s.includes("figma") || s.includes("interface")) || lowerTitle.includes("ui") || lowerTitle.includes("ux");
        }
        if (c === "brand design") {
          return lowerSkills.some(s => s.includes("brand") || s.includes("logo") || s.includes("identity")) || lowerTitle.includes("brand");
        }
        if (c === "3d motion") {
          return lowerSkills.some(s => s.includes("3d") || s.includes("motion") || s.includes("render") || s.includes("blender")) || lowerTitle.includes("3d") || lowerTitle.includes("motion");
        }
        return lowerSkills.some(s => s.includes(c)) || lowerTitle.includes(c);
      };

      const hasMatch = selectedCompetencies.some(comp => 
        matchComp(designer.skills || [], designer.title || "", comp)
      );
      if (!hasMatch) return false;
    }

    // 4. Category Pill Filters
    if (selectedCategory === "All Talents" || selectedCategory === "All" || selectedCategory === "") return true;
    const catLower = selectedCategory.toLowerCase();
    const titleLower = designer.title.toLowerCase();
    
    if (catLower === "branding") {
      return titleLower.includes("brand") || designer.skills.some(s => s.toLowerCase().includes("brand") || s.toLowerCase().includes("identity"));
    }
    if (catLower === "ui/ux design") {
      return titleLower.includes("ui/ux") || titleLower.includes("ux") || titleLower.includes("interface") || designer.skills.some(s => s.toLowerCase().includes("ui") || s.toLowerCase().includes("ux") || s.toLowerCase().includes("figma"));
    }
    if (catLower === "illustration") {
      return titleLower.includes("illustrat") || designer.skills.some(s => s.toLowerCase().includes("art") || s.toLowerCase().includes("illustr") || s.toLowerCase().includes("vector"));
    }
    if (catLower === "motion graphics") {
      return titleLower.includes("motion") || titleLower.includes("video") || designer.skills.some(s => s.toLowerCase().includes("motion") || s.toLowerCase().includes("blender"));
    }
    if (catLower === "packaging") {
      return titleLower.includes("packag") || titleLower.includes("label") || designer.skills.some(s => s.toLowerCase().includes("packag") || s.toLowerCase().includes("dieline"));
    }
    if (catLower === "3d design") {
      return titleLower.includes("3d") || titleLower.includes("render") || titleLower.includes("architect") || designer.skills.some(s => s.toLowerCase().includes("3d") || s.toLowerCase().includes("render") || s.toLowerCase().includes("blender"));
    }
    return false;
  }).sort((a, b) => b.scoreBreakdown.total - a.scoreBreakdown.total);

  return (
    <div id="browse-designers-tab" className="space-y-10">
      
      {/* HEADER BANNER CARD */}
      <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-8 sm:p-12 relative shadow-2xl overflow-hidden text-center flex flex-col items-center">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#5b4dff]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Find Your Perfect Design Partner
          </h1>
          <p className="text-md sm:text-lg text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            Connecting global brands with Africa&apos;s top creative minds.
          </p>

          {/* Centered Search controller */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="relative shadow-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#080715] border border-slate-800 hover:border-slate-705 rounded-full pl-12 pr-20 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5b4dff]/40 focus:border-[#5b4dff] transition-all"
                placeholder="Search designers by skill, industry, or name..."
              />
              {searchTerm && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white font-extrabold text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 bg-[#5b4dff]/20 rounded-full border border-[#5b4dff]/45 text-[#a08aff]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>
            
            {/* Clickable query tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="text-[10px] uppercase font-mono font-black text-slate-500 mr-2">Trending:</span>
              <button onClick={() => handleSearchChange("Luxury branding")} className="text-[10px] font-bold px-3 py-1 border border-slate-900 bg-slate-950/60 hover:border-[#8e6fff]/30 rounded-full text-slate-400 hover:text-[#a08aff] transition-all cursor-pointer">
                #Luxury branding
              </button>
              <button onClick={() => handleSearchChange("UI/UX Designer")} className="text-[10px] font-bold px-3 py-1 border border-slate-900 bg-slate-950/60 hover:border-[#8e6fff]/30 rounded-full text-slate-400 hover:text-[#a08aff] transition-all cursor-pointer">
                #UI/UX systems
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY SELECTOR SLIDERS */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-[#090815] border border-slate-900 p-2 rounded-2xl max-w-fit mx-auto shadow-md">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat 
                ? "bg-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/15 border border-[#7c6eff]" 
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* COLLAPSIBLE PLAYGROUND ACCORDION TRIGGER */}
      <div className="bg-[#100f24]/30 border border-slate-900 rounded-2xl overflow-hidden p-4 flex flex-col max-w-5xl mx-auto space-y-3 shadow-md">
        <button
          type="button"
          onClick={() => setShowAiDeepMatcher(!showAiDeepMatcher)}
          className="flex items-center justify-between text-xs font-black text-slate-400 hover:text-[#8e6fff] transition-colors py-1 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2 font-mono uppercase tracking-widest text-[#8e6fff]">
            <Cpu className="w-4 h-4 text-[#8e6fff] animate-spin" style={{ animationDuration: "6s" }} />
            ⚡ AI Deep-Matcher Core &amp; Portfolio Analyzer Lab {showAiDeepMatcher ? "(ACTIVE)" : "(COLLAPSED)"}
          </span>
          <span className="text-xs bg-[#5b4dff]/10 border border-[#5b4dff]/25 px-2.5 py-0.5 rounded-full text-[#8e6fff]">
            {showAiDeepMatcher ? "Close Sandbox Panel" : "Expand Sandbox Controls"}
          </span>
        </button>

        {showAiDeepMatcher && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-3 border-t border-slate-900 animate-fadeIn">
            {/* Left Score telemetries */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-sm font-bold text-white block">AI Semantic Matching Scoring Breakdown</span>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Describe your project, and our system dynamically calculates a matching coefficient for each candidate:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px] text-center">
                <div className="p-2 rounded-xl border border-slate-900 bg-slate-950/60 font-semibold text-slate-300">
                  <strong className="text-[#8e6fff] block text-xs">35%</strong>
                  <span className="text-slate-500 block mt-0.5">Skill Fit</span>
                </div>
                <div className="p-2 rounded-xl border border-slate-900 bg-slate-950/60 font-semibold text-slate-300">
                  <strong className="text-[#8e6fff] block text-xs">25%</strong>
                  <span className="text-slate-500 block mt-0.5">Portfolio rel.</span>
                </div>
                <div className="p-2 rounded-xl border border-slate-900 bg-slate-950/60 font-semibold text-slate-300">
                  <strong className="text-emerald-400 block text-xs">15%</strong>
                  <span className="text-slate-500 block mt-0.5">Experience</span>
                </div>
                <div className="p-2 rounded-xl border border-slate-900 bg-slate-950/60 font-semibold text-slate-300">
                  <strong className="text-yellow-400 block text-xs">25%</strong>
                  <span className="text-slate-500 block mt-0.5">Response Load</span>
                </div>
              </div>
            </div>

            {/* Simulation Block */}
            <div className="lg:col-span-5 bg-[#080718]/90 border border-slate-850 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <UploadCloud className="w-4 h-4 text-[#8e6fff]" />
                <strong className="text-xs text-white">Interactive Training Lab</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <label className="text-slate-500 block mb-0.5">Target Artist</label>
                  <select 
                    value={selectedDesignerForUpload} 
                    onChange={(e) => setSelectedDesignerForUpload(e.target.value)}
                    className="w-full bg-[#0d0c1d] border border-slate-800 py-1.5 rounded text-white text-[10px]"
                  >
                    {designersList.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-505 block mb-0.5">Upload Preset</label>
                  <select 
                    value={uploadPresetImg}
                    onChange={(e) => setUploadPresetImg(e.target.value)}
                    className="w-full bg-[#0d0c1d] border border-slate-800 py-1.5 rounded text-white text-[10px]"
                  >
                    <option value="">-- Choose preset --</option>
                    {uploadPresetOptions.map((o, idx) => (
                      <option key={idx} value={o.image}>{o.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {uploadPresetImg && (
                <div className="relative aspect-[4/1] rounded-lg overflow-hidden border border-slate-800">
                  <Image src={uploadPresetImg} alt="Preview" fill className="object-cover opacity-60" referrerPolicy="no-referrer" />
                  {analyzingPortfolio && (
                    <div className="absolute inset-x-0 h-0.5 bg-[#8e6fff] animate-bounce top-2" />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleSimulatePortfolioUpload}
                disabled={!uploadPresetImg || analyzingPortfolio}
                className="w-full bg-[#5b4dff] hover:bg-[#7143ff] text-white font-extrabold text-[10px] py-2 rounded-lg cursor-pointer disabled:opacity-45"
              >
                {analyzingPortfolio ? "Extracting style metadata..." : "🔗 Analyze Style Vectors & Match Candidate"}
              </button>

              {(extracLog.length > 0 || uploadSuccess) && (
                <div className="bg-black/95 p-2.5 rounded font-mono text-[9px] text-yellow-500 max-h-20 overflow-y-auto">
                  {extracLog.map((log, index) => <span key={index} className="block">&gt; {log}</span>)}
                  {uploadSuccess && <span className="text-emerald-455 block font-bold">&gt; Re-rank computed! Profile updated!</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DUAL-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: SIDEBAR FILTERS PANEL */}
        <div className="lg:col-span-1 bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow-xl lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
            <h3 className="text-sm uppercase font-black text-white tracking-wider flex items-center gap-1.5">
              <span>FILTERS</span>
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#8e6fff] hover:text-[#a08aff] bg-transparent cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-1 gap-6 md:gap-8 lg:gap-6">
            {/* Competencies Group */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold text-slate-505 tracking-wider block font-mono text-[#8e6fff]">Competencies</span>
              <div className="space-y-2.5">
                {[
                  { value: "Brand Design", label: "Brand Design" },
                  { value: "UI/UX", label: "UI / UX" },
                  { value: "3D Motion", label: "3D & Motion" }
                ].map((comp) => {
                  const checked = selectedCompetencies.includes(comp.value);
                  return (
                    <label key={comp.value} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCompetency(comp.value)}
                        className="rounded border-slate-800 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="group-hover:text-white transition-colors">{comp.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Location Group */}
            <div className="space-y-3 md:pt-0 border-t border-slate-900/40 pt-6 md:border-t-0 lg:border-t lg:border-slate-900 lg:pt-6">
              <span className="text-xs uppercase font-extrabold text-slate-505 tracking-wider block font-mono">Location</span>
              <div className="space-y-2.5">
                {["Lagos, Nigeria", "Nairobi, Kenya", "Cape Town, SA", "Accra, Ghana"].map((loc) => {
                  const checked = selectedLocations.includes(loc);
                  return (
                    <label key={loc} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleLocation(loc)}
                        className="rounded border-slate-800 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="group-hover:text-white transition-colors">{loc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Experience Years Group */}
            <div className="space-y-3 md:pt-0 border-t border-slate-900/40 pt-6 md:border-t-0 lg:border-t lg:border-slate-900 lg:pt-6">
              <span className="text-xs uppercase font-extrabold text-slate-505 tracking-wider block font-mono">Experience</span>
              <div className="space-y-2.5">
                {["Junior (1-2 yrs)", "Mid-weight (3-5 yrs)", "Senior (5+ yrs)"].map((exp) => {
                  const checked = selectedExperiences.includes(exp);
                  return (
                    <label key={exp} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleExperience(exp)}
                        className="rounded border-slate-800 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                      />
                      <span className="group-hover:text-white transition-colors">{exp}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="space-y-3 md:pt-0 border-t border-slate-900/40 pt-6 md:border-t-0 lg:border-t lg:border-slate-900 lg:pt-6">
              <span className="text-xs uppercase font-extrabold text-slate-505 tracking-wider block font-mono">Min. Rating</span>
              <div className="space-y-2">
                {[4.0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRatingFilter(minRatingFilter === rate ? null : rate)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                      minRatingFilter === rate 
                        ? "bg-[#5b4dff]/10 text-white border-[#5b4dff]/40" 
                        : "bg-slate-950/20 text-slate-400 border-slate-900 hover:text-slate-205"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-sans">
                      <span className="text-yellow-405 text-xs">★</span>
                      <span>({rate.toFixed(1)}+)</span>
                    </span>
                    <span>{minRatingFilter === rate ? "✓" : ""}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN DESIGNER CANDIDATES GRID list */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              Available Candidates ({computedList.length})
            </span>
            <div className="flex items-center gap-1 bg-[#090815] border border-slate-900 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setTalentTypeFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  talentTypeFilter === "all"
                    ? "bg-[#5b4dff] text-white shadow-md font-extrabold"
                    : "text-slate-450 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTalentTypeFilter("individual")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  talentTypeFilter === "individual"
                    ? "bg-[#5b4dff] text-white shadow-md font-extrabold"
                    : "text-slate-450 hover:text-white"
                }`}
              >
                Individuals
              </button>
              <button
                type="button"
                onClick={() => setTalentTypeFilter("agency")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  talentTypeFilter === "agency"
                    ? "bg-[#5b4dff] text-white shadow-md font-extrabold"
                    : "text-slate-450 hover:text-white"
                }`}
              >
                Agencies
              </button>
            </div>
          </div>

          {/* Symmetrical Competency Interactive Tagging Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-[#090815]/40 border border-slate-900/60 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-mono font-black text-slate-500 mr-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8e6fff]" />
              Filter Competency:
            </span>
            {[
              { value: "Brand Design", label: "Brand Design" },
              { value: "UI/UX", label: "UI / UX" },
              { value: "3D Motion", label: "3D & Motion" }
            ].map((comp) => {
              const active = selectedCompetencies.includes(comp.value);
              return (
                <button
                  key={comp.value}
                  type="button"
                  onClick={() => handleToggleCompetency(comp.value)}
                  className={`text-[10px] sm:text-xs font-black px-3.5 py-2 border rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-[#5b4dff] text-white border-[#5b4dff] shadow-xl shadow-[#5b4dff]/20 scale-[1.03]"
                      : "bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-white"
                  }`}
                >
                  <span>{active ? "✓" : "#"}</span>
                  <span>{comp.label}</span>
                </button>
              );
            })}
            {selectedCompetencies.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCompetencies([])}
                className="text-[10px] font-mono font-black uppercase text-[#8e6fff] hover:text-[#a08aff] pl-2 transition-colors cursor-pointer bg-transparent border-none focus:outline-none"
              >
                Clear Competencies
              </button>
            )}
          </div>

          {computedList.length === 0 ? (
            <div className="py-20 text-center space-y-3 border border-dashed border-slate-900 rounded-3xl">
              <Layers className="w-10 h-10 text-slate-600 mx-auto opacity-70" />
              <span className="text-sm font-black text-slate-300 block font-sans">No creators found</span>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                Try clearing filters or search terminology to fetch all designers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {computedList.map(({ designer, scoreBreakdown }) => {
                const isScoreExpanded = expandedScoreDesignerId === designer.id;
                const monogram = getBrandMonogramInfo(designer.id, designer.name);
                const previews = getDesignerThumbnails(designer.id);

                return (
                  <div 
                    key={designer.id}
                    className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all shadow-xl hover:shadow-2xl relative flex flex-col justify-between"
                  >
                    {/* Badge availability and compatibility score overlay in top right */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                      <div className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur rounded-full border border-slate-800 animate-fadeIn">
                        <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-mono font-black text-slate-300">{scoreBreakdown.total}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Brand monogram & Details Row */}
                      <div className="flex items-start gap-4">
                        {/* Custom brand Monogram container box exactly like mockup */}
                        <div className={`w-14 h-14 rounded-2xl ${monogram.bgClass} flex items-center justify-center font-mono text-[10px] font-bold ${monogram.textClass} shadow-inner shrink-0 leading-none select-none tracking-tight`}>
                          {monogram.text}
                        </div>

                        <div className="pt-0.5 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 leading-none">
                            <span className="text-md font-black text-white block hover:text-[#8e6fff] transition-colors cursor-pointer select-none" onClick={() => setSelectedDesigner(designer)}>
                              {designer.name}
                            </span>
                            {designer.talentType === "agency" ? (
                              <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 font-bold tracking-wide uppercase font-mono leading-none shrink-0">
                                Agency Team
                              </span>
                            ) : (
                              <span className="text-[8px] bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold tracking-wide uppercase font-mono leading-none shrink-0">
                                Individual
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold">
                            <span className="text-slate-400 flex items-center gap-1 leading-none">
                              <MapPin className="w-3 h-3 text-[#5b4dff]" />
                              {designer.city}, {designer.country}
                            </span>
                            {designer.talentType === "agency" && designer.teamSize && (
                              <span className="text-slate-450 flex items-center gap-1 leading-none font-bold">
                                <Users className="w-3 h-3 text-red-400" />
                                Team of {designer.teamSize}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Professional title and description block */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e6fff] block font-mono">
                          {designer.title}
                        </span>
                        
                        {/* Skills category row */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {designer.skills.slice(0, 3).map(sk => (
                            <span key={sk} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/70 border border-slate-900 text-[#a08aff] uppercase tracking-wider select-none">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Availability signals & rating counts block */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900 pb-1">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-450 text-xs">⭐</span>
                          <span className="text-white font-black">{designer.rating}</span>
                          <span className="text-slate-500 font-bold">({designer.completedJobs} reviews)</span>
                        </div>

                        <span className={`text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${getStatusColor(designer.availability)}`}>
                          {designer.availability?.toUpperCase()}
                        </span>
                      </div>

                      {/* HORIZONTAL THUMBNAILS TRIO COLLECTION */}
                      <div className="grid grid-cols-3 gap-2 pt-2 pb-1">
                        {previews.map((src, index) => (
                          <div key={index} className="aspect-square relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-sm group cursor-pointer" onClick={() => setSelectedDesigner(designer)}>
                            <Image 
                              src={src} 
                              alt={`Artwork sample ${index + 1}`} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Accordion view matching weights metrics */}
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => setExpandedScoreDesignerId(isScoreExpanded ? null : designer.id)}
                          className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-[#8e6fff] transition-colors py-1 cursor-pointer font-bold select-none"
                        >
                          <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest">
                            <Sliders className="w-3 h-3 text-[#5b4dff]" />
                            {isScoreExpanded ? "Hide Scoring Weights" : "Show Compatibility Fit Breakdown"}
                          </span>
                          {isScoreExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isScoreExpanded && (
                          <div className="mt-3 bg-black/50 border border-slate-800 p-3 rounded-xl space-y-2.5 animate-fadeIn text-[10px] font-mono leading-none">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Skills Compliance:</span>
                              <strong className="text-[#8e6fff]">{scoreBreakdown.skills} / 35pts</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Portfolio Relevance:</span>
                              <strong className="text-[#8e6fff]">{scoreBreakdown.portfolio} / 25pts</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Experience Domain:</span>
                              <strong className="text-[#8e6fff]">{scoreBreakdown.experience} / 15pts</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Response &amp; Load rate:</span>
                              <strong className="text-emerald-450">{scoreBreakdown.availability + scoreBreakdown.responsiveness} / 15pts</strong>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* DUAL BUTTON FOOTER: VIEW PROFILE & HIRE NOW */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-3 border-t border-slate-900">
                      <button 
                        type="button"
                        onClick={() => setSelectedDesigner(designer)}
                        className="bg-transparent hover:bg-slate-950 text-slate-300 hover:text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center font-sans tracking-tight border border-slate-800"
                      >
                        View Profile
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setChatDesigner(designer); setSelectedDesigner(designer); setActiveTab("messaging"); }}
                        className="bg-[#5b4dff] hover:bg-[#7140ff] text-white font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 select-none active:scale-[0.99]"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Hire Now</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* CUSTOM PRECISE INTERACTIVE PAGINATION BLOCKS */}
          <div className="pt-10 flex items-center justify-center gap-2">
            <button className="p-2.5 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950/20 text-slate-400 hover:text-white transition-all text-xs font-bold leading-none cursor-not-allowed">
              &lt;
            </button>
            <button className="w-10 h-10 rounded-xl bg-[#5b4dff] text-white font-black text-xs transition-all leading-none shadow-md">
              1
            </button>
            <button className="w-10 h-10 rounded-xl border border-slate-900 bg-slate-950/20 hover:border-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-all leading-none">
              2
            </button>
            <button className="w-10 h-10 rounded-xl border border-slate-900 bg-slate-950/20 hover:border-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-all leading-none">
              3
            </button>
            <span className="text-slate-600 font-bold px-1.5 flex items-end tracking-widest text-xs h-6 select-none font-mono">...</span>
            <button className="w-10 h-10 rounded-xl border border-slate-900 bg-slate-950/20 hover:border-slate-800 text-slate-400 hover:text-white font-bold text-xs transition-all leading-none">
              12
            </button>
            <button className="p-2.5 rounded-xl border border-slate-900 bg-slate-950/20 text-slate-400 hover:text-white transition-all text-xs font-bold leading-none">
              &gt;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
