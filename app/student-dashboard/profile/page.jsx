"use client";

import { useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    Camera,
    BookOpen,
    Award,
    Star,
    CheckCircle,
    ChevronRight,
    Edit,
    Users,
    MoreHorizontal,
    Search,
    Save,
    X,
} from "lucide-react";

const tabs = ["Overview", "Courses", "Achievements", "Certificates"];

const courses = [
    {
        id: 1,
        title: "Python for Beginners",
        updated: "Updated 1 day ago",
        lessons: 45,
        hours: "12 hrs",
        rating: 3.5,
        instructor: "Masheihgan",
        progress: 42,
        tag: "Progress",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    },
    {
        id: 2,
        title: "Complete JavaScript Course",
        updated: "Updated 5 days ago",
        lessons: 50,
        hours: "18 hrs",
        rating: 4,
        completedLessons: 27,
        totalLessons: 55,
        percent: 82,
        extra: "610%",
        instructor: "James Smith",
        progress: 82,
        tag: "Progress",
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
];

function TabButton({ label, active, onClick }) {
    return (
        <div className="flex flex-col items-center">
            <button
                onClick={onClick}
                className={"px-5 py-1 text-sm font-medium rounded-xl transition " +
                    (active
                        ? "bg-indigo-500 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")
                }
            >
                {label}
            </button>
            {active && (
                <div
                    className="w-0 h-0 mt-0"
                    style={{
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent",
                        borderTop: "7px solid #6366f1",
                    }}
                />
            )}
        </div>
    );
}

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

function ProgressBar({ value, color = "bg-indigo-500" }) {
    return (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={"h-full rounded-full " + color}
                style={{ width: value + "%" }}
            />
        </div>
    );
}

function EditableField({ icon, value, onChange, editing, type = "text", placeholder }) {
    return (
        <div className={"flex items-center gap-2 px-4 py-2.5 rounded-xl border transition " +
            (editing
                ? "border-indigo-300 bg-white ring-2 ring-indigo-100"
                : "border-slate-100 bg-slate-50")
        }>
            <div className="flex-shrink-0 text-indigo-400">{icon}</div>
            {editing ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 text-xs text-slate-700 bg-transparent focus:outline-none placeholder-slate-300"
                />
            ) : (
                <span className="flex-1 text-xs text-slate-600">{value || placeholder}</span>
            )}
        </div>
    );
}

