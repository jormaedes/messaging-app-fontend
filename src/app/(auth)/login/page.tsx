"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { ApiError, fieldError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/ui/Field";

export default function LoginPage() {
	const login = useAuthStore((s) => s.login);
	const [error, setError] = useState<ApiError | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		setPending(true);
		setError(null);
		try {
			await login(String(form.get("email")), String(form.get("password")));
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(0, "Não foi possível ligar ao servidor."));
		} finally {
			setPending(false);
		}
	}

	return (
		<AuthCard
				title="Bem-vindo/a de volta"
				subtitle="Inicia sessão para continuares as tuas conversas."
			footer={
				<>
					Ainda não tens conta?{" "}
					<Link href="/signup" className="font-medium text-violet-300 hover:underline">
						Criar conta
					</Link>
				</>
			}
		>
			<form onSubmit={onSubmit} className="space-y-4" noValidate>
				<Field
					label="Email ou número de telemóvel"
					name="email"
					type="email"
					icon={Mail}
					autoComplete="email"
					placeholder="nome@exemplo.pt"
					error={fieldError(error, "email")}
				/>
				<Field
					label="Palavra-passe"
					name="password"
					type="password"
					icon={Lock}
					autoComplete="current-password"
					placeholder="••••••••"
					error={fieldError(error, "password")}
				/>

				{error && error.fieldErrors.length === 0 && (
					<p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300" role="alert">
						{error.message}
					</p>
				)}

				<button
					type="submit"
					disabled={pending}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
				>
					{pending && <LoaderCircle className="size-4 animate-spin" />}
					{pending ? "A entrar…" : "Iniciar sessão"}
				</button>
			</form>
		</AuthCard>
	);
}