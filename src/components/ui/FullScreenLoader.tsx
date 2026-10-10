import { LoaderCircle } from "lucide-react";

export function FullScreenLoader() {
	return (
		<div className="grid min-h-dvh place-items-center" role="status" aria-label="Loading">
			<LoaderCircle className="size-6 animate-spin text-white/50" />
		</div>
	);
}