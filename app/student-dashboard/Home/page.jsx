"use client";
import SearchBar from "../../../student-component/searchBar"
import Post1 from "@/assets/post1.jpg";
import Post2 from "@/assets/post2.jpg";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Users,
  Send,
  Play,
 X,
  ArrowRight,
  Video,
  Smile,
  User
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import ScrollToTop from "../../../screens/scroll";
import { getMyEnrolledCourses } from "../../../lib/courseService";
import { useAuth } from "@/lib/auth-context";
import { BookOpen, Award, Clock } from "lucide-react";

const posts = [
  {
    id: 2,
    author: "Mashok Khan",
    time: "1h ago",
    role: "Mentor",
    isVip: true,
    mentorCount: null,
    image: Post2,
    tags: ["Python", "Programming"],
    pinnedContent: {
      author: "Mashok Khan",
      time: "1h ago",
      isVip: false,
      mentorCount: null,
      text: "Excited to share a new Data Science Introduction video! 🚀 This video covers the essentials of what Data Science is and how you can start your journey!",
      hashtags: ["#DataScience", "#MachineLearning"],
    },
    likes: 421,
    dislikes: 18,
    comments: 87,
    commentInput: true,
    initialComments: [
      { id: 1, name: "Donald Williams", initials: "DW", text: "Data Science is the future!", time: "20 min ago" },
      { id: 2, name: "Marissa Ray", initials: "MR", text: "Loved this breakdown 🔥", time: "35 min ago" },
      { id: 3, name: "Sebastian Kim", initials: "SK", text: "Very well explained!", time: "40 min ago" },
    ],
  },
];

const videoPost = {
  id: 3,
  author: "Bilal Ahmed",
  time: "3h ago",
  role: "Instructor",
  isVip: true,
  mentorCount: 3,
  videoThumb: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80",
  videoDuration: "12:45",
  tags: ["JavaScript", "WebDev"],
  pinnedContent: {
    author: "Bilal Ahmed",
    time: "3h ago",
    isVip: true,
    mentorCount: 2,
    text: "Just dropped a full JavaScript crash course! 🎬 From variables to async/await — everything you need to get started with modern JS development.",
    hashtags: ["#JavaScript", "#WebDevelopment", "#Coding"],
  },
  likes: 612,
  dislikes: 22,
  comments: 134,
  commentInput: true,
  initialComments: [
    { id: 1, name: "Martin Nel", initials: "MN", text: "Best JS course I've seen!", time: "1h ago" },
    { id: 2, name: "Marissa Ray", initials: "MR", text: "async/await section was 🔥", time: "2h ago" },
    { id: 3, name: "Donald Williams", initials: "DW", text: "Shared this with my whole team.", time: "2h ago" },
  ],
};


// ── Sub Components ────────────────────────────────────────────────────────────

