"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { Lock, ShieldCheck, KeyRound, ArrowLeft, Send, RefreshCw, AlertTriangle } from "lucide-react";

export default function TwoFactorChallenge() {
  const { pending2faUser, verify2FA, cancel2FA, recoverAccount, resetPasswordWithCode } = useAuth();
  
  // View mode switcher: "otp" | "recovery_options" | "reset_password"
  const [mode, setMode] = useState<"otp" | "recovery_options" | "reset_password">("otp");
  
  // OTP input states
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Alternative Backup/Recovery input state
  const [backupCode, setBackupCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  
  // Account Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Actions Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedReceivedCode, setSimulatedReceivedCode] = useState<string | null>(null);

  // Automatically focus the first input pin digit
  useEffect(() => {
    if (mode === "otp" && !useBackup && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [mode, useBackup]);

  if (!pending2faUser) return null;

  // Handle single digit state transition
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const singleVal = clean.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleVal;
    setDigits(newDigits);

    // Dynamic focus forward
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace retrogress focus
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    }
  };

  // OTP form verification submit trigger
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);

    const code = useBackup ? backupCode.trim() : digits.join("");
    if (code.length < 6) {
      setErrorMsg(useBackup ? "Please enter a valid backup recovery key." : "Please enter all 6 OTP challenge digits.");
      setIsLoading(false);
      return;
    }

    const matched = await verify2FA(code);
    setIsLoading(false);
    if (!matched) {
      setErrorMsg("Security challenge failed. Verify validation code. Standard codes: 123456 or 000000.");
    }
  };

  // Kickstart Email account recovery trigger
  const handleRequestRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);

    if (!recoveryEmail.trim()) {
      setErrorMsg("Please provide your registered contact email address.");
      setIsLoading(false);
      return;
    }

    const res = await recoverAccount(recoveryEmail);
    setIsLoading(false);
    if (res.success) {
      setInfoMsg(res.message);
      if (res.code) {
        setSimulatedReceivedCode(res.code);
      }
      setMode("reset_password");
    } else {
      setErrorMsg(res.message);
    }
  };

  // Submit password reset with dynamic received code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);

    if (!recoveryEmail.trim() || !recoveryCode.trim() || !newPassword.trim()) {
      setErrorMsg("All recovery credentials are required.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Your new account credentials security key must exceed 6 dimensions.");
      setIsLoading(false);
      return;
    }

    const res = await resetPasswordWithCode(recoveryEmail, recoveryCode, newPassword);
    setIsLoading(false);
    if (res.success) {
      alert(res.message);
      // Automatically redirect to log in as security reset disarmed 2FA
      cancel2FA();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#070614]/98 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0f0e22] border border-slate-905 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-7 shadow-2xl relative"
        id="two-factor-lockscreen-wrapper"
      >
        {/* Glow backdrop behind mask */}
        <div className="absolute inset-0 rounded-3xl bg-indigo-505/[0.02] border border-indigo-500/10 pointer-events-none" />

        {/* Dynamic header title based on view context */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#5b4dff]/10 border border-[#5b4dff]/20 flex items-center justify-center shadow-lg shadow-[#5b4dff]/5">
            {mode === "otp" ? (
              <ShieldCheck className="w-8 h-8 text-[#5b4dff] animate-pulse" />
            ) : (
              <KeyRound className="w-8 h-8 text-[#5b4dff]" />
            )}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {mode === "otp" && "Two-Factor Verification Required"}
              {mode === "recovery_options" && "Initiate Security Recovery"}
              {mode === "reset_password" && "Reset Account Password"}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {mode === "otp" && `Confirm your identity to access designer dashboard parameters linked to ${pending2faUser.profile?.email}.`}
              {mode === "recovery_options" && "Enter your contact liaison email. We will generate a secure recovery passcode override instantly."}
              {mode === "reset_password" && "Provide the temporary 6-digit recovery code and configure your brand new password parameters."}
            </p>
          </div>
        </div>

        {/* Info alerts */}
        <AnimatePresence mode="popLayout">
          {errorMsg && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {infoMsg && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-xl text-xs font-bold leading-relaxed relative"
            >
              <div>{infoMsg}</div>
              
              {pending2faUser?.profile?.email?.toLowerCase() === "ersnoblemedia@gmail.com" && simulatedReceivedCode && (
                <div className="mt-3 p-3 bg-slate-950 border border-slate-900 rounded-lg text-center font-mono text-sm tracking-widest text-[#5b4dff] font-black">
                  Developer Reset Code: {simulatedReceivedCode}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Mode Forms */}
        {mode === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {!useBackup ? (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block text-center font-mono">
                  Enter 6-Digit Authenticator Key
                </label>
                <div className="flex items-center justify-between gap-2.5 max-w-xs mx-auto">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      pattern="\d*"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 sm:w-12 h-12 sm:h-14 bg-slate-950 border border-slate-900 rounded-2xl text-center text-lg sm:text-2xl font-black text-white outline-none focus:border-[#5b4dff] focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-mono"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block font-mono">
                  Emergency Backup Recovery Token
                </label>
                <input
                  type="text"
                  placeholder="DB-1234-5678"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-5 py-4 text-center text-base font-mono text-slate-200 outline-none focus:border-[#5b4dff] placeholder:text-slate-600 tracking-wider"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={() => {
                  setUseBackup(!useBackup);
                  setErrorMsg("");
                }}
                className="text-[#5b4dff] hover:text-[#7546ff] font-bold cursor-pointer transition-all bg-transparent border-none font-sans"
              >
                {useBackup ? "Verify with Dynamic OTP instead" : "Use Emergency Backup Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("recovery_options");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                className="text-slate-400 hover:text-white transition-all bg-transparent border-none cursor-pointer font-sans font-medium"
              >
                Forgot 2FA or Password?
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all cursor-pointer shadow-xl shadow-[#5b4dff]/15 flex items-center justify-center gap-2 border-none font-sans disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify Challenge Key</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={cancel2FA}
                className="w-full bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-none font-sans"
              >
                Go Back / Logout
              </button>
            </div>
          </form>
        )}

        {mode === "recovery_options" && (
          <form onSubmit={handleRequestRecoveryCode} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block font-mono">Registered Account Email</label>
              <input
                type="email"
                required
                placeholder="liaison@yourdomain.com"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-[#5b4dff]"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 border-none font-sans disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Override OTP code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("otp");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                className="w-full bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-none font-sans"
              >
                Return to challenge login
              </button>
            </div>
          </form>
        )}

        {mode === "reset_password" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block font-mono">6-Digit Overriding OTP Code</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="000 000"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3.5 text-center text-lg font-mono tracking-widest text-[#5b4dff] font-black outline-none focus:border-[#5b4dff] placeholder:tracking-normal placeholder:font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block font-mono">Define New Password Key</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3.5 text-sm text-slate-200 outline-none focus:border-[#5b4dff] tracking-widest"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 border-none font-sans disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Reset password & Disarm 2FA</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("recovery_options");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                className="w-full bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-none font-sans"
              >
                Resend Override Code
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
