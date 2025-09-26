import type { Request, Response } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();

export default async function reviewHandler(req: Request, res: Response) {
  try {
    if (req.method !== "POST") return res.status(405).send({ error: "POST only" });
    // In production, verify Firebase Auth & role=reviewer
    const { itemId, finalVerdict, notes } = req.body || {};
    if (!itemId || !finalVerdict) return res.status(400).send({ error: "missing_fields" });

    const reviewRef = db.collection("reviews").doc();
    await reviewRef.set({
      id: reviewRef.id,
      itemId,
      reviewerUid: "todo-auth",
      finalVerdict,
      notes: notes ?? "",
      publishedAt: new Date().toISOString()
    });

    await db.collection("items").doc(itemId).update({ status: "reviewed" });
    res.status(200).send({ reviewId: reviewRef.id });
  } catch (e:any) {
    console.error(e);
    res.status(500).send({ error: "review_failed", detail: e.message });
  }
}