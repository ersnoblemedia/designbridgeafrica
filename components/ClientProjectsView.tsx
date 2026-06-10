"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  ChevronRight 
} from "lucide-react";

interface ClientProjectsViewProps {
  activeProjects: any[];
  setSelectedProject: (p: any) => void;
  setChatDesigner: (d: any) => void;
  setSelectedThreadId: (id: string) => void;
  setActiveSubTab: (tab: any) => void;
}

export default function ClientProjectsView({
  activeProjects,
  setSelectedProject,
  setChatDesigner,
  setSelectedThreadId,
  setActiveSubTab
}: ClientProjectsViewProps) {
  return (
    <motion.div
      key="sub-projects"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
      id="client-projects-view-container"
    >
      <div>
        <h3 className="text-xl font-black text-white tracking-tight">Active Escrow Projects</h3>
        <p className="text-xs text-slate-400 mt-1">Trace real-time designer progress on submitted milestone deliverables.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeProjects.map((p) => (
          <div 
            key={p.id}
            id={`client-projects-view-card-${p.id}`}
            className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-6 space-y-6 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-800 bg-indigo-650/10 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold tracking-wide font-mono text-[#8e6fff] block">{p.category}</span>
                  <h4 className="text-md font-black text-white mt-1">{p.title}</h4>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-400 font-bold px-3 py-1 bg-slate-950 border border-slate-900 rounded-xl">
                  Contract Value: <strong className="text-white">{p.contractValue}</strong>
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  p.statusColor === "emerald" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}>
                  {p.status}
                </span>
              </div>
            </div>

            {/* Milestones stepper logs */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider font-mono block">Milestone Roadmap</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {p.milestones.map((m: string, idx: number) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                      m.includes("[Done]") 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                        : m.includes("[In Progress]") || m.includes("[Active]")
                        ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400 font-bold"
                        : "bg-slate-950/40 border-slate-900 text-slate-500"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {m.includes("[Done]") ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : m.includes("[In Progress]") || m.includes("[Active]") ? (
                        <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-800" />
                      )}
                    </div>
                    <span className="text-xs">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action trigger row */}
            <div className="bg-slate-950/40 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-900/40">
              <div className="flex items-center gap-2.5">
                <Image 
                  src={p.designer.avatar} 
                  alt={p.designer.name} 
                  width={28}
                  height={28}
                  className="rounded-lg border border-slate-800 object-cover w-7 h-7"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{p.designer.name}</span>
                  <span className="text-[10px] text-slate-500">{p.designer.bio}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  id={`p-inspection-btn-${p.id}`}
                  onClick={() => {
                    setSelectedProject(p);
                  }}
                  className="flex-1 sm:flex-none border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer bg-transparent"
                >
                  Inspection Hub
                </button>
                <button 
                  id={`p-chat-btn-${p.id}`}
                  onClick={() => {
                    setChatDesigner({
                      id: p.id === "p-eco" ? "abebe" : "kofi", // link matching designer index
                      name: p.designer.name,
                      avatar: p.designer.avatar
                    });
                    setSelectedThreadId(p.id === "p-eco" ? "t1" : "t2");
                    setActiveSubTab("messages");
                  }}
                  className="flex-1 sm:flex-none bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer border-none"
                >
                  Huddle Chat
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </motion.div>
  );
}
