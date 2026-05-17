import Anthropic from '@anthropic-ai/sdk'

export interface Extraction {
  title: string
  summary: string
  topics: string[]
  concepts: { name: string; definition: string }[]
  relationships: { from: string; to: string; type: string }[]
}

const EXTRACTION_PROMPT = (chunk: string) => `
You are a knowledge extraction engine. Analyze the following text and extract structured knowledge.

Return ONLY valid JSON in this exact format:
{
  "title": "short descriptive title for this content",
  "summary": "2-3 sentence summary",
  "topics": ["topic1", "topic2", "topic3"],
  "concepts": [
    { "name": "concept name", "definition": "one sentence definition" }
  ],
  "relationships": [
    { "from": "concept A", "to": "concept B", "type": "relates to" }
  ]
}

TEXT:
${chunk}
`

export async function extractWithClaude(chunk: string): Promise<Extraction> {
  const client = new Anthropic()
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: EXTRACTION_PROMPT(chunk) }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('LLM did not return valid JSON')
  return JSON.parse(jsonMatch[0]) as Extraction
}

export async function extractWithOllama(chunk: string, model = 'llama3'): Promise<Extraction> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: EXTRACTION_PROMPT(chunk),
      stream: false,
    }),
  })

  if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`)
  const data = (await response.json()) as { response: string }
  const jsonMatch = data.response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Ollama did not return valid JSON')
  return JSON.parse(jsonMatch[0]) as Extraction
}

export async function extract(chunk: string): Promise<Extraction> {
  // Try Ollama first (local/offline), fall back to Claude API
  if (!process.env.ANTHROPIC_API_KEY) {
    try {
      return await extractWithOllama(chunk)
    } catch {
      throw new Error(
        'Ollama not running and no ANTHROPIC_API_KEY set.\n' +
        'Run: ollama serve\n' +
        'Or set: export ANTHROPIC_API_KEY=your_key'
      )
    }
  }
  return await extractWithClaude(chunk)
}
