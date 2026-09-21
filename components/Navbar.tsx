'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-black backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-1 transition-all duration-300"
        >
          <span className="text-xl font-black tracking-tight text-white">
            Clipio
          </span>
        </Link>
      </div>
    </header>
  )
}