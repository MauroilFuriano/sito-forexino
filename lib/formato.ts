const ZONA = "Europe/Rome";

export const dollari = (v: number | null | undefined) =>
  v == null ? "—" : v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";

export const segnoDollari = (v: number | null | undefined) => (v == null ? "—" : (v > 0 ? "+" : "") + dollari(v));

export const pct = (v: number | null | undefined, cifre = 1) =>
  v == null ? "—" : v.toLocaleString("it-IT", { minimumFractionDigits: cifre, maximumFractionDigits: cifre }) + "%";

export const erre = (v: number | null | undefined) =>
  v == null ? "—" : (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " R";

export const classeSegno = (v: number | null | undefined) => (v == null || v === 0 ? "" : v > 0 ? "gain" : "loss");

export const dataOra = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { timeZone: ZONA, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export const data = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { timeZone: ZONA, day: "2-digit", month: "2-digit", year: "numeric" });

export function eta(tsSecondi: number | null | undefined): string {
  if (!tsSecondi) return "mai";
  const s = Math.max(0, Math.round(Date.now() / 1000 - tsSecondi));
  if (s < 90) return `${s} s fa`;
  if (s < 5400) return `${Math.round(s / 60)} min fa`;
  return `${Math.round(s / 3600)} h fa`;
}
