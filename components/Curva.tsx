type Props = { valori: number[]; altezza?: number; etichetta: string };

export default function Curva({ valori, altezza = 220, etichetta }: Props) {
  if (valori.length < 2) {
    return <div className="empty">La curva compare dopo i primi trade chiusi.</div>;
  }
  const min = Math.min(...valori);
  const max = Math.max(...valori);
  const ampiezza = max - min || 1;
  const punti = valori
    .map((v, i) => `${((i / (valori.length - 1)) * 1000).toFixed(1)},${(altezza - 12 - ((v - min) / ampiezza) * (altezza - 30)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 1000 ${altezza}`} preserveAspectRatio="none" style={{ width: "100%", height: altezza }} role="img" aria-label={etichetta}>
      <polygon points={`0,${altezza} ${punti} 1000,${altezza}`} fill="var(--area)" />
      <polyline points={punti} fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
