import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Brokers | Portal de Seguimiento de Pedidos",
  description: "Portal premium de seguimiento y gestión de pedidos para las operaciones de comercio textil de Global Brokers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
