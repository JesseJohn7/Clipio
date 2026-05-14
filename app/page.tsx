'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Download, Sparkles, ArrowRight, Menu, X as XIcon, Loader2,
  CheckCircle2, AlertCircle, Copy, Check, Play, Clock,
  PlayCircle, Camera, Share2, MessageCircle, Globe, ChevronRight,
  Zap, Shield, Flame, Lightbulb, MonitorPlay, Code, ExternalLink,
  Star, FileVideo, Music, ArrowDown, ChevronDown
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────
type Platform = 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'unknown'
type Quality = '1080p' | '720p' | '480p' | '360p' | 'audio'
type DownloadState = 'idle' | 'analyzing' | 'ready' | 'downloading' | 'done' | 'error'

interface VideoInfo {
  title: string
  duration: string
  thumbnail: string
  platform: Platform
  formats: Quality[]
  views?: string
}

// ── Platform detection ─────────────────────────────────
function detectPlatform(url: string): Platform {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube'
  if (/instagram\.com/i.test(url)) return 'instagram'
  if (/facebook\.com|fb\.watch/i.test(url)) return 'facebook'
  if (/twitter\.com|x\.com/i.test(url)) return 'twitter'
  return 'unknown'
}

const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; icon: any }> = {
  youtube: { label: 'YouTube', color: '#ff0000', bg: 'rgba(255,0,0,0.12)', icon: PlayCircle },
  instagram: { label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,0.12)', icon: Camera },
  facebook: { label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.12)', icon: Share2 },
  twitter: { label: 'X (Twitter)', color: '#1da1f2', bg: 'rgba(29,161,242,0.12)', icon: MessageCircle },
  unknown: { label: 'Unknown', color: '#8b95a8', bg: 'rgba(139,149,168,0.12)', icon: Globe },
}

// Mock video info generator (replace with real API)
function generateMockVideoInfo(url: string, platform: Platform): VideoInfo {
  const mocks: Record<Platform, VideoInfo> = {
    youtube: {
      title: 'Amazing Sunset Time-lapse — 4K Cinematic',
      duration: '3:42',
      thumbnail: 'https://picsum.photos/seed/yt1/400/225',
      platform: 'youtube',
      formats: ['1080p', '720p', '480p', '360p', 'audio'],
      views: '2.4M views',
    },
    instagram: {
      title: 'Instagram Reel — Travel Highlights 2024',
      duration: '0:30',
      thumbnail: 'https://picsum.photos/seed/ig1/400/225',
      platform: 'instagram',
      formats: ['720p', '480p', '360p'],
    },
    facebook: {
      title: 'Facebook Video — Community Update',
      duration: '5:15',
      thumbnail: 'https://picsum.photos/seed/fb1/400/225',
      platform: 'facebook',
      formats: ['720p', '480p', '360p'],
    },
    twitter: {
      title: 'X Post — Viral Clip of the Week',
      duration: '1:20',
      thumbnail: 'https://picsum.photos/seed/tw1/400/225',
      platform: 'twitter',
      formats: ['720p', '480p', '360p'],
    },
    unknown: {
      title: 'Video',
      duration: '–',
      thumbnail: 'https://picsum.photos/seed/unk1/400/225',
      platform: 'unknown',
      formats: ['720p', '480p'],
    },
  }
  return mocks[platform]
}

// ── Stats counter hook ─────────────────────────────────
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const start = Date.now()
        const timer = setInterval(() => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * end))
          if (progress >= 1) clearInterval(timer)
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, started])

  return { count, ref }
}

