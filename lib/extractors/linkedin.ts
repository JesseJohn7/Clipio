const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

export const isLinkedInUrl = (input: string) => {
  try {
    const host = new URL(input).hostname.replace(/^www\./, '')
    return host === 'linkedin.com' || host === 'lnkd.in'
  } catch {
    return false
  }
}

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const meta = (html: string, prop: string) => {
  const m = html.match(
    new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, 'i'),
  )
  return m ? decode(m[1]) : undefined
}

export async function getLinkedInVideo(url: string) {
  if (!isLinkedInUrl(url)) throw new Error('Not a LinkedIn URL')

  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    redirect: 'follow',
  })

  if (res.status === 999 || res.status === 429) {
    throw new Error('LinkedIn blocked the request. Try again later.')
  }
  if (!res.ok) throw new Error(`LinkedIn returned ${res.status}`)

  const html = await res.text()

  // 1) Preferred: <video data-sources="[{...}]">
  let videoUrl: string | undefined
  const sources = html.match(/data-sources="([^"]+)"/)
  if (sources) {
    try {
      const list = JSON.parse(decode(sources[1])) as { src: string; type?: string }[]
      videoUrl = list.find(s => s.type?.includes('mp4'))?.src ?? list[0]?.src
    } catch {
      /* fall through */
    }
  }

  // 2) Fallback: Open Graph tag
  videoUrl ??= meta(html, 'og:video:secure_url') ?? meta(html, 'og:video')

  if (!videoUrl) {
    throw new Error('No video found. The post may be private or not a video.')
  }

  return {
    platform: 'linkedin' as const,
    title: meta(html, 'og:title') ?? 'LinkedIn video',
    thumbnail: meta(html, 'og:image'),
    videoUrl: decode(videoUrl),
  }
} 