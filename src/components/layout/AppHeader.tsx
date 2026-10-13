"use client";

import { useAuthStore } from "@/stores/auth";
import { useConnectionStore, type ConnectionStatus } from "@/stores/connection";

const STATUS: Record<ConnectionStatus, { label: string; dot: string }> = {
	online: { label: "Online", dot: "bg-emerald-400" },
	connecting: { label: "Connecting", dot: "animate-pulse bg-amber-400" },
	offline: { label: "Offline", dot: "bg-red-400" },
};

export function AppHeader() {
	const username = useAuthStore((s) => s.user?.username);
	const logout = useAuthStore((s) => s.logout);
	const connection = useConnectionStore((s) => s.status);
	const { label, dot } = STATUS[connection];

	return (
		<header className="flex items-center justify-between px-6 py-4">
			<p className="text-xl font-semibold tracking-tight">Jormaedes</p>

			<div className="flex items-center gap-4 text-sm text-white/60">
				<span className="flex items-center gap-2" role="status">
					<span className={`size-2 rounded-full ${dot}`} aria-hidden />
					{label}
				</span>
				<span className="h-4 w-px bg-white/15" aria-hidden />
				<span>{username}</span>
				<span className="h-4 w-px bg-white/15" aria-hidden />
				<button onClick={logout} className="transition hover:text-white">
					Log out
				</button>
			</div>
		</header>
	);
}