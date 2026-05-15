"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Play,
  Heart,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Users,
  Star,
  Eye,
  ChevronDown,
  Lock,
  Bookmark,
  Check,
  ArrowUp,
} from "lucide-react";
import SearchBar from "../../../student-component/searchBar";
import ScrollToTop from "../../../screens/scroll";

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = ["All", "Courses", "Mentors", "Tutorials", "Live", "Shorts"];

const sortOptions = [
  { label: "Relevance", desc: "Best match first" },
  { label: "Newest", desc: "Most recently added" },
  { label: "Top Rated", desc: "Highest rated first" },
  { label: "Most Viewed", desc: "Most popular first" },
];

const contentCards = [
  {
    id: 1,
    type: "video",
    paid: true,
    title: "React 19 Complete Guide — From Zero to Production",
    author: "Sarah Chen",
    role: "Senior Frontend Engineer",
    avatar: "SC",
    duration: "2h 34m",
    views: "1.8M",
    rating: 4.9,
    reviews: 3241,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    tags: ["React", "JavaScript", "Frontend"],
    price: "$49",
    level: "Intermediate",
    time: "2h ago",
    likes: 842,
    dislikes: 31,
    comments: [
      { id: 1, initials: "DW", name: "Donald Williams", text: "Best React course I've taken. The concurrent features section was eye-opening!", time: "20 min ago" },
      { id: 2, initials: "MR", name: "Marissa Ray", text: "Sarah explains complex concepts so clearly. Already applying at work.", time: "35 min ago" },
      { id: 3, initials: "SK", name: "Sebastian Kim", text: "Worth every penny. Project-based approach really helps it stick.", time: "40 min ago" },
    ],
    description: "A comprehensive, project-based journey through React 19's most powerful features — including Server Components, concurrent rendering, and the new hooks API.",
    hashtags: ["#React19", "#Frontend", "#JavaScript"],
  },
  {
    id: 2,
    type: "image",
    paid: false,
    title: "System Design Cheat Sheet — Every Pattern You Need",
    author: "Dev Insights",
    role: "Tech Education Lead",
    avatar: "DI",
    views: "980K",
    rating: 4.7,
    reviews: 1892,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=800&auto=format&fit=crop&q=60",
    tags: ["System Design", "Architecture", "Interview"],
    price: "Free",
    level: "Advanced",
    time: "5h ago",
    likes: 1204,
    dislikes: 18,
    comments: [
      { id: 1, initials: "CV", name: "Carlos V.", text: "Saved immediately. Load balancing section is exactly what I needed before my interview.", time: "1h ago" },
      { id: 2, initials: "AW", name: "Ada W.", text: "Covers everything from CAP theorem to consistent hashing. Incredible resource.", time: "2h ago" },
      { id: 3, initials: "RP", name: "Ravi P.", text: "Shared with my entire team. We use it as a reference in design reviews.", time: "4h ago" },
    ],
    description: "A visual reference covering every major system design pattern — from load balancing and sharding to event-driven architectures and CAP theorem.",
    hashtags: ["#SystemDesign", "#Architecture", "#InterviewPrep"],
  },
  {
    id: 3,
    type: "video",
    paid: true,
    title: "Mastering Next.js 15: The Ultimate Dashboard Build",
    author: "James Wilson",
    role: "Fullstack Architect",
    avatar: "JW",
    duration: "4h 12m",
    views: "450K",
    rating: 4.8,
    reviews: 1205,
    thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60",
    tags: ["Next.js", "Tailwind", "Fullstack"],
    price: "$29",
    level: "Advanced",
    time: "1d ago",
    likes: 511,
    dislikes: 9,
    comments: [
      { id: 1, initials: "MN", name: "Martin Nel", text: "Best Next.js course on the internet right now.", time: "3h ago" },
      { id: 2, initials: "LK", name: "Lena K.", text: "The dashboard section alone is worth the price.", time: "5h ago" },
      { id: 3, initials: "TB", name: "Tom B.", text: "Clean code, great explanations. 10/10.", time: "8h ago" },
    ],
    description: "Build a production-ready analytics dashboard using Next.js 15, Tailwind CSS, and Prisma — with full auth, dark mode, and real-time data.",
    hashtags: ["#NextJS", "#Tailwind", "#Fullstack"],
  },
  {
    id: 4,
    type: "video",
    paid: false,
    title: "Java Programming Masterclass for Software Developers",
    author: "Tim Buchalka",
    role: "Expert Java Developer",
    avatar: "TB",
    duration: "80h 24m",
    views: "3.2M",
    rating: 4.9,
    reviews: 15420,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    tags: ["Java", "Backend", "Programming"],
    price: "Free",
    level: "Beginner",
    time: "3d ago",
    likes: 6200,
    dislikes: 104,
    comments: [
      { id: 1, initials: "AJ", name: "Alex J.", text: "Went from zero to landing a Java dev job. This course is incredible.", time: "1d ago" },
      { id: 2, initials: "PK", name: "Priya K.", text: "Tim is an amazing instructor. Covers everything thoroughly.", time: "2d ago" },
      { id: 3, initials: "JB", name: "Jordan B.", text: "The OOP section finally made things click for me.", time: "2d ago" },
    ],
    description: "The most complete Java course available. Covers core Java, OOP, collections, streams, lambdas, generics, and real-world project building.",
    hashtags: ["#Java", "#Backend", "#Programming"],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initials, color = "from-orange-400 to-pink-500" }) {
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm border-2 border-white`}>
      {initials}
    </div>
  );
}

function Tag({ label }) {
  return (
    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-tight">
      #{label}
    </span>
  );
}

function CommentList({ comments }) {
  if (!comments?.length) return null;
  return (
    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin mt-2">
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5">
            {c.initials}
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] font-semibold text-gray-800">{c.name}</span>
              <span className="text-[10px] text-gray-400">{c.time}</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionButton({ icon: Icon, count, activeColor = "text-red-500" }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive((v) => !v)}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${active ? activeColor : "text-gray-400 hover:text-gray-600"}`}
    >
      <Icon className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
      <span className="text-xs">{count}</span>
    </button>
  );
}


