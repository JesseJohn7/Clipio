'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Link2, Loader2, CheckCircle, XCircle, Play, X, Clipboard, Heart } from 'lucide-react'
import Image from 'next/image'

const PLATFORMS = [
  { label: 'TikTok', domains: ['tiktok.com'], color: 'text-pink-400 border-pink-500/40 bg-pink-500/10' },
  { label: 'X (Twitter)', domains: ['twitter.com', 'x.com'], color: 'text-sky-400 border-sky-500/40 bg-sky-500/10' },
  { label: 'Instagram', domains: ['instagram.com'], color: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10' },
  { label: 'Facebook', domains: ['facebook.com', 'fb.watch'], color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
]

const ACCOUNTS = [
  {
    bank: 'OPay',
    name: 'Jesse John',
    number: '8038509708',
    logo: '/opay.png',
    logoBg: '#0d1f0d',
    accent: '#4ade80',
    accentBorder: 'rgba(22,163,74,0.3)',
  },
  {
    bank: 'Zenith Bank',
    name: 'Jesse John',
    number: '2521750763',
    logo: '/zenith.png',
    logoBg: '#0d0d1f',
    accent: '#60a5fa',
    accentBorder: 'rgba(59,130,246,0.3)',
  },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

function detectPlatform(url: string) {
  return PLATFORMS.find(p => p.domains.some(d => url.includes(d))) ?? null
}

function proxyUrl(raw: string) {
  return `/api/proxy?url=${encodeURIComponent(raw)}`
}

function isVideoUrl(val: string) {
  try {
    const u = new URL(val)
    return PLATFORMS.some(p => p.domains.some(d => u.hostname.includes(d)))
  } catch { return false }
}

// ─── Support Modal ────────────────────────────────────────────────────────────
function SupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      setCopiedIndex(null)
      setShowThankYou(false)
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '22px',
          padding: '24px 20px',
          backgroundColor: '#0d0d0d',
          border: '1px solid #1f1f1f',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          margin: 'auto',
          boxSizing: 'border-box',
        } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: '#1c1c1c',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            zIndex: 1,
          } as React.CSSProperties}
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>

        {!showThankYou ? (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                marginBottom: '12px',
              }}>
                <Heart style={{ width: '24px', height: '24px', color: '#fff', fill: '#fff' }} />
              </div>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '18px', margin: '0 0 6px', lineHeight: 1.3 }}>
                Support Clipio 🙏
              </h2>
              <p style={{ color: '#fff', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                Clipio is 100% free. A small support keeps<br />the servers alive for everyone.
              </p>
            </div>

            {/* Account Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {ACCOUNTS.map((acc, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: '14px',
                    padding: '14px',
                    backgroundColor: '#111',
                    border: '1px solid #222',
                  }}
                >
                  {/* Bank logo + name row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: acc.logoBg,
                      borderRadius: '8px',
                      padding: '5px 10px 5px 8px',
                      border: `1px solid ${acc.accentBorder}`,
                    }}>
                      {/* Local logo image */}
                      <div style={{ position: 'relative', width: '40px', height: '20px', flexShrink: 0 }}>
                        <Image
                          src={acc.logo}
                          alt={acc.bank}
                          fill
                          style={{ objectFit: 'contain', objectPosition: 'left center' }}
                          sizes="40px"
                        />
                      </div>
                      <span style={{ color: acc.accent, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {acc.bank}
                      </span>
                    </div>
                    <span style={{ color: '#888', fontSize: '11px' }}>{acc.name}</span>
                  </div>

                  {/* Account number + copy */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}>
                    <span style={{
                      color: '#fff',
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '20px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      lineHeight: 1,
                    }}>
                      {acc.number}
                    </span>
                    <button
                      onClick={() => handleCopy(acc.number, i)}
                      style={{
                        flexShrink: 0,
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${copiedIndex === i ? '#16a34a' : '#2a2a2a'}`,
                        backgroundColor: copiedIndex === i ? '#16a34a' : '#1a1a1a',
                        color: copiedIndex === i ? '#fff' : '#777',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        outline: 'none',
                      } as React.CSSProperties}
                    >
                      {copiedIndex === i ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sent CTA */}
            <button
              onClick={() => setShowThankYou(true)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}
            >
              <span style={{ fontSize: '17px' }}>✅</span>
              I've sent something!
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px',
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}
            >
              Maybe later
            </button>
          </>
        ) : (
          /* ── Thank You Screen ── */
          <ThankYouScreen onClose={onClose} />
        )}
      </div>

      <style>{`
        @keyframes clipio-bounce {
          0%   { transform: scale(0.15); opacity: 0; }
          55%  { transform: scale(1.3); }
          75%  { transform: scale(0.9); }
          100% { transform: scale(1);  opacity: 1; }
        }
        @keyframes clipio-fadein {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes clipio-pulse {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.35; }
        }
      `}</style>
    </div>
  )
}

// ─── Thank You Screen (canvas confetti) ───────────────────────────────────────
function ThankYouScreen({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width  = canvas.offsetWidth  * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    const colors = ['#a855f7','#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#f43f5e','#fff']
    const pieces = Array.from({ length: 100 }, () => ({
      x:  W / 2 + (Math.random() - 0.5) * 20,
      y:  H * 0.28,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -16 - 2,
      w:  Math.random() * 9 + 3,
      h:  Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.28,
      opacity: 1,
    }))

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of pieces) {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.5
        p.vx *= 0.97
        p.angle   += p.spin
        p.opacity -= 0.013
        if (p.opacity <= 0) continue
        alive = true
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      if (alive) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '6px 0 4px', position: 'relative', minHeight: '320px' }}>
      {/* Confetti canvas — fills the whole card */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: '14px',
          zIndex: 0,
        }}
      />

      {/* Content on top */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Single clean bouncing icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '38px',
          animation: 'clipio-bounce 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both',
          margin: '0 auto 16px',
          boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.15)',
        }}>
          🎉
        </div>

        <h2 style={{
          color: '#fff',
          fontWeight: 900,
          fontSize: '22px',
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
          animation: 'clipio-fadein 0.35s ease-out 0.2s both',
        }}>
          You're a legend! 🙏
        </h2>

        <p style={{
          color: '#fff',
          fontSize: '13px',
          margin: '0 0 22px',
          lineHeight: 1.65,
          animation: 'clipio-fadein 0.35s ease-out 0.3s both',
        }}>
          Thank you for supporting Clipio.<br />
          <span style={{ color: '#ffff' }}>Every naira keeps this free for everyone 💙</span>
        </p>

        {/* Status pill */}
        <div style={{
          borderRadius: '10px',
          backgroundColor: '#0a1a0a',
          border: '1px solid rgba(22,163,74,0.25)',
          padding: '11px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'clipio-fadein 0.35s ease-out 0.4s both',
        }}>
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            flexShrink: 0,
            boxShadow: '0 0 8px #4ade80',
            animation: 'clipio-pulse 1.4s ease-in-out infinite',
          }} />
          <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>
            Support received — servers staying alive ✓
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            animation: 'clipio-fadein 0.35s ease-out 0.45s both',
          } as React.CSSProperties}
        >
          Back to Clipio 🚀
        </button>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ downloadUrl: string; title: string; platform: string } | null>(null)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [clipboardSuggestion, setClipboardSuggestion] = useState('')
  const [showClipboardBanner, setShowClipboardBanner] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const hasCheckedClipboard = useRef(false)

  useEffect(() => {
    const checkClipboard = async () => {
      if (hasCheckedClipboard.current) return
      if (!navigator.clipboard?.readText) return
      try {
        const text = await navigator.clipboard.readText()
        if (text && isVideoUrl(text.trim())) {
          setClipboardSuggestion(text.trim())
          setShowClipboardBanner(true)
          hasCheckedClipboard.current = true
        }
      } catch { }
    }

    checkClipboard()
    window.addEventListener('focus', checkClipboard)
    return () => window.removeEventListener('focus', checkClipboard)
  }, [])

  const handlePasteFromClipboard = () => {
    setUrl(clipboardSuggestion)
    setShowClipboardBanner(false)
    setError('')
  }

  const activePlatform = url ? detectPlatform(url) : null

  const isValidUrl = (val: string) => {
    try { new URL(val); return true } catch { return false }
  }

  const handleFetch = async () => {
    if (!url.trim() || !isValidUrl(url)) {
      setError('Please paste a valid video URL')
      return
    }
    setStatus('loading')
    setError('')
    setResult(null)
    setIsPlaying(false)

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
      setShowSupport(true)
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
    setIsPlaying(false)
    hasCheckedClipboard.current = false
  }

  const handleSaveVideo = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = proxyUrl(result.downloadUrl)
    a.download = `${result.title ?? 'clipio-video'}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />

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
          Paste a link from TikTok, X, Facebook, Instagram and download instantly in full quality.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl">

          {/* Clipboard banner */}
          {showClipboardBanner && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Clipboard className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="text-xs text-violet-300 truncate">
                  Video link copied — paste it?
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePasteFromClipboard}
                  className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition"
                >
                  Paste
                </button>
                <button
                  onClick={() => setShowClipboardBanner(false)}
                  className="text-zinc-500 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className={`rounded-2xl border bg-zinc-900/80 backdrop-blur transition-all duration-300 ${
            status === 'error'
              ? 'border-red-500/60 shadow-red-500/10 shadow-lg'
              : 'border-zinc-700 focus-within:border-violet-500/60 focus-within:shadow-violet-500/10 focus-within:shadow-lg'
          }`}>
            <div className="flex items-center gap-3 px-3 py-3">
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
                onChange={e => {
                  setUrl(e.target.value)
                  setError('')
                  if (status === 'success') {
                    setStatus('idle')
                    setResult(null)
                    setIsPlaying(false)
                  }
                }}
                onKeyDown={e => e.key === 'Enter' && status !== 'success' && handleFetch()}
                placeholder="Paste video URL…"
                className="flex-1 min-w-0 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
              />

              {url && (
                <button
                  onClick={handleReset}
                  className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-200"
                  title="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {status !== 'success' && (
                <button
                  onClick={handleFetch}
                  disabled={status === 'loading' || !url.trim()}
                  className="shrink-0 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 sm:px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading'
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Download className="h-4 w-4" />
                  }
                  <span className="hidden sm:block">
                    {status === 'loading' ? 'Fetching…' : 'Download'}
                  </span>
                </button>
              )}
            </div>
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
            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-2xl shadow-violet-500/5">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-white truncate">
                    {result.title}
                  </span>
                </div>
                {(() => {
                  const p = PLATFORMS.find(p => p.label === result.platform)
                  return p ? (
                    <span className={`shrink-0 ml-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${p.color}`}>
                      {result.platform}
                    </span>
                  ) : null
                })()}
              </div>

              <div className="relative bg-black">
                {!isPlaying ? (
                  <div
                    className="relative flex items-center justify-center h-64 md:h-80 bg-zinc-950 cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <video
                        src={proxyUrl(result.downloadUrl)}
                        className="w-full h-full object-cover blur-xl opacity-30 scale-110"
                        muted
                        preload="metadata"
                      />
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                        <Play className="h-7 w-7 text-white fill-white ml-1" />
                      </div>
                      <span className="text-zinc-400 text-xs">Click to preview</span>
                    </div>
                  </div>
                ) : (
                  <video
                    src={proxyUrl(result.downloadUrl)}
                    controls
                    autoPlay
                    className="w-full max-h-80 bg-black object-contain"
                    preload="auto"
                    onError={() => setIsPlaying(false)}
                  />
                )}
              </div>

              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={handleSaveVideo}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3 text-sm font-semibold text-white transition"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-zinc-600 hover:text-violet-400 transition-colors"
                >
                  <Heart className="h-3 w-3" />
                  Support Clipio to keep it free
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Platform chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {PLATFORMS.map(p => {
            const isActive = activePlatform?.label === p.label
            return (
              <span
                key={p.label}
                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 cursor-default ${
                  isActive ? p.color : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                }`}
              >
                {p.label}
              </span>
            )
          })}
        </div>
      </section>
    </>
  )
}