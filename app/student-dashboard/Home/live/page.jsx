"use client"

import { useState, useRef } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  Lock,
} from "lucide-react";

const LessonTabs = ["Up Coming", "Others"];

const activeCourses = [
  {
    id: 1,
    title: "React 19 Complete Guide",
    progress: 65,
    color: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-200",
    tutor: { name: "James Carter", initials: "JC", avatarBg: "bg-blue-400" },
    participants: 128,
    participantColors: ["bg-pink-400", "bg-yellow-400", "bg-emerald-400", "bg-purple-400"],
  },
  {
    id: 2,
    title: "System Design Masterclass",
    progress: 32,
    color: "from-purple-500 to-pink-600",
    shadowColor: "shadow-purple-200",
    tutor: { name: "Riya Sharma", initials: "RS", avatarBg: "bg-purple-400" },
    participants: 96,
    participantColors: ["bg-blue-400", "bg-orange-400", "bg-teal-400", "bg-rose-400"],
  },
  {
    id: 3,
    title: "Advanced TypeScript",
    progress: 50,
    color: "from-teal-500 to-sky-500",
    shadowColor: "shadow-teal-200",
    tutor: { name: "Alex Morgan", initials: "AM", avatarBg: "bg-teal-400" },
    participants: 74,
    participantColors: ["bg-pink-400", "bg-purple-400", "bg-yellow-400", "bg-emerald-400"],
  },
  {
    id: 4,
    title: "Node.js Deep Dive",
    progress: 78,
    color: "from-amber-500 to-red-500",
    shadowColor: "shadow-amber-200",
    tutor: { name: "Priya Kumar", initials: "PK", avatarBg: "bg-amber-400" },
    participants: 110,
    participantColors: ["bg-blue-400", "bg-orange-400", "bg-emerald-400", "bg-rose-400"],
  },
  {
    id: 5,
    title: "CSS Mastery",
    progress: 20,
    color: "from-purple-500 to-pink-600",
    shadowColor: "shadow-purple-200",
    tutor: { name: "Leo Martinez", initials: "LM", avatarBg: "bg-purple-400" },
    participants: 88,
    participantColors: ["bg-pink-400", "bg-yellow-400", "bg-teal-400", "bg-purple-400"],
  },
  {
    id: 6,
    title: "GraphQL & APIs",
    progress: 45,
    color: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-200",
    tutor: { name: "Sara Blake", initials: "SB", avatarBg: "bg-blue-400" },
    participants: 63,
    participantColors: ["bg-blue-400", "bg-orange-400", "bg-emerald-400", "bg-pink-400"],
  },
];

const PER_PAGE = 4;

