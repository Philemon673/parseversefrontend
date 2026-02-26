"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Image,
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Star,
  TrendingUp,
  Eye,
  BookOpen,
  X,
  Send,
  ChevronDown,
  Edit,
} from "lucide-react";

// ── Stats Data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Total Courses",
    value: "12",
    growth: null,
    icon: "📚",
    iconBg: "bg-pink-100",
  },
  {
    label: "Total Students",
    value: "3,458",
    growth: "+12%",
    growthColor: "text-green-500",
    icon: "👥",
    iconBg: "bg-green-100",
  },
  {
    label: "Total Earnings",
    value: "$24,580",
    growth: "+18%",
    growthColor: "text-green-500",
    icon: "💰",
    iconBg: "bg-orange-100",
  },
  {
    label: "Avg Rating",
    value: "4.8",
    growth: "+0.2",
    growthColor: "text-yellow-500",
    icon: "⭐",
    iconBg: "bg-yellow-100",
  },
];

const uploadSteps = [
  { num: 1, label: "Course Info", active: true },
  { num: 2, label: "Curriculum", active: false },
  { num: 3, label: "Pricing", active: false },
  { num: 4, label: "Publish", active: false },
];

const categories = ["Web Development", "Data Science", "Design", "Marketing", "Business"];
const subcategories = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps"];

const courseTabs = [
  { label: "All Courses", count: 12 },
  { label: "Hardcopy", count: 1 },
  { label: "Drafts", count: 3 },
  { label: "Published", count: 8 },
  { label: "Archived", count: 1 },
];

const courseList = [
  {
    id: 1,
    title: "Machine Learning A-Z",
    students: "1,245",
    type: "Hardcopy",
    price: "$89.99",
    rating: 4.8,
    earnings: "$18,920",
    status: "Published",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&q=80",
    badge: null,
    badge: "Machine Learning",
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    students: "890",
    type: "Video",
    duration: "9h 10m",
    lessons: 26,
    price: "$9.99",
    rating: 4.8,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&q=80",
    badge: "PYTHON",
    
  },
];

// ── Sub Components ────────────────────────────────────────────────────────────

function StatCard(props) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-xs font-medium">{props.label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{props.value}</p>
        {props.growth && (
          <p className={"text-xs font-semibold mt-0.5 " + props.growthColor}>
            {props.growth}
          </p>
        )}
      </div>
      <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-2xl " + props.iconBg}>
        {props.icon}
      </div>
    </div>
  );
}

function StepDot(props) {
  return (
    <div className="flex items-center gap-2">
      <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " +
        (props.active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500")
      }>
        {props.num}
      </div>
      <span className={"text-sm font-medium " + (props.active ? "text-indigo-600" : "text-gray-400")}>
        {props.label}
      </span>
      {!props.last && (
        <div className="w-6 h-px bg-gray-300 mx-1" />
      )}
    </div>
  );
}

function StarRating(props) {
  const rating = props.rating || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3 h-3"
          fill={i <= Math.floor(rating) ? "#f59e0b" : "none"}
          stroke={i <= Math.floor(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

function handleSend() {
  if (text.trim()) {
    props.onSend(text.trim());
    setText("");
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="p-1 bg-[#f2f3fa] min-h-screen flex flex-col gap-6 ">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        </div>
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

      {/* ── Stats Row ────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Course Upload ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Upload Header + Steps */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Course Upload</h2>
          <div className="flex items-center gap-1">
            {uploadSteps.map((step, i) => (
              <StepDot
                key={step.num}
                num={step.num}
                label={step.label}
                active={step.active}
                last={i === uploadSteps.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-5">
          {/* Upload video */}
          <div className="flex flex-col gap-2 w-56 flex-shrink-0">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
              className={"w-56 h-45 flex-shrink-0 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 py-8 px-4 text-center cursor-pointer transition " +
                (isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50")
              }
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Upload Course video/Hardcopy</p>
                <p className="text-xs text-gray-400 mt-1">
                  Drag & drop image or{" "}
                  <span className="text-indigo-500 underline cursor-pointer">browse</span>
                </p>
              </div>
            </div>
            {/* Thumbnail Upload */}
            <div className="w-fit-content h-9 flex-shrink-0 border border-gray-200 rounded-2xl  justify-center gap-2 py-2 px-3 text-center cursor-pointer transition hover:background-indigo-300 hover:bg-gray-50">
              <p className="text-sm text-gray-500">Thumbnail Preview</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Row 1 — Title + Category */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Course Title</label>
                <input
                  type="text"
                  placeholder="Enter compelling course title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400"
                />
              </div>
              <div className="w-52 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2 — Description + Subcategory */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Course Description</label>

                {/* Toolbar */}
                <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-t-xl bg-gray-50 border-b-0">
                  {[Bold, Italic, Underline].map((Icon, i) => (
                    <button key={i} className="p-1 rounded hover:bg-gray-200 transition text-gray-500">
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  {[List, Link, Image].map((Icon, i) => (
                    <button key={i} className="p-1 rounded hover:bg-gray-200 transition text-gray-500">
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  <button className="p-1 rounded hover:bg-gray-200 transition">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>

                {/* Textarea + Send Button wrapper */}
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Write a detailed description about your course..."
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 rounded-b-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400 resize-none"
                  />
                  {/* Send button — bottom right corner of textarea */}
                  <button
                    onClick={handleSend}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>


              <div className="w-52 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Subcategory</label>
                <div className="relative">
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-500"
                  >
                    <option value="">Select subcategory</option>
                    {subcategories.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── My Course List ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* List Header */}
        <div className=" bg-white flex items-center justify-between">
          <div className="flex items-center gap-1">

            {courseTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={"flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition " +
                  (activeTab === tab.label
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-400 hover:text-gray-600")
                }
              >
                {tab.label}
                <span className={"text-[10px] font-bold px-1.5 py-0.5 rounded-full " +
                  (activeTab === tab.label ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400")
                }>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search my courses..."
                className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400 w-44"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>
          </div>
        

        {/* Course Grid */}
        <div className=" grid grid-cols-2 gap-4">

         

          {/* Cards 2, 3, 4 — Course List */}
          {courseList.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

              {/* Top image */}
              <div className="relative w-full h-36 flex-shrink-0">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.badgeNum && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {course.badgeNum}
                  </span>
                )}
                {course.badge && (
                  <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between ">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{course.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {course.lessons && `${course.lessons} Lessons · `}{course.type}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye  className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{course.students} Students</span>
                      <span className="mx-1 text-gray-300">·</span>
                      <StarRating rating={course.rating} />
                    </div>
                  </div>
                  
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400">Price</p>
                      <p className="text-xs font-bold text-gray-800">{course.price}</p>
                    </div>
                  
                  </div>
                  <div className="flex items-center gap-2">
                    {course.status === "Published" ? (
                      <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Preview
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Preview
                      </button>
                    )}
                    <button className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center gap-1">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}