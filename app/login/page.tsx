"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const { user, profile, loginWithGoogle, loading, logout } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

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
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err?.message || "An authentication error occurred.");
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center">
              {errorMsg}
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
          ) : (
            <div className="space-y-5">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-[#5b4dff] hover:bg-[#7546ff] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#5b4dff]/20 disabled:opacity-50 cursor-pointer border-none"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.82 0 3.485.7 4.76 1.84l2.437-2.437C17.48 1.636 14.99 0 12.24 0 6.136 0 1.25 4.886 1.25 11s4.886 11 11 11c5.81 0 10.74-4.17 10.74-11 0-.74-.08-1.455-.25-2.125h-10.5M12 24H1.25v-.9H12v.9"/>
                    </svg>
                    <span>{isSignUp ? "Sign Up Free With Google" : "Sign In With Google"}</span>
                  </>
                )}
              </button>
              
              <div className="text-center pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="bg-transparent border-none text-[11px] font-semibold text-[#8e6fff] hover:text-[#a58dff] cursor-pointer"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in securely" 
                    : "First time on DesignBridge? Sign up and join the network"
                  }
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Area */}
      <footer className="py-6 text-center text-[10px] text-slate-600 relative z-10">
        © {new Date().getFullYear()} DesignBridge Africa Vetting Consortium. All Rights Reserved.
      </footer>

    </div>
  );
}
