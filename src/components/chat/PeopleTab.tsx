"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Search, SearchX } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { userLabel } from "@/lib/conversation";
import { request } from "@/lib/request";
import type { UserLite } from "@/lib/types";
import { useChatStore } from "@/stores/chat";

type Status = "idle" | "loading" | "done" | "error";

export function PeopleTab({ query, onOpened }: { query: string; onOpened: () => void }) {
	const [results, setResults] = useState<UserLite[]>([]);
	const [status, setStatus] = useState<Status>("idle");
	const [opening, setOpening] = useState<string | null>(null);
	const term = query.trim();

	// Pesquisa com debounce de 300 ms; "cancelled" ignora respostas de pesquisas antigas
	useEffect(() => {
		if (!term) {
			setResults([]);
			setStatus("idle");
			return;
		}

		let cancelled = false;
		setStatus("loading");

		const timer = setTimeout(async () => {
			try {
				const { users } = await request<{ users: UserLite[] }>(
					`/users?search=${encodeURIComponent(term)}`,
				);
				if (cancelled) return;
				setResults(users);
				setStatus("done");
			} catch {
				if (!cancelled) setStatus("error");
			}
		}, 300);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [term]);

	async function open(user: UserLite) {
		setOpening(user.id);
		try {
			const chat = useChatStore.getState();
			const conversationId = await chat.openDirect(user.id);
			chat.setActiveConversation(conversationId);
			onOpened(); // volta ao separador Chats
		} catch {
			setStatus("error");
		} finally {
			setOpening(null);
		}
	}

	if (status === "idle") {
		return (
			<EmptyState
				icon={Search}
				title="Find people"
				description="Type a username to start a conversation."
			/>
		);
	}
	if (status === "loading") {
		return (
			<div className="grid h-full place-items-center" role="status" aria-label="Searching">
				<LoaderCircle className="size-5 animate-spin text-white/40" />
			</div>
		);
	}
	if (status === "error") {
		return (
			<EmptyState
				icon={SearchX}
				title="Something went wrong"
				description="We couldn't complete that. Please try again."
			/>
		);
	}
	if (results.length === 0) {
		return (
			<EmptyState
				icon={SearchX}
				title="No people found"
				description={`Nobody matches “${term}”.`}
			/>
		);
	}

	return (
		<ul className="space-y-1">
			{results.map((user) => (
				<PersonRow
					key={user.id}
					user={user}
					disabled={opening !== null}
					loading={opening === user.id}
					onClick={() => void open(user)}
				/>
			))}
		</ul>
	);
}

interface PersonRowProps {
	user: UserLite;
	disabled: boolean;
	loading: boolean;
	onClick: () => void;
}

function PersonRow({ user, disabled, loading, onClick }: PersonRowProps) {
	const online = useChatStore((s) => Boolean(s.onlineUserIds[user.id]));

	return (
		<li>
			<button
				onClick={onClick}
				disabled={disabled}
				className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-white/5 disabled:opacity-60"
			>
				<Avatar name={userLabel(user)} src={user.avatarUrl} online={online} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">{userLabel(user)}</p>
					<p className="truncate text-sm text-white/45">@{user.username}</p>
				</div>
				{loading && <LoaderCircle className="size-4 animate-spin text-white/50" />}
			</button>
		</li>
	);
}