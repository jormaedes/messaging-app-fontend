"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { api, ApiError, type RequestOptions } from "@/lib/api";
import type { AuthResponse, SignupInput, UserSelf } from "@/lib/types";

const TOKEN_KEY = "messaging:token";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
	user: UserSelf | null;
	token: string | null;
	status: Status;
	login: (email: string, password: string) => Promise<void>;
	signup: (input: SignupInput) => Promise<void>;
	logout: () => void;
	setUser: (user: UserSelf) => void;
	// Pedido autenticado: junta o token e faz logout automático em 401
	request: <T>(path: string, options?: Omit<RequestOptions, "token">) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserSelf | null>(null);
	const [status, setStatus] = useState<Status>("loading");

	const clearSession = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		setToken(null);
		setUser(null);
		setStatus("unauthenticated");
	}, []);

	const startSession = useCallback((data: AuthResponse) => {
		localStorage.setItem(TOKEN_KEY, data.token);
		setToken(data.token);
		setUser(data.user);
		setStatus("authenticated");
	}, []);

	// Ao carregar a app: restaurar a sessão a partir do token guardado
	useEffect(() => {
		let cancelled = false;
		const saved = localStorage.getItem(TOKEN_KEY);

		if (!saved) {
			setStatus("unauthenticated");
			return;
		}

		api<{ user: UserSelf }>("/auth/me", { token: saved })
			.then(({ user }) => {
				if (cancelled) return;
				setToken(saved);
				setUser(user);
				setStatus("authenticated");
			})
			.catch((err) => {
				if (cancelled) return;
				// Só apaga o token se o servidor o rejeitou; se for falha de rede, mantém-no
				if (err instanceof ApiError && err.status === 401) {
					localStorage.removeItem(TOKEN_KEY);
				}
				setStatus("unauthenticated");
			});

		return () => {
			cancelled = true; // evita actualizar estado se o effect for repetido (Strict Mode)
		};
	}, []);

	const login = useCallback(
		async (email: string, password: string) => {
			const data = await api<AuthResponse>("/auth/login", {
				method: "POST",
				body: { email, password },
			});
			startSession(data);
		},
		[startSession],
	);

	const signup = useCallback(
		async (input: SignupInput) => {
			const data = await api<AuthResponse>("/auth/signup", {
				method: "POST",
				body: input,
			});
			startSession(data);
		},
		[startSession],
	);

	const request = useCallback(
		async <T,>(path: string, options: Omit<RequestOptions, "token"> = {}) => {
			try {
				return await api<T>(path, { ...options, token });
			} catch (err) {
				if (err instanceof ApiError && err.status === 401) clearSession();
				throw err;
			}
		},
		[token, clearSession],
	);

	const value = useMemo<AuthContextValue>(
		() => ({ user, token, status, login, signup, logout: clearSession, setUser, request }),
		[user, token, status, login, signup, clearSession, request],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
	return ctx;
}