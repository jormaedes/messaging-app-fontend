import { create } from "zustand";
import { request } from "@/lib/request";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import type { ClientMessage, Message, MessagesPage } from "@/lib/types";

const PAGE_SIZE = 30;

interface Thread {
	messages: ClientMessage[]; // do mais antigo para o mais recente
	nextCursor: string | null;
	status: "loading" | "ready" | "error";
	loadingMore: boolean;
}

interface MessagesState {
	threads: Record<string, Thread | undefined>;
	loadInitial: (conversationId: string) => Promise<void>;
	loadOlder: (conversationId: string) => Promise<void>;
	addMessage: (message: Message) => void;
	send: (conversationId: string, content: string) => Promise<void>;
	retry: (conversationId: string, tempId: string) => Promise<void>;
	reset: () => void;
}

const emptyThread = (status: Thread["status"]): Thread => ({
	messages: [],
	nextCursor: null,
	status,
	loadingMore: false,
});

export const useMessagesStore = create<MessagesState>()((set, get) => {
	// Altera uma thread existente (e ignora se ela não existir)
	const updateThread = (id: string, change: (thread: Thread) => Thread) =>
		set((s) => {
			const thread = s.threads[id];
			return thread ? { threads: { ...s.threads, [id]: change(thread) } } : s;
		});

	// Envia uma mensagem provisória para o servidor e resolve o resultado
	const deliver = async (conversationId: string, temp: ClientMessage) => {
		try {
			const { message } = await request<{ message: Message }>(
				`/conversations/${conversationId}/messages`,
				{ method: "POST", body: { content: temp.content } },
			);

			updateThread(conversationId, (t) => {
				const alreadyThere = t.messages.some((m) => m.id === message.id);
				return {
					...t,
					messages: alreadyThere
						? t.messages.filter((m) => m.id !== temp.id)
						: t.messages.map((m) => (m.id === temp.id ? message : m)),
				};
			});
			useChatStore.getState().receiveMessage(message);
		} catch {
			updateThread(conversationId, (t) => ({
				...t,
				messages: t.messages.map((m) => (m.id === temp.id ? { ...m, status: "failed" } : m)),
			}));
		}
	};

	return {
		threads: {},

		loadInitial: async (id) => {
			if (!get().threads[id]) {
				set((s) => ({ threads: { ...s.threads, [id]: emptyThread("loading") } }));
			}
			try {
				const page = await request<MessagesPage>(
					`/conversations/${id}/messages?limit=${PAGE_SIZE}`,
				);
				const fetched: ClientMessage[] = [...page.messages].reverse();

				set((s) => {
					const existing = s.threads[id]?.messages ?? [];
					const newest = fetched.at(-1)?.createdAt ?? "";
					const fetchedIds = new Set(fetched.map((m) => m.id));
					// Mantém: mensagens por enviar e mensagens que chegaram durante o pedido
					const tail = existing.filter(
						(m) => m.status !== undefined || (!fetchedIds.has(m.id) && m.createdAt > newest),
					);
					return {
						threads: {
							...s.threads,
							[id]: {
								messages: [...fetched, ...tail],
								nextCursor: page.nextCursor,
								status: "ready",
								loadingMore: false,
							},
						},
					};
				});
			} catch {
				updateThread(id, (t) => ({ ...t, status: t.messages.length > 0 ? "ready" : "error" }));
			}
		},

		loadOlder: async (id) => {
			const thread = get().threads[id];
			if (!thread || thread.loadingMore || !thread.nextCursor) return;

			updateThread(id, (t) => ({ ...t, loadingMore: true }));
			try {
				const page = await request<MessagesPage>(
					`/conversations/${id}/messages?limit=${PAGE_SIZE}&cursor=${thread.nextCursor}`,
				);
				const older: ClientMessage[] = [...page.messages].reverse();

				updateThread(id, (t) => {
					const known = new Set(t.messages.map((m) => m.id));
					return {
						...t,
						messages: [...older.filter((m) => !known.has(m.id)), ...t.messages],
						nextCursor: page.nextCursor,
						loadingMore: false,
					};
				});
			} catch {
				updateThread(id, (t) => ({ ...t, loadingMore: false }));
			}
		},

		addMessage: (message) => {
			updateThread(message.conversationId, (t) =>
				t.messages.some((m) => m.id === message.id)
					? t
					: { ...t, messages: [...t.messages, message] },
			);
		},

		send: async (conversationId, content) => {
			const me = useAuthStore.getState().user;
			if (!me) return;

			const temp: ClientMessage = {
				id: `temp-${crypto.randomUUID()}`,
				content,
				createdAt: new Date().toISOString(),
				senderId: me.id,
				conversationId,
				sender: {
					id: me.id,
					username: me.username,
					displayName: me.displayName,
					avatarUrl: me.avatarUrl,
					lastSeenAt: null,
				},
				status: "sending",
			};

			set((s) => {
				const thread = s.threads[conversationId] ?? emptyThread("ready");
				return {
					threads: {
						...s.threads,
						[conversationId]: { ...thread, messages: [...thread.messages, temp] },
					},
				};
			});

			await deliver(conversationId, temp);
		},

		retry: async (conversationId, tempId) => {
			const temp = get().threads[conversationId]?.messages.find((m) => m.id === tempId);
			if (!temp) return;

			updateThread(conversationId, (t) => ({
				...t,
				messages: t.messages.map((m) => (m.id === tempId ? { ...m, status: "sending" } : m)),
			}));
			await deliver(conversationId, { ...temp, status: "sending" });
		},

		reset: () => set({ threads: {} }),
	};
});