"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChatsTab } from "./ChatsTab";
import { PeopleTab } from "./PeopleTab";

type Tab = "chats" | "people" | "friends";

const TABS: { id: Tab; label: string }[] = [
	{ id: "chats", label: "Conversas" },
	{ id: "people", label: "Pessoas" },
	// { id: "friends", label: "Friends" },
];

export function Sidebar() {
	const [tab, setTab] = useState<Tab>("chats");
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// Atalho Ctrl/Cmd + K para focar a pesquisa
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	function changeTab(next: Tab) {
		setTab(next);
		setQuery("");
	}

	return (
		<GlassPanel className="flex min-h-0 w-full flex-col gap-4 border-y-0 border-l-0 p-4 md:border-y md:border-l sm:p-5">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e849e]">Espaço de trabalho</p>
					<h1 className="mt-1 text-lg font-semibold tracking-tight text-[#f4f1fa]">Mensagens</h1>
				</div>
				<span className="text-xs text-[#8e849e]">Caixa de entrada</span>
			</div>
			<div role="tablist" className="grid grid-cols-2 rounded-full border border-[#302a3b] bg-[#191620] p-1">
				{TABS.map((t) => (
					<button
						key={t.id}
						role="tab"
						aria-selected={tab === t.id}
						onClick={() => changeTab(t.id)}
						className={`rounded-full px-3 py-2 text-sm font-medium transition ${tab === t.id ? "bg-[#30243f] text-[#d6c4ff] shadow-sm" : "text-[#a79fb2] hover:text-white"
							}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{tab !== "friends" && (
				<div className="flex items-center gap-2 rounded-full border border-[#302a3b] bg-[#0d0b12] px-4 py-2.5 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/10">
					<Search className="size-4 shrink-0 text-[#8e849e]" aria-hidden />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						maxLength={30}
						placeholder={tab === "chats" ? "Pesquisar conversas · Ctrl + K" : "Pesquisar pessoas por nome · Ctrl + K"}
						className="w-full bg-transparent text-sm text-[#f4f1fa] outline-none placeholder:text-[#756d80]"
					/>
				</div>
			)}

			<div className="min-h-0 flex-1 overflow-y-auto">
				{tab === "chats" && <ChatsTab query={query} onFindPeople={() => changeTab("people")} />}
				{tab === "people" && <PeopleTab query={query} onOpened={() => changeTab("chats")} />}
			</div>
		</GlassPanel>
	);
}