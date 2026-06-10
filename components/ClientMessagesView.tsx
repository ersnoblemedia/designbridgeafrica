"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Video, Send } from "lucide-react";

interface ClientMessagesViewProps {
  messageThreads: any[];
  selectedThreadId: string;
  handleSelectThread: (threadId: string) => void;
  typedMessage: string;
  setTypedMessage: (text: string) => void;
  handleSendMessage: () => void;
}

export default function ClientMessagesView({
  messageThreads,
  selectedThreadId,
  handleSelectThread,
  typedMessage,
  setTypedMessage,
  handleSendMessage
}: ClientMessagesViewProps) {
  return (
    <motion.div
      key="sub-messages"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      id="client-messages-view-container"
    >
      {/* Threads list sidebar (1/3 column) */}
      <div className="md:col-span-1 bg-[#090818] border border-slate-900 rounded-3xl p-4.5 space-y-4">
        <span className="text-[10px] uppercase font-black text-slate-550 tracking-wider font-mono block pl-2">
          Active Collaborators ({messageThreads.length})
        </span>

        <div className="space-y-2">
          {messageThreads.map((thread) => (
            <button
              key={thread.id}
              id={`client-chat-thread-btn-${thread.id}`}
              onClick={() => handleSelectThread(thread.id)}
              className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer group ${
                selectedThreadId === thread.id 
                  ? "bg-[#181636] border-[#5b4dff]/30" 
                  : "bg-slate-950/20 border-slate-900/60 hover:bg-slate-950/40 hover:border-slate-805"
              }`}
            >
              <div className="relative shrink-0">
                <Image 
                  src={thread.avatar} 
                  alt={thread.name} 
                  width={38}
                  height={38}
                  className="rounded-xl border border-slate-800 object-cover w-9 h-9"
                  referrerPolicy="no-referrer"
                />
                {thread.unread && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-[#090818] rounded-full animate-pulse" />
                )}
              </div>

              <div className="truncate min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white block group-hover:text-[#8e6fff] transition-colors">{thread.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0">{thread.time}</span>
                </div>
                <span className="text-[10px] text-[#8e6fff] font-bold block">{thread.role}</span>
                <p className="text-[10px] text-slate-400 truncate leading-relaxed">
                  {thread.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dialog content chat area (2/3 column) */}
      <div className="md:col-span-2 bg-[#090818]/60 border border-slate-900 rounded-3xl p-5 h-[480px] flex flex-col justify-between">
        {(() => {
          const thread = messageThreads.find(t => t.id === selectedThreadId);
          if (!thread) return <div className="text-slate-500 text-xs py-20 text-center">No thread selected</div>;
          return (
            <>
              {/* Conversation Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-900">
                <div className="flex items-center gap-3">
                  <Image 
                    src={thread.avatar} 
                    alt={thread.name} 
                    width={36}
                    height={36}
                    className="rounded-lg border border-slate-805 object-cover w-9 h-9"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{thread.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">● {thread.role} • Escrow active</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="border border-slate-800 hover:bg-[#16143c] text-xs text-slate-300 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent">
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Align Huddle</span>
                  </button>
                </div>
              </div>

              {/* Dialogue Scroll Panel */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
                <div className="text-center py-2">
                  <span className="text-[9px] font-black uppercase text-slate-600 bg-slate-950/40 border border-slate-900 rounded px-2.5 py-1 tracking-widest font-mono">
                    Verified Escrow-Backed Stream
                  </span>
                </div>

                {thread.chats.map((msg: any, idx: number) => {
                  const isMine = msg.sender === "client";
                  return (
                    <div 
                      key={idx} 
                      className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2.5`}
                    >
                      {!isMine && (
                        <Image 
                          src={thread.avatar} 
                          alt={thread.name} 
                          width={24}
                          height={24}
                          className="rounded-full shrink-0 border border-slate-800 object-cover w-6 h-6"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-md leading-relaxed ${
                        isMine 
                          ? "bg-[#5b4dff] text-white rounded-br-none" 
                          : "bg-[#181636] text-slate-100 rounded-bl-none border border-slate-900/60"
                      }`}>
                        <p>{msg.text}</p>
                        <span className={`text-[8px] font-mono block text-right mt-1.5 ${isMine ? "text-white/60" : "text-slate-500"}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Controls */}
              <div className="pt-3.5 border-t border-slate-900 flex items-center gap-2">
                <input 
                  type="text"
                  placeholder={`Reply to ${thread.name}...`}
                  value={typedMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 bg-[#090818] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-550 outline-none focus:border-[#5b4dff]"
                />
                <button 
                  id="client-send-btn-action"
                  onClick={handleSendMessage}
                  className="bg-[#5b4dff] hover:bg-[#7546ff] text-white p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer h-10 w-10 flex items-center justify-center shrink-0 border-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </motion.div>
  );
}
