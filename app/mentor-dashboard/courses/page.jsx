"use client";

import { useState } from "react";
import { Plus, Play, BookOpen, Users, DollarSign, Award } from "lucide-react";
import StatCard from "./statcard/page";
import CourseCard from "./coursecard/page";
import CourseFilters from "./coursefilter/page";
import CourseUploadForm from "./courseuploadform/page";
import { initialCourseList } from "./coursedata/page";
import { CURRENCY_SYMBOL } from "./formatter/page";
import { initVideoUpload, uploadVideoToBunny, createCourse, uploadThumbnail, uploadPdf, publishCourse, getInstructorCourses } from "@/lib/courseService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const stats = [
  {
    label: "Total Courses",
    value: "12",
    growth: null,
    icon: BookOpen,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    label: "Total Students",
    value: "3,458",
    growth: "+12%",
    growthColor: "text-green-500",
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Total Earnings",
    value: `${CURRENCY_SYMBOL}24,580`,
    growth: "+18%",
    growthColor: "text-green-500",
    icon: DollarSign,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Avg Rating",
    value: "4.8",
    growth: "+0.2",
    growthColor: "text-yellow-500",
    icon: Award,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Courses");
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
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

  async function handlePublishCourse(courseId) {
    if (!window.confirm("Are you sure you want to publish this course?")) return;
    try {
      await publishCourse(courseId);
      setCourseList(prev =>
        prev.map(c => c.id === courseId ? { ...c, status: "Published", isPublished: true } : c)
      );
      alert("Course published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish course: " + err.message);
    }
  }

  function getFilteredCourses() {
    switch (activeTab) {
      case "All Courses":
        return courseList.filter(c => c.isPublished || c.status === "Published");
      case "Video Courses":
        return courseList.filter(c => c.type === "Video" && (c.isPublished || c.status === "Published"));
      case "Hardcopy":
        return courseList.filter(c => c.type === "Hardcopy" && (c.isPublished || c.status === "Published"));
      case "Drafts":
        return courseList.filter(c => !c.isPublished && c.status !== "Published");
      default:
        return courseList.filter(c => c.isPublished || c.status === "Published");
    }
  }

  const filteredCourses = getFilteredCourses();

  const published = courseList.filter(c => c.isPublished || c.status === "Published");
  const drafts = courseList.filter(c => !c.isPublished && c.status !== "Published");
  const totalStudents = courseList.reduce((a, c) => a + (c._count?.enrollments ?? 0), 0);

  const courseTabs = [
    { label: "All Courses", count: published.length },
    { label: "Video Courses", count: published.filter(c => c.type === "Video").length },
    { label: "Hardcopy", count: published.filter(c => c.type === "Hardcopy").length },
    { label: "Drafts", count: drafts.length },
  ];

  const dynamicStats = [
    { label: "Total Courses", value: String(courseList.length), icon: BookOpen, iconBg: "bg-pink-100", iconColor: "text-pink-600" },
    { label: "Total Students", value: totalStudents.toLocaleString(), growth: null, icon: Users, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Total Earnings", value: `${CURRENCY_SYMBOL}0`, growth: null, icon: DollarSign, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    { label: "Avg Rating", value: "4.8", growth: null, icon: Award, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
  ];

  // Handle form submission
  async function handleCourseSubmit(courseData) {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // 1. Create Course Shell
      const res = await createCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        structure: courseData.structure,
        price: courseData.price,
        isFree: courseData.isFree,
      });

      const courseId = res.data?.id || res.id || 'temp-id'; // Fallback if API is not fully connected

      // 2. Upload Thumbnail
      await uploadThumbnail(courseId, courseData.thumbnailFile);

      // 3. Upload File if Single Structure
      if (!courseData.isMultiple && courseData.courseFile) {
        if (courseData.category === "Video") {
          const meta = await initVideoUpload(courseData.title);
          // Wait for TUS upload
          await uploadVideoToBunny(courseData.courseFile, meta.data || meta, setUploadProgress);
        } else {
          // PDF upload
          await uploadPdf(courseId, courseData.courseFile);
        }
        await publishCourse(courseId);
        alert("Course published successfully!");
      } else {
        alert("Course created successfully! Redirecting to Module Manager...");
        router.push(`/mentor-dashboard/courses/${courseId}/manage`);
      }
    } catch (err) {
      console.error(err);
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
        {(loading ? stats : dynamicStats).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Course Upload Form */}
      <CourseUploadForm onSubmit={handleCourseSubmit} />

      {/* Course List */}
      <div className="flex flex-col gap-4">
        <CourseFilters 
          courseTabs={courseTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Course Grid */}
        <div className="grid grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-4 flex justify-center items-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPublish={handlePublishCourse}
              />
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