// ── Sort Dropdown ─────────────────────────────────────────────────────────────

export function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex bg-indigo-600 p-1.5 rounded-2xl">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs text-white font-bold transition-all 
           
          }`}
        >
          Sort: {sortBy}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/80 z-30 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort by</span>
          </div>
          {sortOptions.map(({ label, desc }) => (
            <button
              key={label}
              onClick={() => { setSortBy(label); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${sortBy === label ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
            >
              <div className="text-left">
                <p className={`font-semibold ${sortBy === label ? "text-indigo-600" : "text-gray-700"}`}>
                  {label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              {sortBy === label && <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Content Card ──────────────────────────────────────────────────────────────

function ContentCard({ card }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    if (card.paid) {
      router.push("/student-dashboard/coursedetails");
    } else {
      const baseUrl = card.type === "video"
        ? "/student-dashboard/coursedetails/courses/coursedetails"
        : "/student-dashboard/coursedetails/courses/hardcopy";
      router.push(`${baseUrl}?courseId=${card.id}`);
    }
  };



  return (
    <div 
      onClick={handleClick}
      className="bg-[#f2f3fa] rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full transition-all hover:shadow-md cursor-pointer"
    >

      {/* Card Header */}
      <div className="bg-white flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar initials={card.avatar} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm tracking-tight">{card.author}</span>
              <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                <Users className="w-3 h-3" /> Tutor
              </span>
              {card.role && (
                <span className="text-white bg-purple-500 py-0.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {card.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-gray-400 text-[10px] font-medium">{card.time}</span>
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

      {/* Card Body */}
      <div className="bg-white flex border-t border-gray-50">

        {/* Left: Media Content */}
        <div className="flex-1 px-5 pb-5 pt-3 flex flex-col gap-3">
          <div className="relative w-full rounded-2xl overflow-hidden group cursor-pointer aspect-video shadow-sm">
            <img
              src={card.thumbnail}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

            {card.type === "video" && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-indigo-600 fill-indigo-600 ml-0.5" />
                  </div>
                </div>
                {card.duration && (
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
                    {card.duration}
                  </span>
                )}
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Play className="w-2.5 h-2.5 fill-white" /> VIDEO
                </span>
              </>
            )}

            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg ${card.paid ? "bg-amber-400 text-amber-900" : "bg-emerald-400 text-emerald-900"
              }`}>
              {card.paid ? <Lock className="w-2.5 h-2.5 inline mr-1" /> : <Star className="w-2.5 h-2.5 inline mr-1 fill-emerald-900" />}
              {card.paid ? card.price : "FREE"}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {card.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="flex-1 px-5 pb-5 pt-3 flex flex-col gap-4 border-l border-gray-50 bg-slate-50/30">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2">
              {card.title}
            </h3>
            <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-2">{card.description}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {card.hashtags.map((h) => (
              <span key={h} className="text-indigo-600 text-xs font-bold">{h}</span>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-gray-800">{card.rating}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {card.views}
              </span>
            </div>
            <span className="text-gray-400 lowercase">{card.level}</span>
          </div>

          {/* Interaction Row */}
          <div className="flex items-center gap-6">
            <ActionButton icon={Heart} count={card.likes.toLocaleString()} />
            <ActionButton icon={ThumbsDown} count={card.dislikes} activeColor="text-slate-700" />
            <ActionButton icon={MessageCircle} count={card.comments.length} activeColor="text-indigo-600" />
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setSaved(!saved)} className={`transition-colors ${saved ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}>
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <CommentList comments={card.comments} />
        </div>
      </div>
    </div>
  );
}

// ── Category Tabs ─────────────────────────────────────────────────────────────

function CategoryTabs({ activeCategory, onChange, className }) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-500 hover:text-indigo-600 border border-gray-100"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ── Search & Filter Logic ─────────────────────────────────────────────────────

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryFromUrl = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  // Sync local state when URL param changes
  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const filteredCards = contentCards.filter((card) => {
    const matchesCategory =
      activeCategory === "All" ||
      card.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase())) ||
      card.type.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      card.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Only push to router; useEffect above will sync searchQuery
  const handleSearch = (term) => {
    router.push(`/student-dashboard/searchresults?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top Search Bar Area */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="w-full flex justify-center py-2">
          <div className="w-full max-w-3xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-10">


        {/* Results Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
              {searchQuery ? `Results for "${searchQuery}"` : "Discover Expertise"}
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                {filteredCards.length} matches
              </span>
            </h2>
            <p className="text-base text-gray-400 font-medium mt-2">Personalized learning paths curated just for you</p>
          </div>

          <SortDropdown />
        </div>

        {/* Result Cards */}
        {filteredCards.length > 0 ? (
          <div className="flex flex-col gap-10">
            {filteredCards.map((card) => (
              <ContentCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
            <Search className="w-20 h-20 text-slate-200 mb-8" />
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No results found for "{searchQuery}"</h3>
            <p className="text-slate-500 text-base max-w-md text-center mb-10">
              Don't give up! Try searching for broader terms or explore our popular categories below.
            </p>
            <button
              onClick={() => handleSearch("")}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1"
            >
              Explore All Content
            </button>
          </div>
        )}

        {/* Pagination/Load More */}
        {filteredCards.length > 0 && (
          <div className="mt-20 flex flex-col items-center gap-8">
            <button className="px-16 py-5 bg-indigo-600 rounded-[2.5rem] text-base font-black text-white hover:bg-indigo-700 hover:text-white transition shadow-xl hover:shadow-indigo-50">
              Load More Results
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
}


// ── Main Entry ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#f2f3fa] font-sans selection:bg-indigo-100 selection:text-indigo-600">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Filtering courses...</div>}>
        <SearchResultsContent />
      </Suspense>
      <>
           
           <ScrollToTop />
           </>
    </div>
  );
}