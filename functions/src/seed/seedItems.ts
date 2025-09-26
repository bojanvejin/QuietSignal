import * as admin from "firebase-admin";
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

async function run(){
  const demo = [
    { url: "https://example.com/article-1", title: "Demo Headline One" },
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Demo Video" }
  ];
  for (const d of demo){
    const ref = db.collection("items").doc();
    await ref.set({ id: ref.id, canonicalUrl: d.url, title: d.title, firstSeenAt: new Date().toISOString(), status: "pending" });
    console.log("Seeded", ref.id);
  }
  process.exit(0);
}
run();