"use client";

import React, { useState, useMemo } from "react";
import * as d3 from "d3";
import { Sparkles, TrendingUp, Users, Award, ShieldCheck, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom type definitions for our D3 charts
interface SkillItem {
  id: string;
  name: string;
  value: number;
  color: string;
  gradColor: string;
  desc: string;
  metrics: string;
}

interface TrendItem {
  month: string;
  designers: number;
  capital: number;
}

export default function DBAPlatformIntelligence() {
  // 1. DATA: Fully vetted human-centric metrics unique to DesignBridge Africa
  const skillData: SkillItem[] = useMemo(() => [
    { 
      id: "afro-futurism", 
      name: "Afro-Futurism & Spatial Design", 
      value: 28, 
      color: "#8e6fff", 
      gradColor: "from-[#8e6fff] to-[#5b4dff]",
      desc: "Architectural modeling, immersive staging, and spatial layouts incorporating authentic regional folklore aesthetics.",
      metrics: "74 certified masters active"
    },
    { 
      id: "indigenous-branding", 
      name: "Indigenous Motif & Identity Systems", 
      value: 22, 
      color: "#38bdf8", 
      gradColor: "from-[#38bdf8] to-[#0284c7]",
      desc: "Advanced hand-drawn custom vector work celebrating Adinkra motifs, South African bead pattern geometry, and ancient iconography.",
      metrics: "58 design houses certified"
    },
    { 
      id: "fintech-uiux", 
      name: "High-Margin Fintech UI/UX Systems", 
      value: 25, 
      color: "#fbbf24", 
      gradColor: "from-[#fbbf24] to-[#d97706]",
      desc: "Ergonomic, low-bandwidth responsive app interfaces built specifically to match the unique localized digital workflows of African consumer markets.",
      metrics: "62 product specialists active"
    },
    { 
      id: "sovereign-type", 
      name: "Sovereign Display Typography", 
      value: 15, 
      color: "#f43f5e", 
      gradColor: "from-[#f43f5e] to-[#be123c]",
      desc: "Bespoke font forge creations that honor continent-wide calligraphic legacies, creating premier proprietary branded letterforms.",
      metrics: "39 expert type foundries"
    },
    { 
      id: "ethno-digital", 
      name: "Ethno-Illustrated Asset Formats", 
      value: 10, 
      color: "#10b981", 
      gradColor: "from-[#10b981] to-[#047857]",
      desc: "Vibrant high-resolution artwork and vector packaging labels designed to represent authentic agricultural and cosmetic goods for export.",
      metrics: "28 elite illustrators approved"
    }
  ], []);

  const trendData: TrendItem[] = useMemo(() => [
    { month: "Jan", designers: 210, capital: 18500 },
    { month: "Feb", designers: 285, capital: 29000 },
    { month: "Mar", designers: 370, capital: 42500 },
    { month: "Apr", designers: 450, capital: 59000 },
    { month: "May", designers: 540, capital: 78200 },
    { month: "Jun", designers: 680, capital: 96400 }
  ], []);

  // 2. STATE CO-ORDINATION
  const [activeSkillId, setActiveSkillId] = useState<string | null>("afro-futurism");
  const [trendMetric, setTrendMetric] = useState<"capital" | "designers">("capital");
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);

  // 3. D3 CALCULATIONS FOR SKILL DISTRIBUTION DOUGHNUT CHART
  const pieWidth = 240;
  const pieHeight = 240;
  const outerRadius = 105;
  const innerRadius = 75;

  const pieSegments = useMemo(() => {
    const pieGenerator = d3.pie<SkillItem>()
      .value(d => d.value)
      .sort(null);
    return pieGenerator(skillData);
  }, [skillData]);

  const arcGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<SkillItem>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(5)
      .padAngle(0.03);
  }, []);

  const arcHoverGenerator = useMemo(() => {
    return d3.arc<d3.PieArcDatum<SkillItem>>()
      .innerRadius(innerRadius - 4)
      .outerRadius(outerRadius + 8)
      .cornerRadius(6)
      .padAngle(0.03);
  }, []);

  const activeSegmentDetails = useMemo(() => {
    return skillData.find(s => s.id === activeSkillId) || skillData[0];
  }, [activeSkillId, skillData]);

  // 4. D3 CALCULATIONS FOR TRENDS AREA / LINE CHART
  const trendChartWidth = 500;
  const trendChartHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 40;

  // Scales
  const xScale = useMemo(() => {
    return d3.scalePoint()
      .domain(trendData.map(d => d.month))
      .range([paddingLeft, trendChartWidth - paddingRight]);
  }, [trendData]);

  const yScale = useMemo(() => {
    const maxValue = trendMetric === "capital"
      ? d3.max(trendData, d => d.capital) || 120000
      : d3.max(trendData, d => d.designers) || 800;

    return d3.scaleLinear()
      .domain([0, maxValue * 1.1]) // Add 10% breathing room
      .range([trendChartHeight - paddingBottom, paddingTop]);
  }, [trendData, trendMetric]);

  // Generators for line and area path strings
  const linePath = useMemo(() => {
    const lineGenerator = d3.line<TrendItem>()
      .x(d => xScale(d.month) || 0)
      .y(d => yScale(trendMetric === "capital" ? d.capital : d.designers))
      .curve(d3.curveMonotoneX);
    return lineGenerator(trendData);
  }, [trendData, xScale, yScale, trendMetric]);

  const areaPath = useMemo(() => {
    const areaGenerator = d3.area<TrendItem>()
      .x(d => xScale(d.month) || 0)
      .y0(trendChartHeight - paddingBottom)
      .y1(d => yScale(trendMetric === "capital" ? d.capital : d.designers))
      .curve(d3.curveMonotoneX);
    return areaGenerator(trendData);
  }, [trendData, xScale, yScale, trendMetric]);

  // Helper values for Grid lines on the trend chart
  const yAxisTicks = useMemo(() => {
    return yScale.ticks(5);
  }, [yScale]);

  return (
    <div className="bg-[#0b091a] border border-slate-900 rounded-3xl p-6 md:p-8 space-y-8 select-none relative overflow-hidden">
      
      {/* Decorative Subtle glow */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#5b4dff]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Title block with human curation narrative */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#8e6fff] bg-[#8e6fff]/10 px-2.5 py-1 rounded-full inline-block">
            Verified Network Analytics
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            Ecosystem Curation & Milestone Capital Trends
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Real-time representation of verified specialist specializations, direct foreign design investments, and active creative community sizes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#060510] border border-slate-900/90 rounded-xl p-1.5 shrink-0">
          <button
            onClick={() => setTrendMetric("capital")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              trendMetric === "capital"
                ? "bg-[#5b4dff] text-white shadow-md shadow-[#5b4dff]/15"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Milestone Vault Flows
          </button>
          <button
            onClick={() => setTrendMetric("designers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              trendMetric === "designers"
                ? "bg-[#5b4dff] text-white shadow-md shadow-[#5b4dff]/15"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Certified Creative Talent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1 (40% width): SKILL REPRESENTATION DONUT CHART */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-6 bg-[#080715]/40 border border-slate-900/80 rounded-2xl p-6">
          <div className="text-center w-full">
            <span className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono">
              Sovereign Specializations
            </span>
          </div>

          <div className="relative w-[240px] h-[240px] flex items-center justify-center">
            {/* Donut Chart SVG */}
            <svg width={pieWidth} height={pieHeight} className="overflow-visible">
              <g transform={`translate(${pieWidth / 2}, ${pieHeight / 2})`}>
                {pieSegments.map((seg, idx) => {
                  const isHovered = seg.data.id === activeSkillId;
                  const dPath = isHovered 
                    ? arcHoverGenerator(seg) 
                    : arcGenerator(seg);

                  return (
                    <path
                      key={seg.data.id}
                      d={dPath || ""}
                      fill={seg.data.color}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 10px ${seg.data.color}35)` : "none"
                      }}
                      onMouseEnter={() => setActiveSkillId(seg.data.id)}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
              <span className="text-2xl font-black text-white leading-none">
                {activeSegmentDetails.value}%
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Ecosystem Portion
              </span>
            </div>
          </div>

          {/* Interactive Info Card */}
          <div className="w-full text-left bg-[#0c0a1e]/40 border border-slate-900 rounded-xl p-4 min-h-[140px] flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: activeSegmentDetails.color }}
                />
                <h4 className="text-xs font-black text-white leading-none">
                  {activeSegmentDetails.name}
                </h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 font-medium">
                {activeSegmentDetails.desc}
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-semibold font-mono">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeSegmentDetails.metrics}</span>
              </span>
              <span className="text-slate-300 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                Tier-1 Vetted
              </span>
            </div>
          </div>
        </div>

        {/* COLUMN 2 (60% width): GROWTH PROGRESSION LINE CHART */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
          
          <div className="bg-[#080715]/40 border border-slate-900/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-black text-slate-400 tracking-wider font-mono">
                {trendMetric === "capital" ? "Cleared Milestone Outlays" : "Registered Creator Count"} (H1 2026)
              </span>
              <span className="text-xs flex items-center gap-1 font-mono text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{trendMetric === "capital" ? "+420% Cumulative Flow" : "+223% Vetted Talent Joining"}</span>
              </span>
            </div>

            {/* D3 Vector Chart */}
            <div className="relative w-full overflow-hidden">
              <svg 
                viewBox={`0 0 ${trendChartWidth} ${trendChartHeight}`}
                className="w-full h-auto overflow-visible"
              >
                {/* Defs block for beautiful gradients and glows */}
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b4dff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#5b4dff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8e6fff" />
                    <stop offset="50%" stopColor="#5b4dff" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>

                {/* Y-axis ticks / guide lines */}
                {yAxisTicks.map((tick, idx) => (
                  <g key={idx} className="opacity-40">
                    <line
                      x1={paddingLeft}
                      y1={yScale(tick)}
                      x2={trendChartWidth - paddingRight}
                      y2={yScale(tick)}
                      stroke="#1e293b"
                      strokeDasharray="4,4"
                      strokeWidth={1}
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yScale(tick) + 4}
                      fill="#64748b"
                      fontSize={11}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {trendMetric === "capital" ? `$${(tick / 1000).toFixed(0)}k` : tick}
                    </text>
                  </g>
                ))}

                {/* Drawn Area underneath the curve */}
                <path
                  d={areaPath || ""}
                  fill="url(#areaGradient)"
                  className="transition-all duration-300"
                />

                {/* Main Curve Line */}
                <path
                  d={linePath || ""}
                  fill="none"
                  stroke="url(#lineGlow)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Invisible hover trackers and dots */}
                {trendData.map((d, idx) => {
                  const x = xScale(d.month) || 0;
                  const y = yScale(trendMetric === "capital" ? d.capital : d.designers);
                  const isHovered = hoveredTrendIdx === idx;

                  return (
                    <g key={d.month} className="cursor-pointer">
                      {/* Vertical highlight line on hover */}
                      {isHovered && (
                        <line
                          x1={x}
                          y1={paddingTop}
                          x2={x}
                          y2={trendChartHeight - paddingBottom}
                          stroke="#8e6fff"
                          strokeOpacity={0.4}
                          strokeWidth={1.5}
                        />
                      )}

                      {/* X-axis Month Label */}
                      <text
                        x={x}
                        y={trendChartHeight - 15}
                        fill={isHovered ? "#ffffff" : "#64748b"}
                        fontSize={12}
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {d.month}
                      </text>

                      {/* Accent circle dots */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? "#ffffff" : "#5b4dff"}
                        stroke="#0b091a"
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredTrendIdx(idx)}
                        onMouseLeave={() => setHoveredTrendIdx(null)}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Micro Tooltip section representing hover state */}
            <div className="h-10.5 flex items-center justify-between bg-slate-950/40 rounded-xl px-4 border border-slate-900/40 text-xs text-slate-400">
              {hoveredTrendIdx !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8e6fff]" />
                    <span className="font-semibold text-slate-300">
                      Month of <strong>{trendData[hoveredTrendIdx].month} 2026</strong>:
                    </span>
                  </div>
                  <span className="font-mono text-white font-extrabold">
                    {trendMetric === "capital"
                      ? `Resolved Project Flow: $${trendData[hoveredTrendIdx].capital.toLocaleString()}`
                      : `Active Audited Specialists: ${trendData[hoveredTrendIdx].designers} designers`}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>Hover over any milestone marker dot above to explore detailed monthly audit checkpoints.</span>
                </div>
              )}
            </div>
          </div>

          {/* Secure transaction assurance banner */}
          <div className="p-5.5 rounded-2xl bg-slate-950/60 border border-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/15">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white block">Sovereign Financial Transparency Guarantee</span>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  All transactions and talent verifications are hand-audited through DesignBridge legal frameworks. We exclude derivative algorithmic content generator products.
                </p>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 font-mono block">Registered Audits</span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">100% SECURE</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
