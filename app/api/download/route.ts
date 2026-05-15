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

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

  const platform = detectPlatform(url)
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  await supabase.from('download_requests').insert({ url, platform, ip, status: 'pending' })

  const COBALT_URL = process.env.COBALT_API_URL

  if (!COBALT_URL) {
    return NextResponse.json({ error: 'Cobalt API not configured.' }, { status: 500 })
  }

  try {
    const cobaltRes = await fetch(`${COBALT_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url,
        videoQuality: 'max',
        filenameStyle: 'pretty',
        tiktokFullAudio: false,
      }),
    })

    const data = await cobaltRes.json()
    console.log('Cobalt response:', data)

    if (data.status === 'error') {
      await supabase.from('download_requests').update({ status: 'failed' }).eq('url', url)
      return NextResponse.json(
        { error: data.error?.code ?? 'Could not extract video. Make sure the link is public.' },
        { status: 422 }
      )
    }

    // 'picker' = carousel/multi-item (Instagram etc) — grab first item
    const downloadUrl = data.status === 'picker'
      ? data.picker?.[0]?.url
      : data.url

    if (!downloadUrl) {
      await supabase.from('download_requests').update({ status: 'failed' }).eq('url', url)
      return NextResponse.json({ error: 'No download link returned.' }, { status: 422 })
    }

    await supabase.from('download_requests').update({ status: 'success' }).eq('url', url)

    return NextResponse.json({
      downloadUrl,
      title: data.filename ?? 'video',
      platform,
    })

  } catch (err: any) {
    console.error('Download error:', err)
    await supabase.from('download_requests').update({ status: 'failed' }).eq('url', url)
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}