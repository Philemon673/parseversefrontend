"use client";

import { useState, useEffect } from "react";
import { Bell, AtSign, RefreshCw, CheckCheck } from "lucide-react";
import ScrollToTop from "../../../screens/scroll";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";

const tabs = ["All", "Unread", "System"];

// ── Helper ────────────────────────────────────────────────────────────────────
function formatTime(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

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
  if (props.tab === "Unread") return <AtSign className="w-3.5 h-3.5" />;
  return <RefreshCw className="w-3.5 h-3.5" />;
}

// ── Notification Card ─────────────────────────────────────────────────────────

function NotificationCard({ notif, onMarkRead }) {
  return (
    <div className={"flex items-start gap-3 p-4 rounded-2xl border transition group " +
      (notif.isRead ? "bg-white border-gray-100" : "bg-indigo-50/60 border-indigo-100")
    }>
      {/* Avatar + icon badge */}
      <div className="relative flex-shrink-0">
        <Avatar
          initials={notif.type === "SYSTEM" ? "SYS" : "PV"}
          className="w-10 h-10 text-xs"
          color="from-indigo-400 to-purple-500"
        />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm bg-blue-500">
          <Bell className="w-2.5 h-2.5 text-white" />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug font-semibold">
          {notif.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
          {notif.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-gray-400">{formatTime(notif.createdAt)}</span>
          {!notif.isRead && (
            <button
              onClick={() => onMarkRead(notif.id)}
              className="text-[10px] text-indigo-500 hover:underline font-medium"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      {/* Unread dot */}
      <div className="flex-shrink-0 mt-1">
        {!notif.isRead && (
          <span className="w-2 h-2 rounded-full bg-indigo-500 block" />
        )}
      </div>
    </div>
  );
}

// ── Main Notifications Page ───────────────────────────────────────────────────

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user]);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await api.get(`/notifications/user/${user.id}`);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.isRead;
    if (activeTab === "System") return n.type === "SYSTEM";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleMarkRead(id) {
    try {
      await api.get(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  async function handleMarkAllRead() {
    try {
      await Promise.all(
        notifications.filter((n) => !n.isRead).map((n) => api.get(`/notifications/read/${n.id}`))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  }

  return (
    <div className="p-2 bg-[#f2f3fa] min-h-screen">
      <ScrollToTop />
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
            </div>
          </div>

          {/* Notification List */}
          <div className="p-4 flex flex-col gap-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <RefreshCw className="w-6 h-6 mb-3 animate-spin" />
                <p className="text-sm font-medium">Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <Bell className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium">No notifications</p>
              </div>
            ) : (
              filtered.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notif={notif}
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