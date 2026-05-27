"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getCourse, getCourseModules } from "@/lib/courseService";
import { getCourseReviews } from "@/lib/reviewService";
import { FileText } from "lucide-react";
import {
  ThumbsUp,
  Heart,
  Share2,
  MoreVertical,
  Star,
  ChevronDown,
  Smile,
  Play,
  SkipForward,
  Volume2,
  Settings,
  Maximize,
  Minimize,
  LayoutTemplate,
  Subtitles,
  X,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const coursesData = [
  {
    id: 0,
    title: "Complete JavaScript Course",
    updated: "Updated 5 days ago",
    lessons: 55,
    hours: "12 hrs",
    rating: 4.5,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedLessons: 27,
    totalLessons: 55,
    percent: 88,
    likes: "1.5k",
    shares: 6,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
    status: null,
    statusColor: "",
    hasCertificate: false,
    progress: 88,
    description: "Master JavaScript from the ground up. This comprehensive course covers everything from variables and functions to advanced topics like async/await, closures, and the DOM. Perfect for beginners and intermediate developers looking to solidify their JavaScript skills.",
    tags: ["JavaScript", "WebDev", "Programming", "Frontend"],
  },
  {
    id: 1,
    title: "Python for Beginners",
    updated: "Updated 5 days ago",
    lessons: 45,
    hours: "12 hrs",
    rating: 4,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedLessons: 45,
    totalLessons: 45,
    percent: 100,
    likes: "1.2k",
    shares: 4,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    status: "module 1",
    statusColor: "bg-yellow-400 text-yellow-900",
    hasCertificate: true,
    progress: 100,
    description: "Learn Python programming from scratch. This beginner-friendly course covers Python basics, data structures, functions, and object-oriented programming. Build real-world projects and gain confidence in Python development.",
    tags: ["Python", "Programming", "Beginner", "Coding"],
  },
  {
    id: 2,
    title: "Data Science with Python",
    updated: "Updated 1 week ago",
    lessons: 32,
    hours: "16 hrs",
    rating: 3.5,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedLessons: 16,
    totalLessons: 32,
    percent: 50,
    likes: "890",
    shares: 3,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    status: "module 2",
    statusColor: "bg-indigo-500 text-white",
    hasCertificate: false,
    progress: 50,
    description: "Dive into data science using Python. Learn data analysis, visualization with matplotlib and seaborn, pandas for data manipulation, and introduction to machine learning with scikit-learn.",
    tags: ["DataScience", "Python", "MachineLearning", "Analytics"],
  },
  {
    id: 3,
    title: "React Development Masterclass",
    updated: "Updated 2 days ago",
    lessons: 30,
    hours: "20 hrs",
    rating: 4,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedLessons: 18,
    totalLessons: 30,
    percent: 60,
    likes: "2.1k",
    shares: 8,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    status: "module 3",
    statusColor: "bg-indigo-500 text-white",
    hasCertificate: false,
    progress: 60,
    description: "Master React.js and build modern web applications. Learn hooks, state management, routing, API integration, and best practices for building scalable React applications.",
    tags: ["React", "WebDev", "JavaScript", "Frontend"],
  },
];

const commentsData = [
  {
    id: 1,
    name: "Sarah Thompson",
    time: "2h ago",
    text: "This is the best explanation of callbacks I've come across. So clear and easy to understand!",
    likes: 9,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 2,
    name: "Kevin Brown",
    time: "1Wk ago",
    text: "My 25 skills have seriously improved after these lessons, thank you!!",
    likes: 15,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 3,
    name: "Lisa M.",
    time: "Wk ago",
    text: "The DOM manipulation lesson was detailed yet easy to follow! Your teaching-style is clear",
    likes: 7,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= Math.floor(rating) ? "#f59e0b" : "none"}
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
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ── Related Course Card ───────────────────────────────────────────────────────

function RelatedCourseCard({ course, isActive, onSelect }) {
  return (
    <div 
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border cursor-pointer transition-all ${
        isActive 
          ? "border-indigo-500 ring-2 ring-indigo-200" 
          : "border-slate-100 hover:border-indigo-300"
      }`}
      onClick={onSelect}
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.status && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-full ${course.statusColor}`}>
            {course.status}
          </span>
        )}
        <div className="absolute -bottom-4 left-3">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-9 h-9 rounded-full border-2 border-white object-cover shadow"
          />
        </div>
        <button 
          className="absolute top-2 right-2 text-white/80 hover:text-white transition"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-6 px-3 pb-3 flex flex-col gap-1.5">
        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
          {course.title}
        </h3>
        <p className="text-[11px] text-slate-400">{course.updated}</p>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
          <span>{course.lessons} Lessons</span>
          <span className="text-slate-300">·</span>
          <span>{course.hours}</span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3" fill="#f59e0b" stroke="#f59e0b" />
            {course.percent}%
          </span>
        </div>

        <ProgressBar value={course.progress} />

        <div className="flex items-center justify-between pt-1">
          <StarRating rating={course.rating} />
          <button 
            className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            View
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[11px] text-slate-500">{course.instructor}</span>
        </div>
      </div>
    </div>
  );
}

