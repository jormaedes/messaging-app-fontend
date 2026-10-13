"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, LoaderCircle, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { otherUser } from "@/lib/conversation";
import type { ConversationListItem } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useMessagesStore } from "@/stores/messages";
import { MessageBubble } from "./MessageBubble";

export function MessageList({ conversation }: { conversation: ConversationListItem }) {
	const conversationId = conversation.id;
	const meId = useAuthStore((s) => s.user?.id);

	const thread = useMessagesStore((s) => s.threads[conversationId]);
	const loadInitial = useMessagesStore((s) => s.loadInitial);
	const loadOlder = useMessagesStore((s) => s.loadOlder);
	const retry = useMessagesStore((s) => s.retry);
	const markRead = useChatStore((s) => s.markRead);

	const containerRef = useRef<HTMLDivElement>(null);
	const stickToBottom = useRef(true);
	const heightBeforePrepend = useRef<number | null>(null);
	const [hasNew, setHasNew] = useState(false);

	// Valores derivados da thread
	const messages = thread?.messages ?? [];
	const status = thread?.status ?? "loading";
	const loadingMore = thread?.loadingMore ?? false;
	const nextCursor = thread?.nextCursor ?? null;

	const last = messages.at(-1);
	const lastId = last?.id;
	const lastSenderId = last?.senderId;
	const lastCreatedAt = last?.createdAt;
	const lastIsPending = last?.status !== undefined;

	// "Seen": o outro participante já leu a minha última mensagem?
	const other = otherUser(conversation, meId);
	const otherLastReadAt =
		conversation.participants.find((p) => p.userId === other?.id)?.lastReadAt ?? null;
	const lastOwn = [...messages]
		.reverse()
		.find((m) => m.senderId === meId && m.status === undefined);
	const seenMessageId =
		lastOwn && otherLastReadAt && otherLastReadAt >= lastOwn.createdAt ? lastOwn.id : null;

	// Para decidir se é preciso marcar como lido
	const myLastReadAt =
		conversation.participants.find((p) => p.userId === meId)?.lastReadAt ?? null;
	const unreadCount = conversation.unreadCount;

	// 1) Carregar as mensagens ao abrir a conversa
	useEffect(() => {
		void loadInitial(conversationId);
	}, [conversationId, loadInitial]);

	// 2) Gerir o scroll (corre antes de o browser pintar)
	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el || loadingMore) return;

		// Acabámos de acrescentar mensagens antigas: manter o ecrã onde estava
		if (heightBeforePrepend.current !== null) {
			el.scrollTop += el.scrollHeight - heightBeforePrepend.current;
			heightBeforePrepend.current = null;
			return;
		}

		// Carga inicial ou mensagem nova
		if (stickToBottom.current || lastSenderId === meId) {
			el.scrollTop = el.scrollHeight;
			stickToBottom.current = true;
		} else if (lastId) {
			setHasNew(true);
		}
	}, [messages.length, lastId, lastSenderId, loadingMore, meId]);

	// 3) Marcar como lido quando há algo por ler
	useEffect(() => {
		if (status !== "ready" || !lastId || lastIsPending) return;

		const incomingUnseen =
			lastSenderId !== meId && (!myLastReadAt || myLastReadAt < (lastCreatedAt ?? ""));

		if (unreadCount > 0 || incomingUnseen) void markRead(conversationId);
	}, [
		conversationId,
		status,
		lastId,
		lastIsPending,
		lastSenderId,
		lastCreatedAt,
		meId,
		myLastReadAt,
		unreadCount,
		markRead,
	]);

	function onScroll() {
		const el = containerRef.current;
		if (!el) return;

		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		stickToBottom.current = distanceFromBottom < 120;
		if (stickToBottom.current) setHasNew(false);

		// Chegou ao topo: pedir a página de mensagens mais antigas
		if (el.scrollTop < 80 && nextCursor && !loadingMore) {
			heightBeforePrepend.current = el.scrollHeight;
			void loadOlder(conversationId);
		}
	}

	function jumpToBottom() {
		const el = containerRef.current;
		if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
	}

	// Estados especiais (os hooks já foram todos chamados acima)
	if (status === "error") {
		return (
			<div className="min-h-0 flex-1">
				<EmptyState
					icon={MessageCircle}
					title="Couldn't load messages"
					description="Check your connection and try again."
					action={
						<button
							onClick={() => void loadInitial(conversationId)}
							className="text-sm text-violet-300 hover:underline"
						>
							Try again
						</button>
					}
				/>
			</div>
		);
	}

	if (status === "loading" && messages.length === 0) {
		return (
			<div className="grid min-h-0 flex-1 place-items-center" role="status" aria-label="Loading messages">
				<LoaderCircle className="size-5 animate-spin text-white/40" />
			</div>
		);
	}

	if (messages.length === 0) {
		return (
			<div className="min-h-0 flex-1">
				<EmptyState
					icon={MessageCircle}
					title="No messages yet"
					description="Say hello to start the conversation."
				/>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			<div
				ref={containerRef}
				onScroll={onScroll}
				className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
			>
				<div className="space-y-3">
					{loadingMore && (
						<div className="grid place-items-center py-2" role="status" aria-label="Loading older messages">
							<LoaderCircle className="size-4 animate-spin text-white/40" />
						</div>
					)}
					{messages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							mine={message.senderId === meId}
							seen={message.id === seenMessageId}
							onRetry={() => void retry(conversationId, message.id)}
						/>
					))}
				</div>
			</div>

			{hasNew && (
				<button
					onClick={jumpToBottom}
					className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-violet-500 px-3.5 py-1.5 text-xs font-medium shadow-lg shadow-black/40 transition hover:bg-violet-400"
				>
					<ArrowDown className="size-3.5" aria-hidden />
					New messages
				</button>
			)}
		</div>
	);
}