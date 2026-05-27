"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notification-context";
import Link from "next/link";

const navItems = [
  { label: "Home",          href: "/tutor-dashboard/Home" },
  { label: "Courses",       href: "/tutor-dashboard/courses" },
  { label: "Profile",       href: "/tutor-dashboard/profile" },
  { label: "Chat",          href: "/tutor-dashboard/chat" },
  { label: "Sessions",      href: "/tutor-dashboard/sessions" },
  { label: "Notifications", href: "/tutor-dashboard/notification" },
];

export function activeNavLabel(items, defaultLabel = "Home") {
  const pathname = usePathname();
  const activeItem = items.find((item) => pathname.startsWith(item.href));
  return activeItem ? activeItem.label : defaultLabel;
}

export default function Navbar() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const pageTitle = activeNavLabel(navItems, "Home");

  const initials =
    user?.firstName
      ? (user.firstName[0] + (user.lastName ? user.lastName[0] : "")).toUpperCase()
      : "TU";

  const displayName =
    user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Tutor User";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
      {/* Left — page title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right — user info + bell */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            {initials}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">{displayName}</div>
            <div className="text-xs text-purple-500 font-medium">
              {user?.role ?? "TUTOR"}
            </div>
          </div>
        </div>

        <Link
          href="/tutor-dashboard/notification"
          className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <Bell className="w-4 h-4 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
