"use client";

import React, { useState } from "react";
import { 
  Sparkles, Shield, HelpCircle, Terminal, Mail, Users, 
  ArrowRight, CheckCircle2, Lock, ArrowUpRight, Copy, Check,
  ChevronDown, BookOpen, Briefcase, Code, MapPin, Globe, ExternalLink, ArrowLeft
} from "lucide-react";

interface PageContainerProps {
  onBack: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
}

function PageContainer({ onBack, children, maxWidthClass = "max-w-4xl" }: PageContainerProps) {
  return (
    <div className="w-full bg-[#0d0c1d] relative py-12 px-4 sm:px-6 md:px-8 lg:px-12 animate-fadeIn min-h-[70vh]">
      <div className={`${maxWidthClass} mx-auto space-y-10`}>
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return to Homepage</span>
        </button>
        {children}
      </div>
    </div>
  );
}

// 1. ABOUT US PAGE
export function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            The Elite Creative Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Connecting the World to Africa&apos;s Premium Design Guilds
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-medium">
            DesignBridge Africa is the premier gatekeeper and transactional hub for high-end African design. We reject the commoditized, high-noise talent layout in favor of strict, zero-compromise manual reviews and elite milestones.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-slate-300">
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Manual Vetting & KYC Review</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-semibold">
              Every specialist on DesignBridge is verified individually. We evaluate visual portfolio standards, project history, and national identities against official registries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Advanced Milestone Escrow</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-semibold">
              Our secure payment routers isolate corporate deposits. Funds are only disbursed dynamically when the client uploads approval checkmarks.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-[#5b4dff]/20 space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8e6fff]" />
            <span>The Pan-African Renaissance</span>
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed font-semibold">
            By linking enterprise partners from global tech capitals directly with vetted specialists in Kenya, Nigeria, South Africa, Ghana, and Senegal, we produce stunning bespoke collaborations while transferring real high-margin wealth to African design communities.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

// 2. CAREERS PAGE
export function CareersPage({ onBack, onContactClick }: { onBack: () => void; onContactClick: (dept: string, prefillMsg: string) => void }) {
  const jobs = [
    { title: "Senior Escrow Ledger Engineer", dept: "Engineering / Remote", desc: "Build secondary programmatic transaction layers verifying Stripe and local gateway milestones over multi-region rails." },
    { title: "Lead Creative Vetting Specialist", dept: "Curation / Lagos or Accra", desc: "Manage visual review boards, evaluating design integrity, cultural motifs, and verifying professional credentials." },
    { title: "Creative Community Lead", dept: "Growth / Remote Africa", desc: "Foster growth amongst designers in emerging technology hubs, hosting digital workshops & portfolio audits." }
  ];

  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            Work With Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Build the Future of Pan-African Design Curation
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-medium">
            We are hiring globally minded creators, researchers, and engineers who are dedicated to securing, evaluating, and spotlighting elite African craftsmanship.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-4 text-slate-300">
          <h2 className="text-xl font-bold text-white">Open Roles</h2>
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-[#5b4dff]/20 transition-all">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-md sm:text-lg font-bold text-white leading-tight">{job.title}</h3>
                    <span className="text-[9px] font-mono uppercase bg-indigo-500/15 text-[#8e6fff] px-2.5 py-1 rounded-full">{job.dept}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">{job.desc}</p>
                </div>
                <button 
                  onClick={() => onContactClick("Careers", `Hi DBA Team! I am extremely interested in the ${job.title} role. Here is a brief overview of my profile...`)}
                  className="bg-white hover:bg-slate-150 text-[#0d0c1d] text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  Apply Here
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// 3. BLOG PAGE
export function BlogPage({ onBack }: { onBack: () => void }) {
  const posts = [
    {
      tag: "Artistic Design",
      title: "The Emergence of Afro-Futurist Architectural Rendering",
      desc: "Analyzing how digital artists utilize spatial design software to map historic structures into modern, sustainable corporate hubs.",
      date: "May 28, 2026",
      col: "from-indigo-600/20 to-purple-600/5",
      readTime: "7 min read"
    },
    {
      tag: "Secure Finance",
      title: "Standard Escrow Protection Model vs Traditional Freelancing Pools",
      desc: "Why immediate lock-ins of client project funds eliminate client-designer friction, ensuring 100% payment safety on both sides.",
      date: "June 02, 2026",
      col: "from-blue-600/20 to-indigo-900/10",
      readTime: "9 min read"
    },
    {
      tag: "Cultural Branding",
      title: "Visual Sovereignty: Repatriating Indigenous Motifs inside Packaging Layouts",
      desc: "How modern graphic designers in Cape Town and Lagos are honoring geometric beadworks and Adinkra systems on international labels.",
      date: "May 15, 2026",
      col: "from-purple-600/20 to-slate-900/40",
      readTime: "11 min read"
    }
  ];

  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            Insights & Research
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            DesignBridge Africa Blog
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-medium">
            Read critical perspectives on African creative identity, cryptographic milestone safeguards, and our global vetting standards.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-900/80 bg-slate-950/40 overflow-hidden flex flex-col justify-between h-full hover:border-[#5b4dff]/25 transition-all text-slate-300">
              <div className={`h-40 bg-gradient-to-br ${post.col} p-6 relative flex flex-col justify-between`}>
                <span className="text-[9px] uppercase font-bold bg-[#0d0c1d] border border-slate-800 text-slate-200 px-2.5 py-1 rounded-full self-start">
                  {post.tag}
                </span>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white leading-snug tracking-tight hover:text-[#8e6fff] cursor-pointer transition-colors">{post.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{post.desc}</p>
                </div>
                <button className="text-xs font-black text-[#8e6fff] flex items-center gap-1.5 hover:gap-2 transition-all self-start">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

// 4. CONTACT / SALES SUPPORT PAGE
export function ContactPage({ onBack, prefillDept, prefillMessage }: { onBack: () => void; prefillDept?: string; prefillMessage?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: prefillDept || "Hire a Designer / Team", message: prefillMessage || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageContainer onBack={onBack} maxWidthClass="max-w-[1500px]">
      <div className="space-y-10">
        
        {/* Title / Hero Header */}
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs uppercase font-mono font-black tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full inline-block">
            Let&apos;s Create Together
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Connect with DesignBridge Africa
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl font-semibold">
            Whether you are a visionary brand looking to hire premier African creative talent, a world-class designer seeking to join our curated talent pool, or someone who is passionate about storytelling through design, we would love to chat.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        {/* Two-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: TRUST CHANNELS & REGIONAL COORDINATES (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* SLA Statement */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-purple-950/10 border border-[#5b4dff]/20 space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-mono font-black text-[#8e6fff] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Creative Guarantee</span>
              </h4>
              <p className="text-xs text-slate-350 leading-relaxed font-semibold font-sans">
                We believe in personalized, warm human connections. A real person in our matching team will personally read and respond to your inquiry in under 4 hours. No robotic scripts, just pure passion for design.
              </p>
            </div>

            {/* Direct Official Emails */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono block">Direct Creative Channels</span>
              
              <div className="space-y-2.5">
                <a 
                  href="mailto:info@designbridgeafrica.com" 
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-3 hover:border-[#5b4dff]/35 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">General Inquiries</span>
                    <span className="text-xs text-slate-400 font-mono font-semibold block mt-0.5">info@designbridgeafrica.com</span>
                  </div>
                </a>

                <a 
                  href="mailto:corporate@designbridgeafrica.com" 
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-3 hover:border-indigo-500/35 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#5b4dff]/15 text-[#8e6fff] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Brand Partnerships & Corporate Projects</span>
                    <span className="text-xs text-slate-400 font-mono font-semibold block mt-0.5">corporate@designbridgeafrica.com</span>
                  </div>
                </a>

                <a 
                  href="mailto:support@designbridgeafrica.com" 
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-3 hover:border-emerald-500/35 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-450 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Designer & Client Support</span>
                    <span className="text-xs text-[#8e6fff] font-mono font-semibold block mt-0.5">support@designbridgeafrica.com</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Physical Regional Offices */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono block">Creative HQ</span>
              
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/20 border border-slate-900/60 text-xs text-slate-350">
                
                {/* Hub 1: West Africa */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-white">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>West Africa Hub (Uyo)</span>
                    </span>
                    <span className="text-xs uppercase font-mono text-emerald-400">HQ Open</span>
                  </div>
                  <p className="text-xs pl-5 leading-normal text-slate-300 font-semibold">
                    Block 9 Corporate Office, Inyang Street, Uyo, Nigeria
                  </p>
                  <span className="text-xs pl-5 text-[#8e6fff] font-mono block mt-1">Tel: +234 (0) 806-621-0504</span>
                </div>

              </div>
            </div>

          </div>

          {/* COLUMN 2: SECURE SUBMISSION INTAKE FORM (7 Columns) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-3xl bg-[#080715]/40 border border-[#5b4dff]/30 text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white tracking-tight">Message Received</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-semibold">
                    Thank you! Your creative brief has been directed to our coordinator team.
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-slate-350 font-medium leading-relaxed">
                  We look forward to collaborating. A warm liaison expert will reply directly to <strong>{form.email}</strong> shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs sm:text-sm font-bold text-[#8e6fff] hover:underline cursor-pointer bg-transparent border-none mt-4 block mx-auto outline-none"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono block">Send Us a Creative Note</span>
                
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#080715]/40 border border-slate-900 space-y-5 text-slate-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-black tracking-wider text-slate-400 block font-mono">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Amadi Chukwu"
                        className="w-full bg-[#0d0c1d]/90 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#5b4dff]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-black tracking-wider text-slate-400 block font-mono">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="amadi@domain.com"
                        className="w-full bg-[#0d0c1d]/90 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#5b4dff]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-black tracking-wider text-slate-400 block font-mono">What can we help you with?</label>
                    <select 
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#5b4dff] cursor-pointer font-semibold"
                    >
                      <option value="Hire a Designer / Team">Hire African Designers & Teams</option>
                      <option value="Join as a Designer">Join DesignBridge as a Vetted Talent</option>
                      <option value="General Partnership Inquiry">Brand Collaboration & Media</option>
                      <option value="Help with an Active Project">Project Support & Help Center</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase font-black tracking-wider text-slate-400 block font-mono">Your Project details or Message</label>
                    <textarea 
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your brand vision, your project scope, or questions about joining our creative community..."
                      className="w-full bg-[#0d0c1d]/90 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#5b4dff] resize-none pb-5"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#5b4dff] hover:bg-[#4c3ee6] text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#5b4dff]/20 cursor-pointer"
                  >
                    Send message
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>
    </PageContainer>
  );
}

// 5. COMMUNITY / CREATIVE CELL Page
export function CommunityPage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            Artistic Talent Networks
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Creative Meetups & Regional Design Cells
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-medium">
            We curate local cooperatives that empower talent to pool assets, review briefs, and establish top-of-market rates.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-slate-300">
          {[
            { city: "Lagos Creative Hub", members: "180+ Certified", focus: "Fintech Interface design & Design system architecture", lead: "Chinedu O." },
            { city: "Nairobi Creative Hub", members: "125+ Certified", focus: "Ethno-Futurist 3D Rendering & Immersive spaces", lead: "Wanjiku N." },
            { city: "Cape Town Creative Hub", members: "160+ Certified", focus: "Custom botanical prints & Premium packaging typography", lead: "Zola M." }
          ].map((guild, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-950/40 border border-slate-900 space-y-3">
              <h3 className="text-lg font-bold text-white block">{guild.city}</h3>
              <span className="text-xs font-mono font-bold text-[#8e6fff] bg-[#8e6fff]/5 border border-[#8e6fff]/25 px-2 py-0.5 rounded-full inline-block">{guild.members}</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">{guild.focus}</p>
              <div className="pt-2 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                Facilitator: {guild.lead}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-white">How DesignBridge Cooperatives Function</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-semibold">
            By funding quarterly design sprints, providing direct mentoring programs, and partnering with local visual arts networks, our community structures ensure designers across the continent have the supportive structures needed to succeed.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

// 6. HELP CENTER / FAQ PAGE
export function HelpPage({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    faq_1: true
  });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const faqs = [
    {
      id: "faq_1",
      q: "How does the Programmatic Escrow wrapper work safely?",
      a: "When a milestone contract is initiated, the dynamic client funds are transferred and locked securely in our regional escrow trusts. These coordinates are strictly frozen. They can only be transferred to the designer's credentials once the Client uploads a physical approval confirmation or standard milestone sign-off."
    },
    {
      id: "faq_2",
      q: "What is your manual talent vetting & verification system?",
      a: "Rather than letting an algorithm automate the application, each candidate undergoes hand-vetted evaluations. We check for identity correctness, review project portfolios to protect against derivative AI files, and inspect prior client messaging logs."
    },
    {
      id: "faq_3",
      q: "How are currency conversions and mobile money transfers managed?",
      a: "Clients deposit milestones in USD, GBP, or EUR via Stripe cards or SEPA coordinate systems. DesignBridge handles prompt, localized conversions to mobile services like M-Pesa, Orange Money, or regional bank networks, eliminating conversion rates losses for African creatives."
    },
    {
      id: "faq_4",
      q: "What if there is a deliverables dispute?",
      a: "If visual outputs do not map to the agreed criteria inside the workspace, either actor can trigger a 'Freeze'. Our Mediation Consortium steps in within 24 hours to inspect the historical log, facilitating a rational, balanced split of variables under strict escrow safety definitions."
    }
  ];

  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full block w-fit">
            Client & Designer Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            DesignBridge Help Desk & FAQ
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-semibold">
            Understand how our escrow structures, talent certifications, and dispute resolutions protect your creative investments.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-2xl border border-slate-900/80 bg-slate-950/40 overflow-hidden text-slate-300">
              <button 
                onClick={() => toggle(f.id)}
                className="w-full text-left p-5 flex justify-between items-center bg-[#0d0c1d]/30 hover:bg-[#0d0c1d]/60 transition-colors"
              >
                <span className="text-sm font-bold text-white pr-4">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${expanded[f.id] ? "rotate-180 text-[#8e6fff]" : ""}`} />
              </button>
              {expanded[f.id] && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/60 text-xs sm:text-sm text-slate-455 font-semibold leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

// 7. CORE GUIDELINES PAGE
export function GuidelinesPage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            Standards & Conduct
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Creative Quality & Partner Guidelines
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-semibold">
            To hold our space at the top 1% tier of Pan-African visual output, all members are requested to respect these behavioral criteria.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-6 text-slate-305 w-full">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/40 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Designer Conduct Directives</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400 list-disc pl-5 font-semibold">
              <li><strong>Absolute Originality:</strong> Plagiarizing or passing off non-vetted template styles is strictly prohibited. Portfolios must reflect real manual work under copyright safety rules.</li>
              <li><strong>Professional Thread Cadence:</strong> Communication threads inside our messaging section must be checked and replied to in under 24 hours.</li>
              <li><strong>Accurate Delivery Schedules:</strong> Designers must map dynamic deadlines carefully. If emergency delays happen, notify partners ahead of milestone markers.</li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/40 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8e6fff]" />
              <span>International Partner Directives</span>
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400 list-disc pl-5 font-semibold">
              <li><strong>Pre-fund Escrow:</strong> Always deposit and secure milestone funds into our secure transaction wrapper before ordering work components to start.</li>
              <li><strong>Constructive Reviews:</strong> Deliver clear, precise, and visual feedback timelines. Answer query proposals in under 48 hours to sustain rhythm.</li>
              <li><strong>Respect Intellectual Properties:</strong> Client assets cannot be publicized, printed, or deployed prior to releasing the specifying milestone payments.</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// 8. API Corey Ledger Docs page
export function ApiDocsPage({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<"js" | "py" | "curl">("js");
  const [copied, setCopied] = useState(false);

  const samples = {
    curl: `curl -X GET "https://api.designbridge.africa/v1/designers" \\
  -H "Authorization: Bearer dba_live_secure_jwtkey_2026_xyz" \\
  -H "Accept: application/json"`,
    js: `const dbaApiUrl = "https://api.designbridge.africa/v1/designers";
const dbaToken = "dba_live_secure_jwtkey_2026_xyz";

async function getVettedDesigners() {
  const response = await fetch(dbaApiUrl, {
    headers: {
      "Authorization": \`Bearer \${dbaToken}\`,
      "Content-Type": "application/json"
    }
  });
  return response.json();
}`,
    py: `import requests

url = "https://api.designbridge.africa/v1/designers"
headers = {
    "Authorization": "Bearer dba_live_secure_jwtkey_2026_xyz",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
designers = response.json()`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(samples[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-3 py-1.5 rounded-full">
            Programmatic Integration
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            API Documentation & Sandbox
          </h1>
          <p className="text-base sm:text-lg text-slate-450 leading-relaxed font-medium">
            Integrate certified designer profiles, active milestone statuses, and escrow transactions records directly into your custom enterprise backoffice.
          </p>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-4">
          <div className="flex border-b border-slate-900">
            {(["js", "py", "curl"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 border-b-2 text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                  lang === l 
                    ? "border-[#5b4dff] text-white" 
                    : "border-transparent text-slate-500 hover:text-slate-350"
                }`}
              >
                {l === "js" ? "JavaScript" : l === "py" ? "Python" : "cURL"}
              </button>
            ))}
          </div>

          <div className="relative rounded-2xl bg-zinc-950/80 border border-slate-900 p-5 font-mono text-xs overflow-x-auto text-slate-300">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-[#111026] text-slate-400 hover:text-white transition-all border border-slate-800 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="overflow-x-auto">
              <code>{samples[lang]}</code>
            </pre>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-900 text-xs sm:text-sm text-slate-400 space-y-3 font-semibold text-slate-300">
          <h3 className="text-base font-bold text-white">Security & Authentications Guidelines</h3>
          <p className="leading-relaxed">
            All API calls require valid TLS 1.3 handshakes. Requests are validated dynamically using enterprise JWT bearer tokens. Rate limits are locked at 10,000 queries per hour.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

// 9. PRIVACY PROTOCOL PAGE
export function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8 max-w-3xl mx-auto text-slate-300">
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">REVISION SYSTEM: JUNE 2026</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Data Trust & Privacy Protocol
          </h1>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed font-semibold">
          <p>
            At DesignBridge Africa (&ldquo;the Vetting Consortium&rdquo;), we maintain zero-tolerance guidelines regarding behavioral advertising and third-party demographic leasing. This Privacy Protocol documents our procedures.
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Secure Identity Verification</h3>
            <p>
              When a designer registers or uploads identity parameters, all records are stored in fully isolated, encrypted database partitions. They are never published, leased, or broadcasted to external marketing trackers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. Visual Asset Isolation</h3>
            <p>
              All milestone assets, wireframes, and final branding source packages uploaded during contract lifecycles are restricted to their authenticated recipient client. System routes verify token structures prior to releasing any image or file assets.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">3. System & Transaction Logs</h3>
            <p>
              Stripe checkout verification references, invoice identifiers, and contract metadata are kept secure. We track standard logging parameters strictly for fraud prevention.
            </p>
          </div>

          <p className="pt-4 border-t border-slate-900 text-xs text-slate-550">
            For further privacy reviews, submit inquiries directly to our coordinator at: <strong>privacy@designbridge.africa</strong>.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

// 10. TERMS OF SERVICE PAGE
export function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8 max-w-3xl mx-auto text-slate-300">
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">REVISION SYSTEM: 2026</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Master Platform Terms of Service
          </h1>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed font-semibold">
          <p>
            By establishing an account or launching a milestone-based project on DesignBridge Africa, you agree to comply with our Platform Terms.
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Core Escrow Commitment</h3>
            <p>
              Clients must pre-fund each project stage inside our secure escrow wrapper before ordering the certified design specialist to commence development. Escrow holdings are strictly locked.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. Creator Independence</h3>
            <p>
              Designers operate as verified independent freelancers. The Vetting Consortium verifies active identities and validates original portfolio works, but authorial ownership of styles resides between client and specialist upon cleared funds.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">3. Platform Bypassing Prohibition</h3>
            <p>
              Initiating communications inside DesignBridge but seeking payment bypass schemes outside our secure transaction wrappers compromises our safety guidelines. Users who bypass escrow models are subject to immediate and irreversible profile termination.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// 11. COOKIE STRATEGY PAGE
export function CookiePage({ onBack }: { onBack: () => void }) {
  return (
    <PageContainer onBack={onBack}>
      <div className="space-y-8 max-w-3xl mx-auto text-slate-300">
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-505 font-bold block">LAST EXAMINED: JUNE 2026</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Cookie & Token Storage Strategy
          </h1>
        </div>

        <div className="h-px bg-slate-900" />

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed font-semibold">
          <p>
            DesignBridge Africa utilizes basic browser tokenization to persist user states, ensuring stable logins across both desktop layouts and mobile viewports.
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Functional Session Tokens</h3>
            <p>
              We utilize localStorage and active cookies to remember your authenticated role (Client or Designer) and hold validation keys during workspace chats or invoice creations.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. Deactivation Routing</h3>
            <p>
              You can disable browser state tracking in your personal client settings. However, doing so will require re-signing in with token credentials on every new page interaction.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
