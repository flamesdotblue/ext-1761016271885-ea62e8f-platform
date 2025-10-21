import { useMemo, useState } from 'react';
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, HelpCircle, Clock, Copy } from 'lucide-react';

function StatusBadge({ status, code }) {
  const map = {
    ok: { label: code ? `OK • ${code}` : 'OK', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    broken: { label: code ? `Broken • ${code}` : 'Broken', class: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
    timeout: { label: 'Timeout', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    unknown: { label: 'Unknown (CORS)', class: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
    error: { label: code ? `Error • ${code}` : 'Error', class: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' },
    queued: { label: 'Queued', class: 'bg-white/10 text-white/70 border-white/20' },
    checking: { label: 'Checking', class: 'bg-white/10 text-white/70 border-white/20' },
  };
  const info = map[status] || map.unknown;
  const Icon = status === 'ok' ? CheckCircle2 : status === 'broken' ? XCircle : status === 'timeout' ? Clock : HelpCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${info.class}`}>
      <Icon className="h-3.5 w-3.5" /> {info.label}
    </span>
  );
}

export default function LinkResults({ results, checking, summary, onRecheck }) {
  const [copied, setCopied] = useState(false);

  const hasResults = results && results.length > 0;
  const totals = useMemo(() => summary || { ok: 0, broken: 0, timeout: 0, unknown: 0, error: 0 }, [summary]);

  const copyCsv = async () => {
    const header = 'url,status,code';
    const rows = results.map((r) => `${JSON.stringify(r.url)},${r.status},${r.code ?? ''}`);
    const csv = [header, ...rows].join('\n');
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!hasResults) {
    return (
      <div className="mt-6 text-center text-white/60 text-sm">
        Results will appear here after analysis.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Total: {results.length}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">OK: {totals.ok}</span>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">Broken: {totals.broken}</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Timeout: {totals.timeout}</span>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">Unknown: {totals.unknown}</span>
        </div>
        <button onClick={copyCsv} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-white/10 border border-white/15 hover:bg-white/15">
          <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy CSV'}
        </button>
      </div>

      <ul className="mt-4 divide-y divide-white/10">
        {results.map((r, idx) => (
          <li key={r.url + idx} className="py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <a href={r.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 truncate max-w-full">
                <span className="truncate text-sm text-white/90 group-hover:underline">{r.url}</span>
                <ExternalLink className="h-3.5 w-3.5 text-white/40 group-hover:text-white/70 shrink-0" />
              </a>
              <div className="mt-1">
                <StatusBadge status={r.status} code={r.code} />
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => onRecheck(r.url, idx)}
                disabled={checking}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10 border border-white/15 hover:bg-white/15 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" /> Recheck
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
