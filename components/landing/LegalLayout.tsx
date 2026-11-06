import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LAST_UPDATED } from '@/lib/legal'

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#f1eff5] md:text-[22px]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[14px] leading-[1.8] text-[#a4a1ad] [&_a]:text-[#d0bcff] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-[#e6e3ee] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  )
}

export default function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090d] text-[#f5f4f8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[520px] w-[min(1050px,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_12%,rgba(116,72,196,0.21),transparent_62%)]"
      />

      <header className="mx-auto flex h-[72px] w-[calc(100%_-_32px)] items-center justify-between border-b border-white/[0.065] md:h-[82px] md:w-[min(1180px,calc(100%_-_64px))]">
        <Link
          href="/"
          aria-label="Clipio home"
          className="inline-flex items-center gap-[9px] text-[19px] font-[750] tracking-[-0.07em] text-[#f5f4f8] md:text-[21px]"
        >
          <Image src="/clipio.png" alt="" width={32} height={32} priority className="rounded-lg" />
          <span>clipio</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#b1afbb] transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to home
        </Link>
      </header>

      <article className="mx-auto w-[calc(100%_-_32px)] max-w-[760px] pt-14 pb-20 md:pt-20">
        <span className="text-[10px] font-bold tracking-[0.16em] text-[#b79aff]">LEGAL</span>
        <h1 className="mt-4 text-[length:clamp(34px,6vw,52px)] font-bold leading-[1.05] tracking-[-0.06em]">
          {title}
        </h1>
        <p className="mt-3 text-[12px] text-[#777481]">Last updated: {LAST_UPDATED}</p>
        {intro && <p className="mt-6 text-[15px] leading-[1.8] text-[#c7c4ce]">{intro}</p>}
        {children}
      </article>

      <footer className="mx-auto flex min-h-[72px] w-[calc(100%_-_32px)] flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-4 md:min-h-[82px] md:w-[min(1180px,calc(100%_-_64px))]">
        <span className="text-[11px] text-[#777481]">Made for the clips worth keeping.</span>
        <nav aria-label="Legal" className="flex items-center gap-5 text-[12px] text-[#777481]">
          <Link href="/terms" className="transition-colors duration-200 hover:text-white">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors duration-200 hover:text-white">
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  )
}