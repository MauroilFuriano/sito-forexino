import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/Nav";
import TemaToggle from "@/components/TemaToggle";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Bot Forex v15", template: "%s · Bot Forex v15" },
  description: "Il bot di trading forex v15 dal vivo su conto demo: operazioni, backtest, strategia, diario e notizie.",
};

// Applica il tema salvato prima del primo disegno, cosi' la pagina non lampeggia
const temaIniziale = `try{var t=localStorage.getItem("tema");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaIniziale }} />
      </head>
      <body>
        <header className="topbar">
          <div className="wrap">
            <Link href="/" className="brand">
              <span className="logo">FX</span>
              <span className="brand-name">Bot Forex v15</span>
              <span className="chip">DEMO</span>
            </Link>
            <div className="right">
              <Nav />
              <TemaToggle />
            </div>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="wrap">
          Conto demo, soldi virtuali. I trade compaiono 24 ore dopo la chiusura. I CFD sono strumenti complessi e
          comportano un alto rischio di perdere denaro rapidamente a causa della leva: la maggior parte dei piccoli
          investitori perde denaro. Niente su questo sito è un consiglio di investimento.
        </footer>
      </body>
    </html>
  );
}
