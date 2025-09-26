"use client";

import React from "react";

interface Claim {
  id: string;
  text: string;
}

interface FactCheck {
  publisher?: string;
  url: string;
  text?: string;
}

interface Archive {
  provider: string;
  url: string;
  snapshotAt: string;
}

interface ScoreBreakdown {
  provenance: number;
  corroboration: number;
  integrity: number;
  context: number;
}

interface SignalCardData {
  itemId: string;
  title?: string;
  url: string;
  score?: number | null;
  breakdown?: ScoreBreakdown | null;
  claims?: Claim[];
  archives?: Archive[];
  factChecks?: FactCheck[];
  embeddableHtml?: string | null;
}

export default function SignalCard({ data }: { data: SignalCardData }) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-zinc-500">Score</div>
          <div className="text-3xl font-bold">{data.score ?? "—"}</div>
        </div>
        <a className="text-blue-700 underline" href={data.url} target="_blank" rel="noopener noreferrer">
          Open Source
        </a>
      </div>
      <h2 className="text-xl font-semibold mt-2">{data.title || data.url}</h2>

      {data.breakdown && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {Object.entries(data.breakdown).map(([k, v]) => (
            <div key={k} className="bg-zinc-50 rounded p-3">
              <div className="text-xs uppercase text-zinc-500">{k}</div>
              <div className="text-lg font-semibold">{v as any}</div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.claims) && data.claims.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-zinc-500 mb-1">Claims</div>
          <ul className="list-disc pl-5">
            {data.claims.map((c: any) => (
              <li key={c.id}>{c.text}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(data.factChecks) && data.factChecks.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-zinc-500 mb-1">Related fact-checks</div>
          <ul className="list-disc pl-5">
            {data.factChecks.map((f: any, i: number) => (
              <li key={i}>
                {f.publisher ? <b>{f.publisher}:</b> : null}{" "}
                <a className="underline" href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.text || f.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}