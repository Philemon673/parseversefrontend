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
} from "lucide-react";

const trending = [
  { label: "Machine Learning Basics", views: "2.4M" },
  { label: "React 19 New Features", views: "1.8M" },
  { label: "Python for Beginners", views: "3.1M" },
  { label: "System Design Interview", views: "980K" },
  { label: "Next.js 15 Tutorial", views: "1.2M" },
];

const categories = ["All", "Courses", "Mentors", "Tutorials", "Live", "Shorts"];

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

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [recents, setRecents] = useState(recentSearches);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const filtered = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
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
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setFocused(false);
  }

  function removeRecent(term) {
    setRecents((prev) => prev.filter((r) => r !== term));
  }

  return (
    <div className="bg-white rounded-xl flex flex-col items-center justify-start pt-8 px-4">

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-5 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-medium transition " +
              (activeCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Wrapper */}
      <div ref={wrapperRef} className="w-full max-w-2xl relative">

        {/* Search Input */}
        <div
          className={
            "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 " +
            (focused
              ? "bg-white border-indigo-300 shadow-lg shadow-slate-200"
              : "bg-slate-50 border-slate-200 hover:border-slate-300")
          }
        >
          <Search className={
            "w-5 h-5 flex-shrink-0 transition " +
            (focused ? "text-indigo-500" : "text-slate-400")
          } />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, mentors, topics..."
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />

          {/* Clear button */}
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200" />

          {/* Mic */}
          <button className="text-slate-400 hover:text-slate-700 transition">
            <Mic className="w-5 h-5" />
          </button>

          {/* Filter */}
          <button className="text-slate-400 hover:text-slate-700 transition">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
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
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition group cursor-pointer"
                    onMouseDown={() => handleSearch(r)}
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

            {/* Divider */}
            {!query.trim() && <div className="h-px bg-slate-100 mx-4" />}

            {/* Trending */}
            {!query.trim() && (
              <div className="py-2">
                <div className="px-4 py-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Trending
                  </span>
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
                  Search anyway →
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
      <div className=" py-5 flex items-center gap-2 flex-wrap justify-center">
        <span className="text-slate-400 text-xs">Trending:</span>
        {trending.slice(0, 4).map((t) => (
          <button
            key={t.label}
            onClick={() => { setQuery(t.label); handleSearch(t.label); }}
            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 rounded-full border border-slate-200 hover:border-slate-400 transition"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}