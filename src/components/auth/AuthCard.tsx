import type { ReactNode } from "react";

interface AuthCardProps {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
	return (
		<div className="w-full">
			<h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
			<p className="mt-2 text-sm leading-6 text-[#aaa3b8]">{subtitle}</p>
			<div className="mt-6">{children}</div>
			<p className="mt-6 text-center text-sm text-[#aaa3b8]">{footer}</p>
		</div>
	);
}