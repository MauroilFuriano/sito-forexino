import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articolo, elencoArticoli } from "@/lib/diario";

type Params = { params: Promise<{ slug: string }> };

// Gli articoli esistono solo al momento del build (file nel repo): un indirizzo sconosciuto e' 404
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await elencoArticoli()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = await articolo((await params).slug);
  return a ? { title: a.meta.titolo, description: a.meta.descrizione || undefined } : {};
}

export default async function Articolo({ params }: Params) {
  const a = await articolo((await params).slug);
  if (!a) notFound();
  return (
    <article className="card" style={{ padding: "28px 28px 36px" }}>
      <Link href="/diario" className="small" style={{ textDecoration: "none" }}>
        ← Diario
      </Link>
      <div className="spread" style={{ alignItems: "baseline" }}>
        <h1 style={{ margin: 0, fontSize: 30, letterSpacing: "-0.02em" }}>{a.meta.titolo}</h1>
        <span className="tag">{a.meta.tag}</span>
      </div>
      {a.meta.data && (
        <span className="small num">
          {new Date(a.meta.data).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />
    </article>
  );
}
