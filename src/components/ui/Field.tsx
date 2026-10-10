import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon: LucideIcon;
	error?: string;
}

export function Field({ label, icon: Icon, error, id, ...props }: FieldProps) {
	const inputId = id ?? props.name;

	return (
		<div className="space-y-1.5">
			<label htmlFor={inputId} className="text-sm text-white/70">
				{label}
			</label>
			<div
				className={`flex items-center gap-2 rounded-2xl border bg-white/5 px-3.5 py-2.5 transition focus-within:border-violet-400/60 ${error ? "border-red-400/60" : "border-white/10"
					}`}
			>
				<Icon className="size-4 shrink-0 text-white/40" aria-hidden />
				<input
					id={inputId}
					aria-invalid={Boolean(error)}
					className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
					{...props}
				/>
			</div>
			{error && <p className="text-xs text-red-300">{error}</p>}
		</div>
	);
}