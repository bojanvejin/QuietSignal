import type { Request, Response } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();

export default async function signalHandler(req: Request, res: Response) {
  try {
    const { id, itemUrl } = req.query as { id?: string; itemUrl?: string };
    if (!id && !itemUrl) return res.status(400).send({ error: "id_or_itemUrl_required" });

    let docSnap;
    if (id) {
      docSnap = await db.collection("items").doc(id).get();
    } else {
      const q = await db.collection("items").where("canonicalUrl", "==", itemUrl).limit(1).get();
      docSnap = q.docs[0];
    }
    if (!docSnap || !docSnap.exists) return res.status(404).send({ error: "not_found" });

    const item = docSnap.data()!;
    const score = item.scoreId ? (await db.collection("scores").doc(item.scoreId).get()).data() : null;
    const claims = item.claimIds?.length ? (await Promise.all(item.claimIds.map((cid:string)=>db.collection("claims").doc(cid).get()))).map(s=>s.data()) : [];

    const card = {
      itemId: item.id,
      title: item.title ?? "",
      url: item.canonicalUrl,
      score: score?.total ?? null,
      breakdown: score ? {
        provenance: score.provenance,
        corroboration: score.corroboration,
        integrity: score.integrity,
        context: score.context
      } : null,
      claims: claims ?? [],
      archives: item.archives ?? [],
      factChecks: (claims||[]).flatMap((c:any)=>c.factChecks||[]),
      embeddableHtml: item.embeddableHtml ?? null
    };

    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).send(card);
  } catch (e:any) {
    console.error(e);
    res.status(500).send({ error: "signal_failed", detail: e.message });
  }
}