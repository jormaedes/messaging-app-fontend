import type { Conversation, UserLite } from "./types";

export const userLabel = (user: UserLite) => user.displayName ?? user.username;

// O outro utilizador numa conversa privada (null em grupos)
export function otherUser(conversation: Conversation, meId: string | undefined): UserLite | null {
	if (conversation.isGroup) return null;
	return conversation.participants.find((p) => p.userId !== meId)?.user ?? null;
}

export function conversationTitle(conversation: Conversation, meId: string | undefined) {
	if (conversation.isGroup) return conversation.name ?? "Group";
	const other = otherUser(conversation, meId);
	return other ? userLabel(other) : "Unknown user";
}

export function formatTime(iso: string) {
	const date = new Date(iso);
	const sameDay = date.toDateString() === new Date().toDateString();
	return sameDay
		? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		: date.toLocaleDateString([], { day: "2-digit", month: "short" });
}