"use client";

import { useState } from "react";

interface AvatarProps {
	name: string;
	src?: string | null;
	online?: boolean;
	size?: "sm" | "md";
}

export function Avatar({ name, src, online, size = "md" }: AvatarProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const showImage = Boolean(src) && src !== failedSrc;
	const dimensions = size === "sm" ? "size-9 text-xs" : "size-11 text-sm";

	return (
		<div className="relative shrink-0">
			{showImage ? (
				// <img> normal de propósito: o utilizador pode colar qualquer domínio
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={src!}
					alt=""
					onError={() => setFailedSrc(src ?? null)}
					className={`${dimensions} rounded-full object-cover`}
				/>
			) : (
				<div
					className={`${dimensions} grid place-items-center rounded-full bg-[#30243f] font-semibold uppercase text-[#d6c4ff]`}
					aria-hidden
				>
					{name.slice(0, 2)}
				</div>
			)}
			{online && (
				<span
					className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#100e15] bg-violet-400"
					aria-label="Disponível"
				/>
			)}
		</div>
	);
}