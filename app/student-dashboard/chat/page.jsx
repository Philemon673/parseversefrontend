"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, MessageCircle, Eye, Flame, Send, Paperclip, Smile, Menu, X } from "lucide-react";

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

// ✅ FIXED: useState is now at the top of the function, not inside JSX
function ChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b rounded-2xl border p-4 border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials="MK" className="w-9 h-9 text-xs" color="from-indigo-400 to-purple-500" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-gray-900">Machine Learning Forum</span>
            
          </div>
          
        </div>
      </div>

      {/* ✅ FIXED: hamburger is now plain JSX inside the return, no nested return() */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 bg-white rounded-2xl border border-gray-100 shadow-lg p-3 min-w-[160px]">
            <button className="w-full text-left px-3 py-2 pb-2 border-b border-transparent hover:border-blue-500 rounded-lg hover:bg-gray-100 transition text-sm font-medium pb-1">
              Add member
            </button>
            <button className="w-full text-left px-3 py-2 pb-2 border-b border-transparent hover:border-blue-500 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
              Remove Member
            </button>
            <button className="w-full text-left px-3 py-2 pb-2 border-b border-transparent hover:border-blue-500 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
              Group Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble(props) {
  const msg = props.message;
  if (msg.isOwn) {
    return (
      <div className="flex items-end justify-end gap-2 ">
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

export default function ChatPage() {
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

