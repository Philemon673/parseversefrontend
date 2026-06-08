"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Users,
  BookOpen,
  Star,
  BadgeCheck,
  Mail,
  MapPin,
  CalendarDays,
  Award,
  Video,
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500", "bg-rose-500", "bg-teal-500",
];

function initials(name) {
  if (!name) return "U";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export default function InstructorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInstructor() {
      try {
        setLoading(true);
        // We fetch the user by ID
        const user = await api.get(`/users/${id}`);
        
        if (!user || (user.role !== "MENTOR" && user.role !== "TUTOR")) {
          throw new Error("Instructor not found");
        }

        const getAvatarUrl = (url) => {
          if (!url) return null;
          if (url.startsWith("http")) return url;
          if (url.startsWith("/")) url = url.slice(1);
          return `http://localhost:3001/${url}`;
        };

        const formattedInstructor = {
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          role: user.role === "MENTOR" ? "Mentor" : "Tutor",
          spec: user.interests?.length > 0 ? user.interests[0] : "Generalist",
          bio: user.bio || "This instructor hasn't provided a bio yet.",
          email: user.email,
          country: user.country,
          joined: user.createdAt,
          followers: user.stats?.followers || 0,
          coursesCount: user._count?.courses || user.stats?.courses || 0,
          rating: 5.0, // Hardcoded for display until rating system is fully implemented
          reviews: user.stats?.reviews || 0,
          avatar: getAvatarUrl(user.avatar)
        };

        setInstructor(formattedInstructor);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load instructor profile.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchInstructor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-white transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Header Banner */}
      <div className="h-64 w-full relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[2.5rem] shadow-sm">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      {/* Profile Content Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-8">
          
          {/* Avatar & Action Section (Left) */}
          <div className="flex flex-col items-center w-full md:w-64 flex-shrink-0">
            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-indigo-100/50 bg-white mb-5 -mt-16">
              {instructor.avatar ? (
                <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-white text-5xl font-black ${avatarColor(instructor.name)}`}>
                  {initials(instructor.name)}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-900 text-center flex items-center gap-1.5 mb-1">
              {instructor.name}
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            </h1>
            
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 ${
              instructor.role === "Mentor" 
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}>
              {instructor.role}
            </span>

            <p className="text-sm font-semibold text-indigo-500/80 uppercase tracking-widest text-center mb-6">
              {instructor.spec}
            </p>

            <button
              onClick={() => router.push(`/student-dashboard/request?role=${instructor.role.toLowerCase()}&mentorId=${instructor.id}`)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Request {instructor.role === "Mentor" ? "Mentorship" : "Tutoring"}
            </button>
            
            <p className="text-[10px] text-slate-400 mt-3 text-center px-4">
              Send a request to schedule a private session with {instructor.name.split(' ')[0]}.
            </p>
          </div>

          {/* Details Section (Right) */}
          <div className="flex-1 flex flex-col pt-2">
            
            {/* Stats Row */}
            <div className="flex items-center gap-8 pb-8 border-b border-slate-100">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-2xl font-black text-slate-800">
                  {instructor.followers} <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Followers</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-2xl font-black text-slate-800">
                  {instructor.coursesCount} <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Courses</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-2xl font-black text-slate-800">
                  {instructor.rating} <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({instructor.reviews} Reviews)</span>
              </div>
            </div>

            {/* About Section */}
            <div className="py-8 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">About {instructor.name.split(' ')[0]}</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {instructor.bio}
              </p>
            </div>

            {/* Info Grid */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
                  <p className="text-sm font-semibold text-slate-700">{instructor.email || "Hidden"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold text-slate-700">{instructor.country || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <Award className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Level</p>
                  <p className="text-sm font-semibold text-slate-700">Expert</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {instructor.joined ? new Date(instructor.joined).getFullYear() : "2024"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Note about courses */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex items-center justify-center mb-8">
          <p className="text-indigo-600/80 text-sm font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Check out the search page to find courses published by {instructor.name.split(' ')[0]}.
          </p>
        </div>

      </div>
    </div>
  );
}
