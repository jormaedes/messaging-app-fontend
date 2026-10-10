import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { AuthInit } from "@/components/AuthInit";
// ...imports de fontes e globals.css que já lá estão

export const metadata: Metadata = {
  title: "Messaging App",
  description: "Mensagens em tempo real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`h-full antialiased`}>
        <AuthProvider>
          <AuthInit />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}