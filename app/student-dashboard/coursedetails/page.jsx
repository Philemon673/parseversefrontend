"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourse, getCourseModules, getCourseProgress } from "@/lib/courseService";
import { addCourseReview, getCourseReviews } from "@/lib/reviewService";
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

function PricingCard({ course, isEnrolled, onEnrollClick, onGoToCourse }) {
  const isHardcopy = course.type === "Hardcopy";
  const finalPrice = isHardcopy ? 49 : 79;
  const originalPrice = isHardcopy ? 69 : 99;
  const discountPercent = isHardcopy ? 28 : 20;

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 sticky top-6">

      {/* Price Row */}
      <div className="flex items-end gap-3 mb-1">
        <span className="text-3xl font-black text-gray-900">${finalPrice}</span>
        <span className="text-lg text-gray-400 line-through font-medium mb-0.5">${originalPrice}</span>
        <span className="ml-auto text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          {discountPercent}% OFF
        </span>
      </div>

      {/* Discount tag */}
      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-4">
        <Tag className="w-3.5 h-3.5" />
        Limited time offer — ends soon
      </div>

      {/* CTA */}
      {isEnrolled ? (
        <button 
          onClick={onGoToCourse}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-200 transition-all duration-200 mb-3 animate-pulse"
        >
          Go to Course
        </button>
      ) : (
        <button 
          onClick={onEnrollClick}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-200 transition-all duration-200 mb-3"
        >
          Enroll Now
        </button>
      )}

      {/* Guarantee */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium mb-5">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
        30-Day Money-Back Guarantee
      </div>

      <div className="border-t border-gray-50 pt-5">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">This course includes</p>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <MonitorPlay className="w-4 h-4 text-indigo-500" />
            </span>
            {isHardcopy ? "Downloadable PDF workbook" : "On-demand streaming video"}
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-4 h-4 text-indigo-500" />
            </span>
            Hands-on learning exercises
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-indigo-500" />
            </span>
            Certificate of completion
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Infinity className="w-4 h-4 text-indigo-500" />
            </span>
            Lifetime digital access
          </li>
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

function CourseDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Curriculum");
  const [sections, setSections] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    async function load() {
      try {
        const [details, mods, revs] = await Promise.all([
          getCourse(courseId),
          getCourseModules(courseId).catch(() => []),
          getCourseReviews(courseId).catch(() => ({ reviews: [], averageRating: 0, totalReviews: 0 }))
        ]);
        setCourseData(details);
        setReviewsData(revs);
        const mapped = (mods || []).map((m) => ({
          id: m.id,
          title: m.title,
          lessons: m.lessons?.length || 0,
          duration: "—",
          expanded: false,
          lessonList: (m.lessons || []).map((l) => ({
            id: l.id,
            title: l.title,
            duration: l.duration ? `${Math.floor(l.duration / 60)}:${String(l.duration % 60).padStart(2, "0")}` : "—",
            type: "video",
            preview: false,
          })),
        }));
        setSections(mapped);
        try {
          await getCourseProgress(courseId);
          setIsEnrolled(true);
        } catch {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

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

  const handleEnrollClick = () => setIsPaymentModalOpen(true);

  const handleGoToCourse = () => {
    const url = courseData?.type === "Hardcopy"
      ? `/student-dashboard/coursedetails/courses/hardcopy?courseId=${courseId}`
      : `/student-dashboard/coursedetails/courses/coursedetails?courseId=${courseId}`;
    router.push(url);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await addCourseReview(courseId, reviewRating, reviewComment);
      const updatedRevs = await getCourseReviews(courseId);
      setReviewsData(updatedRevs);
      setReviewComment("");
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-slate-500 font-bold text-sm">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-semibold">Course not found.</p>
      </div>
    );
  }

  const instructorName = courseData.instructor
    ? `${courseData.instructor.firstName} ${courseData.instructor.lastName}`
    : "Instructor";
  const instructorAvatar = courseData.instructor
    ? `${courseData.instructor.firstName?.[0] || ""}${courseData.instructor.lastName?.[0] || ""}`
    : "IN";
  const instructorRole = courseData.instructor?.field || "Instructor";
  const studentCount = courseData._count?.enrollments ?? 0;
  const tabs = ["Overview", "Curriculum", "Instructor", "Reviews", "FAQ"];

  return (
    <div className="min-h-screen">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={{ ...courseData, id: courseId, instructor: { name: instructorName } }}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
       

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6">
              <LevelBadge level={courseData.level} />
              <h1 className="text-4xl font-black text-slate-900 leading-tight mt-4 mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent">
                {courseData.title}
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-2xl">
                {courseData.description}
              </p>

              {/* Stats Row */}
              <div className="flex items-center flex-wrap gap-6 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <RatingStars rating={reviewsData.averageRating || 4.8} />
                  <span className="font-black text-amber-500 text-lg">{reviewsData.averageRating || 4.8}</span>
                  <span className="text-slate-400">({reviewsData.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-bold text-slate-900">{studentCount}</span>
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
                <Avatar initials={instructorAvatar} />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Instructor</p>
                  <p className="font-black text-slate-900 text-base">{instructorName}</p>
                  <p className="text-sm text-slate-500">{instructorRole}</p>
                </div>
              </div>
            </div>

            {/* Mobile: Video Preview */}
            <div className="lg:hidden mb-6">
              <VideoPreview
                courseType={courseData.type}
                courseId={courseId}
                selectedLesson={selectedLesson}
                selectedSection={selectedSection}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6">
              <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

              <div className="p-8">
                {(activeTab === "Overview" || activeTab === "Curriculum") && (
                  <>
                    {courseData.learnings?.length > 0 && <WhatYoullLearn items={courseData.learnings} />}
                    <CourseContent
                      sections={sections}
                      onToggle={handleToggleSection}
                      onLessonClick={handleLessonClick}
                      totalSections={sections.length}
                      totalLessons={sections.reduce((a, s) => a + s.lessons, 0)}
                      totalDuration="—"
                    />
                  </>
                )}

                {activeTab === "Instructor" && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Your Instructor</h2>
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-100 p-6 flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                        {instructorAvatar}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg mb-1">{instructorName}</p>
                        <p className="text-sm text-slate-600 mb-4">{instructorRole}</p>
                        {courseData.instructor?.bio && (
                          <p className="text-sm text-slate-500 leading-relaxed">{courseData.instructor.bio}</p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "Reviews" && (
                  <section>
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Student Reviews</h2>
                    
                    {/* Rating Summary */}
                    <div className="flex items-center gap-8 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-2xl border border-amber-100 p-8 mb-8">
                      <div className="text-center">
                        <p className="text-6xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                          {reviewsData.averageRating || "0.0"}
                        </p>
                        <RatingStars rating={reviewsData.averageRating || 0} />
                        <p className="text-sm text-slate-500 mt-2 font-semibold">{reviewsData.totalReviews} Course Rating(s)</p>
                      </div>
                    </div>

                    {/* Review Form */}
                    {isEnrolled && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                        <h3 className="font-bold text-slate-800 mb-4">Leave a Review</h3>
                        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-600">Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  type="button"
                                  key={num}
                                  onClick={() => setReviewRating(num)}
                                  className="focus:outline-none"
                                >
                                  <Star className="w-6 h-6" fill={num <= reviewRating ? "#f59e0b" : "none"} stroke="#f59e0b" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="What did you think about this course?"
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition resize-none"
                            rows={3}
                            required
                          />
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="self-end px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl transition disabled:opacity-50"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="flex flex-col gap-6">
                      {reviewsData.reviews.length > 0 ? (
                        reviewsData.reviews.map((rev) => (
                          <div key={rev.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 overflow-hidden">
                                {rev.user.avatar ? (
                                  <img src={rev.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                  rev.user.firstName[0]
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{rev.user.firstName} {rev.user.lastName}</p>
                                <div className="flex items-center gap-2">
                                  <RatingStars rating={rev.rating} />
                                  <span className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-6">No reviews yet. Be the first to review!</p>
                      )}
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
                courseType={courseData.type}
                courseId={courseId}
                selectedLesson={selectedLesson}
                selectedSection={selectedSection}
              />
            </div>
            <PricingCard
              course={courseData}
              isEnrolled={isEnrolled}
              onEnrollClick={handleEnrollClick}
              onGoToCourse={handleGoToCourse}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-slate-400 font-semibold text-sm">
        Loading course details...
      </div>
    }>
      <CourseDetailsContent />
    </Suspense>
  );
}