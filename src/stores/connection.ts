import { create } from 'zustand';

export type ConnectionStatus = "connecting" | "online" | "offline";

interface ConnectionState {
	status: ConnectionStatus;
	setStatus: (status: ConnectionStatus) => void;
}

export const useConnectionStore = create<ConnectionState>()((set) => ({
	status: "online",
	setStatus: (status) => set({ status }),
}));