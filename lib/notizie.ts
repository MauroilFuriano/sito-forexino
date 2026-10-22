// Fonti gratuite verificate il 22/10/2026. Il calendario di Forex Factory non e' un'API ufficiale: puo' cambiare.
const CALENDARIO = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const FEED = [
  { fonte: "FXStreet", url: "https://www.fxstreet.com/rss/news" },
  { fonte: "BCE", url: "https://www.ecb.europa.eu/rss/press.html" },
  { fonte: "Federal Reserve", url: "https://www.federalreserve.gov/feeds/press_all.xml" },
];
// Valute che contano per le regole del bot (oro in USD, EURJPY, GBPJPY, USDCAD, USDCHF)
const VALUTE = new Set(["USD", "EUR", "JPY", "GBP", "CAD", "CHF"]);
const AGGIORNA_S = 900;

export type Evento = { titolo: string; valuta: string; data: string; impatto: "High" | "Medium"; previsto: string; precedente: string };
export type Titolo = { titolo: string; link: string; data: string | null; fonte: string };

export async function calendario(): Promise<Evento[] | null> {
  try {
    const r = await fetch(CALENDARIO, { next: { revalidate: 3600 }, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return null;
    const eventi = (await r.json()) as { title: string; country: string; date: string; impact: string; forecast: string; previous: string }[];
    return eventi
      .filter((e) => VALUTE.has(e.country) && (e.impact === "High" || e.impact === "Medium"))
      .map((e) => ({ titolo: e.title, valuta: e.country, data: e.date, impatto: e.impact as Evento["impatto"], previsto: e.forecast, precedente: e.previous }));
  } catch {
    return null;
  }
}

const ENTITA: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" };
const pulisci = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(amp|lt|gt|quot|apos|#39);/g, (m) => ENTITA[m] ?? m).trim();
const campo = (item: string, nome: string) => {
  const m = item.match(new RegExp(`<${nome}[^>]*>([\\s\\S]*?)</${nome}>`));
  return m ? pulisci(m[1]) : "";
};

async function leggiFeed(fonte: string, url: string): Promise<Titolo[]> {
  try {
    const r = await fetch(url, { next: { revalidate: AGGIORNA_S }, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return [];
    const xml = await r.text();
    return [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)].slice(0, 15).flatMap(([item]) => {
      const titolo = campo(item, "title");
      const link = campo(item, "link");
      if (!titolo || !/^https?:\/\//.test(link)) return [];
      const d = campo(item, "pubDate");
      return [{ titolo, link, data: d && !isNaN(Date.parse(d)) ? new Date(d).toISOString() : null, fonte }];
    });
  } catch {
    return [];
  }
}

export async function titoli(): Promise<Titolo[]> {
  const tutti = (await Promise.all(FEED.map((f) => leggiFeed(f.fonte, f.url)))).flat();
  return tutti.sort((a, b) => (b.data ?? "").localeCompare(a.data ?? "")).slice(0, 30);
}
