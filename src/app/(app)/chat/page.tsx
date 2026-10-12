"use client";

import { Sidebar } from "@/components/chat/Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return (
    <div className="grid h-full min-h-0 grid-cols-[20rem_1fr] gap-4">
      <Sidebar />
      <ChatPanel />
    </div>
  );
}