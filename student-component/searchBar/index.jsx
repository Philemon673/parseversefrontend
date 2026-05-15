"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Mic,
  SlidersHorizontal,
  Check,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const trending = [
  { label: "Machine Learning Basics", views: "2.4M" },
  { label: "React 19 New Features", views: "1.8M" },
  { label: "Python for Beginners", views: "3.1M" },
  { label: "System Design Interview", views: "980K" },
  { label: "Next.js 15 Tutorial", views: "1.2M" },
];

const categories = [ 
  {label:"All", href:"/student-dashboard/Home"}, 
  {label:"Courses", href:"/student-dashboard/Home/courses"},
  {label:"Resources", href:"/student-dashboard/Home/Resources"},
  {label:"Live", href:"/student-dashboard/Home/live"}
];

const suggestions = [
  "react hooks tutorial",
  "react native for beginners",
  "react vs vue 2024",
  "react context api explained",
  "react query crash course",
];

const recentSearches = [
  "javascript async await",
  "tailwind css components",
  "next js app router",
];

const filterOptions = {
  Difficulty: ["Beginner", "Intermediate", "Advanced", "Expert"],
  Price: ["Free", "Paid", "Subscription"],
  Rating: ["4.5 & up", "4.0 & up", "3.5 & up", "All Ratings"],
  Duration: ["0–2 hours", "2–5 hours", "5–10 hours", "10+ hours"],
};

export default function SearchBar({ onSearch, hideCategories = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [recents, setRecents] = useState(recentSearches);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const filterRef = useRef(null);

  const totalSelected = Object.values(selected).flat().length;

  function toggleFilter(group, option) {
    setSelected((prev) => {
      const current = prev[group] || [];
      return {
        ...prev,
        [group]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  }

  const filtered = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(value) {
    const term = value || query;
    if (!term.trim()) return;
    if (!recents.includes(term)) {
      setRecents((prev) => [term, ...prev].slice(0, 6));
    }
    setQuery(term);
    setFocused(false);
    
    if (onSearch) {
      onSearch(term);
    } else {
      router.push(`/student-dashboard/searchresults?q=${encodeURIComponent(term)}`);
    }
  }

  function removeRecent(term) {
    setRecents((prev) => prev.filter((r) => r !== term));
  }

  return (
    <div className="bg-white flex flex-col items-center pt-6 px-4 pb-4">

      {/* Category Pills */}
      {!hideCategories && (
        <div className="flex items-center gap-2 mb-5 flex-wrap justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={() => setActiveCategory(cat.label)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium transition " +
                (activeCategory === cat.label
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200")
              }
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}

      {/* Search Wrapper */}
      <div ref={wrapperRef} className="w-full max-w-2xl relative">

        {/* Search Input */}
        <div
          className={
            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 " +
            (focused
              ? "bg-white border-indigo-300 shadow-lg shadow-slate-100"
              : "bg-slate-50 border-slate-200 hover:border-slate-300")
          }
        >
          <Search className={`w-5 h-5 flex-shrink-0 transition ${focused ? "text-indigo-500" : "text-slate-400"}`} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
              if (e.key === "Escape") setFocused(false);
            }}
            placeholder="Search courses, mentors, topics..."
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />

          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}

          <div className="w-px h-5 bg-slate-200" />
          <button className="text-slate-400 hover:text-slate-700 transition">
            <Mic className="w-5 h-5" />
          </button>

          {/* Filter Dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen((v) => !v); setFocused(false); }}
              className={`flex items-center gap-1.5 transition relative ${
                filterOpen || totalSelected > 0 ? "text-indigo-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {totalSelected > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center">
                  {totalSelected}
                </span>
              )}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-500" /> Filter Results
                  </span>
                  {totalSelected > 0 && (
                    <button
                      onClick={() => setSelected({})}
                      className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-5 max-h-80 overflow-y-auto">
                  {Object.entries(filterOptions).map(([group, options]) => (
                    <div key={group}>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">{group}</p>
                      <div className="space-y-1.5">
                        {options.map((option) => {
                          const isChecked = (selected[group] || []).includes(option);
                          return (
                            <label
                              key={option}
                              onClick={() => toggleFilter(group, option)}
                              className="flex items-center gap-3 cursor-pointer group py-0.5"
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                                isChecked ? "bg-indigo-600 border-indigo-600" : "border-slate-200 group-hover:border-indigo-300"
                              }`}>
                                {isChecked && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm transition-colors ${
                                isChecked ? "text-slate-900 font-semibold" : "text-slate-500 group-hover:text-slate-700"
                              }`}>
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-slate-50">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown */}
        {focused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">

            {/* Autocomplete suggestions */}
            {filtered.length > 0 && (
              <div className="py-2">
                {filtered.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => handleSearch(s)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group"
                  >
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="flex-1 text-left text-sm text-slate-700">
                      {s.split(new RegExp(`(${query})`, "gi")).map((part, i) =>
                        part.toLowerCase() === query.toLowerCase()
                          ? <span key={i} className="text-indigo-600 font-semibold">{part}</span>
                          : part
                      )}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition" />
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query.trim() && recents.length > 0 && (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recent</span>
                  <button
                    onMouseDown={() => setRecents([])}
                    className="text-[11px] text-indigo-500 hover:text-indigo-400 transition"
                  >
                    Clear all
                  </button>
                </div>
                {recents.map((r) => (
                  <div
                    key={r}
                    onMouseDown={() => handleSearch(r)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-600">{r}</span>
                    <button
                      onMouseDown={(e) => { e.stopPropagation(); removeRecent(r); }}
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!query.trim() && <div className="h-px bg-slate-100 mx-4" />}

            {/* Trending */}
            {!query.trim() && (
              <div className="py-2">
                <div className="px-4 py-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trending</span>
                </div>
                {trending.map((t, i) => (
                  <button
                    key={t.label}
                    onMouseDown={() => handleSearch(t.label)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group"
                  >
                    <TrendingUp className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span className="flex-1 text-left text-sm text-slate-700">{t.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">{t.views} views</span>
                      <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded-full">
                        #{i + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query.trim() && filtered.length === 0 && (
              <div className="px-4 py-6 flex flex-col items-center gap-2">
                <Search className="w-8 h-8 text-slate-200" />
                <p className="text-sm text-slate-400">
                  No results for <span className="text-slate-600">"{query}"</span>
                </p>
                <button
                  onMouseDown={() => handleSearch()}
                  className="mt-1 text-xs text-indigo-500 hover:text-indigo-400 transition"
                >
                  Search anyway <ArrowUpRight className="inline w-3 h-3 ml-0.5" />
                </button>
              </div>
            )}

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-300">Press Enter to search</span>
              <span className="text-[10px] text-slate-300">Esc to close</span>
            </div>
          </div>
        )}
      </div>

      {/* Trending Tags */}
      <div className="pt-4 flex items-center gap-2 flex-wrap justify-center">
        <span className="text-slate-400 text-xs">Trending:</span>
        {trending.slice(0, 4).map((t) => (
          <button
            key={t.label}
            onClick={() => handleSearch(t.label)}
            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-400 transition"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}