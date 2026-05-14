"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bookmark,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  X,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const PER_PAGE = 9;

const LEVEL_STYLES = {
  Beginner:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-100  text-amber-700  border-amber-200",
  Pro:          "bg-rose-100   text-rose-700   border-rose-200",
};

const ROLE_STYLES = {
  Mentor: "bg-indigo-100 text-indigo-700",
  Tutor:  "bg-violet-100 text-violet-700",
};

const AVATAR_GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-rose-400   to-pink-600",
  "from-amber-400  to-orange-500",
  "from-emerald-400 to-teal-600",
  "from-sky-400    to-blue-600",
  "from-fuchsia-400 to-purple-600",
  "from-cyan-400   to-sky-600",
  "from-lime-400   to-green-600",
];

// ── Full 24-course dataset ────────────────────────────────────────────────────

const ALL_COURSES = [
  // ── Page 1 ──
  { id:  1, title: "Python Programming for Beginners",       level: "Beginner",     description: "Learn Python from scratch. Understand the basics, write your first program and build strong programming foundations.",                                    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60", instructor: { name: "Arjun Patel",      role: "Mentor", specialty: "Specialist in Python & Backend Development",          avatar: "AP" }, rating: 4.8, students: "3.2k" },
  { id:  2, title: "UI/UX Design Fundamentals",              level: "Intermediate", description: "Master the principles of UI/UX design and create user-friendly, beautiful interfaces.",                                                                    thumbnail: "https://images.unsplash.com/photo-1616499370260-485b3e5ed653?w=600&auto=format&fit=crop&q=60", instructor: { name: "Neha Sharma",      role: "Mentor", specialty: "Specialist in UI/UX Design",                       avatar: "NS" }, rating: 4.9, students: "2.8k" },
  { id:  3, title: "Stock Market Trading Masterclass",       level: "Pro",          description: "Advanced strategies, risk management and technical analysis to trade like a professional.",                                                                  thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60", instructor: { name: "Rohit Verma",      role: "Mentor", specialty: "Specialist in Stock Market & Finance",              avatar: "RV" }, rating: 4.7, students: "5.1k" },
  { id:  4, title: "React.js Complete Guide",                level: "Intermediate", description: "Build modern, fast and scalable web applications using React.js from basics to advanced concepts.",                                                         thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&auto=format&fit=crop&q=60", instructor: { name: "Ankit Singh",      role: "Tutor",  specialty: "Specialist in Frontend Development",                   avatar: "AS" }, rating: 4.9, students: "6.4k" },
  { id:  5, title: "Microsoft Excel Essential Training",     level: "Beginner",     description: "Learn Excel basics, formulas, data analysis and create stunning spreadsheets.",                                                                             thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=60", instructor: { name: "Priya Mehta",      role: "Tutor",  specialty: "Specialist in Data Analysis & Excel",                  avatar: "PM" }, rating: 4.6, students: "4.2k" },
  { id:  6, title: "Cybersecurity Fundamentals",             level: "Intermediate", description: "Understand security concepts, network basics and protect systems from digital threats.",                                                                     thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60", instructor: { name: "Karan Malhotra",   role: "Mentor", specialty: "Specialist in Cybersecurity & Ethical Hacking",       avatar: "KM" }, rating: 4.8, students: "3.7k" },
  { id:  7, title: "Photography Basics for Everyone",        level: "Beginner",     description: "Learn camera basics, composition techniques and capture stunning photos.",                                                                                   thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764bed?w=600&auto=format&fit=crop&q=60", instructor: { name: "Vikram Bhat",      role: "Tutor",  specialty: "Specialist in Photography & Visual Storytelling",      avatar: "VB" }, rating: 4.7, students: "2.1k" },
  { id:  8, title: "Blender 3D – From Beginner to Pro",     level: "Pro",          description: "Create 3D models, animations and visuals using Blender from start to finish.",                                                                              thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60", instructor: { name: "Siddharth Roy",    role: "Mentor", specialty: "Specialist in 3D Modeling & Animation",                avatar: "SR" }, rating: 4.9, students: "1.9k" },
  { id:  9, title: "Digital Marketing Strategy Bootcamp",   level: "Intermediate", description: "Learn SEO, social media marketing, content strategy and grow your online presence.",                                                                         thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60", instructor: { name: "Isha Kapoor",      role: "Tutor",  specialty: "Specialist in Digital Marketing & Growth Strategy",    avatar: "IK" }, rating: 4.8, students: "3.5k" },
  // ── Page 2 ──
  { id: 10, title: "Node.js & Express Backend Development",  level: "Intermediate", description: "Build REST APIs and backend services with Node.js and Express. Learn authentication, databases, and deployment.",                                           thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=60", instructor: { name: "Dev Sharma",       role: "Mentor", specialty: "Specialist in Backend & API Development",              avatar: "DS" }, rating: 4.8, students: "4.1k" },
  { id: 11, title: "Machine Learning with Python",           level: "Pro",          description: "Dive into ML algorithms, neural networks and model training using Python and scikit-learn.",                                                                 thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&auto=format&fit=crop&q=60", instructor: { name: "Anika Patel",      role: "Tutor",  specialty: "Specialist in Machine Learning & Data Science",        avatar: "AP" }, rating: 4.9, students: "7.2k" },
  { id: 12, title: "Figma for UI Designers",                 level: "Beginner",     description: "Learn Figma from the ground up. Design components, prototypes and collaborate in real-time with your team.",                                                thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=60", instructor: { name: "Simran Kaur",      role: "Tutor",  specialty: "Specialist in Product Design & Figma",                 avatar: "SK" }, rating: 4.7, students: "3.3k" },
  { id: 13, title: "Docker & Kubernetes for DevOps",         level: "Pro",          description: "Master containerisation, orchestration, and CI/CD pipelines with Docker and Kubernetes in production.",                                                      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=600&auto=format&fit=crop&q=60", instructor: { name: "Rahul Nair",       role: "Mentor", specialty: "Specialist in DevOps & Cloud Infrastructure",          avatar: "RN" }, rating: 4.8, students: "2.9k" },
  { id: 14, title: "SQL & Database Design",                  level: "Beginner",     description: "Learn SQL from scratch, understand relational databases and write complex queries with confidence.",                                                         thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60", instructor: { name: "Pooja Iyer",       role: "Tutor",  specialty: "Specialist in Databases & Data Engineering",           avatar: "PI" }, rating: 4.6, students: "5.5k" },
  { id: 15, title: "Flutter Mobile App Development",         level: "Intermediate", description: "Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart.",                                                                    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=60", instructor: { name: "Kabir Mehta",      role: "Mentor", specialty: "Specialist in Mobile App Development",                 avatar: "KM" }, rating: 4.7, students: "3.8k" },
  { id: 16, title: "AWS Cloud Practitioner",                 level: "Beginner",     description: "Get started with Amazon Web Services. Learn core cloud concepts, services and pass the AWS Cloud Practitioner exam.",                                       thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60", instructor: { name: "Tara Singh",       role: "Mentor", specialty: "Specialist in Cloud Computing & AWS",                  avatar: "TS" }, rating: 4.8, students: "6.1k" },
  { id: 17, title: "TypeScript Deep Dive",                   level: "Intermediate", description: "Master TypeScript's type system, generics and advanced patterns to write safer, more maintainable code.",                                                   thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60", instructor: { name: "Leena Roy",        role: "Tutor",  specialty: "Specialist in TypeScript & JavaScript",                avatar: "LR" }, rating: 4.9, students: "2.6k" },
  { id: 18, title: "Video Editing with Premiere Pro",        level: "Beginner",     description: "Learn professional video editing techniques using Adobe Premiere Pro for YouTube, films and social media.",                                                  thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10e128?w=600&auto=format&fit=crop&q=60", instructor: { name: "Yash Chopra",      role: "Tutor",  specialty: "Specialist in Video Production & Editing",             avatar: "YC" }, rating: 4.7, students: "4.0k" },
  // ── Page 3 ──
  { id: 19, title: "Ethical Hacking & Penetration Testing",  level: "Pro",          description: "Learn real-world hacking techniques, vulnerability assessment and penetration testing tools legally.",                                                       thumbnail: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&auto=format&fit=crop&q=60", instructor: { name: "Aryan Khanna",     role: "Mentor", specialty: "Specialist in Offensive Security & CTF",               avatar: "AK" }, rating: 4.9, students: "3.4k" },
  { id: 20, title: "Graphic Design with Canva",              level: "Beginner",     description: "Create stunning social media posts, presentations and marketing materials without any design experience.",                                                   thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=60", instructor: { name: "Meera Joshi",      role: "Tutor",  specialty: "Specialist in Graphic Design & Branding",              avatar: "MJ" }, rating: 4.6, students: "5.7k" },
  { id: 21, title: "Next.js Full-Stack Development",         level: "Intermediate", description: "Build production-ready full-stack apps with Next.js, Prisma and PostgreSQL using the App Router.",                                                          thumbnail: "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=600&auto=format&fit=crop&q=60", instructor: { name: "Samir Das",        role: "Mentor", specialty: "Specialist in Full-Stack JavaScript Development",       avatar: "SD" }, rating: 4.9, students: "4.8k" },
  { id: 22, title: "Data Visualisation with Power BI",       level: "Intermediate", description: "Turn raw data into beautiful dashboards and business intelligence reports using Microsoft Power BI.",                                                        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60", instructor: { name: "Divya Menon",      role: "Tutor",  specialty: "Specialist in Business Intelligence & Analytics",       avatar: "DM" }, rating: 4.7, students: "2.4k" },
  { id: 23, title: "iOS Development with Swift",             level: "Pro",          description: "Build native iPhone and iPad apps from scratch using Swift and SwiftUI, and publish them on the App Store.",                                                 thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=60", instructor: { name: "Nisha Bose",       role: "Mentor", specialty: "Specialist in iOS & Swift Development",                avatar: "NB" }, rating: 4.8, students: "1.8k" },
  { id: 24, title: "Content Writing & Copywriting",          level: "Beginner",     description: "Learn to write compelling blogs, ad copy and email campaigns that convert readers into customers.",                                                          thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=60", instructor: { name: "Ritu Verma",       role: "Tutor",  specialty: "Specialist in Content Strategy & Copywriting",         avatar: "RV" }, rating: 4.7, students: "3.1k" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function Avatar({ initials, index = 0 }) {
  const g = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm ring-2 ring-white`}>
      {initials}
    </div>
  );
}

function LevelBadge({ level }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border whitespace-nowrap ${LEVEL_STYLES[level] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {level}
    </span>
  );
}

function RoleBadge({ role }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${ROLE_STYLES[role] || "bg-gray-100 text-gray-500"}`}>
      {role}
    </span>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────

function CourseCard({ course, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => setSaved(v => !v)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Bookmark className={`w-4 h-4 transition-colors ${saved ? "fill-indigo-600 text-indigo-600" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">{course.title}</h3>
          <LevelBadge level={course.level} />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{course.description}</p>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-700">{course.rating}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-200 inline-block" />
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{course.students} students</span>
          </div>
        </div>

        <div className="border-t border-gray-50" />

        <div className="flex items-center gap-3">
          <Avatar initials={course.instructor.avatar} index={index} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-800">{course.instructor.name}</span>
              <RoleBadge role={course.instructor.role} />
            </div>
            <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{course.instructor.specialty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }) {
  // Smart window: always show first, last, current ±1, with ellipsis
  const getPages = () => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
    return [...pages].sort((a, b) => a - b);
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center gap-1.5">
            {/* Ellipsis gap */}
            {prev && p - prev > 1 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none">…</span>
            )}
            <button
              onClick={() => onChange(p)}
              className={`w-8 h-8 rounded-lg border text-sm font-bold transition-all ${
                p === current
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Filter Panel ──────────────────────────────────────────────────────────────

function FilterButton({ levelFilter, roleFilter, onLevelChange, onRoleChange, onReset }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isFiltered = levelFilter !== "All" || roleFilter !== "All";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all shadow-sm ${
          isFiltered
            ? "border-indigo-400 bg-indigo-50 text-indigo-700"
            : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:text-indigo-600"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {isFiltered && (
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
            {(levelFilter !== "All" ? 1 : 0) + (roleFilter !== "All" ? 1 : 0)}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 z-30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Filters</span>
            {isFiltered && (
              <button onClick={onReset} className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-5">
            {/* Level */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Level</p>
              <div className="flex flex-col gap-1.5">
                {["All", "Beginner", "Intermediate", "Pro"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onLevelChange(lvl)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                      levelFilter === lvl
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {lvl === "All" ? "All Levels" : lvl}
                    {levelFilter === lvl && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Instructor Role</p>
              <div className="flex flex-col gap-1.5">
                {["All", "Mentor", "Tutor"].map((role) => (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                      roleFilter === role
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "text-gray-600 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {role === "All" ? "All Roles" : role}
                    {roleFilter === role && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Active Filter Pills ───────────────────────────────────────────────────────

function ActiveFilters({ levelFilter, roleFilter, onLevelChange, onRoleChange }) {
  const chips = [
    levelFilter !== "All" && { label: levelFilter, onRemove: () => onLevelChange("All") },
    roleFilter  !== "All" && { label: roleFilter,  onRemove: () => onRoleChange("All")  },
  ].filter(Boolean);

  if (!chips.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <span className="text-xs font-bold text-gray-400">Active:</span>
      {chips.map(({ label, onRemove }) => (
        <span key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
          {label}
          <button onClick={onRemove} className="hover:text-indigo-900 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AllCoursesPage() {
  const [page, setPage]             = useState(1);
  const [levelFilter, setLevelFilter] = useState("All");
  const [roleFilter,  setRoleFilter]  = useState("All");

  // Apply filters to full dataset
  const filtered = ALL_COURSES.filter(c => {
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    const matchRole  = roleFilter  === "All" || c.instructor.role === roleFilter;
    return matchLevel && matchRole;
  });

  // Pagination over filtered results
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage     = Math.min(page, totalPages);
  const start        = (safePage - 1) * PER_PAGE;
  const pageCourses  = filtered.slice(start, start + PER_PAGE);

  // Reset to page 1 when filters change
  const handleLevelChange = (val) => { setLevelFilter(val); setPage(1); };
  const handleRoleChange  = (val) => { setRoleFilter(val);  setPage(1); };
  const handleReset       = ()    => { setLevelFilter("All"); setRoleFilter("All"); setPage(1); };

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-sans">
      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Courses</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Explore our curated courses across various fields and skill levels.
            </p>
          </div>
          <FilterButton
            levelFilter={levelFilter}
            roleFilter={roleFilter}
            onLevelChange={handleLevelChange}
            onRoleChange={handleRoleChange}
            onReset={handleReset}
          />
        </div>

        {/* ── Active filter pills ── */}
        <ActiveFilters
          levelFilter={levelFilter}
          roleFilter={roleFilter}
          onLevelChange={handleLevelChange}
          onRoleChange={handleRoleChange}
        />

        {/* ── Grid ── */}
        {pageCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {pageCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-100 mb-10">
            <SlidersHorizontal className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-lg font-bold text-gray-700 mb-1">No courses match your filters</p>
            <p className="text-sm text-gray-400 mb-6">Try adjusting or clearing your active filters.</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-semibold">
              Showing {start + 1}–{Math.min(start + PER_PAGE, filtered.length)} of {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </p>
            <Pagination current={safePage} total={totalPages} onChange={setPage} />
          </div>
        )}
      </main>
    </div>
  );
}