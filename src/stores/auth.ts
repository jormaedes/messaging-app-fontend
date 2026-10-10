import { create } from "zustand";
import { api, ApiError } from "@/lib/api";
import type { AuthResponse, SignupInput, UserSelf } from "@/lib/types";

const TOKEN_KEY = "messagin_app_jormaedes:token";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
	user: UserSelf | null;
	token: string | null;
	status: Status;
	init: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	signup: (input: SignupInput) => Promise<void>;
	logout: () => void;
	setUser: (user: UserSelf) => void;
}

let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()((set) => {
	const startSession = (data: AuthResponse) => {
		localStorage.setItem(TOKEN_KEY, data.token);
		set({ token: data.token, user: data.user, status: "authenticated" });
	};

	return {
		user: null,
		token: null,
		status: "loading",

		// Restaura a sessão ao abrir a app. Chamada várias vezes, só corre uma
		init: () => {
			initPromise ??= (async () => {
				const saved = localStorage.getItem(TOKEN_KEY);
				if (!saved) {
					set({ status: "unauthenticated" });
					return;
				}
				try {
					const { user } = await api<{ user: UserSelf }>("/auth/me", { token: saved });
					set({ token: saved, user, status: "authenticated" });
				} catch (err) {
					// Só apaga o token se o servidor o rejeitou (e não numa falha de rede)
					if (err instanceof ApiError && err.status === 401) {
						localStorage.removeItem(TOKEN_KEY);
					}
					set({ status: "unauthenticated" });
				}
			})();
			return initPromise;
		},

		login: async (email, password) => {
			const data = await api<AuthResponse>("/auth/login", {
				method: "POST",
				body: { email, password },
			});
			startSession(data);
		},

		signup: async (input) => {
			const data = await api<AuthResponse>("/auth/signup", {
				method: "POST",
				body: input,
			});
			startSession(data);
		},

		logout: () => {
			localStorage.removeItem(TOKEN_KEY);
			set({ token: null, user: null, status: "unauthenticated" });
		},

		setUser: (user) => set({ user }),
	};
});