"use client";

import React from "react";
import { motion } from "framer-motion";

interface ClientInvoicesViewProps {
  invoices: any[];
  setInvoices: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ClientInvoicesView({
  invoices,
  setInvoices
}: ClientInvoicesViewProps) {
  return (
    <motion.div
      key="sub-invoices"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
      id="client-invoices-view-container"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Ledger & Invoices</h3>
          <p className="text-xs text-slate-400 mt-1">Audit active payments escrow entries protected by smart contracts.</p>
        </div>
        <span className="text-xs bg-slate-950 border border-slate-900 px-3 py-1.5 rounded-xl font-mono text-slate-300 font-bold">
          Escrow Locked Balance: <span className="text-[#8e6fff]">$8,200</span>
        </span>
      </div>

      <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 uppercase font-mono text-slate-500 font-black tracking-widest border-b border-slate-900">
                <th className="p-4.5">Invoice ID</th>
                <th className="p-4.5">Project Brief</th>
                <th className="p-4.5">Recipient Specialist</th>
                <th className="p-4.5">Amount</th>
                <th className="p-4.5">Issue Date</th>
                <th className="p-4.5">Escrow State</th>
                <th className="p-4.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="p-4.5 font-mono font-bold text-white">{inv.id}</td>
                  <td className="p-4.5 font-bold">{inv.project}</td>
                  <td className="p-4.5 font-semibold text-slate-300">{inv.issuer}</td>
                  <td className="p-4.5 font-black text-white">{inv.amount}</td>
                  <td className="p-4.5 font-mono text-slate-400">{inv.date}</td>
                  <td className="p-4.5">
                    <span className={`text-[10px] font-black font-mono px-2.5 py-1 rounded-full ${
                      inv.status === "PAID" 
                        ? "bg-emerald-500/15 text-emerald-400" 
                        : inv.status === "ESCROW LOCKED" 
                        ? "bg-indigo-500/15 text-indigo-400" 
                        : "bg-amber-500/15 text-amber-500 animate-pulse"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4.5 text-center">
                    {inv.status === "PENDING ESCROW RELEASE" ? (
                      <button 
                        id={`invoice-release-btn-${inv.id}`}
                        onClick={() => {
                          setInvoices(prev => prev.map(item => {
                            if (item.id === inv.id) {
                              return { ...item, status: "PAID", date: "Released Now" };
                            }
                            return item;
                          }));
                          alert(`Successfully released payment of ${inv.amount} to ${inv.issuer}!`);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-lg transition-transform hover:scale-102 cursor-pointer border-none font-sans"
                      >
                        Release Payment
                      </button>
                    ) : (
                      <button 
                        id={`invoice-trace-btn-${inv.id}`}
                        onClick={() => {
                          alert(`Stripe transaction verification ledger retrieved:\nRef: ${inv.stripeId}\nTransfer fully cleared via DesignBridge Escrow router.`);
                        }}
                        className="border border-slate-800 hover:bg-slate-900 text-[10px] font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer bg-transparent"
                      >
                        Trace Ledger
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
