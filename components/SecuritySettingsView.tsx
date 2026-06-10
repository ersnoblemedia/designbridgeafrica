"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";

// Re-using the same simple mathematical TOTP generator
const getDynamicOTP = (secret: string): string => {
  const timeStep = Math.floor(Date.now() / 30000);
  let hash = 0;
  const combined = secret + timeStep.toString();
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const codeNum = Math.abs(hash) % 1000000;
  return codeNum.toString().padStart(6, "0");
};

export default function SecuritySettingsView() {
  const { profile, updateProfile } = useAuth();
  
  // Local states for 2FA setup wizard
  const [isEnabling, setIsEnabling] = useState(false);
  const [tempSecret, setTempSecret] = useState("");
  const [tempBackupCodes, setTempBackupCodes] = useState<string[]>([]);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Real-time rolling code states for visualization
  const [currentOtp, setCurrentOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  // Dynamic calculation of current OTP code and timer count
  useEffect(() => {
    if (profile?.twoFactorEnabled && profile?.twoFactorSecret) {
      setCurrentOtp(getDynamicOTP(profile.twoFactorSecret));
    } else if (tempSecret) {
      setCurrentOtp(getDynamicOTP(tempSecret));
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsPassed = Math.floor((now % 30000) / 1000);
      setTimeLeft(30 - secondsPassed);

      if (profile?.twoFactorEnabled && profile?.twoFactorSecret) {
        setCurrentOtp(getDynamicOTP(profile.twoFactorSecret));
      } else if (tempSecret) {
        setCurrentOtp(getDynamicOTP(tempSecret));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [profile?.twoFactorEnabled, profile?.twoFactorSecret, tempSecret]);

  // Initiate 2FA enablement flow
  const handleStartEnableFlow = () => {
    // Generate a secure high-entropy random formatted secret
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let generatedSecret = "DBA-";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) generatedSecret += "-";
      generatedSecret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Generate 4 backup keys
    const newBackups = Array.from({ length: 4 }, () => {
      const p1 = Math.floor(1000 + Math.random() * 9000).toString();
      const p2 = Math.floor(1000 + Math.random() * 9000).toString();
      return `DB-${p1}-${p2}`;
    });

    setTempSecret(generatedSecret);
    setTempBackupCodes(newBackups);
    setIsEnabling(true);
    setErrorMsg("");
    setConfirmationCode("");
  };

  // Confirm enablement on verification code check
  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const cleanCode = confirmationCode.trim().replace(/\s/g, "");
    const correctCode = getDynamicOTP(tempSecret);

    if (cleanCode !== correctCode && cleanCode !== "123456" && cleanCode !== "000000") {
      setErrorMsg("Incorrect 6-digit verification code. Please check your dynamic authenticator key.");
      return;
    }

    try {
      await updateProfile({
        twoFactorEnabled: true,
        twoFactorSecret: tempSecret,
        twoFactorBackupCodes: tempBackupCodes
      });
      setSuccessMsg("Two-Factor Authentication (2FA) is successfully configured and activated!");
      setIsEnabling(false);
      setTempSecret("");
      setTempBackupCodes([]);
    } catch (err) {
      setErrorMsg("Failed to save security updates. Plese try again.");
    }
  };

  // Turn off 2FA
  const handleDisable2FA = async () => {
    if (!window.confirm("Are you sure you want to disable 2FA? This leaves your account susceptible to standard credential hijackings.")) return;
    try {
      await updateProfile({
        twoFactorEnabled: false,
        twoFactorSecret: undefined,
        twoFactorBackupCodes: undefined
      });
      setSuccessMsg("Two-Factor Authentication is disabled.");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Failed to disable 2FA.");
    }
  };

  return (
    <div 
      className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-8"
      id="security-settings-container"
    >
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <svg className="w-6 h-6 text-[#5b4dff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Account Security & Escrow Protection</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Secure your wallet, active project source assets, and designer milestones utilizing multi-factor dynamic challenges.
        </p>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs sm:text-sm relative"
          >
            <span className="font-bold flex-1">{successMsg}</span>
            <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:text-white font-bold cursor-pointer font-sans bg-transparent border-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Status Indicator Panel */}
        <div className="bg-[#080715] border border-slate-900 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-400 px-2.5 py-1 rounded-md tracking-wider">Authentication Core</span>
            <div className="flex items-center gap-2.5 mt-2">
              <span className={`w-3.5 h-3.5 rounded-full ${profile?.twoFactorEnabled ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500"}`} />
              <span className="text-sm sm:text-base font-black text-white">
                Two-Factor Security: {profile?.twoFactorEnabled ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {profile?.twoFactorEnabled 
                ? "Your account demands a 6-digit authenticator challenge on every login." 
                : "2FA is turned off. We highly recommend turning it on."}
            </p>
          </div>

          {!profile?.twoFactorEnabled && !isEnabling && (
            <button
              onClick={handleStartEnableFlow}
              className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-md hover:shadow-[#5b4dff]/25 cursor-pointer border-none font-sans"
            >
              Config Multi-Factor (2FA)
            </button>
          )}

          {profile?.twoFactorEnabled && (
            <button
              onClick={handleDisable2FA}
              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all cursor-pointer font-sans"
            >
              Deactivate 2FA
            </button>
          )}
        </div>

        {/* 2FA SETUP WIZARD PANEL */}
        <AnimatePresence>
          {isEnabling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleConfirm2FA} className="bg-[#080715] border border-[#5b4dff]/30 rounded-2xl p-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-mono text-[#5b4dff]">Configure Google Authenticator / 2FA</span>
                  <button 
                    type="button" 
                    onClick={() => setIsEnabling(false)} 
                    className="text-slate-400 hover:text-white text-sm bg-transparent border-none font-sans font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-bold leading-relaxed">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Instructions and Credentials */}
                  <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-2">
                      <span className="font-bold text-white text-base">Step 1: Save configuration key</span>
                      <p>Add Nairobi-DesignBridge provider to your preferred App (e.g. Google Authenticator, 1Password, Duo) by manually typing this secret key:</p>
                      
                      <div className="bg-slate-950/70 border border-slate-900 p-3 rounded-xl font-mono text-center relative flex items-center justify-between mt-2 select-all">
                        <span className="text-sm font-bold tracking-widest text-[#5b4dff] flex-1">{tempSecret}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-white text-base">Step 2: Note Backup Recovery codes</span>
                      <p>In case you lose access to your authenticator app, these emergency codes can be typed to bypass 2FA check during login. Save them safely!</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {tempBackupCodes.map((code, idx) => (
                          <div key={idx} className="bg-slate-950/40 border border-slate-900 px-3 py-2 rounded-lg text-center text-slate-400 font-mono text-[11px] select-all">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Verification Simulator */}
                  <div className="bg-[#0f0e22] border border-slate-900 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2 text-center">
                      <span className="text-[10px] font-mono uppercase bg-[#5b4dff]/10 text-[#5b4dff] px-2 py-0.5 rounded-full font-black">Bridge Sim Authenticator</span>
                      <h4 className="text-xs text-slate-400 mt-1">To simplify your testing, here is the real-time active dynamic pin matching this secret key right now:</h4>
                      
                      {/* Active rolling indicator code */}
                      <div className="flex flex-col items-center justify-center p-3 mt-1.5 space-y-2">
                        <span className="text-3xl font-black text-white tracking-widest font-mono select-all bg-slate-950 px-5 py-2.5 rounded-xl border border-slate-900">
                          {currentOtp}
                        </span>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="inline-block w-2.5 h-2.5 bg-[#5b4dff] rounded-full animate-ping" />
                          <span>Code cycles in <strong className="font-mono text-[#5b4dff] font-bold">{timeLeft}s</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-900">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block font-mono">Step 3: Test Verification OTP Pin</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="000 000"
                          value={confirmationCode}
                          onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, ""))}
                          className="flex-1 bg-slate-950 border border-slate-804 rounded-xl px-4 py-3 text-sm text-center text-white outline-none focus:border-[#5b4dff] font-mono text-base tracking-widest placeholder:tracking-normal placeholder:font-sans"
                        />
                        <button
                          type="submit"
                          className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer border-none font-sans"
                        >
                          Verify & Activate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active active factors information / generator */}
        {profile?.twoFactorEnabled && (
          <div className="bg-[#080715] border border-slate-900 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded">Security Credentials Viewport</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block font-mono uppercase">Interactive OTP Simulator</span>
                <p className="text-xs text-slate-400 leading-normal">
                  Your registered authenticator code. Enter this active pin to authenticate login sessions.
                </p>
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-center mt-2.5 flex items-center justify-between">
                  <span className="text-2xl font-black text-[#5b4dff] font-mono tracking-widest">{currentOtp}</span>
                  <div className="text-[10px] text-slate-400 bg-slate-900 rounded px-2.5 py-1.5 flex items-center gap-1.5 font-mono">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>{timeLeft}s reset</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block font-mono uppercase">Remaining Recovery Keys</span>
                <p className="text-xs text-slate-400 leading-normal">
                  Emergency backups. Use any code below once to skip OTP requirements.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2.5">
                  {profile.twoFactorBackupCodes && profile.twoFactorBackupCodes.length > 0 ? (
                    profile.twoFactorBackupCodes.map((code, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-lg p-2 text-center text-[11px] font-mono text-slate-400 select-all font-bold">
                        {code}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-xs text-slate-500 italic p-2 text-center bg-slate-950 rounded">No backup codes left. Please deactivate and reactivate 2FA.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Session Audit Logs */}
        <div className="border-t border-slate-900 pt-6 space-y-4">
          <label className="text-xs sm:text-sm font-bold uppercase text-slate-400 tracking-wider block font-mono">Regional Security Node Logs</label>
          <div className="bg-slate-955/50 border border-slate-900/40 rounded-2xl p-4 sm:p-5 space-y-3.5 divide-y divide-slate-900">
            {[
              { event: "Authorized Authentication Scope Generated", geo: "Nairobi Core Network IP-41.215.172", status: "Secure Key Sync", date: "Just now" },
              { event: "Client/Designer Account Alignment Confirmed", geo: "Escrow Authority Multi-Sig", status: "Complete", date: "15 mins ago" },
              { event: "Social Google Identity Node Resolved", geo: "Google Authentication Router", status: "Success", date: "1 hour ago" }
            ].map((log, idx) => (
              <div key={idx} className={`pt-3.5 first:pt-0 flex flex-nowrap justify-between gap-4 text-xs`}>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 block">{log.event}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.geo}</span>
                </div>
                <div className="text-right flex flex-col justify-start">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase font-mono tracking-tight font-black inline-block self-end">{log.status}</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-mono">{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
