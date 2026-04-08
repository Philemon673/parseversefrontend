"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Paperclip, Smile,
  X, Phone, Video, Search, BellOff, Archive, Trash2, Ban,
  MoreVertical, ImageIcon,
} from "lucide-react";

const initialMessages = [
  { id: 1, sender: "Mashok Khan", initials: "Mt", color: "from-indigo-400 to-purple-500", text: "What are some recommended resources for learning TensorFlow?", time: "20 min ago", isOwn: false },
  { id: 2, sender: "Bilal Ahmed", initials: "BA", color: "from-orange-400 to-amber-500", text: "I suggest starting with TensorFlow's official documentation and their YouTube channel. They're excellent for beginners!", time: "5 min ago", isOwn: false },
  { id: 3, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Fast.ai's Deep Learning course is also amazing. Highly recommend it!", time: "2 min ago", isOwn: true },
  { id: 4, sender: "Mashok Khan", initials: "MK", color: "from-indigo-400 to-purple-500", text: "Great suggestions! I also found Coursera's TensorFlow specialization very structured and beginner-friendly.", time: "1 min ago", isOwn: false },
  { id: 5, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Agreed! The hands-on projects really help solidify the concepts.", time: "just now", isOwn: true },
];

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, className = "", color = "from-indigo-400 to-purple-500" }) {
  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// ── Icon Action Button ────────────────────────────────────────────────────────

function IconBtn({ icon: Icon, onClick, tooltip, variant = "ghost" }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={
          "w-9 h-9 rounded-xl flex items-center justify-center transition " +
          (variant === "solid"
            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
            : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700")
        }
      >
        <Icon className="w-4 h-4" />
      </button>
      {tooltip && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ── Dropdown Menu ─────────────────────────────────────────────────────────────

function DropdownMenu({ open, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    { icon: Search,    label: "Search",             color: "text-slate-500" },
    { icon: BellOff,   label: "Mute Notifications", color: "text-slate-500" },
    { icon: ImageIcon, label: "Change Wallpaper",   color: "text-slate-500" },
    { icon: Archive,   label: "Archive Chat",       color: "text-slate-500" },
    { icon: Trash2,    label: "Clear Chat",         color: "text-red-500", divider: true },
    { icon: Ban,       label: "Block",              color: "text-red-500" },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 bg-white rounded-2xl border border-slate-100 shadow-xl p-2 min-w-[250px]"
    >
      {items.map((item) => (
        <div key={item.label}>
          {item.divider && <div className="h-px bg-slate-100 my-1" />}
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition text-xs font-medium text-slate-700 group"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span>{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Chat Header ───────────────────────────────────────────────────────────────

function ChatHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials="MK" className="w-10 h-10 text-xs" color="from-indigo-400 to-purple-500" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-900">Machine Learning Forum</p>
          <p className="text-[11px] text-green-500 font-medium">4 members online</p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        <IconBtn icon={Phone} tooltip="Voice call" variant="ghost" />
        <IconBtn icon={Video} tooltip="Video call" variant="solid" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500 hover:text-slate-700"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>
          <DropdownMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ message: msg }) {
  if (msg.isOwn) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed shadow-sm">
            {msg.text}
          </div>
          <span className="text-[10px] text-slate-400">{msg.time}</span>
        </div>
        <Avatar initials={msg.initials} className="w-7 h-7 text-[10px]" color={msg.color} />
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <Avatar initials={msg.initials} className="w-7 h-7 text-[10px]" color={msg.color} />
      <div className="flex flex-col gap-1 max-w-[70%]">
        <span className="text-[10px] text-slate-500 font-medium ml-1">{msg.sender}</span>
        <div className="bg-white text-slate-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm leading-relaxed shadow-sm border border-slate-100">
          {msg.text}
        </div>
        <span className="text-[10px] text-slate-400 ml-1">{msg.time}</span>
      </div>
    </div>
  );
}

// ── Message List ──────────────────────────────────────────────────────────────

function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-slate-50">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ── Chat Input ────────────────────────────────────────────────────────────────

function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend() {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100">
      <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-2">
        <button className="text-slate-400 hover:text-slate-600 transition mb-1">
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400 resize-none py-1 max-h-24"
        />
        <button className="text-slate-400 hover:text-slate-600 transition mb-1">
          <Smile className="w-4 h-4" />
        </button>
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

// ── Chat Page ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);

  function handleSend(text) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        initials: "RK",
        color: "from-purple-400 to-pink-500",
        text,
        time: "just now",
        isOwn: true,
      },
    ]);
  }

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}