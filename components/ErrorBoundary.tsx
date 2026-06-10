"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Telemetry } from "../lib/telemetry";
import { ShieldX, RefreshCw, AlertTriangle, ArrowRight, Zap } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log exception seamlessly inside Sentry & database telemetry
    Telemetry.log({
      type: "error",
      message: error.message || "React component caught crash exception",
      stack: `${error.stack || ""}\nComponent Stack: ${errorInfo.componentStack || ""}`,
      source: "ErrorBoundaryReact",
      metadata: {
        componentStack: errorInfo.componentStack,
        isReactBoundaryCrash: true
      }
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070614] flex items-center justify-center p-4 sm:p-6" id="error-boundary-view">
          {/* Ambient Purple Grid background */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5b4dff]/5 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-505/5 rounded-full blur-[128px] pointer-events-none" />

          <div className="bg-[#0f0e22] border border-red-500/20 max-w-2xl w-full rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-[#5b4dff] to-amber-500" />
            
            {/* Header Lockup */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <ShieldX className="w-7 h-7 text-red-400" />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>Workspace Isolation Incident</span>
                  <span className="text-[10px] uppercase font-mono bg-red-500/15 text-red-400 px-2.5 py-0.5 rounded-full font-bold">Captured</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed text-slate-400">
                  DesignBridge real-time security telemetry has isolated a crash within the component tree stack. Your project state has been secured.
                </p>
              </div>
            </div>

            {/* Micro Crash Stack trace details */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 sm:p-5 space-y-3 font-mono text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-900 pb-2.5">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Core Stack Diagnostics
                </span>
                <span className="text-red-400 text-[10px] select-all bg-red-500/10 px-2.5 py-0.5 rounded-md">Error Capture Complete</span>
              </div>
              
              <div className="text-xs text-red-300 font-bold overflow-x-auto select-all leading-normal whitespace-pre-wrap">
                {this.state.error ? this.state.error.toString() : "Unknown compilation deviation detected."}
              </div>

              {this.state.errorInfo?.componentStack && (
                <div className="text-[10px] text-slate-450 pt-2 border-t border-slate-900 max-h-32 overflow-y-auto whitespace-pre leading-relaxed text-slate-500 scrollbar-thin select-all">
                  {this.state.errorInfo.componentStack.trim()}
                </div>
              )}
            </div>

            {/* Action Targets */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-slate-900 pt-6">
              <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Production Sentry telemetry active</span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={this.handleReset}
                  className="flex-1 sm:flex-none bg-[#5b4dff] hover:bg-[#7546ff] text-white py-3 px-6 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#5b4dff]/15 border-none"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restore Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
