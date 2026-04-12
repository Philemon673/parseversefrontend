"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, MessageCircle, Eye, Flame, Send, Paperclip, Smile, X, MoreVertical, Phone, Video, BellOff, Archive, Trash2, Ban, ImageIcon } from "lucide-react";

const activeMembers = [
  { initials: "MN", name: "Martin Nel", role: "VIP Member", isVip: true, color: "from-indigo-400 to-purple-500" },
  { initials: "SK", name: "Sebastian Kim", role: "VIP", online: true, color: "from-pink-400 to-rose-500" },
  { initials: "BA", name: "Bilal Ahmed", role: "VIP", online: true, color: "from-orange-400 to-amber-500" },
  { initials: "DW", name: "Donald Williams", role: "VIP", online: true, color: "from-teal-400 to-cyan-500" },
  { initials: "MR", name: "Marissa Ray", role: "VIP", online: true, color: "from-purple-400 to-pink-500" },
  { initials: "CT", name: "Claire Turner", role: "VIP", online: true, color: "from-blue-400 to-indigo-500" },
];

const popularTopics = [
  { title: "Getting Started with Python for Data Science", upvotes: 328 },
  { title: "Best Practice; for Neural Network Optimization", upvotes: 236 },
];

const popularTopics2 = [
  { title: "Getting Started with Python for Data Science", upvotes: 326 },
];

