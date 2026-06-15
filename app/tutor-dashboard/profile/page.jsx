"use client";

import { useState, useMemo, useEffect } from "react";
import { Country, State } from "country-state-city";
import {
  Camera, ChevronRight, Trash2, HelpCircle, Users, UserPlus, BadgeCheck,
  BookOpen, MessageCircle, Edit3, Check, X, User, Mail, MapPin,
  Building2, Map, Globe, Tags, Sparkles, Plus, Phone,
} from "lucide-react";
import { userService } from "@/lib/userService";
import { useRouter } from "next/navigation";

import DetailsTab from "./details";
import ResourcesTab from "./resources";
import SchedulesTab from "./schedule";
import PaymentTab from "./payment";

// ── Pre-load all countries once ──────────────────────────────────────────────
const ALL_COUNTRIES = Country.getAllCountries();

const TABS = ["Personal Details", "Details", "Resources", "Schedules", "Payment"];

// ── Icon helpers ─────────────────────────────────────────────────────────────
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

const defaultAchievements = [
  { icon: <CrownIcon />, bg: "bg-yellow-50", tooltip: "New Member" }
];

const getRoleItems = (rolePrefix) => [
  { icon: <Users className="w-4 h-4 text-purple-500" />, label: "Tutor", danger: false },
  {
    icon: <BookOpen size={14} />,
    label: "View Courses",
    danger: false,
    primary: true,
    onClick: () => { window.location.href = `/${rolePrefix}-dashboard/courses`; },
  },
];

const supportItems = [
  { icon: <HelpCircle className="w-4 h-4 text-blue-500" />, label: "Support", danger: false },
  { icon: <UserPlus className="w-4 h-4 text-orange-400" />, label: "Invite friend", danger: false },
  { icon: <Trash2 className="w-4 h-4 text-white" />, label: "Delete Account", danger: true },
];

