"use client";

import { Eye, Plus, Trash2, Edit2, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

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
const ITEMS_PER_PAGE = 5;

const initialResources: Resource[] = [
  { id: 1,  title: "Calculus – Derivatives Notes",   type: "PDF",          subject: "Mathematics",      uploadedOn: "12 May 2024" },
  { id: 2,  title: "Physics Formulas Sheet",          type: "Document",     subject: "Physics",          uploadedOn: "10 May 2024" },
  { id: 3,  title: "Introduction to Algorithms",      type: "Presentation", subject: "Computer Science", uploadedOn: "08 May 2024" },
  { id: 4,  title: "Limits and Continuity Explained", type: "Video",        subject: "Mathematics",      uploadedOn: "05 May 2024" },
  { id: 5,  title: "Practice Problems Set 1",         type: "ZIP",          subject: "Mathematics",      uploadedOn: "01 May 2024" },
  { id: 6,  title: "Newton's Laws of Motion",         type: "PDF",          subject: "Physics",          uploadedOn: "28 Apr 2024" },
  { id: 7,  title: "Data Structures Overview",        type: "Presentation", subject: "Computer Science", uploadedOn: "25 Apr 2024" },
  { id: 8,  title: "Trigonometry Revision",           type: "Document",     subject: "Mathematics",      uploadedOn: "20 Apr 2024" },
  { id: 9,  title: "Organic Chemistry Basics",        type: "PDF",          subject: "Chemistry",        uploadedOn: "15 Apr 2024" },
  { id: 10, title: "Binary Search Tutorial",          type: "Video",        subject: "Computer Science", uploadedOn: "10 Apr 2024" },
  { id: 11, title: "Cell Biology Notes",              type: "Document",     subject: "Biology",          uploadedOn: "05 Apr 2024" },
  { id: 12, title: "Algebra Exercises Pack",          type: "ZIP",          subject: "Mathematics",      uploadedOn: "01 Apr 2024" },
];

const paginated = initialResources.slice(0, ITEMS_PER_PAGE);
const totalPages = Math.ceil(initialResources.length / ITEMS_PER_PAGE);

export default function ResourcesTab() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Study Materials &amp; Resources</h3>
          <p className="text-xs text-gray-400 mt-0.5">Upload and manage resources for your students</p>
        </div>
        <button onClick={() => router.push("/mentor-dashboard/courses")}
         className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm cursor-default opacity-80">
          <Plus className="w-3.5 h-3.5" /> Add New Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            readOnly
            placeholder="Search by title or subject…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white cursor-default"
          />
        </div>
        <select
          disabled
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-gray-500 cursor-default"
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
            {paginated.map((r, i) => {
              const style = typeColors[r.type];
              return (
                <tr
                  key={r.id}
                  className={`border-b border-gray-50 ${i === paginated.length - 1 ? "border-b-0" : ""}`}
                >
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
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg text-gray-400 cursor-default" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-indigo-400 cursor-default" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-red-400 cursor-default" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        <span>Showing 1–{ITEMS_PER_PAGE} of {initialResources.length} resources</span>
        <div className="flex items-center gap-1">
          <button disabled className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center opacity-40 cursor-default">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              disabled
              className={`w-6 h-6 rounded-lg text-xs font-medium cursor-default ${
                p === 1 ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500"
              }`}
            >{p}</button>
          ))}
          <button disabled className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center opacity-40 cursor-default">›</button>
        </div>
      </div>
    </div>
  );
}