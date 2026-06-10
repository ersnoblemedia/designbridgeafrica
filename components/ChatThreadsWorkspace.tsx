"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { 
  Send, Smile, Paperclip, CheckCheck, Bold, Italic, Link as LinkIcon, 
  List, Code, Search, SquarePen, Video, Info, Download, 
  LayoutDashboard, FolderClosed, Receipt, Settings as SettingsIcon,
  MessageSquare, Users, Briefcase
} from "lucide-react";
import { ChatMessage, Designer } from "../types";
import { DESIGNERS } from "../lib/data";
import { useAuth } from "./AuthProvider";

interface ChatThreadsWorkspaceProps {
  chatDesigner: Designer | null;
  setChatDesigner: (d: Designer) => void;
  chatMessages: ChatMessage[];
  typedMessage: string;
  setTypedMessage: (txt: string) => void;
  handleSendMessage: () => void;
  setSelectedDesigner: (d: Designer | null) => void;
  activeTab?: string;
  setActiveTab?: (tab: "home" | "dashboard" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
}

const AMARA_OKAFOR_CLIENT: Designer = {
  id: "amara",
  name: "Amara Okafor",
  avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Amara",
  title: "Creative Director (Lagos Tech Summit)",
  city: "Lagos",
  country: "Nigeria",
  rating: 5.0,
  completedJobs: 12,
  skills: ["Brand Identity", "Event Art", "Visual Guidelines"],
  bio: "Managing collaborative visual designs for large-scale regional tech summits.",
  featuredProjectImg: "",
  portfolioItems: [],
  availability: "Available Now",
  recentlyActiveMinutes: 0,
  responseTimeHours: 0.1,
  activeJobs: 1,
  experienceYears: 12,
  industries: ["Technology", "Conferences", "Brand Strategy"],
  designStyles: ["Symmetry", "Modern Graphics"],
  complexityLevel: "Premium & Luxury"
};

export default function ChatThreadsWorkspace({
  chatDesigner,
  setChatDesigner,
  chatMessages,
  typedMessage,
  setTypedMessage,
  handleSendMessage,
  setSelectedDesigner,
  activeTab = "messaging",
  setActiveTab
}: ChatThreadsWorkspaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();
  const userRole = profile?.role || "Designer";

  // Search filter
  const [chatSearch, setChatSearch] = useState("");

  // Notify via email setting
  const [notifyViaEmail, setNotifyViaEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Track the active list of conversation threads
  const threads: Designer[] = [
    AMARA_OKAFOR_CLIENT,
    ...DESIGNERS.filter((d) => d.id !== "amara")
  ];

  // Map of transcript histories
  const [localConversations, setLocalConversations] = useState<Record<string, ChatMessage[]>>({
    amara: [
      {
        id: "am_1",
        sender: "designer", // "designer" represents the other person in our model
        text: "Hi Kwame! I just saw the latest concepts for the Lagos Tech Summit logo. I'm really loving the typography choices, specifically the custom 'L' mark.",
        timestamp: "10:42 AM"
      },
      {
        id: "am_2",
        sender: "client", // "client" represents "me"
        text: "Thanks Amara! I wanted to reflect the modularity of the tech scene in Lagos while keeping it grounded in heritage. Did you get a chance to look at the color palettes?",
        timestamp: "10:45 AM"
      },
      {
        id: "am_3",
        sender: "designer",
        text: "Not fully yet. Can you send them over again in a single PDF? It's easier for me to present to the board.",
        timestamp: "10:48 AM"
      },
      {
        id: "am_4",
        sender: "client",
        text: "Of course! Here are the brand guidelines and color explorations.",
        timestamp: "11:02 AM"
      },
      {
        id: "am_5",
        sender: "client",
        text: "ATTACHMENT:LagosTech_Guidelines_V2.pdf|4.2 MB",
        timestamp: "11:03 AM"
      }
    ],
    abebe: [
      {
        id: "ab_1",
        sender: "designer",
        text: "Greetings! I'm Abebe. I would love to hear your thoughts on custom 3D design components for your project.",
        timestamp: "Yesterday"
      }
    ],
    fatima: [
      {
        id: "fa_1",
        sender: "designer",
        text: "Hello! Did you review the Senegalese Neubrutalist layout guidelines I pushed to the repository?",
        timestamp: "2 days ago"
      }
    ],
    kofi: [
      {
        id: "ko_1",
        sender: "designer",
        text: "Greetings! I am packaging some cocoa box test-runs here at the Kumasi design collective. I'll share models soon.",
        timestamp: "2 days ago"
      }
    ],
    zanele: [
      {
        id: "za_1",
        sender: "designer",
        text: "Hi there! Let's connect next week to discuss your hotel main lobby custom mural illustrations.",
        timestamp: "Yesterday"
      }
    ]
  });

  // Auto-select Amara Okafor on initial mount if nothing selected
  useEffect(() => {
    if (!chatDesigner) {
      setChatDesigner(AMARA_OKAFOR_CLIENT);
    }
  }, [chatDesigner, setChatDesigner]);

  // Keep bottom elements visible
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localConversations, chatDesigner]);

