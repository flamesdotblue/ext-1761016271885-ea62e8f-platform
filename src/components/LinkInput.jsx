import { useEffect, useMemo, useState } from 'react';
import { Rocket, Link as LinkIcon, Loader2, Info } from 'lucide-react';

export default function LinkInput({ onAnalyze, checking, progress }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [desc, setDesc] = useState('');

  const disabled = useMemo(() => checking || desc.trim().length === 0, [checking, desc]);

  useEffect(() => {
    // If user pastes a URL into the description accidentally, move it to videoUrl field (soft UX)
    const maybeUrl = desc.trim();
    if (/^https?:\/\//i.test(maybeUrl) && maybeUrl.split('\n').length === 1 && maybeUrl.length < 400) {
      setVideoUrl(maybeUrl);
    }
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="text-sm text-white/70">Video URL (optional)</label>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-white/50 flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> We can’t fetch descriptions automatically due to platform limits. Paste the description below to analyze links.</p>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-white/70">Paste video description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={`Paste the full description here...\nExample:\nNew merch: https://example.com/shop\nSponsor: https://sponsor.example\nOld link: http://example.com/404`}
            rows={8}
            className="mt-1 w-full resize-y rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 p-3 placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          onClick={() => onAnalyze(desc)}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium transition-colors"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {checking ? `Checking ${progress.done}/${progress.total}` : 'Analyze links'}
        </button>

        <div className="text-xs text-white/50">Privacy-friendly: checks happen from your browser.</div>
      </div>
    </div>
  );
}
