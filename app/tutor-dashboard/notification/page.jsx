"use client";

import { useState } from "react";
import { Trash2, Bell, AtSign, RefreshCw, CheckCheck } from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const initialNotifications = [
  {
    id: 1,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "pinned your post",
    detail: "Course Summary. Sirs teach Python for Beginners!",
    time: "1h ago",
    icon: "📌",
    read: false,
    tab: "Mentions",
  },
  {
    id: 2,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "gave you feedback",
    detail: "Gating. Carbon, added a new slide meter - op m",
    time: "1h ago",
    icon: "⭐",
    read: false,
    tab: "Updates",
  },
  {
    id: 3,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "replied to your comment",
    detail: "Accassthsion; hotu: funspll® · Paligrtntenting 1h ago",
    time: "1h ago",
    icon: "💬",
    read: false,
    tab: "Mentions",
  },
  {
    id: 4,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "approved course enrollment",
    detail: "Caneed inbalcs am JavaScript Basics",
    time: "2h ago",
    icon: "✅",
    read: true,
    tab: "Updates",
  },
  {
    id: 5,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "posted general resources!",
    detail: "Setting References you can find neat various stage chewit ar op 38 drgts.",
    time: "3h ago",
    icon: "📚",
    read: true,
    tab: "Updates",
  },
  {
    id: 6,
    author: "Mashok Khan",
    initials: "MK",
    color: "from-indigo-400 to-purple-500",
    action: "added a new resource!",
    detail: "Han napnedia clarentionly iposren cove cove. wfient 8 mome. aJ. AGO races.",
    time: "4h ago",
    icon: "🆕",
    read: true,
    tab: "Updates",
  },
];

const tabs = ["All", "Mentions", "Updates"];

// ── Sub Components ────────────────────────────────────────────────────────────

function Avatar(props) {
  const color = props.color || "from-indigo-400 to-purple-500";
  const className = props.className || "";
  return (
    <div className={"rounded-full bg-gradient-to-br " + color + " flex items-center justify-center text-white font-bold flex-shrink-0 " + className}>
      {props.initials}
    </div>
  );
}

function TabIcon(props) {
  if (props.tab === "All") return <Bell className="w-3.5 h-3.5" />;
  if (props.tab === "Mentions") return <AtSign className="w-3.5 h-3.5" />;
  return <RefreshCw className="w-3.5 h-3.5" />;
}

// ── Notification Card ─────────────────────────────────────────────────────────

function NotificationCard(props) {
  const notif = props.notif;
  const onDelete = props.onDelete;
  const onMarkRead = props.onMarkRead;

  return (
    <div className={"flex items-start gap-3 p-4 rounded-2xl border transition group " +
      (notif.read ? "bg-white border-gray-100" : "bg-indigo-50/60 border-indigo-100")
    }>
      {/* Avatar + icon badge */}
      <div className="relative flex-shrink-0">
        <Avatar initials={notif.initials} className="w-10 h-10 text-xs" color={notif.color} />
        <span className="absolute -bottom-1 -right-1 text-sm">{notif.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug">
          <span className="font-semibold">{notif.author}</span>{" "}
          <span className="text-gray-600">{notif.action}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
          {notif.detail}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-gray-400">{notif.time}</span>
          {!notif.read && (
            <button
              onClick={() => onMarkRead(notif.id)}
              className="text-[10px] text-indigo-500 hover:underline font-medium"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      {/* Right — unread dot + delete */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        {!notif.read && (
          <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />
        )}
        <button
          onClick={() => onDelete(notif.id)}
          className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500"
          title="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Notifications Page ───────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    return n.tab === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleDelete(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleMarkRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleDeleteAll() {
    setNotifications([]);
  }

  return (
    <div className="p-2 bg-[#f2f3fa] min-h-screen">
      <div className="max-w-full-screen mx-auto flex flex-col gap-5">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Stay updated on the latest activities and announcements.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Tabs + actions */}
          <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-gray-100">
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={"flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition " +
                    (activeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-400 hover:text-gray-600")
                  }
                >
                  <TabIcon tab={tab} />
                  {tab}
                  {tab === "All" && unreadCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark All as Read
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="p-4 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <Bell className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notif={notif}
                  onDelete={handleDelete}
                  onMarkRead={handleMarkRead}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}