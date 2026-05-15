"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarBg from "@/assets/contentsider.png";
import {
  Home,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/student-dashboard/Home" },
  { icon: BookOpen, label: "Course", href: "/student-dashboard/courses" },
  { icon: FolderOpen, label: "Profile", href: "/student-dashboard/profile" },
  { icon: MessageCircle, label: "Groups", href: "/student-dashboard/groups" },
  { icon: MessageCircle, label: "Chat", href: "/student-dashboard/chat" },
  { icon: Bell, label: "Notifications", href: "/student-dashboard/notification", badge: 2 },
  { icon: Settings, label: "Resquest", href: "/student-dashboard/request" },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Determine which nav item is active based on pathname
 const getActiveLabel = () => {
    //  sort by href length descending — most specific path matches first
    const sorted = [...navItems].sort((a, b) => b.href.length - a.href.length);
    const activeItem = sorted.find((item) => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : "Home";
  };

  const active = getActiveLabel();

  return (
    <aside
      className="w-[280px] flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{
        backgroundImage: `url(${SidebarBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-indigo-950/40" />

      <div className="relative z-10 flex flex-col h-full py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
            PV
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">ParseVerse</div>
            <div className="text-purple-300 text-xs">Learn From Home</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, badge, href }) => {
            const isActive = active === label;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white backdrop-blur-sm shadow"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white" />}
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="mt-auto mx-2 rounded-2xl bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-sm border border-white/20 p-4 text-center shadow-xl">
          <p className="text-white font-semibold text-sm">Upgrade to PRO</p>
          <p className="text-purple-200 text-xs mb-3">for more resources.</p>
          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-xs font-bold hover:opacity-90 transition shadow">
            Upgrade Now
          </button>
        </div>

        {/* Logout */}
        <div className="pt-4 mt-4 mx-2 pb-2">
          <button className="w-full flex items-center px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500 hover:border-red-400 transition-all duration-300 text-sm font-semibold text-white/90 hover:text-white group shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors mr-3">
              <LogOut className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}