  const activeId = chatDesigner?.id || "amara";
  const messagesList = localConversations[activeId] || [];

  // Filter conversations
  const filteredThreads = threads.filter((t) => 
    t.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    t.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleSendLocalMessage = (textToSend = typedMessage) => {
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "client", // "me"
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLocalConversations(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg]
    }));

    setTypedMessage("");

    // Simulate instant email notification banner if toggled
    if (notifyViaEmail) {
      triggerToast(`📩 Simulated instant update notification dispatched to ${chatDesigner?.name}'s email endpoint!`);
    }

    // Client automated simulated response trigger
    setTimeout(() => {
      let reply = "I've received this update! Let me review this file with the regional committee on our next huddle.";
      if (activeId === "amara") {
        reply = "This fits the Lagos Tech Summit aesthetics beautifully Kwame! I'll secure these assets inside our shared repository and lock the next escrow milestone guidelines shortly.";
      } else if (activeId === "abebe") {
        reply = "Acknowledged! Let's coordinate on structural mesh values on the whiteboard huddle tomorrow.";
      } else if (activeId === "fatima") {
        reply = "Figma constraints verified! I will push these updated wireframe assets by late afternoon.";
      }

      const replyMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: "designer", // other person
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLocalConversations(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), replyMsg]
      }));
    }, 1200);
  };

  // Keyboard shortcut support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendLocalMessage();
    }
  };

  // Markdown formatting shortcuts
  const applyFormatting = (style: "bold" | "italic" | "link" | "list" | "code") => {
    switch (style) {
      case "bold":
        setTypedMessage(prev => prev + "**bold text**");
        break;
      case "italic":
        setTypedMessage(prev => prev + "*italic text*");
        break;
      case "link":
        setTypedMessage(prev => prev + "[link title](https://)");
        break;
      case "list":
        setTypedMessage(prev => prev + "\n- list item");
        break;
      case "code":
        setTypedMessage(prev => prev + "`code element`");
        break;
    }
  };

  // Simulating custom PDF uploading with paperclip trigger
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create custom mock attachment message
    const attachmentText = `ATTACHMENT:${file.name}|${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    handleSendLocalMessage(attachmentText);

    // Reset value
    e.target.value = "";
  };

  return (
    <div 
      id="collaboration-chat-hub" 
      className="bg-[#0b0a18] border border-slate-900 rounded-3xl overflow-hidden min-h-[680px] h-[750px] grid grid-cols-1 lg:grid-cols-12 relative shadow-2xl"
    >
      {/* Dynamic Activity Toast Banner */}
      {showToast && (
        <div 
          id="instant-toast-banner" 
          className="absolute top-4 right-4 bg-[#5b4dff] text-white px-5 py-3 rounded-2xl text-xs font-bold z-50 flex items-center gap-3 shadow-2xl border border-[#8e6fff]/30 animate-fadeIn"
        >
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.zip"
      />

      {/* COLUMN 1: LEFT-MOST BRAND WORKSPACE DRAWERS (3 / 12 cols) */}
      <div 
        id="collab-platform-rail" 
        className="hidden lg:flex lg:col-span-3 bg-[#0d0c1e] border-r border-slate-950 flex-col justify-between py-6 px-4"
      >
        <div className="space-y-6">
          {/* Logo & Subtitle */}
          <button 
            onClick={() => setActiveTab && setActiveTab("home")}
            className="flex items-center text-left bg-transparent border-none cursor-pointer group hover:opacity-90 w-full focus:outline-none"
          >
            <img 
              src="/logo.png" 
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-102" 
              alt="DesignBridge Africa Logo" 
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Primary Navigation items */}
          <div className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "designers", label: "Browse Designers", icon: Users },
              { id: "services", label: "Browse Services", icon: FolderClosed },
              { id: "jobs", label: "Browse Jobs", icon: Briefcase },
              { id: "messaging", label: "Messages Room", icon: MessageSquare }
            ].map((menu) => {
              const isActive = menu.id === "messaging";
              return (
                <button
                  key={menu.id}
                  id={`rail-btn-${menu.id}`}
                  onClick={() => {
                    if (setActiveTab) {
                      setActiveTab(menu.id as any);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border-none bg-transparent ${
                    isActive 
                      ? "bg-[#181636] text-white border-l-2 border-[#5b4dff]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#14122d]"
                  }`}
                >
                  <menu.icon className={`w-4 h-4 ${isActive ? "text-[#8e6fff]" : "text-slate-500"}`} />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile node */}
        <div className="space-y-4 pt-4 border-t border-slate-900/60">
          <button
            id="rail-settings-btn"
            onClick={() => setActiveTab && setActiveTab("dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>

          {/* Kwame Adjei style responsive profile badge card */}
          <div 
            id="user-profile-badge" 
            className="p-3 bg-[#110f27] border border-slate-900 rounded-xl flex items-center gap-3"
          >
            <div className="relative shrink-0">
              <Image 
                src={profile?.photoURL || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Kwame"} 
                alt="Kwame" 
                width={36} 
                height={36} 
                className="rounded-lg border border-slate-800 bg-[#0c0a1a]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-[#110f27] rounded-full" />
            </div>
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-white block truncate leading-tight">
                {profile?.displayName || (userRole === "Designer" ? "Kwame Adjei" : "Amara Okafor")}
              </span>
              <span className="text-[10px] text-slate-400 block font-semibold truncate leading-none">
                {userRole === "Designer" ? "Pro Designer" : userRole === "Client" ? "Creative Lead" : "Super Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: CONVERSATIONS SELECTION FEED LIST (3 / 12 cols) */}
      <div 
        id="collab-conversations-list" 
        className="col-span-1 lg:col-span-3 bg-[#0a0917] border-r border-[#15132d] p-4 flex flex-col justify-between"
      >
        <div id="thread-conversations-scroller" className="space-y-4 flex-1 overflow-y-auto">
          {/* Header block */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-900/50">
            <h2 className="text-lg font-black text-white tracking-tight">Messages</h2>
            <button 
              onClick={() => alert("Creating a new thread is supported. Click any designer's profile from standard directories to message them.")}
              className="p-1 px-2 rounded-lg bg-[#ffffff]/5 hover:bg-[#5b4dff]/20 text-slate-300 hover:text-white transition-all text-[11px] font-bold cursor-pointer"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>

          {/* Search container */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search chats..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full bg-[#110f27] border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-[#5b4dff]/50 transition-colors"
            />
          </div>

          {/* Conversation items */}
          <div className="space-y-1.5 pt-2">
            {filteredThreads.map((thread) => {
              const isSelected = activeId === thread.id;
              const hasOnlineStatus = thread.id === "amara" || thread.id === "abebe";
              
              // Get last message text based on thread
              const threadHistory = localConversations[thread.id] || [];
              const lastMessage = threadHistory[threadHistory.length - 1];
              let msgPreview = lastMessage ? lastMessage.text : "Tap to start chatting...";
              if (msgPreview.startsWith("ATTACHMENT:")) {
                msgPreview = "📁 Shared PDF document";
              }

              return (
                <button
                  key={thread.id}
                  id={`thread-entry-${thread.id}`}
                  onClick={() => {
                    setChatDesigner(thread);
                    setSelectedDesigner(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left cursor-pointer border ${
                    isSelected 
                      ? "bg-[#181636] border-[#5b4dff]/40 shadow-lg shadow-[#5b4dff]/5" 
                      : "bg-[#121028]/40 hover:bg-[#121028] border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Image 
                      src={thread.avatar} 
                      alt={thread.name} 
                      width={38} 
                      height={38} 
                      className="rounded-full object-cover border border-slate-900 bg-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 ${hasOnlineStatus ? "bg-emerald-400" : "bg-slate-700"}`} />
                  </div>
                  
                  <div className="flex-1 truncate space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white block leading-tight truncate">{thread.name}</span>
                      <span className={`text-[8px] font-mono shrink-0 uppercase font-black ${isSelected ? "text-[#8e6fff]" : "text-slate-500"}`}>
                        {thread.id === "amara" ? "NOW" : lastMessage ? lastMessage.timestamp : ""}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate leading-tight font-medium">
                      {msgPreview}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredThreads.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No active matching chats.</p>
            )}
          </div>
        </div>
      </div>

      {/* COLUMN 3: MAIN ACTIVE MESSAGE LOGS WORKSPACE (6 / 12 cols) */}
      <div 
        id="collab-active-dialog" 
        className="col-span-1 lg:col-span-6 flex flex-col justify-between bg-[#0e0c20]/50 h-full overflow-hidden"
      >
        {chatDesigner ? (
          <>
            {/* Header Area */}
            <div 
              id="active-dialog-header" 
              className="px-6 py-4.5 border-b border-slate-950 bg-[#0e0c20] flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <Image 
                    src={chatDesigner.avatar} 
                    alt={chatDesigner.name} 
                    width={40} 
                    height={40} 
                    className="rounded-full object-cover border border-slate-900 bg-slate-900" 
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 ${(chatDesigner.id === "amara" || chatDesigner.id === "abebe") ? "bg-emerald-400" : "bg-slate-700"}`} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-white block leading-tight">{chatDesigner.name}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-none">
                    {chatDesigner.id === "amara" 
                      ? "Project: Lagos Tech Summit Brand Identity" 
                      : `Expertise: ${chatDesigner.title}`}
                  </span>
                </div>
              </div>

              {/* Header Right elements */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedDesigner(chatDesigner)}
                  className="text-slate-400 hover:text-white transition-colors text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-slate-900/60 cursor-pointer"
                >
                  View Profile
                </button>
                <span className="text-slate-700 font-mono">|</span>
                <button 
                  onClick={() => triggerToast("📹 Opening high-performance collaborative whiteboard huddle...")}
                  className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-[#5b4dff] hover:bg-slate-900/60 cursor-pointer transition-all"
                  title="Video Whiteboard Huddle"
                >
                  <Video className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => triggerToast(`ℹ️ Vetting Score: ${chatDesigner.rating}/5.0 based on ${chatDesigner.completedJobs} signed escrows.`)}
                  className="p-1 px-1.5 rounded-lg text-slate-400 hover:text-[#8e6fff] hover:bg-slate-900/60 cursor-pointer transition-all"
                  title="Designer Credentials"
                >
                  <Info className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Chat Logger area */}
            <div 
              id="dialog-bubbles-panel" 
              className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-[radial-gradient(#15123d_0.5px,transparent_0.5px)] [background-size:16px_16px] [background-opacity:0.25]"
            >
              {/* Special Date divider for Amara thread */}
              {chatDesigner.id === "amara" && (
                <div className="flex justify-center py-2 select-none">
                  <span className="bg-[#181636] text-[9px] text-[#8e6fff] font-mono tracking-widest uppercase font-black px-4 py-1.5 rounded-full border border-[#5b4dff]/10">
                    October 24, 2023
                  </span>
                </div>
              )}

              {messagesList.map((msg) => {
                const isMyMessage = msg.sender === "client";
                const isAttachment = msg.text.startsWith("ATTACHMENT:");

                let fileName = "";
                let fileSize = "";
                if (isAttachment) {
                  const parts = msg.text.replace("ATTACHMENT:", "").split("|");
                  fileName = parts[0] || "document.pdf";
                  fileSize = parts[1] || "0.0 MB";
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
                  >
                    <div className="max-w-[80%]">
                      {isAttachment ? (
                        <div className="space-y-1">
                          {/* Rich attachment box */}
                          <div className="bg-[#161435] border border-[#5b4dff]/20 rounded-2xl p-4 flex items-center justify-between gap-4 w-full shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center font-mono text-[10px] uppercase font-black text-red-400">
                                PDF
                              </div>
                              <div className="truncate max-w-[150px] sm:max-w-[240px]">
                                <span className="text-xs font-bold text-white block truncate">{fileName}</span>
                                <span className="text-[10px] text-slate-400 block">{fileSize}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => triggerToast(`📥 Downloading "${fileName}" into secure local cache.`)}
                              className="w-8 h-8 rounded-lg bg-slate-950/40 hover:bg-[#5b4dff]/40 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Download document payload"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-1 px-1 text-[8px] text-slate-500 font-semibold font-mono">
                            <span>{msg.timestamp}</span>
                            {isMyMessage && <CheckCheck className="w-3.5 h-3.5 text-[#5b4dff]" />}
                          </div>
                        </div>
                      ) : (
                        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMyMessage 
                            ? "bg-[#5b4dff] text-white rounded-tr-none shadow-lg shadow-[#5b4dff]/10" 
                            : "bg-[#110f27] text-slate-200 border border-slate-900 rounded-tl-none"
                        }`}>
                          <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-75 font-semibold font-mono">
                            <span>{msg.timestamp}</span>
                            {isMyMessage && <CheckCheck className="w-3.5 h-3.5 text-[#8e6fff]" />}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input & Formatted Actions Bar */}
            <div id="dialog-input-system" className="border-t border-[#15132d] bg-[#0e0c20]">
              
              {/* Formatter bar */}
              <div className="flex items-center gap-1.5 px-4 py-1.5 border-b border-slate-950 bg-[#0d0b1a] select-none text-slate-400">
                {[
                  { label: "B", style: "bold" as const, element: <Bold className="w-3.5 h-3.5" /> },
                  { label: "I", style: "italic" as const, element: <Italic className="w-3.5 h-3.5" /> },
                  { label: "Link", style: "link" as const, element: <LinkIcon className="w-3.5 h-3.5" /> },
                  { label: "List", style: "list" as const, element: <List className="w-3.5 h-3.5" /> },
                  { label: "Code", style: "code" as const, element: <Code className="w-3.5 h-3.5" /> }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => applyFormatting(item.style)}
                    className="p-1 px-1.5 rounded hover:bg-slate-900/60 hover:text-white transition-all text-[11px] font-bold cursor-pointer"
                  >
                    {item.element}
                  </button>
                ))}
              </div>

              {/* Message Typing Panel */}
              <div className="p-4 space-y-3">
                <textarea 
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none resize-none leading-relaxed"
                  placeholder={`Write a message to ${chatDesigner.name}...`}
                />

                <div className="flex items-center justify-between">
                  {/* Shortcut key help label */}
                  <span className="text-[10px] text-slate-600 font-bold select-none font-sans">
                    ⌘ + Enter to send
                  </span>

                  {/* Input controllers */}
                  <div className="flex items-center gap-3.5">
                    {/* Notify via email toggle */}
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <input 
                        type="checkbox"
                        checked={notifyViaEmail}
                        onChange={() => setNotifyViaEmail(!notifyViaEmail)}
                        className="rounded border-[#1d1b38] bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-350 transition-colors">
                        Notify via Email
                      </span>
                    </label>

                    {/* Smile icon */}
                    <button 
                      onClick={() => setTypedMessage(prev => prev + " 😊")}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 cursor-pointer"
                      title="Add emoticon"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    {/* Attachment file paperclip */}
                    <button 
                      onClick={handleFileUploadClick}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 cursor-pointer"
                      title="Attach assets payload"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Main sending payload button */}
                    <button 
                      onClick={() => handleSendLocalMessage()}
                      disabled={!typedMessage.trim()}
                      className="bg-[#5b4dff] hover:bg-[#7546ff] text-white w-8.5 h-8.5 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shadow-lg shadow-[#5b4dff]/20 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 bg-slate-900/60 rounded-full border border-slate-800 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#8e6fff]" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Select a conversation</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Choose Amara Okafor or any visual expert from the thread list to coordinate your project milestones.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
