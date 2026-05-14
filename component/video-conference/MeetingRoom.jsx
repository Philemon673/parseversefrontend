"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Mic, MicOff, Video, VideoOff, 
  MonitorUp, MessageSquare, Users, 
  Hand, MoreVertical, PhoneOff,
  Settings, Grid, Maximize, Layout,
  Send, Smile, MonitorStop, ShieldCheck
} from 'lucide-react';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const AVATAR_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-orange-500 to-amber-600',
  'from-red-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-teal-500 to-green-600',
  'from-yellow-500 to-orange-600',
  'from-fuchsia-500 to-pink-600',
];

export default function MeetingRoom({ sessionId, onLeave }) {
  const isMeHost = true; // In mentor dashboard, 'me' is always host
  const [micOn, setMicOn] = useState(isMeHost);
  const [videoOn, setVideoOn] = useState(isMeHost);
  const [showSidebar, setShowSidebar] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Rajib Kumar', time: '12:40', text: 'Hey everyone! Is the resource link working for you?', isMe: true },
    { id: 2, sender: 'John Smiga', time: '12:41', text: 'Yes Rajib, I just updated it. Check the course resources tab.', isMe: false },
  ]);
  const [reactions, setReactions] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'spotlight' | 'sidebar'
  const [pinnedId, setPinnedId] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMutedAlert, setShowMutedAlert] = useState(false);
  const [availableDevices, setAvailableDevices] = useState({ video: [], audio: [] });

  const chatEndRef = useRef(null);
  const videoGridRef = useRef(null);
  const localVideoRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const [participants, setParticipants] = useState([
    { id: 'me', name: 'Rajib Kumar (You)', avatar: 'RK', isMe: true, isHost: true, videoOn: true, micOn: true, handRaised: false, colorIndex: 0 },
    { id: 2, name: 'Sarah Chen', avatar: 'SC', videoOn: false, micOn: false, handRaised: false, isHost: false, colorIndex: 1 },
    { id: 3, name: 'John Smiga (Instructor)', avatar: 'JS', videoOn: false, micOn: false, handRaised: false, isHost: false, colorIndex: 2 },
    { id: 4, name: 'Marissa Ray', avatar: 'MR', videoOn: false, micOn: false, handRaised: true, colorIndex: 3 },
    { id: 5, name: 'Sebastian Kim', avatar: 'SK', videoOn: false, micOn: false, handRaised: false, colorIndex: 4 },
    { id: 6, name: 'Donald Williams', avatar: 'DW', videoOn: false, micOn: false, handRaised: false, colorIndex: 5 },
    { id: 7, name: 'Emily Johnson', avatar: 'EJ', videoOn: false, micOn: false, handRaised: false, colorIndex: 6 },
    { id: 8, name: 'Michael Brown', avatar: 'MB', videoOn: false, micOn: false, handRaised: false, colorIndex: 7 },
    { id: 9, name: 'Jessica Martinez', avatar: 'JM', videoOn: false, micOn: false, handRaised: false, colorIndex: 8 },
    { id: 10, name: 'David Lee', avatar: 'DL', videoOn: false, micOn: false, handRaised: true, colorIndex: 9 },
    { id: 11, name: 'Amanda Garcia', avatar: 'AG', videoOn: false, micOn: false, handRaised: false, colorIndex: 0 },
    { id: 12, name: 'Christopher Davis', avatar: 'CD', videoOn: false, micOn: false, handRaised: false, colorIndex: 1 },
    { id: 13, name: 'Lisa Anderson', avatar: 'LA', videoOn: false, micOn: false, handRaised: false, colorIndex: 2 },
    { id: 14, name: 'Robert Taylor', avatar: 'RT', videoOn: false, micOn: false, handRaised: false, colorIndex: 3 },
    { id: 15, name: 'Jennifer Wilson', avatar: 'JW', videoOn: false, micOn: false, handRaised: false, colorIndex: 4 },
    { id: 16, name: 'Daniel Moore', avatar: 'DM', videoOn: false, micOn: false, handRaised: false, colorIndex: 5 },
    { id: 17, name: 'Michelle Thomas', avatar: 'MT', videoOn: false, micOn: false, handRaised: true, colorIndex: 6 },
    { id: 18, name: 'James Jackson', avatar: 'JJ', videoOn: false, micOn: false, handRaised: false, colorIndex: 7 },
    { id: 19, name: 'Patricia White', avatar: 'PW', videoOn: false, micOn: false, handRaised: false, colorIndex: 8 },
    { id: 20, name: 'Kevin Harris', avatar: 'KH', videoOn: false, micOn: false, handRaised: false, colorIndex: 9 },
  ]);

  useEffect(() => {
    if (showSidebar === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showSidebar]);

  // Initialize media devices on mount
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        // Apply initial mute/camera state
        stream.getAudioTracks().forEach(track => track.enabled = micOn);
        stream.getVideoTracks().forEach(track => track.enabled = videoOn);

        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please grant permissions.');
      }
    };

    initializeMedia();

    // Get list of devices
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAvailableDevices({
          video: devices.filter(d => d.kind === 'videoinput'),
          audio: devices.filter(d => d.kind === 'audioinput')
        });
      } catch (err) {
        console.error('Error listing devices:', err);
      }
    };
    getDevices();

    // Cleanup on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  // Auto-hide controls logic
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = setTimeout(() => {
        if (!showSidebar && !showEmojiPicker && !showSettingsModal) {
          setShowControls(false);
        }
      }, 5000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showSidebar, showEmojiPicker, showSettingsModal]);

  // Muted talking detection placeholder logic
  useEffect(() => {
    if (!micOn && localStream) {
      // In a real app, you'd use AudioContext to monitor levels
      // For now, we'll simulate a check when user is talking
    }
  }, [micOn, localStream]);

  // Update video stream when localStream or visibility changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, videoOn, layoutMode, pinnedId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'Rajib Kumar',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: chatMessage,
      isMe: true
    };
    
    setMessages([...messages, newMessage]);
    setChatMessage('');
  };

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        // Replace video track with screen share track
        if (localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = localStream.getVideoTracks()[0];
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          
          // When user stops sharing via browser UI
          videoTrack.onended = () => {
            setIsScreenSharing(false);
            if (localVideoRef.current && localStream) {
              localVideoRef.current.srcObject = localStream;
            }
          };
        }
        
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing failed:', err);
      }
    } else {
      // Stop screen sharing and return to camera
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      setIsScreenSharing(false);
    }
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    setParticipants(prev => prev.map(p => 
      p.isMe ? { ...p, handRaised: !handRaised } : p
    ));
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
      }
    }
    setMicOn(!micOn);
    setParticipants(prev => prev.map(p => 
      p.isMe ? { ...p, micOn: !micOn } : p
    ));
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoOn;
      }
    }
    setVideoOn(!videoOn);
    setParticipants(prev => prev.map(p => 
      p.isMe ? { ...p, videoOn: !videoOn } : p
    ));
  };

  const sendReaction = (emojiObject) => {
    const reactionId = Date.now();
    const newReaction = {
      id: reactionId,
      emoji: emojiObject.emoji,
      user: 'Rajib Kumar',
      x: Math.random() * 80 + 10,
    };
    
    setReactions([...reactions, newReaction]);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 3000);
  };

  const togglePin = (id) => {
    if (pinnedId === id) {
      setPinnedId(null);
      setLayoutMode('grid');
    } else {
      setPinnedId(id);
      setLayoutMode('spotlight');
    }
  };

  const pinnedParticipant = participants.find(p => p.id === pinnedId);
  const otherParticipants = participants.filter(p => p.id !== pinnedId);

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
        
        {/* Video Grid / Layout Container */}
        <div 
          ref={videoGridRef}
          className={`flex-1 p-4 overflow-y-auto transition-all duration-500 flex flex-col custom-scrollbar`}
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {layoutMode === 'spotlight' && pinnedParticipant ? (
            <div className="w-full h-full max-w-6xl flex gap-4">
              <div className="flex-[3] h-full relative">
                 <VideoTile 
                   participant={pinnedParticipant} 
                   isSpotlight={true}
                   videoRef={pinnedParticipant.isMe ? localVideoRef : null}
                   onPin={() => togglePin(pinnedParticipant.id)}
                   isPinned={true}
                 />
              </div>
              {participants.length > 1 && (
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-full">
                  {otherParticipants.map(p => (
                    <div key={p.id} className="w-full shrink-0">
                      <VideoTile 
                        participant={p} 
                        isSmall={true}
                        videoRef={p.isMe ? localVideoRef : null}
                        onPin={() => togglePin(p.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full transition-all duration-500 grid gap-6 ${
              participants.length === 1 ? 'grid-cols-1 max-w-5xl mx-auto' :
              participants.length === 2 ? 'grid-cols-2 max-w-6xl mx-auto' :
              participants.length <= 4 ? 'grid-cols-2 max-w-6xl mx-auto' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {participants.map((p) => (
                <VideoTile 
                  key={p.id} 
                  participant={p} 
                  isSmall={participants.length > 6}
                  videoRef={p.isMe ? localVideoRef : null}
                  onPin={() => togglePin(p.id)}
                  isPinned={pinnedId === p.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar (Chat / Participants) */}
        {showSidebar && (
          <div className="w-[360px] bg-white m-4 ml-0 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-500 border border-white/10">
            {/* Sidebar Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                {showSidebar === 'chat' ? (
                  <>
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    In-Call Messages
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-indigo-600" />
                    People
                  </>
                )}
              </h2>
              <button 
                onClick={() => setShowSidebar(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <MoreVertical className="w-4 h-4 rotate-90" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
               {showSidebar === 'chat' ? (
                 <>
                   {/* Chat Disclaimer */}
                   <div className="px-6 py-4 bg-slate-50">
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                         Messages can only be seen by people in the call and are deleted when the call ends.
                      </p>
                   </div>
                   
                   {/* Messages List */}
                   <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-8">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col gap-1 group">
                           <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-black uppercase tracking-tighter ${msg.isMe ? 'text-indigo-600' : 'text-slate-900'}`}>
                                 {msg.sender}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">{msg.time}</span>
                           </div>
                           <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                              {msg.text}
                           </p>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>

                   {/* Chat Input */}
                   <div className="p-6 border-t border-slate-100">
                      <form onSubmit={handleSendMessage} className="relative flex items-center">
                         <input 
                           type="text" 
                           value={chatMessage}
                           onChange={(e) => setChatMessage(e.target.value)}
                           placeholder="Send a message to everyone" 
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 outline-none transition-all pr-12"
                         />
                         <button 
                           type="submit"
                           disabled={!chatMessage.trim()}
                           className={`absolute right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                             chatMessage.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-300'
                           }`}
                         >
                            <Send className="w-4 h-4" />
                         </button>
                      </form>
                   </div>
                 </>
               ) : (
                 <>
                   {/* Participants Search & Tools */}
                   <div className="px-6 py-4 flex flex-col gap-4 border-b border-slate-50">
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                            <Users className="w-3.5 h-3.5" />
                         </div>
                         <input 
                           type="text" 
                           placeholder="Search for people" 
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-[12px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                         />
                      </div>
                      <div className="flex items-center justify-between px-1">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">In Call · {participants.length}</span>
                         <button 
                           onClick={() => setParticipants(prev => prev.map(p => p.isMe ? p : { ...p, micOn: false }))}
                           className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline transition-all"
                         >
                            Mute All
                         </button>
                      </div>
                   </div>

                   {/* Participants List */}
                   <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
                      {participants.map(p => (
                        <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                           <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[p.colorIndex]} flex items-center justify-center text-white text-[12px] font-black shadow-sm ring-4 ring-white`}>
                              {p.avatar}
                           </div>
                           <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-[13px] font-bold text-slate-800 truncate leading-tight">
                                 {p.name}
                              </span>
                              {p.isHost && (
                                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Instructor</span>
                              )}
                           </div>
                           <div className="flex items-center gap-2">
                              {p.handRaised && (
                                 <div className="w-7 h-7 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                                    <Hand className="w-3.5 h-3.5" />
                                 </div>
                              )}
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                 p.micOn ? 'text-slate-400 group-hover:text-emerald-500' : 'bg-rose-50 text-rose-500'
                              }`}>
                                 {p.micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                              </div>
                              {!p.isMe && (
                                 <button className="w-8 h-8 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-all">
                                    <MoreVertical className="w-4 h-4" />
                                 </button>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* Add People Footer (Mock) */}
                   <div className="p-6 border-t border-slate-100 flex items-center justify-center">
                      <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition">
                         <div className="w-8 h-8 rounded-full border border-indigo-100 flex items-center justify-center bg-indigo-50">
                            <span className="text-lg font-light">+</span>
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest">Add People</span>
                      </button>
                   </div>
                 </>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Muted Alert Toast */}
      {showMutedAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
           <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <MicOff className="w-5 h-5" />
              <span className="font-bold text-sm">Your microphone is off.</span>
           </div>
        </div>
      )}

      {/* Control Bar */}
      <div className={`h-20 px-8 flex items-center justify-between z-30 transition-all duration-500 fixed bottom-0 left-0 right-0 ${
        showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } bg-gradient-to-t from-black/80 to-transparent`}>
        
        {/* Meeting Details (Left) */}
        <div className="relative">
           <button 
             onClick={() => setShowMeetingInfo(!showMeetingInfo)}
             className={`flex flex-col text-left transition-all hover:bg-white/5 p-2 rounded-xl ${showMeetingInfo ? 'bg-white/10' : ''}`}
           >
              <h2 className="text-white text-sm font-black tracking-tight flex items-center gap-2">
                Web Development Masterclass
                <Layout className="w-3 h-3 text-white/40" />
              </h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">In Session · 01:24:05</p>
           </button>

           {showMeetingInfo && (
             <div className="absolute bottom-full mb-4 left-0 w-80 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6">
                   <h3 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-4">Joining Info</h3>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Session ID</p>
                      <p className="text-xs font-mono font-bold text-indigo-600">{sessionId}</p>
                   </div>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(window.location.href);
                       alert("Meeting link copied!");
                     }}
                     className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                   >
                     <Users className="w-4 h-4" />
                     Copy Joining Link
                   </button>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase">End-to-end Encrypted</span>
                </div>
             </div>
           )}
        </div>

        {/* Action Buttons (Center) */}
        <div className="flex items-center gap-3 ">
           <button 
             onClick={toggleMic}
             className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
               micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-900/20'
             }`}
           >
             {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
           </button>
           <button 
             onClick={toggleVideo}
             className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
               videoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-900/20'
             }`}
           >
             {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
           </button>
           <button 
             onClick={handleRaiseHand}
             className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
               handRaised ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-900/20' : 'bg-white/10 hover:bg-white/20 text-white'
             }`}
             title="Raise Hand"
           >
             <Hand className="w-4 h-4" />
           </button>
           <button 
             onClick={handleScreenShare}
             className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
               isScreenSharing ? 'bg-green-500 text-white shadow-lg shadow-green-900/20' : 'bg-white/10 hover:bg-white/20 text-white'
             }`}
             title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
           >
             {isScreenSharing ? <MonitorStop className="w-4 h-4" /> : <MonitorUp className="w-4 h-4" />}
           </button>
           <div className="relative">
             <button 
               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
               className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
               title="Send Reaction"
             >
               <Smile className="w-4 h-4" />
             </button>
             {showEmojiPicker && (
               <div className="absolute bottom-full mb-2 right-0 z-50">
                 <EmojiPicker 
                   onEmojiClick={sendReaction}
                   width={350}
                   height={400}
                   theme="light"
                   searchDisabled={false}
                   skinTonesDisabled={true}
                   previewConfig={{ showPreview: false }}
                 />
               </div>
             )}
           </div>
           <button 
             onClick={onLeave}
             className="px-5 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
           >
             <PhoneOff className="w-4 h-4" />
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
           <button 
             onClick={() => setShowSettingsModal(true)}
             className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
           >
             <Settings className="w-4 h-4" />
           </button>
           <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
             <MoreVertical className="w-4 h-4" />
           </button>
        </div>

      </div>

      {/* Floating Reactions */}
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="fixed bottom-32 animate-float-up pointer-events-none z-40"
          style={{ left: `${reaction.x}%` }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg flex items-center gap-2">
            <span className="text-2xl">{reaction.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{reaction.user}</span>
          </div>
        </div>
      ))}

      {/* Device Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
           <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex h-[500px]">
                 {/* Modal Sidebar */}
                 <div className="w-48 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                       <Settings className="w-4 h-4" /> General
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs transition">
                       <Video className="w-4 h-4" /> Video
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs transition">
                       <Mic className="w-4 h-4" /> Audio
                    </button>
                 </div>
                 
                 {/* Modal Content */}
                 <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black text-slate-900">Settings</h2>
                       <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                    </div>

                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                       <section>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Camera</h3>
                          <select className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300">
                             {availableDevices.video.map(d => (
                               <option key={d.deviceId} value={d.deviceId}>{d.label || 'Default Camera'}</option>
                             ))}
                          </select>
                       </section>

                       <section>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Microphone</h3>
                          <select className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300">
                             {availableDevices.audio.map(d => (
                               <option key={d.deviceId} value={d.deviceId}>{d.label || 'Default Mic'}</option>
                             ))}
                          </select>
                       </section>

                       <section className="pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                             <div>
                                <h4 className="text-sm font-bold text-slate-800">Visual Effects</h4>
                                <p className="text-[10px] text-slate-400 font-medium">Blur or change your background</p>
                             </div>
                             <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-black text-slate-600 transition">
                                Manage
                             </button>
                          </div>
                       </section>
                    </div>

                    <div className="mt-auto pt-6 flex justify-end">
                       <button 
                         onClick={() => setShowSettingsModal(false)}
                         className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition"
                       >
                         Done
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}

function VideoTile({ participant, isSmall, isSpotlight, videoRef, onPin, isPinned }) {
  return (
    <div className={`relative bg-slate-800/50 rounded-3xl overflow-hidden group border-2 transition-all duration-500 ${
      isPinned ? 'border-indigo-500' : 
      participant.isHost ? 'border-indigo-500/30' : 'border-transparent'
    } ${isSpotlight ? 'h-full w-full' : 'aspect-video w-full'}`}>
      
      {participant.videoOn ? (
        participant.isMe ? (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <img 
            src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&u=${participant.id}`} 
            alt="video" 
            className="w-full h-full object-cover"
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
           <div className={`rounded-full bg-gradient-to-br ${AVATAR_COLORS[participant.colorIndex]} flex items-center justify-center text-white font-black transition-all ${
             isSpotlight ? 'w-48 h-48 text-6xl' : isSmall ? 'w-16 h-16 text-xl' : 'w-24 h-24 text-3xl'
           }`}>
             {participant.avatar}
           </div>
        </div>
      )}

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
         <button 
           onClick={onPin}
           className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
             isPinned ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white hover:bg-white/40'
           }`}
         >
           <Layout className="w-4 h-4" />
         </button>
         <button className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md flex items-center justify-center transition-all">
           <Maximize className="w-4 h-4" />
         </button>
      </div>

      {/* Name Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
          <span className="text-white text-[11px] font-bold">{participant.name}</span>
          {participant.isHost && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          {isPinned && <Layout className="w-3 h-3 text-indigo-400" />}
        </div>
        <div className="flex items-center gap-1">
          {participant.handRaised && (
            <div className="bg-yellow-500 backdrop-blur-sm p-1.5 rounded-lg animate-bounce">
              <Hand className="w-3 h-3 text-white" />
            </div>
          )}
          <div className={`backdrop-blur-sm p-1.5 rounded-lg ${
            participant.micOn ? 'bg-green-500/80' : 'bg-red-500/80'
          }`}>
            {participant.micOn ? <Mic className="w-3 h-3 text-white" /> : <MicOff className="w-3 h-3 text-white" />}
          </div>
          <div className={`backdrop-blur-sm p-1.5 rounded-lg ${
            participant.videoOn ? 'bg-green-500/80' : 'bg-red-500/80'
          }`}>
            {participant.videoOn ? <Video className="w-3 h-3 text-white" /> : <VideoOff className="w-3 h-3 text-white" />}
          </div>
        </div>
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
