"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAuthStore } from "@/stores/auth";

export default function ProfilePage() {
	const user = useAuthStore((s) => s.user);

	if (!user) {
		return (
			<div className="grid h-full place-items-center text-sm text-[#a79fb2]" role="status">
				A carregar o perfil…
			</div>
		);
	}

	return (
		<div className="mx-auto h-full max-w-xl overflow-y-auto px-4 py-4 sm:px-0">
			<Link
				href="/chat"
				className="inline-flex items-center gap-1.5 text-sm text-[#aaa3b8] transition hover:text-violet-300"
			>
				<ArrowLeft className="size-4" aria-hidden />
				Voltar às conversas
			</Link>

			<GlassPanel className="mt-4 p-6">
				<h1 className="text-lg font-medium">O teu perfil</h1>
				<p className="mt-1 text-sm text-[#a79fb2]">É assim que as outras pessoas te veem.</p>
				<div className="mt-6">
					<ProfileForm user={user} />
				</div>
			</GlassPanel>
		</div>
	);
}