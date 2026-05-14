"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PreJoin from '@/component/video-conference/PreJoin';
import MeetingRoom from '@/component/video-conference/MeetingRoom';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined(true);
  };

  const handleLeave = () => {
    // Logic to leave the session and return to dashboard
    router.push('/student-dashboard/Home');
  };

  if (!joined) {
    return (
      <PreJoin 
        onJoin={handleJoin} 
        sessionTitle="Introduction to React 19 — Live Deep Dive"
      />
    );
  }

  return (
    <MeetingRoom 
      sessionId={sessionId} 
      onLeave={handleLeave}
    />
  );
}
