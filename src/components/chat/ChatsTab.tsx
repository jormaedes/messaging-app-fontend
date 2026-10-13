"use client";

import { LoaderCircle, MessageCircle, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { conversationTitle, formatTime, otherUser } from "@/lib/conversation";
import type { ConversationListItem } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";

const linkButton = "text-sm font-medium text-violet-300 hover:underline";

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
						title="Não foi possível carregar as conversas"
						description="Verifica a ligação à internet e tenta novamente."
					action={
						<button onClick={() => void loadConversations()} className={linkButton}>
							Tentar novamente
						</button>
					}
				/>
			);
		}
		if (status !== "ready") {
			return (
				<div className="grid h-full place-items-center" role="status" aria-label="A carregar conversas">
					<LoaderCircle className="size-5 animate-spin text-violet-300" />
				</div>
			);
		}
		return (
			<EmptyState
				icon={MessagesSquare}
				title="Ainda não tens conversas"
				description="Procura alguém em Pessoas para começares a conversar."
				action={
					<button onClick={onFindPeople} className={linkButton}>
						Encontrar pessoas
					</button>
				}
			/>
		);
	}

	if (visible.length === 0) {
		return (
			<EmptyState
				icon={MessageCircle}
				title="Sem resultados"
				description={`Nenhuma conversa corresponde a “${query.trim()}”.`}
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
				className={`flex w-full items-center gap-3 rounded-md px-2.5 py-3 text-left transition ${active ? "bg-[#261d38] ring-1 ring-inset ring-violet-400/20" : "hover:bg-[#191620]"
					}`}
			>
				<Avatar name={title} src={other?.avatarUrl} online={online} />
				<div className="min-w-0 flex-1">
					<div className="flex items-baseline justify-between gap-2">
							<span className="truncate text-sm font-semibold text-[#eee9f6]">{title}</span>
						{last && (
							<span className="shrink-0 text-[11px] text-[#837b8f]">{formatTime(last.createdAt)}</span>
						)}
					</div>
					<div className="flex items-center justify-between gap-2">
						<span className="truncate text-[13px] text-[#a79fb2]">
							{last ? `${last.senderId === meId ? "Tu: " : ""}${last.content}` : "Ainda sem mensagens"}
						</span>
						{conversation.unreadCount > 0 && (
							<span className={`grid min-w-5 place-items-center rounded-full px-1.5 text-xs font-semibold ${active ? "bg-violet-500 text-white" : "bg-[#302a3b] text-[#c4bdcf]"}`}>
								{conversation.unreadCount}
							</span>
						)}
					</div>
				</div>
			</button>
		</li>
	);
}