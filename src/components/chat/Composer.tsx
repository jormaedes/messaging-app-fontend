"use client";

import { useState, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { useMessagesStore } from "@/stores/messages";

export function Composer({ conversationId }: { conversationId: string }) {
	const send = useMessagesStore((s) => s.send);
	const [text, setText] = useState("");
	const content = text.trim();

	function submit() {
		if (!content) return;
		void send(conversationId, content);
		setText("");
	}

	function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			submit();
		}
	}

	return (
		<div className="flex items-end gap-2 border-t border-white/10 p-4">
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={onKeyDown}
				rows={1}
				maxLength={2000}
				placeholder="Write a message"
				aria-label="Message"
				className="field-sizing-content max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition placeholder:text-white/30 focus:border-violet-400/60"
			/>
			<button
				onClick={submit}
				disabled={!content}
				aria-label="Send message"
				className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-500 transition hover:bg-violet-400 disabled:opacity-40"
			>
				<SendHorizontal className="size-5" aria-hidden />
			</button>
		</div>
	);
}