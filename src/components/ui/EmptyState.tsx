import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
			<div className="grid size-12 place-items-center rounded-md border border-[#302a3b] bg-[#191620]">
				<Icon className="size-5 text-violet-300" aria-hidden />
			</div>
			<div>
				<p className="font-medium">{title}</p>
				<p className="mt-1 max-w-xs text-sm text-[#a79fb2]">{description}</p>
			</div>
			{action}
		</div>
	);
}