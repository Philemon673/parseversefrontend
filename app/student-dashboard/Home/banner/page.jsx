import { useState, useEffect } from "react";
import { BookOpen, Clock, Award } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────
const STORAGE_KEY = "dashboardUILastSeen";
const COOLDOWN_DAYS = 7;
const VISIBLE_DURATION_MS = 30 * 1000; // 30 seconds

// ─── Utility ──────────────────────────────────────────────────
function shouldShow(storageKey) {
  const lastSeen = localStorage.getItem(storageKey);
  const now = Date.now();
  return (
    !lastSeen ||
    now - parseInt(lastSeen, 10) > COOLDOWN_DAYS * 24 * 60 * 60 * 1000
  );
}

// ─── WelcomeBanner ────────────────────────────────────────────
export function WelcomeBanner({ name }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-6 shadow-xl mb-2 text-white border border-white/10">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-30%] right-[-10%] w-60 h-60 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-pink-500/20 rounded-full blur-xl" />

      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight">
          {greeting}, {name || "Scholar"}! 👋
        </h2>
        <p className="text-purple-100 text-xs mt-0.5 max-w-md leading-relaxed">
          Welcome back to ParseVerse! Ready to continue your learning journey?
          Monitor your stats and jump right back in below.
        </p>
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 flex-1 min-w-[140px]">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-black text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function Banners({ name, loading, totalEnrolled, inProgress, completed }) {
  const [uiVisible, setUiVisible] = useState(false);

  useEffect(() => {
    if (shouldShow(STORAGE_KEY)) {
      setUiVisible(true);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));

      const timer = setTimeout(() => setUiVisible(false), VISIBLE_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="p-6 flex flex-col gap-4 w-full">
      {uiVisible && (
        <>
          {/* Welcome Banner */}
          <WelcomeBanner name={name} />

          {/* Stat Cards */}
          <div className="flex flex-wrap gap-4">
            <StatCard 
              label="Enrolled Courses" 
              value={loading ? "..." : String(totalEnrolled)} 
              icon={BookOpen} 
              colorClass="text-indigo-600" 
              bgClass="bg-indigo-50 border border-indigo-100" 
            />
            <StatCard 
              label="In Progress" 
              value={loading ? "..." : String(inProgress)} 
              icon={Clock} 
              colorClass="text-purple-600" 
              bgClass="bg-purple-50 border border-purple-100" 
            />
            <StatCard 
              label="Certificates" 
              value={loading ? "..." : String(completed)} 
              icon={Award} 
              colorClass="text-pink-600" 
              bgClass="bg-pink-50 border border-pink-100" 
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Banners;