"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // iOS detection
    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as any).standalone;

    if (isIOS) {
      setShowIOS(true);
      return;
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroid(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowAndroid(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowAndroid(false);
    setShowIOS(false);
  };

  if (dismissed || (!showAndroid && !showIOS)) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-xl flex items-center gap-4">
      <img
        src="/clipiodark.png"
        alt="Clipio"
        className="w-12 h-12 rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">Install Clipio</p>
        {showIOS ? (
          <p className="text-zinc-400 text-xs mt-0.5">
            Tap <span className="text-white">Share</span> then{" "}
            <span className="text-white">Add to Home Screen</span>
          </p>
        ) : (
          <p className="text-zinc-400 text-xs mt-0.5">
            Install for a faster experience
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {showAndroid && (
          <button
            onClick={handleInstall}
            className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-zinc-500 text-xs px-2 py-1.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}