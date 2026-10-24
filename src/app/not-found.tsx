import Link from "next/link";
import { ArrowLeft, MessageCircleOff } from "lucide-react";

export default function NotFound() {
	return (
		<main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16 text-center">
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-1/2 size-[min(75vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]"
			/>
			<section className="surface-enter relative flex w-full max-w-lg flex-col items-center">
				<div className="mb-6 grid size-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
					<MessageCircleOff className="size-6" strokeWidth={1.7} aria-hidden />
				</div>
				<p className="font-mono text-[clamp(5rem,22vw,9rem)] font-semibold leading-none tracking-tight text-violet-400">
					404
				</p>
				<h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#f4f1fa] sm:text-3xl">
					Esta conversa perdeu-se.
				</h1>
				<p className="mt-3 max-w-sm text-sm leading-6 text-[#aaa3b8] sm:text-base">
					A página que procuras não existe ou já não está disponível. Vamos encontrar outro caminho.
				</p>
				<Link
					href="/"
					className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
				>
					<ArrowLeft className="size-4" aria-hidden />
					Voltar ao início
				</Link>
			</section>
		</main>
	);
}
