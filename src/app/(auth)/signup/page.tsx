"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LoaderCircle, Lock, Mail, User } from "lucide-react";
import { ApiError, fieldError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field } from "@/components/ui/Field";

export default function SignupPage() {
	const signup = useAuthStore((s) => s.signup);
	const [error, setError] = useState<ApiError | null>(null);
	const [pending, setPending] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		setPending(true);
		setError(null);
		try {
			await signup({
				username: String(form.get("username")),
				email: String(form.get("email")),
				password: String(form.get("password")),
				confirmPassword: String(form.get("confirmPassword")),
			});
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(0, "Não foi possível ligar ao servidor."));
		} finally {
			setPending(false);
		}
	}

	return (
		<AuthCard
				title="Cria a tua conta"
				subtitle="Só precisas de um instante."
			footer={
				<>
					Já tens uma conta?{" "}
					<Link href="/login" className="font-medium text-violet-300 hover:underline">
						Iniciar sessão
					</Link>
				</>
			}
		>
			<form onSubmit={onSubmit} className="space-y-4" noValidate>
				<Field
					label="Nome de utilizador"
					name="username"
					icon={User}
					autoComplete="username"
					placeholder="jorma"
					error={fieldError(error, "username")}
				/>
				<Field
					label="Email"
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
					autoComplete="new-password"
					placeholder="Pelo menos 8 caracteres"
					error={fieldError(error, "password")}
				/>
				<Field
					label="Confirmar palavra-passe"
					name="confirmPassword"
					type="password"
					icon={Lock}
					autoComplete="new-password"
					placeholder="Repete a palavra-passe"
					error={fieldError(error, "confirmPassword")}
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
					{pending ? "A criar conta…" : "Criar conta"}
				</button>
			</form>
		</AuthCard>
	);
}