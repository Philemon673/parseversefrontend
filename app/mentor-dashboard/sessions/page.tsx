"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

export default function MentorSessionsPage() {
  const router = useRouter();

  const upcomingSessions = [
    { 
      id: "react-19-deep-dive", 
      title: "Introduction to React 19 — Live Deep Dive", 
      time: "Starts in 10 mins", 
      students: 18, 
      duration: "60 mins",
      isLive: true 
    },
    { 
      id: "system-design-2", 
      title: "Advanced System Design Q&A", 
      time: "Tomorrow, 10:00 AM", 
      students: 45, 
      duration: "90 mins",
      isLive: false 
    },
  ];

  const handleStartSession = (id) => {
    router.push(`/mentor-dashboard/sessions/${id}`);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Live Sessions</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and start your live teaching sessions.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Schedule New Session
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Session List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Upcoming Sessions</h2>
          
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    session.isLive ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-100'
                  }`}>
                    <Video className={`w-6 h-6 ${session.isLive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    {session.isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 mb-2 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Live Now
                      </span>
                    )}
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {session.time}</span>
                       <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {session.students} Students Joined</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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
        <div className="flex flex-col gap-6">
           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Teaching Tips</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Keep your students engaged by using the "Hand Raise" feature and sharing your screen early.
                </p>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-60">Total Sessions</p>
                        <p className="text-sm font-black">124 Hours</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                      <Users className="w-5 h-5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-60">Avg. Attendance</p>
                        <p className="text-sm font-black">88% Capacity</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
           </div>

           <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Resources</h3>
              <div className="flex flex-col gap-3">
                 <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all flex items-center justify-between group">
                    Live Streaming Guide <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                 </button>
                 <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all flex items-center justify-between group">
                    Troubleshooting Mic/Cam <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                 </button>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
