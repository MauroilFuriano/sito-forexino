import { createHash, timingSafeEqual } from "node:crypto";
import { CHIAVE_FOTOGRAFIA, redis, valida } from "@/lib/dati";

export const runtime = "nodejs";

const MAX_BYTE = 900_000;

// Solo il pubblicatore del bot scrive: confronta l'impronta della chiave ricevuta con PUBBLICA_HASH
function autorizzato(req: Request): boolean {
  const atteso = Buffer.from(process.env.PUBBLICA_HASH ?? "", "hex");
  const chiave = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (atteso.length !== 32 || !chiave) return false;
  return timingSafeEqual(createHash("sha256").update(chiave).digest(), atteso);
}

export async function POST(req: Request) {
  if (!autorizzato(req)) return Response.json({ errore: "non autorizzato" }, { status: 401 });
  const db = redis();
  if (!db) return Response.json({ errore: "storage non configurato" }, { status: 503 });

  const testo = await req.text();
  if (testo.length > MAX_BYTE) return Response.json({ errore: "troppo grande" }, { status: 413 });
  let corpo: unknown;
  try {
    corpo = JSON.parse(testo);
  } catch {
    return Response.json({ errore: "JSON non valido" }, { status: 400 });
  }
  if (!valida(corpo)) return Response.json({ errore: "formato non riconosciuto" }, { status: 400 });

  await db.set(CHIAVE_FOTOGRAFIA, corpo);
  return Response.json({ ok: true });
}
