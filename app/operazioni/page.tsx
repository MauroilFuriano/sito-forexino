import type { Metadata } from "next";
import { leggiFotografia } from "@/lib/dati";
import { classeSegno, dataOra, erre, segnoDollari } from "@/lib/formato";
import { descriviRegola, nomeSimbolo } from "@/lib/strategia";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Operazioni" };

// Motivi scritti dal motore v10 (motore/intraday.py e broker_mt5.py)
const USCITE: Record<string, string> = { tp: "target", sl: "stop", tempo: "uscita a orario", bot: "chiusa dal bot", altro: "altro" };
const uscita = (motivi: string[]) => motivi.map((m) => USCITE[m] ?? m).join(" + ");

export default async function Operazioni() {
  const f = await leggiFotografia();
  const trade = [...(f?.trade ?? [])].reverse();
  const saltati = [...(f?.saltati ?? [])].reverse();

  return (
    <>
      <div className="head">
        <div>
          <p className="sub">Pubblicati {f?.ritardo_ore ?? 24} ore dopo la chiusura · orari italiani</p>
          <h1>Operazioni</h1>
        </div>
      </div>

      <section className="card">
        <h2>Trade chiusi</h2>
        {trade.length === 0 ? (
          <div className="empty">Ancora nessun trade chiuso da più di 24 ore.</div>
        ) : (
          <div className="tablebox">
            <table>
              <thead>
                <tr>
                  <th>Chiuso</th>
                  <th>Simbolo</th>
                  <th>Regola</th>
                  <th>Lato</th>
                  <th>Uscita</th>
                  <th>Risultato</th>
                  <th>Profitto</th>
                  <th>Slittamento</th>
                </tr>
              </thead>
              <tbody>
                {trade.map((t) => (
                  <tr key={t.trade_id}>
                    <td className="num">{dataOra(t.chiusa)}</td>
                    <td style={{ fontWeight: 600 }}>{nomeSimbolo(t.simbolo)}</td>
                    <td className="label">{descriviRegola(t.regola)}</td>
                    <td>{t.lato === "buy" ? "long" : "short"}</td>
                    <td>{uscita(t.uscite)}</td>
                    <td className={`num ${classeSegno(t.r)}`}>{erre(t.r)}</td>
                    <td className={`num ${classeSegno(t.profitto)}`}>{segnoDollari(t.profitto)}</td>
                    <td className="num">{t.slittamento == null ? "—" : t.slittamento.toPrecision(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Trade saltati</h2>
        <p className="sub">La regola ha dato il segnale ma il bot non è entrato. Dicono quanto i trade fatti.</p>
        {saltati.length === 0 ? (
          <div className="empty">Nessun trade saltato da più di 24 ore.</div>
        ) : (
          <div className="tablebox">
            <table>
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Simbolo</th>
                  <th>Regola</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {saltati.map((s) => (
                  <tr key={s.trade_id}>
                    <td className="num">{dataOra(s.ts)}</td>
                    <td style={{ fontWeight: 600 }}>{nomeSimbolo(s.simbolo)}</td>
                    <td className="label">{descriviRegola(s.regola)}</td>
                    <td>{s.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
