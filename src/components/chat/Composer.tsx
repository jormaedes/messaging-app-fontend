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
		<div className="flex items-end gap-2 border-t border-[#302a3b] bg-[#100e15] p-3 sm:gap-3 sm:px-5 sm:py-4">
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={onKeyDown}
				rows={1}
				maxLength={2000}
				placeholder="Escreve uma mensagem"
				aria-label="Mensagem"
				className="field-sizing-content max-h-32 min-h-11 flex-1 resize-none rounded-md border border-[#302a3b] bg-[#0c0a10] px-3.5 py-2.5 text-sm text-[#f4f1fa] outline-none transition placeholder:text-[#756d80] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/10"
			/>
			<button
				onClick={submit}
				disabled={!content}
				aria-label="Enviar mensagem"
				className="grid size-11 shrink-0 place-items-center rounded-md bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<SendHorizontal className="size-5" aria-hidden />
			</button>
		</div>
	);
}