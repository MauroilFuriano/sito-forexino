import type { Metadata } from "next";
import { calendario, titoli } from "@/lib/notizie";

export const revalidate = 900;
export const metadata: Metadata = { title: "Notizie" };

const ZONA = "Europe/Rome";
const giornoOra = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { timeZone: ZONA, weekday: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const quanto = (iso: string | null) => {
  if (!iso) return "";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (min < 60) return `${Math.max(min, 1)} min fa`;
  if (min < 48 * 60) return `${Math.round(min / 60)} h fa`;
  return new Date(iso).toLocaleDateString("it-IT", { timeZone: ZONA, day: "2-digit", month: "2-digit" });
};

export default async function Notizie() {
  const [eventi, notizie] = await Promise.all([calendario(), titoli()]);
  const adesso = Date.now();
  const prossimi = eventi?.filter((e) => Date.parse(e.data) > adesso - 2 * 3600_000) ?? null;

  return (
    <>
      <div className="head">
        <div>
          <p className="sub">Calendario economico e titoli, con il link alla fonte · ora italiana</p>
          <h1>Notizie</h1>
        </div>
      </div>

      <div className="card" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", padding: "14px 18px" }}>
        <strong>Freno notizie del bot</strong>
        <span className="chip">non collegato: va in prova &quot;in ombra&quot; dopo la demo</span>
      </div>

      <div className="row">
        <section className="card grow1" style={{ flex: "1 1 460px", gap: 0 }}>
          <h2 style={{ marginBottom: 10 }}>Calendario della settimana</h2>
          {prossimi === null ? (
            <div className="empty">Calendario non disponibile in questo momento.</div>
          ) : prossimi.length === 0 ? (
            <div className="empty">Nessun evento importante nei prossimi giorni.</div>
          ) : (
            prossimi.map((e, i) => (
              <div className="ev" key={`${e.data}-${e.valuta}-${i}`}>
                <span className="when">{giornoOra(e.data)}</span>
                <span className="cur">{e.valuta}</span>
                <span className="what">
                  {e.titolo}
                  {(e.previsto || e.precedente) && (
                    <span className="small">
                      {" "}
                      · previsto {e.previsto || "—"} · prima {e.precedente || "—"}
                    </span>
                  )}
                </span>
                <span className={`imp ${e.impatto}`}>{e.impatto === "High" ? "ALTO" : "MEDIO"}</span>
              </div>
            ))
          )}
          <p className="note">Fonte: Forex Factory.</p>
        </section>

        <section className="card grow1" style={{ flex: "1 1 460px", gap: 0 }}>
          <h2 style={{ marginBottom: 10 }}>Titoli</h2>
          {notizie.length === 0 ? (
            <div className="empty">Nessun titolo disponibile in questo momento.</div>
          ) : (
            notizie.map((n) => (
              <div className="news" key={n.link}>
                <a href={n.link} target="_blank" rel="noopener noreferrer">
                  {n.titolo}
                </a>
                <span className="small">
                  {n.fonte}
                  {n.data ? ` · ${quanto(n.data)}` : ""}
                </span>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
