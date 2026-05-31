"use client";

import { SocketProvider } from "@/lib/socket-context";
import ChatInterface from "@/screens/chat/ChatInterface";

export default function ChatPage() {
  return (
    <SocketProvider>
      <ChatInterface />
    </SocketProvider>
  );
}