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
			setError(err instanceof ApiError ? err : new ApiError(0, "Could not reach the server"));
		} finally {
			setPending(false);
		}
	}

	return (
		<AuthCard
			title="Create your account"
			subtitle="It only takes a moment."
			footer={
				<>
					Already have an account?{" "}
					<Link href="/login" className="text-violet-300 hover:underline">
						Log in
					</Link>
				</>
			}
		>
			<form onSubmit={onSubmit} className="space-y-4" noValidate>
				<Field
					label="Username"
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
					placeholder="you@example.com"
					error={fieldError(error, "email")}
				/>
				<Field
					label="Password"
					name="password"
					type="password"
					icon={Lock}
					autoComplete="new-password"
					placeholder="At least 8 characters"
					error={fieldError(error, "password")}
				/>
				<Field
					label="Confirm password"
					name="confirmPassword"
					type="password"
					icon={Lock}
					autoComplete="new-password"
					placeholder="Repeat your password"
					error={fieldError(error, "confirmPassword")}
				/>

				{error && error.fieldErrors.length === 0 && (
					<p className="rounded-xl bg-red-400/10 px-3 py-2 text-sm text-red-300" role="alert">
						{error.message}
					</p>
				)}

				<button
					type="submit"
					disabled={pending}
					className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-400 disabled:opacity-60"
				>
					{pending && <LoaderCircle className="size-4 animate-spin" />}
					Create account
				</button>
			</form>
		</AuthCard>
	);
}