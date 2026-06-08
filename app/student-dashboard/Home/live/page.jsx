"use client"

import { useState, useRef, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Video,
  Code2,
  Database,
  Lock,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const LessonTabs = ["Up Coming", "Others"];

const COLORS = [
  { color: "from-blue-500 to-indigo-600", shadowColor: "shadow-blue-200" },
  { color: "from-purple-500 to-pink-600", shadowColor: "shadow-purple-200" },
  { color: "from-teal-500 to-sky-500", shadowColor: "shadow-teal-200" },
  { color: "from-amber-500 to-red-500", shadowColor: "shadow-amber-200" },
];

const AVATAR_BGS = ["bg-blue-400", "bg-purple-400", "bg-teal-400", "bg-amber-400"];

const PER_PAGE = 4;

function CourseCard({ session, index }) {
  const router = useRouter();
  const colorScheme = COLORS[index % COLORS.length];
  const avatarBg = AVATAR_BGS[index % AVATAR_BGS.length];
  
  const initials = session.tutor 
    ? `${session.tutor.firstName?.[0] || ""}${session.tutor.lastName?.[0] || ""}`
    : "T";
  const tutorName = session.tutor 
    ? `${session.tutor.firstName} ${session.tutor.lastName}`
    : "Tutor";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 text-white bg-gradient-to-br ${colorScheme.color} shadow-xl ${colorScheme.shadowColor}`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/5 rounded-full" />

      <div className="relative z-10 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full ${avatarBg} border-2 border-white/40 flex items-center justify-center text-[11px] font-black text-white shrink-0`}
          >
            {initials}
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">Live Session</p>
            <p className="text-xs font-black leading-none">{tutorName}</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> Live Now
          </span>
        </div>

        <div className="w-full h-px bg-white/15" />

        <div>
          <h3 className="text-base font-black mt-0.5 leading-snug line-clamp-2">{session.title}</h3>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-80" />
              <p className="text-[11px] font-semibold opacity-80">{session.duration || 60} min</p>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/student-dashboard/sessions/${session.id}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 active:scale-95 transition-all text-xs font-black border border-white/20 shrink-0"
          >
            Join Room <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardHeader({ dashboardData, loading }) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(null);

  if (loading) {
    return (
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-8 gap-6 min-h-[250px] items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const ongoingSessions = dashboardData?.affiliatedOngoing || [];
  const totalPages = Math.ceil(ongoingSessions.length / PER_PAGE);

  const goTo = (page) => {
    if (totalPages === 0) return;
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

  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, p) => {
    const slice = ongoingSessions.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE);
    while (slice.length < PER_PAGE) slice.push(null);
    return slice;
  });

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-8 gap-6">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Welcome back, {user?.firstName || user?.name || dashboardData?.studentName || "Student"}!
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Jump into live sessions with your affiliated mentors and tutors.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Video className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ongoing
              </p>
              <p className="text-sm font-black text-slate-900">{ongoingSessions.length} Live</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Scheduled
              </p>
              <p className="text-sm font-black text-slate-900">{dashboardData?.affiliatedUpcoming?.length || 0} Up Coming</p>
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
              {ongoingSessions.length === 0 ? (
                <div className="col-span-2 row-span-2 flex items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12">
                   <p className="text-slate-500 font-bold">No active live sessions from your mentors at the moment.</p>
                </div>
              ) : (
                pageItems.map((session, i) =>
                  session ? (
                    <CourseCard key={session.id} session={session} index={i + pageIdx * PER_PAGE} />
                  ) : (
                    <div key={`placeholder-${i}`} className="invisible rounded-3xl" />
                  )
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {totalPages > 0 && (
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
      )}
    </div>
  );
}

function LessonList({ dashboardData, loading }) {
  const [activeTab, setActiveTab] = useState("Up Coming");
  const router = useRouter();

  const upcomingSessions = dashboardData?.affiliatedUpcoming || [];
  const discoverSessions = dashboardData?.discover || [];

  const displayedSessions = activeTab === "Up Coming" ? upcomingSessions : discoverSessions;

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
                {upcomingSessions.length}
              </span>
            )}
            {tab === "Others" && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black">
                {discoverSessions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lesson cards */}
      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : displayedSessions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 font-bold">
              {activeTab === "Up Coming" 
                ? "No upcoming sessions from your affiliated mentors."
                : "No discoverable free sessions matching your interests right now."}
            </p>
          </div>
        ) : (
          displayedSessions.map((session, idx) => {
            const isLive = session.status === "Live";
            const timeStr = isLive ? "Live Now" : session.scheduledTime ? new Date(session.scheduledTime).toLocaleString() : "TBA";
            const mentorName = session.tutor ? `${session.tutor.firstName} ${session.tutor.lastName}` : "Mentor";
            
            return (
              <div
                key={session.id}
                onClick={() => router.push(`/student-dashboard/sessions/${session.id}`)}
                className={`group flex items-center gap-4 rounded-2xl border border-slate-100 border-l-4 px-4 py-3.5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-0.5 hover:border-slate-200 ${
                  activeTab === "Up Coming" ? "border-l-indigo-400" : "border-l-emerald-400"
                }`}
                style={{ background: "linear-gradient(to right, #fafafa, #ffffff)" }}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${
                    activeTab === "Up Coming" ? "bg-indigo-50 text-indigo-500" : "bg-emerald-50 text-emerald-500"
                  }`}
                >
                  <Video className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                    {session.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400 font-medium truncate">With {mentorName}</span>
                    <span className="text-slate-300 text-[11px]">·</span>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {timeStr}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {isLive ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-red-500 shadow-sm animate-pulse">
                      Live Now
                    </span>
                  ) : activeTab === "Up Coming" ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-indigo-500">
                      Up Next
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-100 border border-emerald-200">
                      Free Access
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] font-medium">{session.duration || 60} min</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function LearningDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/live-sessions/student-dashboard')
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch live dashboard:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen font-sans">
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <DashboardHeader dashboardData={dashboardData} loading={loading} />
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <LessonList dashboardData={dashboardData} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}