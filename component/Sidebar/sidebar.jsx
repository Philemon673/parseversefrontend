"use client";

import { useState } from "react";
import SidebarBg from "@/assets/sidebar-bg.png";
import {
  Home,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Bell,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: BookOpen, label: "Course" },
  { icon: FolderOpen, label: "Resources" },
  { icon: MessageCircle, label: "Chat" },
  { icon: Bell, label: "Notifications", badge: 2 },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Home");

  return (
    <aside
      className="w-[280px] flex-shrink-0 flex flex-col h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${SidebarBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-indigo-950/40" />

      <div className="relative z-10 flex flex-col h-full py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
            PV
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">
              ParseVerse
            </div>
            <div className="text-purple-300 text-xs">Learn From Home</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, badge }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? "bg-white/20 text-white backdrop-blur-sm shadow"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white" />
                )}
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        <div className="mt-auto mx-2 rounded-2xl bg-gradient-to-br from-purple-600/80 to-indigo-700/80 backdrop-blur-sm border border-white/20 p-4 text-center shadow-xl">
          <div className="text-2xl mb-1"></div>
          <p className="text-white font-semibold text-sm">Upgrade to PRO</p>
          <p className="text-purple-200 text-xs mb-3">for more resources.</p>
          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold hover:opacity-90 transition shadow">
            Upgrade Now
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 pt-5 border-t border-white/20 mt-5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              RK
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Rajib Kumar</div>
            <div className="text-green-400 text-xs">● Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}