"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Users } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChatsTab } from "./ChatsTab";
import { PeopleTab } from "./PeopleTab";

type Tab = "chats" | "people" | "friends";

const TABS: { id: Tab; label: string }[] = [
	{ id: "chats", label: "Chats" },
	{ id: "people", label: "People" },
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
		<GlassPanel className="flex min-h-0 flex-col gap-3 p-4">
			<div role="tablist" className="grid grid-cols-3 rounded-full border border-white/10 bg-white/5 p-1">
				{TABS.map((t) => (
					<button
						key={t.id}
						role="tab"
						aria-selected={tab === t.id}
						onClick={() => changeTab(t.id)}
						className={`rounded-full px-3 py-2 text-sm font-medium transition ${tab === t.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
							}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{tab !== "friends" && (
				<div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 transition focus-within:border-violet-400/60">
					<Search className="size-4 shrink-0 text-white/40" aria-hidden />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						maxLength={30}
						placeholder={tab === "chats" ? "Search your chats" : "Search people by username"}
						className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
					/>
					<kbd className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
						Ctrl K
					</kbd>
				</div>
			)}

			<div className="min-h-0 flex-1 overflow-y-auto">
				{tab === "chats" && <ChatsTab query={query} onFindPeople={() => changeTab("people")} />}
				{tab === "people" && <PeopleTab query={query} onOpened={() => changeTab("chats")} />}
			</div>
		</GlassPanel>
	);
}