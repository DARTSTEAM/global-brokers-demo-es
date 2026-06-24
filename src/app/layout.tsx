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
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Ir al contenido</a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
