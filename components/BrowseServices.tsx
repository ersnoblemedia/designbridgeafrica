"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Calendar, Heart, ShieldCheck, Check } from "lucide-react";
import { SERVICES, DESIGNERS } from "../lib/data";

interface BrowseServicesProps {
  bookedStatus: string | null;
  setBookedStatus: (status: string | null) => void;
  setSelectedDesigner?: (designer: any) => void;
  setActiveTab?: (tab: "home" | "dashboard" | "invoicing" | "checkout" | "designers" | "services" | "jobs" | "messaging" | "admin") => void;
}

export default function BrowseServices({ 
  bookedStatus, 
  setBookedStatus,
  setSelectedDesigner,
  setActiveTab
}: BrowseServicesProps) {
  const [faves, setFaves] = useState<string[]>([]);

  const toggleFave = (id: string) => {
    if (faves.includes(id)) {
      setFaves(faves.filter(f => f !== id));
    } else {
      setFaves([...faves, id]);
    }
  };

  const handleBookService = (service: any) => {
    const matchedDesigner = DESIGNERS.find(d => d.name.toLowerCase().includes(service.designerName.split(" ")[0].toLowerCase())) || DESIGNERS[0];
    
    if (setSelectedDesigner && setActiveTab) {
      setSelectedDesigner(matchedDesigner);
      setActiveTab("checkout");
    } else {
      setBookedStatus(`Securing design project payment of $${service.price} USD for "${service.title}". Please wait...`);
      setTimeout(() => {
        setBookedStatus(`Project active! $${service.price} USD is safely held. ${service.designerName} has been notified to start your designs within ${service.deliveryDays} days.`);
      }, 2500);
    }
  };

  return (
    <div id="services-catalog-tab" className="space-y-6">
      
      {/* Dynamic Notification board for escrow status */}
      {bookedStatus && (
        <div className="bg-[#141235] border border-[#5b4dff]/40 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5b4dff]/20 flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-4.5 h-4.5 text-[#8e6fff]" />
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {bookedStatus}
            </p>
          </div>
          <button 
            onClick={() => setBookedStatus(null)}
            className="text-[10px] uppercase font-black text-[#8e6fff] hover:text-white cursor-pointer px-3 py-1 bg-[#100f24] border border-slate-805 rounded-md"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Catalog listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <div 
            key={service.id}
            className="bg-[#100f24]/50 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition-all flex flex-col justify-between"
          >
            {/* Asset header card */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={service.image} alt="service" fill className="object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={() => toggleFave(service.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0d0c1d]/85 hover:bg-[#0d0c1d] border border-slate-800 flex items-center justify-center cursor-pointer transition-transform duration-300 active:scale-95 z-10"
              >
                <Heart className={`w-4 h-4 ${faves.includes(service.id) ? "text-red-500 fill-red-505" : "text-slate-400"}`} />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#0d0c1d]/95 text-[#f1f5f9] border border-slate-800 font-mono text-[9px] font-black px-2.5 py-1 rounded">
                ${service.price} USD
              </div>
            </div>

            {/* Service details bodies */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Image src={service.designerAvatar} alt={service.designerName} width={24} height={24} className="rounded-full object-cover" referrerPolicy="no-referrer" />
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">{service.designerName}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white hover:text-[#8e6fff] transition-colors leading-snug">
                  {service.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {service.description}
                </p>
              </div>

              {/* Specifications block */}
              <div className="border-t border-slate-900 pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Est. Delivery</span>
                  <span className="text-white font-bold">{service.deliveryDays} Days</span>
                </div>

                <button 
                  onClick={() => handleBookService(service)}
                  className="w-full bg-[#5b4dff] hover:bg-[#7546ff] text-white text-xs font-black py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#5b4dff]/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  Book This Service
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
