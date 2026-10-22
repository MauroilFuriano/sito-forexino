import { Redis } from "@upstash/redis";

export const CHIAVE_FOTOGRAFIA = "fotografia";

export type Trade = {
  trade_id: string;
  simbolo: string;
  regola: string;
  lato: "buy" | "sell";
  aperta: string;
  chiusa: string;
  lotti: number;
  rischio_pct: number | null;
  profitto: number;
  r: number | null;
  slittamento: number | null;
  uscite: string[];
};

export type Saltato = { trade_id: string; simbolo: string; regola: string; giorno: string; motivo: string; ts: string };

export type Fotografia = {
  schema: number;
  generata: string;
  ritardo_ore: number;
  conto: {
    ts: number | null;
    stato: "ATTIVO" | "PAUSA" | "HALT" | null;
    connesso: boolean | null;
    equity: number | null;
    pnl: { giorno?: number; settimana?: number; mese?: number; drawdown_pct?: number };
    rischio: { aperto_pct?: number; limite_aperto_pct?: number; perdita_oggi_pct?: number; limite_giorno_pct?: number };
    posizioni_aperte: number;
  };
  trade: Trade[];
  saltati: Saltato[];
};

// Vercel antepone al nome il prefisso scelto all'installazione (es. kv_KV_REST_API_URL): si cerca per suffisso
function variabile(suffisso: string): string | undefined {
  const nome = Object.keys(process.env).find((k) => k.toUpperCase().endsWith(suffisso) && !k.toUpperCase().includes("READ_ONLY"));
  return nome ? process.env[nome] : undefined;
}

export function redis(): Redis | null {
  const url = variabile("REST_API_URL") ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = variabile("REST_API_TOKEN") ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export async function leggiFotografia(): Promise<Fotografia | null> {
  const db = redis();
  if (!db) return null;
  try {
    return (await db.get<Fotografia>(CHIAVE_FOTOGRAFIA)) ?? null;
  } catch {
    return null;
  }
}

export function valida(corpo: unknown): corpo is Fotografia {
  if (!corpo || typeof corpo !== "object") return false;
  const f = corpo as Record<string, unknown>;
  return f.schema === 1 && typeof f.conto === "object" && f.conto !== null && Array.isArray(f.trade) && Array.isArray(f.saltati);
}
