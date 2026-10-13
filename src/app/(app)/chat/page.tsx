"use client";

import { Sidebar } from "@/components/chat/Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useChatStore } from "@/stores/chat";

export default function ChatPage() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 gap-0 md:grid-cols-[18rem_minmax(0,1fr)]">
      <div className={`${activeConversationId ? "hidden md:flex" : "flex"} min-h-0 min-w-0`}>
        <Sidebar />
      </div>
      <div className={`${activeConversationId ? "flex" : "hidden md:flex"} min-h-0 min-w-0 w-full`}>
        <ChatPanel />
      </div>
    </div>
  );
}