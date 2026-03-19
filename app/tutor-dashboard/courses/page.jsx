"use client";

import { useState } from "react";
import { Plus, Play, BookOpen, Users, DollarSign, Award } from "lucide-react";
import StatCard from "./statcard/page";
import CourseCard from "./coursecard/page";
import CourseFilters from "./coursefilter/page";
import CourseUploadForm from "./courseuploadform/page";
import { initialCourseList } from "./coursedata/page";
import { CURRENCY_SYMBOL } from "./formatter/page";

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
  const [activeTab, setActiveTab] = useState("All Courses");
  const [courseList, setCourseList] = useState(initialCourseList);

  // Handle publishing a draft course
  function handlePublishCourse(courseId) {
    if (window.confirm("Are you sure you want to publish this course?")) {
      setCourseList(prevList => 
        prevList.map(course => 
          course.id === courseId 
            ? { ...course, status: "Published" }
            : course
        )
      );
      alert("Course published successfully!");
    }
  }

  // Filter courses based on active tab
  function getFilteredCourses() {
    switch (activeTab) {
      case "All Courses":
        return courseList.filter(course => course.status === "Published");
      case "Video Courses":
        return courseList.filter(course => course.type === "Video" && course.status === "Published");
      case "Hardcopy":
        return courseList.filter(course => course.type === "Hardcopy" && course.status === "Published");
      case "Drafts":
        return courseList.filter(course => course.status === "Draft");
      default:
        return courseList.filter(course => course.status === "Published");
    }
  }

  const filteredCourses = getFilteredCourses();

  // Calculate counts for tabs
  const courseTabs = [
    { label: "All Courses", count: courseList.filter(c => c.status === "Published").length },
    { label: "Video Courses", count: courseList.filter(c => c.type === "Video" && c.status === "Published").length },
    { label: "Hardcopy", count: courseList.filter(c => c.type === "Hardcopy" && c.status === "Published").length },
    { label: "Drafts", count: courseList.filter(c => c.status === "Draft").length },
  ];

  // Handle form submission
  function handleCourseSubmit(courseData) {
    console.log("New course submitted:", courseData);
    alert("Course published successfully!");
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
        {stats.map((stat) => (
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
        <div className="grid grid-cols-2 gap-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onPublish={handlePublishCourse}
              />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-sm">No courses found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}