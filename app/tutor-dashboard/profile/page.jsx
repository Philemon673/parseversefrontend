"use client";

import Profile from "@/assets/profile1.jpg";
import { useState } from "react";
import { Camera, ChevronRight, Trash2, HelpCircle, Users, UserPlus } from "lucide-react";

const tabs = ["Personal Details", "Notification", "Privacy", "Payment"];

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M2 19h20M3 19l2-9 4.5 4.5L12 6l2.5 8.5L19 10l2 9" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5" r="1.5" fill="#f59e0b" />
      <circle cx="3" cy="10" r="1.5" fill="#f59e0b" />
      <circle cx="21" cy="10" r="1.5" fill="#f59e0b" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M8 21h8M12 17v4M6 3H3v4a4 4 0 0 0 4 4M18 3h3v4a4 4 0 0 1-4 4M6 3h12v6a6 6 0 0 1-12 0V3z" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#6366f1" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="#6366f1" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="#6366f1" />
      <path d="M12 3V1M12 23v-2M3 12H1M23 12h-2" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="15" r="5" stroke="#ef4444" strokeWidth="2" />
      <path d="M8.5 8.5 7 3h10l-1.5 5.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v2l1 1" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const achievements = [
  { icon: <CrownIcon />, bg: "bg-yellow-50" },
  { icon: <TrophyIcon />, bg: "bg-yellow-50" },
  { icon: <TargetIcon />, bg: "bg-indigo-50" },
  { icon: <MedalIcon />, bg: "bg-red-50" },
];

const roleItems = [
  {
    icon: <Users className="w-4 h-4 text-purple-500" />,
    label: "Tutor",
    danger: false,
  },
];

const supportItems = [
  { icon: <Users className="w-4 h-4 text-purple-500" />, label: "Become a Mentor", danger: false },
  { icon: <HelpCircle className="w-4 h-4 text-blue-500" />, label: "Support", danger: false },
  { icon: <UserPlus className="w-4 h-4 text-orange-400" />, label: "Invite friend", danger: false },
  { icon: <Trash2 className="w-4 h-4 text-white" />, label: "Delete Account", danger: true },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Personal Details");

  return (
    <div className="flex gap-5 p-4 bg-gray-50">
      {/* ── Left Panel ─────────────────────────────────────────────── */}
      <div className="w-[200px] flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

          {/* Cover / Avatar */}
          <div className="relative h-28 bg-gradient-to-br from-gray-200 to-gray-300">
            <img src={Profile.src} alt="profile" className="w-full h-full object-cover" />
            <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow">
              <Camera className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <div className="absolute bottom-2 left-3">
              <p className="text-white font-bold text-sm drop-shadow">Mashok Khan</p>
              <span className="flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-0.5">
                ▶ VIP
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around px-3 py-2 border-b border-gray-100">
            <div className="text-center">
              <span className="text-gray-900 font-bold text-sm">08</span>
              <p className="text-gray-400 text-[10px]">In Progress</p>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div className="text-center">
              <span className="text-gray-900 font-bold text-sm">23</span>
              <p className="text-gray-400 text-[10px]">Completed</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-gray-700 text-xs font-semibold mb-1.5">Achievements</p>
            <div className="flex gap-1.5">
              {achievements.map(({ icon, bg }, i) => (
                <div key={i} className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-gray-700 text-xs font-semibold mb-1">Role</p>
            <div className="flex flex-col gap-0.5">
              {roleItems.map(({ icon, label, danger }) => (
                <button
                  key={label}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-medium transition ${
                    danger ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">{icon}{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="px-3 py-2">
            <p className="text-gray-700 text-xs font-semibold mb-1">Support</p>
            <div className="flex flex-col gap-0.5">
              {supportItems.map(({ icon, label, danger }) => (
                <button
                  key={label}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-medium transition ${
                    danger ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">{icon}{label}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────────────────── */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Profile Setting</h2>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 mb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Personal Details" && (
          <div className="flex gap-4">
            {/* Avatar upload */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-gray-100">
                <img src={Profile.src} alt="avatar" className="w-full h-full object-cover" />
                <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow">
                  <Camera className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input type="text" defaultValue="Mashok Khan" className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Email address</label>
                  <input type="email" defaultValue="hellopixiency@gmail.com" className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Address</label>
                <input type="text" defaultValue="127 Gobadia chittagong, Bangladesh" className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">City</label>
                  <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white">
                    <option>Chittagong</option>
                    <option>Dhaka</option>
                    <option>Sylhet</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">State/Province</label>
                  <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white">
                    <option>Chittagong</option>
                    <option>Dhaka</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Zip Code</label>
                  <input type="text" defaultValue="3200" className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Country</label>
                  <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white">
                    <option>Bangladesh</option>
                    <option>India</option>
                    <option>USA</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow">
                  Save profile
                </button>
                <button className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "Personal Details" && (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            {activeTab} settings coming soon...
          </div>
        )}
      </div>
    </div>
  );
}