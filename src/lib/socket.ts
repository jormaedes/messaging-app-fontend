import { io, type Socket } from "socket.io-client";
import { API_URL } from "./config";
import type { Message } from "./types";

interface ServerToClientEvents {
	"message:new": (message: Message) => void;
	"presence:init": (data: { onlineUserIds: string[] }) => void;
	"presence:update": (data: { userId: string; online: boolean; lastSeenAt?: string }) => void;
	"conversation:read": (data: { conversationId: string; userId: string; lastReadAt: string }) => void;
}

export type AppSocket = Socket<ServerToClientEvents>;

let socket: AppSocket | null = null;

// Só cria a instância quando é pedida (e só no browser, dentro de effects)
export function getSocket(): AppSocket {
	if (!socket) {
		socket = io(API_URL, { autoConnect: false });
	}
	return socket;
}