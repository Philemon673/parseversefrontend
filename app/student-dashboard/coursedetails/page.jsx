"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  FlaskConical,
  Download,
  Award,
  Infinity,
  Play,
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Globe,
  BarChart2,
  ChevronRight,
  Bell,
  Search,
  UserCircle,
  MonitorPlay,
  Tag,
  FileText,
} from "lucide-react";
import PaymentModal from "./PaymentModal";

// ── Static Data ───────────────────────────────────────────────────────────────

const course = {
  id: 1,
  title: "Docker & Kubernetes\nThe Complete Guide",
  subtitle: "Build, deploy and scale production-ready applications with Docker & Kubernetes",
  level: "INTERMEDIATE",
  rating: 4.8,
  ratingCount: "14,239",
  students: "12,428",
  type: "Video", // "Video" or "Hardcopy"
  instructor: {
    name: "John Smiga",
    role: "Senior Developer & Instructor",
    avatar: "JS",
  },
  originalPrice: 79,
  discountedPrice: 49,
  discountPercent: 38,
  guarantee: "30-Day Money-Back Guarantee",
  includes: [
    { icon: MonitorPlay, text: "18 hours on-demand video" },
    { icon: FlaskConical, text: "Hands-on labs (12)" },
    { icon: Download, text: "Downloadable resources" },
    { icon: Award, text: "Certificate of completion" },
    { icon: Infinity, text: "Lifetime access" },
  ],
  tabs: ["Overview", "Curriculum", "Instructor", "Reviews (4,236)", "FAQ"],
  learnings: [
    "Build and containerize applications with Docker",
    "Orchestrate containers using Kubernetes",
    "Deploy to production environments",
    "Manage volumes, networks & secrets",
    "Understand Kubernetes architecture",
    "Work with Kubernetes primitives",
    "Debug and troubleshoot applications",
    "Best practices for dev & ops",
  ],
  sections: [
    { 
      id: 1, 
      title: "Introduction", 
      lessons: 4, 
      duration: "45 min", 
      expanded: false,
      lessonList: [
        { id: 1, title: "Welcome to the Course", duration: "5:30", type: "video", preview: true },
        { id: 2, title: "Course Overview & Prerequisites", duration: "12:45", type: "video", preview: false },
        { id: 3, title: "Setting Up Your Development Environment", duration: "18:20", type: "video", preview: false },
        { id: 4, title: "Introduction Quiz", duration: "8:00", type: "quiz", preview: false },
      ]
    },
    { 
      id: 2, 
      title: "Docker Basics", 
      lessons: 8, 
      duration: "2h 10m", 
      expanded: false,
      lessonList: [
        { id: 1, title: "What is Docker?", duration: "10:15", type: "video", preview: true },
        { id: 2, title: "Installing Docker", duration: "15:30", type: "video", preview: false },
        { id: 3, title: "Docker Images vs Containers", duration: "18:45", type: "video", preview: false },
        { id: 4, title: "Running Your First Container", duration: "20:10", type: "video", preview: false },
        { id: 5, title: "Docker Commands Cheat Sheet", duration: "5:00", type: "article", preview: false },
        { id: 6, title: "Building Custom Images", duration: "25:30", type: "video", preview: false },
        { id: 7, title: "Docker Hub & Image Registry", duration: "16:20", type: "video", preview: false },
        { id: 8, title: "Docker Basics Quiz", duration: "10:00", type: "quiz", preview: false },
      ]
    },
    { 
      id: 3, 
      title: "Docker Deep Dive", 
      lessons: 16, 
      duration: "2h 15m", 
      expanded: false,
      lessonList: [
        { id: 1, title: "Dockerfile Best Practices", duration: "22:15", type: "video", preview: false },
        { id: 2, title: "Multi-Stage Builds", duration: "18:30", type: "video", preview: false },
        { id: 3, title: "Docker Volumes", duration: "20:45", type: "video", preview: false },
        { id: 4, title: "Docker Networks", duration: "25:10", type: "video", preview: false },
        { id: 5, title: "Docker Compose Introduction", duration: "15:20", type: "video", preview: false },
        { id: 6, title: "Multi-Container Applications", duration: "28:30", type: "video", preview: false },
        { id: 7, title: "Environment Variables & Secrets", duration: "12:45", type: "video", preview: false },
        { id: 8, title: "Docker Security Basics", duration: "16:20", type: "video", preview: false },
      ]
    },
    { 
      id: 4, 
      title: "Kubernetes Fundamentals", 
      lessons: 14, 
      duration: "3h 5m", 
      expanded: false,
      lessonList: [
        { id: 1, title: "Introduction to Kubernetes", duration: "15:30", type: "video", preview: true },
        { id: 2, title: "Kubernetes Architecture", duration: "22:45", type: "video", preview: false },
        { id: 3, title: "Setting Up Minikube", duration: "18:20", type: "video", preview: false },
        { id: 4, title: "Pods & Deployments", duration: "25:10", type: "video", preview: false },
        { id: 5, title: "Services & Networking", duration: "20:30", type: "video", preview: false },
        { id: 6, title: "ConfigMaps & Secrets", duration: "16:45", type: "video", preview: false },
        { id: 7, title: "Persistent Volumes", duration: "22:15", type: "video", preview: false },
        { id: 8, title: "Kubernetes Fundamentals Lab", duration: "30:00", type: "lab", preview: false },
      ]
    },
    { 
      id: 5, 
      title: "Advanced Kubernetes", 
      lessons: 20, 
      duration: "4h 20m", 
      expanded: false,
      lessonList: [
        { id: 1, title: "StatefulSets", duration: "25:30", type: "video", preview: false },
        { id: 2, title: "DaemonSets & Jobs", duration: "20:15", type: "video", preview: false },
        { id: 3, title: "Ingress Controllers", duration: "28:45", type: "video", preview: false },
        { id: 4, title: "Helm Package Manager", duration: "22:30", type: "video", preview: false },
        { id: 5, title: "Monitoring with Prometheus", duration: "30:20", type: "video", preview: false },
        { id: 6, title: "Logging with ELK Stack", duration: "26:15", type: "video", preview: false },
        { id: 7, title: "Auto-scaling Applications", duration: "24:30", type: "video", preview: false },
        { id: 8, title: "Advanced Kubernetes Lab", duration: "45:00", type: "lab", preview: false },
      ]
    },
    { 
      id: 6, 
      title: "Production Deployments", 
      lessons: 12, 
      duration: "2h 45m", 
      expanded: false,
      lessonList: [
        { id: 1, title: "CI/CD with Kubernetes", duration: "28:30", type: "video", preview: false },
        { id: 2, title: "Blue-Green Deployments", duration: "22:15", type: "video", preview: false },
        { id: 3, title: "Canary Deployments", duration: "20:45", type: "video", preview: false },
        { id: 4, title: "Rolling Updates", duration: "18:30", type: "video", preview: false },
        { id: 5, title: "Backup & Disaster Recovery", duration: "25:20", type: "video", preview: false },
        { id: 6, title: "Security Best Practices", duration: "22:45", type: "video", preview: false },
        { id: 7, title: "Cost Optimization", duration: "16:30", type: "video", preview: false },
        { id: 8, title: "Final Project", duration: "60:00", type: "lab", preview: false },
      ]
    },
  ],
  totalSections: 18,
  totalLessons: 106,
  totalDuration: "18h total",
};



