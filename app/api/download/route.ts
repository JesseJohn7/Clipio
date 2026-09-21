import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function detectPlatform(url: string) {
  if (url.includes('tiktok.com')) return 'TikTok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X (Twitter)'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  return 'Unknown'
}

function buildFilename(platform: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `Clipio-${platform}-${timestamp}.mp4`
}

// ── Quality type ──────────────────────────────────────────────────────────────
export type VideoQuality = '1080' | '720' | '480'

async function fetchFromCobalt(
  url: string,
  quality: VideoQuality = '720'
): Promise<{ ok: true; downloadUrl: string } | { ok: false; error: string; status: number }> {
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
        videoQuality: quality,   // ← pass quality directly to Cobalt
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

    if (data.status === 'error') {
      return {
        ok: false,
        error: data.error?.code ?? 'Could not extract video. Make sure the link is public.',
        status: 422,
      }
    }

    let downloadUrl: string | undefined

    if (data.status === 'picker') {
      const firstVideo = data.picker?.find((item: any) => item.type === 'video') ?? data.picker?.[0]
      downloadUrl = firstVideo?.url
    } else {
      downloadUrl = data.url
    }

    if (!downloadUrl) {
      return { ok: false, error: 'No download link returned.', status: 422 }
    }

    return { ok: true, downloadUrl }
  } catch (err: any) {
    console.error('Cobalt fetch error:', err)
    return { ok: false, error: 'Server error. Try again.', status: 500 }
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

  const cobaltResult = await fetchFromCobalt(url, selectedQuality)

  if (!cobaltResult.ok) {
    return NextResponse.json({ error: cobaltResult.error }, { status: cobaltResult.status })
  }

  await logDownload(url, platform, ip, selectedQuality)

  return NextResponse.json({
    downloadUrl: cobaltResult.downloadUrl,
    title: buildFilename(platform),
    platform,
    quality: selectedQuality,
  })
}