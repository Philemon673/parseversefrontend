"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Settings, 
  MoreVertical,
  Monitor,
  ShieldCheck
} from 'lucide-react';

export default function PreJoin({ onJoin, sessionTitle = "Web Development Masterclass" }) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupPreview() {
      if (videoOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing media devices:", err);
          setVideoOn(false);
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    }
    setupPreview();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [videoOn]);

  return (
    <div className="min-h-screen bg-[#f2f3fa] flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Video Preview Area */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            {videoOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white text-3xl font-bold">
                  RK
                </div>
                <p className="text-slate-400 text-sm font-medium">Camera is off</p>
              </div>
            )}

            {/* Floating Name Badge */}
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <p className="text-white text-xs font-bold">Rajib Kumar (You)</p>
            </div>

            {/* Media Toggles */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button 
                onClick={() => setMicOn(!micOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  micOn ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white' : 'bg-red-500 text-white shadow-lg'
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setVideoOn(!videoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  videoOn ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white' : 'bg-red-500 text-white shadow-lg'
                }`}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
               <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition">
                  <Settings className="w-4 h-4" />
               </button>
               <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition">
                  <MoreVertical className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Device Status Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${videoOn && micOn ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-xs font-bold text-slate-600">
                   {videoOn && micOn ? 'Devices ready' : 'Check your settings'}
                </span>
             </div>
             <div className="flex items-center gap-4">
                <button className="text-indigo-600 text-xs font-bold hover:underline">Check audio & video</button>
             </div>
          </div>
        </div>

        {/* Right: Join Content */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                  Live Session
               </span>
               <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Encrypted
               </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">
              {sessionTitle}
            </h1>
            <p className="text-slate-500 font-medium">Instructor: <span className="text-slate-900 font-bold">John Smiga</span></p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800">Ready to join?</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onJoin}
                className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Join Now
              </button>
              <button className="px-10 py-4 rounded-2xl bg-white text-indigo-600 font-black text-sm border border-indigo-100 hover:bg-indigo-50 transition-all">
                Present
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200">
             <p className="text-xs text-slate-400 font-medium mb-4">Other participants in the call:</p>
             <div className="flex items-center -space-x-3">
                {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                   </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center justify-center">
                   +12
                </div>
                <p className="ml-6 text-xs text-slate-500 font-semibold italic">Sarah and 15 others are here</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
