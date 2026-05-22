"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SNOOZE_KEY = "clipio_install_snoozed_until";
const SNOOZE_MINUTES = 30; // show again after 30 mins if dismissed

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [visible, setVisible] = useState(false);
  const [iosStep, setIosStep] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed as standalone — never show
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("✓ App already in standalone mode");
      return;
    }
    if ((window.navigator as any).standalone === true) {
      console.log("✓ App already installed (iOS standalone)");
      return;
    }

    console.log("🔍 Checking for PWA install eligibility...");

    // Check snooze — if snoozed and not expired, skip for now but re-check on focus
    const checkSnooze = () => {
      const snoozedUntil = localStorage.getItem(SNOOZE_KEY);
      if (snoozedUntil && Date.now() < parseInt(snoozedUntil)) {
        console.log("⏳ Install prompt snoozed until:", new Date(parseInt(snoozedUntil)));
        return false;
      }
      return true;
    };

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    console.log("📱 Detected platform:", isIOS ? "iOS" : "Android/Desktop");

    if (isIOS) {
      if (checkSnooze()) {
        console.log("📲 iOS detected, showing install prompt");
        setShowIOS(true);
        setVisible(true);
      }
      // Re-check when user comes back to tab
      const onFocus = () => {
        if (checkSnooze()) {
          setShowIOS(true);
          setVisible(true);
        }
      };
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }

    // Android / Desktop — wait for beforeinstallprompt
    const handler = (e: Event) => {
      console.log("✅ beforeinstallprompt event fired!");
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      promptRef.current = prompt;
      setDeferredPrompt(prompt);

      if (checkSnooze()) {
        console.log("📦 Showing Android install prompt");
        setShowAndroid(true);
        setVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    console.log("👂 Listening for beforeinstallprompt event...");

    // Re-show on tab focus if snooze expired and prompt still available
    const onFocus = () => {
      if (checkSnooze() && promptRef.current) {
        setShowAndroid(true);
        setVisible(true);
      }
    };
    window.addEventListener("focus", onFocus);

    // Also re-show on visibility change (switching back to tab on mobile)
    const onVisible = () => {
      if (document.visibilityState === "visible" && checkSnooze() && promptRef.current) {
        setShowAndroid(true);
        setVisible(true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt || promptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setShowAndroid(false);
      // Clear snooze since they installed
      localStorage.removeItem(SNOOZE_KEY);
      try {
        await supabase.from("pwa_installs").insert({ platform: "android" });
      } catch {}
    } else {
      // They declined the native prompt — snooze and re-show later
      handleSnooze();
    }
    setDeferredPrompt(null);
    promptRef.current = null;
  };

  const handleSnooze = () => {
    // Snooze for SNOOZE_MINUTES — banner disappears but comes back
    const snoozeUntil = Date.now() + SNOOZE_MINUTES * 60 * 1000;
    localStorage.setItem(SNOOZE_KEY, snoozeUntil.toString());
    setVisible(false);
    // Re-show after snooze expires (if tab still open)
    setTimeout(() => {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      if (showAndroid && promptRef.current) setVisible(true);
      if (showIOS) setVisible(true);
    }, SNOOZE_MINUTES * 60 * 1000);
  };

  if (!visible || (!showAndroid && !showIOS)) return null;

  return (
    <>
      {/* Main banner */}
      <div
        className="fixed bottom-4 left-4 right-4 z-50 shadow-2xl shadow-black/40"
        style={{ animation: "slideUp 0.3s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 flex items-center gap-4 max-w-lg mx-auto">
          <img
            src="/clipiodark.png"
            alt="Clipio"
            className="w-12 h-12 rounded-xl flex-shrink-0 border border-zinc-800"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Install Clipio</p>
            {showIOS ? (
              <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                Tap <span className="text-white font-medium">Share ↑</span> then{" "}
                <span className="text-white font-medium">Add to Home Screen</span>
              </p>
            ) : (
              <p className="text-zinc-400 text-xs mt-0.5">
                Faster access · works offline · no browser bar
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {showAndroid && (
              <button
                onClick={handleInstall}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
              >
                Install
              </button>
            )}
            {showIOS && (
              <button
                onClick={() => setIosStep(true)}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
              >
                How?
              </button>
            )}
            <button
              onClick={handleSnooze}
              className="text-zinc-600 hover:text-zinc-400 text-xs px-2 py-1.5 transition"
              title="Remind me later"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* iOS step-by-step modal */}
      {iosStep && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center p-4"
          onClick={() => setIosStep(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white font-bold text-base mb-5">Add to Home Screen</p>
            {[
              { icon: "⬆️", step: "Tap the Share button at the bottom of Safari" },
              { icon: "➕", step: 'Tap "Add to Home Screen"' },
              { icon: "✅", step: 'Tap "Add" in the top right' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 mb-4">
                <span className="text-xl mt-0.5">{s.icon}</span>
                <div>
                  <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-0.5">Step {i + 1}</p>
                  <p className="text-white text-sm">{s.step}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => { setIosStep(false); handleSnooze(); }}
              className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm py-3 rounded-xl transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}