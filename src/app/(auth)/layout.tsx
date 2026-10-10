"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";

export default function AuthLayout({ children }: { children: ReactNode }) {
	const status = useAuthStore((s) => s.status);
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") router.replace("/chat");
	}, [status, router]);

	// Enquanto não sabemos (ou já estamos a redirecionar), não mostrar o formulário
	// if (status !== "unauthenticated") return <FullScreenLoader />;

	return (
		<main className="grid min-h-dvh place-items-center p-4">
			{children}
		</main>
	);
}