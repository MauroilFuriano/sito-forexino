"use client";

function temaAttuale(): "dark" | "light" {
  const scelto = document.documentElement.dataset.theme;
  if (scelto === "dark" || scelto === "light") return scelto;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function TemaToggle() {
  function cambia() {
    const nuovo = temaAttuale() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuovo;
    try {
      localStorage.setItem("tema", nuovo);
    } catch {}
  }

  return (
    <button type="button" className="toggle" onClick={cambia} aria-label="Cambia tema chiaro o scuro">
      <svg className="luna" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="sole" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
