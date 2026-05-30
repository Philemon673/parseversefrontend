"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PreJoin from '@/component/video-conference/PreJoin';
import MeetingRoom from '@/component/video-conference/MeetingRoom';
import { getLiveSessionById, getSessionLiveKitToken, updateSessionStatus } from '@/lib/sessionService';

export default function MentorSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;

  const [phase, setPhase] = useState('loading'); // loading | prejoin | meeting | error
  const [session, setSession] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Load session info + current user
  useEffect(() => {
    async function init() {
      try {
        // Fetch session
        const sess = await getLiveSessionById(sessionId);
        setSession(sess);

        // Get logged-in user from localStorage
        const stored = localStorage.getItem('user');
        if (stored) setCurrentUser(JSON.parse(stored));

        setPhase('prejoin');
      } catch (err) {
        console.error('Failed to load session:', err);
        setError(err.message || 'Session not found.');
        setPhase('error');
      }
    }
    init();
  }, [sessionId]);

  const handleJoin = async ({ micOn, videoOn }) => {
    try {
      // Get LiveKit token from backend
      const data = await getSessionLiveKitToken(sessionId, {
        enableVideo: videoOn,
        enableAudio: micOn,
      });
      setTokenData(data);

      // Mark session as Live
      await updateSessionStatus(sessionId, 'Live').catch(() => {});

      setPhase('meeting');
    } catch (err) {
      console.error('Failed to get LiveKit token:', err);
      alert('Could not connect to the session: ' + (err.message || 'Unknown error'));
    }
  };

  const handleLeave = async () => {
    await updateSessionStatus(sessionId, 'Ended').catch(() => {});
    router.push('/mentor-dashboard/sessions');
  };

  const isHost =
    session && currentUser
      ? session.tutorId === currentUser.id ||
        currentUser.role === 'MENTOR' ||
        currentUser.role === 'ADMIN'
      : true;

  const livekitUrl =
    tokenData?.livekitUrl ||
    process.env.NEXT_PUBLIC_LIVEKIT_URL ||
    'ws://localhost:7880';

  // ── States ───────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm font-bold">Loading session…</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-white font-black text-xl mb-2">Session Unavailable</h2>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push('/mentor-dashboard/sessions')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'prejoin') {
    return (
      <PreJoin
        onJoin={handleJoin}
        sessionTitle={session?.title || 'Live Session'}
        sessionId={sessionId}
        isHost={isHost}
        userName={
          currentUser
            ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'You'
            : 'You'
        }
      />
    );
  }

  return (
    <MeetingRoom
      sessionId={sessionId}
      token={tokenData?.token}
      livekitUrl={livekitUrl}
      sessionTitle={session?.title || 'Live Session'}
      onLeave={handleLeave}
      isHost={isHost}
    />
  );
}
