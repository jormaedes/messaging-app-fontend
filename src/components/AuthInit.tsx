"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

// Restaura a sessão uma vez, quando a app abre
export function AuthInit() {
	useEffect(() => {
		void useAuthStore.getState().init();
	}, []);
	return null;
}