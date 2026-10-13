export interface UserLite {
	id: string;
	username: string;
	displayName: string | null;
	avatarUrl: string | null;
	lastSeenAt: string | null;
}

export interface UserSelf {
	id: string;
	username: string;
	email: string;
	displayName: string | null;
	bio: string | null;
	avatarUrl: string | null;
}

export interface Message {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
	conversationId: string;
	sender: UserLite;
}

export interface Participant {
	userId: string;
	conversationId: string;
	joinedAt: string;
	lastReadAt: string | null;
	user: UserLite;
}

export interface Conversation {
	id: string;
	isGroup: boolean;
	name: string | null;
	directKey: string | null;
	createdAt: string;
	updatedAt: string;
	participants: Participant[];
}

// O que o GET /conversations devolve (a última mensagem não traz o sender)
export interface ConversationListItem extends Conversation {
	lastMessage: Omit<Message, "sender"> | null;
	unreadCount: number;
}

export interface AuthResponse {
	token: string;
	user: UserSelf;
}

export interface SignupInput {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export type MessageStatus = "sending" | "failed";

// Mensagem no cliente: pode ainda não ter sido confirmada pelo servidor
export interface ClientMessage extends Message {
	status?: MessageStatus;
}

// Resposta do GET /conversations/:id/messages
export interface MessagesPage {
	messages: Message[];
	nextCursor: string | null;
}