import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "Barbearia Dreamer | Seu Estilo, Nosso Arte",
  description:
    "Barbearia premium com agendamento online, servicos de corte, barba e muito mais. Seu estilo, nossa arte.",
  keywords:
    "Barbearia, Corte de Cabelo, Barba, Agendamento, Barbearia Dreamer, Corte Masculino",
  openGraph: {
    title: "Barbearia Dreamer",
    description: "Seu Estilo, Nosso Arte",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-black text-white">
        {children}
      </body>
    </html>
  );
}