const initialMessages = [
  { id: 1, sender: "Mashok Khan", initials: "MK", color: "from-indigo-400 to-purple-500", text: "What are some recommended resources for learning TensorFlow?", time: "20 min ago", isOwn: false },
  { id: 2, sender: "Bilal Ahmed", initials: "BA", color: "from-orange-400 to-amber-500", text: "I suggest starting with TensorFlow's official documentation and their YouTube channel. They're excellent for beginners!", time: "5 min ago", isOwn: false },
  { id: 3, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Fast.ai's Deep Learning course is also amazing. Highly recommend it!", time: "2 min ago", isOwn: true },
  { id: 4, sender: "Mashok Khan", initials: "MK", color: "from-indigo-400 to-purple-500", text: "Great suggestions! I also found Coursera's TensorFlow specialization very structured and beginner-friendly.", time: "1 min ago", isOwn: false },
  { id: 5, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Agreed! The hands-on projects really help solidify the concepts.", time: "just now", isOwn: true },
];

function Avatar(props) {
  const color = props.color || "from-indigo-400 to-purple-500";
  const className = props.className || "";
  return (
    <div className={"rounded-full bg-gradient-to-br " + color + " flex items-center justify-center text-white font-bold flex-shrink-0 " + className}>
      {props.initials}
    </div>
  );
}

function VipBadge() {
  return (
    <span className="bg-orange-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
      VIP
    </span>
  );
}

function PostStats(props) {
  return (
    <div className="flex items-center gap-4 text-gray-400 text-xs">
      {props.likes !== undefined && (
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-purple-400" fill="#a78bfa" /> {props.likes}
        </span>
      )}
      {props.hearts !== undefined && (
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-red-400" fill="#f87171" /> {props.hearts}
        </span>
      )}
      {props.comments !== undefined && (
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" /> {props.comments}
        </span>
      )}
      {props.views !== undefined && (
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> {props.views}
        </span>
      )}
    </div>
  );
}

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

function DropdownMenu({ open, onClose, onSearchClick }) {
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
    { icon: Search,    label: "Search",             color: "text-slate-500", action: onSearchClick },
    { icon: BellOff,   label: "Mute Notifications", color: "text-slate-500" },
    { icon: ImageIcon, label: "Change Wallpaper",   color: "text-slate-500" },
    { icon: Archive,   label: "Archive Chat",       color: "text-slate-500" },
    { icon: Trash2,    label: "Clear Chat",         color: "text-red-500", divider: true },
    { icon: Ban,       label: "Block",              color: "text-red-500" },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 bg-white rounded-2xl border border-slate-100 shadow-xl p-1.5 min-w-[180px]"
    >
      {items.map((item) => (
        <div key={item.label}>
          {item.divider && <div className="h-px bg-slate-100 my-1" />}
          <button
            onClick={() => { item.action ? item.action() : onClose(); }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition text-xs font-medium text-slate-700"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span>{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

function ChatHeader({ messages }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const searchInputRef = useRef(null);

  const matches = searchQuery.trim()
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
    setSearchQuery("");
    setMatchIndex(0);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setMatchIndex(0);
  }

  function handlePrev() {
    setMatchIndex((i) => (i - 1 + matches.length) % matches.length);
  }

  function handleNext() {
    setMatchIndex((i) => (i + 1) % matches.length);
  }

  return (
    <div className="flex-shrink-0 border-b border-slate-100 bg-white">
      {/* Main header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar initials="MK" className="w-10 h-10 text-xs" color="from-indigo-400 to-purple-500" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm text-slate-900">Machine Learning Forum</p>
              <VipBadge />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">members <strong className="text-slate-700">400</strong></span>
              <span className="text-green-500">active <strong>6</strong></span>
            </div>
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
            <DropdownMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onSearchClick={openSearch}
            />
          </div>
        </div>
      </div>

      {/* Search bar — slides in below header */}
      {searchOpen && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setMatchIndex(0); }}
              className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                {matches.length > 0 ? `${matchIndex + 1} / ${matches.length}` : "0 results"}
              </span>
            )}
            <button onClick={closeSearch} className="text-slate-400 hover:text-slate-600 transition ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          {searchQuery && matches.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-50">
                <span className="text-[10px] text-slate-400 font-medium">{matches.length} message{matches.length !== 1 ? "s" : ""} found</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    disabled={matches.length <= 1}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-40 transition text-xs font-bold"
                  >
                    ↑
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={matches.length <= 1}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-40 transition text-xs font-bold"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-50">
                {matches.map((m, i) => {
                  const idx = m.text.toLowerCase().indexOf(searchQuery.toLowerCase());
                  const before = m.text.slice(0, idx);
                  const match = m.text.slice(idx, idx + searchQuery.length);
                  const after = m.text.slice(idx + searchQuery.length);
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMatchIndex(i)}
                      className={`w-full text-left px-3 py-2 transition ${i === matchIndex ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                    >
                      <p className="text-[10px] font-semibold text-indigo-500 mb-0.5">{m.sender} · {m.time}</p>
                      <p className="text-xs text-slate-700 leading-snug">
                        {before}
                        <mark className="bg-yellow-200 text-slate-900 rounded px-0.5">{match}</mark>
                        {after}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {searchQuery && matches.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">No messages match "{searchQuery}"</p>
          )}
        </div>
      )}
    </div>
  );
}

function MessageBubble(props) {
  const msg = props.message;
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

function MessageList(props) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-slate-50">
      {props.messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function ChatInput(props) {
  const [text, setText] = useState("");

  function handleSend() {
    if (text.trim()) {
      props.onSend(text.trim());
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
      <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);

  function handleSend(text) {
    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      initials: "RK",
      color: "from-purple-400 to-pink-500",
      text: text,
      time: "just now",
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  }

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white">
      <ChatHeader messages={messages} />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default function ChatForumsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex gap-5 p-5 bg-[#f2f3fa] h-screen overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
        <div
          className="relative rounded-2xl overflow-hidden h-28 flex flex-col justify-center px-6 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #6d28d9 70%, #a855f7 100%)" }}
        >
          <h2 className="text-white text-xl font-bold relative z-10">Machine Learning</h2>
          <p className="text-purple-200 text-xs mt-1 max-w-xs relative z-10">
            Discuss everything related to machine learning, from algorithms to neural networks and beyond.
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatPage />
        </div>
      </div>

      <div className="w-[220px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Active Forum Members</h3>
          <div className="flex flex-col gap-2.5">
            {activeMembers.map((member) => (
              <div key={member.name} className="flex items-center gap-2">
                <div className="relative">
                  <Avatar initials={member.initials} className="w-8 h-8 text-xs" color={member.color} />
                  {member.online && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-800 truncate">{member.name}</span>
                    {member.isVip && <VipBadge />}
                  </div>
                  <span className="text-[10px] text-gray-400">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-xs text-indigo-500 font-medium mt-3 hover:underline block text-right w-full">
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Popular Topics</h3>
          <div className="flex flex-col gap-3">
            {popularTopics.map((topic, i) => (
              <div key={i} className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="#f97316" />
                <div>
                  <p className="text-xs font-medium text-gray-800 leading-snug">{topic.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{topic.upvotes} Upvotes</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-xs text-indigo-500 font-medium mt-3 hover:underline block text-right w-full">
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Topic of the day</h3>
          <div className="flex flex-col gap-3">
            {popularTopics2.map((topic, i) => (
              <div key={i} className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="#f97316" />
                <div>
                  <p className="text-xs font-medium text-gray-800 leading-snug">{topic.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{topic.upvotes} Upvotes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}