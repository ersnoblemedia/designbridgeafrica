"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Bell, 
  X, 
  Layers, 
  MessageSquare, 
  Settings as SettingsIcon, 
  FileText, 
  Check, 
  ChevronRight, 
  ArrowUpRight, 
  Download, 
  Eye, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle, 
  FileDown, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  User as UserIcon,
  HelpCircle
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { resilientDB } from "../lib/supabase";
import Image from "next/image";

// Preset beautiful African avatar collection for high-fidelity clients/specialists
const AFRICAN_AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80"
];

interface Invoice {
  id: string;
  project: string;
  issuer: string; // Recipient/Creator
  issuerAvatar?: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Escrow Locked" | "Pending Release";
  date: string;
  stripeId: string;
  category: "3D Art" | "UI/UX" | "Packaging" | "Branding" | "Illustration";
  dueDate?: string;
  notes?: string;
  milestones?: { title: string; budget: number; status: "Pending" | "Completed" | "Approved" }[];
}

interface PaymentCard {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  type: "Visa" | "Mastercard";
  isPrimary: boolean;
}

interface Transaction {
  id: string;
  description: string;
  timestamp: string;
  amount: number;
  type: "payout" | "collection" | "withholding" | "escrow_lock";
}

export default function InvoicingView() {
  const { user, profile } = useAuth();
  const userRole = profile?.role || "Client";

  // Financial Summary States
  const [balance, setBalance] = useState(12450.00);
  const [pendingPayments, setPendingPayments] = useState(3200.00);
  const [totalPaid, setTotalPaid] = useState(84120.00);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Invoices list state
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: "INV-2024-041", 
      project: "Ethio-Futurism Civic Pavilion Mockups", 
      issuer: "Kigali Tech Hub", 
      issuerAvatar: AFRICAN_AVATARS[0],
      amount: 2400.00, 
      status: "Paid", 
      date: "Oct 12, 2024", 
      stripeId: "ch_3Mv8XpLkd",
      category: "3D Art",
      dueDate: "Oct 24, 2024",
      notes: "First-round 3D architectural drafts with materials selection.",
      milestones: [
        { title: "Sitemap and volumetric study", budget: 1200, status: "Approved" },
        { title: "Lighting rendering final deliverable", budget: 1200, status: "Approved" }
      ]
    },
    { 
      id: "INV-2024-042", 
      project: "Nairobi Creative Studio UI Revamp", 
      issuer: "Nairobi Creative Studio", 
      issuerAvatar: AFRICAN_AVATARS[3],
      amount: 1850.00, 
      status: "Pending", 
      date: "Oct 15, 2024", 
      stripeId: "ch_2Nv9KpYld",
      category: "UI/UX",
      dueDate: "Nov 01, 2024",
      notes: "Design high density application screens with customizable theme tokens.",
      milestones: [
        { title: "Interface mockups", budget: 1000, status: "Completed" },
        { title: "Dynamic token structure setup", budget: 850, status: "Pending" }
      ]
    },
    { 
      id: "INV-2024-040", 
      project: "Lagos Fintech Solutions Vector Assets", 
      issuer: "Lagos Fintech Solutions", 
      issuerAvatar: AFRICAN_AVATARS[2],
      amount: 4200.00, 
      status: "Overdue", 
      date: "Oct 05, 2024", 
      stripeId: "ch_9Xz2WpGst",
      category: "Branding",
      dueDate: "Oct 20, 2024",
      notes: "Custom visual identity vectors reflecting modern West African heritage.",
      milestones: [
        { title: "Traditional Yoruba vector patterns design", budget: 4200, status: "Completed" }
      ]
    },
    { 
      id: "INV-2024-039", 
      project: "Serengeti Lodge High Fidelity Brand Deck", 
      issuer: "Amara Okafor", 
      issuerAvatar: AFRICAN_AVATARS[1],
      amount: 3200.00, 
      status: "Escrow Locked", 
      date: "Oct 01, 2024", 
      stripeId: "ch_4Pt9OqMbn",
      category: "Branding",
      dueDate: "Nov 15, 2024",
      notes: "Premium pitch deck layouts and illustration kits for stakeholders.",
      milestones: [
        { title: "Outline deck content alignment", budget: 1200, status: "Approved" },
        { title: "Final graphic layout composition", budget: 2000, status: "Pending" }
      ]
    },
    { 
      id: "INV-2024-038", 
      project: "Durban Organic Honey Packaging Blueprints", 
      issuer: "Kofi Mensah", 
      issuerAvatar: AFRICAN_AVATARS[4],
      amount: 5000.00, 
      status: "Pending Release", 
      date: "Sep 28, 2024", 
      stripeId: "ch_5QY8WrKtz",
      category: "Packaging",
      dueDate: "Oct 18, 2024",
      notes: "Shelf-ready container illustrations, label layouts, and gold-foil masks.",
      milestones: [
        { title: "Logo sketch revisions", budget: 1500, status: "Approved" },
        { title: "Die-line adjustments & 3D renders", budget: 3500, status: "Completed" }
      ]
    }
  ]);

  // Payment Cards state
  const [cards, setCards] = useState<PaymentCard[]>([
    { id: "c1", number: "•••• •••• •••• 4242", holder: "Kwame Adjei", expiry: "12/26", type: "Visa", isPrimary: true },
    { id: "c2", number: "•••• •••• •••• 8812", holder: "Kwame Adjei", expiry: "04/25", type: "Mastercard", isPrimary: false }
  ]);

  // Transactions list state
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "tx1", description: "Payout to Bank Account", timestamp: "Today, 2:45 PM", amount: -1200.00, type: "payout" },
    { id: "tx2", description: "Invoice Payment: #41", timestamp: "Oct 12, 10:15 AM", amount: 2400.00, type: "collection" },
    { id: "tx3", description: "Tax Withholding", timestamp: "Oct 10, 4:00 PM", amount: -240.00, type: "withholding" },
    { id: "tx4", description: "Escrow Funded - Serengeti Deck", timestamp: "Oct 01, 11:30 AM", amount: -3200.00, type: "escrow_lock" }
  ]);

  // Selected details modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Creation / Form states
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardType, setNewCardType] = useState<"Visa" | "Mastercard">("Visa");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("Standard Bank of Kenya");
  const [withdrawAccount, setWithdrawAccount] = useState("");

  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [newInvProject, setNewInvProject] = useState("");
  const [newInvIssuer, setNewInvIssuer] = useState("");
  const [newInvAmount, setNewInvAmount] = useState("");
  const [newInvCategory, setNewInvCategory] = useState<any>("UI/UX");
  const [newInvNotes, setNewInvNotes] = useState("");

  const [notification, setNotification] = useState<{message: string; type: "success" | "info" | "error"} | null>(null);

  // Sync to database
  useEffect(() => {
    if (!user) return;
    const fetchFinances = async () => {
      try {
        const cachedFinances = await resilientDB.single("finances", user.uid, "uid");
        if (cachedFinances) {
          const data = cachedFinances;
          if (data.balance !== undefined) setBalance(data.balance);
          if (data.pendingPayments !== undefined) setPendingPayments(data.pendingPayments);
          if (data.totalPaid !== undefined) setTotalPaid(data.totalPaid);
          if (data.invoices) setInvoices(data.invoices);
          if (data.cards) setCards(data.cards);
          if (data.transactions) setTransactions(data.transactions);
        } else {
          // Initialize for first time in database
          await resilientDB.upsert("finances", {
            uid: user.uid,
            balance,
            pendingPayments,
            totalPaid,
            invoices,
            cards,
            transactions,
            updatedAt: new Date().toISOString()
          }, "uid");
        }
      } catch (err) {
        console.error("Could not sync with database finances: ", err);
      }
    };
    fetchFinances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Helper trigger to save state back to DB alias saveToFirestore
  const saveToFirestore = async (
    updatedBalance: number,
    updatedPending: number,
    updatedTotal: number,
    updatedInvoicesList: Invoice[],
    updatedCardsList: PaymentCard[],
    updatedTransactionsList: Transaction[]
  ) => {
    if (!user) return;
    try {
      await resilientDB.upsert("finances", {
        uid: user.uid,
        balance: updatedBalance,
        pendingPayments: updatedPending,
        totalPaid: updatedTotal,
        invoices: updatedInvoicesList,
        cards: updatedCardsList,
        transactions: updatedTransactionsList,
        updatedAt: new Date().toISOString()
      }, "uid");
    } catch (err) {
      console.warn("Could not save to db: ", err);
    }
  };

  const showNotification = (message: string, type: "success" | "info" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // 1. Add Card Execution
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || !newCardHolder.trim() || !newCardExpiry.trim()) {
      showNotification("Please fill in all card details.", "error");
      return;
    }
    const cleanNum = newCardNumber.replace(/\s?/g, "");
    const ending = cleanNum.slice(-4) || "0000";
    const newCard: PaymentCard = {
      id: `c_${Date.now()}`,
      number: `•••• •••• •••• ${ending}`,
      holder: newCardHolder,
      expiry: newCardExpiry,
      type: newCardType,
      isPrimary: cards.length === 0
    };
    const updated = [...cards, newCard];
    setCards(updated);
    saveToFirestore(balance, pendingPayments, totalPaid, invoices, updated, transactions);
    setShowAddCardModal(false);
    setNewCardNumber("");
    setNewCardHolder("");
    setNewCardExpiry("");
    showNotification(`Successfully added Visa ending in ${ending}!`);
  };

  // 2. Withdraw Funds Execution
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification("Please enter a valid amount.", "error");
      return;
    }
    if (amountNum > balance) {
      showNotification("Insufficient funds available.", "error");
      return;
    }
    const updatedBalance = balance - amountNum;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      description: `Withdrawal to ${withdrawBank}`,
      timestamp: "Today, Just now",
      amount: -amountNum,
      type: "payout"
    };
    const updatedTxList = [newTx, ...transactions];
    setBalance(updatedBalance);
    setTransactions(updatedTxList);
    saveToFirestore(updatedBalance, pendingPayments, totalPaid, invoices, cards, updatedTxList);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setWithdrawAccount("");
    showNotification(`Initiated payout request of $${amountNum.toLocaleString()}! Funds normally clear in 2 hours.`);
  };

  // 3. Create Custom Invoice Execution
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newInvAmount);
    if (!newInvProject.trim() || !newInvIssuer.trim() || isNaN(amountNum) || amountNum <= 0) {
      showNotification("Please enter valid invoice criteria.", "error");
      return;
    }
    const formattedId = `INV-2026-0${Math.floor(100 + Math.random() * 900)}`;
    const freshInvoice: Invoice = {
      id: formattedId,
      project: newInvProject,
      issuer: newInvIssuer,
      issuerAvatar: AFRICAN_AVATARS[Math.floor(Math.random() * AFRICAN_AVATARS.length)],
      amount: amountNum,
      status: userRole === "Client" ? "Pending" : "Pending", // Starts as pending payment
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      stripeId: `ch_${Math.random().toString(36).substring(2, 11)}`,
      category: newInvCategory,
      notes: newInvNotes || "Direct escrow milestone contract created via DesignBridge Africa.",
      milestones: [
        { title: "Milestone Deliverable alignment", budget: amountNum, status: "Pending" }
      ]
    };
    const updatedInvoices = [freshInvoice, ...invoices];
    setInvoices(updatedInvoices);
    
    // If designer creates it, update pending payments expectation
    let updatedPending = pendingPayments;
    if (userRole === "Designer") {
      updatedPending += amountNum;
      setPendingPayments(updatedPending);
    }

    saveToFirestore(balance, updatedPending, totalPaid, updatedInvoices, cards, transactions);
    setShowCreateInvoiceModal(false);
    setNewInvProject("");
    setNewInvIssuer("");
    setNewInvAmount("");
    setNewInvNotes("");
    showNotification(`Invoice ${formattedId} successfully uploaded & recorded.`);
  };

  // 4. Pay / Fund Escrow
  const handleFundEscrow = (invoiceId: string) => {
    const target = invoices.find(inv => inv.id === invoiceId);
    if (!target) return;
    
    const updated = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: "Escrow Locked" as const };
      }
      return inv;
    });

    // Create fee transaction in the activity log
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      description: `Escrow Funded - ${target.project.substring(0, 20)}...`,
      timestamp: "Today, Just now",
      amount: -target.amount,
      type: "escrow_lock"
    };

    const updatedTxList = [newTx, ...transactions];
    const updatedPending = pendingPayments + target.amount;

    setInvoices(updated);
    setTransactions(updatedTxList);
    setPendingPayments(updatedPending);

    // If modal is active, update selected object
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: "Escrow Locked" });
    }

    saveToFirestore(balance, updatedPending, totalPaid, updated, cards, updatedTxList);
    showNotification(`Payment of $${target.amount.toLocaleString()} locked securely in project escrow escrow router!`);
  };

  // 5. Release Escrow Cash out
  const handleReleaseEscrow = (invoiceId: string) => {
    const target = invoices.find(inv => inv.id === invoiceId);
    if (!target) return;

    const updated = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: "Paid" as const, date: "Released Now" };
      }
      return inv;
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      description: `Invoice Payment: #${target.id.replace("INV-2024-", "")}`,
      timestamp: "Today, Just now",
      amount: target.amount,
      type: "collection"
    };

    const updatedTxList = [newTx, ...transactions];
    const updatedBalance = balance + target.amount;
    const updatedPending = Math.max(0, pendingPayments - target.amount);
    const updatedTotalPaid = totalPaid + target.amount;

    setInvoices(updated);
    setTransactions(updatedTxList);
    setBalance(updatedBalance);
    setPendingPayments(updatedPending);
    setTotalPaid(updatedTotalPaid);

    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: "Paid", date: "Released Now" });
    }

    saveToFirestore(updatedBalance, updatedPending, updatedTotalPaid, updated, cards, updatedTxList);
    showNotification(`Escrow funds of $${target.amount.toLocaleString()} released fully to ${target.issuer}!`);
  };

  // Remove Card Handler
  const handleRemoveCard = (cardId: string) => {
    const targetCard = cards.find(c => c.id === cardId);
    if (targetCard?.isPrimary && cards.length > 1) {
      // Find another and make it primary
      const updated = cards.filter(c => c.id !== cardId).map((c, idx) => ({
        ...c,
        isPrimary: idx === 0
      }));
      setCards(updated);
      saveToFirestore(balance, pendingPayments, totalPaid, invoices, updated, transactions);
    } else {
      const updated = cards.filter(c => c.id !== cardId);
      setCards(updated);
      saveToFirestore(balance, pendingPayments, totalPaid, invoices, updated, transactions);
    }
    showNotification("Billing card removed from securely registered profiles.");
  };

  // Trigger Local Download csv of Ledger
  const handleDownloadCSV = () => {
    const headers = "ID,Description,Timestamp,Amount,Type\n";
    const dataRows = transactions.map(t => 
      `"${t.id}","${t.description}","${t.timestamp}",${t.amount},"${t.type}"`
    ).join("\n");
    const fileContent = headers + dataRows;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `designbridge-ledger-activity-${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification("Ledger CSV download initiated.");
  };

  // Filter invoice targets
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== "All Status") {
      matchesStatus = inv.status.toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="finances-root-container" className="space-y-10 min-h-screen text-slate-300">
      
      {/* Toast notifications portal */}
      {notification && (
        <div 
          id="toast-notification-banner"
          className={`fixed top-24 right-8 z-[100] flex items-center gap-3 p-4 rounded-xl shadow-2xl transition-all font-sans border text-xs font-semibold ${
            notification.type === "error" 
              ? "bg-red-950/90 text-red-300 border-red-500/30" 
              : "bg-[#141235]/95 text-white border-[#5b4dff]/40"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-[#8e6fff] shrink-0 animate-ping" />
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white shrink-0 ml-3">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER BLOCK SUMMARY */}
      <div id="finances-header-row" className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-7">
        <div className="space-y-1.5">
          <h1 id="finances-title" className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-sans">
            Finances
            <span className="text-[10px] bg-[#5b4dff]/15 text-[#8e6fff] font-mono tracking-widest uppercase font-black px-2.5 py-1 rounded-full border border-[#5b4dff]/20">
              SECURE ESCROW HUB
            </span>
          </h1>
          <p id="finances-tagline" className="text-xs text-slate-400 font-semibold max-w-xl">
            Manage your payouts, invoices, and payment methods protected by automated multi-signature project contracts.
          </p>
        </div>

        {/* Global Toolbar and Withdraw buttons */}
        <div id="finances-action-toolbar" className="flex items-center gap-3 shrink-0">
          <button 
            id="withdraw-funds-trigger-btn"
            onClick={() => setShowWithdrawModal(true)}
            className="bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black px-5 py-3 rounded-full shadow-lg shadow-[#5b4dff]/20 hover:scale-[1.01] transition-all flex items-center gap-1.5 cursor-pointer border-none font-sans"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </button>

          <button 
            id="manage-cards-shortcut-btn"
            onClick={() => {
              const el = document.getElementById("payment-methods-card-container");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              showNotification("Navigated to Credit Card profiles.", "info");
            }}
            className="border border-slate-800 bg-[#0f0e22] hover:bg-[#161432] text-slate-400 hover:text-white text-xs font-bold px-5 py-3 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Manage Cards</span>
          </button>

          <button
            id="upload-invoice-btn"
            onClick={() => setShowCreateInvoiceModal(true)}
            className="border border-[#5b4dff]/20 bg-[#151433]/70 hover:bg-[#151433]/90 text-white text-xs font-bold px-5 py-3 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Plus className="w-4 h-4 text-[#8e6fff]" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* THREE NUMERI TELEMETRY CARDS PANEL */}
      <div id="finances-telemetry-metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric Card 1 */}
        <div id="metric-card-balance" className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-md flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-mono">Current Balance</span>
            <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight font-sans">${balance.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-md font-mono flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+12%</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">Available for withdrawal</p>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div id="metric-card-pending" className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-md flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-mono">Pending Payments</span>
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight font-sans">${pendingPayments.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-md font-mono flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>+5%</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">Expected by Oct 24th</p>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div id="metric-card-totalpaid" className="bg-[#0f0e22] border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-md flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 font-mono">Total Paid (YTD)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight font-sans">${totalPaid.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-[9px] font-black text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded-md font-mono flex items-center gap-0.5">
                <TrendingDown className="w-2.5 h-2.5" />
                <span>-2%</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">Total lifetime earnings</p>
          </div>
        </div>
      </div>

      {/* CORE INVOICE TABLE MANAGEMENT BLOCK */}
      <div id="finances-invoices-master-card" className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6.5 shadow-xl space-y-6">
        
        {/* Table Toolbar controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div className="space-y-1">
            <h2 id="invoices-section-title" className="text-lg font-black text-white tracking-tight">Invoices</h2>
            <p className="text-[11px] text-slate-500 font-semibold font-mono uppercase tracking-wider">Automated billing tracker & dispute records</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search filter within invoices */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="search-invoices-list-input"
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-900 focus:border-[#5b4dff] rounded-xl text-xs py-2 pl-9 pr-4 text-slate-300 placeholder-slate-600 transition-all font-semibold outline-none focus:ring-0 max-w-[200px]"
              />
            </div>

            {/* Date filter dropdown selector placeholder */}
            <select
              id="invoice-date-range-filter-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                showNotification(`Grouped by ${e.target.value}`, "info");
              }}
              className="bg-[#12112e] border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs py-2 px-3 outline-none font-bold cursor-pointer font-sans"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="All Time">All Time</option>
            </select>

            {/* Status filtering dropdown */}
            <select
              id="invoice-status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#12112e] border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs py-2 px-3 outline-none font-bold cursor-pointer font-sans"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Escrow Locked">Escrow Locked</option>
              <option value="Pending Release">Pending Release</option>
            </select>
          </div>
        </div>

        {/* Ledger table wrapper */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/40 uppercase font-mono text-slate-500 font-extrabold tracking-widest border-b border-prefix border-slate-900/60 pb-3">
                <th id="th-inv-id" className="p-4.5">Invoice ID</th>
                <th id="th-inv-date" className="p-4.5">Date</th>
                <th id="th-inv-client" className="p-4.5">Client & Recipient</th>
                <th id="th-inv-amount" className="p-4.5">Amount</th>
                <th id="th-inv-status" className="p-4.5">Status</th>
                <th id="th-inv-actions" className="p-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="invoices-ledger-body" className="divide-y divide-slate-900/40">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 font-semibold italic">
                    No invoices matching filtered parameters find records.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-950/20 transition-colors group">
                    <td className="p-4.5 font-mono font-black text-white shrink-0">{inv.id}</td>
                    <td className="p-4.5 font-semibold text-slate-400 font-mono">{inv.date}</td>
                    <td className="p-4.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0 w-7 h-7 rounded-lg overflow-hidden bg-slate-900">
                          <Image 
                            src={inv.issuerAvatar || "https://api.dicebear.com/7.x/pixel-art/svg?seed=avatar"} 
                            alt={inv.issuer} 
                            fill
                            className="object-cover border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-200 block">{inv.issuer}</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider font-mono text-slate-500">{inv.project.substring(0, 32)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5 font-black text-white">${inv.amount.toLocaleString("en-US", {minimumFractionDigits: 2})}</td>
                    <td className="p-4.5">
                      <div className="space-y-1.5 flex flex-col items-center justify-center">
                        <span className={`text-[10px] uppercase font-mono font-extrabold px-3 py-1.5 rounded-full border inline-block text-center ${
                          inv.status === "Paid" 
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" 
                            : inv.status === "Pending" 
                            ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/20" 
                            : inv.status === "Overdue" 
                            ? "bg-red-500/15 text-red-500 border-red-500/20 animate-pulse" 
                            : inv.status === "Escrow Locked" 
                            ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" 
                            : "bg-blue-500/15 text-blue-400 border-blue-500/20 animate-pulse"
                        }`}>
                          {inv.status}
                        </span>
                        {/* Interactive Milestone Micro Tracker */}
                        <div className="flex items-center gap-1 w-full max-w-[80px] mt-1" title="Escrow Funds Track">
                          <div className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                            inv.status === "Paid" ? "bg-emerald-500" : (inv.status === "Escrow Locked" || inv.status === "Pending Release") ? "bg-[#5b4dff]" : "bg-yellow-550 bg-yellow-500"
                          }`} />
                          <div className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                            inv.status === "Paid" ? "bg-emerald-500" : (inv.status === "Escrow Locked" || inv.status === "Pending Release") ? "bg-[#8e6fff] animate-pulse" : "bg-slate-800"
                          }`} />
                          <div className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                            inv.status === "Paid" ? "bg-emerald-500" : "bg-slate-800"
                          }`} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        {/* Escrow contextual helpers (Primary clients trigger releases, Designers request them) */}
                        {inv.status === "Pending" && userRole === "Client" && (
                          <button
                            id={`btn-fund-escrow-${inv.id}`}
                            onClick={() => handleFundEscrow(inv.id)}
                            className="bg-[#5b4dff]/20 text-[#8e6fff] hover:bg-[#5b4dff] hover:text-white border border-[#5b4dff]/30 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                            title="Lock funds in escrow"
                          >
                            Fund Escrow
                          </button>
                        )}
                        
                        {inv.status === "Pending Release" && userRole === "Client" && (
                          <button
                            id={`btn-release-escrow-${inv.id}`}
                            onClick={() => handleReleaseEscrow(inv.id)}
                            className="bg-emerald-500 text-slate-950 hover:bg-emerald-600 border-none text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
                            title="Release escrow wallet balance to specialist"
                          >
                            Release Funds
                          </button>
                        )}

                        <button 
                          id={`btn-dl-invoice-${inv.id}`}
                          onClick={() => {
                            showNotification(`Download simulated invoice PDF for ${inv.id}`);
                          }}
                          className="hover:text-white p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-transparent hover:border-slate-800 transition-all cursor-pointer flex"
                          title="Download Activity report"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          id={`btn-view-invoice-details-${inv.id}`}
                          onClick={() => setSelectedInvoice(inv)}
                          className="hover:text-white p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-transparent hover:border-slate-800 transition-all cursor-pointer flex"
                          title="View Escrow Details Ledger"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Invoices expansion toggle */}
        <div id="view-all-invoices-row" className="flex justify-center border-t border-slate-900 pt-4.5">
          <button 
            id="view-all-invoices-action-btn"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All Status");
              showNotification("Loaded all invoice transactions records", "info");
            }}
            className="text-xs font-bold text-[#8e6fff] hover:text-[#a38cff] transition-all bg-transparent border-none cursor-pointer p-1"
          >
            Retrieve All Active Invoices
          </button>
        </div>
      </div>

      {/* BOTTOM TWO COLUMNS PANEL: PAYMENT METHODS & RECENT TRANSACTIONS */}
      <div id="finances-bottom-split-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Payment Methods card column */}
        <div id="payment-methods-card-container" className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="space-y-1">
              <h3 className="text-sm uppercase font-black text-[#5b4dff] tracking-widest block font-mono">Payment Methods</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Saved credit cards for instant payment</p>
            </div>
            <button 
              id="add-new-card-button"
              onClick={() => setShowAddCardModal(true)}
              className="text-[#8e6fff] hover:text-[#a38cff] font-bold text-xs flex items-center gap-1 bg-transparent border-none cursor-pointer py-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>

          <div id="payment-cards-list-box" className="space-y-3">
            {cards.map((card) => (
              <div 
                key={card.id} 
                id={`card-widget-${card.id}`}
                className={`flex items-center justify-between p-4 bg-slate-950/40 border rounded-2xl transition-all ${
                  card.isPrimary 
                    ? "border-[#5b4dff]/40 shadow-lg shadow-[#5b4dff]/5" 
                    : "border-slate-800/80 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 bg-[#12112e] rounded-lg border border-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black uppercase text-slate-400 font-mono">{card.type}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{card.type} ending in {card.number.slice(-4)}</span>
                      {card.isPrimary && (
                        <span className="text-[8px] font-black font-mono uppercase bg-[#5b4dff]/15 text-[#8e6fff] px-2 py-0.5 rounded-full border border-[#5b4dff]/20">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">Expires {card.expiry} • {card.holder}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!card.isPrimary && (
                    <button
                      id={`btn-set-card-primary-${card.id}`}
                      onClick={() => {
                        setCards(cards.map(c => ({ ...c, isPrimary: c.id === card.id })));
                        showNotification(`Primary payment method updated.`, "info");
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                    >
                      Make Primary
                    </button>
                  )}
                  <button 
                    id={`btn-remove-card-${card.id}`}
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-400 bg-transparent hover:bg-red-500/10 hover:text-red-300 p-2 rounded-xl transition-all cursor-pointer border-none"
                    title="Remove Payment Card"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions list column */}
        <div id="recent-transactions-card-container" className="bg-[#0f0e22] border border-slate-900 rounded-3xl p-6 shadow-md space-y-5">
          <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm uppercase font-black text-[#5b4dff] tracking-widest block font-mono">Recent Transactions</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Ledger entries, payouts, and taxes withheld</p>
            </div>
            <HelpCircle className="w-4 h-4 text-slate-600" />
          </div>

          <div id="transactions-payouts-stack" className="space-y-3.5">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                id={`tx-element-${tx.id}`}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-950/20 transition-all border border-transparent hover:border-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border ${
                    tx.type === "payout" 
                      ? "bg-red-500/10 border-red-500/20 text-red-400" 
                      : tx.type === "collection" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : tx.type === "escrow_lock"
                      ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-450"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}>
                    {tx.type === "payout" ? (
                      <ArrowUpRight className="w-4.5 h-4.5 transform rotate-45" />
                    ) : tx.type === "collection" ? (
                      <Check className="w-4.5 h-4.5" />
                    ) : tx.type === "escrow_lock" ? (
                      <ShieldCheck className="w-4.5 h-4.5" />
                    ) : (
                      <FileText className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{tx.description}</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block leading-none font-mono">{tx.timestamp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black font-mono block ${
                    tx.amount < 0 ? "text-slate-400" : "text-emerald-400"
                  }`}>
                    {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toLocaleString("en-US", {minimumFractionDigits: 2})}
                  </span>
                  <span className="text-[8px] text-slate-600 font-mono block mt-0.5 uppercase tracking-widest">{tx.type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-900 pt-4 flex justify-center">
            <button 
              id="download-ledger-activity-btn"
              onClick={handleDownloadCSV}
              className="border border-slate-800/80 hover:bg-slate-950/60 text-slate-450 hover:text-white text-xs font-bold w-full py-3 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-transparent"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Activity (CSV)</span>
            </button>
          </div>
        </div>

      </div>

      {/* 1. MANAGE WITHDRAW FUNDS MODAL */}
      {showWithdrawModal && (
        <div id="withdraw-funds-modal-portal" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#100f24] border border-slate-800 rounded-3xl p-6.5 relative shadow-2xl animate-scaleUp">
            <button 
              id="btn-close-withdraw-modal"
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full cursor-pointer bg-transparent border-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/15 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-[#8e6fff]" />
                </div>
                <div>
                  <h3 className="text-md font-black text-white">Withdraw Funds</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Transfer your available balance to a regional bank account.</p>
                </div>
              </div>

              <div className="bg-[#151433]/40 border border-[#5b4dff]/15 rounded-xl p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Available for Payout</span>
                <span className="text-md font-black text-white">${balance.toLocaleString("en-US", {minimumFractionDigits: 2})}</span>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Amount (USD)</label>
                  <input 
                    id="input-withdraw-amount"
                    type="number"
                    required
                    min="1"
                    max={balance}
                    step="0.01"
                    placeholder="Enter amount to withdraw..."
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white placeholder-slate-600 outline-none outline-0 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Recipient Bank</label>
                  <select 
                    id="select-withdraw-bank"
                    value={withdrawBank} 
                    onChange={(e) => setWithdrawBank(e.target.value)} 
                    className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white outline-none font-bold"
                  >
                    <option value="Standard Bank of Kenya">Standard Bank of Kenya</option>
                    <option value="Guaranty Trust Bank (Nigeria)">Guaranty Trust Bank (Nigeria)</option>
                    <option value="EcoBank Africa (Kigali)">EcoBank Africa (Kigali)</option>
                    <option value="ABSA South Africa">ABSA South Africa</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Account Number / IBAN</label>
                  <input 
                    id="input-withdraw-account-number"
                    type="text"
                    required
                    placeholder="E.g. KE93 SBEN 2004 0294 01.."
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white placeholder-slate-600 outline-none font-semibold font-mono"
                  />
                </div>

                <button 
                  id="btn-submit-withdraw-action"
                  type="submit"
                  className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-4.5 rounded-xl transition-all cursor-pointer shadow-lg mt-2 border-none"
                >
                  Confirm Payout Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHOOSE/ADD CARD DETAILS IN MODAL */}
      {showAddCardModal && (
        <div id="add-card-modal-portal" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#100f24] border border-slate-800 rounded-3xl p-6 relative shadow-2xl animate-scaleUp">
            <button 
              id="btn-close-card-modal"
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full cursor-pointer bg-transparent border-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <form onSubmit={handleAddCard} className="space-y-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/15 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#8e6fff]" />
                </div>
                <div>
                  <h3 className="text-md font-black text-white">Add Card Account</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Fund escrow tasks and save billing credentials securely.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Cardholder Name</label>
                  <input 
                    id="input-card-holder-name"
                    type="text"
                    required
                    placeholder="E.g. Kwame Adjei"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white placeholder-slate-600 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Card Number</label>
                  <input 
                    id="input-card-number"
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={newCardNumber}
                    onChange={(e) => {
                      // auto space mapping
                      const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setNewCardNumber(val);
                    }}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white placeholder-slate-600 outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Expiry MM/YY</label>
                    <input 
                      id="input-card-expiry-date"
                      type="text"
                      required
                      maxLength={5}
                      placeholder="E.g. 12/26"
                      value={newCardExpiry}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length === 2 && !val.includes("/")) {
                          val = val + "/";
                        }
                        setNewCardExpiry(val);
                      }}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white placeholder-slate-600 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Network Brand</label>
                    <select 
                      id="select-card-brand-network"
                      value={newCardType} 
                      onChange={(e) => setNewCardType(e.target.value as any)} 
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-3 px-4 text-white outline-none font-bold"
                    >
                      <option value="Visa">Visa Premium</option>
                      <option value="Mastercard">Mastercard Gold</option>
                    </select>
                  </div>
                </div>

                <button 
                  id="btn-save-new-payment-card"
                  type="submit"
                  className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-4.5 rounded-xl transition-all cursor-pointer shadow-lg mt-2 border-none"
                >
                  Add Card Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CREATE INVOICE FORM MODAL */}
      {showCreateInvoiceModal && (
        <div id="create-invoice-modal-portal" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#100f24] border border-slate-800 rounded-3xl p-6.5 relative shadow-2xl animate-scaleUp">
            <button 
              id="btn-close-create-invoice-modal"
              onClick={() => setShowCreateInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full cursor-pointer bg-transparent border-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/15 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#8e6fff]" />
                </div>
                <div>
                  <h3 className="text-md font-black text-white">Create Invoice & Escrow Contract</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Submit a billing and escrow request to specify deliverable milestones.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Project Scope Title</label>
                  <input 
                    id="input-new-invoice-project-title"
                    type="text"
                    required
                    placeholder="E.g. Traditional Motif Booklets Design"
                    value={newInvProject}
                    onChange={(e) => setNewInvProject(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 px-4 text-white placeholder-slate-600 outline-none font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono">Recipient Client / Issuer</label>
                  <input 
                    id="input-new-invoice-recipient-issuer"
                    type="text"
                    required
                    placeholder="E.g. Kigali Tech Hub"
                    value={newInvIssuer}
                    onChange={(e) => setNewInvIssuer(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 px-4 text-white placeholder-slate-600 outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono font-sans">Total Amount (USD)</label>
                    <input 
                      id="input-new-invoice-amount-usd"
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      placeholder="E.g. 1850"
                      value={newInvAmount}
                      onChange={(e) => setNewInvAmount(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 px-4 text-white placeholder-slate-600 outline-none font-bold font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono font-sans">Deliverable Category</label>
                    <select 
                      id="select-new-invoice-deliverable-category"
                      value={newInvCategory} 
                      onChange={(e) => setNewInvCategory(e.target.value as any)} 
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 px-4 text-white outline-none font-bold font-sans"
                    >
                      <option value="UI/UX font-sans">UI/UX Systems</option>
                      <option value="3D Art">3D Modeling</option>
                      <option value="Packaging">Commercial Packaging</option>
                      <option value="Branding">Brand Strategy</option>
                      <option value="Illustration">Illustrations & Vectors</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block font-mono font-sans block">Specifications & Notes</label>
                  <textarea 
                    id="textarea-new-invoice-specifications-notes"
                    rows={3}
                    placeholder="Enter project specifications, code handoffs, or delivery guidelines..."
                    value={newInvNotes}
                    onChange={(e) => setNewInvNotes(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-[#5b4dff] rounded-xl text-xs py-2.5 px-4 text-white placeholder-slate-600 outline-none font-semibold font-sans resize-none"
                  />
                </div>

                <button 
                  id="btn-register-billing-invoice"
                  type="submit"
                  className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-4 rounded-xl transition-all cursor-pointer shadow-lg mt-2 border-none font-sans"
                >
                  Register Billing Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. DETAILS LEDGER & ESCROW FLOW INSPECTION DIALOG */}
      {selectedInvoice && (
        <div id="invoice-details-inspector-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#100f24] border border-slate-800 rounded-3xl p-6.5 relative shadow-2xl animate-scaleUp text-left">
            <button 
              id="btn-close-invoice-inspector"
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full cursor-pointer bg-transparent border-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="space-y-6">
              
              {/* Top summary brand ledger block */}
              <div className="flex items-start justify-between border-b border-slate-900 pb-4">
                <div className="space-y-1">
                  <span id="label-inspector-invoice-id" className="text-sm font-black font-mono text-[#8e6fff]">{selectedInvoice.id}</span>
                  <h3 id="label-inspector-project-title" className="text-md font-black text-white leading-tight mt-0.5">{selectedInvoice.project}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono mt-1">
                    <span>DATE CREATED: {selectedInvoice.date}</span>
                    <span>•</span>
                    <span>STRIPE: {selectedInvoice.stripeId}</span>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-mono font-black tracking-widest px-3 py-1.5 rounded-full border shrink-0 ${
                  selectedInvoice.status === "Paid" 
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" 
                    : selectedInvoice.status === "Pending" 
                    ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/20 animate-pulse" 
                    : selectedInvoice.status === "Overdue" 
                    ? "bg-red-500/15 text-red-500 border-red-500/20" 
                    : selectedInvoice.status === "Escrow Locked" 
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" 
                    : "bg-blue-500/15 text-blue-400 border-blue-500/20"
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>

              {/* Escrow Milestone Progress Tracker Section */}
              <div id="escrow-funds-milestone-tracker-card" className="bg-[#0b0a1a] border border-slate-900 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">Escrow Milestone Status</span>
                  {selectedInvoice.status === "Paid" ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Escrow Released
                    </span>
                  ) : (selectedInvoice.status === "Escrow Locked" || selectedInvoice.status === "Pending Release") ? (
                    <span className="text-[10px] text-[#8e6fff] font-bold flex items-center gap-1 animate-pulse">
                      <ShieldCheck className="w-3.5 h-3.5" /> Locked in Escrow
                    </span>
                  ) : (
                    <span className="text-[10px] text-yellow-500 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Funding Requested
                    </span>
                  )}
                </div>

                <div className="relative flex items-center justify-between py-2 px-1">
                  {/* Progress Line Tracks */}
                  <div className="absolute top-[21px] left-[12%] right-[12%] h-[2px] bg-slate-900 z-0" />
                  <div 
                    className="absolute top-[21px] left-[12%] h-[2px] bg-gradient-to-r from-yellow-500 via-[#5b4dff] to-emerald-500 transition-all duration-500 z-1" 
                    style={{ 
                      width: selectedInvoice.status === "Paid" 
                        ? "76%" 
                        : (selectedInvoice.status === "Escrow Locked" || selectedInvoice.status === "Pending Release")
                        ? "38%" 
                        : "0%" 
                    }} 
                  />

                  {/* Node 1: Pending */}
                  <div className="flex flex-col items-center z-10 w-1/3">
                    <div className={`w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedInvoice.status === "Paid"
                        ? "bg-slate-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10"
                        : (selectedInvoice.status === "Escrow Locked" || selectedInvoice.status === "Pending Release")
                        ? "bg-slate-950 border-[#5b4dff] text-[#8e6fff] shadow-md shadow-[#5b4dff]/10"
                        : "bg-slate-950 border-yellow-550 border-yellow-500 text-yellow-500 animate-pulse shadow-md shadow-yellow-500/10"
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-white mt-1.5 leading-none">Pending</span>
                    <span className="text-[8px] text-slate-500 font-bold font-mono mt-0.5 uppercase tracking-wide">Invoice Raised</span>
                  </div>

                  {/* Node 2: In Progress */}
                  <div className="flex flex-col items-center z-10 w-1/3">
                    <div className={`w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedInvoice.status === "Paid"
                        ? "bg-slate-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10"
                        : (selectedInvoice.status === "Escrow Locked" || selectedInvoice.status === "Pending Release")
                        ? "bg-slate-950 border-[#8e6fff] text-[#8e6fff] animate-pulse shadow-md shadow-indigo-500/10"
                        : "bg-slate-950 border-slate-800 text-slate-600"
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-black mt-1.5 leading-none ${
                      (selectedInvoice.status !== "Pending" && selectedInvoice.status !== "Overdue") ? "text-white" : "text-slate-500"
                    }`}>In Progress</span>
                    <span className="text-[8px] text-slate-500 font-bold font-mono mt-0.5 uppercase tracking-wide">Secured Escrow</span>
                  </div>

                  {/* Node 3: Released */}
                  <div className="flex flex-col items-center z-10 w-1/3">
                    <div className={`w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedInvoice.status === "Paid"
                        ? "bg-slate-950 border-emerald-505 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10 animate-bounce"
                        : "bg-slate-950 border-slate-800 text-slate-600"
                    }`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-black mt-1.5 leading-none ${
                      selectedInvoice.status === "Paid" ? "text-white" : "text-slate-500"
                    }`}>Released</span>
                    <span className="text-[8px] text-slate-500 font-bold font-mono mt-0.5 uppercase tracking-wide">Paid to Specialist</span>
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-slate-405 leading-normal text-slate-400 bg-slate-950/40 border border-slate-900 rounded-xl p-3 text-center">
                  {selectedInvoice.status === "Paid" && (
                    <span className="text-emerald-400">
                      Payment released: The escrow funds of <strong>${selectedInvoice.amount.toLocaleString("en-US", {minimumFractionDigits: 2})}</strong> have been fully disbursed and credited to the specialist&apos;s available balance.
                    </span>
                  )}
                  {(selectedInvoice.status === "Escrow Locked" || selectedInvoice.status === "Pending Release") && (
                    <span className="text-[#a38cff]">
                      Escrow activated: <strong>${selectedInvoice.amount.toLocaleString("en-US", {minimumFractionDigits: 2})}</strong> is safely secured inside DesignBridge African gateway router. Funds are currently locked.
                    </span>
                  )}
                  {(selectedInvoice.status === "Pending" || selectedInvoice.status === "Overdue") && (
                    <span className="text-yellow-500">
                      Escrow pending: Client must lock <strong>${selectedInvoice.amount.toLocaleString("en-US", {minimumFractionDigits: 2})}</strong> in escrow to initiate project contracts.
                    </span>
                  )}
                </div>
              </div>

              {/* Specs & description */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block font-mono">Job brief / Notes</span>
                <p id="label-inspector-invoice-notes" className="text-[11px] text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/40">
                  {selectedInvoice.notes}
                </p>
              </div>

              {/* Sub-Milestones schedule info */}
              <div className="space-y-2.5">
                <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block font-mono">Milestone disbursements</span>
                <div id="inspector-milestones-row-box" className="space-y-2">
                  {selectedInvoice.milestones?.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                        m.status === "Approved" 
                          ? "bg-emerald-500/5 border border-emerald-500/15" 
                          : m.status === "Completed"
                          ? "bg-blue-500/5 border border-blue-500/15"
                          : "bg-slate-950/30 border border-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          m.status === "Approved" 
                            ? "bg-emerald-400" 
                            : m.status === "Completed"
                            ? "bg-blue-400"
                            : "bg-yellow-500"
                        }`} />
                        <span className="text-slate-305">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-black font-mono">${m.budget.toLocaleString()}</span>
                        <span className={`text-[8px] uppercase tracking-widest font-black font-mono px-2 py-0.5 rounded ${
                          m.status === "Approved" 
                            ? "bg-emerald-500/15 text-emerald-400" 
                            : m.status === "Completed"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-yellow-550/15 text-yellow-500"
                        }`}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust/Stripe Verification status */}
              <div className="bg-[#12112e] border border-[#5b4dff]/25 rounded-2xl p-4 flex gap-3 text-xs leading-normal">
                <div className="w-8 h-8 rounded-lg bg-[#5b4dff]/15 text-[#8e6fff] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-white block">Verified Escrow Protection (EP-91)</span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Client funds remain isolated inside DesignBridge African gateway router and are only credited to the specialist upon verified milestone approval or mutual sign-offs.
                  </p>
                </div>
              </div>

              {/* Primary action controls in details view */}
              <div className="flex items-center gap-3 border-t border-slate-900 pt-5">
                {selectedInvoice.status === "Pending" && userRole === "Client" && (
                  <button
                    id="btn-inspector-fund-escrow"
                    onClick={() => handleFundEscrow(selectedInvoice.id)}
                    className="flex-1 bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-3 rounded-xl cursor-pointer shadow-lg border-none hover:scale-102 transition-transform"
                  >
                    Fund Secure Escrow (${selectedInvoice.amount.toLocaleString()})
                  </button>
                )}

                {selectedInvoice.status === "Escrow Locked" && userRole === "Client" && (
                  <button
                    id="btn-inspector-release-escrow"
                    onClick={() => handleReleaseEscrow(selectedInvoice.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black py-3 rounded-xl cursor-pointer shadow-lg border-none hover:scale-102 transition-transform"
                  >
                    Release Entire Escrow to Specialist
                  </button>
                )}

                {selectedInvoice.status === "Pending Release" && userRole === "Client" && (
                  <button
                    id="btn-inspector-release-pending"
                    onClick={() => handleReleaseEscrow(selectedInvoice.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black py-3 rounded-xl cursor-pointer shadow-lg border-none hover:scale-102 transition-transform"
                  >
                    Approve Deliverables & Release Payout
                  </button>
                )}

                <button 
                  id="btn-inspector-audit-trace"
                  onClick={() => {
                    alert(`Stripe transaction verification ledger retrieved:\nRef: ${selectedInvoice.stripeId}\nTransfer fully cleared via DesignBridge Escrow router.`);
                  }}
                  className="bg-transparent border border-slate-800 hover:bg-slate-900 font-bold text-xs text-slate-400 hover:text-white py-3 px-4 rounded-xl cursor-pointer"
                >
                  Audited Trace
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
