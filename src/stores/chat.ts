import { create } from "zustand";
import { request } from "@/lib/request";
import { useAuthStore } from "@/stores/auth";
import type { Conversation, ConversationListItem, Message } from "@/lib/types";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface ChatState {
	conversations: ConversationListItem[];
	status: LoadStatus;
	onlineUserIds: Record<string, true>; // "set" de ids online
	activeConversationId: string | null;

	loadConversations: () => Promise<void>;
	setActiveConversation: (id: string | null) => void;
	openDirect: (userId: string) => Promise<string>;
	receiveMessage: (message: Message) => void;
	setPresenceInit: (userIds: string[]) => void;
	setPresence: (userId: string, online: boolean, lastSeenAt?: string) => void;
	applyRead: (data: { conversationId: string; userId: string; lastReadAt: string }) => void;
	markRead: (conversationId: string) => Promise<void>;
	reset: () => void;
}

const initialState = {
	conversations: [] as ConversationListItem[],
	status: "idle" as LoadStatus,
	onlineUserIds: {} as Record<string, true>,
	activeConversationId: null as string | null,
};

export const useChatStore = create<ChatState>()((set, get) => ({
	...initialState,

	loadConversations: async () => {
		// Se já temos dados, mantém-nos visíveis enquanto recarrega
		if (get().status !== "ready") set({ status: "loading" });
		try {
			const { conversations } = await request<{ conversations: ConversationListItem[] }>(
				"/conversations",
			);
			set({ conversations, status: "ready" });
		} catch {
			set({ status: "error" });
		}
	},

	setActiveConversation: (id) => set({ activeConversationId: id }),

	// Abre (ou recupera) a conversa privada e devolve o id
	openDirect: async (userId) => {
		const { conversation } = await request<{ conversation: Conversation }>(
			"/conversations/direct",
			{ method: "POST", body: { userId } },
		);
		set((s) =>
			s.conversations.some((c) => c.id === conversation.id)
				? s
				: {
					conversations: [
						{ ...conversation, lastMessage: null, unreadCount: 0 },
						...s.conversations,
					],
				},
		);
		return conversation.id;
	},

	receiveMessage: (message) => {
		const meId = useAuthStore.getState().user?.id;
		const { conversations, activeConversationId } = get();
		const existing = conversations.find((c) => c.id === message.conversationId);

		// Conversa ainda desconhecida (alguém acabou de a abrir): vai buscar a lista
		if (!existing) {
			void get().loadConversations();
			return;
		}
		// Evita processar duas vezes a mesma mensagem
		if (existing.lastMessage?.id === message.id) return;

		const isMine = message.senderId === meId;
		const isOpen = activeConversationId === message.conversationId;

		const updated: ConversationListItem = {
			...existing,
			updatedAt: message.createdAt,
			lastMessage: {
				id: message.id,
				content: message.content,
				createdAt: message.createdAt,
				senderId: message.senderId,
				conversationId: message.conversationId,
			},
			unreadCount: isMine || isOpen ? existing.unreadCount : existing.unreadCount + 1,
		};

		// A conversa sobe ao topo da lista
		set({ conversations: [updated, ...conversations.filter((c) => c.id !== existing.id)] });
	},

	setPresenceInit: (userIds) =>
		set({ onlineUserIds: Object.fromEntries(userIds.map((id) => [id, true as const])) }),

	setPresence: (userId, online, lastSeenAt) =>
		set((s) => {
			const onlineUserIds = { ...s.onlineUserIds };
			if (online) onlineUserIds[userId] = true;
			else delete onlineUserIds[userId];

			// Ao ficar offline, actualiza o "visto pela última vez" nas conversas onde ele aparece
			const conversations = lastSeenAt
				? s.conversations.map((c) =>
					c.participants.some((p) => p.userId === userId)
						? {
							...c,
							participants: c.participants.map((p) =>
								p.userId === userId ? { ...p, user: { ...p.user, lastSeenAt } } : p,
							),
						}
						: c,
				)
				: s.conversations;

			return { onlineUserIds, conversations };
		}),

	applyRead: ({ conversationId, userId, lastReadAt }) => {
		const meId = useAuthStore.getState().user?.id;
		set((s) => ({
			conversations: s.conversations.map((c) =>
				c.id !== conversationId
					? c
					: {
						...c,
						// se fui eu a ler (noutro dispositivo), limpa o contador
						unreadCount: userId === meId ? 0 : c.unreadCount,
						participants: c.participants.map((p) =>
							p.userId === userId ? { ...p, lastReadAt } : p,
						),
					},
			),
		}));
	},

	markRead: async (conversationId) => {
		const meId = useAuthStore.getState().user?.id;

		// 1) Optimista: zera o contador já
		set((s) => ({
			conversations: s.conversations.map((c) =>
				c.id === conversationId ? { ...c, unreadCount: 0 } : c,
			),
		}));

		// 2) Avisa o servidor e guarda o lastReadAt oficial
		try {
			const { lastReadAt } = await request<{ conversationId: string; lastReadAt: string }>(
				`/conversations/${conversationId}/read`,
				{ method: "POST" },
			);
			if (meId) get().applyRead({ conversationId, userId: meId, lastReadAt });
		} catch {
			// silencioso: a próxima carga da lista corrige qualquer diferença
		}
	},

	reset: () => set(initialState),
}));