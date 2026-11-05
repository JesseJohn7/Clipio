'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __clipioInstallPrompt?: BeforeInstallPromptEvent | null
  }
}

type Hint = { title: string; body: string }

function getHint(): Hint {
  const ua = navigator.userAgent
  const isIos =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /android/i.test(ua)
  const isFirefox = /firefox|fxios/i.test(ua)
  const isSafariDesktop =
    !isIos && /safari/i.test(ua) && !/chrome|chromium|android|edg/i.test(ua)

  if (isIos) {
    return {
      title: 'Install on iPhone / iPad',
      body: 'Tap the Share button, then choose “Add to Home Screen”.',
    }
  }
  if (isAndroid && !isFirefox) {
    return {
      title: 'Install on Android',
      body: 'Open the browser menu (⋮), then tap “Install app” or “Add to Home screen”.',
    }
  }
  if (isFirefox) {
    return {
      title: 'Open in Chrome or Edge',
      body: 'Firefox can’t install web apps on desktop. Open Clipio in Chrome or Edge to install it.',
    }
  }
  if (isSafariDesktop) {
    return {
      title: 'Install in Safari',
      body: 'In the menu bar choose File, then “Add to Dock”.',
    }
  }
  return {
    title: 'Install Clipio',
    body: 'Click the install icon at the right end of the address bar, or open the menu (⋮) and choose “Install Clipio”.',
  }
}

export default function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [hint, setHint] = useState<Hint | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  /* detect install state + capture the native prompt */
  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) {
      setInstalled(true)
      return
    }

    if (window.__clipioInstallPrompt) setDeferred(window.__clipioInstallPrompt)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      window.__clipioInstallPrompt = e as BeforeInstallPromptEvent
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
      setHint(null)
      window.__clipioInstallPrompt = null
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  /* close popover on outside click / Escape */
  useEffect(() => {
    if (!hint) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setHint(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHint(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [hint])

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setDeferred(null)
      window.__clipioInstallPrompt = null
      return
    }
    setHint(prev => (prev ? null : getHint()))
  }

  if (installed) return null

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install Clipio app"
        className="inline-flex min-h-9 items-center justify-center gap-[7px] rounded-[11px] border border-white/[0.14] bg-white/[0.04] px-[11px] text-[11px] font-semibold text-[#dedce6] transition duration-200 hover:border-[rgba(190,162,255,0.45)] hover:bg-[rgba(167,130,239,0.1)] hover:text-white md:min-h-[39px] md:gap-2 md:px-[14px] md:text-[13px]"
      >
        <Download size={15} aria-hidden="true" />
        <span className="md:hidden">Install</span>
        <span className="hidden md:inline">Install app</span>
      </button>

      {hint && (
        <div
          role="dialog"
          aria-label={hint.title}
          className="absolute top-full right-0 z-20 mt-3 w-[260px] rounded-xl border border-[rgba(190,162,255,0.25)] bg-[rgba(25,24,32,0.98)] p-3.5 text-left shadow-[0_14px_40px_rgba(0,0,0,0.5)]"
        >
          <button
            type="button"
            onClick={() => setHint(null)}
            aria-label="Close"
            className="absolute top-2.5 right-2.5 text-[#777481] transition-colors hover:text-white"
          >
            <X size={14} />
          </button>
          <strong className="block pr-5 text-[12px] font-semibold text-[#f0eef5]">
            {hint.title}
          </strong>
          <p className="mt-1.5 text-[11px] leading-[1.6] text-[#a4a1ad]">{hint.body}</p>
        </div>
      )}
    </div>
  )
}