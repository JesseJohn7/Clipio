import Image from 'next/image'

// ✦ Replace these with your real handles
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