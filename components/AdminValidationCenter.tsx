"use client";

import React from "react";
import { ShieldAlert, CheckCircle, Clock, FileText, ArrowRight } from "lucide-react";

interface AdminValidationCenterProps {
  vettedPending: {
    id: string;
    name: string;
    city: string;
    skills: string[];
    nationalID: string;
  }[];
  handleVetCreative: (id: string) => void;
  vettedHistory: string[];
}

export default function AdminValidationCenter({
  vettedPending,
  handleVetCreative,
  vettedHistory,
}: AdminValidationCenterProps) {
  return (
    <div id="admin-vetting-workspace" className="space-y-6">
      
      {/* Informational banner warning */}
      <div className="bg-[#1c1212] border border-red-500/20 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
        <ShieldAlert className="w-5.5 h-5.5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-sm font-black text-white block">Curator Dashboard</strong>
          <p className="text-xs text-slate-350 font-medium leading-relaxed">
            Review background checks and confirm identities of independent designers to approve them for our premium marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* Left Column: Review Tasks (8 Columns) */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Clock className="w-4.5 h-4.5 text-[#8e6fff]" />
            <h3 className="text-base font-black text-white tracking-tight">Pending Talent Applications ({vettedPending.length})</h3>
          </div>

          {vettedPending.length === 0 ? (
            <div className="p-12 text-center bg-[#100f24]/30 border border-slate-900 rounded-3xl">
              <CheckCircle className="w-9 h-9 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-bold">All applications successfully verified!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vettedPending.map((p) => (
                <div key={p.id} className="bg-[#100f24]/50 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <strong className="text-base font-black text-white block">{p.name}</strong>
                      <span className="text-xs text-slate-400 block font-semibold mt-0.5">Location: {p.city}</span>
                    </div>
                    <span className="text-xs font-mono bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl font-bold">
                      ID Number: {p.nationalID}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((s) => (
                      <span key={s} className="text-xs font-semibold font-mono px-3 py-1 rounded bg-[#0d0c1d] border border-slate-900 text-[#9d8aff]">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between border-t border-slate-900 pt-3.5 gap-4">
                    <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-slate-500" /> Identity &amp; Portfolio Verification Complete
                    </span>
                    <button 
                      onClick={() => handleVetCreative(p.id)}
                      className="bg-[#5b4dff] hover:bg-[#7546ff] text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01]"
                    >
                      <span>Approve Designer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Historical Logs (4 Columns) */}
        <div className="md:col-span-4 bg-[#100f24]/40 border border-slate-900 p-6 rounded-3xl h-fit space-y-4 shadow-md">
          <strong className="text-sm uppercase font-black text-slate-300 tracking-wider block">Recent Curator Audits</strong>
          <div className="h-[1px] bg-slate-900" />

          {vettedHistory.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic">No actions recorded in current session.</p>
          ) : (
            <ul className="space-y-2 text-xs font-mono font-medium">
              {vettedHistory.map((hist, index) => (
                <li key={index} className="flex items-start gap-2.5 text-emerald-400 leading-relaxed bg-[#0d0c1d] border border-slate-900 p-2.5 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hist}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
}
