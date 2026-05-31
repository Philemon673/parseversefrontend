"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Paperclip, Smile, X, Phone, Video, Search, BellOff, Archive, Trash2, Ban, MoreVertical, ImageIcon, CheckCheck, Check, Pin, LogOut, Settings, Filter, Edit, Mic, Info, Image as ImageIcon2, FileText
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/lib/socket-context";
import { useAuth } from "@/lib/auth-context";
import { forumService } from "@/lib/forumService";

function Avatar({ initials, avatar, color = "from-indigo-500 to-violet-600", className = "", isOnline }) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {avatar ? (
        <img src={avatar} alt={initials} className={`w-full h-full rounded-full object-cover border-2 border-white shadow-sm`} />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shadow-sm border-2 border-white`}>
          {initials}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm ring-2 ring-emerald-500/30" />
      )}
    </div>
  );
}

function ConversationSidebar({ forums, activeId, onSelect, onlineUsers, search, setSearch }) {
  const filtered = forums.filter((c) =>
    (c.name || c.firstName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[340px] h-full flex-shrink-0 flex flex-col bg-slate-50 border-r border-slate-200/60 z-10">
      {/* Sidebar header */}
      <div className="px-5 pt-6 pb-4 bg-white flex-shrink-0 border-b border-slate-100 shadow-sm shadow-slate-100/50">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chats</h2>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-600">
              <Filter className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition text-white shadow-md shadow-indigo-200">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 transition-all placeholder-slate-400 text-slate-700 shadow-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10">No conversations found.</div>
        ) : filtered.map((c) => {
          const isGroup = c.members?.length > 2 || true;
          const active = activeId === c.id;
          const isOnline = c.members?.some(m => onlineUsers.includes(m.userId));
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 group text-left relative ${
                active ? "bg-white shadow-md shadow-indigo-100/50 border border-indigo-100 ring-1 ring-indigo-50" : "hover:bg-white hover:shadow-sm border border-transparent"
              }`}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />}
              <Avatar initials={(c.firstName || c.name || "F")[0]} avatar={c.image} className="w-12 h-12 text-lg" isOnline={isOnline} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-bold truncate ${active ? "text-indigo-900" : "text-slate-800"}`}>
                    {c.firstName || c.name || "Forum"}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">
                    12:45 PM
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500 truncate leading-snug font-medium">
                    {c.description || "Join the conversation now!"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatHeader({ conv, onlineUsers, onToggleInfo }) {
  const isOnline = conv.members?.some(m => onlineUsers.includes(m.userId));

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm shadow-slate-100/50">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={onToggleInfo}>
        <Avatar initials={(conv.firstName || conv.name || "F")[0]} avatar={conv.image} className="w-11 h-11 text-sm group-hover:scale-105 transition-transform" isOnline={isOnline} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {conv.firstName || conv.name || "Forum"}
            </h3>
            <span className="text-[10px] font-extrabold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">Group</span>
          </div>
          <p className={`text-xs font-medium mt-0.5 transition-colors ${isOnline ? "text-emerald-500" : "text-slate-500"}`}>
            {conv._count?.members || conv.members?.length || 0} members {isOnline ? "· Active now" : "· Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-50 flex items-center justify-center transition text-slate-500 hover:text-indigo-600 border border-slate-100">
          <Phone className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-50 flex items-center justify-center transition text-slate-500 hover:text-indigo-600 border border-slate-100">
          <Video className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button onClick={onToggleInfo} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-50 flex items-center justify-center transition text-slate-500 hover:text-indigo-600 border border-slate-100">
          <Search className="w-4 h-4" />
        </button>
        <button onClick={onToggleInfo} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-indigo-50 flex items-center justify-center transition text-slate-500 hover:text-indigo-600 border border-slate-100">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }) {
  const StatusIcon = CheckCheck;
  return (
    <div className={`flex items-end mb-4 group ${isOwn ? "justify-end gap-2" : "gap-2"}`}>
      {!isOwn && <Avatar initials={(message.sender?.firstName || "U")[0]} avatar={message.sender?.avatar} className="w-8 h-8 text-[10px] mb-1 opacity-90 group-hover:opacity-100 transition-opacity" />}
      
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[65%]`}>
        {!isOwn && <span className="text-[11px] text-slate-500 font-bold ml-3 mb-1">{message.sender?.firstName || "User"}</span>}
        
        <div className={`relative px-5 py-3 shadow-sm ${
          isOwn 
            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-[24px] rounded-br-sm"
            : "bg-white text-slate-800 rounded-[24px] rounded-bl-sm border border-slate-100 shadow-slate-100"
        }`}>
          <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
          
          <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${isOwn ? "text-indigo-100" : "text-slate-400"}`}>
            <span className="text-[10px] font-medium">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isOwn && <StatusIcon className="w-3.5 h-3.5 text-blue-300" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
      setShowEmoji(false);
    }
  };

  return (
    <div className="flex-shrink-0 px-6 py-4 bg-white/80 backdrop-blur-md border-t border-slate-100 relative z-40">
      {showEmoji && (
        <div className="absolute bottom-full left-6 mb-4 shadow-2xl rounded-2xl overflow-hidden border border-slate-100 bg-white z-50">
          <EmojiPicker onEmojiClick={(emoji) => setText((p) => p + emoji.emoji)} previewConfig={{ showPreview: false }} />
        </div>
      )}
      
      <div className="flex items-end gap-3 bg-white rounded-[28px] border border-slate-200 shadow-sm shadow-slate-100 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all px-4 py-2.5">
        <button onClick={() => setShowEmoji(!showEmoji)} className={`transition mb-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${showEmoji ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}>
          <Smile className="w-5 h-5" />
        </button>
        <button className="transition mb-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Type your message..."
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          className="flex-1 text-[15px] bg-transparent focus:outline-none placeholder-slate-400 resize-none py-2 text-slate-800 leading-snug my-0.5 custom-scrollbar"
          style={{ maxHeight: "120px" }}
        />
        
        {text.trim() ? (
          <button onClick={handleSend} className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md shadow-indigo-200 mb-0.5">
            <Send className="w-5 h-5 text-white ml-0.5" />
          </button>
        ) : (
          <button className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0 mb-0.5">
            <Mic className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>
    </div>
  );
}

