"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { SocketConnector } from "@/components/SocketConnector";
import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") return <FullScreenLoader />;

  return (
    <div className="flex h-dvh flex-col">
      <SocketConnector />
      <AppHeader />
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}