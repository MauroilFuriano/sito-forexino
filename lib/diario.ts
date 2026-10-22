import { promises as fs } from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Gli articoli sono file .md in /diario; quelli che iniziano con "_" non si pubblicano (modelli, bozze)
const CARTELLA = path.join(process.cwd(), "diario");

export type Articolo = { slug: string; titolo: string; data: string; tag: string; descrizione: string; corpo: string };

function leggiIntestazione(testo: string): { campi: Record<string, string>; corpo: string } {
  const m = testo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { campi: {}, corpo: testo };
  const campi: Record<string, string> = {};
  for (const riga of m[1].split(/\r?\n/)) {
    const i = riga.indexOf(":");
    if (i > 0) campi[riga.slice(0, i).trim()] = riga.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { campi, corpo: m[2] };
}

async function leggi(file: string): Promise<Articolo> {
  const { campi, corpo } = leggiIntestazione(await fs.readFile(path.join(CARTELLA, file), "utf-8"));
  const slug = file.replace(/\.md$/, "");
  return {
    slug,
    titolo: campi.titolo ?? slug,
    data: campi.data ?? "",
    tag: campi.tag ?? "studio",
    descrizione: campi.descrizione ?? "",
    corpo,
  };
}

export async function elencoArticoli(): Promise<Articolo[]> {
  let file: string[] = [];
  try {
    file = (await fs.readdir(CARTELLA)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
  const articoli = await Promise.all(file.map(leggi));
  return articoli.sort((a, b) => b.data.localeCompare(a.data));
}

export async function articolo(slug: string): Promise<{ meta: Articolo; html: string } | null> {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  try {
    const meta = await leggi(`${slug}.md`);
    return { meta, html: await marked.parse(meta.corpo) };
  } catch {
    return null;
  }
}
