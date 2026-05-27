"use client";

import { useState, useEffect } from "react";
import {
  ThumbsUp,
  Heart,
  Share2,
  MoreVertical,
  Star,
  ChevronDown,
  Smile,
  FileText,
  Maximize,
  Minimize,
  X,
  CheckCircle,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCourse, getCourseModules, getCourseProgress, updateCourseProgress } from "@/lib/courseService";

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
        className="h-full rounded-full bg-indigo-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ── Module Item Sidebar ───────────────────────────────────────────────────────

function ModuleItem({ module, isActive, isCompleted, onSelect }) {
  return (
    <div 
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border cursor-pointer transition-all p-3 flex flex-col gap-2 ${
        isActive 
          ? "border-indigo-500 ring-2 ring-indigo-200" 
          : "border-slate-100 hover:border-indigo-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2">{module.title}</h3>
        {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Document
        </span>
        <span className="text-slate-300">•</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
          {isActive ? 'READING' : module.status}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CourseReaderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const initialSectionId = searchParams.get("sectionId");
  const initialLessonId = searchParams.get("lessonId"); 
  
  const [activeTab, setActiveTab] = useState("Description");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    async function loadData() {
      try {
        setLoading(true);
        const [courseData, modulesData, progressData] = await Promise.all([
          getCourse(courseId),
          getCourseModules(courseId),
          getCourseProgress(courseId)
        ]);
        
        setCourse(courseData);
        const modulesList = Array.isArray(modulesData) ? modulesData : [];
        setModules(modulesList);
        setProgress(progressData);
        
        // Determine initial module to read
        let targetModule = modulesList[0];
        if (initialLessonId) {
          const found = modulesList.find(m => m.id === initialLessonId);
          if (found) targetModule = found;
        } else if (progressData?.completedLessons > 0 && progressData.completedLessons < modulesList.length) {
          targetModule = modulesList[progressData.completedLessons];
        }
        
        setActiveModule(targetModule);
      } catch (err) {
        console.error("Failed to load course reader data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, initialLessonId]);

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

  function handleModuleSelect(module) {
    setActiveModule(module);
    setActiveTab("Description");
    setIsFullscreen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleMarkComplete() {
    if (!courseId || !activeModule || updatingProgress) return;
    setUpdatingProgress(true);
    try {
      const activeIndex = modules.findIndex(m => m.id === activeModule.id);
      const newCompletedCount = Math.max(progress?.completedLessons || 0, activeIndex + 1);
      
      await updateCourseProgress(courseId, newCompletedCount);
      setProgress(prev => ({ ...prev, completedLessons: newCompletedCount }));
      
      // Auto-play next module if available
      if (activeIndex + 1 < modules.length) {
        setActiveModule(modules[activeIndex + 1]);
      } else {
        alert("Congratulations! You have completed all reading materials.");
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
      alert("Failed to mark as completed. Try again.");
    } finally {
      setUpdatingProgress(false);
    }
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
        <p className="text-slate-500 font-medium">Course not found or access denied.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const completedCount = progress?.completedLessons || 0;
  const totalCount = modules.length || 1;
  const percentComplete = Math.round((completedCount / totalCount) * 100);
  const instructorName = course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Instructor";

  // Use module's signedPdfUrl if available, otherwise fallback to course's signedPdfUrl
  const currentPdfUrl = activeModule?.signedPdfUrl || course.signedPdfUrl;

  return (
    <div
      className="min-h-screen p-4 flex flex-col gap-4"
      style={{ background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #eef2ff 100%)" }}
    >
      {/* Fullscreen PDF Reader Modal */}
      {isFullscreen && currentPdfUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
          <div className="bg-slate-900/90 px-6 py-3 flex items-center justify-between absolute top-0 left-0 right-0 z-10 pointer-events-none backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-white font-semibold text-sm">{activeModule?.title || course.title}</h2>
                <p className="text-slate-400 text-xs">{course.title}</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition pointer-events-auto"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 w-full h-full pt-14">
            <iframe
              src={currentPdfUrl}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
              title={activeModule?.title || course.title}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start flex-col lg:flex-row">

        {/* ── Left Column ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 w-full">

          {/* Reader Header Actions */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={() => router.back()} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition flex items-center gap-2">
              <X className="w-4 h-4" /> Exit Reader
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <div className="w-32">
                <ProgressBar value={percentComplete} />
              </div>
              <span className="text-sm font-bold text-indigo-600">{percentComplete}%</span>
            </div>
          </div>

          {/* PDF Reader */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative h-[650px]">
            {currentPdfUrl ? (
              <iframe
                src={currentPdfUrl}
                className="absolute inset-0 w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
                title={activeModule?.title || course.title}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
                <FileText className="w-12 h-12 text-slate-300" />
                <p className="text-slate-400 font-medium">No document attached to this material yet.</p>
              </div>
            )}
            
            {/* Custom Fullscreen Overlay Button */}
            {currentPdfUrl && (
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-800/60 hover:bg-slate-800/90 backdrop-blur-md rounded-xl flex items-center justify-center transition shadow-lg"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* Next Action Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">{activeModule?.title || course.title || "Document"}</h2>
              <p className="text-slate-500 text-sm">Part of: {course.title}</p>
            </div>
            <button
              onClick={handleMarkComplete}
              disabled={updatingProgress || (!activeModule && modules.length > 0)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProgress ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {updatingProgress ? "Updating..." : "Mark as Read"}
            </button>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">

            {/*  Title + Instructor side by side */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border-2 border-indigo-200 shadow-sm flex-shrink-0">
                  {instructorName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-indigo-600">
                      {instructorName}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{course.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2 mt-2">
              {["Description", "Comments"].map((tab) => (
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
            </div>

            {/* Tab Content */}
            {activeTab === "Description" && (
              <div className="flex flex-col gap-4 py-2">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">Document Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeModule?.description || "No description provided for this reading material."}
                  </p>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">Course Overview</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {course.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                    U
                  </div>
                  <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                    <input
                      type="text"
                      placeholder="Add a comment or ask a question..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400 text-slate-700"
                    />
                    <button 
                      className="text-indigo-600 hover:text-indigo-700 font-bold text-sm transition"
                      onClick={handleAddComment}
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  {allComments.length > 0 ? allComments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                       <img src={c.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                       <div>
                         <div className="flex items-baseline gap-2">
                           <span className="font-bold text-sm text-slate-800">{c.name}</span>
                           <span className="text-xs text-slate-400">{c.time}</span>
                         </div>
                         <p className="text-sm text-slate-600 mt-0.5">{c.text}</p>
                       </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to start the discussion!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h2 className="font-bold text-slate-800 text-base flex items-center justify-between">
              Reading Materials
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                {completedCount}/{totalCount}
              </span>
            </h2>
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {modules.length > 0 ? modules.map((mod, index) => {
                const isCompleted = index < completedCount;
                return (
                  <ModuleItem 
                    key={mod.id} 
                    module={mod}
                    isActive={activeModule?.id === mod.id}
                    isCompleted={isCompleted}
                    onSelect={() => handleModuleSelect(mod)}
                  />
                )
              }) : (
                <p className="text-sm text-slate-400 py-4 text-center">No modules found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}