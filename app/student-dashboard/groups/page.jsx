"use client";

import { SocketProvider } from "@/lib/socket-context";
import GroupsInterface from "@/screens/groups/GroupsInterface";

export default function GroupsPage() {
  return (
    <SocketProvider>
      <GroupsInterface />
    </SocketProvider>
  );
}