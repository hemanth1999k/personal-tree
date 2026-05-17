const CHUNK_SIZE = 1500
const CHUNK_OVERLAP = 150

export function chunkText(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  const words = cleaned.split(' ')
  const chunks: string[] = []

  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ')
    if (chunk.trim()) chunks.push(chunk)
    i += CHUNK_SIZE - CHUNK_OVERLAP
  }

  return chunks
}
