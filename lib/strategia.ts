// Regole v15 del semestre luglio-dicembre 2026 (config/ultima_markets/intraday_v10.yaml del bot), ora solare italiana.
// Da aggiornare a ogni rinnovo semestrale delle regole, entro il 31/12/2026.
export const VALIDE_FINO = "31/12/2026";

export type Regola = { nome: string; simbolo: string; descrizione: string; entra: string; esce: string; ordine: number };

export const REGOLE: Regola[] = [
  { nome: "F3 long 01-08", simbolo: "Oro", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 0 },
  { nome: "F2 momento 01-10->23 t0.0", simbolo: "Oro", descrizione: "momento 01-10 → 23", entra: "09:00", esce: "22:00", ordine: 1 },
  { nome: "F3 long 01-08", simbolo: "EURUSD", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 2 },
  { nome: "F3 long 01-08", simbolo: "GBPUSD", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 3 },
  { nome: "F3 long 01-08", simbolo: "AUDUSD", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 4 },
  { nome: "F3 long 01-08", simbolo: "NZDUSD", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 5 },
  { nome: "F3 long 01-08", simbolo: "USDJPY", descrizione: "long 01-08", entra: "00:00", esce: "07:00", ordine: 6 },
  { nome: "F3 short 05-10", simbolo: "USDCHF", descrizione: "short 05-10", entra: "04:00", esce: "09:00", ordine: 7 },
  { nome: "F2 ritorno 01-10->12 t0.0", simbolo: "USDCAD", descrizione: "ritorno 01-10 → 12", entra: "09:00", esce: "11:00", ordine: 8 },
];

export const nomeSimbolo = (s: string) => (s === "XAUUSD" ? "Oro" : s);

export const descriviRegola = (nome: string) => REGOLE.find((r) => r.nome === nome)?.descrizione ?? nome;

// Prova P096 del registro (ricerca/registro_prove.csv): oro della v10 + 7 valute principali a memoria lunga
export const BACKTEST = {
  prova: "P096",
  periodo: "03/2018 – 09/2026",
  rendimento_annuo_pct: 17.5,
  sharpe: 1.12,
  calo_massimo_pct: 31.3,
  volatilita_pct: 15,
  deflated_sharpe: 0.87,
  prove_contate: 45,
};

export const LIMITI = [
  { label: "Rischio per trade", valore: "1,0%" },
  { label: "Tetto se serve il lotto minimo", valore: "1,5%" },
  { label: "Rischio aperto totale", valore: "6,0%" },
  { label: "Rischio per valuta", valore: "4,0%" },
  { label: "Perdita del giorno: stop ai nuovi trade", valore: "4,0%" },
  { label: "Calo dal massimo: il bot si ferma", valore: "25%" },
  { label: "Massimo trade aperti", valore: "6" },
];
