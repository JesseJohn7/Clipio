import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  let decodedUrl: string
  try {
    decodedUrl = decodeURIComponent(url)
    new URL(decodedUrl) // validate it's a real URL
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const upstream = await fetch(decodedUrl, {
      headers: {
        // Instagram & Facebook need these or they reject the request
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    })

    if (!upstream.ok) {
      console.error('Upstream error:', upstream.status, upstream.statusText)
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 }
      )
    }

    const contentType = upstream.headers.get('content-type') ?? 'video/mp4'
    const contentLength = upstream.headers.get('content-length')

    const resHeaders = new Headers({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    })

    if (contentLength) resHeaders.set('Content-Length', contentLength)

    return new NextResponse(upstream.body, {
      status: 200,
      headers: resHeaders,
    })

  } catch (err: any) {
    console.error('Proxy fetch error:', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}