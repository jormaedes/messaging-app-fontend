"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useConnectionStore } from "@/stores/connection";

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
			if (connectedBefore) void chat.loadConversations();
			connectedBefore = true;
		};
		const onDisconnect = () => connection.setStatus("offline");
		const onReconnectAttempt = () => connection.setStatus("connecting");
		const onConnectError = (err: Error) => {
			connection.setStatus("offline");
			// O servidor recusou o token: a sessão não é válida
			if (err.message === "Unauthorized") useAuthStore.getState().logout();
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);
		socket.io.on("reconnect_attempt", onReconnectAttempt);

		socket.on("message:new", chat.receiveMessage);
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
			useConnectionStore.getState().setStatus("offline");
		};
	}, [token]);

	return null;
}