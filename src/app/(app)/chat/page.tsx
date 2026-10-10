"use client";

import { useAuthStore } from "@/stores/auth";

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="p-6">
      <p>Hello, {user?.username}</p>
      <button onClick={logout} className="mt-2 text-sm text-violet-300 underline">
        Log out
      </button>
    </div>
  );
}