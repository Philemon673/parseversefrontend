"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  Phone,
  Video,
  Search,
  BellOff,
  Archive,
  Trash2,
  Ban,
  MoreVertical,
  ImageIcon,
  CheckCheck,
  Check,
  Pin,
  LogOut,
  Settings,
  ChevronDown,
  Filter,
  Edit,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const conversations = [
  {
    id: 1,
    name: "Mashok Khan",
    initials: "MK",
    color: "from-sky-400 to-blue-600",
    lastMessage: "Great suggestions! I also found Coursera very structured.",
    time: "18m",
    unread: 3,
    online: true,
    isGroup: false,
  },
  {
    id: 2,
    name: "Bilal Ahmed",
    initials: "BA",
    color: "from-orange-400 to-amber-600",
    lastMessage: "I suggest starting with TensorFlow's official docs 📚",
    time: "1h",
    unread: 1,
    online: false,
    isGroup: false,
  },
  {
    id: 3,
    name: "React Study Group",
    initials: "RS",
    color: "from-cyan-400 to-teal-600",
    lastMessage: "Who's joining the session tonight?",
    time: "3h",
    unread: 7,
    online: true,
    isGroup: true,
    members: 12,
  },
  {
    id: 4,
    name: "Priya Sharma",
    initials: "PS",
    color: "from-rose-400 to-pink-600",
    lastMessage: "Thanks for sharing those resources!",
    time: "Yesterday",
    unread: 0,
    online: false,
    isGroup: false,
  },
  {
    id: 5,
    name: "Dev Bootcamp",
    initials: "DB",
    color: "from-emerald-400 to-green-600",
    lastMessage: "Week 4 assignments are now live 🎉",
    time: "Yesterday",
    unread: 0,
    online: true,
    isGroup: true,
    members: 28,
  },
  {
    id: 6,
    name: "Amir Hassan",
    initials: "AH",
    color: "from-violet-400 to-purple-600",
    lastMessage: "Can you review my PR when you get a chance?",
    time: "2d",
    unread: 0,
    online: false,
    isGroup: false,
  },
  
];

