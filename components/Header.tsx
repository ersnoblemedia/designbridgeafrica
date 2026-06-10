"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, Plus, LogOut, ChevronDown, Sliders, LogIn, UserPlus, Check, Bell, MessageSquare, Briefcase, Layers, Lock, Menu, X, Mail, Search } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setSelectedDesigner: (d: any) => void;
  setIsPostingJob: (open: boolean) => void;
  setOnboardingStep: (step: number) => void;
  clientHasAlerts?: boolean;
  globalSearchTerm?: string;
  setGlobalSearchTerm?: (term: string) => void;
}

// Rotating contextual search placeholder hints
const searchSuggestions = [
  "Search 'UI/UX'...",
  "Search 'Nairobi'...",
  "Search 'Lagos'...",
  "Search 'Brand ID'...",
  "Search 'Cape Town'...",
  "Search 'Packaging'...",
  "Search 'Illustrator'..."
];

export default function Header({
  activeTab,
  setActiveTab,
  setSelectedDesigner,
  setIsPostingJob,
  setOnboardingStep,
  clientHasAlerts = true,
  globalSearchTerm = "",
  setGlobalSearchTerm,
}: HeaderProps) {
  const router = useRouter();
  const { user, profile, logout, updateUserRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [suggestionIndex, setSuggestionIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);
  const [notifications, setNotifications] = useState([
    {
      id: "n0",
      title: "Client Dashboard Ready",
      description: "Welcome Kwame! Your active escrow dashboard has been updated with deep telemetry metrics.",
      time: "2m ago",
      type: "system",
      unread: true,
      targetTab: "dashboard" as const
    },
    {
      id: "n1",
      title: "Milestone Completed",
      description: "Abebe approved your milestone draft of Ethiopian Futurist Pavilion.",
      time: "10m ago",
      type: "system",
      unread: true,
      targetTab: "services" as const
    },
    {
      id: "n2",
      title: "New Match Alert",
      description: "A new high-budget Fintech branding design brief was posted in Nigeria.",
      time: "45m ago",
      type: "job",
      unread: true,
      targetTab: "jobs" as const
    },
    {
      id: "n3",
      title: "Message Received",
      description: "Fatima sent you a proposal response inside Teranga Workspace.",
      time: "2h ago",
      type: "message",
      unread: false,
      targetTab: "messaging" as const
    },
  ]);

  // Determine user's active role from the synchronized Firestore profile
  const userRole = profile?.role || "Client";

  const handleTabClick = (tab: any) => {
    if (tab !== "home" && tab !== "contact" && !user) {
      router.push("/login");
      return;
    }
    setActiveTab(tab);
    setSelectedDesigner(null);
  };

  return (
    <nav id="navbar" className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#0d0c1d]/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between w-full">
        
        {/* Logo */}
        <div className="flex items-center gap-4 sm:gap-10">
          <button 
            onClick={() => { setActiveTab("home"); setSelectedDesigner(null); }} 
            className="flex items-center group text-left cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          >
            <img 
              src="/logo.png" 
              className="h-8 min-[380px]:h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-102" 
              alt="DesignBridge Africa" 
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Navigation Menus */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-400">
            {user && (
              <button 
                onClick={() => handleTabClick("dashboard")} 
                className={`transition-colors py-2 relative flex items-center gap-1 cursor-pointer bg-transparent border-none focus:outline-none ${activeTab === "dashboard" ? "text-white font-extrabold" : "hover:text-slate-200"}`}
              >
                <span>Dashboard</span>
                {userRole === "Client" && clientHasAlerts && (
                  <span className="flex h-2 w-2 relative -top-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8e6fff] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8e6fff]"></span>
                  </span>
                )}
                {activeTab === "dashboard" && <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-[#5b4dff]" />}
              </button>
            )}

            {/* Grouped Marketplace Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={() => setShowExploreDropdown(true)} 
              onMouseLeave={() => setShowExploreDropdown(false)}
            >
              <button 
                onClick={() => setShowExploreDropdown(!showExploreDropdown)}
                className={`transition-colors py-2 flex items-center gap-1.5 cursor-pointer bg-transparent border-none focus:outline-none text-slate-400 hover:text-slate-200 font-semibold ${
                  activeTab === "designers" || activeTab === "services" || activeTab === "jobs" || activeTab === "invoicing" ? "text-white font-extrabold" : ""
                }`}
              >
                <span>Explore Marketplace</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showExploreDropdown ? "rotate-180 text-white" : ""}`} />
                {(activeTab === "designers" || activeTab === "services" || activeTab === "jobs" || activeTab === "invoicing") && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-[#5b4dff]" />
                )}
              </button>

              {showExploreDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-[#100f24]/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 space-y-1 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-800/40 mb-1">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-[#8e6fff] block">African Creative Network</span>
                  </div>
                  
                  <button
                    onClick={() => { handleTabClick("designers"); setShowExploreDropdown(false); }}
                    className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex gap-3 border border-transparent ${
                      activeTab === "designers" 
                        ? "bg-[#18153b] border-[#5b4dff]/25 text-white" 
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#5b4dff]/10 text-[#8e6fff] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Browse Designers</span>
                      <span className="text-xs text-slate-400 block">Vetted talent & dynamic portfolios</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleTabClick("services"); setShowExploreDropdown(false); }}
                    className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex gap-3 border border-transparent ${
                      activeTab === "services" 
                        ? "bg-[#18153b] border-[#5b4dff]/25 text-white" 
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Browse Services</span>
                      <span className="text-xs text-slate-400 block">Fixed-scope milestone deliverables</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleTabClick("jobs"); setShowExploreDropdown(false); }}
                    className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex gap-3 border border-transparent ${
                      activeTab === "jobs" 
                        ? "bg-[#18153b] border-[#5b4dff]/25 text-white" 
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Browse Jobs</span>
                      <span className="text-xs text-slate-400 block">Active regional design briefs</span>
                    </div>
                  </button>

                  {user && (
                    <button
                      onClick={() => { handleTabClick("invoicing"); setShowExploreDropdown(false); }}
                      className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex gap-3 border border-transparent ${
                        activeTab === "invoicing" 
                          ? "bg-[#18153b] border-[#5b4dff]/25 text-white" 
                          : "hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Invoicing & Vaults</span>
                        <span className="text-xs text-slate-400 block">Manage project milestones & payments</span>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => { handleTabClick("checkout"); setShowExploreDropdown(false); }}
                    className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex gap-3 border border-transparent ${
                      activeTab === "checkout" 
                        ? "bg-[#18153b] border-[#5b4dff]/25 text-white" 
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Secured Checkout</span>
                      <span className="text-xs text-slate-450 text-slate-400 block">Final payment step & Escrow lock-in</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user && (
              <button 
                onClick={() => handleTabClick("messaging")} 
                className={`transition-colors py-2 relative cursor-pointer bg-transparent border-none focus:outline-none ${activeTab === "messaging" ? "text-white font-extrabold" : "hover:text-slate-200"}`}
              >
                Inboxes
                {activeTab === "messaging" && <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-[#5b4dff]" />}
              </button>
            )}

            <button 
              onClick={() => handleTabClick("contact")} 
              className={`transition-colors py-2 relative cursor-pointer bg-transparent border-none focus:outline-none ${activeTab === "contact" ? "text-white font-extrabold" : "hover:text-slate-200"}`}
            >
              Contact Us
              {activeTab === "contact" && <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-[#5b4dff]" />}
            </button>

            {userRole === "Admin" && (
              <button 
                onClick={() => handleTabClick("admin")} 
                className={`transition-colors py-2 relative cursor-pointer bg-transparent border-none focus:outline-none text-emerald-400 hover:text-emerald-300 font-semibold`}
              >
                Admin Panel
                {activeTab === "admin" && <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-emerald-400" />}
              </button>
            )}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          
          {/* Global Search Bar (Desktop) */}
          <div className="relative hidden md:flex items-center w-36 lg:w-40 xl:w-44 focus-within:w-48 lg:focus-within:w-52 xl:focus-within:w-56 transition-all duration-300">
            <Search className="absolute left-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={globalSearchTerm}
              onChange={(e) => {
                const term = e.target.value;
                if (setGlobalSearchTerm) {
                   setGlobalSearchTerm(term);
                }
                if (term.trim() && activeTab !== "designers") {
                  setActiveTab("designers");
                }
              }}
              placeholder={searchSuggestions[suggestionIndex]}
              className="w-full bg-[#080715] hover:bg-[#0c0a22]/80 border border-slate-800 focus:border-[#5b4dff] rounded-full pl-10 pr-8 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
            />
            {globalSearchTerm && (
              <button
                onClick={() => {
                  if (setGlobalSearchTerm) setGlobalSearchTerm("");
                }}
                className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              
              {userRole === "Client" ? (
                <button 
                  onClick={() => setIsPostingJob(true)} 
                  className="hidden md:flex bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg shadow-[#5b4dff]/20 transition-all items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Post Brief
                </button>
              ) : (
                <button 
                  onClick={() => setOnboardingStep(1)} 
                  className="hidden md:flex bg-[#1c1a3b] hover:bg-[#25224e] border border-[#5b4dff]/20 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-[#8e6fff]" />
                  Update Profile
                </button>
              )}

              {/* Notification Center Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowRoleDropdown(false);
                  }}
                  className="relative p-2.5 rounded-xl border border-slate-800 bg-[#0f0e22] hover:bg-[#161432] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center h-10 w-10 focus:outline-none"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0f0e22]" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#100f24]/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div>
                        <span className="text-xs font-black text-white block">Activity Center</span>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Real-time alerts</p>
                      </div>
                      {notifications.some(n => n.unread) && (
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                          className="text-xs text-[#8e6fff] hover:text-[#a38cff] font-bold cursor-pointer transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs font-semibold">
                          No recent updates found.
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const getIcon = () => {
                            switch (notif.type) {
                              case "message":
                                return <MessageSquare className="w-3.5 h-3.5 text-[#8e6fff]" />;
                              case "job":
                                return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
                              default:
                                return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
                            }
                          };

                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                                setShowNotifications(false);
                                handleTabClick(notif.targetTab);
                              }}
                              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer flex gap-3 ${
                                notif.unread
                                  ? "bg-[#18153b]/80 border-[#5b4dff]/25 hover:border-[#5b4dff]/45"
                                  : "bg-slate-900/40 border-slate-900/60 hover:bg-slate-900/50"
                              }`}
                            >
                              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800">
                                {getIcon()}
                              </div>
                              <div className="space-y-0.5 w-full">
                                <div className="flex items-start justify-between gap-1">
                                  <span className={`text-xs font-black leading-tight ${notif.unread ? "text-white" : "text-slate-300"}`}>
                                    {notif.title}
                                  </span>
                                  <span className="text-xs text-slate-400 shrink-0 font-mono mt-0.5">
                                    {notif.time}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                                  {notif.description}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Authenticated Professional Account Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#0f0e22] hover:bg-[#161432] transition-colors text-left cursor-pointer"
                >
                  <Image 
                    src={profile?.photoURL || "https://api.dicebear.com/7.x/pixel-art/svg?seed=user"} 
                    alt="profile" 
                    width={32}
                    height={32}
                    className="rounded-lg border border-slate-700 bg-[#161432]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold text-white block max-w-[100px] truncate">{profile?.displayName || "Bridge User"}</span>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#8e6fff] block">{userRole}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Portal */}
                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#100f24] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-1.5 border-b border-slate-800/85">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-[#8e6fff] block">Switch Active Role</span>
                      <p className="text-xs text-slate-450 text-slate-400 font-medium">Instantly update secure database settings</p>
                    </div>

                    <button 
                      onClick={() => { updateUserRole("Client"); setShowRoleDropdown(false); }}
                      className="w-full flex items-center justify-between text-left text-xs text-slate-300 hover:text-white hover:bg-[#151433] px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Simulate Client Interface</span>
                      {userRole === "Client" && <Check className="w-3.5 h-3.5 text-[#8e6fff]" />}
                    </button>
                    <button 
                      onClick={() => { updateUserRole("Designer"); setShowRoleDropdown(false); }}
                      className="w-full flex items-center justify-between text-left text-xs text-slate-300 hover:text-white hover:bg-[#151433] px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Simulate Designer Interface</span>
                      {userRole === "Designer" && <Check className="w-3.5 h-3.5 text-[#8e6fff]" />}
                    </button>
                    <button 
                      onClick={() => { updateUserRole("Admin"); setShowRoleDropdown(false); }}
                      className="w-full flex items-center justify-between text-left text-xs text-slate-300 hover:text-white hover:bg-[#151433] px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Simulate Admin Interface</span>
                      {userRole === "Admin" && <Check className="w-3.5 h-3.5 text-[#8e6fff]" />}
                    </button>

                    <div className="border-t border-slate-800/85 my-1" />

                    <button 
                      onClick={() => { logout(); setShowRoleDropdown(false); }}
                      className="w-full flex items-center gap-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Securely</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push("/login?mode=signin")}
                className="bg-[#0c0b1e]/60 border border-slate-850 hover:bg-slate-900/60 hover:border-slate-750 text-slate-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={() => router.push("/login?mode=signup")}
                className="bg-[#5b4dff] hover:bg-[#6c5eff] active:scale-[0.98] text-white text-xs font-black px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-[#5b4dff]/20 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-800 bg-[#0f0e22] hover:bg-[#161432] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center h-10 w-10 focus:outline-none"
            title="Toggle Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden w-full bg-[#0d0c1d] border-t border-slate-800 px-4 py-4 space-y-4 shadow-2xl animate-fadeIn text-slate-300">
          
          {/* Mobile Global Search Input */}
          <div className="relative px-2 pb-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={globalSearchTerm}
              onChange={(e) => {
                const term = e.target.value;
                if (setGlobalSearchTerm) {
                  setGlobalSearchTerm(term);
                }
                if (term.trim() && activeTab !== "designers") {
                  setActiveTab("designers");
                }
              }}
              placeholder={searchSuggestions[suggestionIndex]}
              className="w-full bg-[#080715] border border-slate-800 hover:border-slate-700/80 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 focus:border-[#5b4dff] transition-all font-semibold"
            />
            {globalSearchTerm && (
              <button
                onClick={() => {
                  if (setGlobalSearchTerm) setGlobalSearchTerm("");
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {user && (
            <button
              onClick={() => { handleTabClick("dashboard"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center justify-between gap-3 ${activeTab === "dashboard" ? "bg-[#18153b] text-white border-l-4 border-[#5b4dff]" : "hover:bg-slate-900/60"}`}
            >
              <span>Dashboard</span>
              {userRole === "Client" && clientHasAlerts && (
                <span className="bg-[#8e6fff]/15 text-[#8e6fff] border border-[#8e6fff]/30 font-mono uppercase text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8e6fff]" />
                  Attention Req.
                </span>
              )}
            </button>
          )}

          {/* Expanded Marketplace Options directly inline for simplicity on mobile */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
            <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-[#8e6fff] px-4 block">Marketplace</span>
            
            <button
              onClick={() => { handleTabClick("designers"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-3 ${activeTab === "designers" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
            >
              <Sparkles className="w-4 h-4 text-[#8e6fff]" />
              <span>Browse Designers</span>
            </button>

            <button
              onClick={() => { handleTabClick("services"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-3 ${activeTab === "services" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Services (Fixed Price)</span>
            </button>

            <button
              onClick={() => { handleTabClick("jobs"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-3 ${activeTab === "jobs" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
            >
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Active Design Briefs</span>
            </button>

            {user && (
              <button
                onClick={() => { handleTabClick("invoicing"); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-3 ${activeTab === "invoicing" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Invoicing & Vaults</span>
              </button>
            )}

            <button
              onClick={() => { handleTabClick("checkout"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-3 ${activeTab === "checkout" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
            >
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Secure Checkout</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/40 space-y-1.5">
            {user && (
              <button
                onClick={() => { handleTabClick("messaging"); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === "messaging" ? "bg-[#18153b] text-white" : "hover:bg-slate-900/60"}`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Inboxes</span>
              </button>
            )}

            <button
              onClick={() => { handleTabClick("contact"); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-3 ${activeTab === "contact" ? "bg-[#18153b] text-white" : "hover:bg-slate-905/60 hover:bg-slate-900/60"}`}
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Contact Us</span>
            </button>

            {userRole === "Admin" && (
              <button
                onClick={() => { handleTabClick("admin"); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-emerald-400 flex items-center gap-3 ${activeTab === "admin" ? "bg-[#18153b]" : "hover:bg-slate-900/60"}`}
              >
                <span>Admin Panel</span>
              </button>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
