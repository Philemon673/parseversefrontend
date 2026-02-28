"use client";

import Post1 from "@/assets/post1.jpg";
import Post2 from "@/assets/post2.jpg";
import { useState } from "react";
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Users,
  Send,
  Play,
} from "lucide-react";

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



function MentorBadge({  }) {
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

// ── Comment List ──────────────────────────────────────────────────────────────

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

// ── Comment Input ─────────────────────────────────────────────────────────────

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
    // ✅ newest comment prepended to front
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
      {/* ✅ newest at top, scroll down for older */}
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
        <button className="text-xl">😊</button>
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

// ── Card Header ───────────────────────────────────────────────────────────────

function CardHeader({ post }) {
  return (
    <div className="bg-white flex items-center justify-between px-5 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <Avatar initials="MK" className="w-10 h-10 text-sm" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{post.author}</span>
           
            {post.mentorCount && <MentorBadge count={post.mentorCount} />}
            {post.role && <span className="text-white  bg-purple-500 and bg-purple-600 py-1 px-3 rounded-full text-xs">{post.role}</span>}
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

// ── Right Panel ───────────────────────────────────────────────────────────────

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
            <button className="text-gray-400 hover:text-red-400 transition">
              
            </button>
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

      {/* ✅ passes initialComments per post */}
      {post.commentInput && <CommentInput initialComments={post.initialComments || []} />}
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({ post }) {
  return (
    <div className="bg-[#f2f3fa] rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <CardHeader post={post} />
      <div className="bg-white flex">
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

// ── Video Card ────────────────────────────────────────────────────────────────

function VideoCard({ post }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-[#f2f3fa] rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <CardHeader post={post} />
      <div className="bg-white flex">
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

// ── Posts Section ─────────────────────────────────────────────────────────────

export default function PostsSection() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <VideoCard post={videoPost} />
    </div>
  );
}