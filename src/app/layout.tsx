import "../styles/global.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import Dashboard from "./components/dashboard";
import Provider from "./provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerenciador de Estoque",
  description: "Aplicação que gerencia estoque via tarefas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
