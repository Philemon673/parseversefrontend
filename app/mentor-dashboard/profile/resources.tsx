"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, MoreVertical, Plus, X, Check, Trash2, Edit2, Search } from "lucide-react";

type ResourceType = "PDF" | "Document" | "Presentation" | "Video" | "ZIP";

interface Resource {
  id: number;
  title: string;
  type: ResourceType;
  subject: string;
  uploadedOn: string;
}

const typeColors: Record<ResourceType, { bg: string; text: string; dot: string }> = {
  PDF:          { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500" },
  Document:     { bg: "bg-blue-50",   text: "text-blue-600",   dot: "bg-blue-500" },
  Presentation: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  Video:        { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
  ZIP:          { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
};

const ALL_TYPES: ResourceType[] = ["PDF", "Document", "Presentation", "Video", "ZIP"];
const ALL_SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Biology", "Chemistry"];
const ITEMS_PER_PAGE = 5;

const initialResources: Resource[] = [
  { id: 1, title: "Calculus – Derivatives Notes",      type: "PDF",          subject: "Mathematics",      uploadedOn: "12 May 2024" },
  { id: 2, title: "Physics Formulas Sheet",             type: "Document",     subject: "Physics",          uploadedOn: "10 May 2024" },
  { id: 3, title: "Introduction to Algorithms",         type: "Presentation", subject: "Computer Science", uploadedOn: "08 May 2024" },
  { id: 4, title: "Limits and Continuity Explained",    type: "Video",        subject: "Mathematics",      uploadedOn: "05 May 2024" },
  { id: 5, title: "Practice Problems Set 1",            type: "ZIP",          subject: "Mathematics",      uploadedOn: "01 May 2024" },
  { id: 6, title: "Newton's Laws of Motion",            type: "PDF",          subject: "Physics",          uploadedOn: "28 Apr 2024" },
  { id: 7, title: "Data Structures Overview",           type: "Presentation", subject: "Computer Science", uploadedOn: "25 Apr 2024" },
  { id: 8, title: "Trigonometry Revision",              type: "Document",     subject: "Mathematics",      uploadedOn: "20 Apr 2024" },
  { id: 9, title: "Organic Chemistry Basics",           type: "PDF",          subject: "Chemistry",        uploadedOn: "15 Apr 2024" },
  { id: 10, title: "Binary Search Tutorial",            type: "Video",        subject: "Computer Science", uploadedOn: "10 Apr 2024" },
  { id: 11, title: "Cell Biology Notes",                type: "Document",     subject: "Biology",          uploadedOn: "05 Apr 2024" },
  { id: 12, title: "Algebra Exercises Pack",            type: "ZIP",          subject: "Mathematics",      uploadedOn: "01 Apr 2024" },
];

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function ResourceModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Resource;
  onSave: (r: Omit<Resource, "id">) => void;
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<ResourceType>(initial?.type ?? "PDF");
  const [subject, setSubject] = useState(initial?.subject ?? ALL_SUBJECTS[0]);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) { setError("Title is required"); return; }
    onSave({ title: title.trim(), type, subject, uploadedOn: initial?.uploadedOn ?? today });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">{initial ? "Edit Resource" : "Add New Resource"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Calculus Notes"
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as ResourceType)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {ALL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {ALL_SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
            <Check className="w-3.5 h-3.5" />{initial ? "Update" : "Add Resource"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── View Modal ─────────────────────────────────────────────────────────── */
function ViewModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const style = typeColors[resource.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[380px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Resource Details</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className={`rounded-xl p-4 ${style.bg} flex items-center gap-3`}>
          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${style.dot}`} />
          <span className={`font-semibold text-sm ${style.text}`}>{resource.title}</span>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          {[
            ["Type", resource.type],
            ["Subject", resource.subject],
            ["Uploaded On", resource.uploadedOn],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">{k}</span>
              <span className="text-gray-700 font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">Close</button>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [viewTarget, setViewTarget] = useState<Resource | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ResourceType | "All">("All");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const nextId = useRef(initialResources.length + 1);

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || r.type === filterType;
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const addResource = (r: Omit<Resource, "id">) => {
    setResources((prev) => [{ id: nextId.current++, ...r }, ...prev]);
    setShowAddModal(false);
    setPage(1);
  };

  const updateResource = (r: Omit<Resource, "id">) => {
    setResources((prev) => prev.map((x) => (x.id === editTarget!.id ? { id: editTarget!.id, ...r } : x)));
    setEditTarget(null);
  };

  const deleteResource = (id: number) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setOpenMenu(null);
  };

  return (
    <>
      {showAddModal && <ResourceModal onSave={addResource} onClose={() => setShowAddModal(false)} />}
      {editTarget && <ResourceModal initial={editTarget} onSave={updateResource} onClose={() => setEditTarget(null)} />}
      {viewTarget && <ViewModal resource={viewTarget} onClose={() => setViewTarget(null)} />}

      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Study Materials &amp; Resources</h3>
            <p className="text-xs text-gray-400 mt-0.5">Upload and manage resources for your students</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Resource
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title or subject…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value as ResourceType | "All"); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="All">All Types</option>
            {ALL_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Title</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Type</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Subject</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Uploaded On</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No resources found.</td>
                </tr>
              ) : paginated.map((r, i) => {
                const style = typeColors[r.type];
                return (
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${i === paginated.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                        <span className="font-medium text-gray-700">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text}`}>{r.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.subject}</td>
                    <td className="px-4 py-3 text-gray-500">{r.uploadedOn}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 relative" ref={openMenu === r.id ? menuRef : undefined}>
                        <button
                          onClick={() => setViewTarget(r)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditTarget(r)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-400 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
                          title="More"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {openMenu === r.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-32">
                            <button
                              onClick={() => deleteResource(r.id)}
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
    </>
  );
}