export default function StudentProfilePage() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        email: "dhakaahmed@gnmail.com",
        country: "Bangladesh",
        phone: "+880 1712 345 678",
        city: "Dhaka, Bangladesh",
        memberSince: "Member since Oct 2023",
    });

    const [savedData, setSavedData] = useState({ ...formData });

    function handleSave() {
        setSavedData({ ...formData });
        setEditing(false);
    }

    function handleCancel() {
        setFormData({ ...savedData });
        setEditing(false);
    }

    function update(field) {
        return (value) => setFormData((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6 flex flex-col gap-5">

            {/* ── Two Cards Row ─────────────────────────────────────── */}
            <div className="flex gap-5 items-start">

                {/* Card 1 — Photo + Sidebar Info */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col w-64 flex-shrink-0">
                    <div className="relative h-72 bg-slate-200 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80"
                            alt="Dhaka Ahmed"
                            className="w-full h-full object-cover object-top"
                        />
                        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <Camera className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-5 flex flex-col gap-3 border-t border-slate-100">
                        <div>
                            <h2 className="font-bold text-slate-800">Dhaka Ahmed</h2>
                            <span className="inline-block mt-1.5 bg-teal-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-widest">
                                STUDENT
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">203</span>
                                <span className="text-xs text-slate-400">Enrolled Courses</span>
                                <span className="text-base ml-auto">😊</span>
                                <span className="font-bold text-slate-800">15</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-blue-500" fill="#3b82f6" />
                                    <span className="text-xs text-slate-500">Certificates</span>
                                </div>
                                <div className="flex items-center gap-1.5 ml-auto">
                                    <CheckCircle className="w-4 h-4 text-blue-500" fill="#3b82f6" />
                                    <span className="font-bold text-slate-800">480</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 — Main Content */}
                <div className="bg-white rounded-3xl shadow-sm flex-1 p-6 flex flex-col gap-4">

                    <div className="border-b border-slate-100 pb-2">
                        <h1 className="text-2xl font-bold text-slate-800">Dhaka Ahmed</h1>
                        <span className="inline-block mt-1.5 bg-teal-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-widest">
                            STUDENT
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-sm border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-base">120</span>
                            <span className="text-slate-400 text-xs">Hours Studied</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-base">4</span>
                            <span className="text-slate-400 text-xs">4 Courses</span>
                            <span className="text-base">😊</span>
                            <CheckCircle className="w-4 h-4 text-blue-500" fill="#3b82f6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1">
                            <span className="font-bold text-slate-800">203</span>
                            <span className="text-slate-400 text-xs">Enrolled Courses</span>
                            <BookOpen className="w-4 h-4 text-slate-400 ml-1" />
                        </div>
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1 ">
                            <span className="font-bold text-slate-800">15</span>
                            <span className="text-slate-400 text-xs">Certificates</span>
                            <Award className="w-4 h-4 text-indigo-400 ml-1" />
                        </div>
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1">
                            <span className="font-bold text-slate-800">480</span>
                            <span className="text-slate-400 text-xs">Points</span>
                            <Star className="w-4 h-4 text-slate-400 ml-1" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-[#f4f0fd] ">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab}
                                label={tab}
                                active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            />
                        ))}
                    </div>

                    {activeTab === "Overview" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 text-sm">Personal Information</h3>
                                {!editing ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        <Edit className="w-3 h-3" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                                        >
                                            <X className="w-3 h-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            <Save className="w-3 h-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <EditableField
                                    icon={<Mail className="w-4 h-4" />}
                                    value={formData.email}
                                    onChange={update("email")}
                                    editing={editing}
                                    type="email"
                                    placeholder="Enter email address"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <EditableField
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={formData.country}
                                        onChange={update("country")}
                                        editing={editing}
                                        placeholder="Enter country"
                                    />
                                    <EditableField
                                        icon={<Phone className="w-4 h-4" />}
                                        value={formData.phone}
                                        onChange={update("phone")}
                                        editing={editing}
                                        type="tel"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <EditableField
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={formData.city}
                                        onChange={update("city")}
                                        editing={editing}
                                        placeholder="Enter city"
                                    />
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50">
                                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="#facc15" />
                                        {editing ? (
                                            <input
                                                type="text"
                                                value={formData.memberSince}
                                                onChange={(e) => update("memberSince")(e.target.value)}
                                                className="flex-1 text-xs text-slate-700 bg-transparent focus:outline-none"
                                            />
                                        ) : (
                                            <span className="flex-1 text-xs text-slate-600">{formData.memberSince}</span>
                                        )}
                                        <button
                                            onClick={editing ? handleSave : () => setEditing(true)}
                                            className="ml-1 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition whitespace-nowrap flex items-center gap-1"
                                        >
                                            {editing
                                                ? <><Save className="w-3 h-3" /> Save</>
                                                : <><Edit className="w-3 h-3" /> Edit Profile</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {editing && (
                                <p className="text-[10px] text-indigo-400 flex items-center gap-1">
                                    <Edit className="w-3 h-3" />
                                    Fields are now editable. Click Save to apply changes.
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab !== "Overview" && (
                        <div className="flex items-center justify-center h-24 text-slate-300 text-sm">
                            {activeTab} coming soon...
                        </div>
                    )}
                </div>
            </div>

            {/* ── My Courses ────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                        <h2 className="font-bold text-slate-800 text-lg">My Courses</h2>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition font-medium">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="relative h-36">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-3 left-3 bg-white/90 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                    {course.tag}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col gap-2.5 flex-1">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={course.avatar}
                                        alt={course.instructor}
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{course.title}</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{course.updated}</p>
                                    </div>
                                </div>

                                {course.id === 2 && <StarRating rating={course.rating} />}

                                <ProgressBar
                                    value={course.progress}
                                    color={course.id === 1 ? "bg-indigo-500" : "bg-blue-400"}
                                />

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span>• {course.lessons} Lessons</span>
                                    <span>• {course.hours}</span>
                                    {course.id === 2 && (
                                        <span className="text-slate-500 font-medium">
                                            {course.completedLessons}/{course.totalLessons} · {course.percent}% | {course.extra}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        {course.id === 2 && <Edit className="w-3.5 h-3.5 text-slate-400" />}
                                        <span className="text-xs text-slate-500">{course.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {course.id === 1 && <Search className="w-3.5 h-3.5 text-slate-400" />}
                                        <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
                                        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
                                            Continue
                                            {course.id === 2 && <ChevronRight className="w-3 h-3" />}
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