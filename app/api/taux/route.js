// Source : API SDMX de la Banque Centrale Européenne (ECB) — gratuite, sans authentification
// Série MIR.M.FR.B.A2C.F.R.A.2250.EUR.N
//   M       = mensuel
//   FR      = France
//   B.A2C   = prêts aux ménages pour achat immobilier
//   F.R     = taux fixe, nouveaux contrats
//   2250    = toutes maturités
const ECB_URL =
  "https://data-api.ecb.europa.eu/service/data/MIR/M.FR.B.A2C.F.R.A.2250.EUR.N" +
  "?lastNObservations=1&format=jsondata";

// Source de secours : BDF (nécessite NEXT_PUBLIC_BDF_API_KEY dans .env.local)
const BDF_URL =
  "https://webstat.banque-france.fr/api/v2.1/data/WEBSTAT_BDF,TC_IM_IMMO_ENS,1.0/" +
  "?lastNObservations=1";

function formatDate(raw) {
  if (!raw) return null;
  // "2026-02" ou "2026-02-28" → "02/2026"
  const match = raw.match(/^(\d{4})-(\d{2})/);
  if (!match) return raw;
  return `${match[2]}/${match[1]}`;
}

// Parse le format SDMX-JSON standard (ECB et BDF utilisent le même standard)
function parseSdmx(data) {
  const root = data.dataSets ? data : data.data; // ECB: racine directe, BDF v2: parfois wrappé
  if (!root?.dataSets?.[0]?.series) return null;

  const seriesKey = Object.keys(root.dataSets[0].series)[0];
  const observations = root.dataSets[0].series[seriesKey].observations;

  // Prendre l'observation avec l'index le plus élevé (la plus récente)
  const obsKeys = Object.keys(observations).sort((a, b) => parseInt(b) - parseInt(a));
  const latestKey = obsKeys[0];
  const taux = observations[latestKey][0];

  if (taux == null) return null;

  // Récupérer la période depuis structure.dimensions.observation TIME_PERIOD
  const timeDim = root.structure?.dimensions?.observation?.find(
    (d) => d.id === "TIME_PERIOD"
  );
  const tp = timeDim?.values?.[parseInt(latestKey)];
  const date = tp?.end ?? tp?.id ?? tp?.name ?? null;

  return { taux, date };
}

async function fetchEcb() {
  const res = await fetch(ECB_URL, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`ECB ${res.status}`);
  const data = await res.json();
  const parsed = parseSdmx(data);
  if (!parsed) throw new Error("Format ECB inattendu");
  return { ...parsed, source: "ECB" };
}

async function fetchBdf() {
  const key = process.env.NEXT_PUBLIC_BDF_API_KEY;
  if (!key) throw new Error("Clé BDF absente");
  const res = await fetch(BDF_URL, {
    headers: { Accept: "application/json", Authorization: `Bearer ${key}` },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`BDF ${res.status}`);
  const data = await res.json();
  const parsed = parseSdmx(data);
  if (!parsed) throw new Error("Format BDF inattendu");
  return { ...parsed, source: "BDF" };
}

export async function GET() {
  // 1. Essai ECB (sans authentification)
  try {
    const result = await fetchEcb();
    return Response.json({ taux: result.taux, date: formatDate(result.date), source: result.source });
  } catch (ecbErr) {
    // 2. Fallback BDF (si clé configurée dans .env.local)
    try {
      const result = await fetchBdf();
      return Response.json({ taux: result.taux, date: formatDate(result.date), source: result.source });
    } catch {
      return Response.json(
        { error: "Taux temporairement indisponible", detail: ecbErr.message },
        { status: 503 }
      );
    }
  }
}