// ── PersonalDetailsTab ───────────────────────────────────────────────────────
function PersonalDetailsTab({ user, isLoading, onProfileUpdate, avatarSrc, onAvatarChange }) {
  const defaultCountry = ALL_COUNTRIES.find((c) => c.isoCode === "CM");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    countryCode: "CM",
    country: "Cameroon",
    dialCode: "237",
    state: "",
    interests: [],
    phoneNumber: "",
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...form, interests: [] });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [newTag, setNewTag] = useState("");

  // ── Sync form & draft when user data loads or changes ──
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      // Resolve country object — try by name first, then isoCode, then fall back to Cameroon
      const countryObj =
        ALL_COUNTRIES.find((c) => c.name === user.country) ||
        ALL_COUNTRIES.find((c) => c.isoCode === user.country) ||
        defaultCountry;

      const newForm = {
        fullName,
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        countryCode: countryObj?.isoCode || "CM",
        country: countryObj?.name || user.country || "Cameroon",
        dialCode: countryObj?.phonecode || "237",
        state: user.state || "",
        interests: user.interests || [],
        phoneNumber: user.phone || user.phoneNumber || "",
      };

      setForm(newForm);
      setDraft({ ...newForm, interests: [...newForm.interests] });
    }
  }, [user]);

  // ── Derive state list from draft's active countryCode ──
  const stateList = useMemo(
    () => State.getStatesOfCountry(draft.countryCode),
    [draft.countryCode]
  );

  // ── Generic draft field updater ──
  const updateDraft = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  // ── Country change: update isoCode, name, dialCode, and reset state ──
  const handleCountryChange = (e) => {
    const isoCode = e.target.value;
    const countryObj = ALL_COUNTRIES.find((c) => c.isoCode === isoCode);
    setDraft((d) => ({
      ...d,
      countryCode: isoCode,
      country: countryObj?.name ?? isoCode,
      dialCode: countryObj?.phonecode || "",
      state: "",
    }));
  };

  // ── Interest tag helpers ──
  const addInterest = () => {
    const val = newTag.trim();
    if (val && !draft.interests.includes(val)) {
      setDraft((d) => ({ ...d, interests: [...d.interests, val] }));
    }
    setNewTag("");
  };

  const removeInterest = (index) =>
    setDraft((d) => ({
      ...d,
      interests: d.interests.filter((_, i) => i !== index),
    }));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  // ── Edit / Save / Cancel ──
  const handleEdit = () => {
    setDraft({ ...form, interests: [...form.interests] });
    setErrorMsg("");
    setEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    try {
      const nameParts = draft.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updated = await userService.updateUserProfile(user?.id, {
        firstName,
        lastName,
        email: draft.email,
        address: draft.address,
        city: draft.city,
        country: draft.country,
        state: draft.state,
        interests: draft.interests,
        // Send phone to backend API which expects the 'phone' field
        phone: draft.phoneNumber,
      });

      if (updated) {
        onProfileUpdate(updated);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      setErrorMsg(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ ...form, interests: [...form.interests] });
    setErrorMsg("");
    setEditing(false);
    setNewTag("");
  };

  // ── Shared style helpers ──
  const cardCls = "bg-[#F4F5FB] rounded-2xl p-4 flex items-start gap-3";
  const iconWrapCls = "w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0";
  const fieldLabelCls = "text-xs text-gray-400 mb-0.5";
  const fieldValueCls = "text-sm font-semibold text-gray-800";
  const inputCls = "w-full bg-white border border-indigo-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 mt-0.5";
  const selectCls = "w-full bg-white border border-indigo-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 mt-0.5";

  const displayInterests = editing ? draft.interests : form.interests;

  const getInitials = () => {
    if (!form.fullName) return "PV";
    const parts = form.fullName.trim().split(/\s+/);
    const first = parts[0] ? parts[0].charAt(0) : "";
    const last = parts[1] ? parts[1].charAt(0) : "";
    return (first + last).toUpperCase() || "PV";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
        <p className="text-sm text-gray-500 font-medium">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Top row: Avatar + Name/Email + Edit button ── */}
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-200 to-purple-300 flex-shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white select-none">
              {getInitials()}
            </div>
          )}
          <label className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow cursor-pointer hover:bg-white transition">
            <Camera className="w-3 h-3 text-gray-600" />
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>

        {/* Name + Email */}
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </div>
            {editing ? (
              <input type="text" value={draft.fullName} onChange={updateDraft("fullName")} className={inputCls} />
            ) : (
              <p className="text-xl font-bold text-gray-800">{form.fullName}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </div>
            {editing ? (
              <input type="email" value={draft.email} onChange={updateDraft("email")} className={inputCls} />
            ) : (
              <p className="text-sm font-semibold text-gray-800">{form.email}</p>
            )}
          </div>
        </div>

        {/* Edit / Save / Cancel */}
        <div className="flex gap-1.5 items-center flex-shrink-0">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium animate-pulse mr-1">
              <BadgeCheck className="w-4 h-4" /> Saved!
            </span>
          )}
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                ) : (
                  <Check className="w-3 h-3" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Info Cards Grid ── */}
      <div className="flex gap-3">

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Address */}
          <div className={cardCls}>
            <div className={iconWrapCls}>
              <MapPin className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>Address</p>
              {editing ? (
                <input type="text" value={draft.address} onChange={updateDraft("address")} className={inputCls} />
              ) : (
                <p className={fieldValueCls}>{form.address || "—"}</p>
              )}
            </div>
          </div>

          {/* City */}
          <div className={cardCls}>
            <div className={iconWrapCls}>
              <Building2 className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>City</p>
              {editing ? (
                <input value={draft.city} onChange={updateDraft("city")} className={inputCls} />
              ) : (
                <p className={fieldValueCls}>{form.city || "—"}</p>
              )}
            </div>
          </div>

          {/* Fields of Interest */}
          <div className={cardCls + " items-start"}>
            <div className={iconWrapCls + " mt-0.5"}>
              <Tags className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>Fields of Interest</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {displayInterests.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No interests added yet</span>
                )}
                {displayInterests.map((tag, i) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 flex-shrink-0" />
                    {tag}
                    {editing && (
                      <button
                        onClick={() => removeInterest(i)}
                        aria-label={`Remove ${tag}`}
                        className="ml-0.5 text-indigo-400 hover:text-indigo-700 transition flex items-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <>
                  <div className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="e.g. Machine Learning…"
                      className="flex-1 bg-white border border-indigo-300 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      onClick={addInterest}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Press Enter or click Add. Click × to remove.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Country */}
          <div className={cardCls}>
            <div className={iconWrapCls}>
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>Country</p>
              {editing ? (
                <select value={draft.countryCode} onChange={handleCountryChange} className={selectCls}>
                  <option value="">— Select country —</option>
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={fieldValueCls}>
                  {ALL_COUNTRIES.find((c) => c.isoCode === form.countryCode)?.flag} {form.country}
                </p>
              )}
            </div>
          </div>

          {/* State / Region */}
          <div className={cardCls}>
            <div className={iconWrapCls}>
              <Map className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>State / Region</p>
              {editing ? (
                stateList.length > 0 ? (
                  <select value={draft.state} onChange={updateDraft("state")} className={selectCls}>
                    <option value="">— Select region —</option>
                    {stateList.map((s) => (
                      <option key={s.isoCode} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={draft.state}
                    onChange={updateDraft("state")}
                    placeholder="Enter region / province…"
                    className={inputCls}
                  />
                )
              ) : (
                <p className={fieldValueCls}>{form.state || "—"}</p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className={cardCls}>
            <div className={iconWrapCls}>
              <Phone className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={fieldLabelCls}>Phone Number</p>
              {editing ? (
                <div className="flex gap-1.5 mt-0.5">
                  <span className="inline-flex items-center px-3 rounded-xl bg-indigo-50 border border-indigo-300 text-sm font-semibold text-indigo-700 whitespace-nowrap select-none">
                    +{draft.dialCode || "—"}
                  </span>
                  <input
                    type="tel"
                    value={draft.phoneNumber}
                    onChange={updateDraft("phoneNumber")}
                    placeholder="e.g. 677123456"
                    className={inputCls}
                  />
                </div>
              ) : (
                <p className={fieldValueCls}>
                  {form.phoneNumber
                    ? `+${form.dialCode} ${form.phoneNumber}`
                    : "—"}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── ProfilePage (root) ───────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Details");
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBadges, setUserBadges] = useState([]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserProfile();
      if (data) {
        setUser(data);
        if (data.avatar) {
          setAvatarSrc(data.avatar);
        }
      }
      // Check for new badges and fetch user's badges
      await userService.checkBadges();
      const badgeData = await userService.getMyBadges();
      if (badgeData && badgeData.badges) {
        setUserBadges(badgeData.badges);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.avatar) {
      setAvatarSrc(updatedUser.avatar);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await userService.uploadAvatar(file);
        if (result && result.url) {
          setAvatarSrc(result.url);
          if (user) {
            setUser({ ...user, avatar: result.url });
          }
        }
      } catch (err) {
        console.error("Failed to upload avatar:", err);
        alert(err.message || "Failed to upload avatar image.");
      }
    }
  };

  const getInitials = () => {
    if (!user) return "PV";
    const first = user.firstName ? user.firstName.charAt(0) : "";
    const last = user.lastName ? user.lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "PV";
  };

  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "Tutor";

  const renderTab = () => {
    switch (activeTab) {
      case "Personal Details":
        return (
          <PersonalDetailsTab
            user={user}
            isLoading={isLoading}
            onProfileUpdate={handleProfileUpdate}
            avatarSrc={avatarSrc}
            onAvatarChange={handleAvatarChange}
          />
        );
      case "Details":   return <DetailsTab user={user} onProfileUpdate={handleProfileUpdate} />;
      case "Resources": return <ResourcesTab />;
      case "Schedules": return <SchedulesTab user={user} />;
      case "Payment":   return <PaymentTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f3fa] p-4">
      <div className="flex gap-5">

        {/* ── Left Panel ─────────────────────────────────────────────────── */}
        <div className="w-[240px] flex-shrink-0">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">

            {/* Cover / Profile Image */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl font-bold text-white select-none shadow-lg">
                    {getInitials()}
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
              <label className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow cursor-pointer hover:bg-white transition">
                <Camera className="w-3.5 h-3.5 text-gray-600" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            

            {/* Achievements */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-gray-700 text-xs font-semibold mb-1.5">Achievements</p>
              <div className="flex flex-wrap gap-1.5">
                {userBadges.length > 0 ? (
                  userBadges.map(({ badge }, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group relative cursor-help"
                      title={badge.name || badge.type}
                    >
                      <BadgeCheck className="w-5 h-5 text-indigo-500" />
                    </div>
                  ))
                ) : (
                  defaultAchievements.map(({ icon, bg, tooltip }, i) => (
                    <div key={i} className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`} title={tooltip}>
                      {icon}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Role */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-gray-700 text-xs font-semibold mb-1">Role</p>
              <div className="flex flex-col gap-0.5">
                {getRoleItems(user?.role ? user.role.toLowerCase() : 'tutor').map(({ icon, label, danger, primary, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-medium transition ${
                      danger
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : primary
                        ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {icon}
                      {label === "Tutor" ? displayRole : label}
                    </span>
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

        {/* ── Right Panel ─────────────────────────────────────────────────── */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[520px]">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Profile Setting</h2>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-t-lg transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div>{renderTab()}</div>
        </div>
      </div>
    </div>
  );
}