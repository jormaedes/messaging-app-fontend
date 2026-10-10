import { API_URL } from "./config";

export interface FieldError {
	field?: string;
	message: string;
}

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public fieldErrors: FieldError[] = [],
	) {
		super(message);
		this.name = "ApiError";
	}
}

export interface RequestOptions {
	method?: "GET" | "POST" | "PATCH" | "DELETE";
	body?: unknown;
	token?: string | null;
}

export async function api<T>(
	path: string,
	{ method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
	const headers: Record<string, string> = {};
	if (body !== undefined) headers["Content-Type"] = "application/json";
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`${API_URL}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const data = await res.json().catch(() => null);

	if (!res.ok) {
		// O backend devolve { message } ou { errors: [{ field, message }] }
		const fieldErrors: FieldError[] = data?.errors ?? [];
		const message = data?.message ?? fieldErrors[0]?.message ?? "Erro inesperado";
		throw new ApiError(res.status, message, fieldErrors);
	}

	return data as T;
}

// Mensagem de erro de um campo específico (vinda do express-validator)
export function fieldError(err: unknown, field: string): string | undefined {
  return err instanceof ApiError
    ? err.fieldErrors.find((e) => e.field === field)?.message
    : undefined;
}