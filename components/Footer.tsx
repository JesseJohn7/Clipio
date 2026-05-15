import Image from 'next/image'

// ✦ Replace these with your real handles
const GITHUB_URL = 'https://github.com/JesseJohn'
const X_URL = 'https://x.com/Jesse_can_code'

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/60 bg-black px-6 py-8">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/clipio.png"
            alt="Clipio"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-white font-bold text-base tracking-tight">
            Clipio
          </span>
        </div>

        {/* Centre — copyright */}
        <p className="text-zinc-600 text-xs text-center order-last sm:order-none">
          © {new Date().getFullYear()} Clipio. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-3">

          {/* GitHub */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:border-zinc-600 hover:text-white transition-all duration-200"
          >
            {/* GitHub SVG */}
            <svg
              className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.071 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:border-sky-500/50 hover:text-sky-300 transition-all duration-200"
          >
            {/* X SVG */}
            <svg
              className="h-3.5 w-3.5 text-zinc-500 group-hover:text-sky-400 transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {/* <span>@{X_URL.split('/').pop()}</span> */}
          </a>

        </div>
      </div>
    </footer>
  )
}