const messagesByConversation = {
  1: [
    { id: 1, sender: "Mashok Khan", initials: "MK", color: "from-sky-400 to-blue-600", text: "What are some recommended resources for learning TensorFlow?", time: "20 min ago", isOwn: false },
    { id: 2, sender: "Bilal Ahmed", initials: "BA", color: "from-orange-400 to-amber-600", text: "I suggest starting with TensorFlow's official documentation and their YouTube channel. They're excellent for beginners!", time: "5 min ago", isOwn: false },
    { id: 3, sender: "You", initials: "RK", color: "from-indigo-400 to-violet-500", text: "Fast.ai's Deep Learning course is also amazing. Highly recommend it!", time: "2 min ago", isOwn: true, status: "read" },
    { id: 4, sender: "Mashok Khan", initials: "MK", color: "from-sky-400 to-blue-600", text: "Great suggestions! I also found Coursera's TensorFlow specialization very structured and beginner-friendly.", time: "1 min ago", isOwn: false },
    { id: 5, sender: "You", initials: "RK", color: "from-indigo-400 to-violet-500", text: "Agreed! The hands-on projects really help solidify the concepts.", time: "just now", isOwn: true, status: "delivered" },
  ],
  2: [
    { id: 1, sender: "Mashok Khan", initials: "MK", color: "from-sky-400 to-blue-600", text: "Hey! Did you check out that new paper on transformers?", time: "Yesterday", isOwn: false },
    { id: 2, sender: "You", initials: "RK", color: "from-indigo-400 to-violet-500", text: "Yes! The attention mechanism improvements are fascinating.", time: "Yesterday", isOwn: true, status: "read" },
    { id: 3, sender: "Mashok Khan", initials: "MK", color: "from-sky-400 to-blue-600", text: "Great suggestions! I also found Coursera very structured for that topic.", time: "18 min ago", isOwn: false },
  ],
  3: [
    { id: 1, sender: "Bilal Ahmed", initials: "BA", color: "from-orange-400 to-amber-600", text: "I suggest starting with TensorFlow's official docs 📚", time: "1h ago", isOwn: false },
  ],
  4: [
    { id: 1, sender: "Priya", initials: "PS", color: "from-rose-400 to-pink-600", text: "Who's joining the session tonight?", time: "3h ago", isOwn: false },
    { id: 2, sender: "You", initials: "RK", color: "from-indigo-400 to-violet-500", text: "I'll be there! 🙌", time: "3h ago", isOwn: true, status: "read" },
  ],
  5: [
    { id: 1, sender: "Priya Sharma", initials: "PS", color: "from-rose-400 to-pink-600", text: "Thanks for sharing those resources!", time: "Yesterday", isOwn: false },
  ],
  6: [
    { id: 1, sender: "Admin", initials: "DB", color: "from-emerald-400 to-green-600", text: "Week 4 assignments are now live 🎉", time: "Yesterday", isOwn: false },
  ],
  7: [
    { id: 1, sender: "Amir Hassan", initials: "AH", color: "from-violet-400 to-purple-600", text: "Can you review my PR when you get a chance?", time: "2d ago", isOwn: false },
  ],
};

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color = "from-indigo-500 to-violet-600", className = "" }) {
  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// ── Conversation Sidebar ──────────────────────────────────────────────────────

function ConversationSidebar({ activeId, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const others = filtered.filter((c) => !c.pinned);

  return (
    <div className="w-80 h-full flex-shrink-0 flex flex-col bg-white">
      {/* Sidebar header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">Messages</h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {conversations.filter((c) => c.unread > 0).length} unread conversations
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500">
              <Filter className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition text-white shadow-sm shadow-indigo-200">
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition placeholder-slate-400 text-slate-700"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {pinned.length > 0 && (
          <>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pt-2 pb-1">
              Pinned
            </p>
            {pinned.map((c) => (
              <ConversationItem key={c.id} conv={c} active={activeId === c.id} onSelect={onSelect} />
            ))}
            <div className="h-px bg-slate-100 mx-2 my-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pb-1">
              All Messages
            </p>
          </>
        )}
        {others.map((c) => (
          <ConversationItem key={c.id} conv={c} active={activeId === c.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function ConversationItem({ conv, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 group text-left ${
        active
          ? "bg-indigo-50 border border-indigo-100"
          : "hover:bg-slate-50 border border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar initials={conv.initials} color={conv.color} className="w-11 h-11 text-xs" />
        {conv.online && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {conv.pinned && <Pin className="w-2.5 h-2.5 text-indigo-400 flex-shrink-0" />}
            <p className={`text-xs font-bold truncate ${active ? "text-indigo-700" : "text-slate-800"}`}>
              {conv.name}
            </p>
          </div>
          <span className={`text-[10px] flex-shrink-0 ml-2 ${conv.unread > 0 ? "text-indigo-500 font-bold" : "text-slate-400 font-medium"}`}>
            {conv.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 truncate leading-snug">{conv.lastMessage}</p>
          {conv.unread > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center px-1">
              {conv.unread}
            </span>
          )}
        </div>
        {conv.isGroup && (
          <p className="text-[10px] text-slate-400 mt-0.5">{conv.members} members</p>
        )}
      </div>
    </button>
  );
}

// ── Dropdown Menu ─────────────────────────────────────────────────────────────

function DropdownMenu({ open, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const sections = [
    {
      label: "Chat",
      items: [
        { icon: Search, label: "Search Messages", shortcut: "⌘F" },
        { icon: Pin, label: "Pinned Messages", shortcut: null },
        { icon: BellOff, label: "Mute Notifications", shortcut: null },
        { icon: ImageIcon, label: "Shared Media", shortcut: null },
      ],
    },
    {
      label: "Settings",
      items: [
        { icon: Settings, label: "Chat Settings", shortcut: null },
        { icon: Archive, label: "Archive Chat", shortcut: null },
      ],
    },
    {
      label: "Danger Zone",
      danger: true,
      items: [
        { icon: Trash2, label: "Clear Chat History", shortcut: null, danger: true },
        { icon: Ban, label: "Block User", shortcut: null, danger: true },
        { icon: LogOut, label: "Leave Group", shortcut: null, danger: true },
      ],
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-2 w-56 animate-in"
      style={{ animation: "dropIn 0.15s ease-out" }}
    >
      <style>{`@keyframes dropIn { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

      {sections.map((section, si) => (
        <div key={section.label}>
          {si > 0 && <div className="h-px bg-slate-100 my-1.5" />}
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">
            {section.label}
          </p>
          {section.items.map((item) => (
            <button
              key={item.label}
              onClick={onClose}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl transition text-xs font-medium group ${
                item.danger
                  ? "hover:bg-red-50 text-red-500"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.danger ? "bg-red-50" : "bg-slate-100 group-hover:bg-white"} transition`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.danger ? "text-red-400" : "text-slate-500"}`} />
                </div>
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
                  {item.shortcut}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Chat Header ───────────────────────────────────────────────────────────────

function ChatHeader({ conv }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials={conv.initials} color={conv.color} className="w-10 h-10 text-xs" />
          {conv.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-black text-sm text-slate-900 tracking-tight">{conv.name}</p>
            {conv.isGroup && (
              <span className="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                Group
              </span>
            )}
          </div>
          <p className={`text-[11px] font-medium ${conv.online ? "text-green-500" : "text-slate-400"}`}>
            {conv.isGroup
              ? `${conv.members} members · ${conv.online ? "Active now" : "Inactive"}`
              : conv.online
              ? "Online now"
              : "Last seen recently"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500 hover:text-slate-700">
          <Phone className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition text-white shadow-sm shadow-indigo-200">
          <Video className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              menuOpen
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700"
            }`}
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
  const StatusIcon = msg.status === "read" ? CheckCheck : Check;

  if (msg.isOwn) {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="flex flex-col items-end gap-1 max-w-[68%]">
          <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed shadow-sm shadow-indigo-200">
            {msg.text}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[10px]">{msg.time}</span>
            {msg.status && (
              <StatusIcon
                className={`w-3 h-3 ${msg.status === "read" ? "text-indigo-500" : "text-slate-400"}`}
              />
            )}
          </div>
        </div>
        <Avatar initials={msg.initials} color={msg.color} className="w-7 h-7 text-[10px]" />
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5">
      <Avatar initials={msg.initials} color={msg.color} className="w-7 h-7 text-[10px]" />
      <div className="flex flex-col gap-1 max-w-[68%]">
        <span className="text-[10px] text-slate-500 font-semibold ml-1">{msg.sender}</span>
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

  // Group messages by date (simplified: just show "Today")
  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3.5 bg-slate-50/60">
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
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
      onSend(text.trim());
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
    <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-slate-100 relative z-40">
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
          className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400 resize-none py-1.5 text-slate-800 leading-snug"
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

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50/60 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
        <Send className="w-7 h-7 text-indigo-400" />
      </div>
      <div>
        <p className="font-black text-slate-800 text-sm">Select a conversation</p>
        <p className="text-xs text-slate-400 mt-1">Choose a chat from the sidebar to start messaging</p>
      </div>
    </div>
  );
}

// ── Chat Page ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [activeId, setActiveId] = useState(1);
  const [allMessages, setAllMessages] = useState(messagesByConversation);

  const activeConv = conversations.find((c) => c.id === activeId);
  const messages = allMessages[activeId] || [];

  function handleSend(text) {
    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        {
          id: Date.now(),
          sender: "You",
          initials: "RK",
          color: "from-indigo-400 to-violet-500",
          text,
          time: "just now",
          isOwn: true,
          status: "delivered",
        },
      ],
    }));
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar */}
      <div className="flex-shrink-0 flex flex-col h-full rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
        <ConversationSidebar activeId={activeId} onSelect={setActiveId} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full rounded-2xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 bg-white">
        {activeConv ? (
          <>
            <ChatHeader conv={activeConv} />
            <MessageList messages={messages} />
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}