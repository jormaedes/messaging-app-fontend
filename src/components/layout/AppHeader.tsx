"use client";

import Link from "next/link";
import { LogOut, MessageSquareText, UserRound } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useConnectionStore, type ConnectionStatus } from "@/stores/connection";

const STATUS: Record<ConnectionStatus, { label: string; dot: string }> = {
	online: { label: "Ligado", dot: "bg-violet-400" },
	connecting: { label: "A ligar", dot: "animate-pulse bg-violet-200" },
	offline: { label: "Desligado", dot: "bg-red-400" },
};

export function AppHeader() {
	const name = useAuthStore((s) => s.user?.displayName ?? s.user?.username);
	const logout = useAuthStore((s) => s.logout);
	const connection = useConnectionStore((s) => s.status);
	const { label, dot } = STATUS[connection];

	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b border-[#302a3b] bg-[#100e15] px-4 sm:px-6">
			<Link href="/chat" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[#f4f1fa]">
				<span className="grid size-8 place-items-center rounded-md bg-violet-600 text-white">
					<MessageSquareText className="size-4" aria-hidden />
				</span>
				Feito por Jormaedes
			</Link>

			<div className="flex items-center gap-3 text-sm text-[#aaa3b8] sm:gap-5">
				<span className="hidden items-center gap-2 sm:flex" role="status">
					<span className={`size-2 rounded-full ${dot}`} aria-hidden />
					{label}
				</span>
				<Link href="/profile" aria-label="Perfil" className="flex items-center gap-2 transition hover:text-violet-300">
					<UserRound className="size-4" aria-hidden />
					<span className="hidden max-w-36 truncate sm:inline">{name}</span>
				</Link>
				<button onClick={logout} aria-label="Terminar sessão" title="Terminar sessão" className="grid size-8 place-items-center rounded-md text-[#aaa3b8] transition hover:bg-[#211b2c] hover:text-violet-300">
					<LogOut className="size-4" aria-hidden />
				</button>
			</div>
		</header>
	);
}