"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  Copy
} from 'lucide-react';
import CreateSessionModal from '@/component/sessions/CreateSessionModal';

export default function MentorSessionsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessions, setSessions] = useState([
    { 
      id: "react-19-deep-dive", 
      title: "Introduction to React 19 — Live Deep Dive", 
      time: "Starts in 10 mins", 
      students: 18, 
      duration: "60 mins",
      isLive: true,
      link: typeof window !== 'undefined' ? `${window.location.origin}/student-dashboard/sessions/react-19-deep-dive` : ''
    },
    { 
      id: "system-design-2", 
      title: "Advanced System Design Q&A", 
      time: "Tomorrow, 10:00 AM", 
      students: 45, 
      duration: "90 mins",
      isLive: false,
      link: typeof window !== 'undefined' ? `${window.location.origin}/student-dashboard/sessions/system-design-2` : ''
    },
  ]);

  const upcomingSessions = sessions;

  const handleCreateSession = (sessionData) => {
    const newSession = {
      id: sessionData.sessionId,
      title: sessionData.title,
      time: sessionData.isInstant ? "Starting now" : sessionData.scheduledTime,
      students: 0,
      duration: `${sessionData.duration} mins`,
      isLive: sessionData.isInstant,
      link: sessionData.link
    };
    setSessions([newSession, ...sessions]);
  };

  const copySessionLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const handleStartSession = (id) => {
    router.push(`/mentor-dashboard/sessions/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 flex flex-col gap-10 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Live Sessions</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm lg:text-base">Manage and broadcast your expertise to global students.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-indigo-600 text-white font-black text-sm shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> Create New Session
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Session List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest px-2">Upcoming Sessions</h2>
          
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className={`w-14 h-14 shrink-0 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ${
                    session.isLive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    {session.isLive && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-widest">
                          <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> Live
                        </span>
                      </div>
                    )}
                    <h3 className="text-[17px] font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors truncate">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-[11px] font-bold text-slate-400">
                       <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-300" /> {session.time}</span>
                       <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-300" /> {session.students} Students</span>
                       <span className="flex items-center gap-1.5 text-indigo-500"><Clock className="w-3.5 h-3.5" /> {session.duration}</span>
                    </div>
                  </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => copySessionLink(session.link)}
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    title="Copy invitation link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleStartSession(session.id)}
                    className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                      session.isLive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {session.isLive ? 'Start Teaching' : 'View Details'} <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Quick Stats & Tips */}
         <div className="flex flex-col gap-6 lg:sticky lg:top-10">
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <Video className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black mb-3 tracking-tight">Teaching Analytics</h3>
                 <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">
                   You have reached <span className="text-white font-bold">12,000+</span> minutes of live teaching this month. Keep it up!
                 </p>
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 group-hover:bg-black/20 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Active Hours</p>
                       </div>
                       <p className="text-sm font-black">124.5h</p>
                    </div>
                    <div className="flex items-center justify-between bg-black/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 group-hover:bg-black/20 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-300" />
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Students</p>
                       </div>
                       <p className="text-sm font-black">1.2k</p>
                    </div>
                 </div>
               </div>
               {/* Decorative elements */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Quick Resources</h3>
               <div className="flex flex-col gap-4">
                  <button className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[13px] font-bold transition-all flex items-center justify-between group">
                     Streamer Guide 2024 <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all" />
                  </button>
                  <button className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[13px] font-bold transition-all flex items-center justify-between group">
                     Optimization Tips <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all" />
                  </button>
               </div>
            </div>
        </div>

      </div>

      {/* Create Session Modal */}
      <CreateSessionModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSession={handleCreateSession}
      />

    </div>
  );
}