function CourseCard({ course }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 text-white bg-gradient-to-br ${course.color} shadow-xl ${course.shadowColor}`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/5 rounded-full" />

      <div className="relative z-10 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full ${course.tutor.avatarBg} border-2 border-white/40 flex items-center justify-center text-[11px] font-black text-white shrink-0`}
          >
            {course.tutor.initials}
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Instructor</p>
            <p className="text-xs font-black leading-none">{course.tutor.name}</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/15" />

        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">
            Continue Learning
          </span>
          <h3 className="text-base font-black mt-0.5 leading-snug">{course.title}</h3>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>{course.progress}% Complete</span>
            <span className="opacity-60">{100 - course.progress}% left</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex">
              {course.participantColors.map((bg, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${bg} border-2 border-white/50 flex items-center justify-center text-[9px] font-black text-white -ml-1.5 first:ml-0`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-[11px] font-semibold opacity-80">+{course.participants} joined</p>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 active:scale-95 transition-all text-xs font-black border border-white/20 shrink-0">
            Join Lesson <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardHeader() {
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(null);
  const totalPages = Math.ceil(activeCourses.length / PER_PAGE);

  const goTo = (page) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentPage + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const pages = Array.from({ length: totalPages }, (_, p) => {
    const slice = activeCourses.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE);
    while (slice.length < PER_PAGE) slice.push(null);
    return slice;
  });

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-8 gap-6">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Welcome back, Rajib! 👋</h1>
          <p className="text-slate-500 text-sm font-medium">
            You've completed 85% of your weekly goal.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Up Coming
              </p>
              <p className="text-sm font-black text-slate-900">12 Lession</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Class
              </p>
              <p className="text-sm font-black text-slate-900">24 Lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageItems, pageIdx) => (
            <div
              key={pageIdx}
              className="grid grid-cols-2 gap-4 min-w-full"
              style={{ gridTemplateRows: "1fr 1fr" }}
            >
              {pageItems.map((course, i) =>
                course ? (
                  <CourseCard key={course.id + "-" + i} course={course} />
                ) : (
                  <div key={`placeholder-${i}`} className="invisible rounded-3xl" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 0}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white text-slate-600 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4 " />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentPage
                  ? "w-4 h-2 bg-indigo-500"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {currentPage + 1} / {totalPages}
        </span>
      </div>
    </div>
  );
}

function LessonList() {
  const [activeTab, setActiveTab] = useState("Up Coming");

  const lessons = [
    {
      id: 1,
      title: "React Server Components Deep Dive",
      course: "React 19 Complete Guide",
      lesson: 14,
      duration: "22 min",
      status: "next",
      icon: Code2,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      accent: "border-l-indigo-400",
      badgeBg: "bg-indigo-500",
    },
    {
      id: 2,
      title: "Designing a URL Shortener at Scale",
      course: "System Design Masterclass",
      lesson: 7,
      duration: "35 min",
      status: "next",
      icon: Database,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      accent: "border-l-purple-400",
      badgeBg: "bg-purple-500",
    },
    {
      id: 3,
      title: "useOptimistic and Transitions",
      course: "React 19 Complete Guide",
      lesson: 13,
      duration: "18 min",
      status: "done",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      accent: "border-l-emerald-400",
      badgeBg: "bg-emerald-500",
    },
    {
      id: 4,
      title: "Load Balancers and Reverse Proxies",
      course: "System Design Masterclass",
      lesson: 8,
      duration: "28 min",
      status: "locked",
      icon: Lock,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-400",
      accent: "border-l-rose-300",
      badgeBg: "bg-slate-400",
    },
  ];

  const filteredLessons =
    activeTab === "Up Coming"
      ? lessons.filter((l) => l.status === "next")
      : lessons.filter((l) => l.status !== "next");

  const statusBadge = (status, badgeBg) => {
    const label = status === "next" ? "Up next" : status === "done" ? "Done" : "Locked";
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${badgeBg}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/50 border border-slate-100">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100 pb-0">
        {LessonTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2.5 text-xs font-bold transition-all rounded-none ${
              activeTab === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
            )}
            {tab === "Up Coming" && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-black">
                {lessons.filter((l) => l.status === "next").length}
              </span>
            )}
            {tab === "Others" && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black">
                {lessons.filter((l) => l.status !== "next").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lesson cards */}
      <div className="flex flex-col gap-2.5">
        {filteredLessons.map((l) => {
          const Icon = l.icon;
          return (
            <div
              key={l.id}
              className={`group flex items-center gap-4 rounded-2xl border border-slate-100 border-l-4 ${l.accent} px-4 py-3.5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 hover:border-slate-200 ${
                l.status === "locked" ? "opacity-50 grayscale pointer-events-none" : ""
              }`}
              style={{ background: "linear-gradient(to right, #fafafa, #ffffff)" }}
            >
              <div
                className={`w-11 h-11 rounded-xl ${l.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className={`w-5 h-5 ${l.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                  {l.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-slate-400 font-medium truncate">{l.course}</span>
                  <span className="text-slate-300 text-[11px]">·</span>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    Lesson {l.lesson}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {statusBadge(l.status, l.badgeBg)}
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[11px] font-medium">{l.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LearningDashboard() {
  return (
    <div className="flex h-screen font-sans">
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <DashboardHeader />
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <LessonList />
          </div>
        </div>
      </main>
    </div>
  );
}