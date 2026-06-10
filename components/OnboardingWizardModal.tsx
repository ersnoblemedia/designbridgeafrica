"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sparkles, X, ChevronLeft, ChevronRight, Sliders, Check, 
  CheckCircle2, Users, Briefcase, Globe, Landmark, Target, Award,
  Palette, PenTool, Smartphone, Box, Share2, Brush, Layers, 
  MessageSquare, ShieldCheck, FileText, HelpCircle, LayoutGrid, Zap, Search,
  Plus, Link, MapPin, Star, UploadCloud, Folder, Eye, Lock
} from "lucide-react";
import { useAuth } from "./AuthProvider";

interface OnboardingWizardModalProps {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  userRole: "Client" | "Designer" | "Admin";
  setUserRole: (role: "Client" | "Designer" | "Admin") => void;
  setActiveTab: (tab: "home" | "designers" | "services" | "jobs" | "messaging" | "admin" | "dashboard" | "invoicing" | "checkout") => void;
}

export default function OnboardingWizardModal({
  onboardingStep,
  setOnboardingStep,
  userRole,
  setUserRole,
  setActiveTab,
}: OnboardingWizardModalProps) {
  const { user, profile } = useAuth();
  
  // Local wizard steps: 1 = Welcome & Role selection, 2 = Preferences/Expertise, 3 = Setup or Completion (for Client), 4 = Preview (for Designer)
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<"Client" | "Designer">("Designer");
  const [onboardingSubtype, setOnboardingSubtype] = useState<"individual_hire" | "agency_hire" | "designer_work">("designer_work");

  // Client/Agency Mode state
  const [clientDomains, setClientDomains] = useState<string[]>(["UI/UX Design", "Branding", "Logo Design"]);
  
  // Designer Mode state: Skills & Expertise (Screenshot 1)
  const [designerDomains, setDesignerDomains] = useState<string[]>(["UI/UX Design", "Brand Identity"]);
  const [customSpecialty, setCustomSpecialty] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [designerExperience, setDesignerExperience] = useState<"senior" | "mid" | "junior">("senior");
  
  // Portfolio Website & Social Links (Screenshot 1)
  const [portfolioLink, setPortfolioLink] = useState<string>("https://yourportfolio.com");
  const [dribbbleLink, setDribbbleLink] = useState<string>("dribbble.com/username");
  const [behanceLink, setBehanceLink] = useState<string>("behance.net/username");

  // Designer Portfolio Setup State (Screenshot 2)
  const [projectTitle, setProjectTitle] = useState<string>("Neo-Safari Brand Identity");
  const [projectCategory, setProjectCategory] = useState<string>("Visual Identity");
  const [projectDescription, setProjectDescription] = useState<string>("A luxury brand and packaging environment designed for an upscale eco-lodge in the heart of East Africa.");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Gallery list which the user can dynamically append to!
  const [portfolioGallery, setPortfolioGallery] = useState<Array<{ id: string; url: string; label: string }>>([
    { id: "g1", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80", label: "Gradient Mesh Mockup" },
    { id: "g2", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80", label: "Studio Interior Concept" },
    { id: "g3", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80", label: "Vibrant Poster Geometry" },
  ]);

  // If the control plane hasn't triggered onboarding, do not display anything
  if (onboardingStep === 0) return null;

  // Visual Design Specialties preset dictionary (Screenshot 1)
  const SPECIALTY_PRESETS = [
    { 
      id: "uiux", 
      name: "UI/UX Design", 
      pic: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&q=80",
      desc: "Web & Mobile Platforms"
    },
    { 
      id: "brand", 
      name: "Brand Identity", 
      pic: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
      desc: "Stationery & Guideline Systems"
    },
    { 
      id: "illustration", 
      name: "Illustration", 
      pic: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80",
      desc: "Custom Contemporary Prints"
    },
    { 
      id: "motion", 
      name: "Motion Design", 
      pic: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80",
      desc: "Animated Cultural Promos"
    },
    { 
      id: "product", 
      name: "Product Design", 
      pic: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80",
      desc: "Molded FMCG Packaging"
    },
    { 
      id: "typo", 
      name: "Typography", 
      pic: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
      desc: "Custom Lettering & Typeface"
    },
    { 
      id: "web", 
      name: "Web Design", 
      pic: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80",
      desc: "High-Performing Frontends"
    }
  ];

  // Helper toggle for designer domains
  const handleToggleDesignerDomain = (domainName: string) => {
    if (designerDomains.includes(domainName)) {
      setDesignerDomains(designerDomains.filter(item => item !== domainName));
    } else {
      setDesignerDomains([...designerDomains, domainName]);
    }
  };

  const handleAddCustomSpecialty = () => {
    if (!customSpecialty.trim()) return;
    if (!designerDomains.includes(customSpecialty.trim())) {
      setDesignerDomains([...designerDomains, customSpecialty.trim()]);
    }
    setCustomSpecialty("");
    setShowCustomInput(false);
  };

  // Safe toggler for client domains
  const handleToggleClientDomain = (domain: string) => {
    if (clientDomains.includes(domain)) {
      setClientDomains(clientDomains.filter(d => d !== domain));
    } else {
      setClientDomains([...clientDomains, domain]);
    }
  };

  const handleRoleOptionClick = (role: "Client" | "Designer", subtype: "individual_hire" | "agency_hire" | "designer_work") => {
    setSelectedRole(role);
    setOnboardingSubtype(subtype);
  };

  const handleNextStep = () => {
    const isDesigner = selectedRole === "Designer";
    const maxSteps = isDesigner ? 4 : 3;
    if (step < maxSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Simulated live file upload
  const handleSimulateUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Append a new beautiful premium visual mockup
            const randomID = `rand_${Date.now()}`;
            const images = [
              "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80",
              "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&q=80",
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80"
            ];
            const chosenUrl = images[Math.floor(Math.random() * images.length)];
            setPortfolioGallery(prevList => [...prevList, { id: randomID, url: chosenUrl, label: "Uploaded Asset " + (prevList.length + 1) }]);
            setIsUploading(false);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleFinishOnboarding = async (targetTab: "designers" | "home" | "dashboard") => {
    // Commit the selected role to Firebase and global auth profile
    await setUserRole(selectedRole);
    
    // Close the onboarding flow
    setOnboardingStep(0);
    
    // Reroute active tab according to user's onboarding completion selection
    if (targetTab === "designers") {
      setActiveTab("designers");
    } else if (targetTab === "dashboard") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("home");
    }
  };

  const userDisplayName = profile?.displayName || user?.displayName || "Alex Johnson";
  const firstName = userDisplayName.split(" ")[0];
  const userPhotoUrl = profile?.photoURL || user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";

  // Dynamic values for step-by-step indicators
  const isDesigner = selectedRole === "Designer";
  const totalSteps = isDesigner ? 4 : 3;

  return (
    <div id="onboarding-full-screen-takeover" className="fixed inset-0 z-[100] overflow-y-auto bg-[#090815] text-slate-300 flex flex-col justify-between font-sans min-h-screen">
      
      {/* 1. TOP HIGH-POLISHED HEADER */}
      <header className="border-b border-slate-900/80 bg-[#090815]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            className="h-8 w-auto object-contain" 
            alt="DesignBridge Africa" 
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="text-sm font-black text-white tracking-widest uppercase block font-mono">
              DesignBridge
            </span>
            <span className="text-[10px] text-[#8e6fff] font-bold tracking-wider leading-none uppercase block font-mono">
              Africa Network
            </span>
          </div>
        </div>

        {/* CONTROLLER ACTION PILLS */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-bold block">
              Step {step} of {totalSteps}
            </span>
            <span className="text-[11px] text-[#8e6fff] font-bold tracking-wide uppercase block font-mono">
              {isDesigner ? (
                <>
                  {step === 1 && "Personalization"}
                  {step === 2 && "Skills & Expertise"}
                  {step === 3 && "Portfolio Setup"}
                  {step === 4 && "Profile Preview"}
                </>
              ) : (
                <>
                  {step === 1 && "Personalization"}
                  {step === 2 && "Preferences"}
                  {step === 3 && "Verified Setup"}
                </>
              )}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#121129] border border-slate-800/60 py-1 px-2.5 rounded-full">
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
              <Image 
                src={userPhotoUrl} 
                alt="Profile Avatar" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
              {userDisplayName}
            </span>
          </div>

          <button 
            type="button"
            onClick={() => setOnboardingStep(0)}
            className="p-1.5 rounded-lg border border-slate-800 bg-[#0f0e22] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Dismiss Onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MIDDLE VIEWPORTS FLOW WIZARD */}
      <main className="flex-grow flex w-full">
        
        {/* STEP 1: WELCOME & ROLE SELECTION (Shared) */}
        {step === 1 && (
          <div className="flex-grow flex flex-col justify-center py-12 px-6 max-w-4xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Headers titles */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5b4dff]/10 border border-[#5b4dff]/20 text-xs font-bold text-[#8e6fff] font-mono uppercase tracking-widest">
                <Sparkles className="w-3 h-3 animate-pulse text-yellow-400" /> Welcome &amp; Personalization
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome to DesignBridge <span className="text-[#8e6fff]">Africa.</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-lg mx-auto font-medium leading-relaxed">
                Let&apos;s personalize your experience. Are you looking to hire world-class African creative talent or build global client relations?
              </p>
            </div>

            {/* Interactive Grid Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              
              {/* Option A: CLIENT INDIVIDUAL */}
              <button
                type="button"
                onClick={() => handleRoleOptionClick("Client", "individual_hire")}
                className={`text-left p-6 rounded-2xl border transition-all relative flex flex-col justify-between space-y-6 h-full cursor-pointer focus:outline-none ${
                  selectedRole === "Client" && onboardingSubtype === "individual_hire"
                    ? "bg-[#141235]/65 border-[#5b4dff] shadow-2xl scale-[1.02] ring-1 ring-[#5b4dff]/20"
                    : "bg-[#0c0b1e]/40 border-slate-800/80 hover:bg-[#0c0a1f] hover:border-slate-700"
                }`}
              >
                <div className="w-full h-24 rounded-xl relative overflow-hidden bg-slate-950/60 border border-slate-900 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80"
                    alt="Hiring designer visual focus"
                    fill
                    className="object-cover opacity-60 grayscale-[15%] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#a08aff] font-mono font-bold">Individual Hires</span>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-black text-white block">
                      I want to hire talent
                    </strong>
                    <span className="text-[9px] bg-[#5b4dff] text-white px-2 py-0.5 rounded-full font-extrabold uppercase font-mono tracking-wider shadow">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-semibold">
                    Access top-tier vetted creative freelancers across Africa for your next big project. Scale fast with verified, premium specialists.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/40 w-full text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Role: Client</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedRole === "Client" && onboardingSubtype === "individual_hire"
                      ? "bg-[#5b4dff] border-transparent text-white"
                      : "border-slate-800 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </button>

              {/* Option B: DESIGNER WORK - DEFAULT FOR DESIGNER REQUESTS */}
              <button
                type="button"
                onClick={() => handleRoleOptionClick("Designer", "designer_work")}
                className={`text-left p-6 rounded-2xl border transition-all relative flex flex-col justify-between space-y-6 h-full cursor-pointer focus:outline-none ${
                  selectedRole === "Designer"
                    ? "bg-[#141235]/65 border-[#5b4dff] shadow-2xl scale-[1.02] ring-1 ring-[#5b4dff]/20"
                    : "bg-[#0c0b1e]/40 border-slate-800/80 hover:bg-[#0c0a1f] hover:border-slate-700"
                }`}
              >
                <div className="w-full h-24 rounded-xl relative overflow-hidden bg-slate-950/60 border border-slate-900 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80"
                    alt="Looking for work visual focus"
                    fill
                    className="object-cover opacity-60 grayscale-[15%] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#a08aff] font-mono font-bold">Showcase Portfolios</span>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <strong className="text-sm font-black text-white block">
                    I&apos;m a creative specialist
                  </strong>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-semibold">
                    Join our premier community of world-class creators, demonstrate your cultural aesthetic, and land amazing global enterprise contracts.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/40 w-full text-xs">
                  <span className="text-[10px] text-[#8e6fff] font-bold uppercase font-mono">Role: Designer</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedRole === "Designer"
                      ? "bg-[#5b4dff] border-transparent text-white"
                      : "border-slate-800 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </button>

              {/* Option C: AGENCY STUDIO */}
              <button
                type="button"
                onClick={() => handleRoleOptionClick("Client", "agency_hire")}
                className={`text-left p-6 rounded-2xl border transition-all relative flex flex-col justify-between space-y-6 h-full cursor-pointer focus:outline-none ${
                  selectedRole === "Client" && onboardingSubtype === "agency_hire"
                    ? "bg-[#141235]/65 border-[#5b4dff] shadow-2xl scale-[1.02] ring-1 ring-[#5b4dff]/20"
                    : "bg-[#0c0b1e]/40 border-slate-800/80 hover:bg-[#0c0a1f] hover:border-slate-700"
                }`}
              >
                <div className="w-full h-24 rounded-xl relative overflow-hidden bg-slate-950/60 border border-slate-900 shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80"
                    alt="Hiring creative studios visual focus"
                    fill
                    className="object-cover opacity-60 grayscale-[15%] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-[#a08aff] font-mono font-bold">Studio Enterprise</span>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  <strong className="text-sm font-black text-white block">
                    We are a design agency
                  </strong>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-semibold">
                    Showcase your studio&apos;s united portfolio, display team size limits, match with multi-skilled assignments, and manage operations.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900/40 w-full text-xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Role: Studio Agency</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedRole === "Client" && onboardingSubtype === "agency_hire"
                      ? "bg-[#5b4dff] border-transparent text-white"
                      : "border-slate-800 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </button>

            </div>

            {/* Bottom Actions Row */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[#5b4dff] text-white font-black text-sm shadow-xl shadow-[#5b4dff]/20 hover:bg-[#6c5eff] transition-all cursor-pointer group"
              >
                Continue to requirements
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREFERENCES (CLIENT FLOW) OR SKILLS & EXPERTISE (DESIGNER FLOW) */}
        {step === 2 && !isDesigner && (
          /* Client preference flow */
          <div className="flex-grow flex flex-col justify-center py-10 px-6 max-w-2xl mx-auto w-full space-y-8 animate-fadeIn">
            {/* Visual Indicator Progress Header */}
            <div className="space-y-3 w-full">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-[#8e6fff] tracking-widest uppercase">
                <span>Step 2 of 3</span>
                <span>40% Complete</span>
              </div>
              <div className="w-full bg-[#121129] rounded-full h-1.5 overflow-hidden border border-slate-800/40">
                <div className="bg-[#5b4dff] h-full rounded-full transition-all duration-300" style={{ width: "40%" }} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Tell us about your needs.
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Select the categories that best describe your upcoming projects. We&apos;ll curate designers specifically for your niche.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {[
                { name: "Graphic Design", desc: "Layout & Editorial Systems", icon: Layers, color: "text-amber-400 bg-amber-400/10" },
                { name: "Branding", desc: "Identity & Strategy", icon: Palette, color: "text-[#8e6fff] bg-[#8e6fff]/10" },
                { name: "Logo Design", desc: "Unique Brand Marks", icon: PenTool, color: "text-cyan-400 bg-cyan-400/10" },
                { name: "UI/UX Design", desc: "Web & Mobile Apps", icon: Smartphone, color: "text-indigo-400 bg-indigo-400/10" },
                { name: "Packaging", desc: "Product Box & Labels", icon: Box, color: "text-emerald-400 bg-emerald-400/10" },
                { name: "Social Media", desc: "Ad Creative & Content", icon: Share2, color: "text-pink-400 bg-pink-400/10" },
                { name: "Illustration", desc: "Custom Digital Art", icon: Brush, color: "text-sky-400 bg-sky-400/10" }
              ].map((category) => {
                const isSelected = clientDomains.includes(category.name);
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => handleToggleClientDomain(category.name)}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer relative ${
                      isSelected
                        ? "bg-[#141235]/65 border-[#5b4dff] ring-2 ring-[#5b4dff]/20 text-white"
                        : "bg-[#0f0e22]/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-800"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${category.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pr-8">
                      <strong className="text-sm font-bold text-white block leading-tight truncate">{category.name}</strong>
                      <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{category.desc}</span>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected ? "bg-[#5b4dff] border-transparent text-white" : "border-slate-800 text-transparent"
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-4 rounded-xl bg-[#5b4dff] text-white font-black text-sm shadow-xl shadow-[#5b4dff]/20 hover:bg-[#6c5eff] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest font-mono"
              >
                Next Step
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="text-xs text-slate-500 hover:text-white font-bold text-center transition-all cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 2 && isDesigner && (
          /* Designer flow: Skills & Expertise (Screenshot 1) */
          <div className="flex-grow flex flex-col justify-center py-10 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full space-y-10 animate-fadeIn">
            
            {/* Header section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-[#5b4dff] tracking-widest uppercase">
                <span>ONBOARDING</span>
                <span className="text-slate-400">40% Complete (Step 2 of 4)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
                Skills &amp; Expertise
              </h1>
              <div className="w-full bg-[#121129] rounded-full h-1.5 overflow-hidden border border-slate-800/40">
                <div className="bg-[#5b4dff] h-full rounded-full transition-all duration-300" style={{ width: "40%" }} />
              </div>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                Select your design specialties and specify your experience level. This helps us match you with projects that fit your unique creative DNA.
              </p>
            </div>

            {/* Grid container with design specialties & experience levels */}
            <div className="space-y-8">
              
              {/* SECTION A: DESIGN SPECIALTIES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest font-mono text-[#8e6fff]">
                  <Palette className="w-4 h-4 text-[#5b4dff]" />
                  <span>Design Specialties</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {SPECIALTY_PRESETS.map((item) => {
                    const isSelected = designerDomains.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleDesignerDomain(item.name)}
                        className={`group relative text-left h-36 rounded-2xl overflow-hidden border transition-all cursor-pointer focus:outline-none flex flex-col justify-between p-4 ${
                          isSelected
                            ? "bg-[#141235]/60 border-[#5b4dff] ring-2 ring-[#5b4dff]/40 shadow-xl"
                            : "bg-[#0c0b1e]/80 border-slate-850 hover:bg-[#12112c]/40 hover:border-slate-700"
                        }`}
                      >
                        {/* Background Thumbnail Image Overlay */}
                        <div className="absolute inset-0 bg-slate-950/60 z-0">
                          <Image 
                            src={item.pic} 
                            alt={item.name} 
                            fill
                            className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Top corner alignment marker checkbox */}
                        <div className="self-end z-10">
                          <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected 
                              ? "bg-[#5b4dff] border-transparent text-white" 
                              : "border-slate-800 bg-[#090815]/95 text-transparent"
                          }`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>

                        {/* Bottom label indicator */}
                        <div className="z-10 space-y-0.5">
                          <strong className="text-xs sm:text-sm font-black text-white block leading-tight">
                            {item.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-semibold block leading-none truncate">
                            {item.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Add Other Visual Option (Screenshot 2) */}
                  {showCustomInput ? (
                    <div className="p-4 rounded-2xl border border-slate-850 bg-[#121129]/60 flex flex-col justify-between space-y-2 h-36">
                      <span className="text-[10px] font-mono text-slate-500 font-bold block uppercase">Custom Tag</span>
                      <input 
                        type="text" 
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value)}
                        placeholder="e.g. 3D Game Art"
                        ref={(input) => input && input.focus()}
                        className="bg-slate-950 border border-slate-800 text-xs text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-[#5b4dff] w-full"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomSpecialty();
                        }}
                      />
                      <div className="flex gap-1.5 self-end">
                        <button 
                          onClick={() => setShowCustomInput(false)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-350 font-bold rounded-md"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddCustomSpecialty}
                          className="px-2 py-1 bg-[#5b4dff] hover:bg-[#6c5eff] text-[10px] text-white font-bold rounded-md"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className="group relative text-center h-36 rounded-2xl border border-dashed border-slate-800 bg-[#090815]/40 hover:bg-[#12112a]/30 hover:border-[#5b4dff]/40 transition-all cursor-pointer flex flex-col items-center justify-center p-4 gap-2 text-slate-500 hover:text-slate-300"
                    >
                      <div className="w-8 h-8 rounded-full border border-dashed border-slate-800 group-hover:border-[#5b4dff]/50 flex items-center justify-center text-slate-500 group-hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                      <strong className="text-xs font-bold font-sans">Add Other</strong>
                    </button>
                  )}
                </div>
              </div>

              {/* TWO COLUMN ROW WITH EXPERIENCE LEVEL AND PORTFOLIO LINKS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                
                {/* SECTION B: EXPERIENCE LEVEL (Screenshot 1) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest font-mono text-[#8e6fff]">
                    <Sliders className="w-4 h-4 text-[#5b4dff]" />
                    <span>Experience Level</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "senior", title: "Senior / Lead", desc: "6+ years professional experience" },
                      { id: "mid", title: "Mid-Level", desc: "3-5 years professional experience" },
                      { id: "junior", title: "Junior", desc: "0-2 years professional experience" }
                    ].map((level) => {
                      const isSelected = designerExperience === level.id;
                      return (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setDesignerExperience(level.id as "senior" | "mid" | "junior")}
                          className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected
                              ? "bg-[#141235]/60 border-[#5b4dff] shadow-md"
                              : "bg-[#0c0b1e]/60 border-slate-850 hover:bg-slate-900/40"
                          }`}
                        >
                          <div>
                            <strong className="text-sm font-black text-white block leading-tight">{level.title}</strong>
                            <span className="text-xs text-slate-400 block mt-1 tracking-wide font-medium">{level.desc}</span>
                          </div>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-[#5b4dff]" : "border-slate-800"
                          }`}>
                            {isSelected && <span className="w-2 animate-scaleIn h-2 rounded-full bg-[#5b4dff]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION C: PORTFOLIO & SOCIALS (Screenshot 1) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest font-mono text-[#8e6fff]">
                    <Globe className="w-4 h-4 text-[#5b4dff]" />
                    <span>Portfolio &amp; Socials</span>
                  </div>

                  <div className="space-y-4 bg-[#0a0918]/60 p-5 rounded-xl border border-slate-850">
                    {/* Portfolio Website input */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                        Portfolio Website
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={portfolioLink}
                          onChange={(e) => setPortfolioLink(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#5b4dff]"
                        />
                      </div>
                    </div>

                    {/* Dribbble profile */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                        Dribbble Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Palette className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={dribbbleLink}
                          onChange={(e) => setDribbbleLink(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#5b4dff]"
                        />
                      </div>
                    </div>

                    {/* Behance profile */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                        Behance Profile
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Brush className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={behanceLink}
                          onChange={(e) => setBehanceLink(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#5b4dff]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* PRIVACY & VERIFICATION CONTAINER AND NAVIGATION (Screenshot 1 Bottom) */}
            <div className="pt-4 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-5 bg-[#0c0b1f]/20 p-5 rounded-2xl border border-slate-850">
              <div className="flex items-center gap-4 text-left max-w-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 text-[#8e6fff]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Privacy &amp; Verification</strong>
                  <p className="text-[10.5px] text-slate-505 font-medium leading-normal text-slate-400 mt-0.5">
                    We&apos;ll review your links to verify your design skills. Checked resources remain hidden from general web visitors and are only visible to verified agency operators.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto self-stretch shrink-0 justify-end">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 hover:bg-slate-905 rounded-xl border border-slate-850 bg-slate-900/30 text-slate-400 hover:text-white transition-all cursor-pointer font-bold text-xs uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-[#5b4dff] hover:bg-[#6c5eff] text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-[#5b4dff]/20"
                >
                  Continue to Resume
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: CLIENT ALL SET PREVIEW (CLIENT) OR PORTFOLIO SETUP (DESIGNER) */}
        {step === 3 && !isDesigner && (
          /* Client Completed Welcome Screen (Screenshot 2 for Client) */
          <div className="flex-grow flex flex-col justify-center py-12 px-6 max-w-2xl mx-auto w-full text-center space-y-6 animate-fadeIn">
            
            {/* Glowing checkmark badge */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
              <div className="relative w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Check className="w-6 h-6 stroke-[3.5]" />
              </div>
            </div>

            {/* Overlap badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121129] border border-slate-800 max-w-max mx-auto shadow-md">
              <div className="flex -space-x-1.5 shrink-0">
                <Image className="w-5 h-5 rounded-full border border-slate-950 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80" alt="S1" width={20} height={20} />
                <Image className="w-5 h-5 rounded-full border border-slate-950 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80" alt="S2" width={20} height={20} />
                <Image className="w-5 h-5 rounded-full border border-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80" alt="S3" width={20} height={20} />
              </div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#a08aff] font-mono leading-none block">
                Curated experts ready for you
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                You&apos;re all set, {firstName}!
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                We&apos;ve curated a beautiful directory of African designers matching your specialties. Ready to start your first project brief and bring your vision to life?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto w-full">
              <button
                type="button"
                onClick={() => handleFinishOnboarding("home")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#5b4dff] text-white font-bold rounded-xl text-xs hover:bg-[#6c5eff] transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-[#5b4dff]/20"
              >
                <LayoutGrid className="w-4 h-4" />
                Go to Dashboard
              </button>
              
              <button
                type="button"
                onClick={() => handleFinishOnboarding("designers")}
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-800 bg-[#121124] text-slate-350 font-bold rounded-xl text-xs hover:border-slate-700 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider animate-pulse"
              >
                <Search className="w-4 h-4 text-[#8e6fff]" />
                Browse Designers
              </button>
            </div>

            {/* Quick Start Bento (Screenshot 2 bottom) */}
            <div className="pt-6 max-w-xl mx-auto w-full text-left space-y-4">
              <span className="text-[10px] font-bold text-[#8e6fff] tracking-widest uppercase font-mono block">
                ⚡ Quick Start Guide
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0c0b1e]/60 border border-slate-850 rounded-xl p-4 space-y-2">
                  <div className="w-7 h-7 bg-[#5b4dff]/15 rounded-lg flex items-center justify-center text-[#8e6fff]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <strong className="text-xs text-white block">Create Brief</strong>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Describe your project dimensions, budget levels &amp; timeline goals.
                  </p>
                </div>

                <div className="bg-[#0c0b1e]/60 border border-slate-850 rounded-xl p-4 space-y-2">
                  <div className="w-7 h-7 bg-[#5b4dff]/15 rounded-lg flex items-center justify-center text-[#8e6fff]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <strong className="text-xs text-white block">Message Experts</strong>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Instantly message selected specialists in our interactive workspace.
                  </p>
                </div>

                <div className="bg-[#0c0b1e]/60 border border-slate-850 rounded-xl p-4 space-y-2">
                  <div className="w-7 h-7 bg-[#5b4dff]/15 rounded-lg flex items-center justify-center text-[#8e6fff]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <strong className="text-xs text-white block">Safe Payments</strong>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Monetary milestones remain in secure escrow till you download works.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 text-xs font-semibold text-slate-500 font-mono">
              Need help? <a href="#co" className="text-[#8e6fff] hover:underline">Talk to an onboarding specialist</a>
            </div>
          </div>
        )}

        {step === 3 && isDesigner && (
          /* DESIGNER FLOW - STEP 3: PORTFOLIO SETUP (Screenshot 2) */
          <div className="flex-grow flex flex-col md:flex-row h-full min-h-[calc(100vh-140px)]">
            
            {/* Left Step Rail Side Bar (matches screenshot 2 sidebar layout perfectly) */}
            <aside className="w-full md:w-64 border-r border-slate-900 bg-[#070611]/85 p-6 space-y-8 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <span className="text-[9.5px] uppercase tracking-widest font-extrabold text-[#5b4dff] block font-mono">
                  Onboarding phases
                </span>
                
                <nav className="space-y-4">
                  {[
                    { label: "Personal Info", icon: CheckCircle2, completed: true, active: false },
                    { label: "Portfolio Setup", icon: Sparkles, completed: false, active: true },
                    { label: "Payout Details", icon: Lock, completed: false, active: false },
                    { label: "Verification", icon: ShieldCheck, completed: false, active: false }
                  ].map((elem, idx) => {
                    const SelectedIcon = elem.icon;
                    return (
                      <div 
                        key={idx}
                        className={`flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl border transition-all ${
                          elem.active 
                            ? "bg-[#141235]/60 border-[#5b4dff]/50 text-white font-extrabold shadow-sm shadow-[#5b4dff]/15" 
                            : elem.completed 
                              ? "bg-slate-900/10 border-transparent text-emerald-400"
                              : "bg-transparent border-transparent text-slate-500"
                        }`}
                      >
                        <SelectedIcon className={`w-4 h-4 shrink-0 ${
                          elem.active ? "text-[#8e6fff]" : elem.completed ? "text-emerald-400" : "text-slate-600"
                        }`} />
                        <span className="text-xs tracking-wide">{elem.label}</span>
                        {elem.completed && <Check className="w-3 h-3 text-emerald-400 ml-auto" />}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Need help support block */}
              <div className="bg-[#0d0c1d] border border-slate-850 p-4 rounded-xl space-y-2 mt-auto">
                <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase">Need help?</span>
                <p className="text-[10.5px] text-slate-500 leading-normal font-sans font-medium">
                  Our curator team is available to assist with your portfolio layout.
                </p>
                <a href="#support" className="text-[10.5px] text-[#8e6fff] font-bold hover:underline inline-flex items-center gap-1 mt-1 block">
                  Contact Support <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>

            {/* Right main workpiece portfolio creator */}
            <section className="flex-grow p-5 sm:p-8 md:p-12 overflow-y-auto space-y-8 max-w-4xl">
              
              {/* Titles block */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                  Create your <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-[#8e6fff] bg-clip-text text-transparent">Masterpiece Portfolio</span>
                </h1>
                <p className="text-slate-400 text-sm max-w-3xl">
                  DesignBridge Africa connects top-tier talent with global opportunities. Showcase your best 3-5 projects.
                </p>
              </div>

              {/* Interactive Drag & Drop Area uploader */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleSimulateUpload}
                  disabled={isUploading}
                  className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-11 text-center transition-all cursor-pointer relative focus:outline-none ${
                    isUploading
                      ? "border-[#5b4dff] bg-[#141235]/20"
                      : "border-slate-800 bg-[#0c0b1e]/50 hover:bg-[#12112a]/30 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-[#8e6fff] scale-100 group-hover:scale-105 transition-all">
                      <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <strong className="text-sm font-bold text-white block">
                        Drag &amp; drop your project assets
                      </strong>
                      <span className="text-xs text-slate-505 block mt-0.5 text-slate-500 font-medium">
                        High-resolution images (PNG, JPG) or MP4 videos up to 50MB.
                      </span>
                    </div>

                    {isUploading ? (
                      <div className="w-full max-w-xs space-y-1.5 mt-2">
                        <div className="w-full bg-slate-900 rounded-full h-1">
                          <div className="bg-[#5b4dff] h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-[10px] uppercase font-mono font-bold text-[#8e6fff]">
                          Uploading artwork: {uploadProgress}%
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 px-5 py-2.5 bg-[#5b4dff] hover:bg-[#6c5eff] transition-all text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-lg shadow-[#5b4dff]/15 block">
                        Browse Files
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* Metadata Fields Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#0a0918]/45 p-6 rounded-2xl border border-slate-850">
                <div className="space-y-4">
                  {/* Project Title Input */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Neo-Safari Brand Identity"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3.5 px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#5b4dff]"
                    />
                  </div>

                  {/* Category Selection Dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-853 rounded-xl py-3.5 px-4 text-xs font-semibold text-slate-300 focus:outline-none focus:border-[#5b4dff] appearance-none"
                      >
                        <option value="Visual Identity">Visual Identity</option>
                        <option value="UI/UX Design">UI/UX Design &amp; Digital</option>
                        <option value="Branding &amp; Packaging">Branding &amp; Packaging</option>
                        <option value="Illustration &amp; Arts">Illustration &amp; Arts</option>
                        <option value="Motion Graphics">Motion Graphics &amp; Video</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Description Textarea */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs text-slate-400 font-extrabold font-mono tracking-wider uppercase block">
                    Project Description
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Tell the story behind this project. What was the challenge and your creative solution?"
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3.5 px-4 text-xs font-semibold text-slate-350 focus:outline-none focus:border-[#5b4dff] flex-grow resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Gallery Queue Preview Area (Screenshot 2 bottom) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-extrabold uppercase font-mono tracking-wider">
                    Project Gallery Preview{" "}
                    <span className="text-[#8e6fff] font-bold">({portfolioGallery.length} Files)</span>
                  </span>
                  
                  <button 
                    onClick={() => {
                      // Simulating item shift order
                      const list = [...portfolioGallery];
                      if (list.length > 1) {
                        const first = list.shift()!;
                        list.push(first);
                        setPortfolioGallery(list);
                      }
                    }} 
                    className="text-[11px] text-[#8e6fff] hover:text-white transition-all font-bold font-mono tracking-widest uppercase cursor-pointer"
                  >
                    Reorder Queue
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {portfolioGallery.map((item) => (
                    <div 
                      key={item.id} 
                      className="group/item relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60"
                    >
                      <Image 
                        src={item.url} 
                        alt="Uploaded concept" 
                        fill
                        className="object-cover group-hover/item:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 flex items-center justify-center transition-all z-10">
                        <button
                          onClick={() => {
                            setPortfolioGallery(prev => prev.filter(gal => gal.id !== item.id));
                          }}
                          className="px-2 py-1 bg-red-650 hover:bg-red-700 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg shadow cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-slate-200">
                        {item.label}
                      </div>
                    </div>
                  ))}

                  {/* Empty dashed uploader card slot */}
                  <button
                    onClick={handleSimulateUpload}
                    className="h-28 rounded-xl border border-dashed border-slate-850 flex items-center justify-center bg-slate-900/10 hover:bg-[#121129]/30 text-slate-600 hover:text-slate-400 transition-all cursor-pointer"
                  >
                    <Plus className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>
              </div>

              {/* Navigation Action Buttons footer bar */}
              <div className="pt-6 border-t border-slate-900/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(0)}
                  className="text-xs text-slate-500 font-extrabold uppercase font-mono tracking-wider hover:text-white transition-all"
                >
                  Save as Draft
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3 hover:bg-slate-900 rounded-xl border border-slate-850 bg-slate-950/20 text-slate-400 hover:text-white transition-all cursor-pointer font-bold text-xs uppercase tracking-wider"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3 bg-[#5b4dff] hover:bg-[#6c5eff] text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wide shadow-lg shadow-[#5b4dff]/20"
                  >
                    Continue to Preview
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

            </section>
          </div>
        )}

        {/* STEP 4: VERIFIED PROFILE PREVIEW (DESIGNER FLOW ONLY) (Screenshot 3) */}
        {step === 4 && isDesigner && (
          <div className="flex-grow flex flex-col justify-center py-10 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto w-full space-y-8 animate-fadeIn">
            
            {/* Steps & Progress header */}
            <div className="bg-[#121129]/60 border border-[#5b4dff]/20 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-black text-xs uppercase tracking-wide">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>STEP 4 OF 4 • Onboarding Complete</span>
                </div>
                <strong className="text-sm font-bold text-white block">Identity and portfolio successfully verified</strong>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Completed status</span>
                <span className="text-2xl font-black text-white block leading-none font-mono mt-1">100%</span>
              </div>
            </div>

            {/* Layout titles */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Profile Preview
              </h1>
              <p className="text-slate-400 text-sm">
                This is how your professional brand will appear to potential clients looking for top African talent. Take a moment to verify details before launch.
              </p>
            </div>

            {/* Kofi Mensah / User Premium Visual Profile Card (Screenshot 3 layout) */}
            <div className="bg-[#0b0a1d] border border-slate-850 shadow-2xl rounded-3xl overflow-hidden max-w-xl mx-auto w-full relative">
              
              {/* Dynamic banner head deck */}
              <div className="h-28 bg-[#5b4dff]/80 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-black/40 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest font-black uppercase text-white">
                  DesignBridge Partner
                </div>
                {/* Background mesh glow lines */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-[#5b4dff] to-[#8e6fff]/70 mix-blend-overlay" />
                <div className="absolute -bottom-10 left-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* Personal details info floating wrap */}
              <div className="px-6 pb-6 pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative">
                
                {/* Profile circular avatar protrudes the boundary */}
                <div className="relative -mt-14 shrink-0">
                  <div className="w-24 h-24 rounded-full border-[5px] border-[#0b0a1d] overflow-hidden bg-slate-900 shadow-xl relative">
                    <Image 
                      src={userPhotoUrl} 
                      alt="Verified member photograph avatar" 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-emerald-500 w-5.5 h-5.5 rounded-full border border-[#0d0c1d] flex items-center justify-center text-white shadow shadow-emerald-500/35">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                </div>

                <div className="flex-grow pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-white tracking-tight leading-none">
                      {userDisplayName}
                    </h3>

                    {/* Vetted badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#5b4dff] text-white text-[8.5px] font-black uppercase tracking-widest font-mono shrink-0 shadow shadow-[#5b4dff]/25">
                      <Award className="w-3 h-3 text-white fill-white" />
                      <span>Verified Creative</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#8e6fff] block mt-1">
                    {designerExperience === "senior" ? "Senior" : designerExperience === "mid" ? "Mid-Level" : "Junior"}{" "}
                    {designerDomains[0] || "Creative Specialist"}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-455 text-slate-500 mt-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>

                {/* Sub-action buttons inside the mockup */}
                <div className="flex items-center gap-2 self-start pt-3 sm:pt-0">
                  <button 
                    onClick={() => {
                      // Simulating temporary shift to edit mode
                      setStep(2);
                    }}
                    className="px-3.5 py-1.5 bg-[#121129] hover:bg-slate-900 rounded-lg border border-slate-800 text-[10.5px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button 
                    type="button"
                    className="px-3.5 py-1.5 bg-[#5b4dff]/15 hover:bg-[#5b4dff]/25 text-[#8e6fff] text-[10.5px] font-black rounded-lg transition-all"
                  >
                    Message
                  </button>
                </div>

              </div>

              {/* THREE COLUMN STATS GRID (Screenshot 3 layout) */}
              <div className="mx-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-900/60 grid grid-cols-3 gap-2.5 text-center">
                <div className="space-y-1 border-r border-slate-900/80">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider">Projects</span>
                  <strong className="text-base font-black text-white block tracking-tighter">12</strong>
                </div>
                <div className="space-y-1 border-r border-slate-900/80">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider">Rating</span>
                  <div className="inline-flex items-center gap-1">
                    <strong className="text-base font-black text-white tracking-tighter">5.0</strong>
                    <Star className="w-3.5 h-3.5 text-amber-450 fill-amber-450 text-amber-500 translate-y-[-1px]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider">Years Exp.</span>
                  <strong className="text-base font-black text-white block tracking-tighter">
                    {designerExperience === "senior" ? "8+" : designerExperience === "mid" ? "4+" : "1-2"}
                  </strong>
                </div>
              </div>

              {/* Core Expertise section (Screenshot 3 layout) */}
              <div className="px-6 py-5 space-y-2 text-left">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block font-mono">
                  Core Expertise
                </span>
                
                <div className="flex flex-wrap gap-1.5">
                  {designerDomains.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1.5 rounded-full bg-[#121129] border border-slate-850 hover:bg-slate-900 text-[10.5px] font-semibold text-slate-300 transition-all font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                  {/* Supplementary gorgeous tags for look */}
                  <span className="px-2.5 py-1.5 rounded-full bg-[#121129]/65 border border-transparent text-[10.5px] font-semibold text-slate-500 font-sans">
                    Fintech UI
                  </span>
                  <span className="px-2.5 py-1.5 rounded-full bg-[#121129]/65 border border-transparent text-[10.5px] font-semibold text-slate-500 font-sans">
                    Brand Strategy
                  </span>
                </div>
              </div>

            </div>

            {/* Launch CTA action with availability alert */}
            <div className="pt-4 max-w-md mx-auto w-full space-y-4">
              <button
                type="button"
                onClick={() => handleFinishOnboarding("dashboard")}
                className="w-full py-4 bg-[#5b4dff] hover:bg-[#6c5eff] transition-all text-white font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-[#5b4dff]/25 flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                Go to My Dashboard
                <ChevronRight className="w-4 h-4 animate-pulse" />
              </button>
              
              <span className="text-xs text-slate-500 font-semibold font-mono block text-center">
                You can update your availability from your dashboard.
              </span>
            </div>

          </div>
        )}

      </main>

      {/* 3. FINAL FOOTER PRIVACY NOTE */}
      <footer className="border-t border-slate-900 bg-[#06050e] py-4 text-center px-6 sticky bottom-0 z-10 font-mono text-[9px] text-slate-650 text-slate-600 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
        <span>© 2026 DesignBridge Africa Joint-vantage Services. Licensed Under DBA-Creative System.</span>
        <span>By accessing, you agree to milestone escrow parameters &amp; commission contracts.</span>
      </footer>

    </div>
  );
}
