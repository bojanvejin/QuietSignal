(async function(){
  const url = document.querySelector('link[rel="canonical"]')?.href || location.href;
  try {
    // IMPORTANT: Replace "https://YOUR_HOST" with your actual Firebase Hosting URL
    const resp = await fetch(`${import.meta?.env?.VITE_API_BASE || "https://YOUR_HOST"}/api/signal?itemUrl=${encodeURIComponent(url)}`);
    if (!resp.ok) return;
    const data = await resp.json();
    if (!data || !data.score) return;

    const w = document.createElement('div');
    w.style.cssText = 'position:fixed;top:12px;right:12px;z-index:999999;background:#111;color:#fff;padding:8px 10px;border-radius:10px;font:12px system-ui;box-shadow:0 8px 30px rgba(0,0,0,.25)';
    w.innerHTML = `QS Score <b>${data.score}</b> <a href="${data.url}" target="_blank" style="color:#8ab4ff;margin-left:8px;">source</a>`;
    document.body.appendChild(w);
  } catch(e){}
})();