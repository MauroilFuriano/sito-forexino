import type { Metadata } from "next";
import { LIMITI, REGOLE, VALIDE_FINO } from "@/lib/strategia";

export const metadata: Metadata = { title: "Strategia" };

export default function Strategia() {
  return (
    <>
      <div className="head">
        <div>
          <p className="sub">Versione 10 · regole valide fino al {VALIDE_FINO}</p>
          <h1>Come lavora il bot</h1>
        </div>
      </div>

      <div className="row">
        <section className="card grow2" style={{ gap: 14 }}>
          <h2>In breve</h2>
          <p style={{ margin: 0 }}>
            Nove regole intraday a orario fisso: due sull&apos;oro e una per ognuna delle 7 valute più scambiate (EURUSD, USDJPY, GBPUSD, AUDUSD, USDCAD, USDCHF, NZDUSD). Ogni sei mesi le regole si scelgono di nuovo con i soli dati passati: per l&apos;oro sugli ultimi 3 anni, per le valute su tutta la storia, senza escludere nessuna coppia.
          </p>
          <p style={{ margin: 0 }}>
            Un trade parte solo se la regola dà il segnale e passa i filtri: tendenza degli ultimi 100 giorni e costo
            piccolo rispetto allo stop. Molti giorni una regola non entra.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Uscite.</strong> Oro: metà posizione a +1R, metà a +2R, e dopo il primo target lo stop va a
            pareggio. Valute: nessun target, escono allo stop o all&apos;orario della regola. In ogni caso, all&apos;orario di uscita la posizione si chiude. Stop e target
            stanno sul server del broker: proteggono anche se il PC si spegne.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Cosa non fa.</strong> Niente martingala, griglie o medie sulle perdite. Quando non sa cosa possiede
            si ferma, e la ripartenza la decide una persona. Telegram e questo sito guardano soltanto: non aprono trade e
            non aumentano il rischio.
          </p>
        </section>
        <section className="card grow1" style={{ gap: 6 }}>
          <h2>Limiti di rischio</h2>
          {LIMITI.map((l) => (
            <div className="rule" key={l.label} style={{ justifyContent: "space-between" }}>
              <span>{l.label}</span>
              <span className="t">{l.valore}</span>
            </div>
          ))}
        </section>
      </div>

      <section className="card">
        <h2>Le regole · ora italiana</h2>
        <div className="tablebox">
          <table>
            <thead>
              <tr>
                <th>Simbolo</th>
                <th>Regola</th>
                <th>Entra</th>
                <th>Esce al più tardi</th>
              </tr>
            </thead>
            <tbody>
              {REGOLE.map((r) => (
                <tr key={`${r.simbolo}-${r.nome}`}>
                  <td style={{ fontWeight: 600 }}>{r.simbolo}</td>
                  <td>{r.descrizione}</td>
                  <td className="num">{r.entra}</td>
                  <td className="num">{r.esce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          Con un conto da 1.000 USD lo stop dell&apos;oro spesso vale più del rischio ammesso anche al lotto minimo: in
          quei giorni il trade sull&apos;oro viene saltato, e lo trovi tra i saltati in Operazioni.
        </p>
      </section>
    </>
  );
}