function Avatar({ initials, className = "" }) {
  return (
    <div className={`rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

function MentorBadge() {
  return (
    <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
      <Users className="w-3 h-3" />
       Tutor
    </span>
  );
}

function Tag({ label }) {
  return (
    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
      #{label}
    </span>
  );
}

function ActionBtn({ icon: Icon, count, color = "text-gray-500" }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`flex items-center gap-1.5 text-sm font-medium transition ${active ? color : "text-gray-400 hover:text-gray-600"}`}
    >
      <Icon className="w-4 h-4" />
      {count}
    </button>
  );
}

function CommentList({ comments }) {
  if (comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {c.initials}
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl px-3 py-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{c.name}</span>
              <span className="text-[10px] text-gray-400">{c.time}</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentInput({ initialComments = [] }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [showEmoji, setShowEmoji] = useState(false);

  function handleSend() {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      name: "You",
      initials: "Y",
      text: comment.trim(),
      time: "just now",
    };
    setComments((prev) => [newComment, ...prev]);
    setComment("");
    setShowEmoji(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  const onEmojiClick = (emojiObject) => {
    setComment((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 relative">
      <CommentList comments={comments} />
      {showEmoji && (
        <div className="absolute bottom-12 right-0 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
        />
        <button 
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
        >
          <Smile className="w-5 h-5 text-slate-400 hover:text-indigo-600 transition-colors" />
        </button>
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function CardHeader({ post }) {
  return (
    <div className="bg-white flex items-center justify-between px-5 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <Avatar initials="MK" className="w-10 h-10 text-sm" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{post.author}</span>
            {post.mentorCount && <MentorBadge count={post.mentorCount} />}
            {post.role && <span className="text-white bg-purple-500 py-1 px-3 rounded-full text-xs">{post.role}</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-400 text-xs">{post.time}</span>
            <button className="text-gray-400 hover:text-red-400 transition">
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}

function RightPanel({ post }) {
  return (
    <div className="flex-1 px-4 pb-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Avatar initials="MK" className="w-9 h-9 text-xs" />
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{post.pinnedContent.author}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-400 text-xs">{post.pinnedContent.time}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{post.pinnedContent.text}</p>
      {post.pinnedContent.hashtags && (
        <div className="flex flex-wrap gap-1">
          {post.pinnedContent.hashtags.map((tag) => (
            <span key={tag} className="text-purple-600 text-sm font-medium">{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-5 mt-auto pt-2">
        <ActionBtn icon={Heart} count={post.likes} color="text-red-500" />
        <ActionBtn icon={ThumbsDown} count={post.dislikes} color="text-gray-600" />
        <ActionBtn icon={MessageCircle} count={post.comments} color="text-blue-500" />
        <button className="text-gray-400 hover:text-gray-600 transition ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      {post.commentInput && <CommentInput initialComments={post.initialComments || []} />}
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div className="bg-[#f2f3fa] rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <CardHeader post={post} />
      <div className="bg-white flex flex-col md:flex-row">
        <div className="flex-1 px-5 pb-4 flex flex-col gap-3">
          <img
            src={post.image.src}
            alt="post"
            className="w-full h-90 object-cover rounded-xl"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
        <RightPanel post={post} />
      </div>
    </div>
  );
}

function VideoCard({ post }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-[#f2f3fa] rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <CardHeader post={post} />
      <div className="bg-white flex flex-col md:flex-row">
        <div className="flex-1 px-5 pb-4 flex flex-col gap-3">
          <div className="relative w-full h-90 rounded-xl overflow-hidden">
            <img
              src={post.videoThumb}
              alt="video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={() => setPlaying(!playing)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-indigo-600 ml-1" fill="#4f46e5" />
              </div>
            </button>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {post.videoDuration}
            </span>
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Play className="w-2.5 h-2.5" fill="white" />
              VIDEO
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
        <RightPanel post={post} />
      </div>
    </div>
  );
}

function LiveSessionAlert({ sessionId = "react-19-deep-dive" }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative group overflow-hidden bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-8 transition-all hover:shadow-2xl hover:shadow-indigo-200/50">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors z-20 text-slate-400"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Dynamic Background Mesh */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 pr-8">
        <div className="flex items-start md:items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
              <Video className="w-8 h-8 text-white" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Now
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                Engineering
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
              Introduction to React 19 — Live Deep Dive
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                <User className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-xs text-slate-500 font-bold">
                Hosted by <span className="text-indigo-600">John Smiga</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?u=${i + 20}`}
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                alt="participant"
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
              +28
            </div>
          </div>

          <button
            onClick={() => router.push(`/student-dashboard/sessions/${sessionId}`)}
            className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group/btn"
          >
            Join Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}



// ── Student Dashboard Overview Widgets ───────────────────────────────────────

function WelcomeBanner({ name }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-6 shadow-xl mb-2 text-white border border-white/10">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-30%] right-[-10%] w-60 h-60 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-pink-500/20 rounded-full blur-xl" />
      
      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight">{greeting}, {name || "Scholar"}! 👋</h2>
        <p className="text-purple-100 text-xs mt-0.5 max-w-md leading-relaxed">
          Welcome back to ParseVerse! Ready to continue your learning journey? Monitor your stats and jump right back in below.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300 flex-1 min-w-[140px]">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-black text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ResumeCard({ enrollment }) {
  const router = useRouter();
  if (!enrollment) return null;
  const { course, progress } = enrollment;
  const totalLessons = course._count?.modules || 1;
  const completedLessons = progress?.completedLessons || 0;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-850 text-sm">Resume Learning</h3>
        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">
          Last Active
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 font-black text-indigo-600 text-lg shadow-sm">
          {course.title ? course.title.charAt(0) : "C"}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">{course.title}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">by {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Instructor"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-500 font-bold">Progress</span>
          <span className="text-indigo-600 font-extrabold">{percent}% Completed</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{completedLessons} of {totalLessons} modules completed</span>
      </div>

      <button
        onClick={() => {
          const url = course.type === "Hardcopy"
            ? `/student-dashboard/coursedetails/courses/hardcopy?courseId=${course.id}`
            : `/student-dashboard/coursedetails/courses/coursedetails?courseId=${course.id}`;
          router.push(url);
        }}
        className="w-full py-3 rounded-xl bg-indigo-650 text-white font-bold text-[11px] hover:bg-indigo-700 transition flex items-center justify-center gap-2 mt-1 shadow-lg shadow-indigo-150"
      >
        <Play className="w-3.5 h-3.5 fill-white" /> Resume Now
      </button>
    </div>
  );
}

function ScheduleWidget() {
  const schedules = [
    { title: "React 19 Deep Dive", time: "Today, 4:00 PM", tutor: "John Smiga", status: "Live Soon" },
    { title: "Python Algorithm Q&A", time: "Tomorrow, 2:00 PM", tutor: "Mashok Khan", status: "Scheduled" },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
      <h3 className="font-black text-slate-800 text-sm">Upcoming Sessions</h3>
      <div className="flex flex-col gap-3">
        {schedules.map((s, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5 relative overflow-hidden group hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${s.status === "Live Soon" ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-600"}`}>
                {s.status}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{s.time}</span>
            </div>
            <h4 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-indigo-600 transition-colors">{s.title}</h4>
            <p className="text-[10px] text-slate-400 font-medium">Tutor: <span className="text-slate-600 font-bold">{s.tutor}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostsSection() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getMyEnrolledCourses();
        setEnrollments(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter(e => {
    const total = e.course._count?.modules || 1;
    const completedCount = e.progress?.completedLessons || 0;
    return completedCount >= total;
  }).length;
  const inProgress = totalEnrolled - completed;

  // Get the most recently active in-progress course
  const activeCourse = enrollments.find(e => {
    const total = e.course._count?.modules || 1;
    const completedCount = e.progress?.completedLessons || 0;
    return completedCount < total;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <SearchBar />
      
      {/* Dynamic Welcome Banner */}
      <WelcomeBanner name={user?.name} />

      {/* Grid Layout containing Main Dashboard and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left Column: Dashboard stats, resume learning, and social feed (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Stats Cards Row */}
          <div className="flex flex-wrap gap-4">
            <StatCard 
              label="Enrolled Courses" 
              value={loading ? "..." : String(totalEnrolled)} 
              icon={BookOpen} 
              colorClass="text-indigo-600" 
              bgClass="bg-indigo-50 border border-indigo-100" 
            />
            <StatCard 
              label="In Progress" 
              value={loading ? "..." : String(inProgress)} 
              icon={Clock} 
              colorClass="text-purple-600" 
              bgClass="bg-purple-50 border border-purple-100" 
            />
            <StatCard 
              label="Certificates" 
              value={loading ? "..." : String(completed)} 
              icon={Award} 
              colorClass="text-pink-600" 
              bgClass="bg-pink-50 border border-pink-100" 
            />
          </div>

          {/* Resume Learning Card if there is an active course */}
          {!loading && activeCourse && (
            <ResumeCard enrollment={activeCourse} />
          )}

          {/* Social Feed Posts */}
          <div className="flex flex-col gap-6 mt-2">
            <h3 className="font-black text-slate-800 text-sm px-1">Community Feed</h3>
            
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <VideoCard post={videoPost} />
          </div>
        </div>

        {/* Right Column: Live Session alerts & Upcoming schedule (3 columns) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <LiveSessionAlert />
          <ScheduleWidget />
        </div>

      </div>

      <ScrollToTop />
    </div>
  );
} 