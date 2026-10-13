"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useAuthStore } from "@/stores/auth";

export default function ProfilePage() {
	const user = useAuthStore((s) => s.user);

	if (!user) return null;

	return (
		<div className="mx-auto h-full max-w-xl overflow-y-auto">
			<Link
				href="/chat"
				className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
			>
				<ArrowLeft className="size-4" aria-hidden />
				Back to chats
			</Link>

			<GlassPanel className="mt-4 p-6">
				<h1 className="text-lg font-medium">Your profile</h1>
				<p className="mt-1 text-sm text-white/50">This is how other people see you.</p>
				<div className="mt-6">
					<ProfileForm user={user} />
				</div>
			</GlassPanel>
		</div>
	);
}