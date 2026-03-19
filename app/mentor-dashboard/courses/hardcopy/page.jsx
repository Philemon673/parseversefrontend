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
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Printer,
  Maximize,
  Minimize,
  X,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const coursesData = [
  {
    id: 0,
    title: "Complete JavaScript Course",
    updated: "Updated 5 days ago",
    lessons: 55,
    pages: 245,
    rating: 4.5,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedPages: 120,
    totalPages: 245,
    percent: 88,
    likes: "1.5k",
    shares: 6,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
    pdfUrl: "/sample.pdf",
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
    pages: 320,
    rating: 4,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedPages: 320,
    totalPages: 320,
    percent: 100,
    likes: "1.2k",
    shares: 4,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    pdfUrl: "/python.pdf",
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
    pages: 420,
    rating: 3.5,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedPages: 210,
    totalPages: 420,
    percent: 50,
    likes: "890",
    shares: 3,
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    pdfUrl: "/datascience.pdf",
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
    pages: 280,
    rating: 4,
    instructor: "Mashok Khan",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    completedPages: 168,
    totalPages: 280,
    percent: 60,
    likes: "2.1k",
    shares: 8,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    pdfUrl: "/react.pdf",
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
    text: "My skills have seriously improved after these lessons, thank you!!",
    likes: 15,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 3,
    name: "Lisa M.",
    time: "1Wk ago",
    text: "The explanations are detailed yet easy to follow! Your teaching-style is clear",
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
          src={course.thumbnail}
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
          <span>{course.pages} Pages</span>
          <span className="text-slate-300">·</span>
          <span>{course.lessons} Lessons</span>
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

export default function CourseReaderPage() {
  const [activeCourseId, setActiveCourseId] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(commentsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
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
    setCurrentPage(1);
    setZoom(100);
    setIsFullscreen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 10, 200));
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 10, 50));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, currentCourse.totalPages));
  }

  function handlePrevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // Entering fullscreen - reset zoom to fit screen
      setZoom(100);
    }
  }

  return (
    <div
      className="min-h-screen p-4 flex flex-col gap-4"
      
    >
      {/* Fullscreen PDF Viewer Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Fullscreen Header */}
          <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-white font-semibold text-sm">{currentCourse.title}</h2>
                <p className="text-slate-400 text-xs">Page {currentPage} of {currentCourse.totalPages}</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Fullscreen PDF Content */}
          <div className="flex-1 overflow-auto bg-slate-800 flex items-center justify-center p-8">
            <div 
              className="bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{ 
                width: `${zoom}%`, 
                maxWidth: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="w-full aspect-[8.5/11] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-12">
                <FileText className="w-24 h-24 text-indigo-400 mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-3">{currentCourse.title}</h3>
                <p className="text-lg text-slate-500 mb-4">Page {currentPage} of {currentCourse.totalPages}</p>
                <div className="mt-8 space-y-3 w-full max-w-2xl">
                  <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-4/6"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-3/6"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                  <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                </div>
                <p className="text-sm text-slate-400 mt-12">
                  Replace with actual PDF embed or viewer
                </p>
              </div>
            </div>
          </div>

          {/* Fullscreen Controls */}
          <div className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Page Navigation */}
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= currentCourse.totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  className="w-16 px-3 py-2 text-sm text-center bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-400">/ {currentCourse.totalPages}</span>
              </div>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === currentCourse.totalPages}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Zoom Controls */}
              <button 
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm text-white w-16 text-center font-medium">{zoom}%</span>
              <button 
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>

              <div className="w-px h-8 bg-slate-700 mx-2"></div>

              {/* Action Buttons */}
              <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">
                <Printer className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition"
              >
                <Minimize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* ── Left Column ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* PDF Viewer */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* PDF Display Area */}
            <div className="relative bg-slate-100" style={{ paddingBottom: "70%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* PDF Preview/Placeholder */}
                <div 
                  className="bg-white rounded-lg overflow-hidden"
                  style={{ 
                    width: `${zoom}%`, 
                    height: `${zoom}%`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
                    <FileText className="w-20 h-20 text-indigo-400 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">{currentCourse.title}</h3>
                    <p className="text-sm text-slate-500">Page {currentPage} of {currentCourse.totalPages}</p>
                    <div className="mt-6 space-y-2 w-full max-w-md">
                      <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-5/6"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-4/6"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-full"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-3/6"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-8">
                      Replace with actual PDF embed or viewer
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Right Menu */}
              <button 
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-slate-50 transition shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* PDF Controls */}
            <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Page Navigation */}
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= currentCourse.totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-14 px-2 py-1 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <span className="text-sm text-slate-500">/ {currentCourse.totalPages}</span>
                </div>

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === currentCourse.totalPages}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Zoom Controls */}
                <button 
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
                >
                  <ZoomOut className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-sm text-slate-600 w-12 text-center">{zoom}%</span>
                <button 
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
                >
                  <ZoomIn className="w-4 h-4 text-slate-600" />
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                {/* Action Buttons */}
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                  <Printer className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Reading Progress</span>
                <span className="text-xs font-semibold text-indigo-600">{currentCourse.percent}%</span>
              </div>
              <ProgressBar value={currentCourse.percent} />
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentCourse.instructorAvatar}
                  alt={currentCourse.instructor}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-indigo-100 shadow-sm"
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight">
                    {currentCourse.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-indigo-600">
                      {currentCourse.instructor}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-xs text-slate-400">{currentCourse.updated}</span>
                  </div>
                </div>
              </div>
              <StarRating rating={currentCourse.rating} />
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="font-medium">{currentCourse.pages} Pages</span>
              <span className="text-slate-300">·</span>
              <span>{currentCourse.lessons} Lessons</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" fill="#f59e0b" stroke="#f59e0b" />
                {currentCourse.percent}%
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-indigo-400" fill="#818cf8" />
                {currentCourse.completedPages} / {currentCourse.totalPages} Pages
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
              <div className="flex flex-col gap-3 py-6">
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{currentCourse.title}.pdf</p>
                    <p className="text-xs text-slate-400">{currentCourse.pages} pages · 12.5 MB</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 transition">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
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