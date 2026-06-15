"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMyEnrolledCourses } from "../../../lib/courseService";

const defaultCategories = ["All Categories", "Web Development", "Data Science", "Design", "Marketing"];
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

function CourseCard({ enrollment }) {
  const router = useRouter();
  const { course, progress } = enrollment;

  const totalLessons = course._count?.modules || 1;
  const completedLessons = progress?.completedLessons || 0;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isCompleted = percent >= 100;
  const status = isCompleted ? "Completed" : "In Progress";
  const statusColor = isCompleted ? "bg-purple-500 text-white" : "bg-yellow-400 text-yellow-900";
  
  const instructorName = course.instructor 
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "Instructor";
  const instructorAvatarInitial = instructorName.charAt(0);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-indigo-300" />
          </div>
        )}
        <span className={"absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full " + statusColor}>
          {status}
        </span>
        <div className="absolute -bottom-5 left-4">
          <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white font-bold shadow">
            {instructorAvatarInitial}
          </div>
        </div>
      </div>

      <div className="pt-7 px-4 pb-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-slate-800 text-sm leading-tight">{course.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{course.type}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-2">
          <span className="text-slate-800 font-bold">{completedLessons}</span>
          <span className="text-slate-400">/ {totalLessons} Lessons</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-700">{percent}%</span>
        </div>

        <ProgressBar value={percent} />

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">{instructorName}</span>
          </div>

          <button 
            onClick={() => {
              const url = course.type === "Hardcopy"
                ? `/student-dashboard/coursedetails/courses/hardcopy?courseId=${course.id}`
                : `/student-dashboard/coursedetails/courses/coursedetails?courseId=${course.id}`;
              router.push(url);
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Continue
          </button>
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
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const data = await getMyEnrolledCourses();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load enrolled courses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  const dynamicCategories = ["All Categories", ...new Set(enrollments.map(e => e.course.category).filter(Boolean))];
  const activeCategories = dynamicCategories.length > 1 ? dynamicCategories : defaultCategories;

  // Compute live counts from real data
  const completedCount = enrollments.filter((e) =>
    (e.progress?.completedLessons || 0) >= (e.course._count?.modules || 1)
  ).length;
  const inProgressCount = enrollments.length - completedCount;

  const tabs = [
    { label: "All", count: enrollments.length, key: "all" },
    { label: "In Progress", count: inProgressCount, key: "progress" },
    { label: "Completed", count: completedCount, key: "completed" },
  ];

  const filtered = enrollments.filter((enrollment) => {
    const course = enrollment.course;
    const isCompleted = (enrollment.progress?.completedLessons || 0) >= (course._count?.modules || 1);
    
    let matchTab = true;
    if (activeTab === "progress") matchTab = !isCompleted;
    if (activeTab === "completed") matchTab = isCompleted;

    const matchSearch = course.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All Categories" || course.category === category;
    
    return matchTab && matchSearch && matchCategory;
  });

  return (
    <div
      className="min-h-screen p-6 flex flex-col gap-6 r"
      
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
            {activeCategories.map((c) => (
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

      {/* ── Course Grid ─────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((enrollment) => (
            <CourseCard key={enrollment.id || enrollment.courseId} enrollment={enrollment} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-56 gap-3 text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-200" />
          <p className="text-sm font-medium">
            {search ? `No courses matching "${search}"` : "No courses found in this category."}
          </p>
        </div>
      )}

    </div>
  );
}