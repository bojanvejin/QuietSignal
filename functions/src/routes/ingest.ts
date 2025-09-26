import type { Request, Response } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { enqueueEnrich } from "../workers/enrichWorker.js";

const db = admin.firestore();

export default async function ingestHandler(req: Request, res: Response) {
  try {
    if (req.method !== "POST") return res.status(405).send({ error: "POST only" });
    const { url, source = "url", priority = "normal" } = req.body || {};
    if (!url) return res.status(400).send({ error: "missing url" });

    const now = new Date().toISOString();
    const itemRef = db.collection("items").doc();
    await itemRef.set({
      id: itemRef.id,
      type: inferTypeFromUrl(url),
      canonicalUrl: url,
      source,
      firstSeenAt: now,
      status: "pending"
    });

    await enqueueEnrich(itemRef.id, priority);
    res.status(202).send({ itemId: itemRef.id, status: "accepted" });
  } catch (e:any) {
    console.error(e);
    res.status(500).send({ error: "ingest_failed", detail: e.message });
  }
}

function inferTypeFromUrl(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("reddit.com")) return "post";
  return "article";
}