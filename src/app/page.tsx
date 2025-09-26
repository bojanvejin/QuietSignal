"use client";

import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import SignalCard from "@/components/components/SignalCard"; // Corrected import path

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSignal() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await fetch(`/api/signal?itemUrl=${encodeURIComponent(url)}`);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.detail || "Failed to fetch signal.");
      }
      const json = await resp.json();
      setData(json);
    } catch (e: any) {
      console.error("Error fetching signal:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">QuietSignal — Check a link</h1>
        <div className="flex w-full gap-2 mb-6">
          <input
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste a URL…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={fetchSignal}
            disabled={!url || loading}
          >
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md w-full">
            Error: {error}
          </div>
        )}
        {data && <SignalCard data={data} />}
      </main>
      <MadeWithDyad />
    </div>
  );
}