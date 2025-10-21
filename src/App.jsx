import { useCallback, useMemo, useState } from 'react';
import Hero from './components/Hero';
import LinkInput from './components/LinkInput';
import LinkResults from './components/LinkResults';
import Footer from './components/Footer';

function extractUrls(text) {
  if (!text) return [];
  const urls = new Set();
  const regex = /((https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:?#@!$&'()*+,;=%]*)?)/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    let raw = match[0];
    // Trim trailing punctuation common in descriptions
    raw = raw.replace(/[),.;]+$/g, '');
    // Ensure protocol
    if (!/^https?:\/\//i.test(raw)) {
      raw = 'https://' + raw;
    }
    urls.add(raw);
  }
  return Array.from(urls);
}

async function checkLink(url, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  const result = { url, status: 'checking', code: null, error: null };
  try {
    // Try HEAD first
    const headResp = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (headResp.ok) return { ...result, status: 'ok', code: headResp.status };
    // Some servers don't allow HEAD. Fall back to GET.
  } catch (e) {
    // continue to GET
  } finally {
    clearTimeout(timer);
  }

  const controller2 = new AbortController();
  const timer2 = setTimeout(() => controller2.abort('timeout'), timeoutMs);
  try {
    const getResp = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller2.signal,
    });
    clearTimeout(timer2);
    if (getResp.ok) return { ...result, status: 'ok', code: getResp.status };
    return { ...result, status: getResp.status === 404 || getResp.status === 410 ? 'broken' : 'error', code: getResp.status };
  } catch (e) {
    clearTimeout(timer2);
    // Likely CORS or network error
    const message = e?.name === 'AbortError' ? 'timeout' : (e?.message || 'fetch_error');
    return { ...result, status: message === 'timeout' ? 'timeout' : 'unknown', code: null, error: message };
  }
}

function useLinkChecker() {
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState([]);

  const run = useCallback(async (text) => {
    const urls = extractUrls(text);
    setResults(urls.map((u) => ({ url: u, status: 'queued', code: null })));
    setChecking(true);
    setProgress({ done: 0, total: urls.length });

    const concurrency = 5;
    let index = 0;
    const out = new Array(urls.length);

    async function worker() {
      while (true) {
        const i = index;
        if (i >= urls.length) break;
        index++;
        const url = urls[i];
        const res = await checkLink(url);
        out[i] = res;
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    const workers = Array.from({ length: Math.min(concurrency, urls.length) }).map(() => worker());
    await Promise.all(workers);
    setResults(out);
    setChecking(false);
  }, []);

  const recheckOne = useCallback(async (url, idx) => {
    const res = await checkLink(url);
    setResults((prev) => {
      const copy = prev.slice();
      copy[idx] = res;
      return copy;
    });
  }, []);

  return { run, results, setResults, checking, progress, recheckOne };
}

export default function App() {
  const { run, results, checking, progress, recheckOne } = useLinkChecker();
  const hasResults = results && results.length > 0;

  const summary = useMemo(() => {
    const s = { ok: 0, broken: 0, timeout: 0, unknown: 0, error: 0 };
    for (const r of results) {
      if (s[r.status] !== undefined) s[r.status]++;
    }
    return s;
  }, [results]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Hero />
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 -mt-24">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 sm:p-8">
          <LinkInput onAnalyze={run} checking={checking} progress={progress} />
          <LinkResults results={results} checking={checking} summary={summary} onRecheck={recheckOne} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
