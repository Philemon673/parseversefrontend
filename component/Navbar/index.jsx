"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const tabs = ["For You", "Trending", "Top"];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
      {/* Left — page title + tabs */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">Home</h1>
        <div className="flex items-center gap-6 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-0.5 font-medium transition ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Right — user info + bell */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            MN
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">Martin Nel</div>
            <div className="text-xs text-purple-500 font-medium">VIP Member</div>
          </div>
        </div>

        <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <Bell className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
}