function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ initials }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
      {initials}
    </div>
  );
}

function LevelBadge({ level }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">
      <BarChart2 className="w-3 h-3" />
      {level}
    </span>
  );
}

function VideoPreview({ courseType, courseId, selectedLesson, selectedSection }) {
  const router = useRouter();
  const isHardcopy = courseType === "Hardcopy";
  const PreviewIcon = isHardcopy ? FileText : Play;

  const handlePreviewClick = () => {
    const baseUrl = isHardcopy 
      ? `/student-dashboard/coursedetails/courses/hardcopy`
      : `/student-dashboard/coursedetails/courses/coursedetails`;
    
    let url = `${baseUrl}?courseId=${courseId}`;
    
    // Add lesson and section info if selected
    if (selectedLesson && selectedSection) {
      url += `&sectionId=${selectedSection.id}&lessonId=${selectedLesson.id}`;
    }
    
    router.push(url);
  };

  // Determine what to show in preview
  const hasSelectedLesson = selectedLesson && selectedSection;
  const lessonType = selectedLesson?.type || 'video';
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return Play;
      case 'quiz': return FlaskConical;
      case 'article': return BookOpen;
      case 'lab': return Award;
      default: return Play;
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      video: { bg: 'bg-red-500', label: 'VIDEO' },
      quiz: { bg: 'bg-amber-500', label: 'QUIZ' },
      article: { bg: 'bg-emerald-500', label: 'ARTICLE' },
      lab: { bg: 'bg-violet-500', label: 'LAB' },
    };
    return badges[type] || badges.video;
  };

  const LessonIcon = hasSelectedLesson ? getTypeIcon(lessonType) : PreviewIcon;
  const badge = hasSelectedLesson ? getTypeBadge(lessonType) : null;

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
      onClick={handlePreviewClick}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-6 left-6 w-24 h-24 rounded-full border-4 border-indigo-400/40" />
        <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border-2 border-violet-400/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/10" />
      </div>

      {/* Course type icon motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        {isHardcopy ? (
          <FileText className="w-40 h-40 text-white" />
        ) : (
          <BookOpen className="w-40 h-40 text-white" />
        )}
      </div>

      {/* Preview button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
          <LessonIcon className={`w-6 h-6 text-indigo-600 ${lessonType === 'video' ? 'fill-indigo-600 ml-1' : ''}`} />
        </div>
        <div className="text-center px-4">
          {hasSelectedLesson ? (
            <>
              <span className="text-white text-xs font-medium tracking-wide opacity-70 block mb-1">
                {selectedSection.title}
              </span>
              <span className="text-white text-sm font-semibold tracking-wide opacity-90 block">
                {selectedLesson.title}
              </span>
            </>
          ) : (
            <span className="text-white text-sm font-semibold tracking-wide opacity-90">
              Preview this {isHardcopy ? 'document' : 'course'}
            </span>
          )}
        </div>
      </div>

      {/* Course/Lesson type badge */}
      <div className="absolute top-4 right-4">
        {hasSelectedLesson && badge ? (
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg text-white ${badge.bg}`}>
            {badge.label}
          </span>
        ) : (
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
            isHardcopy 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isHardcopy ? 'PDF DOCUMENT' : 'VIDEO COURSE'}
          </span>
        )}
      </div>

      {/* Lesson duration badge (if lesson selected) */}
      {hasSelectedLesson && selectedLesson.duration && (
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {selectedLesson.duration}
          </span>
        </div>
      )}

      {/* Preview indicator (if lesson selected) */}
      {hasSelectedLesson && selectedLesson.preview && (
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-emerald-500 text-white">
            FREE PREVIEW
          </span>
        </div>
      )}
    </div>
  );
}

function PricingCard({ course, onEnrollClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 sticky top-6">

      {/* Price Row */}
      <div className="flex items-end gap-3 mb-1">
        <span className="text-3xl font-black text-gray-900">${course.discountedPrice}</span>
        <span className="text-lg text-gray-400 line-through font-medium mb-0.5">${course.originalPrice}</span>
        <span className="ml-auto text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          {course.discountPercent}% OFF
        </span>
      </div>

      {/* Discount tag */}
      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-4">
        <Tag className="w-3.5 h-3.5" />
        Limited time offer — ends soon
      </div>

      {/* CTA */}
      <button 
        onClick={onEnrollClick}
        className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-200 transition-all duration-200 mb-3"
      >
        Enroll Now
      </button>

      {/* Guarantee */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium mb-5">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
        {course.guarantee}
      </div>

      <div className="border-t border-gray-50 pt-5">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">This course includes</p>
        <ul className="flex flex-col gap-3">
          {course.includes.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-indigo-500" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabNav({ tabs, active, onChange }) {
  return (
    <div className="flex gap-0 border-b border-gray-100 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
            active === tab
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function WhatYoullLearn({ items }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-black text-gray-900 mb-5">What you'll learn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-indigo-600" />
            </span>
            <span className="text-sm text-gray-700 leading-snug">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CurriculumSection({ section, onToggle, onLessonClick }) {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return Play;
      case 'quiz': return FlaskConical;
      case 'article': return BookOpen;
      case 'lab': return Award;
      default: return Play;
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      video: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Video' },
      quiz: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Quiz' },
      article: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Article' },
      lab: { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Lab' },
    };
    return badges[type] || badges.video;
  };

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden mb-3 bg-white hover:border-indigo-100 hover:shadow-md transition-all">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
            {section.id}
          </span>
          <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {section.title}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> {section.lessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {section.duration}
          </span>
          {section.expanded
            ? <ChevronUp className="w-5 h-5 text-indigo-500" />
            : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {section.expanded && section.lessonList && (
        <div className="px-6 pb-4 border-t border-slate-50 bg-slate-50/50">
          <div className="space-y-2 mt-3">
            {section.lessonList.map((lesson) => {
              const TypeIcon = getTypeIcon(lesson.type);
              const badge = getTypeBadge(lesson.type);
              return (
                <div
                  key={lesson.id}
                  onClick={() => onLessonClick(section.id, lesson)}
                  className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon className={`w-4 h-4 ${badge.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold ${badge.text} ${badge.bg} px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                          {badge.label}
                        </span>
                        {lesson.preview && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                    {lesson.preview ? (
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition">
                        Preview
                      </button>
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-slate-200 flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-300" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseContent({ sections, onToggle, onLessonClick, totalSections, totalLessons, totalDuration }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-black text-gray-900">Course content</h2>
        <span className="text-xs text-gray-400 font-medium">
          {totalSections} sections · {totalLessons} lessons · {totalDuration}
        </span>
      </div>
      <div>
        {sections.map((section) => (
          <CurriculumSection
            key={section.id}
            section={section}
            onToggle={() => onToggle(section.id)}
            onLessonClick={onLessonClick}
          />
        ))}
      </div>
    </section>
  );
}




// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Curriculum");
  const [sections, setSections] = useState(course.sections);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleToggleSection = (id) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  };

  const handleLessonClick = (sectionId, lesson) => {
    const section = sections.find(s => s.id === sectionId);
    setSelectedLesson(lesson);
    setSelectedSection(section);
  };

  const handleEnrollClick = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen ">
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        course={course}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
       

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6">
              <LevelBadge level={course.level} />
              <h1 className="text-4xl font-black text-slate-900 leading-tight mt-4 mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-2xl">
                {course.subtitle}
              </p>

              {/* Stats Row */}
              <div className="flex items-center flex-wrap gap-6 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <RatingStars rating={course.rating} />
                  <span className="font-black text-amber-500 text-lg">{course.rating}</span>
                  <span className="text-slate-400 text-sm">({course.ratingCount} ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-900">{course.students}</span>
                  <span className="text-sm">students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-sm font-medium">English</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl p-4">
                <Avatar initials={course.instructor.avatar} />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Instructor</p>
                  <p className="font-black text-slate-900 text-base">{course.instructor.name}</p>
                  <p className="text-sm text-slate-500">{course.instructor.role}</p>
                </div>
              </div>
            </div>

            {/* Mobile: Video Preview */}
            <div className="lg:hidden mb-6">
              <VideoPreview 
                courseType={course.type} 
                courseId={course.id}
                selectedLesson={selectedLesson}
                selectedSection={selectedSection}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6">
              <TabNav tabs={course.tabs} active={activeTab} onChange={setActiveTab} />

              <div className="p-8">
                {/* Tab Content */}
                {(activeTab === "Overview" || activeTab === "Curriculum") && (
                  <>
                    <WhatYoullLearn items={course.learnings} />
                    <CourseContent
                      sections={sections}
                      onToggle={handleToggleSection}
                      onLessonClick={handleLessonClick}
                      totalSections={course.totalSections}
                      totalLessons={course.totalLessons}
                      totalDuration={course.totalDuration}
                    />
                  </>
                )}

                {activeTab === "Instructor" && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Your Instructor</h2>
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-100 p-6 flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                        {course.instructor.avatar}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg mb-1">{course.instructor.name}</p>
                        <p className="text-sm text-slate-600 mb-4">{course.instructor.role}</p>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <span className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            </div>
                            <span className="font-semibold">4.8 Rating</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <Users className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <span className="font-semibold">12,428 Students</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                              <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                            </div>
                            <span className="font-semibold">6 Courses</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "Reviews (4,236)" && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Student Reviews</h2>
                    <div className="flex items-center gap-8 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-2xl border border-amber-100 p-8">
                      <div className="text-center">
                        <p className="text-6xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">4.8</p>
                        <RatingStars rating={4.8} />
                        <p className="text-sm text-slate-500 mt-2 font-semibold">Course Rating</p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-slate-600 font-semibold w-8">{star} ★</span>
                            <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                                style={{ width: star === 5 ? "78%" : star === 4 ? "16%" : star === 3 ? "4%" : "1%" }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-12 text-right">
                              {star === 5 ? "78%" : star === 4 ? "16%" : star === 3 ? "4%" : "1%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "FAQ" && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {[
                        { q: "Do I need prior Docker experience?", a: "No! This course starts from the very basics and gradually builds up your knowledge." },
                        { q: "Is this course updated for 2024?", a: "Yes, we update the content regularly to reflect the latest industry standards and best practices." },
                        { q: "Will I get a certificate?", a: "Yes, a certificate of completion is awarded upon finishing all course materials." },
                      ].map(({ q, a }) => (
                        <div key={q} className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-100 rounded-xl px-6 py-5 hover:shadow-md transition-shadow">
                          <p className="font-bold text-slate-900 text-base mb-2 flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-indigo-600 text-xs font-black">Q</span>
                            </span>
                            {q}
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed ml-8">{a}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="hidden lg:block mb-6">
              <VideoPreview 
                courseType={course.type} 
                courseId={course.id}
                selectedLesson={selectedLesson}
                selectedSection={selectedSection}
              />
            </div>
            <PricingCard course={course} onEnrollClick={handleEnrollClick} />
          </div>
        </div>
      </main>
    </div>
  );
}