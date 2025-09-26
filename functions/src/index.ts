import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import ingestHandler from "./routes/ingest.js";
import signalHandler from "./routes/signal.js";
import reviewHandler from "./routes/review.js";

if (!admin.apps.length) admin.initializeApp();

export const ingest = onRequest({ cors: true }, ingestHandler);
export const signal = onRequest({ cors: true }, signalHandler);
export const review = onRequest({ cors: true }, reviewHandler);