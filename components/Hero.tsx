'use client'

import { useState } from 'react'
import { Download, Link2, Loader2, CheckCircle, XCircle } from 'lucide-react'

const PLATFORMS = [
  { label: 'TikTok', domains: ['tiktok.com'], color: 'text-pink-400 border-pink-500/40 bg-pink-500/10' },
  { label: 'X (Twitter)', domains: ['twitter.com', 'x.com'], color: 'text-sky-400 border-sky-500/40 bg-sky-500/10' },
  { label: 'Instagram', domains: ['instagram.com'], color: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10' },
  { label: 'Facebook', domains: ['facebook.com', 'fb.watch'], color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  { label: 'YouTube', domains: ['youtube.com', 'youtu.be'], color: 'text-red-400 border-red-500/40 bg-red-500/10' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

function detectPlatform(url: string) {
  return PLATFORMS.find(p => p.domains.some(d => url.includes(d))) ?? null
}

export default function Hero() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ downloadUrl: string; title: string; platform: string } | null>(null)
  const [error, setError] = useState('')

  const activePlatform = url ? detectPlatform(url) : null

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

  const handleReset = () => {
    setUrl('')
    setError('')
    setStatus('idle')
    setResult(null)
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
        Paste a link from TikTok, X, Facebook, Instagram and more — download instantly in full quality.
      </p>

      {/* Input Box */}
      <div className="w-full max-w-2xl">
        <div className={`relative flex items-center gap-3 rounded-2xl border bg-zinc-900/80 px-4 py-3 backdrop-blur transition-all duration-300 ${
          status === 'error'
            ? 'border-red-500/60 shadow-red-500/10 shadow-lg'
            : 'border-zinc-700 focus-within:border-violet-500/60 focus-within:shadow-violet-500/10 focus-within:shadow-lg'
        }`}>
          {/* Platform badge OR link icon */}
          {activePlatform ? (
            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${activePlatform.color} transition-all duration-300`}>
              {activePlatform.label}
            </span>
          ) : (
            <Link2 className="h-5 w-5 text-zinc-500 shrink-0" />
          )}

          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); setStatus('idle') }}
            onKeyDown={e => e.key === 'Enter' && handleDownload()}
            placeholder="Paste video URL — TikTok, X, Facebook, Instagram..."
            className="flex-1 bg-transparent text-white text-sm md:text-base outline-none placeholder:text-zinc-600"
          />

          {url && (
            <button onClick={handleReset} className="text-zinc-600 hover:text-zinc-400 transition text-lg leading-none">
              ✕
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={status === 'loading' || !url.trim()}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading'
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />
            }
            <span className="hidden sm:block">
              {status === 'loading' ? 'Fetching...' : 'Download'}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm px-1">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Success Preview Card */}
        {status === 'success' && result && (
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden">
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-white truncate max-w-xs">
                  {result.title}
                </span>
              </div>
              {activePlatform && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${activePlatform.color}`}>
                  {result.platform}
                </span>
              )}
            </div>

            {/* Video preview */}
            <div className="p-4">
              <video
                src={result.downloadUrl}
                controls
                className="w-full rounded-xl max-h-72 bg-black object-contain"
                preload="metadata"
              />
            </div>

            {/* Download button */}
            <div className="px-4 pb-4 flex gap-3">
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-2.5 text-sm font-semibold text-white transition"
              >
                <Download className="h-4 w-4" />
                Save Video
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white text-sm transition"
              >
                New Download
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Platform chips — highlight active one */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
        {PLATFORMS.map(p => {
          const isActive = activePlatform?.label === p.label
          return (
            <span
              key={p.label}
              className={`px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 cursor-default ${
                isActive
                  ? p.color
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
              }`}
            >
              {p.label}
            </span>
          )
        })}
      </div>
    </section>
  )
}