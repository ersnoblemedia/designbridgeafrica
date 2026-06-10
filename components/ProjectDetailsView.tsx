"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ArrowLeft, MessageSquare, Upload, Folder, CheckCircle2, Clock, 
  Lock, Download, Send, CheckCheck, RefreshCw, Paperclip
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  detail: string;
  status: "APPROVED" | "IN_REVIEW" | "LOCKED";
  date?: string;
}

interface ActivityItem {
  id: string;
  author: string;
  avatar?: string;
  initials?: string;
  text: string;
  commentQuote?: string;
  time: string;
  type: "upload" | "comment" | "payment" | "system";
}

interface DeliverableFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface ProjectDetailsViewProps {
  project: {
    id: string;
    title: string;
    category: string;
    status: string;
    budget: string;
    deadline: string;
    client: {
      name: string;
      avatar: string | null;
      initials?: string;
    };
    designer: {
      name: string;
      avatar: string;
      bio?: string;
    };
  };
  userRole: "Client" | "Designer" | "Admin";
  onBack: () => void;
  onNavigateToChat: () => void;
}

export default function ProjectDetailsView({
  project,
  userRole,
  onBack,
  onNavigateToChat
}: ProjectDetailsViewProps) {
  // Interactive State
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "m1", title: "Phase 1: Discovery & Research", detail: "Completed on Sep 12, 2024", status: "APPROVED" },
    { id: "m2", title: "Phase 2: Concept Sketches", detail: "In Review • Submitted Oct 2, 2024", status: "IN_REVIEW" },
    { id: "m3", title: "Phase 3: Final Polish & Assets", detail: "Upcoming Milestone", status: "LOCKED" }
  ]);

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act_1",
      author: project.designer.name,
      avatar: project.designer.avatar,
      text: "uploaded 3 new design concepts.",
      time: "2 HOURS AGO",
      type: "upload"
    },
    {
      id: "act_2",
      author: "You",
      avatar: userRole === "Client" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80" 
        : project.designer.avatar,
      text: "commented on \"Logo_Concept_A.png\"",
      commentQuote: "I love the direction of the leaf icon here.",
      time: "YESTERDAY",
      type: "comment"
    },
    {
      id: "act_3",
      author: "System",
      text: "Milestone 1 payment released to designer.",
      time: "SEP 15, 2024",
      type: "payment"
    },
    {
      id: "act_4",
      author: "System",
      text: "Project was started.",
      time: "SEP 10, 2024",
      type: "system"
    }
  ]);

  const [deliverables, setDeliverables] = useState<DeliverableFile[]>([
    { id: "df_1", name: "Logo_Concept_A.png", size: "2.4 MB", type: "PNG" },
    { id: "df_2", name: "Color_Exploration_V1.pdf", size: "5.1 MB", type: "PDF" },
    { id: "df_3", name: "Brand_Positioning_Brief.pdf", size: "1.2 MB", type: "PDF" }
  ]);

  const [commentText, setCommentText] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [completionPercent, setCompletionPercent] = useState(65);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleApproveMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: "APPROVED", detail: `Approved on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` };
      }
      // Unlock next locked milestone as in review
      if (m.id === "m3") {
        return { ...m, status: "IN_REVIEW", detail: "Active Roadmap State in examination" };
      }
      return m;
    }));

    setCompletionPercent(90);

    // Add activity
    const newAct: ActivityItem = {
      id: `act_approve_${Date.now()}`,
      author: "You",
      avatar: userRole === "Client" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80" 
        : project.designer.avatar,
      text: "approved Phase 2: Concept Sketches milestones. Contract released.",
      time: "JUST NOW",
      type: "payment"
    };

    setActivities(prev => [newAct, ...prev]);
    triggerToast("🎉 Milestone Approved! Escrow funds released to designer workspace.");
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newAct: ActivityItem = {
      id: `act_comment_${Date.now()}`,
      author: "You",
      avatar: userRole === "Client" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80" 
        : project.designer.avatar,
      text: "added a feedback update.",
      commentQuote: commentText,
      time: "JUST NOW",
      type: "comment"
    };

    setActivities(prev => [newAct, ...prev]);
    setCommentText("");

    if (notifyEmail) {
      triggerToast(`📩 Comment posted & instant email notification dispatched to the partner node.`);
    } else {
      triggerToast(`💬 Comment added successfully to the workspace activity logs.`);
    }
  };

  const handleMockUpload = () => {
    const fileNames = [
      "Styleguide_Rules_V2.pdf",
      "Packaging_Template_Bleed.ai",
      "Symmetry_Draft_Figma.png"
    ];
    const types = ["PDF", "AI", "PNG"];
    const sizes = ["4.1 MB", "12.8 MB", "3.2 MB"];
    const randomIndex = Math.floor(Math.random() * fileNames.length);

    const newFile: DeliverableFile = {
      id: `file_${Date.now()}`,
      name: fileNames[randomIndex],
      size: sizes[randomIndex],
      type: types[randomIndex]
    };

    setDeliverables(prev => [newFile, ...prev]);

    const newAct: ActivityItem = {
      id: `act_upload_${Date.now()}`,
      author: userRole === "Client" ? "You" : project.designer.name,
      avatar: userRole === "Client" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80" 
        : project.designer.avatar,
      text: `uploaded deliverable "${newFile.name}"`,
      time: "JUST NOW",
      type: "upload"
    };

    setActivities(prev => [newAct, ...prev]);
    triggerToast(`📤 Shared "${newFile.name}" deliverable payload to workspace workspace.`);
  };

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Dynamic Activity Toast Banner */}
      {showToast && (
        <div 
          id="project-toast-banner" 
          className="fixed top-6 right-6 bg-[#5b4dff] text-white px-5 py-3 rounded-2xl text-xs font-bold z-[100] flex items-center gap-3 shadow-2xl border border-[#8e6fff]/30 animate-fadeIn"
        >
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION METADATA */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-900 pb-6">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-xl bg-[#090818] border border-slate-900 text-slate-400 hover:text-white hover:bg-[#15132d] transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {project.title}
              </h1>
              <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-500/15">
                IN PROGRESS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              Project ID: DB-29402 • Client: <span className="text-white">{project.client.name}</span>
            </p>
          </div>
        </div>

        {/* HEADER CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onNavigateToChat}
            className="border border-slate-800 hover:border-slate-700 bg-[#090818]/80 text-[#8e6fff] hover:text-white text-xs font-black px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#5b4dff]" />
            <span>Message Partner</span>
          </button>
          
          <button 
            onClick={handleMockUpload}
            className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* FOUR METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Budget */}
        <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">
            TOTAL BUDGET
          </span>
          <span className="text-xl sm:text-2xl font-black text-white mt-1.5 block tracking-tight">
            {project.budget}
          </span>
        </div>

        {/* Contract Partner (Designer or Client) */}
        <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">
              {userRole === "Client" ? "DESIGNER" : "CLIENT"}
            </span>
            <span className="text-sm font-black text-white block mt-1 tracking-tight">
              {userRole === "Client" ? project.designer.name : project.client.name}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-[#8e6fff] shrink-0">
            {userRole === "Client" ? "KA" : "GVA"}
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono block">
            DEADLINE
          </span>
          <span className="text-sm sm:text-md font-black text-white mt-2 block font-sans tracking-tight">
            {project.deadline}
          </span>
        </div>

        {/* Completion Progress Bar */}
        <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">
              COMPLETION
            </span>
            <span className="text-xs font-black text-white font-mono">{completionPercent}%</span>
          </div>
          <div className="w-full bg-[#1b1935] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#5b4dff] h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* SPLIT LAYOUT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: OVERVIEW, MILESTONES, DELIVERABLES (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Project Overview */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-[24px] p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-950">
              <Folder className="w-5 h-5 text-[#8e6fff]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Project Overview
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-semibold">
              Creating a comprehensive brand identity for GreenVibe, an eco-conscious tech startup focused on sustainable energy solutions across Sub-Saharan Africa. The visual language needs to balance &ldquo;high-tech&rdquo; with &ldquo;organic/natural&rdquo; elements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">
                  KEY OBJECTIVES
                </span>
                <ul className="space-y-2 text-xs text-slate-300 font-semibold">
                  {[
                    "Logo suite (primary, secondary, icon)",
                    "Typography & Color Palette",
                    "Brand Style Guide"
                  ].map((obj, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">
                  DESIGN AESTHETIC
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Minimalist", "Sustainable", "Modernist"].map((tag, i) => (
                    <span 
                      key={i} 
                      className="bg-slate-950 border border-slate-900 text-slate-300 text-[10px] font-extrabold px-3 py-1.5 rounded-lg font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Milestone Tracking */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-[24px] p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-950">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#8e6fff]" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  Milestone Tracking
                </h2>
              </div>
              <button 
                onClick={() => triggerToast("⚡ Deep research audit: All 3 blockchain sub-nodes conform to specification guidelines.")}
                className="text-slate-400 hover:text-white transition-colors text-xs font-bold font-mono underline decor-dotted"
              >
                View All
              </button>
            </div>

            {/* Stepper Node List */}
            <div className="space-y-6 pt-2">
              {milestones.map((m, index) => {
                const isApproved = m.status === "APPROVED";
                const isInReview = m.status === "IN_REVIEW";
                const isLocked = m.status === "LOCKED";
                
                return (
                  <div key={m.id} className="relative flex items-start gap-4">
                    {/* Line connection down to next element */}
                    {index < milestones.length - 1 && (
                      <div className={`absolute left-4.5 top-8 bottom-[-24px] w-0.5 ${isApproved ? "bg-emerald-500/20" : "bg-slate-900"}`} />
                    )}

                    {/* Step Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isApproved ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : isInReview ? (
                        <div className="w-9 h-9 rounded-full bg-[#5b4dff]/15 border border-[#5b4dff]/30 flex items-center justify-center animate-pulse">
                          <Clock className="w-4 h-4 text-[#8e6fff]" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-905 border border-slate-800 flex items-center justify-center text-slate-650">
                          <Lock className="w-4 h-4 shrink-0" />
                        </div>
                      )}
                    </div>

                    {/* Title Content details */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className={`text-xs block ${isApproved ? "text-emerald-400 font-bold" : isInReview ? "text-[#8e6fff] font-bold" : "text-slate-500"}`}>
                          {m.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-semibold leading-relaxed">
                          {m.detail}
                        </span>
                      </div>

                      {/* Side Status Indicators & Client Action Trigger */}
                      <div>
                        {isApproved ? (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-emerald-500/15">
                            APPROVED
                          </span>
                        ) : isInReview ? (
                          userRole === "Client" ? (
                            <button 
                              onClick={() => handleApproveMilestone(m.id)}
                              className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-lg tracking-tight transition-all cursor-pointer shadow-md shadow-[#5b4dff]/10"
                            >
                              APPROVE MILESTONE
                            </button>
                          ) : (
                            <span className="bg-[#5b4dff]/15 text-[#8e6fff] text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-[#5b4dff]/20 animate-pulse">
                              IN REVIEW
                            </span>
                          )
                        ) : (
                          <span className="text-slate-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-slate-900 bg-slate-950/40">
                            LOCKED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Latest Deliverables */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-[24px] p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-950">
              <Paperclip className="w-5 h-5 text-[#8e6fff]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Latest Deliverables
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {deliverables.map((file) => (
                <div 
                  key={file.id}
                  className="bg-[#14122d]/40 border border-slate-900 hover:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-[9px] font-black font-mono shrink-0">
                      {file.type}
                    </div>
                    <div className="truncate min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {file.size}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => triggerToast(`📥 Custom cached node downloading payload for "${file.name}" completed.`)}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-colors rounded-lg text-slate-300 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Payload</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WORKSPACE ACTIVITY LOG & QUICK FEEDBACK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Project Activity Feed */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-[24px] p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-950">
              <Clock className="w-5 h-5 text-[#8e6fff]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Project Activity
              </h2>
            </div>

            <div id="project-activity-logs" className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {activities.map((item) => (
                <div key={item.id} className="flex gap-3 text-left">
                  {/* Avatar node */}
                  {item.avatar ? (
                    <div className="relative shrink-0 w-8 h-8">
                      <Image 
                        src={item.avatar} 
                        alt={item.author} 
                        fill
                        className="rounded-full object-cover border border-slate-800 bg-[#0c0a1a]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-900 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">
                      DB
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 leading-normal">
                      <strong className="text-white font-bold">{item.author}</strong> {item.text}
                    </p>
                    
                    {item.commentQuote && (
                      <div className="bg-[#14122d]/60 border border-slate-900 rounded-xl p-3 text-[11px] italic font-medium leading-relaxed text-slate-400">
                        &ldquo;{item.commentQuote}&rdquo;
                      </div>
                    )}

                    <span className="text-[9px] text-[#8e6fff] font-mono font-black block">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Quick Feedback Comment Form */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-[24px] p-6 shadow-xl space-y-4">
            <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider font-mono block">
              Quick Comment
            </span>

            <form onSubmit={handleSendComment} className="space-y-4">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your update or feedback..."
                className="w-full bg-[#080715] hover:bg-[#0c0a1f] border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs p-3 text-white placeholder-slate-500 outline-none resize-none duration-150 font-semibold"
                rows={4}
              />

              <div className="flex items-center justify-between gap-2.5">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input 
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="rounded border-[#1d1b38] bg-[#0c0a1f] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-350 transition-colors">
                    Notify Partner via Email
                  </span>
                </label>

                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-[#5b4dff] hover:bg-[#7546ff] disabled:opacity-40 text-white p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 shadow-lg shadow-[#5b4dff]/15 cursor-pointer"
                  title="Send Comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
