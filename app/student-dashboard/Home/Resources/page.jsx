"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  Users, BookOpen, Star, BadgeCheck,
} from "lucide-react";

import { api } from "@/lib/api";

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-pink-500","bg-amber-500",
  "bg-emerald-500","bg-blue-500","bg-rose-500","bg-teal-500",
];

const PER_PAGE = 12;

const FILTERS = [
  { key: "all",    label: "All" },
  { key: "Mentor", label: "Mentors only" },
  { key: "Tutor",  label: "Tutors only" },
  { key: "top",    label: "Top rated (4.8+)" },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function MentorCard({ mentor }) {
  const router = useRouter();

  return (
    <div className="relative group bg-white/40 backdrop-blur-xl border border-indigo-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] hover:border-indigo-300 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col overflow-hidden">
      
      {/* Hover inner glow */}
      <div className="absolute inset-0 border border-indigo-100/50 bg-gradient-to-br from-indigo-100/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]" />
      
      <div className="relative z-10 flex flex-col flex-1">
        {/* Role badge & Request Button */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/student-dashboard/request?role=${mentor.role.toLowerCase()}&mentorId=${mentor.id}`);
            }}
            className="text-[10px] font-bold px-3 py-1 rounded-full shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Request
          </button>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${
            mentor.role.toUpperCase() === "MENTOR"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
          }`}>
            {mentor.role}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {mentor.avatar ? (
            <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg shadow-indigo-100/50 group-hover:scale-105 transition-transform duration-500 rotate-3 group-hover:rotate-0" />
          ) : (
            <div className={`w-16 h-16 rounded-2xl ${avatarColor(mentor.name)} flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-100/50 group-hover:scale-105 transition-transform duration-500 rotate-3 group-hover:rotate-0`}>
              {initials(mentor.name)}
            </div>
          )}
        </div>

        {/* Name + verify */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition-colors">{mentor.name}</span>
          <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
        </div>

        {/* Specialty */}
        <p className="text-[11px] font-semibold text-indigo-500/80 uppercase tracking-widest text-center mb-3">{mentor.spec}</p>

        {/* Bio */}
        <p className="text-[11px] text-slate-500 leading-relaxed text-center line-clamp-3 flex-1 mb-4 font-medium">
          {mentor.bio}
        </p>

        {/* Stats */}
        <div className="flex justify-between pt-4 border-t border-slate-100/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <Users className="w-3.5 h-3.5 text-indigo-400" />{mentor.followers}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Followers</p>
          </div>
          <div className="text-center border-l border-r border-slate-100/50 px-2">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />{mentor.courses}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Courses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-400" />{mentor.rating}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">({mentor.reviews})</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pager({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = new Set(
    [1, total, current, current - 1, current + 1].filter((n) => n >= 1 && n <= total)
  );
  const sorted = [...pages].sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {sorted.reduce((acc, n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) {
          acc.push(<span key={`e${n}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">…</span>);
        }
        acc.push(
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
              n === current
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        );
        return acc;
      }, [])}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MentorsPage() {
  const [filter, setFilter]       = useState("all");
  const [page, setPage]           = useState(1);
  const [dropOpen, setDropOpen]   = useState(false);
  const [mentors, setMentors]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        
        const getAvatarUrl = (url) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
          if (url.startsWith("/")) url = url.slice(1);
          return `http://localhost:3001/${url}`;
        };

        // We expect an array of users. Filter for mentors and tutors
        const filteredUsers = response.filter(u => u.role === "MENTOR" || u.role === "TUTOR").map(u => ({
          id: u.id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          role: u.role === "MENTOR" ? "Mentor" : "Tutor",
          spec: u.interests?.length > 0 ? u.interests[0] : "No field of interest",
          icon: u.role === "MENTOR" ? "💻" : "🖥️",
          bio: u.bio || "No bio available.",
          followers: "0",
          courses: u._count?.courses || 0,
          rating: 5.0,
          reviews: "0",
          avatar: getAvatarUrl(u.avatar)
        }));
        setMentors(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all")    return mentors;
    if (filter === "top")    return mentors.filter((m) => m.rating >= 4.8);
    return mentors.filter((m) => m.role.toUpperCase() === filter.toUpperCase());
  }, [filter, mentors]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const slice      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const start      = (page - 1) * PER_PAGE + 1;
  const end        = Math.min(page * PER_PAGE, filtered.length);

  const handleFilter = (key) => {
    setFilter(key);
    setPage(1);
    setDropOpen(false);
  };

  const handlePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] p-8 shadow-sm overflow-hidden border border-slate-100/50">
      {/* Ambient background for glass effect */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">All Mentors & Instructors</h1>
          <p className="text-sm text-slate-500 mt-1">Learn from the best experts and industry professionals.</p>
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            <ChevronDown className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100 p-1.5 z-10 w-44">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    filter === f.key
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {slice.map((m) => <MentorCard key={m.id || m.name} mentor={m} />)}
          {slice.length === 0 && <div className="col-span-full text-center text-slate-500 py-12">No mentors or tutors found.</div>}
        </div>
      )}

      {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100/50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {start} to {end} of {filtered.length} mentors
          </p>
          <Pager current={page} total={totalPages} onChange={handlePage} />
        </div>
      </div>
    </div>
  );
}