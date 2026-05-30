"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  Chat,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, RoomEvent } from 'livekit-client';
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MonitorStop,
  MessageSquare, Users, Hand, PhoneOff, Settings,
  MoreVertical, Send, ShieldCheck, Layout, X, Copy,
  Maximize2, Grid,
} from 'lucide-react';

// ── Inner room UI (rendered inside <LiveKitRoom>) ─────────────────────────────
function RoomUI({ sessionId, sessionTitle, onLeave, isHost }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks(
    [Track.Source.Camera, Track.Source.ScreenShare, Track.Source.Microphone],
    { onlySubscribed: false }
  );

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [sidebar, setSidebar] = useState(null); // 'chat' | 'people' | null
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Chat via LiveKit data channel
  useEffect(() => {
    if (!room) return;
    const handler = (payload, participant) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === 'chat') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: participant?.name || 'Unknown',
            text: data.text,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
          }]);
        }
      } catch (_) {}
    };
    room.on(RoomEvent.DataReceived, handler);
    return () => room.off(RoomEvent.DataReceived, handler);
  }, [room]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !room) return;
    const payload = JSON.stringify({ type: 'chat', text: chatMsg });
    room.localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true });
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: localParticipant?.name || 'You',
      text: chatMsg,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }]);
    setChatMsg('');
  };

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(v => !v);
  };

  const toggleVideo = async () => {
    await localParticipant.setCameraEnabled(!videoOn);
    setVideoOn(v => !v);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        await localParticipant.setScreenShareEnabled(true);
        setIsScreenSharing(true);
      } catch (_) {}
    } else {
      await localParticipant.setScreenShareEnabled(false);
      setIsScreenSharing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const AVATAR_COLORS = [
    'from-indigo-500 to-purple-600', 'from-pink-500 to-rose-600',
    'from-blue-500 to-cyan-600',    'from-green-500 to-emerald-600',
    'from-orange-500 to-amber-600', 'from-teal-500 to-green-600',
  ];

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="h-screen w-full bg-[#0a0a0f] flex flex-col overflow-hidden font-sans relative">

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-3 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest">Live</span>
            <div className="w-px h-3 bg-white/20 mx-1" />
            <span className="text-white/80 text-xs font-bold">{fmtTime(elapsed)}</span>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-white/50 hover:text-white text-xs font-bold transition truncate max-w-xs pointer-events-auto"
          >
            {sessionTitle}
          </button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          Encrypted · {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── VIDEO GRID ── */}
      <div className={`flex-1 overflow-hidden flex transition-all duration-300 ${sidebar ? '' : ''}`}>
        <div className="flex-1 relative pt-14 pb-20">
          <GridLayout
            tracks={tracks}
            style={{ height: '100%', width: '100%', padding: '12px', gap: '8px' }}
          >
            <ParticipantTile />
          </GridLayout>
        </div>

        {/* ── SIDEBAR ── */}
        {sidebar && (
          <div className="w-[340px] bg-white my-4 mr-4 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-right duration-300">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
                {sidebar === 'chat'
                  ? <><MessageSquare className="w-4 h-4 text-indigo-600" /> In-Call Messages</>
                  : <><Users className="w-4 h-4 text-indigo-600" /> People ({participants.length})</>
                }
              </h2>
              <button onClick={() => setSidebar(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {sidebar === 'chat' ? (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {messages.length === 0 && (
                    <p className="text-slate-300 text-xs text-center mt-8">No messages yet. Say hi! 👋</p>
                  )}
                  {messages.map(m => (
                    <div key={m.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black ${m.isMe ? 'text-indigo-600' : 'text-slate-900'}`}>{m.sender}</span>
                        <span className="text-[10px] text-slate-300">{m.time}</span>
                      </div>
                      <p className="text-sm text-slate-600">{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 flex gap-2">
                  <input
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    placeholder="Message everyone…"
                    className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition"
                  />
                  <button
                    type="submit"
                    disabled={!chatMsg.trim()}
                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition hover:bg-indigo-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {participants.map((p, i) => (
                  <div key={p.identity} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition group">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-black`}>
                      {getInitials(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {p.name}
                        {p.isLocal && <span className="text-slate-400 font-normal"> (You)</span>}
                      </p>
                      {isHost && p.identity !== localParticipant?.identity && (
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Participant</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {p.isMicrophoneEnabled
                        ? <Mic className="w-3.5 h-3.5 text-emerald-500" />
                        : <MicOff className="w-3.5 h-3.5 text-red-400" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-4 pt-6 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">

        {/* Left: session info */}
        <div className="relative">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex flex-col text-left hover:bg-white/5 p-2 rounded-xl transition"
          >
            <h2 className="text-white text-sm font-black truncate max-w-[200px]">{sessionTitle}</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{fmtTime(elapsed)}</p>
          </button>
          {showInfo && (
            <div className="absolute bottom-full mb-3 left-0 w-72 bg-white rounded-2xl shadow-2xl p-5 z-50">
              <h3 className="text-slate-900 font-black text-sm mb-3">Session Info</h3>
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-[10px] text-slate-400 font-bold mb-1">SESSION ID</p>
                <p className="text-xs font-mono text-indigo-600">{sessionId}</p>
              </div>
              <button onClick={copyLink} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Copy className="w-3.5 h-3.5" /> Copy Invite Link
              </button>
            </div>
          )}
        </div>

        {/* Center: controls */}
        <div className="flex items-center gap-2">
          <CtrlBtn active={micOn} onClick={toggleMic} danger={!micOn} title={micOn ? 'Mute' : 'Unmute'}>
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </CtrlBtn>
          <CtrlBtn active={videoOn} onClick={toggleVideo} danger={!videoOn} title={videoOn ? 'Stop video' : 'Start video'}>
            {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </CtrlBtn>
          <CtrlBtn active={!isScreenSharing} onClick={toggleScreenShare} success={isScreenSharing} title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
            {isScreenSharing ? <MonitorStop className="w-4 h-4" /> : <MonitorUp className="w-4 h-4" />}
          </CtrlBtn>
          <CtrlBtn active={!handRaised} onClick={() => setHandRaised(v => !v)} warn={handRaised} title={handRaised ? 'Lower hand' : 'Raise hand'}>
            <span className="text-base">✋</span>
          </CtrlBtn>

          {/* Leave */}
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="px-5 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all shadow-lg shadow-red-900/30 ml-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="text-sm font-black">Leave</span>
          </button>
        </div>

        {/* Right: sidebar toggles */}
        <div className="flex items-center gap-2">
          <CtrlBtn active={sidebar !== 'people'} onClick={() => setSidebar(sidebar === 'people' ? null : 'people')} title="Participants">
            <Users className="w-4 h-4" />
          </CtrlBtn>
          <CtrlBtn active={sidebar !== 'chat'} onClick={() => setSidebar(sidebar === 'chat' ? null : 'chat')} title="Chat">
            <MessageSquare className="w-4 h-4" />
          </CtrlBtn>
          <CtrlBtn active onClick={() => setShowSettings(true)} title="Settings">
            <Settings className="w-4 h-4" />
          </CtrlBtn>
          <CtrlBtn active title="More">
            <MoreVertical className="w-4 h-4" />
          </CtrlBtn>
        </div>
      </div>

      {/* RoomAudioRenderer ensures remote audio plays */}
      <RoomAudioRenderer />

      {/* ── LEAVE CONFIRM ── */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLeaveConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <PhoneOff className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Leave session?</h3>
            <p className="text-slate-500 text-sm mb-6">
              {isHost
                ? 'As host, ending the call will disconnect all participants.'
                : 'You can rejoin this session anytime.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLeaveConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition">
                Stay
              </button>
              <button
                onClick={async () => {
                  if (isHost) await room.disconnect();
                  onLeave?.();
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
              >
                {isHost ? 'End for all' : 'Leave'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ── */}
      {showSettings && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Device Settings</h3>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-400 text-sm">Device switching is handled automatically by LiveKit. Use your browser's media device picker for advanced settings.</p>
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <p className="text-indigo-700 text-xs font-bold">All video and audio is end-to-end encrypted</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper button component
function CtrlBtn({ children, onClick, active, danger, success, warn, title }) {
  let cls = 'bg-white/10 hover:bg-white/20 text-white';
  if (danger)   cls = 'bg-red-500 text-white shadow-lg shadow-red-900/30';
  if (success)  cls = 'bg-green-500 text-white shadow-lg shadow-green-900/30';
  if (warn)     cls = 'bg-amber-500 text-white shadow-lg shadow-amber-900/30';
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${cls}`}
    >
      {children}
    </button>
  );
}

// ── Main export (wraps LiveKitRoom) ──────────────────────────────────────────
export default function MeetingRoom({ sessionId, token, livekitUrl, sessionTitle, onLeave, isHost }) {
  if (!token || !livekitUrl) {
    return (
      <div className="h-screen w-full bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm font-bold">Connecting to session…</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={livekitUrl}
      token={token}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={onLeave}
      data-lk-theme="default"
      style={{ height: '100vh' }}
    >
      <RoomUI
        sessionId={sessionId}
        sessionTitle={sessionTitle}
        onLeave={onLeave}
        isHost={isHost}
      />
    </LiveKitRoom>
  );
}
