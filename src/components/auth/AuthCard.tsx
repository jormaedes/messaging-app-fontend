import type { ReactNode } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface AuthCardProps {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
	return (
		<GlassPanel className="w-full max-w-sm p-8 shadow-2xl shadow-black/40">
			<p className="text-2xl font-semibold tracking-tight">Jormaedes</p>
			<h1 className="mt-6 text-lg font-medium">{title}</h1>
			<p className="mt-1 text-sm text-white/50">{subtitle}</p>
			<div className="mt-6">{children}</div>
			<p className="mt-6 text-center text-sm text-white/50">{footer}</p>
		</GlassPanel>
	);
}