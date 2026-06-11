"use client";

import React, { useState } from "react";
import { Lock, LogIn, ShieldAlert, Cpu, Sparkles, Sliders, Home, Compass, Package, Briefcase, MessageSquare, Layers, Menu, X, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import { Designer, Job, ChatMessage } from "../types";
import { DESIGNERS, JOBS } from "../lib/data";

// Component Imports
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import PortfolioShowcase from "../components/PortfolioShowcase";
import HowItWorks from "../components/HowItWorks";
import TrusteesSection from "../components/TrusteesSection";
import AIMatcherSandbox from "../components/AIMatcherSandbox";
import DesignerSection from "../components/DesignerSection";

import BrowseDesigners from "../components/BrowseDesigners";
import BrowseServices from "../components/BrowseServices";
import JobsWorkspace from "../components/JobsWorkspace";
import ChatThreadsWorkspace from "../components/ChatThreadsWorkspace";
import AdminValidationCenter from "../components/AdminValidationCenter";
import ClientDashboard from "../components/ClientDashboard";
import DesignerDashboard from "../components/DesignerDashboard";
import InvoicingView from "../components/InvoicingView";
import CheckoutView from "../components/CheckoutView";

import DesignerDetailsModal from "../components/DesignerDetailsModal";
import PostBriefModal from "../components/PostBriefModal";
import OnboardingWizardModal from "../components/OnboardingWizardModal";
import AccountCompletionModal from "../components/AccountCompletionModal";
import BackToTop from "../components/BackToTop";
import TwoFactorChallenge from "../components/TwoFactorChallenge";
import { 
  AboutPage, CareersPage, BlogPage, ContactPage, CommunityPage, 
  HelpPage, GuidelinesPage, ApiDocsPage, PrivacyPage, TermsPage, CookiePage 
} from "../components/FooterPages";

// Authorization required layout wall
function LoginRequiredWall() {
  const router = useRouter();
  
  return (
    <div id="auth-wall-card" className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#5b4dff]/10 border border-[#5b4dff]/20 flex items-center justify-center shadow-lg shadow-[#5b4dff]/5 animate-pulse">
        <Lock className="w-7 h-7 text-[#8e6fff]" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-white tracking-tight">Please Sign In</h3>
        <p className="text-xs text-slate-400 leading-relaxed font-semibold">
          You need an account to view designers, projects, and start messaging.
        </p>
      </div>
      <button 
        onClick={() => router.push("/login")}
        className="bg-white hover:bg-slate-100 text-[#0d0c1d] text-xs font-bold px-6 py-3.5 rounded-full shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
      >
        <LogIn className="w-4 h-4" />
        Sign in with Google
      </button>
    </div>
  );
}

export default function DesignBridgeAfrica() {
  const router = useRouter();
  const { user, profile, updateUserRole } = useAuth();
  const userRole = profile?.role || "Client";

  // Navigation controller
  const [activeTab, setActiveTab ] = useState<string>("home");
  const [clientHasAlerts, setClientHasAlerts] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [chatDesigner, setChatDesigner] = useState<Designer | null>(null);

  // High-fidelity tactile vibration feedback helper to feel like a native app
  const triggerVibration = (pattern: number | number[] = 15) => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe catch for sandbox boundaries that reject arbitrary hardware events
      }
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        setActiveTab(tab);
      }

      // Self-register Service Worker for offline resilient PWA characteristics
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => console.log("DesignBridge PWA Service Worker Registered with Scope: ", reg.scope))
          .catch((err) => console.log("PWA Service Worker registration postponed: ", err));
      }
    }
  }, []);
  
  // Categorization & searching anchors
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  
  // Jobs brief storage
  const [jobsData, setJobsData] = useState<Job[]>(JOBS);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Administrative Review Pending structures
  const [vettedPending, setVettedPending] = useState([
    { id: "p1", name: "Chisom Okafor", city: "Lagos, Nigeria", skills: ["Graphic Design", "Brand Narratives", "Cinema 4D"], nationalID: "NGA-45920-LGS" },
    { id: "p2", name: "Nailah Kamau", city: "Nairobi, Kenya", skills: ["Tailwind Layouts", "Next.js Systems", "Figma Design"], nationalID: "KEN-88310-NRB" }
  ]);
  const [vettedHistory, setVettedHistory] = useState<string[]>([]);

  // Simulation Message Logs states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "m1", sender: "designer", text: "Hello! I would love to hear about your project ideas. Shoot me a message to get started.", timestamp: "12:30 PM" }
  ]);
  const [typedMessage, setTypedMessage] = useState("");

  // Modals settings
  const [onboardingStep, setOnboardingStep] = useState<number>(0); 
  const [bookedStatus, setBookedStatus] = useState<string | null>(null);
  const [matchedScoreHighlight, setMatchedScoreHighlight] = useState<string[]>([]);
  const [supportPrefillDept, setSupportPrefillDept] = useState("Sales");
  const [supportPrefillMessage, setSupportPrefillMessage] = useState("");

  // Submit secure client application inside a job proposal
  const handleApplyToJob = (jobId: string) => {
    setJobsData(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, applied: true, proposals: (job.proposals || 0) + 1 };
      }
      return job;
    }));
  };

  // Vetting validation logic
  const handleVetCreative = (id: string) => {
    const designer = vettedPending.find(item => item.id === id);
    if (!designer) return;
    
    setVettedHistory(prev => [
      `Approved application from "${designer.name}" in ${designer.city}. Verified ID Number: ${designer.nationalID}`,
      ...prev
    ]);

    setVettedPending(prev => prev.filter(item => item.id !== id));
  };

  // Dispatch live automated message reply matching competencies
  const handleSendMessage = () => {
    if (!typedMessage.trim() || !chatDesigner) return;

    const userMsg: ChatMessage = {
      id: `client_${Date.now()}`,
      sender: "client",
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const originalText = typedMessage;
    setTypedMessage("");

    // Simulate structured designer feedback based on skills
    setTimeout(() => {
      let replyText = `Hi! Thanks for the project details: "${originalText}". I am reviewing everything and will get back to you shortly!`;

      if (chatDesigner.id === "abebe") {
        replyText = "Hello! I am reviewing your 3D modeling requirements. I can start building our 3D layouts in Blender today and share preview links with you by tomorrow.";
      } else if (chatDesigner.id === "fatima") {
        replyText = "Hello! I love your UI/UX design vision. I am ready to assemble clean, modern layouts and interactive wireframes. Shall we get to work?";
      } else if (chatDesigner.id === "kofi") {
        replyText = "Greetings! These packaging ideas look beautiful. I will map out the box layouts, custom textures, and gold foil patterns to build shelf-ready brand designs.";
      }

      const designerReply: ChatMessage = {
        id: `designer_${Date.now()}`,
        sender: "designer",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, designerReply]);
    }, 1500);
  };

  return (
    <div id="view-layer-wrapper" className="min-h-screen bg-[#0d0c1d] relative text-slate-300 pb-24 lg:pb-16 overflow-x-hidden w-full">
      
      {/* Decorative Light Elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#5b4dff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-605/5 blur-[140px] pointer-events-none" />

      {/* Header Area */}
      {activeTab !== "dashboard" && activeTab !== "messaging" && (
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedDesigner={setSelectedDesigner}
          setIsPostingJob={setIsPostingJob}
          setOnboardingStep={setOnboardingStep}
          clientHasAlerts={clientHasAlerts}
          globalSearchTerm={globalSearchTerm}
          setGlobalSearchTerm={setGlobalSearchTerm}
        />
      )}

      {/* Body content boundaries */}
      <main id="primary-content-frame" className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 space-y-16 relative z-10 w-full">
        
        {/* VIEW 1: HOME PANEL */}
        {activeTab === "home" && (
          <div id="home-landing-view" className="space-y-24">
            
            {/* Interactive Hero Intro */}
            <HeroSection setActiveTab={setActiveTab} setOnboardingStep={setOnboardingStep} />

            {/* Vetted Creatives Row Showcase */}
            <DesignerSection setSelectedDesigner={setSelectedDesigner} setActiveTab={setActiveTab} />

            {/* Visual artifacts catalogs grid */}
            <PortfolioShowcase />

            {/* Working escrows steps */}
            <HowItWorks />

            {/* Regional partners endorsements */}
            <TrusteesSection />

          </div>
        )}

        {/* VIEW 1.5: CLIENT EXECUTIVE DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          user ? (
            userRole === "Designer" ? (
              <DesignerDashboard 
                setActiveTab={setActiveTab}
                setSelectedDesigner={setSelectedDesigner}
                setChatDesigner={setChatDesigner}
              />
            ) : (
              <div className="space-y-8">
                <div className="border-b border-slate-900 pb-4">
                  <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Client Executive Hub</span>
                    <span className="text-xs bg-[#5b4dff]/15 text-[#8e6fff] font-mono uppercase font-black px-2.5 py-1 rounded-full">Secure Zone</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Integrate dynamic custom artwork streams with high-performance automated escrow guard rails.</p>
                </div>

                <ClientDashboard 
                  setActiveTab={setActiveTab}
                  setIsPostingJob={setIsPostingJob}
                  setSelectedDesigner={setSelectedDesigner}
                  setChatDesigner={setChatDesigner}
                  onDashboardNotificationChange={setClientHasAlerts}
                />
              </div>
            )
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 1.5: FINANCES & ESCROW WORKSPACE */}
        {activeTab === "invoicing" && (
          user ? (
            <InvoicingView />
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 1.6: CHECKOUT ESCROW PORTAL */}
        {activeTab === "checkout" && (
          user ? (
            <CheckoutView selectedDesignerProp={selectedDesigner} setActiveTab={setActiveTab} />
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 2: BROWSE CREATORS (AUTHENTIC ZONE WALL) */}
        {activeTab === "designers" && (
          user ? (
            <div className="space-y-8">
              <div className="border-b border-slate-900 pb-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Vetted African Creatives</h1>
                <p className="text-xs text-slate-400 mt-1">Check verified residency, portfolios, and active milestones registries.</p>
              </div>

              <BrowseDesigners 
                setSelectedDesigner={setSelectedDesigner}
                setChatDesigner={setChatDesigner}
                setActiveTab={setActiveTab}
                initialCategory={categoryFilter}
                globalSearchTerm={globalSearchTerm}
                setGlobalSearchTerm={setGlobalSearchTerm}
              />
            </div>
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 3: FIXED-SCOPE PACKAGES CATALOG (AUTHENTIC ZONE WALL) */}
        {activeTab === "services" && (
          user ? (
            <div className="space-y-8">
              <div className="border-b border-slate-900 pb-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Fixed-Scope Deliverables</h1>
                <p className="text-xs text-slate-400 mt-1">Book premium predefined packages with payment coordinates locked in modern escrow wrappers.</p>
              </div>

              <BrowseServices 
                bookedStatus={bookedStatus}
                setBookedStatus={setBookedStatus}
                setSelectedDesigner={setSelectedDesigner}
                setActiveTab={setActiveTab}
              />
            </div>
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 4: OPPORTUNITIES BOARD (AUTHENTIC ZONE WALL) */}
        {activeTab === "jobs" && (
          user ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">Active Brief Board</h1>
                  <p className="text-xs text-slate-400 mt-1">Browse open invitations matching critical visual competencies.</p>
                </div>
                {userRole === "Client" && (
                  <button 
                    onClick={() => setIsPostingJob(true)}
                    className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg transition-all cursor-pointer"
                  >
                    + Post Design Brief
                  </button>
                )}
              </div>

              <JobsWorkspace 
                jobsData={jobsData}
                handleApplyToJob={handleApplyToJob}
                setIsPostingJob={setIsPostingJob}
              />
            </div>
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 5: CHAT THREADS COLLABORATION (AUTHENTIC ZONE WALL) */}
        {activeTab === "messaging" && (
          user ? (
            <div className="space-y-8">
              <div className="border-b border-slate-900 pb-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Interactive Collaboration Portal</h1>
                <p className="text-xs text-slate-400 mt-1">Communicate directly with candidate specialists under secure escrow bounds.</p>
              </div>

              <ChatThreadsWorkspace 
                chatDesigner={chatDesigner}
                setChatDesigner={setChatDesigner}
                chatMessages={chatMessages}
                typedMessage={typedMessage}
                setTypedMessage={setTypedMessage}
                handleSendMessage={handleSendMessage}
                setSelectedDesigner={setSelectedDesigner}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          ) : (
            <LoginRequiredWall />
          )
        )}

        {/* VIEW 6: VALIDATION MONITOR (ADMIN ROLE SECURITY WALL) */}
        {activeTab === "admin" && (
          user && userRole === "Admin" ? (
            <div className="space-y-8">
              <div className="border-b border-slate-900 pb-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Vetting Administration Console</h1>
                <p className="text-xs text-slate-400 mt-1">Grant or reject official visual crests on regional candidate arrays.</p>
              </div>

              <AdminValidationCenter 
                vettedPending={vettedPending}
                handleVetCreative={handleVetCreative}
                vettedHistory={vettedHistory}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-red-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tight">Unauthorized Workspace Block</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  You lack administrative coordinates matching verification keys. Use the profile selector dropdown to simulate or authenticate administrative views.
                </p>
              </div>
            </div>
          )
        )}

        {/* VIEW 7: ABOUT US PAGE */}
        {activeTab === "about" && (
          <AboutPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 8: CAREERS PAGE */}
        {activeTab === "careers" && (
          <CareersPage 
            onBack={() => setActiveTab("home")} 
            onContactClick={(dept, msg) => {
              setSupportPrefillDept(dept);
              setSupportPrefillMessage(msg);
              setActiveTab("contact");
            }}
          />
        )}

        {/* VIEW 9: INSIGHTS & BLOG */}
        {activeTab === "blog" && (
          <BlogPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 10: CONTACT SALES & SUPPORT */}
        {activeTab === "contact" && (
          <ContactPage 
            onBack={() => setActiveTab("home")} 
            prefillDept={supportPrefillDept}
            prefillMessage={supportPrefillMessage}
          />
        )}

        {/* VIEW 11: CREATIVE COMMUNITY */}
        {activeTab === "community" && (
          <CommunityPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 12: HELP CENTER / FAQ */}
        {activeTab === "help" && (
          <HelpPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 13: CORE GUIDELINES */}
        {activeTab === "guidelines" && (
          <GuidelinesPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 14: API LEDGER DOCUMENTS */}
        {activeTab === "api-docs" && (
          <ApiDocsPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 15: PRIVACY PROTOCOL */}
        {activeTab === "privacy" && (
          <PrivacyPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 16: TERMS OF SERVICE */}
        {activeTab === "terms" && (
          <TermsPage onBack={() => setActiveTab("home")} />
        )}

        {/* VIEW 17: COOKIE STRATEGY */}
        {activeTab === "cookie" && (
          <CookiePage onBack={() => setActiveTab("home")} />
        )}

      </main>

      {/* Global Footer */}
      <Footer 
        setActiveTab={setActiveTab} 
        setCategoryFilter={setCategoryFilter} 
        onOpenSupportPage={(pageId) => {
          setSupportPrefillDept("Sales");
          setSupportPrefillMessage("");
          setActiveTab(pageId);
        }}
      />

      {/* MODAL POPUPS & PORTALS */}
      <DesignerDetailsModal 
        designer={selectedDesigner}
        onClose={() => setSelectedDesigner(null)}
        onContact={(d) => { setChatDesigner(d); setSelectedDesigner(null); setActiveTab("messaging"); }}
      />

      <PostBriefModal 
        isOpen={isPostingJob}
        onClose={() => setIsPostingJob(false)}
      />

      <OnboardingWizardModal 
        onboardingStep={onboardingStep}
        setOnboardingStep={setOnboardingStep}
        userRole={userRole}
        setUserRole={updateUserRole}
        setActiveTab={setActiveTab}
      />

      <AccountCompletionModal />

      <TwoFactorChallenge />

      <BackToTop />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#090818]/95 backdrop-blur-xl border-t border-slate-900 shadow-2xl py-1 px-0.5 pb-[calc(4px+env(safe-area-inset-bottom,0px))]">
        <div className={`grid ${user ? "grid-cols-5" : "grid-cols-4"} w-full max-w-md mx-auto items-center justify-items-center gap-0.5`}>
          
          {/* Home Tab */}
          <button 
            onClick={() => { 
              triggerVibration(12);
              setActiveTab("home"); 
              setSelectedDesigner(null); 
              setShowMoreMenu(false); 
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-px rounded-xl transition-all cursor-pointer bg-transparent border-none focus:outline-none w-full ${activeTab === "home" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Home className="w-[18px] h-[18px]" />
            <span className="text-[8px] min-[365px]:text-[8.5px] font-bold tracking-tight whitespace-nowrap">Home</span>
          </button>
 
          {/* Dashboard Tab (for logged in) */}
          {user && (
            <button 
              onClick={() => { 
                triggerVibration(12);
                setActiveTab("dashboard"); 
                setSelectedDesigner(null); 
                setShowMoreMenu(false); 
              }}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-px rounded-xl transition-all cursor-pointer bg-transparent border-none focus:outline-none w-full ${activeTab === "dashboard" ? "text-white font-black animate-pulse" : "text-slate-500 hover:text-slate-300"}`}
            >
              <div className="relative">
                <Layers className="w-[18px] h-[18px]" />
                {userRole === "Client" && clientHasAlerts && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#8e6fff] border border-[#0d0c1d]" />
                )}
              </div>
              <span className="text-[8px] min-[365px]:text-[8.5px] font-bold tracking-tight whitespace-nowrap">Dashboard</span>
            </button>
          )}
 
          {/* Designers Tab */}
          <button 
            onClick={() => { 
              triggerVibration(12);
              setActiveTab("designers"); 
              setSelectedDesigner(null); 
              setShowMoreMenu(false); 
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-px rounded-xl transition-all cursor-pointer bg-transparent border-none focus:outline-none w-full ${activeTab === "designers" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Compass className="w-[18px] h-[18px]" />
            <span className="text-[8px] min-[365px]:text-[8.5px] font-bold tracking-tight whitespace-nowrap">Creatives</span>
          </button>
 
          {/* Services/Deliverables Tab */}
          <button 
            onClick={() => { 
              triggerVibration(12);
              setActiveTab("services"); 
              setSelectedDesigner(null); 
              setShowMoreMenu(false); 
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-px rounded-xl transition-all cursor-pointer bg-transparent border-none focus:outline-none w-full ${activeTab === "services" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Package className="w-[18px] h-[18px]" />
            <span className="text-[8px] min-[365px]:text-[8.5px] font-bold tracking-tight whitespace-nowrap">Services</span>
          </button>
 
          {/* More Menu Drawer Trigger */}
          <button 
            onClick={() => { 
              triggerVibration([15, 8]);
              setShowMoreMenu(!showMoreMenu); 
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-px rounded-xl transition-all cursor-pointer bg-transparent border-none focus:outline-none w-full ${showMoreMenu ? "text-[#8e6fff] font-bold animate-pulse" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Menu className="w-[18px] h-[18px]" />
            <span className="text-[8px] min-[365px]:text-[8.5px] font-bold tracking-tight whitespace-nowrap">More</span>
          </button>
 
        </div>
      </div>

      {/* Native-style Drawer Overlay & Backdrop Sheet */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                triggerVibration(8);
                setShowMoreMenu(false);
              }}
              className="fixed inset-0 bg-[#04040c]/80 backdrop-blur-sm z-[90] lg:hidden"
            />
            
            {/* Drawer Sheet with tactile vertical slide gesture swipe-to-dismiss */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.85 }}
              onDragEnd={(event, info) => {
                // If pulled down far enough or fast enough, dismiss sheet
                if (info.offset.y > 100 || info.velocity.y > 130) {
                  triggerVibration(15);
                  setShowMoreMenu(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0c0b1e]/98 border-t border-slate-900 rounded-t-[32px] p-6 pb-10 z-[100] lg:hidden shadow-[0_-15px_40px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-y-auto select-none touch-none"
            >
              {/* iOS-style Swipe/Drag Handle Accent */}
              <div className="w-16 h-1.5 bg-slate-800 hover:bg-slate-700 active:bg-[#5b4dff] rounded-full mx-auto mb-6 transition-colors" />
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                    <span>Ecosystem Explorer</span>
                    <span className="text-[9px] font-mono bg-slate-900 text-[#8e6fff] px-1.5 py-0.5 rounded-md border border-slate-850">PWA Link</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Access extra system dashboards and coordination zones.</p>
                </div>
                <button 
                  onClick={() => {
                    triggerVibration(8);
                    setShowMoreMenu(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grouped menu options lists */}
              <div className="space-y-3.5">
                {/* 1. Briefs (Jobs) */}
                <button
                  onClick={() => {
                    triggerVibration(20);
                    setActiveTab("jobs");
                    setSelectedDesigner(null);
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-950/60 border hover:border-[#5b4dff]/40 transition-all text-left cursor-pointer ${activeTab === "jobs" ? "border-[#5b4dff] bg-[#5b4dff]/5" : "border-slate-900"}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-white">Project Briefs Board</div>
                    <div className="text-[10px] text-slate-400 truncate">Sponsor custom job briefs, view budgets & screen applications.</div>
                  </div>
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${activeTab === "jobs" ? "bg-[#5b4dff]/20 text-[#8e6fff]" : "bg-slate-900 text-slate-500"}`}>
                    Active
                  </span>
                </button>

                {/* 2. Collab messaging */}
                <button
                  onClick={() => {
                    triggerVibration(20);
                    setActiveTab("messaging");
                    setSelectedDesigner(null);
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-950/60 border hover:border-[#5b4dff]/40 transition-all text-left cursor-pointer ${activeTab === "messaging" ? "border-[#5b4dff] bg-[#5b4dff]/5" : "border-slate-900"}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-white">Collaboration Chatroom</div>
                    <div className="text-[10px] text-slate-400 truncate">Exchange mockups, coordinate milestones, launch interactive whiteboards.</div>
                  </div>
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${activeTab === "messaging" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-500"}`}>
                    Live
                  </span>
                </button>

                {/* 3. Escrow & Invoices (Visible to all logged in) */}
                {user && (
                  <button
                    onClick={() => {
                      triggerVibration(20);
                      setActiveTab("invoicing");
                      setSelectedDesigner(null);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-950/60 border hover:border-[#5b4dff]/40 transition-all text-left cursor-pointer ${activeTab === "invoicing" ? "border-[#5b4dff] bg-[#5b4dff]/5" : "border-slate-900"}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-white">Escrow, Disputes & Invoicing</div>
                      <div className="text-[10px] text-slate-400 truncate">Check secure funding deposits, release milestone approvals, view history.</div>
                    </div>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${activeTab === "invoicing" ? "bg-amber-500/20 text-amber-400" : "bg-slate-900 text-slate-500"}`}>
                      Secured
                    </span>
                  </button>
                )}

                {/* 4. Admin Validation Center (Admin role only) */}
                {user && userRole === "Admin" && (
                  <button
                    onClick={() => {
                      triggerVibration([25, 12]);
                      setActiveTab("admin");
                      setSelectedDesigner(null);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-950/60 border hover:border-[#5b4dff]/40 transition-all text-left cursor-pointer ${activeTab === "admin" ? "border-[#5b4dff] bg-[#5b4dff]/5" : "border-slate-900"}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-white">Admin Vetting & Compliance</div>
                      <div className="text-[10px] text-slate-400 truncate">Verify government ID registries and review raw creative applications.</div>
                    </div>
                    <span className="text-[9px] font-black font-mono bg-red-500/15 text-red-400 px-2.5 py-0.5 rounded-full shrink-0">
                      Admin Mode
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
