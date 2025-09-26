import * as admin from "firebase-admin";
import {
  fetchNewsCoverage, fetchGdelt, factCheckSearch,
  waybackAvailability, safeBrowsingLookup, searchYouTube
} from "../lib/apiclients.js";
import { computeScore } from "../lib/scoring.js";

const db = admin.firestore();

export async function enqueueEnrich(itemId: string, priority: "low"|"normal"|"high" = "normal") {
  // Minimal: run inline. For scale, use Cloud Tasks.
  return enrich(itemId);
}

export async function enrich(itemId: string) {
  const itemRef = db.collection("items").doc(itemId);
  const snap = await itemRef.get();
  if (!snap.exists) return;
  const item = snap.data()!;

  // 1) Wayback
  const way = await waybackAvailability(item.canonicalUrl);
  const archive = way?.archived_snapshots?.closest?.url || null;

  // 2) Safe Browsing
  const sb = await safeBrowsingLookup([item.canonicalUrl]);
  const safe = !sb || sb.length === 0;

  // 3) News coverage + GDELT
  const title = item.title || item.canonicalUrl;
  const articles = await fetchNewsCoverage(title);
  const gd = await fetchGdelt(title);

  // 4) Fact checks
  const claims = await factCheckSearch(title);

  // 5) Light “corroboration” surface
  const outlets = (articles || []).map((a:any)=>a.source?.name).filter(Boolean);
  const corroboration = {
    outlets: Array.from(new Set(outlets)),
    factChecks: (claims || []).map((c:any)=>({
      text: c.text,
      publisher: c.claimReview?.[0]?.publisher?.name,
      url: c.claimReview?.[0]?.url
    }))
  };

  const evidence = {
    provenance: { archive, safe, canonical: true, authorVerified: !!item.author },
    corroboration,
    integrity: { noEdits: true, metadataClean: true, licensingClear: !!item.licensing },
    context: { metaAnalyses: false, scholarSupport: false }
  };

  const scoreObj = computeScore(evidence);
  const scoreRef = db.collection("scores").doc();
  await scoreRef.set({ id: scoreRef.id, itemId, ...scoreObj, createdAt: new Date().toISOString() });

  await itemRef.update({
    scoreId: scoreRef.id,
    archives: archive ? [{ provider: "wayback", url: archive, snapshotAt: new Date().toISOString() }] : [],
    safeBrowsing: { clean: safe },
    status: "scored"
  });

  return true;
}