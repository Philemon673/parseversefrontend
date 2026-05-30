"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Users,
  ShieldCheck,
  Wifi,
  Camera,
  AlertTriangle,
} from 'lucide-react';

export default function PreJoin({
  onJoin,
  sessionTitle = "Live Session",
  sessionId,
  participantCount = 0,
  isHost = false,
  userName = "You",
}) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [joining, setJoining] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [devices, setDevices] = useState({ cameras: [], mics: [] });
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Get user initials for avatar
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    async function setupPreview() {
      // First enumerate devices
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const cameras = allDevices.filter((d) => d.kind === 'videoinput');
        const mics = allDevices.filter((d) => d.kind === 'audioinput');
        setDevices({ cameras, mics });
        if (cameras[0]) setSelectedCamera(cameras[0].deviceId);
        if (mics[0]) setSelectedMic(mics[0].deviceId);
      } catch (_) {}

      if (videoOn) {
        try {
          setPermissionError(null);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
          }
          const constraints = {
            video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
            audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;
          // Apply mic state
          stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Media access error:', err);
          setPermissionError(err.name === 'NotAllowedError'
            ? 'Camera/microphone access was denied. Please allow permissions.'
            : 'Could not access camera/microphone.');
          setVideoOn(false);
        }
      } else {
        // Stop tracks when video is turned off
        if (streamRef.current) {
          streamRef.current.getVideoTracks().forEach((t) => t.stop());
        }
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    }

    setupPreview();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [videoOn, selectedCamera, selectedMic]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMicToggle = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = micOn ? false : true));
    }
    setMicOn(!micOn);
  };

  const handleJoin = async () => {
    // Stop the preview stream — LiveKit will open its own
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setJoining(true);
    try {
      await onJoin({ micOn, videoOn });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-indigo-950 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── LEFT: Camera Preview ─────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Main preview */}
          <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            {videoOn && !permissionError ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-900">
                  {initials}
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {permissionError ? 'Camera unavailable' : 'Camera is off'}
                </p>
              </div>
            )}

            {/* Permission error banner */}
            {permissionError && (
              <div className="absolute top-4 left-4 right-4 bg-amber-500/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />
                <p className="text-amber-900 text-xs font-bold">{permissionError}</p>
              </div>
            )}

            {/* Name badge */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <p className="text-white text-xs font-bold">{userName} (You)</p>
            </div>

            {/* Media toggle buttons */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={handleMicToggle}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  micOn
                    ? 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/10'
                    : 'bg-red-500 text-white shadow-red-900/30'
                }`}
                title={micOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  videoOn
                    ? 'bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/10'
                    : 'bg-red-500 text-white shadow-red-900/30'
                }`}
                title={videoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                  className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-all"
                  title="Device settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showDeviceMenu && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                    <h4 className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-3">Camera</h4>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 mb-4 border border-white/10 outline-none"
                    >
                      {devices.cameras.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>
                      ))}
                    </select>
                    <h4 className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-3">Microphone</h4>
                    <select
                      value={selectedMic}
                      onChange={(e) => setSelectedMic(e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 border border-white/10 outline-none"
                    >
                      {devices.mics.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Device status bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${!permissionError ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-white/60 text-xs font-bold">
                {permissionError ? 'Permissions needed' : videoOn && micOn ? 'Camera & mic ready' : videoOn ? 'Camera only' : micOn ? 'Mic only' : 'Camera & mic off'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/30">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Connected</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Join Panel ────────────────────────────── */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Live Session
              </span>
              <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Encrypted
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-3 tracking-tight">
              {sessionTitle}
            </h1>

            {isHost ? (
              <p className="text-white/50 font-medium text-sm">
                You are the <span className="text-indigo-400 font-bold">host</span> of this session.
              </p>
            ) : (
              <p className="text-white/50 font-medium text-sm">
                You are joining as a <span className="text-white/80 font-bold">participant</span>.
              </p>
            )}
          </div>

          {/* Participant count */}
          {participantCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-white/60 text-sm font-bold">
                {participantCount} participant{participantCount !== 1 ? 's' : ''} already in the call
              </span>
            </div>
          )}

          {/* Ready state summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`px-4 py-3 rounded-2xl border flex items-center gap-2.5 ${
              micOn ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800 border-white/5'
            }`}>
              {micOn
                ? <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
                : <MicOff className="w-4 h-4 text-slate-500 shrink-0" />
              }
              <span className={`text-xs font-bold ${micOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {micOn ? 'Mic On' : 'Mic Off'}
              </span>
            </div>
            <div className={`px-4 py-3 rounded-2xl border flex items-center gap-2.5 ${
              videoOn ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800 border-white/5'
            }`}>
              {videoOn
                ? <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
                : <VideoOff className="w-4 h-4 text-slate-500 shrink-0" />
              }
              <span className={`text-xs font-bold ${videoOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {videoOn ? 'Camera On' : 'Camera Off'}
              </span>
            </div>
          </div>

          {/* Join actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-2xl shadow-indigo-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {joining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting…
                </>
              ) : (
                isHost ? '🎙 Start Teaching' : '📹 Join Now'
              )}
            </button>
          </div>

          {/* Session ID hint */}
          {sessionId && (
            <div className="pt-4 border-t border-white/5">
              <p className="text-white/20 text-[10px] font-mono">Session: {sessionId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
