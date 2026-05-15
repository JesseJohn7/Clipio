import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

  let decodedUrl: string
  try {
    decodedUrl = decodeURIComponent(url)
    new URL(decodedUrl)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    // Forward range header if browser sends one (enables seek + partial download)
    const rangeHeader = req.headers.get('range')

    const upstream = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
    })

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') ?? 'video/mp4'
    const contentLength = upstream.headers.get('content-length')
    const contentRange = upstream.headers.get('content-range')
    const acceptRanges = upstream.headers.get('accept-ranges')

    const resHeaders = new Headers({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      // Tell browser this is a download
      'Content-Disposition': `attachment; filename="dropclip-video.mp4"`,
    })

    if (contentLength) resHeaders.set('Content-Length', contentLength)
    if (contentRange) resHeaders.set('Content-Range', contentRange)
    if (acceptRanges) resHeaders.set('Accept-Ranges', acceptRanges)

    // Stream directly — no buffering, bytes flow straight to the client
    return new NextResponse(upstream.body, {
      status: upstream.status === 206 ? 206 : 200,
      headers: resHeaders,
    })

  } catch (err: any) {
    console.error('Proxy error:', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}