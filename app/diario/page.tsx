import type { Metadata } from "next";
import Link from "next/link";
import { elencoArticoli } from "@/lib/diario";

export const metadata: Metadata = { title: "Diario" };

const dataBreve = (d: string) => (d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }) : "");

export default async function Diario() {
  const articoli = await elencoArticoli();
  return (
    <>
      <div className="head">
        <div>
          <p className="sub">Studi, appunti e ragionamenti sul bot</p>
          <h1>Diario</h1>
        </div>
      </div>
      <section className="card" style={{ gap: 0 }}>
        {articoli.length === 0 ? (
          <div className="empty">Ancora nessun articolo.</div>
        ) : (
          articoli.map((a) => (
            <div className="post" key={a.slug}>
              <span className="small num" style={{ minWidth: 96 }}>{dataBreve(a.data)}</span>
              <span className="tag">{a.tag}</span>
              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column" }}>
                <Link href={`/diario/${a.slug}`}>{a.titolo}</Link>
                {a.descrizione && <span className="label">{a.descrizione}</span>}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
