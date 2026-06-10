"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Wallet, 
  ClipboardCheck, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Star,
  MessageSquare,
  Eye,
  Clock,
  History,
  FileText
} from "lucide-react";

interface ClientDashboardViewProps {
  downloadProgress: "idle" | "loading" | "done";
  triggerReportDownload: () => void;
  activeProjects: any[];
  setSelectedProject: (p: any) => void;
  setActiveSubTab: (tab: any) => void;
  setActiveTab: (tab: any) => void;
  setIsPostingJob: (open: boolean) => void;
  recentActivities: any[];
  showAllActivity: boolean;
  setShowAllActivity: (show: boolean) => void;
  triggerZaneleDetails: () => void;
  setChatDesigner: (d: any) => void;
  setSelectedThreadId: (id: string) => void;
  downloadHistory?: any[];
  onOpenPreview?: () => void;
  onReDownloadHistory?: (item: any) => void;
}

export default function ClientDashboardView({
  downloadProgress,
  triggerReportDownload,
  activeProjects,
  setSelectedProject,
  setActiveSubTab,
  setActiveTab,
  setIsPostingJob,
  recentActivities,
  showAllActivity,
  setShowAllActivity,
  triggerZaneleDetails,
  setChatDesigner,
  setSelectedThreadId,
  downloadHistory = [],
  onOpenPreview,
  onReDownloadHistory
}: ClientDashboardViewProps) {
  const { profile } = useAuth();
  const displayName = profile?.displayName || "Bridge User";
  const firstName = displayName.split(" ")[0];

  return (
    <motion.div
      key="sub-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
      id="client-dashboard-view-container"
    >
      {/* Greetings Line */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="client-dashboard-greetings">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Good morning, {firstName} 👋
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold leading-none">
            Here&apos;s what&apos;s happening with your design projects today.
          </p>
        </div>

        <div className="flex items-center gap-2" id="client-report-header-toolbar">
          <button
            id="client-preview-report-btn"
            onClick={onOpenPreview}
            className="border border-[#8e6fff]/30 text-white bg-[#8e6fff]/10 hover:bg-[#8e6fff]/20 px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-[#8e6fff]" />
            <span>Preview Report</span>
          </button>

          <button
            id="client-download-report-btn"
            onClick={triggerReportDownload}
            disabled={downloadProgress === "loading"}
            className="border border-[#5b4dff]/30 text-white bg-[#5b4dff]/5 hover:bg-[#5b4dff]/15 px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer"
          >
            {downloadProgress === "loading" ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin" />
                <span>Compiling report...</span>
              </>
            ) : downloadProgress === "done" ? (
              <>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                <span>Downloaded Successfully</span>
              </>
            ) : (
              <>
                <Download className="w-4.5 h-4.5 text-[#8e6fff]" />
                <span>Download Reports</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of 3 Premium Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="client-metrics-grid">
        {[
          { id: "m1", title: "Active Projects", value: "12", badge: "+2 new", badgeColor: "bg-emerald-500/15 text-emerald-400", bgAccent: "border-emerald-500/20", icon: Rocket, targetTab: "projects" },
          { id: "m2", title: "Total Spent", value: "$45,280", badge: "+12.4%", badgeColor: "bg-emerald-500/15 text-emerald-400", bgAccent: "border-[#5b4dff]/20", icon: Wallet, targetTab: "invoices" },
          { id: "m3", title: "Pending Tasks", value: "8", badge: "3 urgent", badgeColor: "bg-amber-500/15 text-amber-500", bgAccent: "border-amber-500/20", icon: ClipboardCheck, targetTab: "dashboard" }
        ].map((card) => {
          const CardIcon = card.icon;
          return (
            <div 
              key={card.id}
              id={`client-metric-card-${card.id}`}
              onClick={() => {
                if (card.targetTab !== "dashboard") {
                  setActiveSubTab(card.targetTab as any);
                }
              }}
              className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all cursor-pointer group shadow-lg flex items-center justify-between"
            >
              <div className="space-y-4">
                <span className="text-[11px] uppercase font-black text-slate-550 tracking-wider font-mono block">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white tracking-tight leading-none">
                    {card.value}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-900 group-hover:scale-105 transition-transform shrink-0">
                <CardIcon className="w-5 h-5 text-[#8e6fff]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub layout details columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="client-dashboard-sublayout">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8" id="client-dashboard-left-column">
          
          {/* Active Projects Block */}
          <div className="space-y-4" id="client-active-projects-block">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase font-black tracking-widest text-[#8e6fff]">
                Active Projects
              </h3>
              <button 
                id="client-view-all-projects-btn"
                onClick={() => setActiveSubTab("projects")} 
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {activeProjects.map((p) => (
                <div 
                  key={p.id}
                  id={`client-project-row-${p.id}`}
                  onClick={() => setSelectedProject(p)}
                  className="bg-[#0e0c1f] hover:bg-[#13112b] border border-slate-900/80 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all group shadow-sm hover:translate-x-1"
                >
                  <div className="flex items-center gap-4.5">
                    {/* Colored fallback brand cover */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-800 ${
                      p.id === "p-eco" 
                        ? "bg-indigo-600/20 text-indigo-400" 
                        : "bg-amber-600/20 text-amber-400"
                    }`}>
                      <Layers className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold tracking-wide font-mono bg-[#1b1a37] text-[#8e6fff] px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          p.statusColor === "emerald" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-indigo-500/10 text-indigo-400"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-[#8e6fff] transition-colors leading-normal">
                        {p.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Image 
                          src={p.designer.avatar} 
                          alt={p.designer.name} 
                          width={18}
                          height={18}
                          className="rounded-full border border-slate-800 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-slate-400 font-semibold">
                          {p.designer.name} <span className="text-slate-600">•</span> {p.updatedText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Team avatar group */}
                    <div className="hidden sm:flex items-center -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#181636] border border-slate-900 flex items-center justify-center overflow-hidden">
                        <Image 
                          src={p.designer.avatar} 
                          alt={p.designer.name} 
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#5b4dff]/15 border border-slate-900 text-[10px] font-black text-white flex items-center justify-center">
                        +1
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors animate-pulse" />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-4" id="client-quick-actions-block">
            <h3 className="text-sm uppercase font-black tracking-widest text-[#8e6fff]">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                id="client-post-job-action"
                onClick={() => setIsPostingJob(true)}
                className="border border-slate-900 hover:border-[#5b4dff]/40 bg-[#0c0b1e]/60 hover:bg-[#12102e] rounded-2xl p-5 cursor-pointer transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/10 border border-[#5b4dff]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5 text-[#8e6fff]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-white group-hover:text-[#8e6fff] transition-colors block">
                    Post a New Job
                  </span>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                    Get professional custom proposals from top designers across the continent.
                  </p>
                </div>
              </div>

              <div 
                id="client-browse-designers-action"
                onClick={() => setActiveTab("designers")}
                className="border border-slate-900 hover:border-[#5b4dff]/40 bg-[#0c0b1e]/60 hover:bg-[#12102e] rounded-2xl p-5 cursor-pointer transition-all group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8e6fff]/10 border border-[#8e6fff]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-5 h-5 text-[#8e6fff]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-white group-hover:text-[#8e6fff] transition-colors block">
                    Browse Designers
                  </span>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                    Discover highly vetted handpicked digital creators and specialized studios.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download History Section */}
          <div className="space-y-4" id="client-download-history-block">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase font-black tracking-widest text-[#8e6fff] flex items-center gap-2">
                <History className="w-4 h-4 text-[#8e6fff]" />
                <span>PDF Download History</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                {downloadHistory.length} Saved Entries
              </span>
            </div>

            <div className="bg-[#0c0b1e]/60 border border-slate-900 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
              {/* Decorative faint background trace */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
              
              {downloadHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                  No generated reports found. Click &quot;Download Reports&quot; or &quot;Preview PDF&quot; to archive your first statement!
                </div>
              ) : (
                <div className="divide-y divide-slate-900/60 space-y-3.5">
                  {downloadHistory.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 first:pt-0 ${
                        idx === 0 ? "" : "border-t border-slate-900/60"
                      }`}
                      id={`history-row-${item.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-[#8e6fff]" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-white hover:text-[#8e6fff] transition-colors block cursor-pointer" onClick={() => onReDownloadHistory?.(item)}>
                            {item.fileName ? (item.fileName.length > 35 ? item.fileName.substring(0, 32) + "..." : item.fileName) : "Client Statement Report"}
                          </span>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.generatedAt}</span>
                            </span>
                            <span className="text-slate-700">•</span>
                            <span className="bg-[#181636] px-1.5 py-0.5 rounded text-[9px] text-[#8e6fff] font-mono tracking-wide uppercase">
                              {item.projectCount} workstreams
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onReDownloadHistory?.(item)}
                        className="bg-slate-950 hover:bg-[#181636] border border-slate-800 hover:border-[#5b4dff]/40 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        title="Re-download this historical report archive"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8e6fff]" />
                        <span>Re-download</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) - Recent Activity & Top Pick */}
        <div className="space-y-8" id="client-dashboard-right-column">
          
          {/* Recent Activity Card */}
          <div className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6.5 shadow-md space-y-5" id="client-recent-activity-card">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-sm uppercase font-black text-white tracking-wider flex items-center gap-1.5">
                <span>Recent Activity</span>
              </h3>
              <button 
                id="client-toggle-all-activity-btn"
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="text-xs font-bold text-[#8e6fff] hover:text-[#a38cff] transition-colors cursor-pointer bg-transparent border-none"
              >
                {showAllActivity ? "Collapse" : "Show all"}
              </button>
            </div>

            <div className="space-y-4">
              {(showAllActivity ? recentActivities : recentActivities.slice(0, 4)).map((act) => (
                <div key={act.id} className="flex gap-3 items-start group">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                    act.type === "design" 
                      ? "bg-indigo-400" 
                      : act.type === "message" 
                      ? "bg-emerald-400" 
                      : act.type === "invoice" 
                      ? "bg-sky-400" 
                      : "bg-amber-400"
                  }`} />
                  <div className="space-y-1">
                    <p className="text-xs text-slate-200 group-hover:text-white font-semibold transition-colors leading-relaxed">
                      {act.text}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-900 pt-3 text-center">
              <button
                id="client-show-all-activity-btn-footer"
                onClick={() => setShowAllActivity(!showAllActivity)} 
                className="text-[11px] font-extrabold text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                Show all activity
              </button>
            </div>
          </div>

          {/* Top Pick for You Card */}
          <div className="bg-gradient-to-b from-[#151336] to-[#0c0b1e] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4" id="client-top-pick-card">
            
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-[#5b4dff]/10 border border-[#5b4dff]/30 rounded-xl px-2.5 py-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8e6fff]" />
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#8e6fff] font-mono">Top Pick</span>
            </div>

            <h3 className="text-xs uppercase font-extrabold text-[#8e6fff] tracking-widest block font-mono">
              Top Pick for You
            </h3>

            <div className="flex items-center gap-3.5 pt-1">
              <Image 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                alt="Zanele Mbeki" 
                width={48}
                height={48}
                className="rounded-2xl border border-slate-800 bg-slate-950 object-cover w-12 h-12"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <span className="text-sm font-black text-white block truncate">
                  Zanele Mbeki
                </span>
                <p className="text-xs text-slate-400 font-semibold truncate leading-none mt-1">
                  Illustrator & Graphic Artist
                </p>
              </div>
            </div>

            {/* Stars Overlay */}
            <div className="bg-slate-950/40 rounded-xl p-3 flex items-center justify-between border border-slate-900/60">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" id={`zanele-star-${s}`} />
                ))}
              </div>
              <span className="text-xs text-slate-350 font-bold font-mono">
                5.0 (42 reviews)
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              Award-winning South African visual storyteller. Expert in high-density geometric branding motifs and cultural vector assets.
            </p>

            <div className="pt-2 flex gap-2">
              <button 
                id="zanele-view-profile-btn"
                onClick={triggerZaneleDetails}
                className="flex-1 bg-white hover:bg-slate-100 text-[#0d0c1d] text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center border-none"
              >
                View Profile
              </button>
              <button 
                id="zanele-message-btn"
                onClick={() => {
                  setChatDesigner({
                    id: "zanele",
                    name: "Zanele Mbeki",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  });
                  setSelectedThreadId("t3");
                  setActiveSubTab("messages");
                }}
                className="border border-slate-800 hover:bg-[#16143c]/60 text-slate-300 hover:text-white px-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center bg-transparent"
                title="Message Zanele"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}
