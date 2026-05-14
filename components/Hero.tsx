'use client'

import { useState } from 'react'
import { Download, Link2, Loader2, CheckCircle, XCircle } from 'lucide-react'

const PLATFORMS = [
  { label: '𝕏 Twitter', color: 'hover:border-sky-500/50 hover:text-sky-400' },
  { label: 'TikTok', color: 'hover:border-pink-500/50 hover:text-pink-400' },
  { label: 'Facebook', color: 'hover:border-blue-500/50 hover:text-blue-400' },
  { label: 'Instagram', color: 'hover:border-fuchsia-500/50 hover:text-fuchsia-400' },
  { label: 'YouTube', color: 'hover:border-red-500/50 hover:text-red-400' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Hero() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ downloadUrl: string; title: string; platform: string } | null>(null)
  const [error, setError] = useState('')

  const isValidUrl = (val: string) => {
    try { new URL(val); return true } catch { return false }
  }

  const handleDownload = async () => {
    if (!url.trim() || !isValidUrl(url)) {
      setError('Please paste a valid video URL')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Download failed')

      setResult(data)
      setStatus('success')
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleDownload()
  }

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-black px-4 pb-20 pt-32 overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[800px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
        <span className="text-xs font-medium text-violet-300 tracking-wide">
          Free · No signup needed · Instant downloads
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-center max-w-4xl leading-[1.05] mb-4">
        Download any video <br />
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          from anywhere.
        </span>
      </h1>

      <p className="text-zinc-400 text-base md:text-lg text-center max-w-xl mb-12">
        Paste a link from TikTok, X (Twitter), Facebook, Instagram, YouTube or more — and download it instantly in full quality.
      </p>

      {/* Input Box */}
      <div className="w-full max-w-2xl">
        <div className={`relative flex items-center gap-3 rounded-2xl border bg-zinc-900/80 px-4 py-3 backdrop-blur transition-all duration-300 ${
          status === 'error' 
            ? 'border-red-500/60 shadow-red-500/10 shadow-lg' 
            : 'border-zinc-700 focus-within:border-violet-500/60 focus-within:shadow-violet-500/10 focus-within:shadow-lg'
        }`}>
          <Link2 className="h-5 w-5 text-zinc-500 shrink-0" />

          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); setStatus('idle') }}
            onKeyDown={handleKeyDown}
            placeholder="Paste video URL — TikTok, X, Facebook, Instagram, YouTube..."
            className="flex-1 bg-transparent text-white text-sm md:text-base outline-none placeholder:text-zinc-600"
          />

          {url && (
            <button
              onClick={() => { setUrl(''); setError(''); setStatus('idle'); setResult(null) }}
              className="text-zinc-600 hover:text-zinc-400 transition"
            >
              ✕
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={status === 'loading' || !url.trim()}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {status === 'loading' ? 'Fetching...' : 'Download'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm px-1">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Success Result */}
        {status === 'success' && result && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-300">{result.title}</p>
                <p className="text-xs text-zinc-500">{result.platform}</p>
              </div>
            </div>
            
            <a
              href={result.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition"
            >
              <Download className="h-3 w-3" />
              Save Video
            </a>
          </div>
        )}
      </div>

      {/* Platform chips */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
        {PLATFORMS.map(p => (
          <span
            key={p.label}
            className={`px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-500 text-xs font-medium transition-colors duration-200 cursor-default ${p.color}`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </section>
  )
}