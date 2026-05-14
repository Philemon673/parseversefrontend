"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  User
} from 'lucide-react';

export default function StudentSessionsPage() {
  const router = useRouter();

  const invitedSessions = [
    { 
      id: "react-19-deep-dive", 
      title: "Introduction to React 19 — Live Deep Dive", 
      mentor: "John Smiga",
      time: "Starts in 10 mins", 
      participants: 18, 
      duration: "60 mins",
      isLive: true,
      isFree: true
    },
    { 
      id: "system-design-2", 
      title: "Advanced System Design Q&A", 
      mentor: "Sarah Chen",
      time: "Tomorrow, 10:00 AM", 
      participants: 45, 
      duration: "90 mins",
      isLive: false,
      isSubscribed: true
    },
  ];

  const discoverSessions = [
    {
      id: "python-ml-live",
      title: "Python for Machine Learning — Live Coding",
      mentor: "Dr. Angela Yu",
      time: "Live Now",
      participants: 124,
      duration: "120 mins",
      isLive: true,
      isFree: false,
      isSubscribed: false
    },
    {
      id: "ux-design-workshop",
      title: "Modern UX Design Principles",
      mentor: "Gary Simon",
      time: "Starting soon",
      participants: 89,
      duration: "45 mins",
      isLive: true,
      isFree: true,
      isSubscribed: false
    }
  ];

  const handleJoinSession = (session) => {
    if (session.isFree || session.isSubscribed) {
      router.push(`/student-dashboard/sessions/${session.id}`);
    } else {
      alert("This is a premium session. Please subscribe to join.");
    }
  };

  const SessionCard = ({ session, showLock = false }) => {
    const hasAccess = session.isFree || session.isSubscribed;
    
    return (
      <div key={session.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-indigo-200 transition-all group overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              session.isLive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400'
            }`}>
              <Video className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {session.isLive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest">
                    <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> Live
                  </span>
                )}
                {session.isFree ? (
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free Access</span>
                ) : (
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                     session.isSubscribed ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                   }`}>
                     {session.isSubscribed ? 'Subscribed' : 'Premium'}
                   </span>
                )}
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors truncate">
                {session.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                  <User className="w-3 h-3 text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-slate-500">{session.mentor}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[11px] font-bold text-slate-400">
                 <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-300" /> {session.time}</span>
                 <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-300" /> {session.participants}</span>
                 <span className="flex items-center gap-1.5 text-indigo-500"><Clock className="w-3.5 h-3.5" /> {session.duration}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleJoinSession(session)}
            className={`px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shrink-0 ${
              session.isLive 
                ? hasAccess 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1'
                  : 'bg-slate-900 text-white shadow-lg hover:bg-black' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            disabled={!session.isLive && !hasAccess}
          >
            {session.isLive ? hasAccess ? 'Join Room' : 'Get Access' : 'Awaiting Start'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {session.isLive && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 flex flex-col gap-10 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Live Learning</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm lg:text-base">Join interactive sessions and learn in real-time from industry experts.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left: Session List */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* Invited Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Upcoming Invitations</h2>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{invitedSessions.length} Invitations</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {invitedSessions.map(session => <SessionCard session={session} />)}
            </div>
          </div>

          {/* Discover Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Discover Live Now</h2>
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">Trending</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {discoverSessions.map(session => <SessionCard session={session} />)}
            </div>
          </div>
        </div>

        {/* Right: Premium Info Panel */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-10">
           <div className="relative group rounded-[2.5rem] overflow-hidden p-8 min-h-[380px] flex flex-col justify-between shadow-2xl shadow-indigo-200/50">
              <div className="absolute inset-0 bg-[#4F46E5]" />
              <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#7C3AED] rounded-full blur-[80px] opacity-70 animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#C026D3] rounded-full blur-[100px] opacity-60" />
              <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Learning Hub</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">
                  Boost your knowledge by engaging with mentors and peers in our <span className="text-white font-bold">interactive sessions</span>.
                </p>
                
                <div className="flex flex-col gap-3 mt-auto">
                   <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                         <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Attendance</p>
                      </div>
                      <p className="text-sm font-black text-white">94%</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-indigo-300" />
                         <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Certificates</p>
                      </div>
                      <p className="text-sm font-black text-white">12</p>
                   </div>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Student Resources</h3>
              <div className="flex flex-col gap-4">
                 <button className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[13px] font-bold transition-all flex items-center justify-between group">
                    Joining Tutorial <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all" />
                 </button>
                 <button className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[13px] font-bold transition-all flex items-center justify-between group">
                    Community Rules <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all" />
                 </button>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
