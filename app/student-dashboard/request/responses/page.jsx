"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  ChevronLeft,
  MessageCircle,
  Star,
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";

function ResponsesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const role = searchParams.get("role") || "mentor";

  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available mentors and simulate responses for the UI
    const fetchResponders = async () => {
      try {
        const res = await api.get("/mentorship/mentors");
        const allMentors = Array.isArray(res) ? res : (res.data || []);
        
        // Filter by role so we only see Mentors or Tutors based on the request
        const filtered = allMentors.filter(m => m.role.toLowerCase() === role.toLowerCase());
        
        // Simulate that these users have responded to the request
        setResponders(filtered.length > 0 ? filtered : allMentors.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch responders", err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchResponders();
    } else {
      setLoading(false);
    }
  }, [requestId, role]);

  const handleMessage = (mentorId) => {
    // Navigate to messages/chat page with this user
    router.push(`/student-dashboard/messages?userId=${mentorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{role} Responses</h1>
            <p className="text-sm text-gray-500">
              Review the {role}s who have offered to help with your request.
            </p>
          </div>
        </div>

        {/* Responders List */}
        {responders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <User className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No responses yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Mentors are still reviewing your request. Please check back later or ensure your request details are clear.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {responders.map((responder, idx) => (
              <div key={responder.id || idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition hover:shadow-md">
                
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {responder.avatar ? (
                      <img src={responder.avatar} alt={responder.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-xl font-bold border-2 border-white shadow-sm">
                        {responder.firstName?.charAt(0) || "U"}
                      </div>
                    )}
                    {responder.isVip && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full border-2 border-white">
                        <Star size={10} className="fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {responder.firstName} {responder.lastName}
                      </h3>
                      {responder.role === "MENTOR" && (
                        <CheckCircle2 size={16} className="text-indigo-500" />
                      )}
                    </div>
                    
                    <p className="text-sm font-semibold text-indigo-600 mt-0.5 capitalize">
                      {responder.role?.toLowerCase() || role}
                    </p>
                    
                    {/* Field & Location */}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
                      {responder.field && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-600">
                          {responder.field}
                        </span>
                      )}
                      {(responder.city || responder.country) && (
                        <span>
                          📍 {responder.city}{responder.city && responder.country ? ", " : ""}{responder.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <button 
                    onClick={() => handleMessage(responder.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm w-full sm:w-auto"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                  <p className="text-[10px] text-gray-400 text-center sm:text-right font-medium">
                    Responded recently
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResponsesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <ResponsesContent />
    </Suspense>
  );
}
