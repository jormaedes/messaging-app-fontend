import { api, ApiError, type RequestOptions } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export async function request<T>(
	path: string,
	options: Omit<RequestOptions, "token"> = {},
): Promise<T> {
	const token = useAuthStore.getState().token;
	try {
		return await api<T>(path, { ...options, token });
	} catch (err) {
		// Token expirado ou revogado: terminar a sessão
		if (err instanceof ApiError && err.status === 401) {
			useAuthStore.getState().logout();
		}
		throw err;
	}
}