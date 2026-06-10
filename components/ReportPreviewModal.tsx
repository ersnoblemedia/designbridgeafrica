"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Eye, 
  Info,
  ShieldAlert,
  Award
} from "lucide-react";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "Client" | "Designer" | "Admin";
  createdAt: string;
  updatedAt: string;
}

interface ClientProject {
  id: string;
  title: string;
  category: string;
  status: string;
  designer?: { name: string; avatar?: string };
  contractValue: string;
}

interface DesignerProject {
  id: string;
  name: string;
  deadline: string;
  client?: { name: string };
  status: string;
  budget: string;
}

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  projects?: any[];
  type: "client" | "designer";
  onDownload: () => Promise<void>;
  downloadProgress: "idle" | "loading" | "done";
}

export default function ReportPreviewModal({
  isOpen,
  onClose,
  profile,
  projects = [],
  type,
  onDownload,
  downloadProgress
}: ReportPreviewModalProps) {
  const [scale, setScale] = useState<number>(100);

  if (!isOpen) return null;

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onDownload();
  };

  const formattedDate = new Date().toLocaleString();

  // Mock static values to match pdfGenerator logic for visual perfection
  const clientLedgerItems = [
    { ref: "Invoice #1092", amount: "$1,500.00", status: "RELEASED", method: "Mastercard **2910", id: "ch_3Mv8XpLkd" },
    { ref: "Invoice #1091", amount: "$1,000.00", status: "RELEASED", method: "Stripe Escrow Sync", id: "ch_2Nv9KpYld" },
    { ref: "Invoice #1093", amount: "$3,200.00", status: "LOCKED", method: "Visa Dual Signoff", id: "ch_9Xz2WpGst" },
    { ref: "Invoice #1094", amount: "$5,000.00", status: "PENDING RELEASE", method: "M-Pesa Express API", id: "ch_4Pt9OqMbn" },
  ];

  const designerMilestones = [
    { title: "West-African Traditional Beadwork Mockups", client: "Zara Adebayo", payout: "$1,600.00", status: "RELEASED" },
    { title: "NairaFlow Digital Wireframes & Architecture", client: "NairaFlow Inc.", payout: "$925.00", status: "RELEASED" },
    { title: "Typography guidelines & dark theme variants", client: "NairaFlow Inc.", payout: "$925.00", status: "RELEASED" },
    { title: "AfriTronics UI Kit & Corporate Color Palette", client: "David Mensah", payout: "$2,200.00", status: "PENDING" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#0b0a1d] border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        id="report-preview-modal-container"
      >
        {/* Top bar controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-[#070613]/90 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#8e6fff]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight uppercase">
                {type === "client" ? "Executive Board Draft Blueprint" : "Specialist Earnings Audit Statement"}
              </h3>
              <p className="text-[10px] text-slate-450 font-mono">
                Live Interactive PDF Simulation • Current Brand Guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-900 rounded-xl p-1 text-xs text-slate-400 font-mono h-9">
              <button 
                onClick={() => setScale(Math.max(75, scale - 25))}
                className="px-2.5 py-1 hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="px-2 border-x border-slate-900 text-[10px] min-w-[45px] text-center">
                {scale}%
              </span>
              <button 
                onClick={() => setScale(Math.min(150, scale + 25))}
                className="px-2.5 py-1 hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold"
                title="Zoom In"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleDownloadClick}
              disabled={downloadProgress === "loading"}
              className="bg-[#5b4dff] hover:bg-[#7342ff] hover:scale-[1.01] text-white text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer border-none h-9 shadow-md"
              id="preview-confirm-download-btn"
            >
              {downloadProgress === "loading" ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>Compiling...</span>
                </>
              ) : downloadProgress === "done" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-900 bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer w-9 h-9 flex items-center justify-center border-none"
              title="Close Preview"
              id="preview-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable paper stage canvas area */}
        <div className="flex-1 overflow-y-auto bg-slate-950/60 p-6 sm:p-12 flex justify-center items-start custom-scrollbar">
          <div 
            style={{ transform: `scale(${scale / 100})`, transformOrigin: "top center", transition: "transform 0.15s ease-out" }}
            className="w-full max-w-[760px] bg-white rounded-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden text-slate-800 transition-all border border-slate-200"
            id="simulated-a4-pdf-canvas"
          >
            {/* Top motif row */}
            <div className="h-[4.5px] w-full flex">
              <div className="flex-1 bg-[#1e1b4b]" />
              <div className="flex-1 bg-[#6d28d9]" />
              <div className="flex-1 bg-[#8b5cf6]" />
              <div className="flex-1 bg-[#a78bfa]" />
              <div className="flex-1 bg-[#4f46e5]" />
              <div className="flex-1 bg-[#1e1b4b]" />
            </div>

            {/* Letterhead Body */}
            <div className="p-8 sm:p-10 space-y-7 text-left">
              {/* Header block with lockup and badge */}
              <div className="flex items-start justify-between border-b pb-4 border-slate-100">
                <div className="space-y-1">
                  <h1 className="text-xl font-black text-[#1e1b4b] tracking-wider leading-none">
                    DESIGNBRIDGE <span className="text-[#6d28d9]">AFRICA</span>
                  </h1>
                  <span className="text-[7.5px] text-slate-400 font-bold block tracking-wider uppercase">
                    {type === "client" 
                      ? "PREMIUM DISBURSEMENT & ESCROW ACCOUNT OVERVIEW" 
                      : "ACCOUNT SPECIALIST AUDITED EARNINGS & PROTECTION STATUS"}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  {type === "client" ? (
                    <div className="bg-[#f5f3ff] rounded-md px-3.5 py-1.5 border border-[#6d28d9]/10">
                      <div className="text-[7.5px] font-black text-[#6d28d9] tracking-wider text-center">CLIENT ADVISOR</div>
                      <div className="text-[5.5px] text-[#1e1b4b] tracking-wide mt-0.5 text-center">EXECUTIVE BLUEPRINT</div>
                    </div>
                  ) : (
                    <div className="bg-[#fff9e6] rounded-md px-3.5 py-1.5 border border-amber-300/10">
                      <div className="text-[7.5px] font-black text-amber-600 tracking-wider text-center">ELITE SPECIALIST</div>
                      <div className="text-[5.5px] text-[#1e1b4b] tracking-wide mt-0.5 text-center">SAVINGS & CAP REPORT</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Block / Credentials Card */}
              <div className="bg-[#f5f3ff] rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-500/5">
                <div className="space-y-1.5">
                  <div className="text-[8.5px] font-bold text-[#1e1b4b] tracking-wide uppercase">
                    {type === "client" ? "ACCOUNT CONTEXT & CREDENTIALS" : "SPECIALIST STATUS OVERVIEW"}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[7.5px]">
                    <div className="text-slate-400 font-semibold flex gap-1">
                      <span>{type === "client" ? "Account Owner:" : "Consultant Name:"}</span>
                      <strong className="text-[#1e1b4b] font-bold">{profile?.displayName || "Elite Member"}</strong>
                    </div>
                    <div className="text-slate-400 font-semibold flex gap-1">
                      <span>System Email:</span>
                      <strong className="text-[#1e1b4b] font-bold block truncate max-w-[150px]">{profile?.email || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <div className="md:text-right space-y-1 text-right w-full md:w-auto shrink-0">
                  <div className="text-[7px] text-slate-400 font-medium">
                    Generated On: {formattedDate}
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[5.8px] font-bold inline-block border ${
                    type === "client" 
                      ? "bg-[#e4faf3] border-emerald-250 text-[#10b981]" 
                      : "bg-[#fff9e6] border-amber-250 text-amber-600"
                  }`}>
                    {type === "client" 
                      ? "• SECURE DESIGNBRIDGE ESCROW LEDGER DATA" 
                      : "• VERIFIED ESCROW BALANCE STATEMENT"}
                  </div>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-3 gap-3.5">
                {type === "client" ? (
                  <>
                    <div className="bg-white border border-[#6d28d9]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">TOTAL ESCROW VOL</div>
                      <div className="text-xs font-bold text-[#1e1b4b] mt-1">$45,280 USD</div>
                    </div>
                    <div className="bg-white border border-[#1e1b4b]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">ACTIVE WORKSTREAMS</div>
                      <div className="text-xs font-bold text-[#6d28d9] mt-1">{projects.length} Active Contracts</div>
                    </div>
                    <div className="bg-white border border-[#6d28d9]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">ESCROW ASSURANCE</div>
                      <div className="text-[8.5px] font-bold text-[#10b981] mt-1.5 leading-none uppercase">100% ARBITRATION GUARANTEE</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white border border-[#1e1b4b]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">TOTAL ACCUMULATED SAVINGS</div>
                      <div className="text-xs font-bold text-[#10b981] mt-1">$12,450.00 USD</div>
                    </div>
                    <div className="bg-white border border-[#1e1b4b]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">LOCKED IN ESCROW</div>
                      <div className="text-xs font-bold text-[#6d28d9] mt-1">$3,200.00 USD</div>
                    </div>
                    <div className="bg-white border border-[#1e1b4b]/30 rounded-lg p-3 text-left">
                      <div className="text-[6.8px] text-slate-400 tracking-wider font-semibold uppercase">COMPLETED CONTRACTS</div>
                      <div className="text-xs font-bold text-[#1e1b4b] mt-1">14 Client Marks</div>
                    </div>
                  </>
                )}
              </div>

              {/* Table section 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <div className="text-[8.5px] font-bold text-[#1e1b4b] uppercase tracking-wide">
                    {type === "client" ? "ACTIVE ENGAGEMENTS & WORKSTREAMS" : "ACTIVE CLIENT WORKSTREAMS"}
                  </div>
                </div>
                <div className="h-[1.5px] w-8 bg-[#6d28d9]" />

                {/* Simulated Table */}
                <div className="rounded-md border border-slate-100 overflow-hidden text-[7.2px] shadow-sm">
                  {/* Table Header */}
                  <div className="bg-[#1e1b4b] text-white p-2 flex justify-between font-bold">
                    <div className="w-[45%]">
                      {type === "client" ? "PROJECT TITLE & ASSIGNED CONSULTANT" : "CONTRACT WORKSTREAM & CLIENT"}
                    </div>
                    <div className="w-[20%]">{type === "client" ? "SPECIALIST BRAND CATEGORY" : "DEADLINE"}</div>
                    <div className="w-[18%] text-right">{type === "client" ? "FINANCIAL VALUE" : "ESCROW BUDGET"}</div>
                    <div className="w-[17%] text-right">STAGE</div>
                  </div>

                  {/* Table Rows */}
                  {projects.length > 0 ? (
                    projects.slice(0, 3).map((p, idx) => {
                      const title = type === "client" ? p.title : p.name;
                      const subtitle = type === "client" 
                        ? `Consultant: ${p.designer?.name || "Premium Specialist"}` 
                        : `Client Representative: ${p.client?.name || "Premium Client Rep"}`;
                      const category = type === "client" ? (p.category || "Creative Design") : (p.deadline || "October 2026");
                      const val = type === "client" ? (p.contractValue || "$2,500.00") : (p.budget || "$2,500.00");
                      const status = p.status || "RUNNING";

                      return (
                        <div key={p.id || idx} className={`p-2 flex items-center justify-between border-t border-slate-50 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                          <div className="w-[45%] truncate pr-2">
                            <div className="font-bold text-[#171725]">{title}</div>
                            <div className="text-[5.8px] text-slate-400 mt-0.5">{subtitle}</div>
                          </div>
                          <div className="w-[20%] text-slate-500 font-semibold">{category}</div>
                          <div className="w-[18%] font-bold text-[#6d28d9] text-right">{val}</div>
                          <div className="w-[17%] text-right">
                            <span className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[5.8px] font-extrabold ${
                              status === "COMPLETED" || status === "RELEASED"
                                ? "bg-[#e4faf3] text-[#10b981]"
                                : status === "UNDER_REVIEW" || status === "PENDING"
                                ? "bg-[#fff9e6] text-amber-600"
                                : "bg-[#f2f1ff] text-[#6d28d9]"
                            }`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No active contracts found.
                    </div>
                  )}
                </div>
              </div>

              {/* Table section 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <div className="text-[8.5px] font-bold text-[#1e1b4b] uppercase tracking-wide">
                    {type === "client" ? "VERIFIED ESCROW LEDGER & PAYMENTS" : "MILESTONE & DISBURSEMENT RECORD"}
                  </div>
                </div>
                <div className="h-[1.5px] w-8 bg-[#6d28d9]" />

                {/* Simulated Table 2 */}
                <div className="rounded-md border border-slate-100 overflow-hidden text-[7.2px] shadow-sm">
                  {/* Table Header */}
                  <div className="bg-[#171725] text-white p-2 flex justify-between font-bold">
                    <div className="w-[30%]">{type === "client" ? "REFERENCE" : "DELIVERABLE DETAILS"}</div>
                    <div className="w-[22%]">{type === "client" ? "TRANSACTION HASH" : "CLIENT ASSIGNED"}</div>
                    <div className="w-[23%]">{type === "client" ? "PAYMENT METHOD LOG" : "ESCROW PAY"}</div>
                    <div className="w-[13%] text-right">{type === "client" ? "AMOUNT" : ""}</div>
                    <div className="w-[12%] text-right">STATE</div>
                  </div>

                  {/* Table Rows */}
                  {type === "client" ? (
                    clientLedgerItems.map((item, idx) => (
                      <div key={idx} className={`p-2 flex items-center justify-between border-t border-slate-10 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                        <div className="w-[30%] font-bold text-[#1e1b4b]">{item.ref}</div>
                        <div className="w-[22%] text-slate-400 font-mono tracking-tight text-[6.5px]">{item.id}</div>
                        <div className="w-[23%] text-slate-500">{item.method}</div>
                        <div className="w-[13%] font-bold text-[#1e1b4b] text-right">{item.amount}</div>
                        <div className="w-[12%] text-right">
                          <span className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[5.8px] font-extrabold ${
                            item.status === "RELEASED" 
                              ? "bg-[#e4faf3] text-[#10b981]"
                              : item.status === "LOCKED" 
                              ? "bg-[#fff9e6] text-amber-600"
                              : "bg-[#eff6ff] text-blue-600"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    designerMilestones.map((item, idx) => (
                      <div key={idx} className={`p-2 flex items-center justify-between border-t border-slate-10 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                        <div className="w-[30%] font-bold text-[#171725] truncate pr-1">{item.title}</div>
                        <div className="w-[22%] text-slate-500 font-semibold">{item.client}</div>
                        <div className="w-[23%] font-bold text-[#1e1b4b]">{item.payout}</div>
                        <div className="w-[13%] font-bold text-right"></div>
                        <div className="w-[12%] text-right">
                          <span className={`inline-block px-1.5 py-0.5 rounded-[3px] text-[5.8px] font-extrabold ${
                            item.status === "RELEASED" 
                              ? "bg-[#e4faf3] text-[#10b981]" 
                              : "bg-[#fff9e6] text-amber-600"
                          }`}>
                            {item.status === "RELEASED" ? "RELEASED" : "LOCKED"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Clause/Alert Notice Box */}
              {type === "client" ? (
                <div className="bg-[#fefce8] border border-[#cca223]/30 rounded-lg p-3 text-left flex gap-2.5 items-start">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-[7.5px] font-black text-amber-800 tracking-wide uppercase">ESCROW ASSURANCE PROTOCOL</div>
                    <p className="text-[6.5px] text-amber-700 font-semibold leading-relaxed">
                      This document constitutes a cryptographically signed activity statement guaranteed by the DesignBridge Core Protocol. Disbursements are backed up by smart-agent arbitration models. For inquiries, email support@designbridge.africa
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f5f3ff] border border-[#6d28d9]/30 rounded-lg p-3 text-left flex gap-2.5 items-start">
                  <Info className="w-4.5 h-4.5 text-[#6d28d9] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-[7.5px] font-black text-[#1e1b4b] tracking-wide uppercase">DECENTRALIZED WORKER CLAUSE</div>
                    <p className="text-[6.5px] text-slate-500 font-semibold leading-relaxed border-none">
                      Disbursal records are audited using dual-key multi-sig protection under Nigerian, Kenyan and South African regulatory provisions. Tax withholding is responsibility of specialist. DesignBridge issues periodic 1099 equivalents for your native tax authority.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Seal Box and Footer bar */}
              <div className="pt-2 flex justify-between items-end">
                <div className="text-[7px] text-slate-400 font-semibold leading-normal">
                  DesignBridge Africa • Premium Decentralized Escrow Ecosystem
                  <div className="text-[6px] text-slate-400 font-normal mt-0.5">Page 1 of 1</div>
                </div>

                <div className="bg-[#fff9e6] border border-amber-500/20 rounded-md px-4 py-2 w-44 text-center space-y-0.5 shrink-0 shadow-sm">
                  <div className="text-[6.5px] font-black text-amber-800 flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>{type === "client" ? "AUTHENTIC CERTIFICATE" : "AUTHENTIC SPECIALIST"}</span>
                  </div>
                  <div className="text-[5px] text-slate-400 font-mono">
                    {type === "client" ? "APPROVED ESCROW SEAL #DB-24-C" : "AUDITED TRUST SEAL #DB-24-S"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
