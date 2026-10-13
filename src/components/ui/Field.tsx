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
			<label htmlFor={inputId} className="text-sm font-medium text-[#d2cbdc]">
				{label}
			</label>
			<div
				className={`flex items-center gap-2 rounded-md border bg-[#17141d] px-3.5 py-2.5 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/10 ${error ? "border-red-400/70" : "border-[#302a3b]"
					}`}
			>
				<Icon className="size-4 shrink-0 text-[#8e849e]" aria-hidden />
				<input
					id={inputId}
					aria-invalid={Boolean(error)}
					className="w-full bg-transparent text-sm text-[#f4f1fa] outline-none placeholder:text-[#756d80]"
					{...props}
				/>
			</div>
			{error && <p className="text-xs text-red-400">{error}</p>}
		</div>
	);
}