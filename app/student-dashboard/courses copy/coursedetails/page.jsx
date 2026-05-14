"use client";

import { useState } from "react";
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
        src={comment.avatar}
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CoursePlayerPage() {
  const [activeCourseId, setActiveCourseId] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(commentsData);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get current course based on active ID
  const currentCourse = coursesData.find(course => course.id === activeCourseId) || coursesData[0];
  
  // Get other courses for the sidebar (excluding current)
  const relatedCourses = coursesData.filter(course => course.id !== activeCourseId);

  function handleAddComment() {
    if (!comment.trim()) return;
    setAllComments((prev) => [
      {
        id: Date.now(),
        name: "You",
        time: "just now",
        text: comment.trim(),
        likes: 0,
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
      },
      ...prev,
    ]);
    setComment("");
  }

  function handleCourseSelect(courseId) {
    setActiveCourseId(courseId);
    setActiveTab("Description");
    setPlaying(false);
    setIsFullscreen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  return (
    <div
      className="min-h-screen p-4 flex flex-col gap-4"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #eef2ff 100%)" }}
    >
      {/* Fullscreen Video Player Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Fullscreen Header */}
          <div className="bg-black/80 px-6 py-3 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-red-500" fill="red" />
              <div>
                <h2 className="text-white font-semibold text-sm">{currentCourse.title}</h2>
                <p className="text-slate-400 text-xs">{currentCourse.instructor}</p>
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
            <img
              src={currentCourse.image}
              alt="course video"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPlaying(!playing)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center group-hover:bg-white/30 transition backdrop-blur-sm">
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </button>
          </div>

          {/* Fullscreen Controls */}
          <div className="bg-black/80 px-6 py-4 absolute bottom-0 left-0 right-0 z-10">
            <div className="flex flex-col gap-3">
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${currentCourse.percent}%` }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-white/80 transition">
                    <Play className="w-5 h-5" fill="white" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <span className="text-white/90 text-sm font-medium">21:18 / {currentCourse.hours}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-white/80 transition">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <LayoutTemplate className="w-5 h-5" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <Subtitles className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-white/80 transition"
                  >
                    <Minimize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* ── Left Column ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: "52%" }}>
              <img
                src={currentCourse.image}
                alt="course video"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <button 
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center group-hover:bg-white/30 transition">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </button>
            </div>

            <div className="bg-black px-4 py-2 flex flex-col gap-1.5">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${currentCourse.percent}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="text-white hover:text-white/80 transition">
                    <Play className="w-4 h-4" fill="white" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-white/70 text-xs">21:18</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-white hover:text-white/80 transition">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <LayoutTemplate className="w-4 h-4" />
                  </button>
                  <button className="text-white hover:text-white/80 transition">
                    <Subtitles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-white/80 transition"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">

            {/*  Title + Instructor side by side */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">

                {/* Instructor avatar */}
                <img
                  src={currentCourse.instructorAvatar}
                  alt={currentCourse.instructor}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-indigo-100 shadow-sm"
                />

                {/* Title + instructor name + updated */}
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight">
                    {currentCourse.title}
                  </h1>
                  {/*  instructor name beside title below */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-indigo-600">
                      {currentCourse.instructor}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-xs text-slate-400">{currentCourse.updated}</span>
                  </div>
                </div>
              </div>

              {/* Star rating top right */}
              <StarRating rating={currentCourse.rating} />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="font-medium">{currentCourse.lessons} Lessons</span>
              <span className="text-slate-300">·</span>
              <span>{currentCourse.hours}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" fill="#f59e0b" stroke="#f59e0b" />
                {currentCourse.percent}%
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-indigo-400" fill="#818cf8" />
                {currentCourse.completedLessons} / {currentCourse.totalLessons} Lessons · {currentCourse.percent}%
              </span>
              <span className="text-slate-300">·</span>
              <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition">
                <ThumbsUp className="w-3.5 h-3.5" />
                {currentCourse.likes}
              </button>
              <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition">
                <Share2 className="w-3.5 h-3.5" />
                {currentCourse.shares} Share
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
              {["Description", "Comments", "Attachment"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "px-4 py-1.5 rounded-xl text-sm font-semibold transition " +
                    (activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")
                  }
                >
                  {tab}
                  {tab === "Comments" && (
                    <span className="ml-1.5 text-xs font-bold">
                      {allComments.length}
                    </span>
                  )}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span>Sort by :</span>
                  <span className="font-medium ml-1">Recent</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                </div>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "Description" && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentCourse.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentCourse.tags && currentCourse.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80"
                    alt="you"
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400"
                    />
                    <button 
                      className="text-slate-400 hover:text-slate-600 transition"
                      onClick={handleAddComment}
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {allComments.map((c) => (
                    <CommentItem key={c.id} comment={c} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Attachment" && (
              <div className="flex flex-col gap-2 items-center justify-center py-8">
                <p className="text-sm text-slate-400">No attachments available for this course</p>
              </div>
            )}
            
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <h2 className="font-bold text-slate-800 text-base">Course Modules</h2>
          {relatedCourses.map((course) => (
            <RelatedCourseCard 
              key={course.id} 
              course={course}
              isActive={course.id === activeCourseId}
              onSelect={() => handleCourseSelect(course.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}