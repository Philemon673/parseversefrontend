"use client";

import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  MonitorUp, MessageSquare, Users, 
  Hand, MoreVertical, PhoneOff,
  Settings, Grid, Maximize, Layout
} from 'lucide-react';

export default function MeetingRoom({ sessionId, onLeave }) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showSidebar, setShowSidebar] = useState(null); // 'participants' | 'chat' | null

  // Mock participants for UI demonstration
  const participants = [
    { id: 'me', name: 'Rajib Kumar (You)', avatar: 'RK', isMe: true, videoOn: true },
    { id: 2, name: 'Sarah Chen', avatar: 'SC', videoOn: true },
    { id: 3, name: 'John Smiga (Instructor)', avatar: 'JS', videoOn: true, isHost: true },
    { id: 4, name: 'Marissa Ray', avatar: 'MR', videoOn: false },
    { id: 5, name: 'Sebastian Kim', avatar: 'SK', videoOn: true },
    { id: 6, name: 'Donald Williams', avatar: 'DW', videoOn: false },
  ];

  return (
    <div className="h-screen w-full bg-[#0a0a0f] flex flex-col overflow-hidden font-sans">
      
      {/* Top Header / Info */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-4">
         <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">Live</span>
            <div className="w-px h-3 bg-white/20 mx-1" />
            <span className="text-white/80 text-xs font-bold">12:45</span>
         </div>
         <h1 className="text-white/60 text-xs font-bold uppercase tracking-widest">Session ID: {sessionId}</h1>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Video Grid */}
        <div className={`flex-1 p-6 grid gap-4 transition-all duration-500 ${
          participants.length <= 1 ? 'grid-cols-1' :
          participants.length <= 2 ? 'grid-cols-2' :
          participants.length <= 4 ? 'grid-cols-2' :
          'grid-cols-3'
        }`}>
          {participants.map((p) => (
            <VideoTile key={p.id} participant={p} isSmall={participants.length > 4} />
          ))}
        </div>

        {/* Sidebar (Chat / Participants) */}
        {showSidebar && (
          <div className="w-80 bg-white m-6 ml-0 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                {showSidebar === 'chat' ? 'In-Call Messages' : 'Participants'}
              </h2>
              <button onClick={() => setShowSidebar(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
               {showSidebar === 'chat' ? (
                 <div className="flex flex-col gap-4">
                   <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                     <p className="text-[10px] font-bold text-indigo-600 mb-1">Rajib Kumar • 12:40</p>
                     <p className="text-xs text-slate-700">Hey everyone! Is the resource link working for you?</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-500 mb-1">John Smiga • 12:41</p>
                     <p className="text-xs text-slate-700">Yes Rajib, I just updated it. Check the course resources tab.</p>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col gap-2">
                    {participants.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {p.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-700 flex-1">{p.name}</span>
                        {p.isHost && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">Host</span>}
                      </div>
                    ))}
                 </div>
               )}
            </div>
            {showSidebar === 'chat' && (
              <div className="p-4 border-t border-slate-100">
                <input 
                  type="text" 
                  placeholder="Send a message..." 
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-24 px-8 flex items-center justify-between z-30">
        
        {/* Meeting Details (Left) */}
        <div className="hidden md:flex flex-col">
           <h2 className="text-white text-sm font-black tracking-tight">Web Development Masterclass</h2>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">In Session · 01:24:05</p>
        </div>

        {/* Action Buttons (Center) */}
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setMicOn(!micOn)}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
               micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-900/20'
             }`}
           >
             {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
           </button>
           <button 
             onClick={() => setVideoOn(!videoOn)}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
               videoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-900/20'
             }`}
           >
             {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
           </button>
           <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
             <Hand className="w-5 h-5" />
           </button>
           <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
             <MonitorUp className="w-5 h-5" />
           </button>
           <button 
             onClick={onLeave}
             className="px-6 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
           >
             <PhoneOff className="w-5 h-5" />
             <span className="text-sm font-black">Leave Call</span>
           </button>
        </div>

        {/* Side Controls (Right) */}
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowSidebar(showSidebar === 'participants' ? null : 'participants')}
             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
               showSidebar === 'participants' ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
             }`}
           >
             <Users className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setShowSidebar(showSidebar === 'chat' ? null : 'chat')}
             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
               showSidebar === 'chat' ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
             }`}
           >
             <MessageSquare className="w-4 h-4" />
           </button>
           <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
             <MoreVertical className="w-4 h-4" />
           </button>
        </div>

      </div>

    </div>
  );
}

function VideoTile({ participant, isSmall }) {
  return (
    <div className={`relative bg-slate-800/50 rounded-3xl overflow-hidden group border-2 ${
      participant.isHost ? 'border-indigo-500/50' : 'border-transparent'
    }`}>
      {participant.videoOn ? (
        <img 
          src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&u=${participant.id}`} 
          alt="video" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
           <div className={`rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black ${
             isSmall ? 'w-16 h-16 text-xl' : 'w-24 h-24 text-3xl'
           }`}>
             {participant.avatar}
           </div>
        </div>
      )}

      {/* Name Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
          <span className="text-white text-[11px] font-bold">{participant.name}</span>
          {participant.isHost && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
        </div>
        {!participant.videoOn && (
           <div className="bg-red-500/80 backdrop-blur-sm p-1.5 rounded-lg">
              <MicOff className="w-3 h-3 text-white" />
           </div>
        )}
      </div>

      {/* Host Badge */}
      {participant.isHost && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
          Instructor
        </div>
      )}
    </div>
  );
}
