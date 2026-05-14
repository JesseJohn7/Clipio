'use client'

import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-12">

        {/* Logo — text only, no image */}
        <Link
          href="/"
          className="group flex items-center gap-1 transition-all duration-300"
        >
          <span className="text-xl font-black tracking-tight text-white">
            Drop
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            Clip
          </span>
        </Link>

        {/* Star on GitHub */}
        <Link
          href="https://github.com/JesseJohn7/dropclip"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800"
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110" />

          <span className="hidden sm:block">Star on GitHub</span>
          <span className="sm:hidden">GitHub</span>

          <ChevronRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </header>
  )
}