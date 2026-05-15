"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ArrowLeft } from "lucide-react";

const tabs = [];

const navItems = [
  { label: "Home", href: "/student-dashboard/Home" },
  { label: "Courses", href: "/student-dashboard/courses" },
  { label: "Profile", href: "/student-dashboard/profile" },
  { label: "Chat", href: "/student-dashboard/chat" },
  { label: "Groups", href: "/student-dashboard/groups" },
  { label: "Notification", href: "/student-dashboard/notification" },
  { label: "Request", href: "/student-dashboard/request" },
  { label: "Search Results", href: "/student-dashboard/searchresults" },
  { label: "Course Details", href: "/student-dashboard/coursedetails" },
  { label: "Sessions", href: "/student-dashboard/sessions" },
];

// Named export for helper function
export function activeNavlabel(navItems, defaultItems = "Home") {
  const pathname = usePathname();
  const activeItem = navItems.find(item => pathname.startsWith(item.href));
  return activeItem ? activeItem.label : defaultItems;
}

// Default export for Navbar component
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("For You");
  const pageTitle = activeNavlabel(navItems, "Home"); // dynamic title based on path

  // Check if we are on one of the searchbar tag pages
  const isTagPage = 
    pathname === "/student-dashboard/Home/courses" || 
    pathname === "/student-dashboard/Home/Resources" || 
    pathname === "/student-dashboard/Home/live";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
      {/* Left — page title + tabs */}
      <div className="flex flex-col gap-1">
        {isTagPage ? (
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        ) : (
          <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        )}
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
            LA
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">Lora Azuwesi</div>
            <div className="text-xs text-purple-500 font-bold tracking-wider">STUDENT</div>
          </div>
        </div>

        <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <Bell className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
}