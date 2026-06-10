"use client";

import React, { useEffect, useState } from "react";
import { Telemetry, TelemetryEvent, getSentryDSN } from "../lib/telemetry";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldCheck, Bug, Play, X, Trash2, 
  Activity, RefreshCw, Zap, Server, ChevronDown, CheckCircle 
} from "lucide-react";

export default function SentryTelemetryProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const isAdmin = !!(profile?.role === "Admin" || profile?.email === "ersnoblemedia@gmail.com");

  const [logs, setLogs] = useState<TelemetryEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "error" | "info">("all");
  const dsn = getSentryDSN();

  // Load telemetry logs in real time
  useEffect(() => {
    const unsub = Telemetry.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => {
      unsub();
    };
  }, []);

  // Monitor toggle trigger with keyboard shortcut (Double tap 'Escape' or 'Ctrl + /' for developer diagnostics)
  useEffect(() => {
    if (!isAdmin) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "b") || (e.ctrlKey && e.key === "t")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  const triggerSimulation = () => {
    Telemetry.triggerSimulatedError();
  };

  const clearAllTelemetry = () => {
    Telemetry.clearLogs();
  };

  // If the user is not an administrator, do not show any monitor controls or overlays
  if (!isAdmin) {
    return <>{children}</>;
  }

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "error") return log.type === "error" || log.type === "unhandledrejection";
    if (filter === "info") return log.type === "info" || log.type === "event" || log.type === "warning";
    return true;
  });

  return (
    <>
      {children}

      {/* Embedded Floating Telemetry Indicator - Minimal, clean, non-obtrusive, perfectly aligned with the screen edge */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-4 rounded-xl bg-[#0f0e22]/90 hover:bg-[#161432] border border-indigo-500/20 text-indigo-400 hover:text-white flex items-center gap-2 text-xs font-mono font-bold shadow-xl shadow-black/40 backdrop-blur-md cursor-pointer transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          id="toggle-telemetry-console-btn"
        >
          <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Sentry Monitor</span>
          {logs.filter(l => l.type === 'error' || l.type === 'unhandledrejection').length > 0 && (
            <span className="h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-sans font-black">
              {logs.filter(l => l.type === 'error').length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Standard Full-Feature Slideout Drawer for Real-time Verification */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Backdrop Mask shadow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slideout Container panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg h-full bg-[#080715] border-l border-slate-900 shadow-2xl flex flex-col z-10"
              id="telemetry-dashboard-panel"
            >
              <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />

              {/* Console Header component */}
              <div className="p-6 border-b border-slate-900 bg-[#0c0a22]/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                        <span>Production Diagnostics</span>
                        <span className="text-[9px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-400 uppercase px-2 py-0.5 rounded-md">Realtime</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">Telemetry & Exception Gateway</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Indicator Grid */}
                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Ingest Endpoint</span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 font-mono truncate">
                      {dsn ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-emerald-450 truncate">Sentry Live DSN</span>
                        </>
                      ) : (
                        <>
                          <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>Sanbox Console (Ready)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Errors Isolated</span>
                    <span className="text-[11px] font-black text-slate-200 font-mono flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{logs.filter(l => l.type === 'error' || l.type === 'unhandledrejection').length} captured</span>
                    </span>
                  </div>
                </div>

                {/* Control Actions tools */}
                <div className="flex items-center justify-between gap-2.5 pt-2">
                  <button
                    onClick={triggerSimulation}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md shadow-indigo-600/10"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Simulate Crash</span>
                  </button>

                  <button
                    onClick={clearAllTelemetry}
                    disabled={logs.length === 0}
                    className="px-4 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-405 hover:text-red-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:hover:text-slate-450 disabled:cursor-not-allowed text-slate-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear logs</span>
                  </button>
                </div>
              </div>

              {/* Log Event Filter tabs */}
              <div className="flex border-b border-slate-900/60 bg-slate-950/40 p-1 font-mono text-xs">
                {(["all", "error", "info"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all border-none cursor-pointer ${
                      filter === tab 
                        ? "bg-[#25215c] text-white" 
                        : "text-slate-500 hover:text-slate-350 bg-transparent hover:text-white"
                    }`}
                  >
                    {tab === "all" ? `All Streams (${logs.length})` : tab === "error" ? `Crashes (${logs.filter(l => l.type === 'error' || l.type === 'unhandledrejection').length})` : `Events (${logs.filter(l => l.type !== 'error' && l.type !== 'unhandledrejection').length})`}
                  </button>
                ))}
              </div>

              {/* Log stream view lists */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                {filteredLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <ShieldCheck className="w-12 h-12 text-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-2xl" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-300">Clean Operational Corridor</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-1 max-w-xs leading-relaxed">
                        No errors or runtime anomalies have breached the active viewport. All diagnostic channels are fully verified.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all text-xs font-mono relative overflow-hidden backdrop-blur-sm ${
                        log.type === "error" || log.type === "unhandledrejection"
                          ? "bg-red-500/[0.02] border-red-500/20"
                          : log.type === "warning"
                          ? "bg-amber-500/[0.01] border-amber-500/15"
                          : "bg-slate-950/40 border-slate-900"
                      }`}
                    >
                      <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: log.type === "error" || log.type === "unhandledrejection" ? "#ef4444" : log.type === "warning" ? "#f59e0b" : "#6366f1" }} />
                      
                      <div className="flex items-start justify-between gap-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          log.type === "error" || log.type === "unhandledrejection"
                            ? "bg-red-500/15 text-red-400"
                            : log.type === "warning"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-indigo-500/10 text-indigo-400"
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-[10px] text-slate-650 text-slate-500 select-none">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="text-slate-200 font-sans text-xs font-bold leading-relaxed break-words">
                        {log.message}
                      </div>

                      {log.source && (
                        <div className="text-[10px] text-slate-450 text-slate-400 border-t border-slate-900/60 pt-2 flex items-center gap-1.5 truncate">
                          <span className="text-indigo-400 text-[9px] font-black uppercase">File:</span>
                          <span className="truncate text-slate-400 select-all">{log.source}{log.lineno ? `:${log.lineno}` : ""}</span>
                        </div>
                      )}

                      {log.stack && (
                        <details className="text-[10px] group border-t border-slate-900/60 pt-2 select-all">
                          <summary className="text-slate-550 hover:text-white transition-colors cursor-pointer select-none flex items-center justify-between text-slate-500">
                            <span>Diagnostic Trace</span>
                            <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180 text-slate-550 text-slate-500" />
                          </summary>
                          <pre className="mt-2 p-2.5 bg-slate-950 rounded border border-slate-900 text-[9px] text-slate-400 overflow-x-auto whitespace-pre leading-relaxed font-mono font-normal scrollbar-thin">
                            {log.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Developer notice footer */}
              <div className="p-4 border-t border-slate-900 bg-slate-950 text-center select-none">
                <p className="text-[10px] font-mono text-slate-600">
                  Secure Workspace Telemetry Engine v1.0.0 • Shift + Click to disarm
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
