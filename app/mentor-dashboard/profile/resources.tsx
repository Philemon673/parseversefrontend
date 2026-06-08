"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, Search, FileText, Video } from "lucide-react";
import { getInstructorCourses, deleteCourse } from "@/lib/courseService";

type ResourceType = "PDF" | "Video";

const typeColors: Record<ResourceType, { bg: string; text: string; dot: string; icon: any }> = {
  PDF:   { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500",    icon: FileText },
  Video: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500", icon: Video },
};

const ITEMS_PER_PAGE = 5;

export default function ResourcesTab() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ResourceType | "All">("All");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInstructorCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load courses for resources", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter courses
  const filtered = courses.filter((c) => {
    const titleMatch = c.title.toLowerCase().includes(search.toLowerCase());
    const displayType = c.type === "Hardcopy" ? "PDF" : "Video";
    const typeMatch = filterType === "All" || displayType === filterType;
    return titleMatch && typeMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setOpenMenu(null);
      alert("Course deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete course: " + err.message);
    }
  };

  const handlePreview = (c: any) => {
    const isHardcopy = c.type === "Hardcopy";
    const path = isHardcopy
      ? `/mentor-dashboard/courses/hardcopy?courseId=${c.id}&status=${c.status}`
      : `/mentor-dashboard/courses/coursedetails?courseId=${c.id}&status=${c.status}`;
    router.push(path);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-800">Study Materials &amp; Resources</h3>
        <p className="text-xs text-gray-400 mt-0.5">Manage the resources and courses you have created</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by course title…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value as ResourceType | "All"); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="All">All Types</option>
          <option value="PDF">PDF</option>
          <option value="Video">Video</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Title</th>
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Type</th>
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Uploaded On</th>
              <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <span>Loading resources…</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No resources found.</td>
              </tr>
            ) : paginated.map((c, i) => {
              const displayType: ResourceType = c.type === "Hardcopy" ? "PDF" : "Video";
              const style = typeColors[displayType];
              const IconComponent = style.icon;

              return (
                <tr
                  key={c.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/70 transition cursor-pointer ${i === paginated.length - 1 ? "border-b-0" : ""}`}
                >
                  {/* Clickable Course Title */}
                  <td
                    className="px-4 py-3 font-medium text-indigo-600 hover:text-indigo-800 transition"
                    onClick={() => handlePreview(c)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                      <span>{c.title}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3" onClick={() => handlePreview(c)}>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text}`}>
                      <IconComponent className="w-3 h-3" />
                      {displayType}
                    </span>
                  </td>

                  {/* Upload Date */}
                  <td className="px-4 py-3 text-gray-500" onClick={() => handlePreview(c)}>
                    {formatDate(c.createdAt)}
                  </td>

                  {/* Action Menu */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 relative" ref={openMenu === c.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
                        title="More"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {openMenu === c.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-32">
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} resources
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-6 h-6 rounded-lg text-xs font-medium transition ${p === currentPage ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >{p}</button>
          ))}
          <button
            className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >›</button>
        </div>
      </div>
    </div>
  );
}