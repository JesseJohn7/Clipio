import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isLinkedInUrl, getLinkedInVideo } from '@/lib/extractors/linkedin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function detectPlatform(url: string) {
  if (isLinkedInUrl(url)) return 'LinkedIn'
  if (url.includes('tiktok.com')) return 'TikTok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X (Twitter)'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  return 'Unknown'
}

type MediaType = 'video' | 'image'

type ExtractResult =
  | { ok: true; downloadUrl: string; mediaType: MediaType }
  | { ok: false; error: string; status: number }

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|avif)(\?|$)/i

function buildFilename(platform: string, mediaType: MediaType): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const ext = mediaType === 'image' ? 'jpg' : 'mp4'
  return `Clipio-${platform}-${timestamp}.${ext}`
}

// ── Quality type ──────────────────────────────────────────────────────────────
export type VideoQuality = '1080' | '720' | '480'

async function fetchFromCobalt(
  url: string,
  quality: VideoQuality = '720'
): Promise<ExtractResult> {
  const COBALT_URL = process.env.COBALT_API_URL
  if (!COBALT_URL) {
    return { ok: false, error: 'Cobalt API not configured.', status: 500 }
  }

  try {
    const cobaltRes = await fetch(`${COBALT_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        url,
        videoQuality: quality,
        filenameStyle: 'pretty',
        tiktokFullAudio: false,
      }),
    })

    if (!cobaltRes.ok) {
      const text = await cobaltRes.text()
      console.error('Cobalt non-200:', cobaltRes.status, text)
      return { ok: false, error: 'Could not reach download service. Try again.', status: 502 }
    }

    const data = await cobaltRes.json()

    // Temporary debug log: shows exactly what Cobalt returned (check Vercel logs)
    console.log('Cobalt response:', JSON.stringify({ status: data.status, filename: data.filename, picker: data.picker?.map((p: any) => p.type) }))

    if (data.status === 'error') {
      return {
        ok: false,
        error: data.error?.code ?? 'Could not extract video. Make sure the link is public.',
        status: 422,
      }
    }

    let downloadUrl: string | undefined
    let mediaType: MediaType = 'video'

    if (data.status === 'picker') {
      // Prefer a real video; otherwise fall back to the first item and detect its type
      const firstVideo = data.picker?.find((item: any) => item.type === 'video')
      const chosen = firstVideo ?? data.picker?.[0]
      downloadUrl = chosen?.url
      mediaType = chosen?.type === 'photo' || (chosen?.url && IMAGE_EXT.test(chosen.url)) ? 'image' : 'video'
    } else {
      downloadUrl = data.url
      mediaType = data.filename && IMAGE_EXT.test(data.filename) ? 'image' : 'video'
    }

    if (!downloadUrl) {
      return { ok: false, error: 'No download link returned.', status: 422 }
    }

    return { ok: true, downloadUrl, mediaType }
  } catch (err: any) {
    console.error('Cobalt fetch error:', err)
    return { ok: false, error: 'Server error. Try again.', status: 500 }
  }
}

// ── LinkedIn (Cobalt doesn't handle it, so we use our own extractor) ─────────
async function fetchFromLinkedIn(url: string): Promise<ExtractResult> {
  try {
    const data = await getLinkedInVideo(url)
    return { ok: true, downloadUrl: data.videoUrl, mediaType: 'video' }
  } catch (err: any) {
    console.error('LinkedIn extract error:', err)
    return {
      ok: false,
      error: err?.message ?? 'Could not extract LinkedIn video. Make sure the post is public.',
      status: 422,
    }
  }
}

async function logDownload(url: string, platform: string, ip: string, quality: string) {
  const { error } = await supabase
    .from('download_requests')
    .insert({ url, platform, ip, status: 'success', quality })
  if (error) console.error('Supabase log error:', error)
}

export async function POST(req: NextRequest) {
  let body: { url?: string; quality?: VideoQuality }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { url, quality } = body

  if (!url || typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'URL is required.' }, { status: 400 })
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const platform = detectPlatform(url)

  const selectedQuality: VideoQuality =
    quality && ['1080', '720', '480'].includes(quality) ? quality : '1080'

  // LinkedIn → own extractor, everything else → Cobalt
  const result =
    platform === 'LinkedIn'
      ? await fetchFromLinkedIn(url)
      : await fetchFromCobalt(url, selectedQuality)

   if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  // This app is video-only: reject photo posts instead of saving an image
  if (result.mediaType === 'image') {
    return NextResponse.json(
      { error: 'This post has no video, only photos. Try a link to a video or Reel.' },
      { status: 422 }
    )
  }

  // LinkedIn serves a single source quality, so log it as 'original'
  await logDownload(url, platform, ip, platform === 'LinkedIn' ? 'original' : selectedQuality)

  return NextResponse.json({
    downloadUrl: result.downloadUrl,
    title: buildFilename(platform, result.mediaType),
    platform,
    mediaType: result.mediaType,
    quality: selectedQuality, // kept so your existing UI types don't break
  })
}