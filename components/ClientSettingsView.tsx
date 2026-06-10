"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SecuritySettingsView from "./SecuritySettingsView";

interface ClientSettingsViewProps {
  emailPrefs: {
    instantMessages: boolean;
    fileUploads: boolean;
    escrowUpdates: boolean;
  };
  handleEmailPrefsChange: (key: "instantMessages" | "fileUploads" | "escrowUpdates") => void;
}

export default function ClientSettingsView({
  emailPrefs,
  handleEmailPrefsChange
}: ClientSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="space-y-6">
      {/* Settings Sub-Tab Option Switcher */}
      <div className="flex border-b border-slate-900 bg-[#070614]/80 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
            activeTab === "profile" 
              ? "bg-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/20" 
              : "text-slate-400 hover:text-white bg-transparent"
          }`}
        >
          Company Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-none ${
            activeTab === "security" 
              ? "bg-[#5b4dff] text-white shadow-lg shadow-[#5b4dff]/20" 
              : "text-slate-400 hover:text-white bg-transparent"
          }`}
        >
          Security & 2FA
        </button>
      </div>

      {activeTab === "security" ? (
        <SecuritySettingsView />
      ) : (
        <motion.div
          key="sub-settings"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-8"
          id="client-settings-view-container"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Security & Profile Coordination</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">Configure automated matching coordinates and escrow authentication factors.</p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-900">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Company Legal Label</label>
          <input 
            type="text" 
            defaultValue="Nairobi Heritage Luxury Hotels Ltd" 
            className="w-full bg-[#080715] border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-250 outline-none focus:border-[#5b4dff]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Registered Country Coordinates</label>
          <input 
            type="text" 
            defaultValue="Nairobi, Kenya" 
            className="w-full bg-[#080715] border border-[#5b4dff]/40 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-250 outline-none focus:border-[#5b4dff]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Liaison Notification Email</label>
          <input 
            type="email" 
            defaultValue="liaison@nairobiheritage.luxury" 
            className="w-full bg-[#080715] border border-[#5b4dff]/40 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-250 outline-none focus:border-[#5b4dff]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Stripe Connected Node ID</label>
          <input 
            type="text" 
            readOnly 
            defaultValue="acct_1H9mKqPlGstN9xLm" 
            className="w-full bg-slate-955 border border-slate-900 text-slate-500 rounded-xl px-4 py-3 text-sm sm:text-base font-mono outline-none cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-5">
        <h4 className="text-base sm:text-lg font-black text-white">Escrow & AI Guard Preferences</h4>
        <div className="space-y-4">
          {[
            { title: "Automated Escrow Milestone Locking", desc: "Instantly lock 50% milestone funds into escrow nodes upon designer alignment approval." },
            { title: "Smart-Match Priority Direct Referral", desc: "Allow our AI vetting engine to auto-refer open briefs directly to top 3 matching candidates." },
            { title: "Verify Regional Tax Withholdings", desc: "Withhold necessary regional service taxes during transaction releases for local compliances." }
          ].map((pref, idx) => (
            <label key={idx} className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-805 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-5 h-5 cursor-pointer mt-0.5"
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
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">Configure which instant updates trigger a notification to your liaison email endpoint.</p>
        
        <div className="space-y-4 mt-2">
          {[
            { key: "instantMessages" as const, title: "Instant Messaging & Whiteboard Huddles", desc: "Receive immediate email notifications whenever a design partner sends a message or initiates a layout huddle." },
            { key: "fileUploads" as const, title: "Design Portfolio & Milestone Uploads", desc: "Get notified as soon as high-resolution source vector graphics or deliverables are pushed for milestone examination." },
            { key: "escrowUpdates" as const, title: "Escrow Locked & Smart Contract Milestones", desc: "Receive automated notifications during escrow deposits, pending releases, or successful ledger transactions." }
          ].map((pref) => (
            <label key={pref.key} className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={emailPrefs[pref.key]}
                onChange={() => handleEmailPrefsChange(pref.key)}
                className="rounded border-slate-805 bg-[#080715] text-[#5b4dff] focus:ring-0 focus:ring-offset-0 w-5 h-5 cursor-pointer mt-0.5"
              />
              <div className="space-y-1">
                <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors flex flex-wrap items-center gap-2.5">
                  <span>{pref.title}</span>
                  {emailPrefs[pref.key] ? (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 uppercase font-mono px-3 py-0.5 rounded-full font-black tracking-tight font-sans">Opted In</span>
                  ) : (
                    <span className="text-[10px] bg-red-500/10 text-red-400 uppercase font-mono px-3 py-0.5 rounded-full font-black tracking-tight font-sans">Opted Out</span>
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
          id="client-save-settings-btn"
          onClick={() => alert("Credentials & notification settings saved successfully! Your organization's configuration parameters are verified across the regional registry.")}
          className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer border-none font-sans uppercase tracking-wider"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  )}
</div>
  );
}
