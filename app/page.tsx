import Link from "next/link";
import Curva from "@/components/Curva";
import { leggiFotografia } from "@/lib/dati";
import { classeSegno, dollari, eta, pct, segnoDollari } from "@/lib/formato";
import { BACKTEST, REGOLE } from "@/lib/strategia";

export const dynamic = "force-dynamic";

const DEPOSITO = 1000;
const MAX_ETA_S = 300;

export default async function Pannello() {
  const f = await leggiFotografia();
  const c = f?.conto;
  const vivo = c?.ts != null && Date.now() / 1000 - c.ts < MAX_ETA_S;
  const statoTesto = !c ? "In attesa" : !vivo ? "Nessun segnale" : c.stato === "ATTIVO" ? "Attivo" : c.stato === "PAUSA" ? "In pausa" : "Fermo (HALT)";
  const curva = [DEPOSITO];
  for (const t of f?.trade ?? []) curva.push(curva[curva.length - 1] + t.profitto);

  return (
    <>
      <div className="head">
        <div>
          <p className="sub">Oro + valute intraday · conto hedge · demo</p>
          <h1>Come sta andando il bot</h1>
        </div>
        <div className="status">
          <span className={`dot ${vivo && c?.stato === "ATTIVO" ? "" : "off"}`} />
          <span style={{ fontWeight: 600 }}>{statoTesto}</span>
          <span className="small num">{eta(c?.ts)}</span>
        </div>
      </div>

      {!f && <div className="empty">Il bot non ha ancora spedito dati al sito.</div>}

      <div className="row">
        <div className="card grow2">
          <div className="spread">
            <div>
              <div className="label">Equity</div>
              <div className="num big">{dollari(c?.equity)}</div>
            </div>
            <span className="small">curva: saldo dai trade chiusi pubblicati</span>
          </div>
          <Curva valori={curva} etichetta="Saldo del conto demo dai trade chiusi" />
        </div>
        <div className="stack grow1">
          <div className="card kpi">
            <div>
              <div className="label">Oggi</div>
              <div className={`num mid ${classeSegno(c?.pnl.giorno)}`}>{segnoDollari(c?.pnl.giorno)}</div>
            </div>
            <span className="small" style={{ textAlign: "right" }}>
              settimana {segnoDollari(c?.pnl.settimana)}
              <br />
              mese {segnoDollari(c?.pnl.mese)}
            </span>
          </div>
          <div className="card kpi">
            <div>
              <div className="label">Drawdown</div>
              <div className="num mid">{pct(c?.pnl.drawdown_pct)}</div>
            </div>
            <span className="small">max backtest {pct(BACKTEST.calo_massimo_pct)}</span>
          </div>
          <div className="card kpi">
            <div>
              <div className="label">Rischio aperto</div>
              <div className="num mid">{pct(c?.rischio.aperto_pct)}</div>
            </div>
            <span className="small">
              limite {pct(c?.rischio.limite_aperto_pct)} · {c?.posizioni_aperte ?? 0} posizioni
            </span>
          </div>
          <div className="card kpi">
            <div>
              <div className="label">Perdita di oggi</div>
              <div className="num mid">{pct(c?.rischio.perdita_oggi_pct)}</div>
            </div>
            <span className="small">limite {pct(c?.rischio.limite_giorno_pct)}</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="card grow2" style={{ gap: 6 }}>
          <h2>Orari degli ingressi · ora italiana</h2>
          {[...REGOLE].sort((a, b) => a.entra.localeCompare(b.entra)).map((r) => (
            <div className="rule" key={r.nome}>
              <span className="t">{r.entra}</span>
              <span className="s">{r.simbolo}</span>
              <span className="label">
                {r.descrizione} · esce al più tardi {r.esce}
              </span>
            </div>
          ))}
        </div>
        <div className="card grow1 hero">
          <span className="label">
            Backtest {BACKTEST.prova} · {BACKTEST.periodo}
          </span>
          <span className="num big">
            +{pct(BACKTEST.rendimento_annuo_pct)}
            <span className="label" style={{ fontSize: 16 }}> l&apos;anno, simulato</span>
          </span>
          <div className="facts">
            <div>
              <span className="small">Sharpe</span>
              <span className="num">{BACKTEST.sharpe.toLocaleString("it-IT")}</span>
            </div>
            <div>
              <span className="small">Calo massimo</span>
              <span className="num">{pct(BACKTEST.calo_massimo_pct)}</span>
            </div>
            <div>
              <span className="small">Deflated Sharpe</span>
              <span className="num">{BACKTEST.deflated_sharpe.toLocaleString("it-IT")}</span>
            </div>
          </div>
          <Link href="/backtest">Confronta con la demo →</Link>
        </div>
      </div>
    </>
  );
}
