import { api } from './api';

// ── Live Session CRUD ────────────────────────────────────────────────────────

export async function createLiveSession(sessionData: {
  title: string;
  description: string;
  scheduledTime?: string;
  duration?: string;
  maxStudents?: string;
  isInstant: boolean;
  link?: string;
}) {
  const response = await api.post('/live-sessions', sessionData);
  return response as any;
}

export async function getMyLiveSessions() {
  const response = await api.get('/live-sessions/my-sessions');
  return response as any;
}

export async function getLiveSessionById(id: string) {
  const response = await api.get(`/live-sessions/${id}`);
  return response as any;
}

export async function updateSessionStatus(id: string, status: string) {
  const response = await api.patch(`/live-sessions/${id}/status`, { status });
  return response as any;
}

// ── LiveKit Token ────────────────────────────────────────────────────────────

export interface LiveKitTokenResponse {
  token: string;
  identity: string;
  name: string;
  roomName: string;
  livekitUrl: string;
}

/**
 * Gets a LiveKit access token for a specific session room.
 * The backend will create/ensure the room exists and return a signed JWT.
 */
export async function getSessionLiveKitToken(
  sessionId: string,
  options: { enableVideo?: boolean; enableAudio?: boolean } = {},
): Promise<LiveKitTokenResponse> {
  const response = await api.post<LiveKitTokenResponse>(
    `/livekit/sessions/${sessionId}/join`,
    options,
  );
  return response;
}
