"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  Wallet, 
  Eye, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  Calendar, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  X, 
  Check, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Info,
  Download,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import Image from "next/image";
import ProjectDetailsView from "./ProjectDetailsView";
import DBAPlatformIntelligence from "./DBAPlatformIntelligence";
import { generateDesignerPdfReport } from "../lib/pdfGenerator";
import ReportPreviewModal from "./ReportPreviewModal";
import SecuritySettingsView from "./SecuritySettingsView";

interface DesignerDashboardProps {
  setActiveTab: (tab: any) => void;
  setSelectedDesigner?: (d: any) => void;
  setChatDesigner?: (d: any) => void;
}

export default function DesignerDashboard({
  setActiveTab,
  setSelectedDesigner,
  setChatDesigner
}: DesignerDashboardProps) {
  const { profile } = useAuth();
  const designerFirstName = (profile?.displayName || "Bridge User").split(" ")[0];
  const [designerEmailPrefs, setDesignerEmailPrefs] = useState({
    messages: true,
    matchingBriefs: true,
    milestones: true,
  });

  React.useEffect(() => {
    const saved = localStorage.getItem("designbridge_designer_email_prefs");
    if (saved) {
      try {
        setDesignerEmailPrefs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDesignerEmailPrefsChange = (key: keyof typeof designerEmailPrefs) => {
    const updated = { ...designerEmailPrefs, [key]: !designerEmailPrefs[key] };
    setDesignerEmailPrefs(updated);
    localStorage.setItem("designbridge_designer_email_prefs", JSON.stringify(updated));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "projects" | "portfolio" | "earnings" | "messages" | "settings">("dashboard");
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [designerSettingsTab, setDesignerSettingsTab] = useState<"profile" | "security">("profile");
  
  // New Portfolio Form State
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const [newPortfolioClient, setNewPortfolioClient] = useState("");
  const [newPortfolioCategory, setNewPortfolioCategory] = useState("Branding");
  const [newPortfolioBudget, setNewPortfolioBudget] = useState("");
  const [portfolioSuccess, setPortfolioSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<"idle" | "loading" | "done">("idle");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const triggerReportDownload = async () => {
    setDownloadProgress("loading");
    try {
      await generateDesignerPdfReport(profile, projects);
      setDownloadProgress("done");
    } catch (err) {
      console.error("Failed to generate designer PDF report: ", err);
      setDownloadProgress("idle");
    }
    setTimeout(() => setDownloadProgress("idle"), 3000);
  };

  // Active Projects State matching the high fidelity screenshot
  const [projects, setProjects] = useState([
    {
      id: "dp1",
      name: "Eco-Startup Brand Identity",
      deadline: "Oct 12, 2026",
      client: {
        name: "Zara Adebayo",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        type: "individual"
      },
      status: "In Progress",
      budget: "$3,200",
      milestones: [
        { id: "m1", title: "Concept moodboards & traditional motif drafts", done: true },
        { id: "m2", title: "High fidelity packaging blueprints", done: false },
        { id: "m3", title: "Corporate design handbook final transfer", done: false }
      ]
    },
    {
      id: "dp2",
      name: "NairaFlow UI Kit",
      deadline: "Oct 09, 2026",
      client: {
        name: "NairaFlow Inc.",
        avatar: null,
        initials: "NF",
        type: "corporate"
      },
      status: "In Review",
      budget: "$1,850",
      milestones: [
        { id: "m4", title: "Mobile wireframes & dynamic user journeys", done: true },
        { id: "m5", title: "Typography guidelines & dark theme variants", done: true },
        { id: "m6", title: "Interactive interactive high density prototype", done: false }
      ]
    },
    {
      id: "dp3",
      name: "Afritronics Website Redesign",
      deadline: "Oct 20, 2026",
      client: {
        name: "David Mensah",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        type: "individual"
      },
      status: "In Progress",
      budget: "$4,500",
      milestones: [
        { id: "m7", title: "D3 geographical distribution mockups", done: true },
        { id: "m8", title: "Front-end components library mapping", done: false }
      ]
    }
  ]);

  // Selected Project for Inspection details side drawer
  const [selectedInspectionProject, setSelectedInspectionProject] = useState<any | null>(null);

  // Deadlines matching the high fidelity screenshot
  const [deadlines, setDeadlines] = useState([
    { id: "dl1", duration: "IN 2 DAYS", title: "Eco-Startup Brand Styleguide", detail: "Final delivery due by 5:00 PM", urgency: "critical" },
    { id: "dl2", duration: "NEXT WEEK", title: "NairaFlow Prototype V2", detail: "Feedback integration", urgency: "normal" },
    { id: "dl3", duration: "OCT 20", title: "Afritronics Sitemap", detail: "Initial planning", urgency: "low" }
  ]);

  // Recent Feedback matching screen
  const [feedbackList, setFeedbackList] = useState([
    {
      id: "f1",
      client: "Kofi Boateng",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      comment: "Amara is exceptional. She understood our vision for the luxury safari brand perfectly and delivered a logo that is both modern and deeply rooted in heritage."
    },
    {
      id: "f2",
      client: "Fatima Sowe",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      comment: "Extremely satisfied with the UI/UX work on our fintech app. Great communication!"
    }
  ]);

  const [notificationCount, setNotificationCount] = useState(3);
  const [showCalendarView, setShowCalendarView] = useState(false);

  // Filter projects by search
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioTitle.trim() || !newPortfolioClient.trim()) return;

    setPortfolioSuccess(true);
    setTimeout(() => {
      // Add mock project
      const newProj = {
        id: `dp_new_${Date.now()}`,
        name: newPortfolioTitle,
        deadline: "Nov 30, 2026",
        client: {
          name: newPortfolioClient,
          avatar: null,
          initials: newPortfolioClient.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
          type: "individual"
        },
        status: "In Progress",
        budget: newPortfolioBudget ? `$${parseFloat(newPortfolioBudget).toLocaleString()}` : "$2,500",
        milestones: [
          { id: "mnew1", title: "Kickoff & specifications review", done: true },
          { id: "mnew2", title: "Figma concept assets delivery", done: false }
        ]
      };

      setProjects(prev => [newProj, ...prev]);

      // Reset form
      setNewPortfolioTitle("");
      setNewPortfolioClient("");
      setNewPortfolioCategory("Branding");
      setNewPortfolioBudget("");
      setPortfolioSuccess(false);
      setIsAddingPortfolio(false);
    }, 1200);
  };

  const handleToggleMilestone = (projectID: string, milestoneID: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectID) {
        return {
          ...p,
          milestones: p.milestones.map(m => m.id === milestoneID ? { ...m, done: !m.done } : m)
        };
      }
      return p;
    }));

    // Update live inspection state
    if (selectedInspectionProject && selectedInspectionProject.id === projectID) {
      setSelectedInspectionProject((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) => m.id === milestoneID ? { ...m, done: !m.done } : m)
      }));
    }
  };

  const handleToggleStatus = (projectID: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectID) {
        const nextStatus = p.status === "In Progress" ? "In Review" : "In Progress";
        return { ...p, status: nextStatus };
      }
      return p;
    }));

    if (selectedInspectionProject && selectedInspectionProject.id === projectID) {
      setSelectedInspectionProject((prev: any) => ({
        ...prev,
        status: prev.status === "In Progress" ? "In Review" : "In Progress"
      }));
    }
  };

  return (
    <div className="w-full bg-[#070613]/40 border border-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative select-none">
      
      {/* Background Neon Glows */}
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#5b4dff]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-[#8e6fff]/3 blur-[90px] pointer-events-none" />

      {/* TWO PANEL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[800px]">
        
        {/* PANEL 1: SIDEBAR INTERACTIVE RAIL */}
        <div id="designer-sidebar-column" className="lg:col-span-1 bg-[#090818] border-r border-slate-900/90 p-6 flex flex-col justify-between space-y-8">
          
          <div className="space-y-8">
            {/* Branding Logo */}
            <button 
              onClick={() => setActiveTab("home")}
              className="flex items-center pb-2 border-b border-slate-900/60 text-left bg-transparent border-none cursor-pointer group hover:opacity-90 w-full focus:outline-none"
            >
              <img 
                src="/logo.png" 
                className="h-7 w-auto object-contain transition-transform group-hover:scale-102" 
                alt="DesignBridge Africa Logo" 
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Nav Menu */}
            <nav id="designer-nav-items" className="space-y-1.5">
              {[
                { tab: "dashboard", label: "Dashboard", badge: null, icon: Layers },
                { tab: "projects", label: "Projects", badge: null, icon: Briefcase },
                { tab: "portfolio", label: "My Portfolio", badge: "Live", badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25", icon: Eye },
                { tab: "earnings", label: "Earnings", badge: null, icon: Wallet },
                { tab: "messages", label: "Messages", badge: notificationCount > 0 ? notificationCount : null, icon: MessageSquare },
                { tab: "settings", label: "Settings", badge: null, icon: Sliders }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSubTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => setActiveSubTab(item.tab as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group border-none ${
                      isActive 
                        ? "bg-[#181636] text-white border-l-2 border-[#5b4dff]" 
                        : "text-slate-400 bg-transparent hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#8e6fff]" : "text-slate-500 group-hover:text-slate-300"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span className={item.tab === "portfolio" 
                        ? "text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400"
                        : "bg-[#5b4dff] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse"
                      }>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Practical Marketplace Navigation */}
            <div className="pt-5 border-t border-slate-900/60 mt-4 space-y-2.5">
              <span className="text-[9px] uppercase font-black tracking-widest text-[#8e6fff] font-mono block px-3">
                Explore Marketplace
              </span>
              <div className="space-y-1">
                {[
                  { tab: "designers" as const, label: "Browse Designers", icon: Sparkles, color: "text-[#8e6fff]" },
                  { tab: "services" as const, label: "Browse Services", icon: Layers, color: "text-blue-400" },
                  { tab: "jobs" as const, label: "Browse Jobs", icon: Briefcase, color: "text-amber-400" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left text-slate-450 hover:bg-slate-900/60 hover:text-white cursor-pointer group border-none bg-transparent"
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${item.color} opacity-80 group-hover:opacity-100`} />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profile Badge at bottom exactly matching "Amara Okafor PRO" */}
          <div className="pt-4 border-t border-slate-900 flex items-center gap-3">
            <div className="relative shrink-0">
              <Image 
                src={profile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={profile?.displayName || "Bridge User"}
                width={38}
                height={38}
                className="rounded-lg border border-slate-800 bg-[#5b4dff]/10"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#090818] rounded-full" />
            </div>
            <div className="truncate min-w-0">
              <span className="text-xs font-bold text-white block truncate">{profile?.displayName || "Bridge User"}</span>
              <span className="text-[9px] font-black text-[#5b4dff] tracking-wider block uppercase">PRO MEMBER</span>
            </div>
          </div>

        </div>

        {/* PANEL 2: CORE INTERACTIVE VISUAL CONTENT VIEW */}
        <div id="designer-content-main" className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-[#0b0a1a]/50">
          
          {/* SEARCH & ACTIONS TOP BAR */}
          {!selectedInspectionProject && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
              
              {/* Search Input bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search projects, clients, or payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#080715] hover:bg-[#0c0a1f] border border-slate-800/80 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 pl-10 pr-4 text-slate-300 placeholder-slate-550 transition-all font-semibold outline-none focus:ring-0"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Top Bar Right side controls */}
              <div className="flex items-center justify-end gap-3.5">
                <button 
                  onClick={() => setNotificationCount(0)}
                  className="relative p-2.5 rounded-xl border border-slate-800 bg-[#080715] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center w-10 h-10"
                  title={`${notificationCount} unread system notifications`}
                >
                  <Bell className="w-4 h-4" />
                  {notificationCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  )}
                </button>

                <button 
                  onClick={() => setIsAddingPortfolio(true)}
                  className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-5 py-3 hover:scale-[1.01] active:scale-95 rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Portfolio Item</span>
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedInspectionProject ? (
              <motion.div
                key="designer-project-details-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectDetailsView 
                  project={{
                    id: selectedInspectionProject.id,
                    title: selectedInspectionProject.id === "dp1" ? "Eco-Startup Brand Identity" : selectedInspectionProject.name,
                    category: selectedInspectionProject.category || "BRANDING & PACKAGING",
                    status: selectedInspectionProject.status,
                    budget: selectedInspectionProject.id === "dp1" ? "$4,500.00" : selectedInspectionProject.budget,
                    deadline: selectedInspectionProject.id === "dp1" ? "Oct 24, 2024" : "Oct 12, 2026",
                    client: {
                      name: "GreenVibe Africa",
                      avatar: null
                    },
                    designer: {
                      name: "Kofi Arhin",
                      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    }
                  }}
                  userRole="Designer"
                  onBack={() => setSelectedInspectionProject(null)}
                  onNavigateToChat={() => {
                    const clientName = selectedInspectionProject.client.name;
                    setChatDesigner?.({
                      id: "client-admin",
                      name: clientName,
                      avatar: selectedInspectionProject.client.avatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=user"
                    });
                    setSelectedInspectionProject(null);
                    setActiveSubTab("messages");
                  }}
                />
              </motion.div>
            ) : (
              <>
                {/* SUB-VIEW 1: PRIMARY PORTFOLIO DASHBOARD */}
                {activeSubTab === "dashboard" && (
              <motion.div
                key="designer-tab-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Greeting Lockup */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Good morning, {designerFirstName} 🖐
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                      You have <span className="text-white font-bold">{projects.length + 1} active projects</span> and your earnings are up <span className="text-emerald-400 font-bold">12%</span> this month.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="designer-preview-report-btn"
                      onClick={() => setIsPreviewOpen(true)}
                      className="border border-[#f59e0b]/30 text-white bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-[#f59e0b]" />
                      <span>Preview Report</span>
                    </button>

                    <button
                      id="designer-download-report-btn"
                      onClick={triggerReportDownload}
                      disabled={downloadProgress === "loading"}
                      className="border border-[#f59e0b]/30 text-white bg-[#f59e0b]/5 hover:bg-[#f59e0b]/15 px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                      {downloadProgress === "loading" ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 text-amber-400 animate-spin" />
                          <span>Compiling report...</span>
                        </>
                      ) : downloadProgress === "done" ? (
                        <>
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                          <span>Downloaded Successfully</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4.5 h-4.5 text-[#f59e0b]" />
                          <span>Download Earnings Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid of 3 Premium Summary Cards with interactive charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* METRIC 1: TOTAL EARNINGS WITH BAR CHART */}
                  <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-lg flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">
                        Total Earnings
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12%</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-3xl font-black text-white tracking-tight leading-none block">
                        $12,450
                      </span>
                      <span className="text-[9px] text-[#8e6fff] font-extrabold uppercase tracking-wider font-mono">
                        Secured in Escrow
                      </span>
                    </div>

                    {/* Column bar simulator */}
                    <div className="h-10 flex items-end gap-1.5 pt-2">
                      {[25, 40, 30, 50, 65, 85, 100].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-slate-950 rounded-md overflow-hidden h-full flex items-end"
                          title={`Month ${i + 1}`}
                        >
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className={`w-full rounded-b-md ${i === 6 ? "bg-indigo-500" : "bg-[#181636]"}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* METRIC 2: ACTIVE PROJECTS */}
                  <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-lg flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">
                        Active Projects
                      </span>
                    </div>

                    <div>
                      <span className="text-3xl font-black text-white tracking-tight leading-none block">
                        {projects.length + 1} <span className="text-xs text-slate-500 font-bold">ongoing</span>
                      </span>
                    </div>

                    {/* Progress bars matching exact values: In Progress: 2, In Review: 2 */}
                    <div className="space-y-2.5 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                          <span>In Progress</span>
                          <span className="font-bold text-white">2</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: "50%" }} 
                            transition={{ duration: 0.8 }}
                            className="h-full bg-blue-500" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                          <span>In Review</span>
                          <span className="font-bold text-white">2</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: "50%" }} 
                            transition={{ duration: 0.8 }}
                            className="h-full bg-purple-500" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* METRIC 3: PROFILE VIEWS WITH WAVE GRAPH */}
                  <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-lg flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">
                        Profile Views
                      </span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-md font-mono">
                        +5.4%
                      </span>
                    </div>

                    <div>
                      <span className="text-3xl font-black text-white tracking-tight leading-none block">
                        1.2k
                      </span>
                    </div>

                    {/* Premium wavy SVG line chart */}
                    <div className="h-10 w-full pt-1">
                      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                        {/* Area glow */}
                        <defs>
                          <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#5b4dff" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#5b4dff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,25 C15,10 30,28 50,15 C70,2 85,20 100,8 L100,30 L0,30 Z" 
                          fill="url(#waveGlow)"
                        />
                        {/* Main line path */}
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                          d="M0,25 C15,10 30,28 50,15 C70,2 85,20 100,8" 
                          fill="none" 
                          stroke="#5b4dff" 
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                  </div>

                </div>

                {/* Ecosystem Curation & Milestone Capital Trends */}
                <DBAPlatformIntelligence />

                {/* Sub panels split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* LEFT PANELS: ACTIVE PROJECTS & RECENT FEEDBACK */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Active Projects Table-style Panel */}
                    <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <span className="text-sm uppercase font-black text-[#5b4dff] tracking-widest block font-mono">
                          Active Projects
                        </span>
                        <button 
                          onClick={() => setActiveSubTab("projects")} 
                          className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          View all
                        </button>
                      </div>

                      {/* Projects Table-like container */}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px] border-collapse text-left">
                          <thead>
                            <tr className="border-b border-slate-900/60 pb-3">
                              <th className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono py-2.5">
                                Project Name
                              </th>
                              <th className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono py-2.5">
                                Client
                              </th>
                              <th className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono py-2.5">
                                Status
                              </th>
                              <th className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 font-mono py-2.5 text-right">
                                Budget
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900/40">
                            {filteredProjects.map((proj) => (
                              <tr 
                                key={proj.id}
                                onClick={() => setSelectedInspectionProject(proj)}
                                className="group hover:bg-[#12112e]/50 cursor-pointer transition-colors"
                              >
                                <td className="py-4.5 pr-3">
                                  <div className="space-y-1">
                                    <span className="text-xs font-black text-white group-hover:text-[#8e6fff] transition-colors block">
                                      {proj.name}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-semibold block">
                                      Deadline: {proj.deadline}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-4.5">
                                  <div className="flex items-center gap-2">
                                    {proj.client.avatar ? (
                                      <Image 
                                        src={proj.client.avatar} 
                                        alt={proj.client.name} 
                                        width={24}
                                        height={24}
                                        className="rounded-lg border border-slate-800"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-lg bg-[#5b4dff]/20 text-[10px] font-black text-[#8e6fff] flex items-center justify-center border border-[#5b4dff]/30">
                                        {proj.client.initials}
                                      </div>
                                    )}
                                    <span className="text-xs text-slate-300 font-bold">
                                      {proj.client.name}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-4.5">
                                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full inline-block ${
                                    proj.status === "In Progress" 
                                      ? "bg-[#3b2b11]/50 text-amber-500 border border-amber-500/20" 
                                      : "bg-[#1d1b3f]/60 text-indigo-400 border border-indigo-500/20"
                                  }`}>
                                    {proj.status}
                                  </span>
                                </td>

                                <td className="py-4.5 text-right text-xs font-extrabold text-white">
                                  {proj.budget}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>

                    {/* RECENT FEEDBACK PANEL */}
                    <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow-md space-y-5">
                      
                      <div className="border-b border-slate-900 pb-3">
                        <span className="text-sm uppercase font-black text-[#5b4dff] tracking-widest block font-mono">
                          Recent Feedback
                        </span>
                      </div>

                      <div className="space-y-5">
                        {feedbackList.map((feed) => (
                          <div key={feed.id} className="p-4.5 bg-slate-950/20 border border-slate-900 rounded-2xl space-y-3 hover:translate-x-1 transition-transform">
                            
                            {/* Reviewer line */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <Image 
                                  src={feed.avatar} 
                                  alt={feed.client} 
                                  width={28}
                                  height={28}
                                  className="rounded-full border border-slate-800"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs font-bold text-white block">
                                  {feed.client}
                                </span>
                              </div>

                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold italic">
                              &ldquo;{feed.comment}&rdquo;
                            </p>

                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  {/* RIGHT PANEL: DEADLINES CALENDAR & ACCENT ADS */}
                  <div className="space-y-6">
                    
                    {/* DEADLINES PANEL */}
                    <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow-lg space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                          Deadlines
                        </span>
                        <Calendar className="w-4 h-4 text-slate-500" />
                      </div>

                      <div className="space-y-3">
                        {deadlines.map((dl) => (
                          <div 
                            key={dl.id}
                            className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all hover:bg-slate-950/30 ${
                              dl.urgency === "critical" 
                                ? "bg-[#331818]/25 border-red-500/25 border-l-4 border-l-red-500"
                                : dl.urgency === "normal"
                                ? "bg-[#332a18]/25 border-amber-500/20 border-l-4 border-l-amber-500"
                                : "bg-slate-950/10 border-slate-900/80 border-l-4 border-l-slate-700"
                            }`}
                          >
                            <span className={`text-[9px] font-black tracking-widest font-mono uppercase ${
                              dl.urgency === "critical" 
                                ? "text-red-400" 
                                : dl.urgency === "normal" 
                                ? "text-amber-500" 
                                : "text-slate-500"
                            }`}>
                              {dl.duration}
                            </span>
                            <span className="text-xs font-black text-white mt-1">
                              {dl.title}
                            </span>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              {dl.detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setShowCalendarView(true)}
                        className="w-full text-center py-2.5 rounded-xl border border-slate-800 bg-slate-950/50 text-xs font-bold text-slate-400 hover:text-white hover:bg-[#181636] transition-all cursor-pointer"
                      >
                        Full Calendar View
                      </button>

                    </div>

                    {/* BOOST VISIBILITY PANEL */}
                    <div className="bg-gradient-to-b from-[#5b4dff]/20 to-[#0c0b1e]/90 border border-slate-900 rounded-3xl p-6.5 shadow-xl space-y-4 relative overflow-hidden">
                      {/* background shapes */}
                      <div className="absolute top-2 right-2 opacity-10">
                        <Zap className="w-20 h-20 text-white fill-white" />
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-[#5b4dff]/20 flex items-center justify-center border border-[#5b4dff]/30">
                        <Zap className="w-4 h-4 text-[#8e6fff]" />
                      </div>

                      <span className="text-sm font-black text-white block tracking-tight">
                        Boost your visibility
                      </span>

                      <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                        Updating your portfolio twice a week increases your chances of getting featured in &apos;Top Talent&apos; by up to <strong className="text-white">40%</strong>.
                      </p>

                      <button
                        onClick={() => setActiveSubTab("portfolio")} 
                        className="text-xs font-black text-[#a38cff] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                      >
                        <span>Update Portfolio</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* SUB-VIEW 2: PROJECTS MANAGEMENT */}
            {activeSubTab === "projects" && (
              <motion.div
                key="designer-tab-projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Assigned Client Tasks</h3>
                  <p className="text-xs text-slate-400 mt-1">Simulate live submission sign-offs and status milestone triggers directly below.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {projects.map((p) => {
                    const progressVal = Math.round((p.milestones.filter(m => m.done).length / p.milestones.length) * 100);
                    return (
                      <div key={p.id} className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-6 space-y-6 shadow-md">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
                          <div>
                            <h4 className="text-md font-black text-white">{p.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-500 font-mono">CLIENT: {p.client.name}</span>
                              <span className="text-slate-700">•</span>
                              <span className="text-[10px] font-bold text-slate-500 font-mono">DEADLINE: {p.deadline}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-bold px-3 py-1 bg-slate-950 border border-slate-900 rounded-xl">
                              Contract Total: <strong className="text-white">{p.budget}</strong>
                            </span>
                            
                            {/* Toggle status */}
                            <button
                              onClick={() => handleToggleStatus(p.id)}
                              className={`text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                                p.status === "In Progress" 
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" 
                                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                              }`}
                              title="Click to toggle active status simulation"
                            >
                              {p.status}
                            </button>
                          </div>
                        </div>

                        {/* Interactive Milestones Logs */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">
                              Sub-Milestones Progress ({progressVal}%)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {p.milestones.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => handleToggleMilestone(p.id, m.id)}
                                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                  m.done 
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10" 
                                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-700"
                                }`}
                              >
                                {m.done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 animate-pulse" />
                                )}
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold block leading-snug">{m.title}</span>
                                  <span className="text-[9px] text-slate-500 font-mono uppercase block">
                                    {m.done ? "Approved" : "Pending Signoff"}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Informative Security Header */}
                        <div className="bg-slate-950/40 rounded-xl p-3 px-4 flex items-center justify-between border border-slate-900/40 text-[11px] text-slate-400">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <ShieldCheck className="w-4 h-4 text-[#8e6fff]" />
                            <span>This contract operates under the <strong>DesignBridge Secured Escrow Protection Protocol</strong>. Milestone disbursements are released upon verified client sign-off.</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#8e6fff] font-mono hidden sm:inline-block">Verified Safe</span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 3: PORTFOLIO SHOWCASE */}
            {activeSubTab === "portfolio" && (
              <motion.div
                key="designer-tab-portfolio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Simulated Portfolio Artifacts</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage and edit vector designs showcasing cultural folklore elements.</p>
                  </div>

                  <button 
                    onClick={() => setIsAddingPortfolio(true)}
                    className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 mx-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Workspace File</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Zambezi River Lodge Identity", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80", category: "Branding" },
                    { title: "Lagos Kinetic Metro Map UI", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80", category: "UI/UX Design" },
                    { title: "West African Coral Monogram", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", category: "Digital Illustration" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#0f0e22] border border-slate-900 rounded-2xl overflow-hidden hover:border-[#5b4dff]/40 transition-all group shadow-sm flex flex-col justify-between">
                      <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                        <Image 
                          src={item.img} 
                          alt={item.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-900 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase text-[#8e6fff] font-mono tracking-wider">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-xs font-black text-white group-hover:text-[#8e6fff] transition-colors">
                          {item.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 4: EARNINGS ANALYTICS & ESCROW */}
            {activeSubTab === "earnings" && (
              <motion.div
                key="designer-tab-earnings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Tax-Compliant Remittances</h3>
                  <p className="text-xs text-slate-400 mt-1">Verified pan-African currency channels utilizing automated escrow vaults securely under local laws.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-6.5 space-y-4">
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Vault Summary Metrics</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                        <span className="text-[10px] text-slate-400 font-mono block">Available Balance</span>
                        <span className="text-xl font-black text-white mt-1.5 block">$4,250</span>
                        <button className="text-[10px] font-black text-[#8e6fff] hover:text-white mt-2 cursor-pointer transition-colors block">Withdraw immediately</button>
                      </div>
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
                        <span className="text-[10px] text-slate-400 font-mono block">Escrow Locked</span>
                        <span className="text-xl font-black text-slate-400 mt-1.5 block">$8,200</span>
                        <p className="text-[9px] text-slate-500 mt-2">Releasing after client milestone signoffs.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-6.5 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Active Gateway Integrations</span>
                      <p className="text-xs text-slate-350 leading-relaxed font-semibold mt-2">Connecting Johannesburg, Nairobi, Lagos, and Cairo digital designers with global client budgets efficiently.</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md px-2.5 py-1 uppercase font-mono">Mobile Money (M-Pesa)</span>
                      <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-md px-2.5 py-1 uppercase font-mono">Flutterwave Hooked</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 5: COLLABORATION MESSAGES */}
            {activeSubTab === "messages" && (
              <motion.div
                key="designer-tab-messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Active Room Channels</h3>
                  <p className="text-xs text-slate-400 mt-1">Communicate directly inside secured milestone logs with integrated design file uploads.</p>
                </div>

                <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#5b4dff]/10 text-[#8e6fff] rounded-full flex items-center justify-center mx-auto border border-[#5b4dff]/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-md font-bold text-white block">Centralized Collaboration Chat Available</span>
                    <p className="text-xs text-slate-400 leading-normal max-w-md mx-auto">
                      Use the main premium <strong className="text-white">Collaboration Chat</strong> tab from the top navbar to exchange files or launch live whiteboard rooms securely.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("messaging")}
                    className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer mx-auto"
                  >
                    Open Collaboration Chat
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUB-VIEW 6: SETTINGS */}
            {activeSubTab === "settings" && (
              <div className="space-y-6">
                {/* Switcher tabs */}
                <div className="flex border-b border-slate-900 bg-[#070614]/80 p-1 rounded-2xl max-w-md">
                  <button
                    onClick={() => setDesignerSettingsTab("profile")}
                    className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
                      designerSettingsTab === "profile" 
                        ? "bg-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/20" 
                        : "text-slate-400 hover:text-white bg-transparent"
                    }`}
                  >
                    Studio Profile
                  </button>
                  <button
                    onClick={() => setDesignerSettingsTab("security")}
                    className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
                      designerSettingsTab === "security" 
                        ? "bg-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/20" 
                        : "text-slate-400 hover:text-white bg-transparent"
                    }`}
                  >
                    Security & 2FA
                  </button>
                </div>

                {designerSettingsTab === "security" ? (
                  <SecuritySettingsView />
                ) : (
                  <motion.div
                    key="designer-tab-settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-8"
                  >
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Studio Profile & Notification Coordination</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">Configure your design studio availability, connected bank escrow gates, and instant update preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-900">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Registered Studio Name</label>
                        <input 
                          type="text" 
                          defaultValue={`${profile?.displayName || "Amara Okafor"} Creative Ltd`} 
                          className="w-full bg-[#080715] border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-200 outline-none focus:border-[#5b4dff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Operations Country / Regional Hub</label>
                        <input 
                          type="text" 
                          defaultValue="Lagos, Nigeria" 
                          className="w-full bg-[#080715] border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-200 outline-none focus:border-[#5b4dff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Liaison Notification Email</label>
                        <input 
                          type="email" 
                          defaultValue="amara@okafor.design" 
                          className="w-full bg-[#080715] border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-200 outline-none focus:border-[#5b4dff]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">M-Pesa / Mobile Payout Gateway</label>
                        <input 
                          type="text" 
                          readOnly 
                          defaultValue="mpesa_live_payout_gateway_active" 
                          className="w-full bg-[#080715]/40 border border-slate-900 text-slate-500 rounded-xl px-4 py-3 text-sm sm:text-base font-mono outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h4 className="text-base sm:text-lg font-black text-white">Escrow, Availability & Matching Preferences</h4>
                      <div className="space-y-4">
                        {[
                          { title: "Direct Brief Instant Smart-Matching", desc: "Instantly allow open briefs matching your primary tags (Branding, Illustration) to be auto-accepted as proposals." },
                          { title: "Escrow Multi-Sig Milestone Approvals", desc: "Require secure cryptographic hash checks when submitting final designs to trigger fast milestone releases." },
                          { title: "Public Directory Visibility Boost", desc: "Opt-in to allow regional agencies and global partners to search for and view your profile elements on top search indices." }
                        ].map((pref, idx) => (
                          <label key={idx} className="flex items-start gap-4 cursor-pointer group">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-slate-802 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-5 h-5 cursor-pointer mt-0.5"
                            />
                            <div className="space-y-1">
                              <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors">{pref.title}</span>
                              <p className="text-xs sm:text-xs text-slate-400 leading-normal">{pref.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5 border-t border-slate-900 pt-6">
                      <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#5b4dff] rounded-full" />
                        <span>Email Notification Settings & Opt-In</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">Select which milestone approvals and workspace messages are immediately delivered to your contact email address.</p>
                      
                      <div className="space-y-4 mt-2">
                        {[
                          { key: "messages", title: "Instant Messaging & Active Huddle Request", desc: "Receive immediate notifications when clients send a message thread or initiate an active alignment whiteboard huddle." },
                          { key: "matchingBriefs", title: "Smart-Match Priority Direct Job Invites", desc: "Get notified immediately when the DesignBridge vetting match router finds a job brief looking for your specific skills." },
                          { key: "milestones", title: "Milestone Sign-Offs & Immediate Payment Release", desc: "Get real-time notification when a client locks funds into escrow or signs off on your final workspace design deliverables." }
                        ].map((pref) => (
                          <label key={pref.key} className="flex items-start gap-4 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={designerEmailPrefs[pref.key as keyof typeof designerEmailPrefs]}
                              onChange={() => handleDesignerEmailPrefsChange(pref.key as any)}
                              className="rounded border-slate-802 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-5 h-5 cursor-pointer mt-0.5"
                            />
                            <div className="space-y-1">
                              <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors flex flex-wrap items-center gap-2.5">
                                <span>{pref.title}</span>
                                {designerEmailPrefs[pref.key as keyof typeof designerEmailPrefs] ? (
                                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 uppercase font-mono px-3 py-0.5 rounded-full font-black tracking-tight">Opted In</span>
                                ) : (
                                  <span className="text-[10px] bg-red-500/10 text-red-400 uppercase font-mono px-3 py-0.5 rounded-full font-black tracking-tight">Opted Out</span>
                                )}
                              </span>
                              <p className="text-xs sm:text-xs text-slate-400 leading-normal">{pref.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={() => alert("Studio profile credentials & instant email settings saved successfully! Your parameters are verified across the regional registry.")}
                        className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer uppercase tracking-wider"
                      >
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
              </>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* OVERLAY ID: NEW PORTFOLIO ITEM DIALOG MODAL */}
      <AnimatePresence>
        {isAddingPortfolio && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0e22] border border-slate-900 rounded-[28px] p-6 max-w-md w-full relative space-y-5"
            >
              <button 
                onClick={() => setIsAddingPortfolio(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Add Portfolio Work</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Publish premium graphic vector illustrations directly to live clients browsing on the home matching directories.
                </p>
              </div>

              <form onSubmit={handleCreatePortfolio} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 font-mono block">Project Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Zambezi River Traditional Monograms"
                    value={newPortfolioTitle}
                    onChange={(e) => setNewPortfolioTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#5b4dff] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 font-mono block">Client Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Zara Adebayo"
                    value={newPortfolioClient}
                    onChange={(e) => setNewPortfolioClient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#5b4dff] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 font-mono block">Category</label>
                    <select 
                      value={newPortfolioCategory}
                      onChange={(e) => setNewPortfolioCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#5b4dff] outline-none"
                    >
                      <option value="Branding">Branding</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Illustration">Digital Illustration</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 font-mono block">Project Budget ($)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 3500"
                      value={newPortfolioBudget}
                      onChange={(e) => setNewPortfolioBudget(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#5b4dff] outline-none"
                    />
                  </div>
                </div>

                {/* Upload drag drop helper */}
                <div className="border border-dashed border-slate-800 hover:border-[#5b4dff]/40 bg-slate-950/40 rounded-xl p-4.5 text-center transition-colors cursor-pointer space-y-1.5">
                  <Layers className="w-5 h-5 text-slate-500 mx-auto" />
                  <span className="text-[11px] font-bold text-slate-350 block">Drag images or vector SVG files here</span>
                  <span className="text-[9px] text-slate-500 block">Maximum recommended file size: 10MB</span>
                </div>

                <button 
                  type="submit"
                  disabled={portfolioSuccess}
                  className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {portfolioSuccess ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Writing assets to Firestore...</span>
                    </>
                  ) : (
                    <span>Publish to Live Portfolio Catalog</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY ID: FULL CALENDAR VEGETATION DIALOG */}
      <AnimatePresence>
        {showCalendarView && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f0e22] border border-slate-900 rounded-[28px] p-6 max-w-lg w-full relative space-y-5"
            >
              <button 
                onClick={() => setShowCalendarView(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
                <Calendar className="w-5 h-5 text-[#8e6fff]" />
                <h4 className="text-md font-black text-white">Full Milestone Calendar</h4>
              </div>

              {/* Grid 7 Columns representation of June 2026 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-extrabold text-white">
                  <span>June 2026</span>
                  <span className="text-[#8e6fff]">4 deadlines scheduled</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-mono">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, s_idx) => (
                    <span key={s_idx} className="text-[10px] text-slate-500 font-extrabold py-1 block">{d}</span>
                  ))}
                  {Array.from({ length: 30 }).map((_, d_idx) => {
                    const day = d_idx + 1;
                    const isToday = day === 6; // matching 2026-06-06 T15:57Z
                    const hasDeadline = day === 8 || day === 12 || day === 20;
                    return (
                      <div 
                        key={d_idx} 
                        className={`py-2 text-[11px] rounded-lg relative flex flex-col items-center justify-center font-semibold ${
                          isToday 
                            ? "bg-[#5b4dff] text-white font-black" 
                            : hasDeadline 
                            ? "bg-[#181636] text-[#8e6fff] border border-[#5b4dff]/25 font-bold" 
                            : "text-slate-400 hover:bg-slate-900"
                        }`}
                        title={isToday ? "Today (Jun 6)" : hasDeadline ? "Milestone delivery scheduled" : undefined}
                      >
                        <span>{day}</span>
                        {hasDeadline && (
                          <span className="absolute bottom-1 w-1 h-1 bg-amber-400 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono block">June Deadlines Ledger</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">June 8 — Eco-Startup Brand Styleguide</span>
                      <span className="text-red-400 font-mono font-bold">In 2 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">June 12 — NairaFlow Prototype V2</span>
                      <span className="text-amber-500 font-mono font-bold">Next Week</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">June 20 — Afritronics Sitemap & Design</span>
                      <span className="text-slate-500 font-mono">Future</span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
            </div>
          )}

          </AnimatePresence>

          {/* PDF Live Preview Modal Block */}
          <AnimatePresence>
            {isPreviewOpen && (
              <ReportPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                profile={profile}
                projects={projects}
                type="designer"
                onDownload={triggerReportDownload}
                downloadProgress={downloadProgress}
              />
            )}
          </AnimatePresence>

    </div>
  );
}
