"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  HelpCircle, 
  AlertCircle, 
  CreditCard, 
  Compass, 
  ArrowRight, 
  DollarSign, 
  CheckCircle, 
  Edit3, 
  X,
  Plus,
  Loader2,
  Calendar,
  Sparkle
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { resilientDB } from "../lib/supabase";
import { DESIGNERS } from "../lib/data";

interface CheckoutViewProps {
  selectedDesignerProp?: any;
  setActiveTab: (tab: "home" | "dashboard" | "invoicing" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
}

export default function CheckoutView({ selectedDesignerProp, setActiveTab }: CheckoutViewProps) {
  const { user, profile } = useAuth();
  
  // Navigation & configuration selections
  const [selectedDesigner, setSelectedDesigner] = useState<any>(selectedDesignerProp || DESIGNERS[1] || DESIGNERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "google">("card");
  
  // Custom interactive project specifications
  const [projectTitle, setProjectTitle] = useState("Full Brand Identity System");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState(14);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  
  // Base Interactive costs
  const [subtotal, setSubtotal] = useState(1200.00);
  const [isEditingSubtotal, setIsEditingSubtotal] = useState(false);
  
  // Fee formulations (Dynamic calculations matching mockups)
  const serviceFeeRate = 0.05; // 5%
  const platformServiceFee = parseFloat((subtotal * serviceFeeRate).toFixed(2));
  const transactionFee = 12.50; // Flat
  const totalDue = parseFloat((subtotal + platformServiceFee + transactionFee).toFixed(2));

  // Payment Form State Input Validation
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Transaction loading states simulating bank authenticators
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [successInvoiceId, setSuccessInvoiceId] = useState("");

  // Sync state for local card preferences if cardholder saves it
  const [saveCardDetails, setSaveCardDetails] = useState(true);

  // Auto detect card provider type (visual ornament)
  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\s+/g, "");
    if (cleanNum.startsWith("4")) return "Visa";
    if (cleanNum.startsWith("5")) return "Mastercard";
    return "Unknown";
  };

