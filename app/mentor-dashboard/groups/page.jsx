"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, MessageCircle, Eye, Flame, Send, Paperclip, Smile, Video, Phone, MoreVertical, UserPlus, UserMinus, Settings, Bell, BellOff, Trash2, LogOut, ChevronRight } from "lucide-react";

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

const menuItems = [
  { icon: UserPlus, label: "Add Member", color: "text-indigo-500", hoverBg: "hover:bg-indigo-50", divider: false },
  { icon: UserMinus, label: "Remove Member", color: "text-rose-500", hoverBg: "hover:bg-rose-50", divider: false },
  { icon: Bell, label: "Mute Notifications", color: "text-amber-500", hoverBg: "hover:bg-amber-50", divider: true },
  { icon: Settings, label: "Group Settings", color: "text-gray-500", hoverBg: "hover:bg-gray-50", divider: false },
  { icon: LogOut, label: "Leave Group", color: "text-red-500", hoverBg: "hover:bg-red-50", divider: false },
];

function ChatHeader() {
  const [open, setOpen] = useState(false);
  const [calling, setCalling] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0 rounded-t-2xl">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials="MK" className="w-10 h-10 text-xs" color="from-indigo-400 to-purple-500" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-gray-900">Machine Learning Forum</span>
            <VipBadge />
          </div>
          <span className="text-xs text-gray-400">
            <span className="text-green-500 font-medium">6 active</span>
            <span className="mx-1">·</span>
            400 members
          </span>
        </div>
      </div>

      {/* Right: Action Icons */}
      <div className="flex items-center gap-1">

        {/* Video Call Button */}
        <button
          onClick={() => setCalling(calling === "video" ? null : "video")}
          title="Video Call"
          className={`
            relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
            ${calling === "video"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
            }
          `}
        >
          <Video className="w-[18px] h-[18px]" />
          {calling === "video" && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
          )}
        </button>

        {/* Voice Call Button */}
        <button
          onClick={() => setCalling(calling === "phone" ? null : "phone")}
          title="Voice Call"
          className={`
            relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
            ${calling === "phone"
              ? "bg-green-500 text-white shadow-md shadow-green-200"
              : "text-gray-500 hover:bg-green-50 hover:text-green-600"
            }
          `}
        >
          <Phone className="w-[17px] h-[17px]" />
          {calling === "phone" && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-300 border-2 border-white rounded-full animate-pulse" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* More Options Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            title="More options"
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
              ${open
                ? "bg-gray-100 text-gray-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }
            `}
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </button>

          {/* Dropdown Panel */}
          {open && (
            <div
              className="absolute right-0 top-11 z-50 bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{
                minWidth: 200,
                boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
                animation: "dropdownFadeIn 0.15s ease-out",
              }}
            >
              {/* Header hint */}
              <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Group Options</p>
              </div>

              <div className="py-1.5">
                {menuItems.map((item, i) => (
                  <div key={item.label}>
                    {item.divider && <div className="my-1.5 mx-3 border-t border-gray-100" />}
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 group ${item.hoverBg}`}
                      onClick={() => setOpen(false)}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50 group-hover:scale-105 transition-transform duration-150`}>
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className={`text-xs font-medium text-gray-700 flex-1 text-left`}>{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 text-center">Machine Learning Forum · 400 members</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframe for dropdown */}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
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
          <span className="text-[10px] text-gray-400">{msg.time}</span>
        </div>
        <Avatar initials={msg.initials} className="w-7 h-7 text-[10px]" color={msg.color} />
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <Avatar initials={msg.initials} className="w-7 h-7 text-[10px]" color={msg.color} />
      <div className="flex flex-col gap-1 max-w-[70%]">
        <span className="text-[10px] text-gray-500 font-medium ml-1">{msg.sender}</span>
        <div className="bg-white text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm leading-relaxed shadow-sm border border-gray-100">
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 ml-1">{msg.time}</span>
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
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-gray-50">
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
    if (text.trim()) { props.onSend(text.trim()); setText(""); }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }
  return (
    <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2">
        <button className="text-gray-400 hover:text-gray-600 transition mb-1">
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-400 resize-none py-1 max-h-24"
        />
        <button className="text-gray-400 hover:text-gray-600 transition mb-1">
          <Smile className="w-4 h-4" />
        </button>
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Press Enter to send · Shift+Enter for new line</p>
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
      text,
      time: "just now",
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  }
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      <ChatHeader />
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