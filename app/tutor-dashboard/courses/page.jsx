"use client";

import { useState, useEffect } from "react";
import { Plus, Play, BookOpen, Users, DollarSign, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "./statcard/page";
import CourseCard from "./coursecard/page";
import CourseFilters from "./coursefilter/page";
import CourseUploadForm from "./courseuploadform/page";
import { CURRENCY_SYMBOL } from "./formatter/page";
import {
  initVideoUpload,
  uploadVideoToBunny,
  createCourse,
  uploadThumbnail,
  uploadPdf,
  publishCourse,
  getInstructorCourses,
} from "@/lib/courseService";

const skeletonStats = [
  { label: "Total Courses",  value: "—", icon: BookOpen,   iconBg: "bg-pink-100",   iconColor: "text-pink-600" },
  { label: "Total Students", value: "—", icon: Users,      iconBg: "bg-green-100",  iconColor: "text-green-600" },
  { label: "Total Earnings", value: "—", icon: DollarSign, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { label: "Avg Rating",     value: "—", icon: Award,      iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
];

export default function CoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]           = useState("All Courses");
  const [courseList, setCourseList]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isUploading, setIsUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInstructorCourses();
        setCourseList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const published     = courseList.filter((c) => c.isPublished || c.status === "Published");
  const drafts        = courseList.filter((c) => !c.isPublished && c.status !== "Published");
  const totalStudents = courseList.reduce((a, c) => a + (c._count?.enrollments ?? 0), 0);

  const totalEarnings = courseList.reduce((acc, c) => {
    const price = Number(c.price) || 0;
    const enrollments = c._count?.enrollments || 0;
    return acc + (price * enrollments);
  }, 0);

  const ratedCourses = courseList.filter(c => c.rating);
  const avgRating = ratedCourses.length > 0 
    ? (ratedCourses.reduce((acc, c) => acc + Number(c.rating), 0) / ratedCourses.length).toFixed(1)
    : "0.0";

  const dynamicStats = [
    { label: "Total Courses",  value: String(courseList.length),      icon: BookOpen,   iconBg: "bg-pink-100",   iconColor: "text-pink-600" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users,      iconBg: "bg-green-100",  iconColor: "text-green-600" },
    { label: "Total Earnings", value: `${CURRENCY_SYMBOL}${totalEarnings.toLocaleString()}`, icon: DollarSign, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    { label: "Avg Rating",     value: avgRating,                      icon: Award,      iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
  ];

  async function handlePublishCourse(courseId) {
    if (!window.confirm("Are you sure you want to publish this course?")) return;
    try {
      await publishCourse(courseId);
      setCourseList((prev) =>
        prev.map((c) => c.id === courseId ? { ...c, status: "Published", isPublished: true } : c)
      );
      alert("Course published successfully!");
    } catch (err) {
      alert("Failed to publish course: " + err.message);
    }
  }

  function getFilteredCourses() {
    switch (activeTab) {
      case "All Courses":   return courseList.filter((c) => c.isPublished || c.status === "Published");
      case "Video Courses": return courseList.filter((c) => c.type === "Video"    && (c.isPublished || c.status === "Published"));
      case "Hardcopy":      return courseList.filter((c) => c.type === "Hardcopy" && (c.isPublished || c.status === "Published"));
      case "Drafts":        return courseList.filter((c) => !c.isPublished && c.status !== "Published");
      default:              return courseList.filter((c) => c.isPublished || c.status === "Published");
    }
  }

  const filteredCourses = getFilteredCourses();

  const courseTabs = [
    { label: "All Courses",   count: published.length },
    { label: "Video Courses", count: published.filter((c) => c.type === "Video").length },
    { label: "Hardcopy",      count: published.filter((c) => c.type === "Hardcopy").length },
    { label: "Drafts",        count: drafts.length },
  ];

  async function handleCourseSubmit(courseData) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const res = await createCourse({
        title:       courseData.title,
        description: courseData.description,
        category:    courseData.category,
        structure:   courseData.structure,
        price:       courseData.price,
        isFree:      courseData.isFree,
      });
      const courseId = res.data?.id || res.id || "temp-id";

      await uploadThumbnail(courseId, courseData.thumbnailFile);

      if (!courseData.isMultiple && courseData.courseFile) {
        if (courseData.category === "Video") {
          const meta = await initVideoUpload(courseData.title);
          await uploadVideoToBunny(courseData.courseFile, meta.data || meta, setUploadProgress);
        } else {
          await uploadPdf(courseId, courseData.courseFile);
        }
        await publishCourse(courseId);
        alert("Course published successfully!");
      } else {
        alert("Course created! Redirecting to Module Manager…");
        router.push(`/tutor-dashboard/courses/${courseId}/manage`);
      }

      const refreshed = await getInstructorCourses();
      setCourseList(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="p-6 bg-[#f2f3fa] min-h-screen flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <Play className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm">
            <Plus className="w-4 h-4" />
            Create New Course
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4">
        {(loading ? skeletonStats : dynamicStats).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Upload progress banner */}
      {isUploading && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-6 h-6 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-indigo-700">Uploading course…</p>
            <div className="mt-1.5 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-indigo-600">{uploadProgress}%</span>
        </div>
      )}

      {/* Course Upload Form */}
      <CourseUploadForm onSubmit={handleCourseSubmit} />

      {/* Course List */}
      <div className="flex flex-col gap-4">
        <CourseFilters
          courseTabs={courseTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="grid grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-4 flex justify-center items-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onPublish={handlePublishCourse} />
            ))
          ) : (
            <div className="col-span-4 flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-sm">No courses found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}