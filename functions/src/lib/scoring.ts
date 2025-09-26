export type Evidence = {
  provenance?: any; corroboration?: any; integrity?: any; context?: any;
};

export function computeScore(ev: Evidence) {
  const prov = clamp(scoreProvenance(ev.provenance));
  const cor  = clamp(scoreCorroboration(ev.corroboration));
  const integ= clamp(scoreIntegrity(ev.integrity));
  const ctx  = clamp(scoreContext(ev.context));
  const total = Math.round(prov*0.40 + cor*0.35 + integ*0.15 + ctx*0.10);
  return { provenance:prov, corroboration:cor, integrity:integ, context:ctx, total };
}

// naive versions — replace w/ your detailed logic
function scoreProvenance(p:any){ let s = 0; if(p?.archive) s+=20; if(p?.authorVerified) s+=20; if(p?.safe) s+=40; if(p?.canonical) s+=20; return s; }
function scoreCorroboration(c:any){ let s=0; if((c?.outlets||[]).length>=3) s+=50; if(c?.factChecks?.length) s+=30; if(c?.mainstreamSpread) s+=20; return s; }
function scoreIntegrity(i:any){ let s=0; if(i?.noEdits) s+=40; if(i?.metadataClean) s+=30; if(i?.licensingClear) s+=30; return s; }
function scoreContext(c:any){ let s=0; if(c?.metaAnalyses) s+=50; if(c?.scholarSupport) s+=50; return s; }
function clamp(n:number){ return Math.max(0, Math.min(100, n)); }