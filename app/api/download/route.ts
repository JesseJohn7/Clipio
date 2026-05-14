import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function detectPlatform(url: string): string {
  if (url.includes('tiktok.com')) return 'TikTok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X (Twitter)'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
  if (url.includes('instagram.com')) return 'Instagram'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  return 'Unknown'
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const platform = detectPlatform(url)
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    // ── 1. Log the request to Supabase ──────────────────────────────
    await supabase.from('download_requests').insert({
      url,
      platform,
      ip,
      status: 'pending',
    })

    // ── 2. Call RapidAPI (Social Download All In One) ─────────────
    try {
      const apiRes = await fetch(
        'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          },
          body: JSON.stringify({ url }),
        }
      )

      const data = await apiRes.json()

      // Check if the API returned success
      if (!data.status || data.status === 'error' || !data.download_link) {
        await supabase
          .from('download_requests')
          .update({ status: 'failed' })
          .eq('url', url)

        return NextResponse.json(
          { error: 'Could not extract video. Make sure the link is public and the video exists.' },
          { status: 422 }
        )
      }

      // Update status to success
      await supabase
        .from('download_requests')
        .update({ status: 'success' })
        .eq('url', url)

      return NextResponse.json({
        downloadUrl: data.download_link,
        title: data.title ?? data.filename ?? 'Video',
        platform,
      })
    } catch (apiErr) {
      console.error('RapidAPI Error:', apiErr)
      
      await supabase
        .from('download_requests')
        .update({ status: 'failed' })
        .eq('url', url)

      return NextResponse.json(
        { error: 'Failed to process video. Please try again.' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('Route Error:', err)
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    )
  }
}
