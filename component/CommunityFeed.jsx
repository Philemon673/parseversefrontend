"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  Trash2,
  Send,
  Play,
  ExternalLink,
  Users,
  Smile,
  X,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "@/lib/auth-context";
import {
  getAllPosts,
  likePost,
  dislikePost,
  deletePost,
  addPostComment,
  deletePostComment,
} from "@/lib/postService";

// Helper for initials
function getInitials(firstName = "", lastName = "") {
  return ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "PV";
}

// Helper to format date
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function CommentItem({ comment, postId, currentUserId, onDeleteComment }) {
  const author = comment.author || {};
  const initials = getInitials(author.firstName, author.lastName);

  return (
    <div className="flex items-start gap-2.5 group">
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={author.firstName}
          className="w-7 h-7 rounded-full object-cover border border-slate-100 flex-shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
          {initials}
        </div>
      )}
      <div className="flex-1 bg-slate-50 hover:bg-slate-100/70 rounded-2xl px-3.5 py-2.5 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            {author.firstName} {author.lastName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {currentUserId === comment.authorId && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                title="Delete comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
          {comment.text}
        </p>
      </div>
    </div>
  );
}

function CommentSection({ post, currentUserId, onCommentAdded, onCommentDeleted }) {
  const [commentText, setCommentText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  useEffect(() => {
    setComments(post.comments || []);
  }, [post.comments]);

  const handleSend = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addPostComment(post.id, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setShowEmoji(false);
      if (onCommentAdded) onCommentAdded(post.id, newComment);
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Error adding comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deletePostComment(post.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (onCommentDeleted) onCommentDeleted(post.id, commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Error deleting comment.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/30">
      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 mb-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={post.id}
              currentUserId={currentUserId}
              onDeleteComment={handleDeleteComment}
            />
          ))
        )}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder-slate-400 bg-white"
        />
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
        >
          <Smile className="w-4.5 h-4.5 text-slate-400 hover:text-indigo-600 transition-colors" />
        </button>
        {showEmoji && (
          <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl">
            <div className="relative">
              <button
                onClick={() => setShowEmoji(false)}
                className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50 z-50 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <EmojiPicker
                onEmojiClick={(emojiData) => setCommentText((prev) => prev + emojiData.emoji)}
                theme="light"
                height={300}
                width={280}
              />
            </div>
          </div>
        )}
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-xl bg-[#4f3fd8] flex items-center justify-center hover:bg-[#3d2fc0] transition-colors flex-shrink-0 shadow-md shadow-indigo-100"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function CommunityPostCard({ post, currentUserId, onDeletePost, onLike, onDislike, onCommentAdded, onCommentDeleted }) {
  const [playing, setPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const author = post.author || {};
  const initials = getInitials(author.firstName, author.lastName);

  // Check if link is a valid URL
  const externalLink = post.videoDuration && post.videoDuration.startsWith("http") ? post.videoDuration : null;

  const handleLike = async () => {
    if (liked) return;
    try {
      setLiked(true);
      if (disliked) {
        setDisliked(false);
      }
      onLike(post.id);
      await likePost(post.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (disliked) return;
    try {
      setDisliked(true);
      if (liked) {
        setLiked(false);
      }
      onDislike(post.id);
      await dislikePost(post.id);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "MENTOR":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "TUTOR":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "INSTRUCTOR":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "ADMIN":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        border: "1px solid #ede9fd",
        boxShadow: "0 4px 20px 0 rgba(79,63,216,0.03)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-3.5">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.firstName}
              className="w-10.5 h-10.5 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-10.5 h-10.5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 text-sm">
                {author.firstName} {author.lastName}
              </span>
              {author.role && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getRoleBadgeStyle(author.role)}`}>
                  {author.role.toLowerCase()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {currentUserId === post.authorId && (
          <button
            onClick={() => onDeletePost(post.id)}
            className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"
            title="Delete short"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Layout containing Media & Right Text Panel */}
      <div className="flex flex-col md:flex-row border-t border-slate-50">
        {/* Left: Media Player / Thumbnail */}
        {(post.type === "VIDEO" || post.image || post.videoUrl) && (
          <div className="flex-1 p-5 bg-slate-50/50 flex items-center justify-center">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner bg-black border border-slate-100/70">
              {post.type === "VIDEO" && post.videoUrl ? (
                playing ? (
                  <iframe
                    src={post.videoUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80"
                      alt="video thumbnail"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                    <button
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="w-15 h-15 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-[#4f3fd8] ml-1 fill-[#4f3fd8]" />
                      </div>
                    </button>
                    <span className="absolute top-3 left-3 bg-[#e11d48] text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      VIDEO SHORT
                    </span>
                  </>
                )
              ) : post.image ? (
                <img
                  src={post.image}
                  alt="short image"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              ) : null}
            </div>
          </div>
        )}

        {/* Right: Description & Social actions */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {post.text}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id || tag}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650 text-xs font-semibold"
                  >
                    #{tag.label || tag}
                  </span>
                ))}
              </div>
            )}

            {/* Visibility Link */}
            {externalLink && (
              <div className="pt-2">
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs font-black hover:bg-indigo-100 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Course / Profile
                </a>
              </div>
            )}
          </div>

          {/* Social Stats Buttons */}
          <div className="flex items-center gap-5 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                liked
                  ? "text-red-500 scale-105"
                  : "text-slate-450 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4.5 h-4.5 ${liked ? "fill-red-500" : ""}`} />
              {post.likes}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                disliked
                  ? "text-slate-800 scale-105"
                  : "text-slate-450 hover:text-slate-850"
              }`}
            >
              <ThumbsDown className={`w-4.5 h-4.5 ${disliked ? "fill-slate-800" : ""}`} />
              {post.dislikes}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                showComments ? "text-indigo-600" : "text-slate-450 hover:text-indigo-600"
              }`}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              {post.comments?.length || post._count?.comments || 0}
            </button>

            <button className="text-slate-400 hover:text-slate-600 transition ml-auto">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render Comment Box */}
      {showComments && (
        <CommentSection
          post={post}
          currentUserId={currentUserId}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
        />
      )}
    </div>
  );
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getAllPosts();
      setPostsList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load community shorts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this short?")) return;
    try {
      await deletePost(postId);
      setPostsList((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  const handleLikeLocal = (postId) => {
    setPostsList((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleDislikeLocal = (postId) => {
    setPostsList((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, dislikes: p.dislikes + 1 } : p))
    );
  };

  const handleCommentAddedLocal = (postId, newComment) => {
    setPostsList((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [newComment, ...(p.comments || [])],
              _count: { ...p._count, comments: (p._count?.comments || 0) + 1 },
            }
          : p
      )
    );
  };

  const handleCommentDeletedLocal = (postId, commentId) => {
    setPostsList((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: (p.comments || []).filter((c) => c.id !== commentId),
              _count: { ...p._count, comments: Math.max(0, (p._count?.comments || 1) - 1) },
            }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 flex flex-col gap-4 animate-pulse border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-1/6" />
              </div>
            </div>
            <div className="h-48 bg-slate-200 rounded-2xl w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (postsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 bg-white rounded-3xl border border-slate-100 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-650">
          <Play className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">No shorts or posts yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Upload your first video or picture short from your dashboard to connect with the ParseVerse community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {postsList.map((post) => (
        <CommunityPostCard
          key={post.id}
          post={post}
          currentUserId={user?.id}
          onDeletePost={handleDeletePost}
          onLike={handleLikeLocal}
          onDislike={handleDislikeLocal}
          onCommentAdded={handleCommentAddedLocal}
          onCommentDeleted={handleCommentDeletedLocal}
        />
      ))}
    </div>
  );
}
