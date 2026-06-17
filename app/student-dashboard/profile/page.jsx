"use client";
import { useState, useEffect, useRef } from "react";
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
import { getMyEnrolledCourses } from "../../../lib/courseService";
import { useAuth } from "@/lib/auth-context";

const tabs = ["Overview", "Achievements", "Certificates"];

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
    const { updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("Overview");
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        phone: "",
        city: "",
        field: "",
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
            
            // Fetch user data and enrolled courses from API
            const [userData, coursesData] = await Promise.all([
                userService.getUserProfile(currentUser.id),
                getMyEnrolledCourses().catch(() => [])
            ]);
            
            setUser(userData);
            setEnrolledCourses(Array.isArray(coursesData) ? coursesData : []);
            
            const profileData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                country: userData.country || "",
                phone: userData.phone || "",
                city: userData.city || "",
                field: userData.field || (userData.interests && userData.interests.length > 0 ? userData.interests.join(", ") : ""),
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
            
            const payload = { ...formData };
            if (payload.field) {
                payload.interests = payload.field.split(",").map(i => i.trim()).filter(Boolean);
            }

            const updatedUser = await userService.updateUserProfile(currentUser.id, payload);
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

    async function handleAvatarUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            setError(null);
            const data = await userService.uploadAvatar(file);
            
            // Update local state
            setUser(prev => ({ ...prev, avatar: data.url }));
            
            // Update auth context globally
            updateUser({ avatar: data.url });
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
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
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 text-white text-6xl font-bold shadow-inner">
                                {user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() : 'PV'}
                            </div>
                        )}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow disabled:opacity-50"
                        >
                            {uploadingAvatar ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" /> : <Camera className="w-4 h-4 text-slate-500" />}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg, image/png, image/webp"
                            className="hidden"
                            onChange={handleAvatarUpload}
                        />
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
                                    <EditableField
                                        icon={<BookOpen className="w-4 h-4" />}
                                        value={formData.field}
                                        onChange={update("field")}
                                        editing={editing}
                                        placeholder="Field of Interest (e.g. Science, Math)"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
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
                    <button onClick={() => router.push("/student-dashboard/courses")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition font-medium">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.slice(0, 2).map((enrollment) => {
                        const course = enrollment.course;
                        const progress = enrollment.progress;
                        
                        const totalLessons = course._count?.modules || 1;
                        const completedLessons = progress?.completedLessons || 0;
                        const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                        const isCompleted = percent >= 100;
                        const status = isCompleted ? "Completed" : "In Progress";
                        
                        const instructorName = course.instructor 
                            ? `${course.instructor.firstName} ${course.instructor.lastName}`
                            : "Instructor";
                        const instructorAvatarInitial = instructorName.charAt(0);

                        return (
                        <div key={enrollment.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                            <div className="relative h-36 bg-gradient-to-br from-indigo-100 to-violet-100">
                                {course.thumbnailUrl ? (
                                    <img
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-indigo-300" />
                                    </div>
                                )}
                                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${isCompleted ? 'bg-purple-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col gap-2.5 flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm border border-white">
                                        {instructorAvatarInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{course.title}</h3>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{course.category || "General"}</p>
                                    </div>
                                </div>

                                <ProgressBar
                                    value={percent}
                                    color={isCompleted ? "bg-purple-500" : "bg-indigo-500"}
                                />

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span>• {totalLessons} Lessons</span>
                                    <span className="text-slate-500 font-medium">
                                        {completedLessons}/{totalLessons} · {percent}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-xs text-slate-500 truncate max-w-[100px]">{instructorName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => router.push(course.type === "Hardcopy" 
                                                ? `/student-dashboard/coursedetails/courses/hardcopy?courseId=${course.id}`
                                                : `/student-dashboard/coursedetails/courses/coursedetails?courseId=${course.id}`)}
                                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                                        >
                                            {isCompleted ? "Review" : "Continue"}
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                    {enrolledCourses.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">You haven't enrolled in any courses yet.</p>
                            <button 
                                onClick={() => router.push("/student-dashboard/searchresults")}
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}