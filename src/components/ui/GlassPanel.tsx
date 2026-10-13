import type { ComponentProps } from "react";

export function GlassPanel({ className = "", ...props }: ComponentProps<"div">) {
	return (
		<div
			className={`surface-enter rounded-md border border-[#302a3b] bg-[#100e15] shadow-[0_12px_38px_rgba(0,0,0,0.28)] ${className}`}
			{...props}
		/>
	);
}