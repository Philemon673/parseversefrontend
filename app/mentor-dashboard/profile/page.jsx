"use client";

import { useState } from "react";
import { Camera, ChevronRight, Trash2, HelpCircle, Users, UserPlus, BadgeCheck, BookOpen, MessageCircle } from "lucide-react";

// ── Tab content components ─────────────────────────────────────────────────
// Place DetailsTab, ResourcesTab, SchedulesTab, PaymentTab in the same folder
// and adjust the import paths to match your project structure.
import DetailsTab from "./details";
import ResourcesTab from "./resources";
import SchedulesTab from "./schedule";
import PaymentTab from "./payment";

const TABS = ["Personal Details", "Details", "Resources", "Schedules", "Payment"];

// ── Left-panel icon helpers ────────────────────────────────────────────────
function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M2 19h20M3 19l2-9 4.5 4.5L12 6l2.5 8.5L19 10l2 9"
        stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5" r="1.5" fill="#f59e0b" />
      <circle cx="3" cy="10" r="1.5" fill="#f59e0b" />
      <circle cx="21" cy="10" r="1.5" fill="#f59e0b" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M8 21h8M12 17v4M6 3H3v4a4 4 0 0 0 4 4M18 3h3v4a4 4 0 0 1-4 4M6 3h12v6a6 6 0 0 1-12 0V3z"
        stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  { icon: <Users className="w-4 h-4 text-purple-500" />, label: "Mentor", danger: false },
  {
    icon: <BookOpen size={14} />,
    label: "View Courses",
    danger: false,
    primary: true,
    onClick: () => { window.location.href = "/courses"; },
  },
];

const supportItems = [
  { icon: <Users className="w-4 h-4 text-purple-500" />, label: "Become a Mentor", danger: false },
  { icon: <HelpCircle className="w-4 h-4 text-blue-500" />, label: "Support", danger: false },
  { icon: <UserPlus className="w-4 h-4 text-orange-400" />, label: "Invite friend", danger: false },
  { icon: <Trash2 className="w-4 h-4 text-white" />, label: "Delete Account", danger: true },
];

// ── Personal Details form (inline in main file) ────────────────────────────
function PersonalDetailsTab({ avatarSrc, onAvatarChange }) {
  const [form, setForm] = useState({
    fullName: "Ekonde Roland",
    email: "hellopixiency@gmail.com",
    address: "127 Gobadia chittagong, Bangladesh",
    city: "Chittagong",
    state: "Chittagong",
    zip: "3200",
    country: "Bangladesh",
  });
  const [saved, setSaved] = useState(false);

  const update = (key) =>
    (e) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-gray-100">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-2xl font-bold text-white select-none">
              ER
            </div>
          )}
          <label className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow cursor-pointer hover:bg-white transition">
            <Camera className="w-3 h-3 text-gray-600" />
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Row 1 */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={update("fullName")}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={update("address")}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        {/* Row 3 */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">City</label>
            <select
              value={form.city}
              onChange={update("city")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            >
              {["Chittagong", "Dhaka", "Sylhet"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">State / Province</label>
            <select
              value={form.state}
              onChange={update("state")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            >
              {["Chittagong", "Dhaka"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Zip Code</label>
            <input
              type="text"
              value={form.zip}
              onChange={update("zip")}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Country</label>
            <select
              value={form.country}
              onChange={update("country")}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            >
              {["Bangladesh", "India", "USA", "UK", "Canada"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1 items-center">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow"
          >
            Save profile
          </button>
          <button
            onClick={() =>
              setForm({
                fullName: "Ekonde Roland",
                email: "hellopixiency@gmail.com",
                address: "127 Gobadia chittagong, Bangladesh",
                city: "Chittagong",
                state: "Chittagong",
                zip: "3200",
                country: "Bangladesh",
              })
            }
            className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          {saved && (
            <span className="flex text-xs text-green-600 font-medium animate-pulse">
              <BadgeCheck className="w-5 h-5 text-green-600" /> Profile saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ProfilePage ───────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Personal Details");
  const [avatarSrc, setAvatarSrc] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarSrc(url);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Personal Details": return <PersonalDetailsTab avatarSrc={avatarSrc} onAvatarChange={handleAvatarChange} />;
      case "Details": return <DetailsTab />;
      case "Resources": return <ResourcesTab />;
      case "Schedules": return <SchedulesTab />;
      case "Payment": return <PaymentTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3fa] p-4">


      <div className="flex gap-5">
        {/* ── Left Panel ──────────────────────────────────────────────────── */}
        <div className="w-[240px] flex-shrink-0">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

            {/* Cover / Avatar */}
            <div className="relative h-28 bg-gradient-to-br from-indigo-400 to-purple-500">
              {/* Replace with <img src={Profile.src} … /> if you have the asset */}
              <div className="w-full h-full flex items-end pb-2 px-3">
                <div className="flex items-end gap-2">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold text-indigo-600 shadow overflow-hidden">
                    {avatarSrc ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" /> : "ER"}
                  </div>
                  <p className="text-white font-bold text-sm drop-shadow mb-0.5">Ekonde Roland</p>
                </div>
              </div>
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow">
                <Camera className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            {/* Message button */}
            <div className="px-3 pt-2 pb-1">
              <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition">
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-around px-3 py-2 border-b border-gray-100">
              <div className="text-center">
                <span className="text-gray-900 font-bold text-sm px-1.5 py-0.5 bg-red-100 rounded-full">01</span>
                <p className="text-gray-400 text-[10px] mt-0.5">In Progress</p>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <div className="text-center">
                <span className="text-gray-900 font-bold text-sm px-1.5 py-0.5 bg-green-200 rounded-full">05</span>
                <p className="text-gray-400 text-[10px] mt-0.5">Completed</p>
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
                {roleItems.map(({ icon, label, danger, primary, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-medium transition ${danger
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : primary
                          ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
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
                    className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-medium transition ${danger
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "hover:bg-gray-50 text-gray-700"
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

        {/* ── Right Panel ─────────────────────────────────────────────────── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[520px]">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Profile Setting</h2>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-t-lg transition ${activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>{renderTab()}</div>
        </div>
      </div>
    </div>
  );
}