import { LoaderCircle } from "lucide-react";

export function FullScreenLoader() {
	return (
		<div className="grid min-h-dvh place-items-center bg-[#09080d]" role="status" aria-label="A carregar">
			<LoaderCircle className="size-6 animate-spin text-violet-300" />
		</div>
	);
}