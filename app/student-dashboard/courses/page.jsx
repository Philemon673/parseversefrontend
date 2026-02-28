"use client";

import { useState } from "react";
import { Search, ChevronDown, MoreVertical, Star } from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const courses = [
  {
    id: 1,
    title: "Complete JavaScript Course",
    updated: "Updated 5 days ago",
    lessons: 55,
    completedLessons: 27,
    hours: "12 hrs",
    extraHours: "18 hours",
    percent: 88,
    extra: "610%",
    instructor: "James Smith",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 4,
    status: "Progress",
    statusColor: "bg-yellow-400 text-yellow-900",
    tab: "progress",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
  },
  {
    id: 2,
    title: "Data Science with Python",
    updated: "Updated 1 week ago",
    lessons: 32,
    completedLessons: 16,
    hours: "16 hrs",
    extraHours: "8 hours",
    percent: 50,
    extra: "140%",
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    rating: 0,
    status: null,
    tab: "progress",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  },
  {
    id: 3,
    title: "Python for Beginners",
    updated: "Updated 3 days ago",
    lessons: 45,
    completedLessons: 45,
    hours: "12 hrs",
    extraHours: "18 hours",
    percent: 100,
    extra: null,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    rating: 3.5,
    status: "Completed",
    statusColor: "bg-purple-500 text-white",
    tab: "completed",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    hasCertificate: true,
  },
];

const tabs = [
  { label: "All", count: 203, key: "all" },
  { label: "In Progress", count: 3, key: "progress" },
  { label: "Completed", count: 15, key: "completed" },
  { label: "Saved", count: null, key: "saved" },
];

const categories = ["All Categories", "Web Development", "Data Science", "Design", "Marketing"];

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i <= Math.floor(rating) ? "#f59e0b" : i - 0.5 <= rating ? "#f59e0b" : "none"}
          stroke="#f59e0b"
        />
      ))}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value }) {
  return (
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-indigo-500"
        style={{ width: value + "%" }}
      />
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────

function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        {/* Status badge */}
        {course.status && (
          <span className={"absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full " + course.statusColor}>
            {course.status}
          </span>
        )}

        {/* Instructor avatar overlapping image */}
        <div className="absolute -bottom-5 left-4">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
          />
        </div>

        {/* More options */}
        <button className="absolute top-3 right-3 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition">
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>

        {/* Rating on image (course 1 only) */}
        {course.id === 1 && course.rating > 0 && (
          <div className="absolute bottom-3 right-3">
            <StarRating rating={course.rating} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-7 px-4 pb-4 flex flex-col gap-2 flex-1">

        {/* Title + updated */}
        <div>
          <h3 className="font-bold text-slate-800 text-sm leading-tight">{course.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{course.updated}</p>
        </div>

        {/* Lessons + hours row */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{course.lessons} Lessons</span>
          <span className="text-slate-300">·</span>
          <span>{course.hours}</span>
          {course.extraHours && (
            <>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                ⭐ {course.extraHours}
              </span>
            </>
          )}
        </div>

        {/* Progress stats */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="text-slate-800 font-bold">{course.completedLessons}</span>
          <span className="text-slate-400">/ {course.lessons} Lessons</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-700">{course.percent}%</span>
          {course.extra && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">{course.extra}</span>
            </>
          )}
        </div>

        {/* Progress bar */}
        <ProgressBar value={course.percent} />

        {/* Star rating below bar (courses 2 & 3) */}
        {course.id !== 1 && course.rating > 0 && (
          <StarRating rating={course.rating} />
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-2">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-slate-600 font-medium">{course.instructor}</span>
          </div>

          {course.hasCertificate ? (
            <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
              Certificate
            </button>
          ) : (
            <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filtered = courses.filter((c) => {
    const matchTab = activeTab === "all" || c.tab === activeTab;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div
      className="min-h-screen p-6 flex flex-col gap-6"
      
    >

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search my courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5  rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-400 w-full shadow-sm"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-2 py-1 flex items-center">
        {tabs.map((tab, i) => (
          <div key={tab.key} className="flex items-center">
            <button
              onClick={() => setActiveTab(tab.key)}
              className={"px-5 py-2.5 text-sm font-medium transition rounded-xl " +
                (activeTab === tab.key
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-400 hover:text-slate-600")
              }
            >
              {tab.label}
              {tab.count !== null && (
                <span className={"ml-1.5 font-bold " +
                  (activeTab === tab.key ? "text-indigo-600" : "text-slate-400")
                }>
                  ({tab.count})
                </span>
              )}
            </button>
            {i < tabs.length - 1 && (
              <div className="w-px h-5 bg-slate-200 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* ── Course Grid ─────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          No courses found.
        </div>
      )}

    </div>
  );
}