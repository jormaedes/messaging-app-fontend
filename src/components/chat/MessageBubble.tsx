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
			<div className="max-w-[75%]">
				<div
					className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm [overflow-wrap:anywhere] ${mine ? "rounded-br-md bg-violet-500" : "rounded-bl-md bg-white/10"
						} ${sending ? "opacity-60" : ""}`}
				>
					{message.content}
				</div>

				<div
					className={`mt-1 flex items-center gap-1.5 text-xs text-white/40 ${mine ? "justify-end" : "justify-start"
						}`}
				>
					{failed ? (
						<button
							onClick={onRetry}
							className="flex items-center gap-1 text-red-300 hover:underline"
						>
							<RotateCw className="size-3" aria-hidden />
							Failed. Retry
						</button>
					) : sending ? (
						<span>Sending…</span>
					) : (
						<>
							<span>{formatTime(message.createdAt)}</span>
							{seen && (
								<span className="flex items-center gap-1 text-violet-300">
									<CheckCheck className="size-3" aria-hidden />
									Seen
								</span>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}