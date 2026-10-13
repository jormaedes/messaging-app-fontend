"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import type { Message } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useConnectionStore } from "@/stores/connection";
import { useMessagesStore } from "@/stores/messages";

export function SocketConnector() {
	const token = useAuthStore((s) => s.token);

	useEffect(() => {
		if (!token) return;

		const socket = getSocket();
		const chat = useChatStore.getState();
		const connection = useConnectionStore.getState();
		let connectedBefore = false;

		const onConnect = () => {
			connection.setStatus("online");
			// Numa reconexão, recarrega: podem ter chegado mensagens enquanto estivemos fora
			if (connectedBefore) {
				void chat.loadConversations();
				const active = useChatStore.getState().activeConversationId;
				if (active) void useMessagesStore.getState().loadInitial(active);
			}
			connectedBefore = true;
		};
		const onDisconnect = () => connection.setStatus("offline");
		const onReconnectAttempt = () => connection.setStatus("connecting");
		const onConnectError = (err: Error) => {
			connection.setStatus("offline");
			// O servidor recusou o token: a sessão não é válida
			if (err.message === "Unauthorized") useAuthStore.getState().logout();
		};

		// Uma mensagem nova actualiza a lista de conversas E a conversa aberta
		const onMessage = (message: Message) => {
			chat.receiveMessage(message);
			useMessagesStore.getState().addMessage(message);
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);
		socket.io.on("reconnect_attempt", onReconnectAttempt);

		socket.on("message:new", onMessage);
		socket.on("presence:init", ({ onlineUserIds }) => chat.setPresenceInit(onlineUserIds));
		socket.on("presence:update", ({ userId, online, lastSeenAt }) =>
			chat.setPresence(userId, online, lastSeenAt),
		);
		socket.on("conversation:read", chat.applyRead);

		connection.setStatus("connecting");
		socket.auth = { token };
		socket.connect();
		void chat.loadConversations(); // primeira carga, sem esperar pelo socket

		return () => {
			socket.off(); // remove todos os listeners deste socket
			socket.io.off("reconnect_attempt", onReconnectAttempt);
			socket.disconnect();
			useChatStore.getState().reset();
			useMessagesStore.getState().reset();
			useConnectionStore.getState().setStatus("offline");
		};
	}, [token]);

	return null;
}