function ContactInfoPane({ conv, onClose }) {
  if (!conv) return null;
  return (
    <div className="w-[320px] h-full flex-shrink-0 flex flex-col bg-white border-l border-slate-100 shadow-xl z-20">
      <div className="h-16 flex items-center px-4 border-b border-slate-100">
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition mr-3">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-slate-800">Contact Info</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-slate-100">
          <Avatar initials={(conv.firstName || conv.name || "F")[0]} avatar={conv.image} className="w-24 h-24 text-3xl mb-4 shadow-lg ring-4 ring-slate-50" />
          <h3 className="text-xl font-black text-slate-900">{conv.firstName || conv.name || "Forum"}</h3>
          <p className="text-sm text-slate-500 mt-1">{conv.description || "No description provided."}</p>
        </div>

        <div className="py-4">
          <div className="px-5 mb-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Media, Links and Docs</h4>
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-slate-200 transition cursor-pointer">
                <ImageIcon2 className="w-6 h-6" />
              </div>
              <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-slate-200 transition cursor-pointer">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 py-2">
          <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition text-slate-700 font-medium">
            <BellOff className="w-5 h-5 text-slate-400" /> Mute Notifications
          </button>
          <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition text-slate-700 font-medium">
            <Pin className="w-5 h-5 text-slate-400" /> Pin Chat
          </button>
          <button className="w-full px-5 py-3 flex items-center gap-4 hover:bg-red-50 transition text-red-600 font-medium">
            <Trash2 className="w-5 h-5 text-red-500" /> Delete Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [forums, setForums] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    forumService.getAllForums().then((data) => {
      setForums(data);
      if (data.length > 0 && !activeId) setActiveId(data[0].id);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeId || !socket) return;
    
    socket.emit("joinForum", activeId);
    
    forumService.getMessages(activeId).then((data) => {
      setMessages(data);
    }).catch(console.error);

    const handleNewMessage = (msg) => {
      if (msg.forumId === activeId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handlePreviousMessages = (msgs) => setMessages(msgs);
    const handleUserTyping = ({ userName }) => {
      setTypingUsers((prev) => ({ ...prev, [userName]: true }));
      setTimeout(() => {
        setTypingUsers((prev) => { const next = {...prev}; delete next[userName]; return next; });
      }, 3000);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("previousMessages", handlePreviousMessages);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.emit("leaveForum", activeId);
      socket.off("newMessage", handleNewMessage);
      socket.off("previousMessages", handlePreviousMessages);
      socket.off("userTyping", handleUserTyping);
    };
  }, [activeId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = (text) => {
    if (!socket || !activeId) return;
    socket.emit("sendMessage", { forumId: activeId, text, type: "TEXT" });
    socket.emit("stopTyping", { forumId: activeId });
  };

  const handleTyping = () => {
    if (!socket || !activeId) return;
    socket.emit("typing", { forumId: activeId, userName: user?.name || "User" });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket.emit("stopTyping", { forumId: activeId }), 2000);
  };

  const activeConv = forums.find(f => f.id === activeId);

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/60 shadow-2xl shadow-indigo-100/40 relative">
      <ConversationSidebar forums={forums} activeId={activeId} onSelect={setActiveId} onlineUsers={onlineUsers} search={search} setSearch={setSearch} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#f4f7f6] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {activeConv ? (
          <>
            <ChatHeader conv={activeConv} onlineUsers={onlineUsers} onToggleInfo={() => setShowInfo(!showInfo)} />
            
            <div className="flex-1 overflow-y-auto px-6 py-6 z-10 custom-scrollbar">
              <div className="flex justify-center mb-6">
                <span className="bg-white text-slate-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm border border-slate-100 uppercase tracking-wide">
                  Today
                </span>
              </div>
              
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
              ))}
              
              {Object.keys(typingUsers).length > 0 && (
                <div className="flex items-center gap-2 mb-4 ml-10">
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            
            <ChatInput onSend={handleSend} onTyping={handleTyping} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 z-10 text-center px-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center shadow-inner border border-white">
              <Send className="w-10 h-10 text-indigo-400 ml-1" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-slate-800 mb-2">ParseVerse Messages</h3>
              <p className="text-slate-500 font-medium max-w-sm">Select a conversation from the sidebar or start a new chat to connect with mentors and students.</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar Info Pane */}
      {showInfo && activeConv && (
        <ContactInfoPane conv={activeConv} onClose={() => setShowInfo(false)} />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.6);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}
