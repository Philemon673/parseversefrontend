"use client";
import Student from "../../../assets/student.jpg"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    Smile,
    Loader2,
    AlertCircle,
    User,
} from "lucide-react";
import { userService } from "../../../lib/userService";

const tabs = ["Overview", "Achievements", "Certificates"];

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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Overview");
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        phone: "",
        city: "",
    });

    const [savedData, setSavedData] = useState({ ...formData });

    // Load user data on component mount
    useEffect(() => {
        loadUserProfile();
    }, []);

    async function loadUserProfile() {
        try {
            setLoading(true);
            setError(null);
            
            // Get current user from auth context
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            
            if (!currentUser.id) {
                setError('No user session found. Please log in.');
                return;
            }
            
            // Fetch user data from API using the authenticated user's ID
            const userData = await userService.getUserProfile(currentUser.id);
            setUser(userData);
            
            const profileData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                country: userData.country,
                phone: userData.phone,
                city: userData.city,
            };
            
            setFormData(profileData);
            setSavedData(profileData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            setSaving(true);
            setError(null);
            
            // Get current user from auth context
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            
            if (!currentUser.id) {
                setError('No user session found. Please log in.');
                return;
            }
            
            const updatedUser = await userService.updateUserProfile(currentUser.id, formData);
            setUser(updatedUser);
            setSavedData({ ...formData });
            setEditing(false);
            
            // Update the stored user session with new data
            const updatedSession = {
                ...currentUser,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedSession));
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setFormData({ ...savedData });
        setEditing(false);
        setError(null);
    }

    // capitalize: first letter uppercase, rest lowercase
    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

    function update(field) {
        return (value) => setFormData((prev) => ({ ...prev, [field]: value }));
    }

    function updateCapitalized(field) {
        return (value) => setFormData((prev) => ({ ...prev, [field]: capitalize(value) }));
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading profile...</span>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-200 max-w-md">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle className="w-6 h-6" />
                        <span className="font-semibold">Error Loading Profile</span>
                    </div>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <button 
                        onClick={loadUserProfile}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6 flex flex-col gap-5">

            {/* ── Two Cards Row ─────────────────────────────────────── */}
            <div className="flex gap-5 items-start">

                {/* Card 1 — Photo + Sidebar Info */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col w-64 flex-shrink-0">
                    <div className="relative h-72 bg-slate-200 overflow-hidden">
                        <img
                            src={Student.src}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover object-top"
                        />
                        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <Camera className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-5 flex flex-col gap-3 border-t border-slate-100">
                        <div>
                            <h2 className="font-bold text-slate-800">{user.firstName} {user.lastName}</h2>
                            <span className="inline-block mt-1.5 text-white bg-purple-500 py-1 px-3 rounded-full text-[9px] font-bold tracking-widest">
                                {user.role}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{user.stats?.enrolledCourses || 0}</span>
                                <span className="text-xs text-slate-400">Enrolled Courses</span>
                                <Award className="w-4 h-4 text-indigo-400 ml-auto" />
                                <span className="font-bold text-slate-800">{user.stats?.certificates || 0}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-blue-500" fill="#3b82f6" />
                                    <span className="text-xs text-slate-500">Certificates</span>
                                </div>
                                <div className="flex items-center gap-1.5 ml-auto">
                                    <CheckCircle className="w-4 h-4 text-blue-500" fill="#3b82f6" />
                                    <span className="font-bold text-slate-800">{user.stats?.points || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 — Main Content */}
                <div className="bg-white rounded-3xl shadow-sm flex-1 p-6 flex flex-col gap-4">

                    <div className="border-b border-slate-100 pb-2">
                        <h1 className="text-2xl font-bold text-slate-800">{user.firstName} {user.lastName}</h1>
                        <span className="inline-block mt-1.5 text-white bg-purple-500 py-1 px-3 rounded-full text-[9px] font-bold tracking-widest">
                            {user.role}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-sm border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-base">{user.stats?.hoursStudied || 0}</span>
                            <span className="text-slate-400 text-xs">Hours Studied</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-base">{user.stats?.completedCourses || 0}</span>
                            <span className="text-slate-400 text-xs">Courses</span>
                            <Award className="w-4 h-4 text-indigo-400 ml-1" />
                            <CheckCircle className="w-4 h-4 text-blue-500 ml-1" fill="#3b82f6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1">
                            <span className="font-bold text-slate-800">{user.stats?.enrolledCourses || 0}</span>
                            <span className="text-slate-400 text-xs">Enrolled Courses</span>
                            <BookOpen className="w-4 h-4 text-slate-400 ml-1" />
                        </div>
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1">
                            <span className="font-bold text-slate-800">{user.stats?.certificates || 0}</span>
                            <span className="text-slate-400 text-xs">Certificates</span>
                            <Award className="w-4 h-4 text-indigo-400 ml-1" />
                        </div>
                        <div className="flex items-center gap-2 bg-[#f4f0fd] border border-slate-100 rounded-2xl px-5 py-1">
                            <span className="font-bold text-slate-800">{user.stats?.points || 0}</span>
                            <span className="text-slate-400 text-xs">Points</span>
                            <Star className="w-4 h-4 text-slate-400 ml-1" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-[#f4f0fd]">
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
                                            disabled={saving}
                                            className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                                        >
                                            <X className="w-3 h-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Save className="w-3 h-3" />
                                            )}
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

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
                                        icon={<User className="w-4 h-4" />}
                                        value={formData.firstName}
                                        onChange={update("firstName")}
                                        editing={editing}
                                        placeholder="First Name"
                                    />
                                    <EditableField
                                        icon={<User className="w-4 h-4" />}
                                        value={formData.lastName}
                                        onChange={update("lastName")}
                                        editing={editing}
                                        placeholder="Last Name"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <EditableField
                                        icon={<MapPin className="w-4 h-4" />}
                                        value={formData.country}
                                        onChange={updateCapitalized("country")}
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
                                        onChange={updateCapitalized("city")}
                                        editing={editing}
                                        placeholder="Enter city"
                                    />
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50">
                                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="#facc15" />
                                        <span className="flex-1 text-xs text-slate-600">
                                            {user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 'Member'}
                                        </span>
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
                                        <button 
                                            onClick={() => router.push(`/student-dashboard/coursedetails/courses/coursedetails?courseId=${course.id}`)}
                                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                                        >
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