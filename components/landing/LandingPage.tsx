'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Link2,
  Music2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'

/* ---------- shared class strings ---------- */

const reveal =
  'opacity-0 translate-y-[18px] transition-[opacity,translate,border-color,background-color] duration-[650ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none'

const brand =
  'inline-flex items-center gap-[9px] font-[750] tracking-[-0.07em] text-[#f5f4f8]'

const label = 'text-[10px] font-bold tracking-[0.16em] text-[#b79aff]'

const gradientText =
  'bg-[linear-gradient(100deg,#f3edff_2%,#bda2ff_53%,#8d6dd3_100%)] bg-clip-text text-transparent'

const h2 =
  'text-[length:clamp(37px,5vw,57px)] font-bold leading-[1.05] tracking-[-0.065em]'

const primaryBtn =
  'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[14px] border border-[rgba(222,209,255,0.65)] bg-[linear-gradient(135deg,#d6c6ff,#a788f2)] px-3.5 text-[11px] font-bold text-[#171222] shadow-[0_0_28px_rgba(173,135,255,0.14)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.07] hover:shadow-[0_9px_36px_rgba(173,135,255,0.28)] md:min-h-[53px] md:px-[22px] md:text-sm'

const iconBox =
  'grid shrink-0 place-items-center rounded-[11px] border border-[rgba(190,162,255,0.16)] bg-[rgba(164,129,238,0.09)] text-[#c7b1ff]'

/* ---------- data ---------- */

const platforms = ['TikTok', 'Instagram', 'Facebook', 'X / Twitter']

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Copy a video link',
    description: 'Grab the link to a public video from TikTok, Instagram, Facebook, or X.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Drop it into Clipio',
    description: 'Paste your link into the downloader. Clipio will find the video for you.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Save it your way',
    description: 'Download the video or extract the audio as an MP3 in just a few clicks.',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Fast by design',
    description: 'No complicated steps. Paste a link, get your video, and get on with your day.',
  },
  {
    icon: ShieldCheck,
    title: 'No account needed',
    description: 'Open Clipio and start downloading right away. There is nothing to sign up for.',
  },
  {
    icon: Music2,
    title: 'Video or audio',
    description: 'Keep the full video or save just the sound as an MP3. The choice is yours.',
  },
]

/* ---------- component ---------- */

