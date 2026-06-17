"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, MessageCircle, Send, Paperclip, Smile,
  Menu, X, UserPlus, UserMinus, Settings, LogOut,
  Bell, Plus, Users, Wifi, WifiOff, Shield, ShieldAlert,
  Trash2, VolumeX, Volume2
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/lib/socket-context";
import { useAuth } from "@/lib/auth-context";
import { forumService } from "@/lib/forumService";
import { userService } from "@/lib/userService";

// ── Avatar ─────────────────────────────────────────────────────────────────────

function Avatar({ initials, avatar, color = "from-indigo-400 to-purple-500", className = "" }) {
  if (avatar) {
    return <img src={avatar} alt={initials} className={`rounded-full object-cover flex-shrink-0 ${className}`} />;
  }
  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// ── Connection indicator ───────────────────────────────────────────────────────

function ConnectionBadge({ isConnected }) {
  return (
    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isConnected ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
      {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {isConnected ? "Live" : "Offline"}
    </span>
  );
}

// ── Group colours (cycles for variety) ────────────────────────────────────────

const GROUP_COLORS = [
  "from-indigo-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
  "from-orange-400 to-amber-500",
  "from-red-400 to-rose-600",
  "from-cyan-400 to-sky-500",
  "from-violet-400 to-fuchsia-500",
];

function getColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return GROUP_COLORS[Math.abs(hash) % GROUP_COLORS.length];
}

function getInitials(str = "") {
  return str
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// ── Chat Header ────────────────────────────────────────────────────────────────

function GroupChatHeader({ group, isConnected, onlineUserIds, onLeave, isAdmin, isMuted, onMuteToggle, onDelete, onSettingsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = getColor(group.id);
  const initials = getInitials(group.firstName || group.name || "G");
  const onlineCount = (group.members || []).filter((m) => onlineUserIds.includes(m.userId)).length;

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar initials={initials} avatar={group.image} color={color} className="w-10 h-10 text-xs" />
          {onlineCount > 0 && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-gray-900 tracking-tight">{group.firstName || group.name}</span>
            {isMuted && (
              <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <VolumeX className="w-2.5 h-2.5" /> Muted
              </span>
            )}
            {isAdmin && (
              <span className="text-[9px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" /> Admin
              </span>
            )}
            <ConnectionBadge isConnected={isConnected} />
          </div>
          <p className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{group._count?.members || (group.members || []).length}</span> members
            {onlineCount > 0 && <span className="text-green-500 ml-2 font-semibold">· {onlineCount} online</span>}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`p-2 rounded-xl transition text-gray-500 ${menuOpen ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 min-w-[220px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-1 pb-2">Group Actions</p>
              
              {isAdmin && (
                <>
                  <button 
                    onClick={() => { setMenuOpen(false); onSettingsClick(); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
                  >
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /> Group Settings
                  </button>
                  <button 
                    onClick={() => { setMenuOpen(false); onMuteToggle(); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-700 hover:text-indigo-600 group"
                  >
                    {isMuted ? (
                      <>
                        <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /> Unmute Group
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /> Mute Group
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => { setMenuOpen(false); onDelete(); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm font-semibold text-red-600 group"
                  >
                    <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" /> Delete Group
                  </button>
                  <div className="h-px bg-slate-100 my-1.5 mx-3" />
                </>
              )}

              <button 
                onClick={() => { setMenuOpen(false); onLeave(); }} 
                disabled={isAdmin}
                title={isAdmin ? "Admin must transfer ownership or delete group" : ""}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition text-sm font-semibold text-slate-700 hover:text-red-600 group"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" /> Leave Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ message, isOwn, isFirst, isLast }) {
  const sender = message.sender;
  const name = sender ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim() : "User";
  const initials = getInitials(name);
  const color = getColor(message.senderId || name);

  const ownRound = `${isFirst && isLast ? "rounded-[1.25rem] rounded-br-[0.35rem]" : isFirst ? "rounded-[1.25rem] rounded-br-md" : isLast ? "rounded-[1.25rem] rounded-tr-md rounded-br-[0.35rem]" : "rounded-[1.25rem] rounded-tr-md rounded-br-md"}`;
  const otherRound = `${isFirst && isLast ? "rounded-[1.25rem] rounded-bl-[0.35rem]" : isFirst ? "rounded-[1.25rem] rounded-bl-md" : isLast ? "rounded-[1.25rem] rounded-tl-md rounded-bl-[0.35rem]" : "rounded-[1.25rem] rounded-tl-md rounded-bl-md"}`;

  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "just now";

  if (isOwn) {
    return (
      <div className={`flex items-end justify-end gap-2 ${isLast ? "mb-4" : "mb-1"}`}>
        <div className="flex flex-col items-end gap-0.5 max-w-[75%]">
          <div className={`bg-indigo-600 text-white text-[14px] px-3.5 py-2 leading-relaxed shadow-sm ${ownRound}`}>
            {message.text}
          </div>
          {isLast && <span className="text-[10px] text-gray-400 mt-0.5">{time}</span>}
        </div>
        <div className="w-7 h-7 flex-shrink-0">
          {isLast && <Avatar initials={initials} avatar={sender?.avatar} color={color} className="w-7 h-7 text-[10px]" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 ${isLast ? "mb-4" : "mb-1"}`}>
      <div className="w-7 h-7 flex-shrink-0">
        {isLast && <Avatar initials={initials} avatar={sender?.avatar} color={color} className="w-7 h-7 text-[10px]" />}
      </div>
      <div className="flex flex-col items-start gap-0.5 max-w-[75%]">
        {isFirst && (
          <div className="flex items-center gap-1 ml-1 mb-0.5">
            <span className="text-[11px] text-gray-500 font-semibold">{name}</span>
            {sender?.role === "TUTOR" && <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1 rounded">Tutor</span>}
            {sender?.role === "MENTOR" && <span className="text-[9px] bg-purple-50 text-purple-600 font-bold px-1 rounded">Mentor</span>}
          </div>
        )}
        <div className={`bg-gray-100/80 text-gray-800 text-[14px] px-3.5 py-2 leading-relaxed border border-gray-100/50 ${otherRound}`}>
          {message.text}
        </div>
        {isLast && <span className="text-[10px] text-gray-400 ml-1 mt-0.5">{time}</span>}
      </div>
    </div>
  );
}

// ── Typing Indicator ───────────────────────────────────────────────────────────

function TypingIndicator({ names }) {
  if (!names || names.length === 0) return null;
  const label = names.length === 1 ? `${names[0]} is typing` : `${names.join(", ")} are typing`;
  return (
    <div className="flex items-center gap-2 px-4 pb-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-[11px] text-slate-400 italic">{label}</span>
    </div>
  );
}

// ── Chat Input ─────────────────────────────────────────────────────────────────

function GroupChatInput({ onSend, onTyping, onStopTyping, isDisabled, placeholder }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isDisabled) return;
    onSend(text.trim());
    setText("");
    setShowEmoji(false);
    onStopTyping?.();
  };

  const handleChange = (e) => {
    if (isDisabled) return;
    setText(e.target.value);
    onTyping?.();
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100 relative z-40">
      {showEmoji && !isDisabled && (
        <div className="absolute bottom-full right-4 mb-2 shadow-2xl rounded-2xl overflow-hidden border border-slate-100 bg-white">
          <EmojiPicker onEmojiClick={(e) => setText((p) => p + e.emoji)} previewConfig={{ showPreview: false }} />
        </div>
      )}
      <div className={`flex items-end gap-2 rounded-3xl border transition px-4 py-2 ${isDisabled ? "bg-slate-100 border-slate-200 cursor-not-allowed" : "bg-slate-50 border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100"}`}>
        <button disabled={isDisabled} className="text-slate-400 hover:text-indigo-500 disabled:opacity-40 transition mb-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 flex-shrink-0">
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          disabled={isDisabled}
          placeholder={placeholder || "Message group..."}
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          className="flex-1 text-[14px] bg-transparent focus:outline-none placeholder-slate-400 resize-none py-1.5 text-slate-800 leading-snug disabled:cursor-not-allowed"
          style={{ maxHeight: "120px" }}
        />
        <button disabled={isDisabled} onClick={() => setShowEmoji(!showEmoji)} className={`transition mb-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-45 ${showEmoji ? "bg-indigo-100 text-indigo-500" : "text-slate-400 hover:text-indigo-500"}`}>
          <Smile className="w-4 h-4" />
        </button>
        <button onClick={handleSend} disabled={!text.trim() || isDisabled} className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 transition flex-shrink-0 shadow-sm mb-1">
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
      {!isDisabled && (
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
      )}
    </div>
  );
}

// ── Groups Sidebar (right panel) ───────────────────────────────────────────────

function GroupsSidebar({ forums, activeId, onSelect, onlineUserIds, activeGroup, isAdmin, onRemoveMember }) {
  const [activeTab, setActiveTab] = useState("groups"); // "groups" | "members"

  const onlineCount = (activeGroup?.members || []).filter((m) => onlineUserIds.includes(m.userId)).length;

  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 text-xs font-bold py-1.5 text-center rounded-lg transition ${activeTab === "groups" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
        >
          Groups
        </button>
        {activeGroup && (
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 text-xs font-bold py-1.5 text-center rounded-lg transition ${activeTab === "members" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Members ({(activeGroup.members || []).length})
          </button>
        )}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === "groups" ? (
          <div className="flex flex-col gap-1.5">
            {forums.map((group) => {
              const color = getColor(group.id);
              const initials = getInitials(group.firstName || group.name || "G");
              const isActive = activeId === group.id;
              const groupOnlineCount = (group.members || []).filter((m) => onlineUserIds.includes(m.userId)).length;
              return (
                <button
                  key={group.id}
                  onClick={() => onSelect(group.id)}
                  className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all text-left group ${isActive ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-50"}`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar initials={initials} avatar={group.image} color={color} className="w-8 h-8 text-[10px]" />
                    {groupOnlineCount > 0 && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? "text-indigo-700" : "text-gray-800"}`}>
                      {group.firstName || group.name || "Forum"}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {group._count?.members || (group.members || []).length} members
                      {groupOnlineCount > 0 && <span className="text-green-500"> · {groupOnlineCount} online</span>}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              <span>Member List</span>
              <span className="text-green-500 font-semibold">{onlineCount} Online</span>
            </div>
            {(activeGroup?.members || []).map((m) => {
              const u = m.user || {};
              const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User";
              const color = getColor(u.id || name);
              const initials = getInitials(name);
              const isOnline = onlineUserIds.includes(m.userId);
              const isUserAdmin = activeGroup.adminId === m.userId;

              return (
                <div key={m.userId} className="flex items-center gap-2 group/member">
                  <div className="relative">
                    <Avatar initials={initials} avatar={u.avatar} color={color} className="w-7 h-7 text-[9px]" />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-gray-800 truncate">{name}</span>
                      {isUserAdmin && (
                        <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-1 rounded uppercase tracking-wider scale-90">Admin</span>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 block -mt-0.5">{u.role}</span>
                  </div>

                  {/* Remove button (Only visible to Admin for other members) */}
                  {isAdmin && !isUserAdmin && (
                    <button
                      onClick={() => onRemoveMember(m.userId)}
                      className="opacity-0 group-hover/member:opacity-100 text-[10px] text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create Group Modal ─────────────────────────────────────────────────────────

function CreateGroupModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onCreate(name.trim(), description.trim());
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Create Group</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Group Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Masterclass"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
            <textarea
              placeholder="Group topic, guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition h-20 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-sm"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ──  Group Settings Modal ─────────────────────────────────────────────

function GroupSettingsModal({ isOpen, onClose, group, onUpdateInfo, onMuteToggle, onAddMember }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Sync state with group when modal opens
  useEffect(() => {
    if (group) {
      setName(group.firstName || group.name || "");
      setDescription(group.description || "");
      setIsMuted(group.isMuted || false);
    }
  }, [group, isOpen]);

  // Load all followers to allow adding them
  useEffect(() => {
    if (!isOpen) return;
    userService.getFollowers("me")
      .then(setAllUsers)
      .catch(console.error);
  }, [isOpen]);

  if (!isOpen || !group) return null;

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUpdateLoading(true);
    try {
      await onUpdateInfo(name.trim(), description.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleMuteChange = async (e) => {
    const val = e.target.value === "true";
    if (val !== isMuted) {
      setIsMuted(val);
      await onMuteToggle();
    }
  };

  // Filter out users already in group
  const memberIds = (group.members || []).map((m) => m.userId);
  const filteredUsers = allUsers.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && !memberIds.includes(u.id);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between mb-4 flex-shrink-0 border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />  Group Settings
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 min-h-0">
          {/* Section 1: Group Profile Settings */}
          <form onSubmit={handleSaveInfo} className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Group Information</h4>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Group Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition h-16 resize-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={updateLoading || (name === (group.firstName || group.name) && description === (group.description || ""))}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-sm"
            >
              {updateLoading ? "Saving Changes..." : "Save Group Info"}
            </button>
          </form>

          {/* Section 2: Group Permissions ( settings) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest font-semibold">Group Permissions</h4>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Send Messages</label>
              <select
                value={isMuted ? "true" : "false"}
                onChange={handleMuteChange}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 transition font-medium cursor-pointer"
              >
                <option value="false">All participants (Open Group)</option>
                <option value="true">Only admins (Muted Group)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Choose who can send messages to this group chat.</span>
            </div>
          </div>

          {/* Section 3: Add Participants */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Add Participants</h4>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 transition"
              />
            </div>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto min-h-[50px] border border-slate-200 rounded-xl p-2 bg-white">
              {filteredUsers.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-4">No users found to add</p>
              ) : (
                filteredUsers.map((u) => {
                  const uName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email;
                  const initials = getInitials(uName);
                  const color = getColor(u.id);

                  return (
                    <div key={u.id} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-lg transition">
                      <div className="flex items-center gap-2">
                        <Avatar initials={initials} avatar={u.avatar} color={color} className="w-7 h-7 text-[9px]" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{uName}</p>
                          <p className="text-[9px] text-slate-400">{u.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await onAddMember(u.id);
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-600 text-[10px] font-bold rounded-lg transition"
                      >
                        Add
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main GroupsInterface ───────────────────────────────────────────────────────

export default function GroupsInterface() {
  const { user } = useAuth();
  const { socket, isConnected, onlineUsers } = useSocket();

  const [forums, setForums] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const typingTimers = useRef({});
  const stopTypingTimer = useRef(null);
  const bottomRef = useRef(null);

  // Determine role rights
  const canCreate = user?.role === "TUTOR" || user?.role === "MENTOR" || user?.role === "ADMIN";

  // ── Load all forums ──────────────────────────────────────────────
  const loadForums = () => {
    setIsLoading(true);
    forumService.getAllForums()
      .then((data) => {
        setForums(data);
        if (data.length > 0 && !activeId) setActiveId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadForums();
  }, []);

  // ── Join room, load history, listen for events ───────────────────
  useEffect(() => {
    if (!activeId || !socket) return;

    socket.emit("joinForum", activeId);

    forumService.getMessages(activeId)
      .then(setMessages)
      .catch(console.error);

    const handlePreviousMessages = (msgs) => setMessages(msgs);

    const handleNewMessage = (msg) => {
      if (msg.forumId === activeId) {
        setMessages((prev) => [...prev, msg]);
        if (msg.senderId) {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[msg.senderId];
            return next;
          });
        }
      }
    };

    const handleUserTyping = ({ userName, userId }) => {
      if (userId === user?.id) return;
      setTypingUsers((prev) => ({ ...prev, [userName]: true }));
      if (typingTimers.current[userName]) clearTimeout(typingTimers.current[userName]);
      typingTimers.current[userName] = setTimeout(() => {
        setTypingUsers((prev) => { const n = { ...prev }; delete n[userName]; return n; });
      }, 3000);
    };

    const handleUserStoppedTyping = ({ userName }) => {
      setTypingUsers((prev) => { const n = { ...prev }; delete n[userName]; return n; });
      if (typingTimers.current[userName]) clearTimeout(typingTimers.current[userName]);
    };

    const handleForumMuted = ({ forumId }) => {
      if (forumId === activeId) {
        setForums((prev) =>
          prev.map((f) => (f.id === forumId ? { ...f, isMuted: true } : f))
        );
      }
    };

    const handleForumUnmuted = ({ forumId }) => {
      if (forumId === activeId) {
        setForums((prev) =>
          prev.map((f) => (f.id === forumId ? { ...f, isMuted: false } : f))
        );
      }
    };

    socket.on("previousMessages", handlePreviousMessages);
    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    socket.on("forumMuted", handleForumMuted);
    socket.on("forumUnmuted", handleForumUnmuted);

    return () => {
      socket.emit("leaveForum", activeId);
      socket.off("previousMessages", handlePreviousMessages);
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.off("forumMuted", handleForumMuted);
      socket.off("forumUnmuted", handleForumUnmuted);
      Object.values(typingTimers.current).forEach(clearTimeout);
      typingTimers.current = {};
    };
  }, [activeId, socket, user?.id]);

  // ── Auto-scroll ──────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ── Action Handlers ────────────────────────────────────────

  const activeGroup = forums.find((f) => f.id === activeId);
  const isAdmin = activeGroup?.adminId === user?.id;
  const isMuted = activeGroup?.isMuted;

  const handleSend = (text) => {
    if (!socket || !activeId) return;
    socket.emit("sendMessage", { forumId: activeId, text, type: "TEXT" });
  };

  const handleTyping = () => {
    if (!socket || !activeId || (isMuted && !isAdmin)) return;
    socket.emit("typing", {
      forumId: activeId,
      userName: user?.name || `${user?.firstName || "User"}`,
      userId: user?.id,
    });
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
    stopTypingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        forumId: activeId,
        userName: user?.name || `${user?.firstName || "User"}`,
      });
    }, 2000);
  };

  const handleStopTyping = () => {
    if (!socket || !activeId) return;
    socket.emit("stopTyping", {
      forumId: activeId,
      userName: user?.name || `${user?.firstName || "User"}`,
    });
    if (stopTypingTimer.current) clearTimeout(stopTypingTimer.current);
  };

  const handleCreate = async (name, description) => {
    const newGroup = await forumService.createForum({ name, description });
    setForums((prev) => [newGroup, ...prev]);
    setActiveId(newGroup.id);
  };

  const handleUpdateInfo = async (name, description) => {
    if (!activeId || !isAdmin) return;
    const updated = await forumService.updateForum(activeId, { name, description });
    setForums((prev) =>
      prev.map((f) => (f.id === activeId ? { ...f, firstName: updated.firstName, description: updated.description } : f))
    );
  };

  const handleAddMember = async (targetUserId) => {
    if (!activeId || !isAdmin) return;
    const newMember = await forumService.addMember(activeId, targetUserId);
    setForums((prev) =>
      prev.map((f) => {
        if (f.id === activeId) {
          const nextMembers = [...(f.members || []), newMember];
          return {
            ...f,
            members: nextMembers,
            _count: { ...f._count, members: nextMembers.length }
          };
        }
        return f;
      })
    );
  };

  const handleMuteToggle = async () => {
    if (!activeId || !isAdmin) return;
    try {
      if (isMuted) {
        await forumService.unmuteForum(activeId);
        if (socket) socket.emit("unmuteForum", activeId);
        setForums((prev) => prev.map((f) => f.id === activeId ? { ...f, isMuted: false } : f));
      } else {
        await forumService.muteForum(activeId);
        if (socket) socket.emit("muteForum", activeId);
        setForums((prev) => prev.map((f) => f.id === activeId ? { ...f, isMuted: true } : f));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!activeId || !isAdmin) return;
    try {
      await forumService.removeMember(activeId, memberId);
      setForums((prev) =>
        prev.map((f) => {
          if (f.id === activeId) {
            const nextMembers = (f.members || []).filter((m) => m.userId !== memberId);
            return {
              ...f,
              members: nextMembers,
              _count: { ...f._count, members: nextMembers.length }
            };
          }
          return f;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeave = async () => {
    if (!activeId) return;
    try {
      await forumService.leaveForum?.(activeId);
      setForums((prev) => prev.filter((f) => f.id !== activeId));
      const remaining = forums.filter((f) => f.id !== activeId);
      setActiveId(remaining[0]?.id || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!activeId || !isAdmin) return;
    if (!confirm("Are you sure you want to permanently delete this group?")) return;
    try {
      await forumService.deleteForum(activeId);
      setForums((prev) => prev.filter((f) => f.id !== activeId));
      const remaining = forums.filter((f) => f.id !== activeId);
      setActiveId(remaining[0]?.id || null);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Derived State ────────────────────────────────────────────────

  const typingNames = Object.keys(typingUsers);
  const inputDisabled = isMuted && !isAdmin;
  const inputPlaceholder = inputDisabled
    ? "🔇 Only admins can send messages to this group"
    : "Write a message...";

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)] overflow-hidden">
      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
        {/* Banner with Create button if user is Tutor/Mentor */}
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight">Groups</h2>
              <p className="text-[11px] text-slate-400 font-semibold">Live messaging forums & modules</p>
            </div>
          </div>
          {canCreate && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-indigo-100"
            >
              <Plus className="w-3.5 h-3.5" /> Create Group
            </button>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-slate-200/40 bg-white">
          {activeGroup ? (
            <>
              <GroupChatHeader
                group={activeGroup}
                isConnected={isConnected}
                onlineUserIds={onlineUsers}
                onLeave={handleLeave}
                isAdmin={isAdmin}
                isMuted={isMuted}
                onMuteToggle={handleMuteToggle}
                onDelete={handleDelete}
                onSettingsClick={() => setIsSettingsOpen(true)}
              />

              {/* Message list */}
              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col bg-white">
                {isMuted && (
                  <div className="mx-auto my-2 px-3 py-1 bg-red-50 border border-red-100 text-red-600 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                    <ShieldAlert className="w-3.5 h-3.5" /> This group has been muted by the admin. Only admins can send messages.
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <MessageCircle className="w-10 h-10 opacity-30" />
                    <p className="text-sm font-semibold">No messages yet — start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const prev = messages[i - 1];
                    const next = messages[i + 1];
                    const isFirst = !prev || prev.senderId !== msg.senderId;
                    const isLast = !next || next.senderId !== msg.senderId;
                    return (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.senderId === user?.id}
                        isFirst={isFirst}
                        isLast={isLast}
                      />
                    );
                  })
                )}

                <TypingIndicator names={typingNames} />
                <div ref={bottomRef} />
              </div>

              <GroupChatInput
                onSend={handleSend}
                onTyping={handleTyping}
                onStopTyping={handleStopTyping}
                isDisabled={inputDisabled}
                placeholder={inputPlaceholder}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Users className="w-12 h-12 opacity-25" />
              <p className="text-sm font-bold">Select a group to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar (Groups & Member list) ── */}
      <GroupsSidebar
        forums={forums}
        activeId={activeId}
        onSelect={setActiveId}
        onlineUserIds={onlineUsers}
        activeGroup={activeGroup}
        isAdmin={isAdmin}
        onRemoveMember={handleRemoveMember}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      {/* Group Settings Modal (Admins only) */}
      <GroupSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        group={activeGroup}
        onUpdateInfo={handleUpdateInfo}
        onMuteToggle={handleMuteToggle}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