// ── Comment Item ──────────────────────────────────────────────────────────────

function CommentItem({ comment }) {
  const [liked, setLiked] = useState(false);
  const [hearted, setHearted] = useState(false);

  return (
    <div className="flex items-start gap-3">
      <img
        src={comment.avatar || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80"}
        alt={comment.name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm">{comment.name}</span>
          <span className="text-xs text-slate-400">{comment.time}</span>
        </div>
        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
          {comment.text}
        </p>
        <div className="flex items-center gap-4 mt-1.5">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 text-xs font-medium transition ${liked ? "text-indigo-600" : "text-slate-400 hover:text-indigo-500"}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {comment.likes + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => setHearted(!hearted)}
            className={`flex items-center gap-1 text-xs font-medium transition ${hearted ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
          >
            <Heart className="w-3.5 h-3.5" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

function CoursePlayerPageContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  
  const [activeTab, setActiveTab] = useState("Description");
  const [replyText, setReplyText] = useState({});
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    async function loadCourseDetails() {
      try {
        setLoading(true);
        // Load Course shell
        const courseData = await getCourse(courseId);
        setCourse(courseData.data || courseData);

        // Load Modules
        const modulesData = await getCourseModules(courseId);
        const mods = modulesData.data || modulesData || [];
        setModules(mods);
        if (mods.length > 0) {
          setSelectedModule(mods[0]);
        }

        // Load Course Reviews
        const reviewsData = await getCourseReviews(courseId);
        setReviews(reviewsData.reviews || reviewsData || []);
      } catch (err) {
        console.error("Failed to load course details for preview", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetails();
  }, [courseId]);

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f2f3fa]">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f2f3fa] text-slate-500">
        <p className="text-base font-bold">Course Not Found</p>
      </div>
    );
  }

  // Calculate ratings breakdown
  const totalReviews = reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // 1 to 5 star count
  let sumRatings = 0;
  
  reviews.forEach((r) => {
    const starIdx = Math.min(Math.max(Math.floor(r.rating) - 1, 0), 4);
    ratingDistribution[starIdx] += 1;
    sumRatings += r.rating;
  });

  const avgRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0";

  // Build the embed video URL for active module
  const getEmbedUrl = (mod) => {
    if (!mod) return null;
    if (mod.videoEmbedUrl) return mod.videoEmbedUrl;
    if (mod.videoId) {
      return `https://iframe.mediadelivery.net/embed/374163/${mod.videoId}`;
    }
    return null;
  };

  const activeEmbedUrl = getEmbedUrl(selectedModule);

  return (
    <div
      className="min-h-screen p-6 flex flex-col gap-6"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #eef2ff 100%)" }}
    >
      {/* Fullscreen Video Player Modal */}
      {isFullscreen && selectedModule && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Fullscreen Header */}
          <div className="bg-black/80 px-6 py-3 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-indigo-500" fill="indigo" />
              <div>
                <h2 className="text-white font-semibold text-sm">{selectedModule.title}</h2>
                <p className="text-slate-400 text-xs">{course.title}</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Fullscreen Video Content */}
          <div className="flex-1 flex items-center justify-center relative">
            {activeEmbedUrl ? (
              <iframe
                src={activeEmbedUrl}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <FileText className="w-16 h-16 text-indigo-400 mb-2" />
                <p className="font-bold text-white text-base">This is a PDF/reading module</p>
                {selectedModule.pdfUrl && (
                  <a href={selectedModule.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-755 transition">
                    Open PDF Document
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Player & Course details */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">
          
          {/* Module content player */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-lg border border-slate-900 flex flex-col">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {selectedModule ? (
                activeEmbedUrl ? (
                  <iframe
                    src={activeEmbedUrl}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-955 text-slate-400 p-6 text-center">
                    <FileText className="w-14 h-14 text-indigo-400 mb-3 animate-pulse" />
                    <h3 className="font-bold text-white text-base leading-tight">{selectedModule.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">This module contains premium reading material instead of a video course.</p>
                    {selectedModule.pdfUrl && (
                      <a 
                        href={selectedModule.pdfUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-900"
                      >
                        View PDF Document
                      </a>
                    )}
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0e12] text-slate-500">
                  <Play className="w-12 h-12 text-slate-600 mb-2" />
                  <p className="text-xs font-semibold">No modules uploaded yet for this course</p>
                </div>
              )}
            </div>

            {/* In-player Controls if a video is active */}
            {selectedModule && activeEmbedUrl && (
              <div className="bg-[#0b0c10] px-5 py-3.5 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] bg-red-650 text-white font-black px-2 py-0.5 rounded tracking-wider">LIVE PREVIEW</span>
                  <span className="text-white/80 font-bold text-xs truncate max-w-xs">{selectedModule.title}</span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Maximize className="w-3.5 h-3.5" /> Fullscreen
                </button>
              </div>
            )}
          </div>

          {/* Course Details Info Box */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow">
                  {course.instructor?.firstName?.charAt(0) || "I"}
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    by <span className="text-indigo-600 font-bold">{course.instructor?.firstName} {course.instructor?.lastName}</span> · {course.category} Course
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-yellow-50 px-3.5 py-1.5 rounded-2xl border border-yellow-100">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-black text-slate-800">{avgRating}</span>
                <span className="text-[10px] text-slate-400 font-bold">({totalReviews} Reviews)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
              {course.description || "No description provided for this course."}
            </p>

            {/* Course details subtabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mt-2">
              {["Description", "Comments", "Attachment"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-400 hover:text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  {tab === "Comments" ? `Student Reviews (${totalReviews})` : tab}
                </button>
              ))}
            </div>

            {/* Subtab contents */}
            {activeTab === "Description" && (
              <div className="flex flex-col gap-3 py-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Level</span>
                    <span className="text-xs font-bold text-slate-700">{course.level || "Beginner"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Price</span>
                    <span className="text-xs font-bold text-slate-700">{course.isFree ? "Free" : `$${course.price}`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Modules</span>
                    <span className="text-xs font-bold text-slate-700">{modules.length} modules</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Enrolled Students</span>
                    <span className="text-xs font-bold text-slate-700">{course._count?.enrollments || 0} students</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="flex flex-col gap-6 py-2">
                {/* Reviews Stats Breakdown Dashboard */}
                <div className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex flex-col items-center justify-center text-center px-4 border-r border-slate-150">
                    <span className="text-3xl font-black text-slate-800">{avgRating}</span>
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-3.5 h-3.5" 
                          fill={star <= Math.floor(Number(avgRating)) ? "#f59e0b" : "none"} 
                          stroke="#f59e0b" 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{totalReviews} Ratings</span>
                  </div>

                  {/* Histogram ratings bars */}
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {ratingDistribution.map((count, index) => {
                      const starNum = index + 1;
                      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                      return (
                        <div key={starNum} className="flex items-center gap-3 text-xs">
                          <span className="text-slate-550 font-bold w-3">{starNum}</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-slate-400 w-8 text-right font-semibold">{percentage}%</span>
                        </div>
                      );
                    }).reverse()}
                  </div>
                </div>

                {/* List of reviews */}
                <div className="flex flex-col gap-5">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 flex flex-col gap-3 hover:border-indigo-100 hover:bg-slate-50/20 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-extrabold text-xs">
                              {rev.user ? rev.user.firstName.charAt(0) : "S"}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs leading-snug">
                                {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : "Student"}
                              </h4>
                              <p className="text-[9px] text-slate-400 font-bold">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 bg-yellow-50/60 px-2 py-0.5 rounded-lg border border-yellow-100">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-black text-slate-800">{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No ratings or feedback reviews posted yet for this course.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Attachment" && (
              <div className="flex flex-col gap-2 items-center justify-center py-8 text-slate-400 text-xs">
                <FileText className="w-8 h-8 text-slate-350" />
                <p className="font-bold">No attachment links uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course syllabus Modules list */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3.5 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-black text-slate-800 text-sm">Course syllabus</h2>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">{modules.length} Modules Uploaded</p>
          </div>
          
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {modules.length > 0 ? (
              modules.map((mod, idx) => (
                <ModuleSidebarItem
                  key={mod.id}
                  module={mod}
                  index={idx}
                  isActive={selectedModule?.id === mod.id}
                  onSelect={() => {
                    setSelectedModule(mod);
                    setPlaying(false);
                  }}
                  category={course.category}
                />
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No syllabus modules created yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Simple Helper component for sidebar module items ───────────────────────
function ModuleSidebarItem({ module, index, isActive, onSelect, category }) {
  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 ${
        isActive
          ? "bg-indigo-50/50 border-indigo-500 shadow-sm"
          : "bg-white border-slate-100 hover:border-indigo-300"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs ${
        isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-150" : "bg-slate-50 text-slate-500 border border-slate-100"
      }`}>
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={`font-bold text-xs leading-snug truncate ${isActive ? "text-indigo-600" : "text-slate-800"}`}>
          {module.title}
        </h4>
        <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider font-extrabold">
          {category === "Video" ? "Video Lesson" : "Reading Lecture"}
        </p>
      </div>
    </div>
  );
}

export default function CoursePlayerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f2f3fa]">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    }>
      <CoursePlayerPageContent />
    </Suspense>
  );
}