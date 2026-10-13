"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link2, LoaderCircle, User } from "lucide-react";
import { ApiError, fieldError } from "@/lib/api";
import { request } from "@/lib/request";
import type { UserSelf } from "@/lib/types";
import { useAuthStore } from "@/stores/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Field } from "@/components/ui/Field";

interface FormState {
	displayName: string;
	bio: string;
	avatarUrl: string;
}

// API (null) -> formulário (string vazia)
const toForm = (user: UserSelf): FormState => ({
	displayName: user.displayName ?? "",
	bio: user.bio ?? "",
	avatarUrl: user.avatarUrl ?? "",
});

// Formulário -> API: só os campos que mudaram; vazio vira null (limpar)
function buildPatch(user: UserSelf, form: FormState) {
	const patch: Record<string, string | null> = {};
	const displayName = form.displayName.trim();
	const bio = form.bio.trim();
	const avatarUrl = form.avatarUrl.trim();

	if (displayName !== (user.displayName ?? "")) patch.displayName = displayName || null;
	if (bio !== (user.bio ?? "")) patch.bio = bio || null;
	if (avatarUrl !== (user.avatarUrl ?? "")) patch.avatarUrl = avatarUrl || null;

	return patch;
}

// Só para a pré-visualização; quem valida de verdade é o servidor
function isHttpUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

export function ProfileForm({ user }: { user: UserSelf }) {
	const setUser = useAuthStore((s) => s.setUser);

	const [form, setForm] = useState<FormState>(() => toForm(user));
	const [error, setError] = useState<ApiError | null>(null);
	const [pending, setPending] = useState(false);
	const [saved, setSaved] = useState(false);

	// Valores derivados: calculados no render, sem estado extra
	const patch = buildPatch(user, form);
	const hasChanges = Object.keys(patch).length > 0;
	const avatarPreview = isHttpUrl(form.avatarUrl.trim()) ? form.avatarUrl.trim() : null;

	function update(field: keyof FormState) {
		return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setForm((f) => ({ ...f, [field]: e.target.value }));
			setSaved(false);
		};
	}

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!hasChanges) return;

		setPending(true);
		setError(null);
		setSaved(false);
		try {
			const { user: updated } = await request<{ user: UserSelf }>("/users/me", {
				method: "PATCH",
				body: patch,
			});
			setUser(updated); // o header e o resto da app actualizam-se
			setForm(toForm(updated));
			setSaved(true);
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(0, "Não foi possível ligar ao servidor."));
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-5" noValidate>
			<div className="flex items-center gap-4">
				<Avatar name={form.displayName.trim() || user.username} src={avatarPreview} />
				<div>
					<p className="font-medium">@{user.username}</p>
					<p className="text-sm text-[#a79fb2]">{user.email}</p>
				</div>
			</div>

			<Field
				label="Nome de apresentação"
				name="displayName"
				icon={User}
				value={form.displayName}
				onChange={update("displayName")}
				maxLength={50}
				placeholder={user.username}
				autoComplete="name"
				error={fieldError(error, "displayName")}
			/>

			<div className="space-y-1.5">
				<label htmlFor="bio" className="text-sm font-medium text-[#d2cbdc]">
					Sobre mim
				</label>
				<textarea
					id="bio"
					name="bio"
					value={form.bio}
					onChange={update("bio")}
					maxLength={160}
					rows={3}
					placeholder="Conta um pouco sobre ti"
					aria-invalid={Boolean(fieldError(error, "bio"))}
					className="w-full resize-none rounded-md border border-[#302a3b] bg-[#17141d] px-3.5 py-2.5 text-sm text-[#f4f1fa] outline-none transition placeholder:text-[#756d80] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/10"
				/>
				<div className="flex justify-between text-xs">
					<span className="text-red-400">{fieldError(error, "bio")}</span>
					<span className="text-[#837b8f]">{form.bio.length}/160</span>
				</div>
			</div>

			<Field
				label="Endereço da imagem de perfil"
				name="avatarUrl"
				type="url"
				icon={Link2}
				value={form.avatarUrl}
				onChange={update("avatarUrl")}
				maxLength={500}
				placeholder="https://exemplo.pt/perfil.png"
				autoComplete="off"
				error={fieldError(error, "avatarUrl")}
			/>

			{error && error.fieldErrors.length === 0 && (
				<p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300" role="alert">
					{error.message}
				</p>
			)}

			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={!hasChanges || pending}
					className="flex items-center gap-2 rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
				>
					{pending && <LoaderCircle className="size-4 animate-spin" />}
					Guardar alterações
				</button>
				<span className="text-sm text-violet-300" role="status" aria-live="polite">
					{saved ? "Guardado" : ""}
				</span>
			</div>
		</form>
	);
}