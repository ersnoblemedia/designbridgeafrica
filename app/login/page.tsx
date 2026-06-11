"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../../components/AuthProvider";
import TwoFactorChallenge from "../../components/TwoFactorChallenge";

export default function LoginPage() {
  const { 
    user, 
    profile, 
    loginWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    loading, 
    logout,
    recoverAccount,
    resetPasswordWithCode 
  } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"Client" | "Designer" | "Admin">("Client");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Password Recovery workflow states
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      router.push("/");
    }
  }, [user, profile, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "signup" || params.get("signup") === "true") {
        setIsSignUp(true);
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err?.message || "An authentication error occurred.");
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (isSignUp && !displayName) {
      setErrorMsg("Please provide your full professional or company name.");
      return;
    }

    try {
      setActionLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName, role);
        setSuccessMsg("Account successfully registered! Redirecting to workspace...");
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg("Success! Secure connection established.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Verify your credentials and try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSimulatedOTP(null);
    
    if (recoveryStep === 1) {
      if (!recoveryEmail) {
        setErrorMsg("Please enter your registered email address.");
        return;
      }
      try {
        setActionLoading(true);
        const res = await recoverAccount(recoveryEmail);
        if (res.success) {
          setSuccessMsg(res.message);
          if (res.code) {
            setSimulatedOTP(res.code);
          }
          setRecoveryStep(2);
        } else {
          setErrorMsg(res.message);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Failure triggering recovery sequence.");
      } finally {
        setActionLoading(false);
      }
    } else {
      if (!recoveryCode || !newPassword) {
        setErrorMsg("Please provide both the 6-digit recovery OTP and your new secure password.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("Your new password must be at least 6 characters.");
        return;
      }
      try {
        setActionLoading(true);
        const res = await resetPasswordWithCode(recoveryEmail, recoveryCode, newPassword);
        if (res.success) {
          setSuccessMsg(res.message);
          // Prefill login input fields with recovered credentials for sleek UX
          setEmail(recoveryEmail);
          setPassword(newPassword);
          setIsRecovering(false);
          setRecoveryStep(1);
          setRecoveryEmail("");
          setRecoveryCode("");
          setNewPassword("");
          setSimulatedOTP(null);
        } else {
          setErrorMsg(res.message);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Failure executing key reset routine.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-[#0d0c1d] flex flex-col justify-between relative overflow-hidden">
      
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#5b4dff]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8e6fff]/10 blur-[130px] pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1d3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1d3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Header Spacer */}
      <header className="max-w-[1600px] mx-auto px-4 sm:px-6 w-full h-16 sm:h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            className="h-8 sm:h-9 w-auto object-contain" 
            alt="DesignBridge Africa Logo" 
            referrerPolicy="no-referrer"
          />
        </div>
        <button 
          onClick={() => router.push("/")}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          Back to Showcase
        </button>
      </header>

      {/* Body Card */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#100f24]/85 border border-slate-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl max-w-md w-full shadow-2xl space-y-7"
        >
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex bg-[#070612]/85 p-1 rounded-xl border border-slate-900/80 w-full relative z-10">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer border-none focus:outline-none ${
                !isSignUp 
                  ? "bg-[#5b4dff] text-white shadow-md shadow-[#5b4dff]/15" 
                  : "text-slate-400 hover:text-white bg-transparent"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer border-none focus:outline-none ${
                isSignUp 
                  ? "bg-[#5b4dff] text-white shadow-md shadow-[#5b4dff]/15" 
                  : "text-slate-400 hover:text-white bg-transparent"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center space-y-3 pt-1">
            <div className="w-12 h-12 rounded-full bg-[#5b4dff]/10 border border-[#5b4dff]/30 flex items-center justify-center mx-auto">
              {isSignUp ? (
                <UserPlus className="w-5 h-5 text-[#8e6fff]" />
              ) : (
                <Lock className="w-5 h-5 text-[#8e6fff]" />
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-sans transition-all">
              {isSignUp ? "Join DesignBridge Africa" : "Access Secure Workspace"}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto transition-all">
              {isSignUp 
                ? "Create a premium, verified talent profile or corporate search key to showcase assets or hire African creatives."
                : "Verify your professional identity to draft listings, execute escrow transactions, and coordinate briefs."
              }
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-505/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs text-center font-semibold animate-pulse">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs text-center font-bold">
              {successMsg}
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center space-y-2 col-span-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-300">
                  Signed in securely as: <strong className="text-white">{user.email}</strong>
                </p>
                <p className="text-[10px] text-slate-400">Loading user profile and workspace layout credentials...</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push("/")}
                  className="flex-1 bg-[#5b4dff] hover:bg-[#7546ff] text-white py-3 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  Enter Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={logout}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-950 text-slate-400 py-3 px-4 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : isRecovering ? (
            <form onSubmit={handleRecoverySubmit} className="space-y-5">
              <div className="text-center space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-900 border-dashed">
                <span className="text-[9px] uppercase font-mono bg-[#5b4dff]/15 text-[#8e6fff] px-2.5 py-0.5 rounded-full font-bold">
                  Step {recoveryStep} of 2
                </span>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mt-1.5">
                  {recoveryStep === 1 ? "Initiate Recovery Sequence" : "Set New Secure Password"}
                </h3>
              </div>

              {recoveryStep === 1 ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    If verified inside the master index, a secure verification code will be dispatched instantly to confirm authentication parameters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-[#8e6fff]">
                      Verification OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full bg-slate-950/80 border border-indigo-500/30 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-center text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-[border] font-mono font-bold tracking-widest text-sm"
                    />
                  </div>

                  {recoveryEmail.toLowerCase() === "ersnoblemedia@gmail.com" && simulatedOTP && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-[10px] text-center font-mono">
                      🔑 Developer Recovery OTP: <strong className="text-white tracking-widest text-xs">{simulatedOTP}</strong> (Input this value to verify)
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      New Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] active:scale-[0.99] text-white py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer border-none uppercase tracking-wider"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>{recoveryStep === 1 ? "Lookup Account & Send OTP" : "Finalize Key Reset"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecovering(false);
                    setRecoveryStep(1);
                    setRecoveryEmail("");
                    setRecoveryCode("");
                    setNewPassword("");
                    setSimulatedOTP(null);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="bg-transparent border-none text-[11px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  ← Return to standard log in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEmailAuthSubmit} className="space-y-5">
              
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Professional / Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Amara Okafor or Kola Studios"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
                  />
                </div>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    I want to join as a
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("Client")}
                      className={`py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        role === "Client"
                          ? "bg-slate-950 border-[#5b4dff]/60 text-white shadow-md shadow-[#5b4dff]/10"
                          : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Client (Hire Creator)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("Designer")}
                      className={`py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        role === "Designer"
                          ? "bg-slate-950 border-[#5b4dff]/60 text-white shadow-md shadow-[#5b4dff]/10"
                          : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Designer (Showcase Code)
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Secure Access Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecovering(true);
                        setRecoveryStep(1);
                        setRecoveryEmail(email); // Autofill current typed email if any
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="bg-transparent border-none text-[10px] font-bold text-[#8e6fff] hover:text-[#a58dff] cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff]/60 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5b4dff]/40 transition-all font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] active:scale-[0.99] text-white py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer border-none uppercase tracking-wider"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Generate Creator Access" : "Authenticate Entry"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center my-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-900" />
                </div>
                <span className="relative z-10 bg-[#100f24] px-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                  Or Connect Instantly
                </span>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-[#080714] hover:bg-[#0c0a1f] border border-slate-850 active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-3 shadow disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#5b4dff] border-t-transparent animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-[#8e6fff]" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.82 0 3.485.7 4.76 1.84l2.437-2.437C17.48 1.636 14.99 0 12.24 0 6.136 0 1.25 4.886 1.25 11s4.886 11 11 11c5.81 0 10.74-4.17 10.74-11 0-.74-.08-1.455-.25-2.125h-10.5M12 24H1.25v-.9H12v.9"/>
                    </svg>
                    <span>{isSignUp ? "Sign Up Free with Google" : "Sign In with Google"}</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="bg-transparent border-none text-[11px] font-semibold text-[#8e6fff] hover:text-[#a58dff] cursor-pointer"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in securely" 
                    : "First time on DesignBridge? Sign up and join the network"
                  }
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer Area */}
      <footer className="py-6 text-center text-[10px] text-slate-600 relative z-10">
        © {new Date().getFullYear()} DesignBridge Africa Vetting Consortium. All Rights Reserved.
      </footer>

      <TwoFactorChallenge />

    </div>
  );
}
