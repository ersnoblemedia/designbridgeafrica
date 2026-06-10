"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Bell, 
  X, 
  Layers, 
  MessageSquare, 
  Settings as SettingsIcon, 
  FileText, 
  ClipboardCheck,
  Sparkles,
  Briefcase
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./AuthProvider";
import Image from "next/image";
import ProjectDetailsView from "./ProjectDetailsView";

import ClientDashboardView from "./ClientDashboardView";
import ClientProjectsView from "./ClientProjectsView";
import ClientMessagesView from "./ClientMessagesView";
import ClientInvoicesView from "./ClientInvoicesView";
import ClientSettingsView from "./ClientSettingsView";

import { generateClientPdfReport } from "../lib/pdfGenerator";
import ReportPreviewModal from "./ReportPreviewModal";

interface ClientDashboardProps {
  setActiveTab: (tab: any) => void;
  setIsPostingJob: (open: boolean) => void;
  setSelectedDesigner: (d: any) => void;
  setChatDesigner: (d: any) => void;
  onDashboardNotificationChange?: (hasUpdates: boolean) => void;
}

export default function ClientDashboard({
  setActiveTab,
  setIsPostingJob,
  setSelectedDesigner,
  setChatDesigner,
  onDashboardNotificationChange,
}: ClientDashboardProps) {
  const { profile } = useAuth();
  const [emailPrefs, setEmailPrefs] = useState({
    instantMessages: true,
    fileUploads: true,
    escrowUpdates: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("designbridge_client_email_prefs");
    if (saved) {
      try {
        setEmailPrefs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleEmailPrefsChange = (key: keyof typeof emailPrefs) => {
    const updated = { ...emailPrefs, [key]: !emailPrefs[key] };
    setEmailPrefs(updated);
    localStorage.setItem("designbridge_client_email_prefs", JSON.stringify(updated));
  };

  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "projects" | "messages" | "invoices" | "settings">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageCount, setMessageCount] = useState(4);
  const [downloadProgress, setDownloadProgress] = useState<"idle" | "loading" | "done">("idle");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<any[]>([]);

  // Seed and load PDF download history for Client Dashboard
  useEffect(() => {
    const saved = localStorage.getItem("designbridge_client_pdf_history");
    if (saved) {
      try {
        setDownloadHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Parsed stored pdf history failed:", err);
      }
    } else {
      const initialSeed = [
        {
          id: "hist-1",
          fileName: "designbridge-executive-client-report-1748234812300.pdf",
          generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(),
          ownerName: profile?.displayName || "Elite Client Representative",
          projectCount: 2,
          type: "client",
          totalEscrow: "$45,280 USD"
        },
        {
          id: "hist-2",
          fileName: "designbridge-executive-client-report-1746210432100.pdf",
          generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleString(),
          ownerName: profile?.displayName || "Elite Client Representative",
          projectCount: 2,
          type: "client",
          totalEscrow: "$45,280 USD"
        }
      ];
      setDownloadHistory(initialSeed);
      localStorage.setItem("designbridge_client_pdf_history", JSON.stringify(initialSeed));
    }
  }, [profile]);

  const addPdfToHistory = () => {
    const newEntry = {
      id: "hist-" + Date.now(),
      fileName: `designbridge-executive-client-report-${Date.now()}.pdf`,
      generatedAt: new Date().toLocaleString(),
      ownerName: profile?.displayName || "Elite Client Representative",
      projectCount: activeProjects.length,
      type: "client",
      totalEscrow: "$45,280 USD"
    };
    const updated = [newEntry, ...downloadHistory];
    setDownloadHistory(updated);
    localStorage.setItem("designbridge_client_pdf_history", JSON.stringify(updated));
  };
  const [recentActivities, setRecentActivities] = useState([
    { id: "a1", text: "New design uploaded for Eco-Startup Brand Identity.", time: "14 minutes ago", type: "design", read: false },
    { id: "a2", text: "Message from Kofi Mensah regarding Mobile App UI.", time: "2 hours ago", type: "message", read: false },
    { id: "a3", text: "Invoice #1092 has been paid successfully.", time: "Yesterday at 4:30 PM", type: "invoice", read: true },
    { id: "a4", text: "Milestone 2 reached on Website Project.", time: "2 days ago", type: "milestone", read: true }
  ]);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Active projects list with real interactive state
  const [activeProjects, setActiveProjects] = useState([
    {
      id: "p-eco",
      title: "Brand Identity for Eco-Startup",
      category: "BRANDING",
      status: "IN PROGRESS",
      statusColor: "emerald",
      designer: {
        name: "Amara Okafor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        bio: "Senior Brand Director specialized in eco-solutions."
      },
      updatedText: "Updated 2h ago",
      teamCount: 3,
      contractValue: "$4,500",
      milestones: ["Brief Alignment [Done]", "Figma Concept Wraps [In Progress]", "Packaging Specifications [Pending]"]
    },
    {
      id: "p-fintech",
      title: "FinTech Mobile App Redesign",
      category: "UI/UX DESIGN",
      status: "REVIEWING",
      statusColor: "indigo",
      designer: {
        name: "Kofi Mensah",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        bio: "Pioneering minimalist West African UI/UX systems."
      },
      updatedText: "Updated 1d ago",
      teamCount: 1,
      contractValue: "$8,200",
      milestones: ["Wireframe Signoffs [Done]", "Interactive Prototyping [Done]", "Client Approval Rounds [Active]"]
    }
  ]);

  // Messages threads inside the Dashboard Messages View
  const [messageThreads, setMessageThreads] = useState([
    {
      id: "t1",
      name: "Amara Okafor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Branding Specialist",
      lastMessage: "I just uploaded the high-resolution vector assets for the packaging line.",
      time: "14m ago",
      unread: true,
      chats: [
        { sender: "designer", text: "Good morning Kwame, hope you're having a great week!", time: "9:00 AM" },
        { sender: "client", text: "Going well Amara! How are the packaging files looking?", time: "11:15 AM" },
        { sender: "designer", text: "I just uploaded the high-resolution vector assets for the packaging line. Let me know if you want the gold-foil gradients adjusted.", time: "1:20 PM" }
      ]
    },
    {
      id: "t2",
      name: "Kofi Mensah",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      role: "Lead UI/UX Architect",
      lastMessage: "Shall we hop on a quick video huddle to align on the Fintech dashboard states?",
      time: "2h ago",
      unread: true,
      chats: [
        { sender: "client", text: "Hi Kofi, I reviewed the main payment flow mockups. It looks extremely clean.", time: "Yesterday" },
        { sender: "designer", text: "Awesome! High-density components render beautifully. Shall we hop on a quick video huddle to align on the Fintech dashboard states?", time: "2 hours ago" }
      ]
    },
    {
      id: "t3",
      name: "Zanele Mbeki",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      role: "Illustrator & Custom Artist",
      lastMessage: "Thank you for inviting me to your traditional vector motifs brief! I love the concept.",
      time: "1d ago",
      unread: true,
      chats: [
        { sender: "designer", text: "Thank you for inviting me to your traditional vector motifs brief! I love the concept. I've designed several cultural murals in Johannesburg.", time: "Yesterday" }
      ]
    },
    {
      id: "t4",
      name: "Abebe Eshetu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      role: "Environment Designer",
      lastMessage: "Sent you the final OBJ mesh files. Everything is verified and clean.",
      time: "3d ago",
      unread: true,
      chats: [
        { sender: "designer", text: "Sent you the final OBJ mesh files. Everything is verified and clean.", time: "3 days ago" }
      ]
    }
  ]);
  const [selectedThreadId, setSelectedThreadId] = useState("t1");
  const [typedMessage, setTypedMessage] = useState("");

  // Invoices list
  const [invoices, setInvoices] = useState([
    { id: "INV-1092", project: "Eco-Startup Brand Identity", issuer: "Amara Okafor", amount: "$1,500", status: "PAID", date: "June 5, 2026", stripeId: "ch_3Mv8XpLkd" },
    { id: "INV-1091", project: "Eco-Startup Logo Concepts", issuer: "Amara Okafor", amount: "$1,000", status: "PAID", date: "May 20, 2026", stripeId: "ch_2Nv9KpYld" },
    { id: "INV-1093", project: "FinTech Mobile App Wireframes", issuer: "Kofi Mensah", amount: "$3,200", status: "ESCROW LOCKED", date: "June 2, 2026", stripeId: "ch_9Xz2WpGst" },
    { id: "INV-1094", project: "FinTech High Fidelity Prototype", issuer: "Kofi Mensah", amount: "$5,000", status: "PENDING ESCROW RELEASE", date: "Active", stripeId: "ch_4Pt9OqMbn" }
  ]);

  // Compute if the client has unread messages or pending deliverables
  const hasUnreadMessages = messageCount > 0;
  const hasPendingMilestones = invoices.some(inv => inv.status === "PENDING ESCROW RELEASE");
  const hasAlerts = hasUnreadMessages || hasPendingMilestones;

  useEffect(() => {
    onDashboardNotificationChange?.(hasAlerts);
  }, [hasAlerts, onDashboardNotificationChange]);

  // Selected details overlay state
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Auto-clear unread in selected thread and recalculate total unread
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    let updated = messageThreads.map(t => {
      if (t.id === threadId && t.unread) {
        return { ...t, unread: false };
      }
      return t;
    });
    setMessageThreads(updated);
    const unreadCount = updated.filter(t => t.unread).length;
    setMessageCount(unreadCount);
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessageThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        return {
          ...t,
          chats: [...t.chats, { sender: "client", text: typedMessage, time: now }],
          lastMessage: typedMessage,
          time: "Just now"
        };
      }
      return t;
    }));
    setTypedMessage("");

    // Simulate reply
    setTimeout(() => {
      const activeThread = messageThreads.find(t => t.id === selectedThreadId);
      let replyText = "Understood! I'll investigate that immediately and upload revised layout files.";
      if (activeThread?.name.includes("Amara")) {
        replyText = "Fabulous! I am finishing up the alternative warm gold foil accents. Rendering them now!";
      } else if (activeThread?.name.includes("Kofi")) {
        replyText = "Let me send a calendar link over so we can lock in 15 minutes of live alignment!";
      }
      
      setMessageThreads(prev => prev.map(t => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            chats: [...t.chats, { sender: "designer", text: replyText, time: "Just now" }],
            lastMessage: replyText,
            time: "Just now"
          };
        }
        return t;
      }));
    }, 1500);
  };

  // Simulate Downloading file report perfectly
  const triggerReportDownload = async () => {
    setDownloadProgress("loading");
    try {
      await generateClientPdfReport(profile, activeProjects);
      addPdfToHistory();
      setDownloadProgress("done");
    } catch (err) {
      console.error("Failed to generate PDF: ", err);
      setDownloadProgress("idle");
    }
    setTimeout(() => setDownloadProgress("idle"), 3000);
  };

  // Simulated Zanele details launch values
  const triggerZaneleDetails = () => {
    setSelectedDesigner({
      id: "zanele",
      name: "Zanele Mbeki",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      title: "Illustrator & Custom Graphic Muralist",
      city: "Johannesburg",
      country: "South Africa",
      rating: 5.0,
      completedJobs: 42,
      skills: ["Digital Illustration", "Traditional Motifs", "Procreate", "Vector Artwork", "Murals"],
      bio: "Fusing vibrant modern cultural palettes with ancient geometric beadwork symbology designed for international commercial and environmental campaigns.",
      featuredProjectImg: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
      portfolioItems: [
        { id: "z1", title: "Vibrant Beadwork Poster Series", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80" },
        { id: "z2", title: "Cultural Pattern Branding Kit", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80" }
      ],
      availability: "Available Now",
      recentlyActiveMinutes: 10,
      responseTimeHours: 0.2,
      activeJobs: 1,
      experienceYears: 6,
      industries: ["Vibrant Retail Packaging", "Hospitality Interior Graphics", "Editorial Hand-Drawn Prints"],
      designStyles: ["Hand-Rendered Symmetry", "Bright Beadwork Motifs", "Minimalist Folk Art Flat Layers"],
      complexityLevel: "Clean & Modern"
    });
  };

  return (
    <div className="w-full bg-[#070613]/40 border border-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative" id="client-dashboard-main-component">
      
      {/* Dynamic Background Aura */}
      <div className="absolute top-[30%] left-[20%] w-[330px] h-[330px] rounded-full bg-[#5b4dff]/5 blur-[90px] pointer-events-none" />

      {/* TWO PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[750px] relative z-10">
        
        {/* PANEL 1: CLIENT SIDEBAR PANEL */}
        <div id="dashboard-sidebar-column" className="lg:col-span-1 bg-[#090818]/90 border-r border-slate-900/90 p-6 flex flex-col justify-between space-y-8">
          
          <div className="space-y-8">
            {/* Header branding lockup */}
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

            {/* Menu Items */}
            <nav id="dashboard-nav-items" className="space-y-1.5">
              {[
                { tab: "dashboard", label: "Dashboard", badge: null, icon: Layers },
                { tab: "projects", label: "Projects", badge: null, icon: ClipboardCheck },
                { tab: "messages", label: "Messages", badge: messageCount > 0 ? messageCount : null, icon: MessageSquare },
                { tab: "invoices", label: "Invoices", badge: null, icon: FileText },
                { tab: "settings", label: "Settings", badge: null, icon: SettingsIcon }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeSubTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    id={`sidebar-tab-btn-${item.tab}`}
                    onClick={() => setActiveSubTab(item.tab as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group border-none ${
                       isActive 
                        ? "bg-[#181636] text-white border-l-2 border-[#5b4dff]" 
                        : "text-slate-400 bg-transparent hover:bg-[#181636]/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#8e6fff]" : "text-slate-500 group-hover:text-slate-300"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="bg-[#5b4dff] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Practical Marketplace Navigation */}
            <div className="pt-5 border-t border-slate-900/60 mt-4 space-y-2.5" id="client-dashboard-marketplace-links">
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
                      id={`sidebar-mkt-link-${item.tab}`}
                      onClick={() => setActiveTab(item.tab)}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left text-slate-455 hover:bg-slate-900/60 hover:text-white cursor-pointer group border-none bg-transparent"
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${item.color} opacity-80 group-hover:opacity-100`} />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profile card block at bottom */}
          <div className="pt-4 border-t border-slate-900 flex items-center gap-3" id="client-sidebar-profile-node">
            <div className="relative shrink-0">
              <Image 
                src={profile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={profile?.displayName || "Bridge User"}
                width={38}
                height={38}
                className="rounded-lg border border-slate-800 bg-[#5b4dff]/10 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#090818] rounded-full" />
            </div>
            <div className="truncate min-w-0">
              <span className="text-xs font-bold text-white block truncate">{profile?.displayName || "Bridge User"}</span>
              <span className="text-[9px] font-black text-[#8e6fff] tracking-tight block uppercase">Premium Member</span>
            </div>
          </div>

        </div>

        {/* PANEL 2: CLIENT INTERACTIVE BODY VIEW */}
        <div id="dashboard-content-main" className="lg:col-span-4 p-6 sm:p-8 space-y-8 bg-[#0b0a1a]/50">
          
          {/* TOP HEADER CONTROLS (Search, Notifications, CTA) */}
          {!selectedProject && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-900 pb-6" id="client-top-dash-header">
              
              {/* Search Input Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search projects, designers, or invoices..."
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

              {/* Top Bar Actions */}
              <div className="flex items-center justify-end gap-3.5">
                <button 
                  onClick={() => {
                    setRecentActivities(prev => prev.map(a => ({ ...a, read: true })));
                  }}
                  className="relative p-2.5 rounded-xl border border-slate-900 bg-[#080715] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center w-10 h-10"
                  title="Mark all notifications read"
                >
                  <Bell className="w-4 h-4" />
                  {recentActivities.some(a => !a.read) && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#5b4dff]" />
                  )}
                </button>

                <button 
                  onClick={() => setIsPostingJob(true)}
                  className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-5 py-3 hover:scale-[1.01] active:scale-95 rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>
          )}

          {/* RENDERING INTERACTIVE TABS */}
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key="project-details-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectDetailsView 
                  project={{
                    id: selectedProject.id,
                    title: selectedProject.id === "p-eco" ? "Eco-Startup Brand Identity" : selectedProject.title,
                    category: selectedProject.category,
                    status: selectedProject.status,
                    budget: selectedProject.contractValue || "$4,500.00",
                    deadline: selectedProject.id === "p-eco" ? "Oct 24, 2024" : "Dec 18, 2026",
                    client: {
                      name: "GreenVibe Africa",
                      avatar: null
                    },
                    designer: {
                      name: selectedProject.designer.name,
                      avatar: selectedProject.designer.avatar,
                      bio: selectedProject.designer.bio
                    }
                  }}
                  userRole="Client"
                  onBack={() => setSelectedProject(null)}
                  onNavigateToChat={() => {
                    const threadId = selectedProject.id === "p-eco" ? "t1" : "t2";
                    setChatDesigner({
                      id: selectedProject.id === "p-eco" ? "abebe" : "kofi",
                      name: selectedProject.designer.name,
                      avatar: selectedProject.designer.avatar
                    });
                    setSelectedThreadId(threadId);
                    setSelectedProject(null);
                    setActiveSubTab("messages");
                  }}
                />
              </motion.div>
            ) : (
              <>
                {activeSubTab === "dashboard" && (
                  <ClientDashboardView
                    downloadProgress={downloadProgress}
                    triggerReportDownload={triggerReportDownload}
                    activeProjects={activeProjects}
                    setSelectedProject={setSelectedProject}
                    setActiveSubTab={setActiveSubTab}
                    setActiveTab={setActiveTab}
                    setIsPostingJob={setIsPostingJob}
                    recentActivities={recentActivities}
                    showAllActivity={showAllActivity}
                    setShowAllActivity={setShowAllActivity}
                    triggerZaneleDetails={triggerZaneleDetails}
                    setChatDesigner={setChatDesigner}
                    setSelectedThreadId={setSelectedThreadId}
                    downloadHistory={downloadHistory}
                    onOpenPreview={() => setIsPreviewOpen(true)}
                    onReDownloadHistory={triggerReportDownload}
                  />
                )}

                {activeSubTab === "projects" && (
                  <ClientProjectsView
                    activeProjects={activeProjects}
                    setSelectedProject={setSelectedProject}
                    setChatDesigner={setChatDesigner}
                    setSelectedThreadId={setSelectedThreadId}
                    setActiveSubTab={setActiveSubTab}
                  />
                )}

                {activeSubTab === "messages" && (
                  <ClientMessagesView
                    messageThreads={messageThreads}
                    selectedThreadId={selectedThreadId}
                    handleSelectThread={handleSelectThread}
                    typedMessage={typedMessage}
                    setTypedMessage={setTypedMessage}
                    handleSendMessage={handleSendMessage}
                  />
                )}

                {activeSubTab === "invoices" && (
                  <ClientInvoicesView
                    invoices={invoices}
                    setInvoices={setInvoices}
                  />
                )}

                {activeSubTab === "settings" && (
                  <ClientSettingsView
                    emailPrefs={emailPrefs}
                    handleEmailPrefsChange={handleEmailPrefsChange}
                  />
                )}
              </>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* PDF Live Preview Modal Block */}
      <AnimatePresence>
        {isPreviewOpen && (
          <ReportPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            profile={profile}
            projects={activeProjects}
            type="client"
            onDownload={triggerReportDownload}
            downloadProgress={downloadProgress}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
