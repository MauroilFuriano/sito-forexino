import type { Metadata } from "next";
import Curva from "@/components/Curva";
import { leggiFotografia } from "@/lib/dati";
import { classeSegno, erre, pct } from "@/lib/formato";
import { BACKTEST, REGOLE } from "@/lib/strategia";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Backtest vs realtà" };

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export default async function Backtest() {
  const f = await leggiFotografia();
  const trade = f?.trade ?? [];
  const saltati = f?.saltati ?? [];

  const perRegola = REGOLE.map((r) => {
    const fatti = trade.filter((t) => t.regola === r.nome);
    const erri = fatti.map((t) => t.r).filter((x): x is number => x != null);
    return {
      ...r,
      eseguiti: fatti.length,
      saltati: saltati.filter((s) => s.regola === r.nome).length,
      rMedio: media(erri),
      rTotale: erri.length ? erri.reduce((a, b) => a + b, 0) : null,
    };
  });

  const erriTutti = trade.map((t) => t.r).filter((x): x is number => x != null);
  const curvaR = [0];
  for (const x of erriTutti) curvaR.push(curvaR[curvaR.length - 1] + x);

  const numeri = [
    { label: "Rendimento annuo", valore: "+" + pct(BACKTEST.rendimento_annuo_pct) },
    { label: "Sharpe", valore: BACKTEST.sharpe.toLocaleString("it-IT") },
    { label: "Calo massimo", valore: pct(BACKTEST.calo_massimo_pct) },
    { label: "Volatilità", valore: pct(BACKTEST.volatilita_pct, 0) },
    { label: "Deflated Sharpe", valore: `${BACKTEST.deflated_sharpe.toLocaleString("it-IT")} (N=${BACKTEST.prove_contate})` },
    { label: "Periodo", valore: BACKTEST.periodo },
  ];

  return (
    <>
      <div className="head">
        <div>
          <p className="sub">La demo serve a vedere se dal vivo il bot fa quello che faceva nel backtest</p>
          <h1>Backtest vs realtà</h1>
        </div>
      </div>

      <div className="row">
        {numeri.map((n) => (
          <div className="card" style={{ flex: "1 1 170px", padding: 16, gap: 4 }} key={n.label}>
            <span className="label">{n.label}</span>
            <span className="num mid">{n.valore}</span>
          </div>
        ))}
      </div>
      <p className="note" style={{ marginTop: 0 }}>
        Backtest {BACKTEST.prova}: una simulazione sul passato, non un risultato ottenuto. È la migliore di {BACKTEST.prove_contate}{" "}
        prove contate nel Deflated Sharpe: più prove si fanno, più è facile che la migliore sia stata fortunata.
      </p>

      <section className="card">
        <div className="spread">
          <h2>Demo: risultato cumulato in R</h2>
          <span className="small">
            {erriTutti.length} trade · somma {erre(curvaR[curvaR.length - 1])}
          </span>
        </div>
        <Curva valori={curvaR} etichetta="Risultato cumulato della demo in multipli di rischio" />
      </section>

      <section className="card">
        <h2>Regola per regola</h2>
        <div className="tablebox">
          <table>
            <thead>
              <tr>
                <th>Regola</th>
                <th>Eseguiti</th>
                <th>Saltati</th>
                <th>R medio</th>
                <th>R totale</th>
              </tr>
            </thead>
            <tbody>
              {perRegola.map((r) => (
                <tr key={r.nome}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{r.simbolo}</span> <span className="label">{r.descrizione}</span>
                  </td>
                  <td className="num">{r.eseguiti}</td>
                  <td className="num">{r.saltati}</td>
                  <td className={`num ${classeSegno(r.rMedio)}`}>{erre(r.rMedio)}</td>
                  <td className={`num ${classeSegno(r.rTotale)}`}>{erre(r.rTotale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          R = risultato in multipli dello stop iniziale: +2 R vuol dire guadagnare il doppio di quanto si rischiava. Il
          confronto con le attese del backtest regola per regola arriva quando ci saranno abbastanza trade.
        </p>
      </section>
    </>
  );
}