// ── Quality badge colors ───────────────────────────────
const qualityColors: Record<Quality, string> = {
  '1080p': '#f97316',
  '720p': '#22d3ee',
  '480p': '#a78bfa',
  '360p': '#34d399',
  'audio': '#fbbf24',
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function DropClipApp() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<DownloadState>('idle')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<Quality>('720p')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const downloaderRef = useRef<HTMLDivElement>(null)

  // Stats
  const downloads = useCounter(4820391)
  const users = useCounter(281043)
  const speed = useCounter(99)

  const platform = url ? detectPlatform(url) : 'unknown'
  const platformMeta = PLATFORM_META[platform]

  const isValidUrl = (s: string) => {
    try { new URL(s); return true } catch { return false }
  }

  const handleAnalyze = async () => {
    if (!url.trim()) return
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      setState('error')
      return
    }

    setState('analyzing')
    setError('')
    setVideoInfo(null)

    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))

    const detectedPlatform = detectPlatform(url)
    if (detectedPlatform === 'unknown') {
      setError('Unsupported platform. We support YouTube, Instagram, Facebook, and X (Twitter).')
      setState('error')
      return
    }

    const info = generateMockVideoInfo(url, detectedPlatform)
    setVideoInfo(info)
    setSelectedQuality(info.formats[0])
    setState('ready')
  }

  const handleDownload = async () => {
    setState('downloading')
    setDownloadProgress(0)

    // Simulate progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 40))
      setDownloadProgress(i)
    }
    setState('done')
    setTimeout(() => {
      setState('idle')
      setUrl('')
      setVideoInfo(null)
      setDownloadProgress(0)
    }, 3000)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {}
  }

  const scrollToDownloader = () => {
    downloaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state === 'idle') handleAnalyze()
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', position: 'relative', zIndex: 1 }}>

      {/* ── NAVBAR ────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(8,11,16,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)', boxShadow: '0 0 16px rgba(249,115,22,0.5)' }}>
              <ArrowDown size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Drop<span style={{ color: 'var(--accent)' }}>Clip</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
               onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
               onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Features
            </a>
            <a href="#platforms" className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
               onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
               onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Platforms
            </a>
            <a href="#faq" className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
               onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
               onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              FAQ
            </a>
          </div>

          {/* CTA row */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            >
              <Star size={14} />
              <span>Star on GitHub</span>
            </a>
            <button
              onClick={scrollToDownloader}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: 'var(--accent)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ea580c')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
            >
              <Download size={14} />
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
            <a href="#features" className="text-sm py-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#platforms" className="text-sm py-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileMenuOpen(false)}>Platforms</a>
            <a href="#faq" className="text-sm py-2" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="flex gap-2 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <Star size={14} /> Star on GitHub
              </a>
              <button onClick={() => { scrollToDownloader(); setMobileMenuOpen(false) }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ──────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 grid-bg overflow-hidden">

        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -60%)',
        }} />
        <div className="absolute pointer-events-none" style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(251,146,60,0.05) 0%, transparent 70%)',
          bottom: '10%', right: '10%',
        }} />

        {/* Floating platform icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { icon: PlayCircle, color: '#ff0000', top: '20%', left: '8%', delay: '0s', size: 28 },
            { icon: Camera, color: '#e1306c', top: '30%', right: '9%', delay: '1.5s', size: 24 },
            { icon: Share2, color: '#1877f2', bottom: '30%', left: '12%', delay: '0.8s', size: 26 },
            { icon: MessageCircle, color: '#1da1f2', bottom: '35%', right: '7%', delay: '2s', size: 22 },
          ].map(({ icon: Icon, color, delay, size, ...pos }, i) => (
            <div key={i} className="absolute animate-float hidden lg:flex items-center justify-center rounded-2xl"
              style={{
                ...pos,
                width: 56, height: 56,
                background: `rgba(${color === '#ff0000' ? '255,0,0' : color === '#e1306c' ? '225,48,108' : color === '#1877f2' ? '24,119,242' : '29,161,242'},0.08)`,
                border: `1px solid ${color}22`,
                animationDelay: delay,
                boxShadow: `0 0 20px ${color}20`,
              }}>
              <Icon size={size} color={color} />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium animate-slide-up stagger-1"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            <Sparkles size={14} />
            <span>Free · No Sign-up · Instant Download</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight mb-6 animate-slide-up stagger-2"
            style={{ fontFamily: 'var(--font-display)' }}>
            Drop a link.
            <br />
            <span className="gradient-text">Get the clip.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 animate-slide-up stagger-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Paste any video link from YouTube, Instagram, Facebook, or X — download in seconds.
            No ads, no watermarks, no nonsense.
          </p>

          {/* ── MAIN DOWNLOADER BOX ───────────────────── */}
          <div ref={downloaderRef} className="animate-slide-up stagger-4">
            <div className="relative max-w-2xl mx-auto rounded-2xl p-1"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.05) 50%, rgba(249,115,22,0.2) 100%)' }}>
              <div className="rounded-xl p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)' }}>

                {/* Platform indicator */}
                {url && platform !== 'unknown' && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="platform-pill" style={{ background: platformMeta.bg, color: platformMeta.color, border: `1px solid ${platformMeta.color}33` }}>
                      <platformMeta.icon size={12} />
                      {platformMeta.label} detected
                    </div>
                  </div>
                )}

                {/* URL Input */}
                <div className="relative rounded-xl overflow-hidden input-ring mb-4" style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-elevated)' }}>
                  <input
                    type="url"
                    value={url}
                    onChange={e => { setUrl(e.target.value); if (state === 'error') setState('idle') }}
                    onKeyDown={handleKeyDown}
                    placeholder="https://youtube.com/watch?v=... or any video link"
                    className="w-full bg-transparent px-4 sm:px-5 py-4 pr-28 text-sm sm:text-base outline-none placeholder:opacity-40"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    disabled={state === 'analyzing' || state === 'downloading'}
                  />
                  <button
                    onClick={handlePaste}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'rgba(249,115,22,0.12)', color: 'var(--accent)', border: '1px solid rgba(249,115,22,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.12)')}
                  >
                    Paste
                  </button>
                </div>

                {/* Error */}
                {state === 'error' && (
                  <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {/* Analyze button */}
                {(state === 'idle' || state === 'error') && (
                  <button
                    onClick={handleAnalyze}
                    disabled={!url.trim()}
                    className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2.5 text-base"
                    style={{
                      background: url.trim() ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'var(--bg-elevated)',
                      color: url.trim() ? '#fff' : 'var(--text-muted)',
                      cursor: url.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: url.trim() ? '0 4px 24px rgba(249,115,22,0.35)' : 'none',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => { if (url.trim()) (e.currentTarget.style.boxShadow = '0 4px 40px rgba(249,115,22,0.5)') }}
                    onMouseLeave={e => { if (url.trim()) (e.currentTarget.style.boxShadow = '0 4px 24px rgba(249,115,22,0.35)') }}
                  >
                    <Zap size={18} />
                    Analyze Video
                  </button>
                )}

                {/* Analyzing state */}
                {state === 'analyzing' && (
                  <div className="w-full py-4 rounded-xl flex items-center justify-center gap-3"
                    style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>Fetching video info...</span>
                  </div>
                )}

                {/* Video info card */}
                {(state === 'ready' || state === 'downloading' || state === 'done') && videoInfo && (
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex gap-3 p-4" style={{ background: 'var(--bg-elevated)' }}>
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 80, height: 52 }}>
                        <img src={videoInfo.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                          <Play size={16} fill="white" color="white" />
                        </div>
                      </div>
                      {/* Meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--text-primary)' }}>{videoInfo.title}</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-1"><Clock size={11} /> {videoInfo.duration}</span>
                          {videoInfo.views && <span>{videoInfo.views}</span>}
                          <div className="platform-pill px-2 py-0.5" style={{ background: platformMeta.bg, color: platformMeta.color, fontSize: 10 }}>
                            <platformMeta.icon size={10} />{platformMeta.label}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality selector */}
                    <div className="p-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Quality</p>
                      <div className="flex flex-wrap gap-2">
                        {videoInfo.formats.map(q => (
                          <button
                            key={q}
                            onClick={() => setSelectedQuality(q)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={{
                              background: selectedQuality === q ? `${qualityColors[q]}22` : 'var(--bg-card)',
                              border: `1px solid ${selectedQuality === q ? qualityColors[q] : 'var(--border)'}`,
                              color: selectedQuality === q ? qualityColors[q] : 'var(--text-secondary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {q === 'audio' ? <Music size={11} /> : <FileVideo size={11} />}
                            {q}
                          </button>
                        ))}
                      </div>

                      {/* Download button */}
                      {state === 'ready' && (
                        <button
                          onClick={handleDownload}
                          className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)', fontFamily: 'var(--font-display)' }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 32px rgba(249,115,22,0.6)')}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.4)')}
                        >
                          <Download size={18} />
                          Download {selectedQuality}
                        </button>
                      )}

                      {/* Downloading progress */}
                      {state === 'downloading' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                            <span>Downloading...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${downloadProgress}%`, background: 'linear-gradient(90deg, #f97316, #fbbf24)', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
                          </div>
                        </div>
                      )}

                      {/* Done */}
                      {state === 'done' && (
                        <div className="py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
                          <Check size={18} />
                          Download complete!
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Trusted by */}
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              {[
                { Icon: PlayCircle, color: '#ff0000', label: 'YouTube' },
                { Icon: Camera, color: '#e1306c', label: 'Instagram' },
                { Icon: Share2, color: '#1877f2', label: 'Facebook' },
                { Icon: MessageCircle, color: '#1da1f2', label: 'X / Twitter' },
              ].map(({ Icon, color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Icon size={13} color={color} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} style={{ color: 'var(--text-muted)' }} />
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────── */}
      <section className="py-20 px-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Downloads', ...downloads, suffix: '+', prefix: '' },
            { label: 'Happy Users', ...users, suffix: '+', prefix: '' },
            { label: 'Success Rate', ...speed, suffix: '%', prefix: '' },
          ].map(({ label, count, ref, suffix, prefix }, i) => (
            <div key={i} ref={ref} className="stat-card rounded-2xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-4xl font-extrabold mb-2 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                {prefix}{count.toLocaleString()}{suffix}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ──────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Why DropClip</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
              Built for speed.<br /><span className="gradient-text">Designed for simplicity.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Our infrastructure processes your request in under 2 seconds. No waiting, no spinning loaders.' },
              { icon: Shield, title: 'Privacy First', desc: 'We never store your links or personal data. Every request is processed and immediately discarded.' },
              { icon: Globe, title: '4 Platforms', desc: 'YouTube, Instagram, Facebook, and X (Twitter) — all handled with a single paste-and-click.' },
              { icon: FileVideo, title: 'Multiple Qualities', desc: 'Choose from 360p all the way to 1080p Full HD, or download audio-only MP3.' },
              { icon: Download, title: 'No Watermarks', desc: 'What you download is exactly what was uploaded. Clean, original, unmodified.' },
              { icon: Sparkles, title: 'Always Free', desc: 'No subscription, no credits, no limits. DropClip is and will remain completely free.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="rounded-2xl p-6 group transition-all duration-300"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(249,115,22,0.3)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <Icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORMS SECTION ─────────────────────────── */}
      <section id="platforms" className="py-24 px-4" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Supported Platforms</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
              Paste from <span className="gradient-text">anywhere.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { platform: 'youtube' as Platform, desc: 'Videos, Shorts, and Playlists — up to 4K resolution supported.', formats: ['4K', '1080p', '720p', '480p', '360p', 'Audio MP3'] },
              { platform: 'instagram' as Platform, desc: 'Reels, Feed videos, and IGTV content from any public profile.', formats: ['1080p', '720p', '480p'] },
              { platform: 'facebook' as Platform, desc: 'Public video posts, Watch videos, and Facebook Reels.', formats: ['HD', '720p', '480p', 'SD'] },
              { platform: 'twitter' as Platform, desc: 'Video tweets from X (formerly Twitter) — all public content.', formats: ['1080p', '720p', '360p'] },
            ].map(({ platform: p, desc, formats }) => {
              const meta = PLATFORM_META[p]
              const Icon = meta.icon
              return (
                <div key={p} className="rounded-2xl p-6 flex gap-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: meta.bg, border: `1px solid ${meta.color}33` }}>
                    <div style={{ color: meta.color }}>
                      <Icon size={28} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{meta.label}</h3>
                    <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formats.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: `${meta.color}18`, color: meta.color, fontFamily: 'var(--font-mono)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>How It Works</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-16" style={{ fontFamily: 'var(--font-display)' }}>
            Three steps.<br /><span className="gradient-text">Done.</span>
          </h2>

          <div className="flex flex-col gap-0">
            {[
              { step: '01', title: 'Copy the video URL', desc: 'Find any video on YouTube, Instagram, Facebook, or X and copy its URL from your browser or app.' },
              { step: '02', title: 'Paste it into DropClip', desc: 'Hit Paste or just type the URL into our download box. We\'ll instantly detect the platform.' },
              { step: '03', title: 'Choose quality & download', desc: 'Pick your preferred resolution or audio-only, then hit Download. Your file is ready instantly.' },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="flex gap-6 items-start relative">
                {i < 2 && <div className="absolute left-7 top-16 bottom-0 w-px" style={{ background: 'var(--border)', zIndex: 0 }} />}
                <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-sm z-10 relative"
                  style={{ background: 'var(--bg-card)', border: '2px solid rgba(249,115,22,0.4)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  {step}
                </div>
                <div className="flex-1 pb-12 text-left">
                  <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GITHUB CTA SECTION ────────────────────────── */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-10 sm:p-12" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.03) 100%)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <Code size={40} className="mx-auto mb-6" style={{ color: 'var(--text-secondary)' }} />
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Open Source &amp; <span className="gradient-text">Community Built</span>
            </h2>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              DropClip is open source. Self-host it, contribute to it, or just give it a star — every bit of support helps keep this running and free for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.4)', fontFamily: 'var(--font-display)' }}
              >
                <Star size={18} />
                Star on GitHub
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all"
                style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
              >
                <ExternalLink size={16} />
                View Source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>FAQ</p>
            <h2 className="text-4xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>Common Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { q: 'Is DropClip free?', a: 'Yes — completely free. No hidden fees, no subscriptions, no premium tiers. DropClip will always be free for personal use.' },
              { q: 'Do I need to create an account?', a: 'Nope. Just paste a URL and download. No sign-up, no email, no password. Nothing stored.' },
              { q: 'Is it legal to download videos?', a: 'Downloading for personal, offline viewing of content you have rights to is generally acceptable. Always respect copyright and the platform\'s Terms of Service.' },
              { q: 'Why isn\'t my link working?', a: 'Make sure the video is public (not private or age-restricted). Private videos cannot be downloaded. If it\'s public, check that the URL is correct and try again.' },
              { q: 'What video formats are supported?', a: 'We support MP4 for video downloads and MP3 for audio-only. Quality options vary per platform, from 360p SD to 1080p Full HD.' },
            ].map(({ q, a }, i) => (
              <FAQItem key={i} question={q} answer={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="py-24 px-4 grid-bg" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 70%)',
          }} />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 relative" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to <span className="gradient-text">download?</span>
          </h2>
          <p className="text-base mb-10 relative" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Paste your first link and see how fast it is. No sign-up. No BS.
          </p>
          <button
            onClick={scrollToDownloader}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all relative animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', fontFamily: 'var(--font-display)' }}
          >
            <ArrowDown size={22} />
            Start Downloading Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <ArrowDown size={12} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Drop<span style={{ color: 'var(--accent)' }}>Clip</span></span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2024 DropClip. Made with ❤️ for the internet. Not affiliated with any platform.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

// ── FAQ Item (accordion) ───────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: open ? 'var(--bg-card)' : 'var(--bg-surface)', border: open ? '1px solid rgba(249,115,22,0.25)' : '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
      >
        <span className="font-semibold text-sm" style={{ color: open ? 'var(--text-primary)' : 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{question}</span>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {answer}
        </div>
      )}
    </div>
  )
}