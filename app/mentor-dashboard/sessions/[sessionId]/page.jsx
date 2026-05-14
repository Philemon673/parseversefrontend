"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PreJoin from '@/component/video-conference/PreJoin';
import MeetingRoom from '@/component/video-conference/MeetingRoom';

export default function MentorSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined(true);
  };

  const handleLeave = () => {
    // Logic to leave the session and return to dashboard
    router.push('/mentor-dashboard/Home');
  };

  if (!joined) {
    return (
      <PreJoin 
        onJoin={handleJoin} 
        sessionTitle="Instructor Portal: Web Development Masterclass"
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
