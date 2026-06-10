"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, DollarSign } from "lucide-react";
import { resilientDB } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

interface PostBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostBriefModal({ isOpen, onClose }: PostBriefModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState(1500);
  const [category, setCategory] = useState("UI/UX Design");
  const [location, setLocation] = useState("Remote");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);

    try {
      // Save directly to database using our exact schema parameters
      await resilientDB.insert("jobs", {
        title,
        company: company || "Independent Client",
        budget: Number(budget),
        category,
        location,
        skillsNeeded: skillsArray.length > 0 ? skillsArray : [category],
        description,
        proposals: 0,
        creatorId: user.uid,
        createdAt: new Date().toISOString()
      });

      // Clear states & close
      setTitle("");
      setCompany("");
      setBudget(1500);
      setSkills("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("Error creating job: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d0c1d]/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#100f24] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#5b4dff]/10 border border-[#5b4dff]/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-[#8e6fff]" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Post Design Brief</h2>
          <p className="text-xs text-slate-400">Describe your project goals, budget, and timeline to find matching creators.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Project Title</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff]/50"
              placeholder="e.g., 3D Packaging Render for Abyssinia Honey"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
              <input 
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff]/50"
                placeholder="e.g., Abyssinia Premium Nectars"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Budget ($ USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="number"
                  required
                  min={1}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-[#0d0c1d] border border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff]/50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Design Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0d0c1d] border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#5b4dff]/50"
              >
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Branding & Packaging">Branding & Packaging</option>
                <option value="3D Art & Modeling">3D Art & Modeling</option>
                <option value="Digital Illustration">Digital Illustration & Custom Art</option>
                <option value="Motion Graphics">Motion Graphics & Brand Animation</option>
                <option value="Logo Design">Logo Design & Visual Identity Systems</option>
                <option value="Textile & Fashion">Luxury Textile & Fashion Pattern Design</option>
                <option value="Typography & Fonts">Typography & Custom Font Design</option>
                <option value="Web & No-Code Design">Web Design & No-Code Frontends</option>
                <option value="Graphic Design & Print">Graphic Design & Editorial Print Layouts</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Work Location</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff]/50"
                placeholder="e.g., Remote / Addis Ababa"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Required Skills (Comma separated)</label>
            <input 
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-605 focus:outline-none focus:border-[#5b4dff]/50"
              placeholder="e.g., Blender, Gold Foil Spec, Vector Illustrating"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Project Details</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#0d0c1d] border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5b4dff]/50 resize-none leading-relaxed"
              placeholder="Describe your design goals, the files you need from the designer, and any references you like..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#5b4dff]/20 disabled:opacity-40 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post My Design Brief</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
