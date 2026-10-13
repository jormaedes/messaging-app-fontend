import type { Conversation, UserLite } from "./types";

export const userLabel = (user: UserLite) => user.displayName ?? user.username;

// O outro utilizador numa conversa privada (null em grupos)
export function otherUser(conversation: Conversation, meId: string | undefined): UserLite | null {
	if (conversation.isGroup) return null;
	return conversation.participants.find((p) => p.userId !== meId)?.user ?? null;
}

export function conversationTitle(conversation: Conversation, meId: string | undefined) {
	if (conversation.isGroup) return conversation.name ?? "Grupo";
	const other = otherUser(conversation, meId);
	return other ? userLabel(other) : "Pessoa desconhecida";
}

export function formatTime(iso: string) {
	const date = new Date(iso);
	const sameDay = date.toDateString() === new Date().toDateString();
	return sameDay
		? date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
		: date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}