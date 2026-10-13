"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
	const status = useAuthStore((s) => s.status);
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") router.replace("/chat");
	}, [status, router]);

	return (
		<main className="grid min-h-dvh bg-[#09080d] lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
			<section className="relative hidden min-h-dvh overflow-hidden border-r border-white/10 px-12 py-10 lg:flex lg:flex-col lg:justify-between xl:px-20">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(139,92,246,0.18),transparent_46%)]" />
				<div className="relative flex items-center gap-3 text-sm font-semibold tracking-wide text-white">
					<span className="grid size-10 place-items-center rounded-xl bg-violet-500 text-white">J</span>
					Jormaedes
				</div>
				<div className="relative max-w-xl pb-10">
					<p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Conversas que aproximam</p>
					<h1 className="text-6xl font-semibold leading-[1.04] tracking-tight xl:text-7xl">
						As tuas pessoas.
						<br />
						<span className="text-violet-400">Sempre por perto.</span>
					</h1>
					<p className="mt-6 max-w-md text-base leading-7 text-white/55">
						Um espaço simples para manter conversas importantes a acontecer, onde quer que estejas.
					</p>
					<div className="mt-10 flex gap-3" aria-hidden>
						<span className="h-1.5 w-16 rounded-full bg-violet-400" />
						<span className="h-1.5 w-7 rounded-full bg-white/15" />
						<span className="h-1.5 w-7 rounded-full bg-white/15" />
					</div>
				</div>
				<p className="relative text-xs text-white/35">Mensagens feitas para o dia a dia.</p>
			</section>
			<section className="grid min-h-dvh place-items-center px-4 py-10 sm:px-8 lg:px-12">
				<div className="w-full max-w-md">
					<div className="mb-7 text-center lg:hidden">
						<p className="text-xl font-semibold tracking-tight">Jormaedes</p>
						<p className="mt-2 text-sm text-white/50">Conversas que aproximam.</p>
					</div>
					{children}
				</div>
			</section>
		</main>
	);
}