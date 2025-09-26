import axios from "axios";

export async function fetchNewsCoverage(q: string, fromISO?: string) {
  const url = `https://newsapi.org/v2/everything`;
  const params = { q, from: fromISO, sortBy: "publishedAt", apiKey: process.env.NEWSAPI_KEY };
  const { data } = await axios.get(url, { params });
  return data?.articles ?? [];
}

export async function fetchGdelt(q: string) {
  const url = `https://api.gdeltproject.org/api/v2/doc/doc`;
  const params = { query: q, mode: "ArtList", maxrecords: 50, format: "json" };
  const { data } = await axios.get(url, { params });
  return data?.articles ?? [];
}

export async function fetchYouTubeMeta(videoId: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos`;
  const params = { part: "snippet,contentDetails,statistics", id: videoId, key: process.env.YOUTUBE_API_KEY };
  const { data } = await axios.get(url, { params });
  return data?.items?.[0] ?? null;
}

export async function searchYouTube(q: string) {
  const url = `https://www.googleapis.com/youtube/v3/search`;
  const params = { part: "snippet", q, type: "video", key: process.env.YOUTUBE_API_KEY };
  const { data } = await axios.get(url, { params });
  return data?.items ?? [];
}

export async function safeBrowsingLookup(urls: string[]) {
  const req = {
    client: { clientId: "quiet-signal", clientVersion: "0.1" },
    threatInfo: {
      threatTypes: ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE","POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urls.map(u => ({ url: u }))
    }
  };
  const { data } = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFEBROWSING_API_KEY}`,
    req
  );
  return data?.matches ?? [];
}

export async function factCheckSearch(query: string) {
  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search`;
  const params = { query, key: process.env.FACTCHECK_API_KEY };
  const { data } = await axios.get(url, { params });
  return data?.claims ?? [];
}

export async function waybackAvailability(url: string) {
  const { data } = await axios.get(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
  return data ?? null;
}
// SavePageNow POST can be added here if you have authenticated key