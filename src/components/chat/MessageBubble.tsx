import { CheckCheck, RotateCw } from "lucide-react";
import { formatTime } from "@/lib/conversation";
import type { ClientMessage } from "@/lib/types";

interface MessageBubbleProps {
	message: ClientMessage;
	mine: boolean;
	seen: boolean;
	onRetry: () => void;
}

export function MessageBubble({ message, mine, seen, onRetry }: MessageBubbleProps) {
	const sending = message.status === "sending";
	const failed = message.status === "failed";

	return (
		<div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
			<div className="max-w-[88%] sm:max-w-[75%]">
				<div
					className={`whitespace-pre-wrap wrap-anywhere rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${mine ? "rounded-br-sm bg-violet-600 text-white" : "rounded-bl-sm border border-[#302a3b] bg-[#191620] text-[#eee9f6]"
						} ${sending ? "opacity-60" : ""}`}
				>
					{message.content}
				</div>

				<div
					className={`mt-1 flex items-center gap-1.5 text-[11px] text-[#837b8f] ${mine ? "justify-end" : "justify-start"
						}`}
				>
					{failed ? (
						<button
							onClick={onRetry}
							className="flex items-center gap-1 text-red-400 hover:underline"
						>
							<RotateCw className="size-3" aria-hidden />
							Falhou. Tentar novamente
						</button>
					) : sending ? (
						<span>A enviar…</span>
					) : (
						<>
							<span>{formatTime(message.createdAt)}</span>
							{seen && (
								<span className="flex items-center gap-1 text-violet-300">
									<CheckCheck className="size-3" aria-hidden />
								Visto
								</span>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}