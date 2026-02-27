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
  Lock,
  Users,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const posts = [
  {
    id: 1,
    author: "Mashok Khan",
    time: "1h ago",
    role: null,
    isVip: true,
    mentorCount: 2,
    image: Post1,
    tags: ["Python", "Programming"],
    pinned: true,
    pinnedContent: {
      author: "Mashok Khan",
      time: "1h ago",
      isVip: true,
      mentorCount: 1,
      text: 'Just posted a new tutorial on "Python for Beginners"! Learn the basics of Python in a fun and interactive way. Check it out now!',
    },
    likes: 245,
    dislikes: 10,
    comments: 53,
  },
  {
    id: 2,
    author: "Mashok Khan",
    time: "1h ago",
    role: "Mentor",
    isVip: true,
    mentorCount: null,
    image: Post2,
    tags: ["Python", "Programming"],
    pinned: false,
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
  },
];

// ── Sub Components ────────────────────────────────────────────────────────────

function Avatar({ initials, className = "" }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

function VipBadge() {
  return (
    <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
      ⚡ VIP
    </span>
  );
}

function MentorBadge({ count }) {
  return (
    <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
      <Users className="w-3 h-3" />
      {count} mentor
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
      className={`flex items-center gap-1.5 text-sm font-medium transition ${
        active ? color : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      {count}
    </button>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({ post }) {
  return (
    <div className="bg-[#f2f3fa] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <div className=" bg-white flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar initials="MK" className="w-10 h-10 text-sm" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                {post.author}
              </span>
              {post.isVip && <VipBadge />}
              {post.mentorCount && <MentorBadge count={post.mentorCount} />}
              {post.role && (
                <span className="text-gray-500 text-xs">{post.role}</span>
              )}
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

      {/* Two-column body */}
      <div className="bg-white flex gap-0">
        {/* Left — post image + tags */}
        <div className="flex-1 px-5 pb-4 flex flex-col gap-3">
          <img
            src={post.image.src}
            alt="post"
            className="w-full h-56 object-cover rounded-xl"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Right — pinned / text content */}
        <div className="w-[340px] flex-shrink-0 px-4 pb-4 flex flex-col gap-3">
          {post.pinned && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium bg-gray-50 rounded-lg px-3 py-1.5 w-fit">
              <Lock className="w-3 h-3" />
              Pinned Post
            </div>
          )}

          {/* Inner author info */}
          <div className="flex items-center gap-2">
            <Avatar initials="MK" className="w-9 h-9 text-xs" />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">
                  {post.pinnedContent.author}
                </span>
                {post.pinnedContent.isVip && <VipBadge />}
                {post.pinnedContent.mentorCount && (
                  <MentorBadge count={post.pinnedContent.mentorCount} />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-gray-400 text-xs">
                  {post.pinnedContent.time}
                </span>
                <button className="text-gray-400 hover:text-red-400 transition">
                  <Heart className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Post text */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {post.pinnedContent.text}
          </p>

          {/* Hashtags */}
          {post.pinnedContent.hashtags && (
            <div className="flex flex-wrap gap-1">
              {post.pinnedContent.hashtags.map((tag) => (
                <span key={tag} className="text-purple-600 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-5 mt-auto pt-2">
            <ActionBtn icon={Heart} count={post.likes} color="text-red-500" />
            <ActionBtn
              icon={ThumbsDown}
              count={post.dislikes}
              color="text-gray-600"
            />
            <ActionBtn
              icon={MessageCircle}
              count={post.comments}
              color="text-blue-500"
            />
            <button className="text-gray-400 hover:text-gray-600 transition ml-auto">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Comment input */}
          {post.commentInput && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
              />
              <button className="text-xl">😊</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Posts Section (default export) ───────────────────────────────────────────

export default function PostsSection() {
  return (
    <div className="flex flex-col gap-5 max-w-[960px] mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}