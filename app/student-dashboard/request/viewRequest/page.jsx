"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  CalendarDays,
  Paperclip,
  MessageCircle,
  Trash2,
  MoreVertical,
  Code2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Info Row ────────────────────────────────────────────────────────────────
function InfoRow({ label, value, valueClass = "" }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className={`text-sm text-gray-800 ${valueClass}`}>{value || "—"}</p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RequestDetailsPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/mentorship/my-requests");
        // The api wrapper returns the JSON directly. If it's an array, use it.
        const data = Array.isArray(res) ? res : (res.data || []);
        setRequests(data);
      } catch (err) {
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-red-500 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl">{error}</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
        <Code2 className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-medium">You have not submitted any requests yet.</p>
      </div>
    );
  }

  const req = requests[currentIndex];
  
  const formattedDate = req.sessionDate
    ? new Date(req.sessionDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date selected";

  const requestedOn = req.createdAt
    ? new Date(req.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, requests.length - 1));
  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await api.delete(`/mentorship/${req.id}/cancel`);
      // Update local state
      setRequests(requests.map(r => r.id === req.id ? { ...r, status: "CANCELLED" } : r));
    } catch (err) {
      alert("Failed to cancel request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-4">
      {/* Pagination controls if multiple requests */}
      {requests.length > 1 && (
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold text-gray-700">
            Request {currentIndex + 1} of {requests.length}
          </span>
          <button onClick={handleNext} disabled={currentIndex === requests.length - 1} className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Request Details</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">
              ID: {req.id.substring(0, 8)}
            </span>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1">
                  {req.status === "PENDING" && (
                    <button onClick={handleCancel} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      Cancel Request
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Subject row ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Code2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 capitalize">{req.role} Request</p>
              <p className="text-xs text-gray-400 mt-0.5">{req.field}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full capitalize">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${req.status === "PENDING" ? "bg-amber-500" : req.status === "ACCEPTED" ? "bg-indigo-500" : req.status === "COMPLETED" ? "bg-green-500" : "bg-red-500"}`} />
            {req.status.toLowerCase().replace('_', ' ')}
          </span>
        </div>

        {/* ── Two-col body ── */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">

          {/* LEFT */}
          <div className="px-6 py-5 space-y-5">
            <InfoRow label="Topic" value={req.topic} />
            <InfoRow label="Level" value={req.level} />
            <InfoRow label="Session Type" value={req.sessionType} />
            <InfoRow label="Duration" value={req.duration} />
            <InfoRow label="Requested On" value={requestedOn} />
            {req.notes && (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-500">Additional Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {req.notes}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="px-6 py-5 space-y-5">

            {/* Preferred Schedule */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">Preferred Schedule</p>
              <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-4 py-2.5">
                <CalendarDays size={15} className="text-indigo-400" />
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
            </div>

            {/* Suggested Price */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500">Suggested Price</p>
              <p className="text-lg font-bold text-gray-900">{req.suggestedPrice ? `FCFA ${req.suggestedPrice} /hr` : "Default Rate"}</p>
              <p className="text-xs text-gray-400">Mentor can suggest a different rate</p>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">Attachments</p>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Paperclip size={14} className="text-indigo-400" />
                  <span className="font-medium text-gray-400 italic">No attachments</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">Status</p>
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 capitalize">
                  <span className={`w-2 h-2 rounded-full inline-block ${req.status === "PENDING" ? "bg-amber-500" : req.status === "ACCEPTED" ? "bg-indigo-500" : req.status === "COMPLETED" ? "bg-green-500" : "bg-red-500"}`} />
                  {req.status.toLowerCase()}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {req.status === "PENDING" ? "Your request is being reviewed. You will be notified once a mentor is assigned." : 
                   req.status === "ACCEPTED" ? "Your request has been accepted by a mentor!" :
                   req.status === "CANCELLED" ? "This request was cancelled." : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {req.status === "PENDING" && (
              <button onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition">
                <Trash2 size={14} />
                Cancel
              </button>
            )}
          </div>
          <button 
            onClick={() => router.push(`/student-dashboard/request/responses?requestId=${req.id}&role=${req.role}`)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm"
          >
            <MessageCircle size={14} />
            Responses
          </button>
        </div>
      </div>
    </div>
  );
}