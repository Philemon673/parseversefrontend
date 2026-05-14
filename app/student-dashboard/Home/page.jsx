"use client";
import SearchBar from "../../../student-component/searchBar"
import Post1 from "@/assets/post1.jpg";
import Post2 from "@/assets/post2.jpg";
import { useState } from "react";
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
  Scroll,
  Clock,
  CheckCircle2,
  ArrowRight,
  Video,
  Smile,
  User
} from "lucide-react";
import ScrollToTop from "../../../screens/scroll";

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

  function handleSend() {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      name: "You",
      initials: "RK",
      text: comment.trim(),
      time: "just now",
    };
    setComments((prev) => [newComment, ...prev]);
    setComment("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <CommentList comments={comments} />
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
        />
        <button className="text-xl"><Smile /></button>
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
  return (
    <div className="relative group overflow-hidden bg-white rounded-[2rem] p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-8 transition-all hover:shadow-2xl hover:shadow-indigo-200/50">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
              <Video className="w-8 h-8 text-white" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
            </span>
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Now
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Engineering</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
              Introduction to React 19 — Live Deep Dive
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                  <User className="w-3 h-3 text-indigo-600" />
               </div>
               <p className="text-xs text-slate-500 font-bold">Hosted by <span className="text-indigo-600">John Smiga</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
           <div className="flex items-center -space-x-3">
              {[1,2,3,4].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="participant" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">+28</div>
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

function DashboardHeader() {
  const activeCourses = [
    { id: 1, title: "React 19 Complete Guide", progress: 65, color: "from-blue-500 to-indigo-600" },
    { id: 2, title: "System Design Masterclass", progress: 32, color: "from-purple-500 to-pink-600" },
  ];
  return (
    <div className="flex flex-col gap-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Welcome back, Rajib! 👋</h1>
          <p className="text-slate-500 text-sm font-medium">You've completed 85% of your weekly goal.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
               <Clock className="w-5 h-5 text-orange-500" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Learned</p>
               <p className="text-sm font-black text-slate-900">12.4 hrs</p>
             </div>
           </div>
           <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</p>
               <p className="text-sm font-black text-slate-900">24 Lessons</p>
             </div>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCourses.map((course) => (
          <div key={course.id} className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${course.color} shadow-xl shadow-indigo-100`}>
             <div className="relative z-10">
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Continue Learning</span>
               <h3 className="text-lg font-black mt-1 mb-4">{course.title}</h3>
               <div className="space-y-2 mb-4">
                 <div className="flex items-center justify-between text-xs font-bold">
                   <span>{course.progress}% Complete</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white rounded-full" style={{ width: `${course.progress}%` }} />
                 </div>
               </div>
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all text-xs font-bold">
                 Resume Lesson <ArrowRight className="w-3.5 h-3.5" />
               </button>
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
             <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostsSection() {
  return (
    <div className="flex flex-col gap-5 w-full pb-10">
      <SearchBar />
      <div className="flex flex-col gap-6">
        <LiveSessionAlert />
        <DashboardHeader />
      </div>
      <ScrollToTop />
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-black text-slate-900">Recent Updates</h2>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <VideoCard post={videoPost} />
    </div>
  );
} 