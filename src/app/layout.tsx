import type { Metadata } from "next";
import { AuthInit } from "@/components/AuthInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jormaedes | Mensagens",
  description: "Mensagens em tempo real com as pessoas de quem gostas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className={`h-full antialiased`}>
        <AuthInit />
          {children}
      </body>
    </html>
  );
}