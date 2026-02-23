"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, MessageCircle, Eye, Flame, Send, Paperclip, Smile } from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

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

// ── Shared Sub Components ─────────────────────────────────────────────────────

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

// ── Chat Architecture Components ──────────────────────────────────────────────

// ChatHeader
function ChatHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials="MK" className="w-9 h-9 text-xs" color="from-indigo-400 to-purple-500" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-gray-900">Machine Learning Forum</span>
            <VipBadge />
          </div>
          <span className="text-xs text-green-500"> members <big>400</big> </span>
          <span className="text-xs text-green-500"> active <big>6</big></span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <MessageCircle className="w-4 h-4" />
        <span>4,876 messages</span>
      </div>
    </div>
  );
}

// MessageBubble
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

// MessageList
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

// ChatInput
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

// ChatPage (assembled)
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
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

// ── Main Page Export ──────────────────────────────────────────────────────────

export default function ChatForumsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex gap-5 p-5 bg-gray-50 h-screen overflow-hidden">

      {/* Center Column */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">

        {/* Search
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
          />
        </div> */}

        {/* Banner */}
        <div
          className="relative rounded-2xl overflow-hidden h-28 flex flex-col justify-center px-6 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #6d28d9 70%, #a855f7 100%)" }}
        >
          <h2 className="text-white text-xl font-bold relative z-10">Machine Learning</h2>
          <p className="text-purple-200 text-xs mt-1 max-w-xs relative z-10">
            Discuss everything related to machine learning, from algorithms to neural networks and beyond.
          </p>
        </div>

        {/* ChatPage — takes remaining height */}
        <div className="flex-1 min-h-0">
          <ChatPage />
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[220px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">

        {/* Active Forum Members */}
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
        </div>

        {/* Popular Topics 1 */}
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

        {/* Popular Topics 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Popular Topics</h3>
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