export default function LandingPage() {
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const elements = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -36px 0px' },
    )

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <main
      ref={pageRef}
      className="relative isolate min-h-screen overflow-hidden bg-[#09090d] text-[#f5f4f8]"
    >
      {/* dotted grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.14)_0.7px,transparent_0.7px)] bg-[length:30px_30px] opacity-[0.13] [mask-image:linear-gradient(to_bottom,black,transparent_50rem)]"
      />
      {/* top purple ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[760px] w-[min(1050px,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_12%,rgba(116,72,196,0.21),transparent_62%)]"
      />

      {/* ================= HEADER ================= */}
      <header className="relative z-[3] mx-auto flex h-[72px] w-[calc(100%_-_32px)] items-center justify-between border-b border-white/[0.065] md:h-[82px] md:w-[min(1180px,calc(100%_-_64px))]">
        <Link className={`${brand} text-[19px] md:text-[21px]`} href="/" aria-label="Clipio home">
          <Image src="/clipio.png" alt="" width={32} height={32} priority className="rounded-lg" />
          <span>clipio</span>
        </Link>

        <nav className="hidden items-center gap-[34px] md:flex" aria-label="Main navigation">
          <a className="text-[13px] font-medium text-[#b1afbb] transition-colors duration-200 hover:text-white" href="#how-it-works">
            How it works
          </a>
          <a className="text-[13px] font-medium text-[#b1afbb] transition-colors duration-200 hover:text-white" href="#features">
            Why Clipio
          </a>
        </nav>

        <div className="flex items-center gap-[13px] md:gap-5">
          <a
            className="inline-flex items-center gap-[7px] text-[13px] font-medium text-[#b1afbb] transition-colors duration-200 hover:text-white"
            href="https://github.com/JesseJohn7/Clipio"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={16} aria-hidden="true" />
            <span className="hidden md:inline">Star on GitHub</span>
          </a>
          <Link
            className="inline-flex min-h-9 items-center justify-center gap-2.5 rounded-[11px] border border-[rgba(222,209,255,0.65)] bg-[linear-gradient(135deg,#d6c6ff,#a788f2)] px-[11px] text-[11px] font-bold text-[#171222] shadow-[0_0_28px_rgba(173,135,255,0.14)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.07] hover:shadow-[0_9px_36px_rgba(173,135,255,0.28)] md:min-h-[39px] md:px-[15px] md:text-[13px]"
            href="/app"
          >
            Get started <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[785px] flex-col items-center px-4 pt-[70px] pb-[76px] text-center sm:min-h-[850px] sm:pt-[82px] md:min-h-[935px] md:px-6 md:pt-[89px] md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[310px] left-1/2 -z-10 h-[400px] w-[min(760px,95vw)] -translate-x-1/2 rounded-full bg-[rgba(126,78,218,0.13)] blur-[115px]"
        />

        <div
          data-reveal
          className={`${reveal} ${label} inline-flex items-center gap-[7px] rounded-full border border-[rgba(188,155,255,0.19)] bg-[rgba(162,124,234,0.08)] px-[13px] py-[9px] text-[8px] md:gap-[9px] md:text-[10px]`}
        >
          <span className="size-[7px] rounded-full bg-[#bea2ff] shadow-[0_0_11px_rgba(190,162,255,0.85)]" />
          YOUR FAVORITE VIDEOS, OFFLINE
          <ArrowRight size={13} aria-hidden="true" />
        </div>

        <h1
          data-reveal
          className={`${reveal} mt-[25px] text-[length:clamp(46px,12vw,58px)] font-[750] leading-[0.99] tracking-[-0.075em] sm:text-[length:clamp(49px,10.5vw,72px)] md:mt-[30px] md:text-[length:clamp(52px,7.7vw,88px)]`}
        >
          Keep the clips.
          <br />
          <span className={gradientText}>Skip the hassle.</span>
        </h1>

        <p
          data-reveal
          className={`${reveal} mt-[19px] max-w-[520px] text-[13px] leading-[1.75] text-[#a4a1ad] md:mt-[23px] md:text-base`}
        >
          The videos you love, one link away. Download from your favorite
          platforms or turn a clip into an MP3 — all with Clipio.
        </p>

        <div
          data-reveal
          className={`${reveal} mt-[23px] flex w-full flex-wrap items-center justify-center gap-[9px] md:mt-[30px] md:gap-3`}
        >
          <Link className={primaryBtn} href="/app">
            Get started for free <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-[9px] rounded-[14px] border border-white/[0.09] px-3.5 text-[11px] font-semibold text-[#dedce6] transition duration-200 hover:border-white/[0.22] hover:bg-white/[0.04] md:min-h-[53px] md:px-[18px] md:text-[13px]"
            href="#how-it-works"
          >
            See how it works <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>

        <div
          data-reveal
          className={`${reveal} mt-[23px] flex flex-wrap items-center justify-center gap-1.5 md:mt-[30px] md:gap-[9px]`}
        >
          <span className="mb-0.5 w-full text-[11px] text-[#777581] md:mr-[3px] md:mb-0 md:w-auto">
            Works with
          </span>
          {platforms.map(platform => (
            <span
              key={platform}
              className="inline-flex items-center gap-[5px] rounded-lg border border-white/[0.09] px-[7px] py-[5px] text-[9px] text-[#c7c4ce] md:px-[9px] md:py-1.5 md:text-[10px]"
            >
              <Check size={12} aria-hidden="true" className="text-[#b9a1f2]" />
              {platform}
            </span>
          ))}
        </div>

        {/* product window */}
        <div
          data-reveal
          className={`${reveal} relative mt-[42px] w-[min(695px,100%)] animate-window-float rounded-[14px] border border-[rgba(206,190,241,0.19)] bg-[linear-gradient(145deg,rgba(25,24,33,0.96),rgba(13,13,18,0.97))] text-left shadow-[0_28px_90px_rgba(0,0,0,0.47),0_0_85px_rgba(136,91,214,0.12)] motion-reduce:animate-none md:mt-[67px] md:rounded-[18px]`}
        >
          <div className="grid h-[39px] grid-cols-3 items-center border-b border-white/[0.07] px-[11px] md:h-11 md:px-4">
            <div className="flex gap-[5px]" aria-hidden="true">
              <i className="size-[7px] rounded-full bg-[#e68d8f]" />
              <i className="size-[7px] rounded-full bg-[#ddb96d]" />
              <i className="size-[7px] rounded-full bg-[#7abe88]" />
            </div>
            <span className="text-center text-[8px] font-bold tracking-[0.15em] text-[#777481]">
              CLIPIO DOWNLOADER
            </span>
            <span className="flex items-center gap-[7px] justify-self-end text-[8px] tracking-[0.1em] text-[#aaa6b4]">
              <span className="size-[5px] rounded-full bg-[#89d9a3] shadow-[0_0_8px_rgba(137,217,163,0.8)]" />
              READY
            </span>
          </div>

          <div className="px-[13px] pt-[17px] pb-[15px] md:px-[26px] md:pt-6 md:pb-[19px]">
            <div className="mb-3.5 flex items-center gap-[9px] md:mb-[18px] md:gap-3">
              <span className="grid size-[38px] shrink-0 place-items-center rounded-[11px] border border-[rgba(190,162,255,0.18)] bg-[rgba(164,129,238,0.1)] text-[#c7b1ff]">
                <Link2 size={19} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <strong className="text-[11px] font-semibold text-[#f0eef5] md:text-[13px]">
                  Your next favorite clip
                </strong>
                <span className="text-[9px] text-[#898693] md:text-[11px]">
                  Paste a video link to get started
                </span>
              </div>
            </div>

            <div className="flex min-h-[54px] items-center gap-1.5 rounded-xl border border-white/[0.11] bg-[rgba(5,5,8,0.7)] p-1.5 md:min-h-[60px] md:gap-3 md:py-2 md:pr-[9px] md:pl-4">
              <span className="min-w-0 overflow-hidden text-[9px] text-ellipsis whitespace-nowrap text-[#8e8b99] md:text-[11px]">
                https://www.tiktok.com/@creator/video/...
              </span>
              <span className="hidden rounded-md border border-[rgba(244,113,181,0.18)] bg-[rgba(244,113,181,0.08)] px-[7px] py-[5px] text-[8px] font-bold tracking-[0.06em] text-[#f2a4ca] md:inline">
                TIKTOK
              </span>
              <Link
                href="/app"
                className="ml-auto inline-flex min-h-[38px] shrink-0 items-center gap-[5px] rounded-[9px] bg-[#bda2f6] px-2 text-[9px] font-bold text-[#1a1424] transition-colors duration-200 hover:bg-[#d1bdff] md:min-h-[39px] md:gap-[7px] md:px-3 md:text-[11px]"
              >
                <Download size={15} aria-hidden="true" />
                <span>Download</span>
              </Link>
            </div>

            <div className="mt-3.5 flex justify-between text-[8px] text-[#777481] md:text-[9px]">
              <span className="inline-flex items-center gap-[5px]">
                <ShieldCheck size={13} aria-hidden="true" className="text-[#aa91e8]" /> No sign-up required
              </span>
              <span className="inline-flex items-center gap-[5px]">Video &amp; MP3</span>
            </div>
          </div>

          {/* floating card */}
          <div
            aria-hidden="true"
            className="absolute -right-1.5 -bottom-[51px] flex min-h-[57px] animate-card-float items-center gap-2.5 rounded-[13px] border border-white/[0.11] bg-[rgba(25,24,32,0.97)] px-[9px] py-[7px] shadow-[0_14px_40px_rgba(0,0,0,0.36)] motion-reduce:animate-none md:-right-[47px] md:-bottom-7 md:min-h-[67px] md:px-[13px] md:py-2.5"
          >
            <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px] border border-[rgba(190,162,255,0.18)] bg-[rgba(164,129,238,0.1)] text-[#c7b1ff]">
              <Download size={16} />
            </span>
            <span className="flex flex-col gap-1">
              <strong className="text-[10px] font-semibold text-[#f0eef5]">Ready to save</strong>
              <small className="text-[8px] text-[#898693] md:text-[9px]">Your clip is just a click away</small>
            </span>
            <Check className="ml-1 text-[#8ed4a1]" size={16} />
          </div>
        </div>

        <a
          href="#how-it-works"
          className="group absolute bottom-[19px] flex items-center gap-3 text-[8px] font-bold tracking-[0.16em] text-[#777481] md:bottom-6"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="h-px w-[34px] bg-[#817c8a] transition-[width] duration-200 group-hover:w-[50px]" />
        </a>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="mx-auto w-[calc(100%_-_32px)] border-t border-white/[0.075] pt-[78px] pb-[83px] md:w-[min(1050px,calc(100%_-_64px))] md:pt-[106px] md:pb-[120px]"
      >
        <div data-reveal className={`${reveal} text-center`}>
          <span className={label}>THREE STEPS. THAT&apos;S IT.</span>
          <h2 className={`${h2} mt-[17px]`}>
            From link to <span className={gradientText}>saved.</span>
          </h2>
          <p className="mt-[15px] text-xs leading-[1.7] text-[#92919e] md:text-sm">
            All the good stuff, none of the busywork.
          </p>
        </div>

        <div className="mt-[46px] grid grid-cols-1 gap-[11px] md:grid-cols-3 md:gap-4">
          {steps.map(({ number, icon: Icon, title, description }, index) => (
            <article
              key={number}
              data-reveal
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`${reveal} relative rounded-[15px] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-[18px] hover:border-[rgba(190,162,255,0.28)] hover:bg-[rgba(167,130,239,0.055)] data-[visible=true]:hover:-translate-y-1 md:min-h-[196px] md:p-[21px]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#777481]">{number}</span>
                <span className={`${iconBox} size-[38px]`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-[15px] mb-[7px] text-[15px] font-semibold tracking-[-0.02em] text-[#f1eff5] md:mt-[23px]">
                {title}
              </h3>
              <p className="text-xs leading-[1.7] text-[#918e9b]">{description}</p>
              {index < steps.length - 1 && (
                <ArrowRight
                  className="absolute top-[31px] -right-[29px] z-[1] hidden text-[#777481] md:block"
                  size={20}
                  aria-hidden="true"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="mx-auto grid w-[calc(100%_-_32px)] grid-cols-1 items-center gap-[33px] border-t border-white/[0.075] pt-[75px] pb-[85px] md:w-[min(1050px,calc(100%_-_64px))] md:grid-cols-[0.9fr_1.1fr] md:gap-[90px] md:pt-[105px] md:pb-[120px]"
      >
        <div data-reveal className={reveal}>
          <span className={label}>MADE FOR THE MOMENTS</span>
          <h2 className={`${h2} mt-[19px]`}>
            More saving.
            <br />
            <span className={gradientText}>Less searching.</span>
          </h2>
          <p className="mt-[19px] mb-[22px] max-w-[370px] text-xs leading-[1.7] text-[#92919e] md:text-sm">
            Clipio makes keeping a video as easy as finding one. It works right
            in your browser and gets out of your way.
          </p>
          <Link
            href="/app"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#d0bcff]"
          >
            Try Clipio now
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="flex flex-col gap-[11px]">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              data-reveal
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`${reveal} grid grid-cols-[35px_1fr_16px] items-center gap-2.5 rounded-[13px] border border-white/[0.09] bg-white/[0.025] px-[11px] py-[13px] hover:border-[rgba(190,162,255,0.25)] data-[visible=true]:hover:translate-x-1 md:grid-cols-[39px_1fr_18px] md:gap-3.5 md:p-[17px]`}
            >
              <span className={`${iconBox} size-[34px] md:size-[38px]`}>
                <Icon size={19} aria-hidden="true" />
              </span>
              <div>
                <h3 className="mb-[5px] text-[13px] font-semibold tracking-[-0.02em] text-[#f1eff5] md:text-[15px]">
                  {title}
                </h3>
                <p className="text-[10px] leading-[1.7] text-[#918e9b] md:text-[11px]">{description}</p>
              </div>
              <Check className="text-[#9bd5a7]" size={17} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section
        data-reveal
        className={`${reveal} relative mx-auto mb-[46px] flex min-h-[280px] w-[calc(100%_-_32px)] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-[rgba(190,162,255,0.16)] bg-[linear-gradient(130deg,rgba(118,80,183,0.14),rgba(26,22,38,0.72)_54%,rgba(90,68,139,0.12))] px-[15px] py-[35px] text-center md:mb-[75px] md:min-h-[350px] md:w-[min(1050px,calc(100%_-_64px))] md:px-6 md:py-[55px]`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[150px] left-1/2 h-[300px] w-[450px] -translate-x-1/2 rounded-full bg-[rgba(151,105,235,0.14)] blur-[70px]"
        />
        <span className={`${label} relative`}>YOUR NEXT CLIP IS WAITING</span>
        <h2 className={`${h2} relative mt-[17px]`}>
          Ready when <span className={gradientText}>you are.</span>
        </h2>
        <p className="relative mt-3 mb-[23px] text-xs leading-[1.7] text-[#92919e] md:text-sm">
          Paste a link and make it yours. It really is that simple.
        </p>
        <Link className={`${primaryBtn} relative`} href="/app">
          Get started for free <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mx-auto flex min-h-[72px] w-[calc(100%_-_32px)] items-center justify-between border-t border-white/[0.07] md:min-h-[82px] md:w-[min(1180px,calc(100%_-_64px))]">
        <Link className={`${brand} text-[18px]`} href="/" aria-label="Clipio home">
          <Image src="/clipio.png" alt="" width={27} height={27} className="rounded-lg" />
          <span>clipio</span>
        </Link>
        <span className="max-w-[130px] text-center text-[11px] text-[#777481] md:max-w-none">
          Made for the clips worth keeping.
        </span>
        <a
          href="https://github.com/JesseJohn7/Clipio"
          target="_blank"
          rel="noreferrer"
          aria-label="Clipio on GitHub"
          className="grid size-[34px] place-items-center rounded-[10px] border border-white/[0.09] text-[#aaa7b2] transition duration-200 hover:border-white/25 hover:text-white"
        >
          <FaGithub size={17} aria-hidden="true" />
        </a>
      </footer>
    </main>
  )
}