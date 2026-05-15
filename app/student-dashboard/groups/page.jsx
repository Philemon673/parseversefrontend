"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, MessageCircle, Eye, Flame, Send, Paperclip, Smile, Menu, X, UserPlus, UserMinus, Settings, LogOut, Bell } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const activeMembers = [
  { initials: "MN", name: "Martin Nel", role: "VIP Member", isVip: true, color: "from-indigo-400 to-purple-500" },
  { initials: "SK", name: "Sebastian Kim", role: "VIP", online: true, color: "from-pink-400 to-rose-500" },
  { initials: "BA", name: "Bilal Ahmed", role: "VIP", online: true, color: "from-orange-400 to-amber-500" },
  { initials: "DW", name: "Donald Williams", role: "VIP", online: true, color: "from-teal-400 to-cyan-500" },
  { initials: "MR", name: "Marissa Ray", role: "VIP", online: true, color: "from-purple-400 to-pink-500" },
  { initials: "CT", name: "Claire Turner", role: "VIP", online: true, color: "from-blue-400 to-indigo-500" },
];

const groupsData = [
  { 
    id: "ml", 
    name: "Machine Learning", 
    members: "400", 
    active: 6, 
    unread: 0, 
    color: "from-indigo-400 to-purple-500", 
    initials: "ML", 
    description: "Discuss everything related to machine learning, from algorithms to neural networks and beyond.",
    messages: [
      { id: 1, sender: "Mashok Khan", initials: "MK", color: "from-indigo-400 to-purple-500", text: "What are some recommended resources for learning TensorFlow?", time: "20 min ago", isOwn: false },
      { id: 2, sender: "Bilal Ahmed", initials: "BA", color: "from-orange-400 to-amber-500", text: "I suggest starting with TensorFlow's official documentation and their YouTube channel. They're excellent for beginners!", time: "5 min ago", isOwn: false },
      { id: 3, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Fast.ai's Deep Learning course is also amazing. Highly recommend it!", time: "2 min ago", isOwn: true },
      { id: 4, sender: "Mashok Khan", initials: "MK", color: "from-indigo-400 to-purple-500", text: "Great suggestions! I also found Coursera's TensorFlow specialization very structured and beginner-friendly.", time: "1 min ago", isOwn: false },
      { id: 5, sender: "You", initials: "RK", color: "from-purple-400 to-pink-500", text: "Agreed! The hands-on projects really help solidify the concepts.", time: "just now", isOwn: true },
    ]
  },
  { 
    id: "fm", 
    name: "Frontend Masters", 
    members: "1.2K", 
    active: 32, 
    unread: 5, 
    color: "from-blue-400 to-indigo-500", 
    initials: "FM",
    description: "All things React, Vue, Svelte, and modern CSS architecture.",
    messages: [
      { id: 1, sender: "Sarah Jenkins", initials: "SJ", color: "from-blue-400 to-indigo-500", text: "Has anyone tried React Compiler yet? Thoughts?", time: "2 hr ago", isOwn: false },
      { id: 2, sender: "Alex Chen", initials: "AC", color: "from-emerald-400 to-teal-500", text: "Yes! It's super fast, but you have to be careful with refs.", time: "1 hr ago", isOwn: false },
    ]
  },
  { 
    id: "ds", 
    name: "Data Science 101", 
    members: "850", 
    active: 14, 
    unread: 2, 
    color: "from-emerald-400 to-teal-500", 
    initials: "DS",
    description: "Learn data science basics, pandas, numpy, and visualizations.",
    messages: [
      { id: 1, sender: "David Chen", initials: "DC", color: "from-emerald-400 to-teal-500", text: "Any tips on cleaning a 10GB csv file without crashing pandas?", time: "1 hr ago", isOwn: false },
    ]
  },
  { 
    id: "ui", 
    name: "UI/UX Designers", 
    members: "430", 
    active: 5, 
    unread: 0, 
    color: "from-pink-400 to-rose-500", 
    initials: "UI",
    description: "Figma tips, portfolio critiques, and accessibility discussions.",
    messages: [
      { id: 1, sender: "Lena Smith", initials: "LS", color: "from-pink-400 to-rose-500", text: "What do you all think about the new Figma UI3 update?", time: "30 min ago", isOwn: false },
    ]
  },
  { 
    id: "sd", 
    name: "System Design", 
    members: "2.1K", 
    active: 45, 
    unread: 12, 
    color: "from-orange-400 to-amber-500", 
    initials: "SD",
    description: "Scaling applications, microservices, and interview prep.",
    messages: [
      { id: 1, sender: "Alice Wang", initials: "AW", color: "from-orange-400 to-amber-500", text: "Should I use Redis or Memcached for a leaderboard?", time: "45 min ago", isOwn: false },
      { id: 2, sender: "Bob Ross", initials: "BR", color: "from-blue-400 to-indigo-500", text: "Redis definitely. Sorted Sets are literally made for leaderboards.", time: "40 min ago", isOwn: false },
    ]
  },
  { 
    id: "cy", 
    name: "Cybersecurity", 
    members: "3.4K", 
    active: 88, 
    unread: 24, 
    color: "from-red-400 to-rose-600", 
    initials: "CY",
    description: "Ethical hacking, pentesting, and security best practices.",
    messages: []
  },
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
function ChatHeader({ activeGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b rounded-2xl border p-4 border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials={activeGroup.initials} className="w-9 h-9 text-xs" color={activeGroup.color} />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-gray-900">{activeGroup.name}</span>
            <VipBadge />
          </div>
          <span className="text-xs text-green-500">members <strong>{activeGroup.members}</strong></span>
          <span className="text-xs text-green-500 ml-2">active <strong>{activeGroup.active}</strong></span>
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
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 min-w-[220px] origin-top-right transform transition-all duration-200">
              <div className="px-4 py-2 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Group</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
              >
                <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                Add Members
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
              >
                <UserMinus className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                Remove Members
              </button>
              <div className="h-px bg-slate-100 my-1.5 mx-3" />
              <button 
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
              >
                <Bell className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                Mute Notifications
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
              >
                <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                Group Settings
              </button>
              <div className="h-px bg-slate-100 my-1.5 mx-3" />
              <button 
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm font-semibold text-slate-700 hover:text-red-600 group"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                Leave Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBubble(props) {
  const { message: msg, isFirstInGroup, isLastInGroup } = props;
  
  if (msg.isOwn) {
    return (
      <div className={`flex items-end justify-end gap-2 ${isLastInGroup ? 'mb-4' : 'mb-1'}`}>
        <div className="flex flex-col items-end gap-0.5 max-w-[75%]">
          <div className={`bg-indigo-600 text-white text-[15px] px-3.5 py-2 leading-relaxed shadow-sm ${
             isFirstInGroup && isLastInGroup ? 'rounded-[1.25rem] rounded-br-[0.35rem]' :
             isFirstInGroup ? 'rounded-[1.25rem] rounded-br-md' :
             isLastInGroup ? 'rounded-[1.25rem] rounded-tr-md rounded-br-[0.35rem]' :
             'rounded-[1.25rem] rounded-tr-md rounded-br-md'
          }`}>
            {msg.text}
          </div>
          {isLastInGroup && <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className={`flex items-end gap-2 ${isLastInGroup ? 'mb-4' : 'mb-1'}`}>
      <div className="w-7 h-7 flex-shrink-0">
        {isLastInGroup && <Avatar initials={msg.initials} className="w-7 h-7 text-[10px]" color={msg.color} />}
      </div>
      <div className="flex flex-col items-start gap-0.5 max-w-[75%]">
        {isFirstInGroup && <span className="text-[11px] text-gray-500 font-semibold ml-1 mb-0.5">{msg.sender}</span>}
        <div className={`bg-gray-100/80 text-gray-800 text-[15px] px-3.5 py-2 leading-relaxed border border-gray-100/50 ${
           isFirstInGroup && isLastInGroup ? 'rounded-[1.25rem] rounded-bl-[0.35rem]' :
           isFirstInGroup ? 'rounded-[1.25rem] rounded-bl-md' :
           isLastInGroup ? 'rounded-[1.25rem] rounded-tl-md rounded-bl-[0.35rem]' :
           'rounded-[1.25rem] rounded-tl-md rounded-bl-md'
        }`}>
          {msg.text}
        </div>
        {isLastInGroup && <span className="text-[10px] text-gray-400 ml-1 mt-1">{msg.time}</span>}
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
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col bg-white">
      {props.messages.map((msg, i) => {
        const prevMsg = props.messages[i - 1];
        const nextMsg = props.messages[i + 1];
        
        const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;
        const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender;

        return (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isFirstInGroup={isFirstInGroup} 
            isLastInGroup={isLastInGroup} 
          />
        );
      })}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

function ChatInput(props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  function handleSend() {
    if (text.trim()) {
      props.onSend(text.trim());
      setText("");
      setShowEmoji(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100 relative z-40">
      {showEmoji && (
        <div className="absolute bottom-full right-4 mb-2 shadow-2xl rounded-2xl overflow-hidden border border-slate-100 bg-white">
          <EmojiPicker onEmojiClick={onEmojiClick} previewConfig={{ showPreview: false }} />
        </div>
      )}
      <div className="flex items-end gap-2 bg-slate-50 rounded-3xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition px-4 py-2">
        <button className="text-slate-400 hover:text-indigo-500 transition mb-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200">
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-[15px] bg-transparent focus:outline-none placeholder-slate-400 resize-none py-1.5 text-slate-800 leading-snug"
          style={{ maxHeight: "120px" }}
        />
        <button 
          onClick={() => setShowEmoji((prev) => !prev)}
          className={`transition mb-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            showEmoji ? "bg-indigo-100 text-indigo-500" : "text-slate-400 hover:text-indigo-500 hover:bg-slate-200"
          }`}
        >
          <Smile className="w-4 h-4" />
        </button>
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0 shadow-sm shadow-indigo-200 mb-1"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5 text-center">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

function ChatPage({ activeGroup }) {
  const [messages, setMessages] = useState(activeGroup.messages);

  useEffect(() => {
    setMessages(activeGroup.messages);
  }, [activeGroup.id]);

  function handleSend(text) {
    const newMsg = {
      id: Date.now(),
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
      <ChatHeader activeGroup={activeGroup} />
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default function ChatForumsPage() {
  const [search, setSearch] = useState("");
  const [activeGroupId, setActiveGroupId] = useState(groupsData[0].id);
  const [showAllGroups, setShowAllGroups] = useState(false);

  const activeGroup = groupsData.find(g => g.id === activeGroupId) || groupsData[0];
  const displayedGroups = showAllGroups ? groupsData : groupsData.slice(0, 4);

  return (
    <div className="flex gap-5 p-5 bg-[#f2f3fa] h-screen overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
        <div
          className={`relative rounded-2xl overflow-hidden h-28 flex flex-col justify-center px-6 flex-shrink-0 bg-gradient-to-br ${activeGroup.color}`}
        >
          <h2 className="text-white text-xl font-bold relative z-10">{activeGroup.name}</h2>
          <p className="text-white/80 text-xs mt-1 max-w-xs relative z-10">
            {activeGroup.description}
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatPage activeGroup={activeGroup} />
        </div>
      </div>

      <div className="w-[220px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Active Members</h3>
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Your Groups</h3>
          <div className="flex flex-col gap-2">
            {displayedGroups.map((group) => (
              <div 
                key={group.id} 
                onClick={() => setActiveGroupId(group.id)}
                className={`flex items-center gap-3 cursor-pointer group/item p-2 rounded-xl transition-all ${activeGroupId === group.id ? 'bg-indigo-50 ring-1 ring-indigo-100' : 'hover:bg-slate-50'}`}
              >
                <Avatar initials={group.initials} className="w-8 h-8 text-[10px]" color={group.color} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate transition-colors ${activeGroupId === group.id ? 'text-indigo-700' : 'text-gray-800 group-hover/item:text-indigo-600'}`}>{group.name}</p>
                  <p className="text-[10px] text-gray-400">{group.members} members</p>
                </div>
                {group.unread > 0 && activeGroupId !== group.id && (
                  <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-indigo-200">
                    {group.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAllGroups(!showAllGroups)}
            className="text-xs text-indigo-600 font-bold mt-4 hover:bg-indigo-100 block text-center w-full bg-indigo-50 py-2 rounded-xl transition-colors"
          >
            {showAllGroups ? "Show Less" : "View All Groups"}
          </button>
        </div>
      </div>
    </div>
  );
}