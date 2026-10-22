"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SEZIONI = [
  { href: "/", label: "Pannello" },
  { href: "/operazioni", label: "Operazioni" },
  { href: "/backtest", label: "Backtest vs realtà" },
  { href: "/strategia", label: "Strategia" },
  { href: "/diario", label: "Diario" },
  { href: "/notizie", label: "Notizie" },
];

export default function Nav() {
  const percorso = usePathname();
  return (
    <nav className="nav" aria-label="Sezioni">
      {SEZIONI.map((s) => {
        const attiva = s.href === "/" ? percorso === "/" : percorso.startsWith(s.href);
        return (
          <Link key={s.href} href={s.href} aria-current={attiva ? "page" : undefined}>
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