  // Card formatting helper for realistic spacing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    
    // Chunk in 4s
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + " / " + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (paymentMethod === "card") {
      if (!cardholderName.trim()) {
        errors.cardholderName = "Cardholder name is required";
      }
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (cleanCard.length < 16) {
        errors.cardNumber = "Valid 16-digit card number is required";
      }
      if (!expiryDate.includes("/")) {
        errors.expiryDate = "Use MM / YY format";
      } else {
        const parts = expiryDate.split("/");
        const month = parseInt(parts[0]);
        if (month < 1 || month > 12) {
          errors.expiryDate = "Invalid expiry month";
        }
      }
      if (cvv.length < 3) {
        errors.cvv = "CVV must be 3 or 4 digits";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Confirm payment & synchronize with standard Firestore `/finances/{userId}` schemas!
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    const steps = [
      "Contacting secure West-African payment gateway router...",
      "Evaluating network liquidity routes...",
      "Initiating escrow lock contract on Smart Vaults...",
      "Depositing funds to DesignBridge trust account...",
      "Contract fully secured! Notifying specialist..."
    ];

    // Simulate animated loading states
    for (let i = 0; i < steps.length; i++) {
      setProcessStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate random mock IDs
    const invoiceSlug = "INV-2026-" + Math.floor(100 + Math.random() * 900);
    const stripeSlug = "ch_3Mv" + Math.random().toString(36).substring(2, 10);
    setSuccessInvoiceId(invoiceSlug);

    try {
      // Write transaction to user's central Finances ledger in database
      if (user) {
        const cachedFinances = await resilientDB.single("finances", user.uid, "uid");
        
        let existingBalance = 12450.00;
        let existingPending = 3200.00;
        let existingTotalPaid = 84120.00;
        let existingInvoices: any[] = [];
        let existingCards: any[] = [];
        let existingTransactions: any[] = [];

        if (cachedFinances) {
          const data = cachedFinances;
          if (data.balance !== undefined) existingBalance = data.balance;
          if (data.pendingPayments !== undefined) existingPending = data.pendingPayments;
          if (data.totalPaid !== undefined) existingTotalPaid = data.totalPaid;
          if (data.invoices) existingInvoices = data.invoices;
          if (data.cards) existingCards = data.cards;
          if (data.transactions) existingTransactions = data.transactions;
        }

        // Setup the newly paid invoice with Escrow Locked status
        const newInvoiceEntry = {
          id: invoiceSlug,
          project: projectTitle,
          issuer: selectedDesigner.name,
          issuerAvatar: selectedDesigner.avatar,
          amount: parseFloat(subtotal.toFixed(2)),
          status: "Escrow Locked",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          dueDate: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1050).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          stripeId: stripeSlug,
          category: selectedDesigner.id === "abebe" ? "3D Art" : selectedDesigner.id === "kofi" ? "Packaging" : selectedDesigner.id === "fatima" ? "UI/UX" : "Illustration",
          notes: `Milestone contract auto-initiated via Credit Card with DesignBridge secure escrow platform.`,
          milestones: [
            { title: "Design Direction & High Fidelity Moodboards", budget: parseFloat((subtotal * 0.3).toFixed(2)), status: "Completed" },
            { title: "First Complete Structural Draft Presentation", budget: parseFloat((subtotal * 0.4).toFixed(2)), status: "Pending" },
            { title: "Final Brand Identity Guidelines & Asset Handover", budget: parseFloat((subtotal * 0.3).toFixed(2)), status: "Pending" }
          ]
        };

        // Standard Credit card saved layout
        const newCardEntry = {
          id: "card_" + Date.now(),
          number: `•••• •••• •••• ${cardNumber.slice(-4) || "7701"}`,
          holder: cardholderName || "Anonymous Creator",
          expiry: expiryDate || "12 / 29",
          type: getCardType(cardNumber) === "Unknown" ? "Visa" : getCardType(cardNumber),
          isPrimary: existingCards.length === 0
        };

        const newLedgerTransaction = {
          id: "TX-" + Math.floor(1000 + Math.random() * 9000),
          description: `Secured custom Escrow for "${projectTitle}" with ${selectedDesigner.name}`,
          timestamp: new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
          amount: -parseFloat(totalDue.toFixed(2)),
          type: "escrow_lock"
        };

        // Compute updated balances
        const updatedPending = existingPending + parseFloat(subtotal.toFixed(2));
        const updatedInvoices = [newInvoiceEntry, ...existingInvoices];
        const updatedCards = saveCardDetails ? [...existingCards.filter(c => c.number !== newCardEntry.number), newCardEntry] : existingCards;
        const updatedTransactions = [newLedgerTransaction, ...existingTransactions];

        await resilientDB.upsert("finances", {
          uid: user.uid,
          balance: existingBalance,
          pendingPayments: updatedPending,
          totalPaid: existingTotalPaid,
          invoices: updatedInvoices,
          cards: updatedCards,
          transactions: updatedTransactions,
          updatedAt: new Date().toISOString()
        }, "uid");
      }
    } catch (dbErr) {
      console.warn("Could not write checkout details to database: ", dbErr);
    }

    setIsProcessing(false);
    setCheckoutSuccess(true);
  };

  return (
    <div id="checkout-workspace-root" className="min-h-screen text-slate-100 flex flex-col justify-between py-2 selection:bg-[#5b4dff]/40 selection:text-white">
      
      {/* SUCCESS OVERLAY PANEL MODAL */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-[#06050f]/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#0b0a1a] border border-[#5b4dff]/35 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl shadow-[#5b4dff]/10 animate-scaleUp">
            <div className="w-20 h-20 rounded-full bg-emerald-550 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black tracking-widest text-[#8e6fff] uppercase bg-[#5b4dff]/10 border border-[#5b4dff]/20 px-3.5 py-1 rounded-full inline-block">
                Escrow Secured Successfully
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">Project Payment Lock-in Verified</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                We have locked <strong>${subtotal.toLocaleString("en-US", {minimumFractionDigits: 2})}</strong> in secure escrow. <strong>{selectedDesigner.name}</strong> can now initiate project blueprints.
              </p>
            </div>

            {/* Micro receipt details */}
            <div className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-4 text-left divide-y divide-slate-950 font-sans space-y-3">
              <div className="flex justify-between items-center pb-2 text-xs">
                <span className="text-slate-400 font-medium">Invoice Reference</span>
                <span className="font-extrabold text-white font-mono">{successInvoiceId}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-xs">
                <span className="text-slate-400 font-medium">Visual Specialist</span>
                <span className="font-extrabold text-[#8e6fff] flex items-center gap-1.5">
                  <Image src={selectedDesigner.avatar} alt="spec" width={16} height={16} className="rounded-full object-cover" />
                  {selectedDesigner.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-xs">
                <span className="text-slate-400 font-medium">Escrow Locked Fund</span>
                <span className="font-black text-white">${subtotal.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-400 font-medium">Release Rule</span>
                <span className="font-black text-emerald-400 text-[10px] uppercase font-mono tracking-wider bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded-md">Milestone Release</span>
              </div>
            </div>

            {/* Call to action blocks */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab("invoicing")}
                className="bg-[#5b4dff] hover:bg-[#7140ff] text-white text-xs font-black py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#5b4dff]/15"
              >
                View Invoicing & Escrow
              </button>
              <button 
                onClick={() => { setCheckoutSuccess(false); setActiveTab("dashboard"); }}
                className="bg-transparent hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-xs py-3.5 rounded-xl transition-all border border-slate-800"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE TWO-COLUMN MAIN WRAPPER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE PAYMENT FORM SELECTOR */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Checkout
            </h1>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Secure your project and start collaborating with top African talent.
            </p>
          </div>

          {/* CHOOSE ANOTHER SPECIALIST DROPDOWN PORTAL (PREMIUM ACCENT) */}
          <div className="bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4.5 space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Select Visual Specialist</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESIGNERS.map((designer) => (
                <button
                  key={designer.id}
                  onClick={() => setSelectedDesigner(designer)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                    selectedDesigner.id === designer.id
                      ? "border-[#5b4dff] bg-[#5b4dff]/5 text-white"
                      : "border-slate-900 bg-[#0d0c1d]/30 hover:border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-800">
                    <Image src={designer.avatar} alt={designer.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="truncate">
                    <span id={`designer-select-option-${designer.id}`} className="text-[10px] font-black block truncate">{designer.name}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-mono block tracking-tight truncate">{designer.city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Payment Method</span>
            
            <div className="bg-[#0f0e22]/50 border border-slate-900 p-1.5 rounded-2xl grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-[#5b4dff] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("apple")}
                className={`py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "apple"
                    ? "bg-black text-white border border-slate-800"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Apple Pay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("google")}
                className={`py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === "google"
                    ? "bg-white text-black font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Google Pay
              </button>
            </div>
          </div>

          {/* PAYMENT INPUT SEGMENTS */}
          {paymentMethod === "card" ? (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kofi Mensah"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff] transition-all"
                />
                {formErrors.cardholderName && (
                  <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {formErrors.cardholderName}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4 pr-12 text-xs font-mono font-black text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff] transition-all tracking-widest"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-mono font-black text-slate-500">
                    {getCardType(cardNumber) === "Visa" && (
                      <span className="text-sky-400 font-extrabold bg-[#06050f] border border-slate-800 px-2 py-1 rounded">VISA</span>
                    )}
                    {getCardType(cardNumber) === "Mastercard" && (
                      <span className="text-amber-500 font-extrabold bg-[#06050f] border border-slate-800 px-2 py-1 rounded">MC</span>
                    )}
                    {getCardType(cardNumber) === "Unknown" && (
                      <CreditCard className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
                {formErrors.cardNumber && (
                  <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {formErrors.cardNumber}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4 text-xs font-mono font-black text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff] transition-all text-center"
                  />
                  {formErrors.expiryDate && (
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {formErrors.expiryDate}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono block">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="w-full bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4 text-xs font-mono font-black text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff] transition-all text-center tracking-widest"
                  />
                  {formErrors.cvv && (
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {formErrors.cvv}</span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCardDetails"
                  checked={saveCardDetails}
                  onChange={(e) => setSaveCardDetails(e.target.checked)}
                  className="w-4 h-4 accent-[#5b4dff] border border-slate-900 bg-slate-950 rounded cursor-pointer"
                />
                <label htmlFor="saveCardDetails" className="text-[10px] text-slate-400 font-semibold select-none cursor-pointer">
                  Save card details to secure wallet portfolio for future milestone lock-ins
                </label>
              </div>
            </form>
          ) : paymentMethod === "apple" ? (
            <div className="bg-[#0b0a1a] border border-slate-900 p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white">
                <span className="font-extrabold text-lg"></span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-black text-white">Apple Pay Active</h3>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Fast, encrypted authentication via Touch ID or Face ID. Platform fees and transaction metrics apply.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePaymentSubmit}
                className="w-full max-w-sm mx-auto bg-white text-black font-extrabold py-3.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                 Pay with Apple Pay
              </button>
            </div>
          ) : (
            <div className="bg-[#0b0a1a] border border-slate-900 p-8 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 bg-[#34a853]/10 rounded-full flex items-center justify-center mx-auto text-google">
                <span className="font-mono font-black text-green-400 text-lg">G</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-black text-white">Google Pay Active</h3>
                <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Instantly load credentials mapped to your Google Account workspace securely.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePaymentSubmit}
                className="w-full max-w-sm mx-auto bg-black text-white border border-slate-800 font-black py-3.5 rounded-xl hover:bg-slate-950 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-[#4285f4] font-black">G</span>
                <span className="text-[#ea4335] font-black">o</span>
                <span className="text-[#fbbc05] font-black">o</span>
                <span className="text-[#4285f4] font-black">g</span>
                <span className="text-[#34a853] font-black">l</span>
                <span className="text-[#ea4335] font-black">e</span> Pay
              </button>
            </div>
          )}

          {/* SECURED BY ESCROW TRUST BANNER BOX */}
          <div className="bg-[#0b0a1a] border border-slate-900 p-5 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/10 border border-[#5b4dff]/20 flex items-center justify-center text-[#8e6fff] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black text-white">Secured by Escrow</h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Your funds are held safely by DesignBridge. Payment is only released to the designer once you approve each project milestone.
              </p>
            </div>
          </div>

          {/* SECURITY TRUST BADGES */}
          <div className="flex items-center gap-6 pt-2 pl-1">
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-[#5b4dff]" />
              SSL SECURE
            </span>
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase flex items-center gap-2">
              <Check className="w-4.5 h-4.5 text-[#5b4dff]" />
              PCI DSS
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: PREMIUM TRANSACTION SIDEBAR */}
        <div className="lg:col-span-5">
          
          <div className="bg-[#0b0a1a] border border-[#5b4dff]/20 rounded-3xl p-6 sm:p-7 space-y-6 relative overflow-hidden shadow-2xl shadow-[#5b4dff]/5">
            {/* Top background accent lines */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#5b4dff]" />
            
            {/* DESIGNER INFO HEADER CARD */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-800">
                  <Image src={selectedDesigner.avatar} alt="spec" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">Designer</span>
                  <h3 id="sidebar-designer-name" className="text-sm font-black text-white leading-tight">{selectedDesigner.name}</h3>
                  <span className="text-[9px] text-[#8e6fff] font-bold">{selectedDesigner.city}, {selectedDesigner.country}</span>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-xl px-2.5 py-1 flex items-center gap-1 shrink-0">
                <span className="text-[#fbbc05] text-[10px] font-mono">★</span>
                <span className="text-white text-[10px] font-black font-mono">{selectedDesigner.rating || "4.9"}</span>
              </div>
            </div>

            {/* INTERACTIVE DETAILS ADJUSTMENT AREA */}
            <div className="space-y-4">
              
              {/* Project Custom Title Row */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Project Definition</span>
                  <button 
                    onClick={() => setIsEditingTitle(!isEditingTitle)}
                    className="text-[9px] text-[#8e6fff] font-black flex items-center gap-1 hover:text-white"
                  >
                    <Edit3 className="w-3 h-3" /> {isEditingTitle ? "Save" : "Edit"}
                  </button>
                </div>
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
                    placeholder="E.g. Full Brand Identity System"
                    onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                    autoFocus
                  />
                ) : (
                  <div className="text-xs font-black text-white tracking-wide">{projectTitle}</div>
                )}
              </div>

              {/* Delivery custom days slider */}
              <div className="space-y-1.5 pt-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Estimated Delivery</span>
                  <button 
                    onClick={() => setIsEditingDelivery(!isEditingDelivery)}
                    className="text-[9px] text-[#8e6fff] font-black flex items-center gap-1 hover:text-white"
                  >
                    <Edit3 className="w-3 h-3" /> {isEditingDelivery ? "Done" : "Change"}
                  </button>
                </div>
                {isEditingDelivery ? (
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="3"
                      max="60"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(parseInt(e.target.value))}
                      className="w-full accent-[#5b4dff]"
                    />
                    <div className="text-right text-[10px] text-white font-extrabold">{deliveryDays} Days</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {deliveryDays} Days Estimated Delivery
                  </div>
                )}
              </div>

            </div>

            {/* DYNAMIC COST BREAKDOWN CARDS */}
            <div className="border-t border-slate-900 pt-5 space-y-4">
              
              {/* Project Subtotal Row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold font-sans">Project Subtotal</span>
                  <button 
                    onClick={() => setIsEditingSubtotal(!isEditingSubtotal)}
                    className="text-slate-505 text-slate-500 hover:text-white"
                    title="Change contract budget"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                {isEditingSubtotal ? (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      value={subtotal}
                      onChange={(e) => setSubtotal(Math.max(50, parseFloat(e.target.value) || 0))}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs text-white font-extrabold text-right"
                      onBlur={() => setIsEditingSubtotal(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingSubtotal(false)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span className="font-extrabold text-slate-200 text-sm font-sans">${subtotal.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
                )}
              </div>

              {/* Platform Service Fee Row */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium font-sans">Platform Service Fee (5%)</span>
                <span className="font-bold text-slate-300">${platformServiceFee.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
              </div>

              {/* Transaction Fee Row */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Transaction Fee</span>
                <span className="font-bold text-slate-300">${transactionFee.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
              </div>

              {/* Total Due Row */}
              <div className="border-t border-dashed border-slate-900 pt-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">Total Due</span>
                  <span className="text-[8px] font-bold text-slate-400 font-mono tracking-tight uppercase">USD Currency</span>
                </div>
                <div id="dynamic-checkout-total-price" className="text-3xl font-black text-white font-sans tracking-tight leading-none">
                  ${totalDue.toLocaleString("en-US", {minimumFractionDigits: 2})}
                </div>
              </div>

            </div>

            {/* CONFIRM & PAY BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePaymentSubmit}
                className="w-full bg-[#5b4dff] hover:bg-[#7140ff] text-white text-xs sm:text-sm font-black py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 select-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-wait shadow-xl shadow-[#5b4dff]/10"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay</span>
                    <ArrowRight className="w-4 h-4 text-purple-200 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Dynamic loading steps text overlay inside card */}
              {isProcessing && (
                <div className="text-center pt-2.5">
                  <span className="text-[9px] font-black text-[#8e6fff] animate-pulse font-mono block uppercase tracking-wider">{processStep}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 leading-normal font-medium text-center">
              By clicking &ldquo;Confirm &amp; Pay&rdquo;, you agree to our Terms of Service and Privacy Policy. All payments are encrypted.
            </p>

          </div>

          <div className="flex justify-between items-center pt-4 px-2">
            <span className="text-[11px] text-slate-550 hover:text-white font-bold inline-flex items-center gap-1.5 cursor-pointer text-slate-400">
              <HelpCircle className="w-4 h-4 text-slate-505" />
              Need help?
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-550 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-black tracking-wider uppercase flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5" />
              Verified African Creative
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
