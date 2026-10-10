import type { ComponentProps } from "react";

export function GlassPanel({ className = "", ...props }: ComponentProps<"div">) {
	return (
		<div
			className={`rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}
			{...props}
		/>
	);
}