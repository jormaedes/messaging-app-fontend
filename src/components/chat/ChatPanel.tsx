"use client";

import { MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { conversationTitle, formatTime, otherUser } from "@/lib/conversation";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";

export function ChatPanel() {
	const meId = useAuthStore((s) => s.user?.id);
	const conversation = useChatStore(
		(s) => s.conversations.find((c) => c.id === s.activeConversationId) ?? null,
	);
	const hasConversations = useChatStore((s) => s.conversations.length > 0);

	const other = conversation ? otherUser(conversation, meId) : null;
	const online = useChatStore((s) => (other ? Boolean(s.onlineUserIds[other.id]) : false));

	if (!conversation) {
		return (
			<GlassPanel className="min-h-0">
				<EmptyState
					icon={MessagesSquare}
					title={hasConversations ? "Select a conversation" : "Your inbox is quiet"}
					description={
						hasConversations
							? "Pick a chat from the list to start messaging."
							: "Your chats and messages will appear here once they exist."
					}
				/>
			</GlassPanel>
		);
	}

	const title = conversationTitle(conversation, meId);
	const subtitle = conversation.isGroup
		? `${conversation.participants.length} members`
		: online
			? "Online"
			: other?.lastSeenAt
				? `Last seen ${formatTime(other.lastSeenAt)}`
				: "Offline";

	return (
		<GlassPanel className="flex min-h-0 flex-col overflow-hidden">
			<header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
				<Avatar name={title} src={other?.avatarUrl} online={online} />
				<div className="min-w-0">
					<p className="truncate font-medium">{title}</p>
					<p className="text-xs text-white/45">{subtitle}</p>
				</div>
			</header>
			<div className="grid flex-1 place-items-center text-sm text-white/40">
				Messages come next.
			</div>
		</GlassPanel>
	);
}