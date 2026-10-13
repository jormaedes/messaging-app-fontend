"use client";

import { ArrowLeft, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { conversationTitle, formatTime, otherUser } from "@/lib/conversation";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";

export function ChatPanel() {
	const meId = useAuthStore((s) => s.user?.id);
	const conversation = useChatStore(
		(s) => s.conversations.find((c) => c.id === s.activeConversationId) ?? null,
	);
	const hasConversations = useChatStore((s) => s.conversations.length > 0);
	const setActiveConversation = useChatStore((s) => s.setActiveConversation);

	const other = conversation ? otherUser(conversation, meId) : null;
	const online = useChatStore((s) => (other ? Boolean(s.onlineUserIds[other.id]) : false));

	if (!conversation) {
		return (
			<GlassPanel className="min-h-0 w-full">
				<EmptyState
					icon={MessagesSquare}
						title={hasConversations ? "Escolhe uma conversa" : "A tua caixa está tranquila"}
					description={
						hasConversations
							? "Seleciona uma conversa na lista para começares a escrever."
							: "As tuas conversas e mensagens vão aparecer aqui."
					}
				/>
			</GlassPanel>
		);
	}

	const title = conversationTitle(conversation, meId);
	const subtitle = conversation.isGroup
			? `${conversation.participants.length} participantes`
		: online
			? "Disponível"
			: other?.lastSeenAt
				? `Visto/a ${formatTime(other.lastSeenAt)}`
				: "Desligado/a";

	return (
		<GlassPanel className="flex min-h-0 w-full flex-col overflow-hidden">
			<header className="flex min-h-16 items-center gap-3 border-b border-[#302a3b] bg-[#100e15] px-3 py-3 sm:px-5">
				<button
					onClick={() => setActiveConversation(null)}
					aria-label="Voltar às conversas"
					className="grid size-9 shrink-0 place-items-center rounded-md text-[#a79fb2] transition hover:bg-[#211b2c] md:hidden"
				>
					<ArrowLeft className="size-4" aria-hidden />
				</button>
				<Avatar name={title} src={other?.avatarUrl} online={online} />
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-[#f4f1fa]">{title}</p>
					<p className="mt-0.5 text-xs text-[#a79fb2]">{subtitle}</p>
				</div>
			</header>

			<MessageList key={`${conversation.id}-messages`} conversation={conversation} />
			<Composer key={`${conversation.id}-composer`} conversationId={conversation.id} />
		</GlassPanel>
	);
}