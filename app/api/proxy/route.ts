import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'No URL' }, { status: 400 })

  try {
    const upstream = await fetch(decodeURIComponent(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://cobalt.tools/',
      },
    })

    if (!upstream.ok) return NextResponse.json({ error: 'Upstream failed' }, { status: 502 })

    const contentType = upstream.headers.get('content-type') ?? 'video/mp4'
    const contentLength = upstream.headers.get('content-length')

    const headers = new Headers({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    })
    if (contentLength) headers.set('Content-Length', contentLength)

    return new NextResponse(upstream.body, { status: 200, headers })
  } catch {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}