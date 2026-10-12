"use client";

import { LoaderCircle, MessageCircle, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { conversationTitle, formatTime, otherUser } from "@/lib/conversation";
import type { ConversationListItem } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";

const linkButton = "text-sm text-violet-300 hover:underline";

export function ChatsTab({ query, onFindPeople }: { query: string; onFindPeople: () => void }) {
	const meId = useAuthStore((s) => s.user?.id);
	const conversations = useChatStore((s) => s.conversations);
	const status = useChatStore((s) => s.status);
	const loadConversations = useChatStore((s) => s.loadConversations);

	const term = query.trim().toLowerCase();
	const visible = term
		? conversations.filter((c) => conversationTitle(c, meId).toLowerCase().includes(term))
		: conversations;

	if (conversations.length === 0) {
		if (status === "error") {
			return (
				<EmptyState
					icon={MessageCircle}
					title="Couldn't load your chats"
					description="Check your connection and try again."
					action={
						<button onClick={() => void loadConversations()} className={linkButton}>
							Try again
						</button>
					}
				/>
			);
		}
		if (status !== "ready") {
			return (
				<div className="grid h-full place-items-center" role="status" aria-label="Loading chats">
					<LoaderCircle className="size-5 animate-spin text-white/40" />
				</div>
			);
		}
		return (
			<EmptyState
				icon={MessagesSquare}
				title="No chats yet"
				description="Find someone in People to start your first conversation."
				action={
					<button onClick={onFindPeople} className={linkButton}>
						Find people
					</button>
				}
			/>
		);
	}

	if (visible.length === 0) {
		return (
			<EmptyState
				icon={MessageCircle}
				title="No matches found"
				description={`Nothing in your chats matches “${query.trim()}”.`}
			/>
		);
	}

	return (
		<ul className="space-y-1">
			{visible.map((c) => (
				<ChatRow key={c.id} conversation={c} meId={meId} />
			))}
		</ul>
	);
}

function ChatRow({ conversation, meId }: { conversation: ConversationListItem; meId?: string }) {
	const active = useChatStore((s) => s.activeConversationId === conversation.id);
	const setActive = useChatStore((s) => s.setActiveConversation);

	const other = otherUser(conversation, meId);
	const online = useChatStore((s) => (other ? Boolean(s.onlineUserIds[other.id]) : false));
	const title = conversationTitle(conversation, meId);
	const last = conversation.lastMessage;

	return (
		<li>
			<button
				onClick={() => setActive(conversation.id)}
				className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${active ? "bg-white/10" : "hover:bg-white/5"
					}`}
			>
				<Avatar name={title} src={other?.avatarUrl} online={online} />
				<div className="min-w-0 flex-1">
					<div className="flex items-baseline justify-between gap-2">
						<span className="truncate text-sm font-medium">{title}</span>
						{last && (
							<span className="shrink-0 text-xs text-white/40">{formatTime(last.createdAt)}</span>
						)}
					</div>
					<div className="flex items-center justify-between gap-2">
						<span className="truncate text-sm text-white/50">
							{last ? `${last.senderId === meId ? "You: " : ""}${last.content}` : "No messages yet"}
						</span>
						{conversation.unreadCount > 0 && (
							<span className="grid min-w-5 place-items-center rounded-full bg-violet-500 px-1.5 text-xs font-medium">
								{conversation.unreadCount}
							</span>
						)}
					</div>
				</div>
			</button>
		</li>
	);
}