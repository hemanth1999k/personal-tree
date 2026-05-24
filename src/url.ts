import { URL } from 'url'

export async function fetchUrlContent(urlStr: string): Promise<string> {
  const response = await fetch(urlStr, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  return cleanHtml(html)
}

export function urlToFilenameSlug(urlStr: string): string {
  try {
    const url = new URL(urlStr)
    const host = url.hostname.replace('www.', '')
    const pathPart = url.pathname.replace(/(^\/|\/$)/g, '').replace(/\//g, '-')
    const queryPart = url.search ? '-' + url.search.replace(/[^a-zA-Z0-9]/g, '-') : ''
    const full = `${host}-${pathPart}${queryPart}`.replace(/-+/g, '-').replace(/(^-|-$)/g, '')
    return full || host
  } catch {
    return urlStr.replace(/[^a-zA-Z0-9]/g, '-')
  }
}

function cleanHtml(html: string): string {
  let text = html

  // Remove scripts, styles, SVGs, and nav/header/footer content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
  text = text.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
  text = text.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
  text = text.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]*>/g, ' ')

  // Decode common HTML entities
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ndash;': '-',
    '&mdash;': '-'
  }

  for (const [entity, replacement] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, 'g'), replacement)
  }

  // Normalize whitespaces and lines
  text = text.replace(/[ \t]+/g, ' ')
  text = text.replace(/\n\s*\n/g, '\n\n')
  return text.trim()
}
