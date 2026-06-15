"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Users,
  BookOpen,
  Star,
  Mail,
  MapPin,
  User,
  CalendarDays,
  BadgeCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import heroBg from "@/assets/bannerprofile.png";

/* ── helpers ── */
const GRAD = [
  "from-violet-500 to-blue-400",
  "from-indigo-500 to-purple-400",
  "from-pink-500 to-rose-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-blue-500 to-cyan-400",
];
function getInitials(n) {
  if (!n) return "U";
  return n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function getGrad(n) {
  if (!n) return GRAD[0];
  let h = 0;
  for (const c of n) h = (h * 31 + c.charCodeAt(0)) % GRAD.length;
  return GRAD[h];
}

/* ─────────────────────────── */
export default function InstructorProfilePage() {
  const router = useRouter();
  const { id } = useParams();

  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const user = await api.get(`/users/${id}`);
        if (!user || !["MENTOR", "TUTOR"].includes(user.role))
          throw new Error("Instructor not found");

        const avatarUrl = (url) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
          return `http://localhost:3001/${url.replace(/^\//, "")}`;
        };

        setInstructor({
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          role: user.role === "MENTOR" ? "Mentor" : "Tutor",
          spec: user.interests?.[0] ?? "Generalist",
          bio: user.bio || "This instructor hasn't provided a bio yet.",
          email: user.email,
          country: user.country,
          joined: user.createdAt,
          followers: user.stats?.followers ?? 0,
          coursesCount: user._count?.courses ?? user.stats?.courses ?? 0,
          rating: 5,
          reviews: user.stats?.reviews ?? 0,
          avatar: avatarUrl(user.avatar),
        });
      } catch (e) {
        setError(e.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );

  if (error || !instructor)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center p-8 rounded-3xl border border-red-100 shadow max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="font-bold text-gray-800 mb-1">Profile Not Found</p>
          <p className="text-sm text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-violet-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-violet-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const fn = instructor.name.split(" ")[0];
  const isMentor = instructor.role === "Mentor";
  const year = instructor.joined ? new Date(instructor.joined).getFullYear() : "2026";

  return (
    /* Full page uses the background image */
    <div
      className="min-h"

    >
      {/* Back button — top left of page */}
      <div className="px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* White card — centered, with top margin to sit below the back button */}
      <div className="flex justify-center px-6 pt-10 pb-12">
        <div
          className="bg-white w-full rounded-3xl overflow-hidden"
          style={{
            maxWidth: 980,
            boxShadow: "0 8px 48px 0 rgba(109,40,217,0.10)",
          }}
        >
          {/* ══ TWO-COLUMN LAYOUT ══ */}
          <div className="flex flex-col md:flex-row">

            {/* ════════════ LEFT PANEL ════════════ */}
            <div
              className="flex flex-col items-center border-r border-gray-100 flex-shrink-0"
              style={{ width: 300, padding: "44px 36px 40px" }}
            >
              {/* Avatar — large rounded square gradient */}
              <div
                className={`flex items-center justify-center rounded-[20px] bg-gradient-to-br ${getGrad(instructor.name)} overflow-hidden mb-5`}
                style={{
                  width: 148,
                  height: 148,
                  boxShadow: "0 6px 24px rgba(109,40,217,0.22)",
                }}
              >
                {instructor.avatar ? (
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-white font-black select-none"
                    style={{ fontSize: 46, letterSpacing: 1 }}
                  >
                    {getInitials(instructor.name)}
                  </span>
                )}
              </div>

              {/* Name + verified badge */}
              <div className="flex items-center gap-1.5 mb-2 text-center">
                <span className="text-[22px] font-extrabold text-gray-900 leading-tight">
                  {instructor.name}
                </span>
                <BadgeCheck className="w-6 h-6 text-blue-500 flex-shrink-0" />
              </div>

              {/* MENTOR pill */}
              <span
                className="text-[11px] font-bold uppercase tracking-widest rounded-full border px-5 py-1 mb-2"
                style={
                  isMentor
                    ? { background: "#f0edff", color: "#7c3aed", borderColor: "#e0d9ff" }
                    : { background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }
                }
              >
                {instructor.role}
              </span>

              {/* Specialization */}
              <span
                className="font-bold uppercase mb-7 text-center"
                style={{ fontSize: 11, letterSpacing: "0.18em", color: "#7c3aed" }}
              >
                {instructor.spec}
              </span>

              {/* CTA button */}
              <button
                onClick={() =>
                  router.push(
                    `/student-dashboard/request?role=${instructor.role.toLowerCase()}&mentorId=${instructor.id}`
                  )
                }
                className="w-full flex items-center justify-center gap-2 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)",
                  padding: "15px 20px",
                  fontSize: 15,
                  marginBottom: 10,
                  boxShadow: "0 4px 16px rgba(124,58,237,0.38)",
                }}
              >
                <CalendarDays className="w-[1px] h-[18px]" />
                Request {isMentor ? "Mentorship" : "Tutoring"}
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>

              {/* Subtitle under button */}
              <p className="text-xs text-center leading-relaxed mb-8" style={{ color: "#9ca3af" }}>
                Send a request to schedule<br />a private session with {fn}.
              </p>

              {/* Trophy / tagline card */}
              <div
                className="w-full rounded-2xl flex items-center gap-3"
                style={{
                  background: "#fafafa",
                  border: "1px solid #efefef",
                  padding: "14px 16px",
                }}
              >
                {/* Trophy SVG illustration */}
                <div className="flex-shrink-0" style={{ width: 54, height: 58 }}>
                  <svg viewBox="0 0 54 58" width="54" height="58" fill="none">
                    {/* base platform */}
                    <rect x="13" y="49" width="28" height="6" rx="3" fill="#7c3aed" />
                    {/* stem */}
                    <rect x="22" y="38" width="10" height="12" rx="2" fill="#d97706" />
                    {/* cup bottom ellipse */}
                    <ellipse cx="27" cy="38" rx="13" ry="4" fill="#b45309" />
                    {/* cup body */}
                    <rect x="14" y="12" width="26" height="26" rx="5" fill="#fbbf24" />
                    {/* cup top ellipse */}
                    <ellipse cx="27" cy="12" rx="13" ry="5" fill="#fcd34d" />
                    {/* handles */}
                    <path d="M14 17 Q5 17 5 25 Q5 33 14 33" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M40 17 Q49 17 49 25 Q49 33 40 33" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* star */}
                    <polygon
                      points="27,6 29,11 34,11 30,14.5 31.5,20 27,17 22.5,20 24,14.5 20,11 25,11"
                      fill="#fde68a"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 leading-snug mb-2.5" style={{ fontSize: 13 }}>
                    Empowering learners<br />to achieve more.
                  </p>
                  {/* Stacked avatars */}
                  <div className="flex items-center">
                    {[
                      { bg: "#f97316" },
                      { bg: "#3b82f6" },
                      { bg: "#22c55e" },
                    ].map(({ bg }, i) => (
                      <span
                        key={i}
                        className="rounded-full border-2 border-white flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          background: bg,
                          marginLeft: i === 0 ? 0 : -9,
                          position: "relative",
                          zIndex: 3 - i,
                        }}
                      />
                    ))}
                    <span
                      className="font-semibold rounded-full"
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        color: "#7c3aed",
                        background: "#ede9fe",
                        padding: "2px 9px",
                      }}
                    >
                      +{Math.max(instructor.followers, 128)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════ RIGHT PANEL ════════════ */}
            <div className="flex-1 flex flex-col" style={{ padding: "40px 40px 40px" }}>

              {/* ── STATS ROW ── */}
              {/* 3 cells, no outer border, separated by thin vertical lines */}
              <div
                className="flex items-center mb-8 pb-8"
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                {/* Followers */}
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 48, height: 48, background: "#f5f3ff" }}
                  >
                    <Users className="w-[22px] h-[22px]" style={{ color: "#7c6aed" }} />
                  </span>
                  <div>
                    <div className="font-black text-gray-900 leading-none" style={{ fontSize: 26 }}>
                      {instructor.followers}
                    </div>
                    <div className="font-bold uppercase tracking-widest" style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                      Followers
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 52, background: "#f3f4f6" }} />

                {/* Courses */}
                <div className="flex items-center gap-3 flex-1" style={{ paddingLeft: 32 }}>
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 48, height: 48, background: "#f5f3ff" }}
                  >
                    <BookOpen className="w-[22px] h-[22px]" style={{ color: "#7c6aed" }} />
                  </span>
                  <div>
                    <div className="font-black text-gray-900 leading-none" style={{ fontSize: 26 }}>
                      {instructor.coursesCount}
                    </div>
                    <div className="font-bold uppercase tracking-widest" style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                      Courses
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 52, background: "#f3f4f6" }} />

                {/* Reviews */}
                <div className="flex items-center gap-3 flex-1" style={{ paddingLeft: 32 }}>
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 48, height: 48, background: "#fffbeb" }}
                  >
                    <Star className="w-[22px] h-[22px] fill-yellow-300" style={{ color: "#f59e0b" }} />
                  </span>
                  <div>
                    <div className="font-black text-gray-900 leading-none" style={{ fontSize: 26 }}>
                      {instructor.rating}
                    </div>
                    <div className="font-bold uppercase tracking-widest" style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                      Reviews
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
                      ({instructor.reviews} Reviews)
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ABOUT SECTION ── */}
              <div className="mb-8">
                <h2 className="font-extrabold text-gray-900 mb-1" style={{ fontSize: 18 }}>
                  About {fn}
                </h2>
                {/* violet underline */}
                <div style={{ width: 36, height: 3, background: "#7c3aed", borderRadius: 9, marginBottom: 14 }} />
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: instructor.bio.includes("hasn't provided") ? "#9ca3af" : "#4b5563",
                  }}
                >
                  {instructor.bio}
                </p>
              </div>

              {/* ── INFO CARDS 2×2 ── */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={<Mail className="w-5 h-5" style={{ color: "#7c6aed" }} />}
                  label="CONTACT"
                  value={instructor.email || "Hidden"}
                />
                <InfoCard
                  icon={<MapPin className="w-5 h-5" style={{ color: "#7c6aed" }} />}
                  label="LOCATION"
                  value={instructor.country || "Not specified"}
                />
                <InfoCard
                  icon={<User className="w-5 h-5" style={{ color: "#7c6aed" }} />}
                  label="EXPERIENCE LEVEL"
                  value="Expert"
                />
                <InfoCard
                  icon={<CalendarDays className="w-5 h-5" style={{ color: "#7c6aed" }} />}
                  label="MEMBER SINCE"
                  value={String(year)}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER NOTE ── */}
      <div className="flex items-center justify-center gap-2 pb-8" style={{ fontSize: 14, color: "#6b7280" }}>
        <BookOpen className="w-5 h-5" style={{ color: "#7c3aed" }} />
        <span>
          Check out the{" "}
          <a href="/search" className="font-semibold hover:underline" style={{ color: "#7c3aed" }}>
            search page
          </a>{" "}
          to find courses published by {fn}.
        </span>
      </div>
    </div>
  );
}

/* ── Info card component ── */
function InfoCard({ icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-white"
      style={{
        border: "1px solid #efefef",
        padding: "16px 18px",
      }}
    >
      {/* circular icon bg */}
      <span
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 44, height: 44, background: "#f0edff" }}
      >
        {icon}
      </span>
      <div>
        <div
          className="font-bold uppercase"
          style={{ fontSize: 10, letterSpacing: "0.13em", color: "#9ca3af", marginBottom: 3 }}
        >
          {label}
        </div>
        <div className="font-semibold text-gray-900" style={{ fontSize: 14 }}>
          {value}
        </div>
      </div>
    </div>
  );
}