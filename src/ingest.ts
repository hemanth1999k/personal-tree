import ora from 'ora'
import { parseFile } from './parse.js'
import { fetchUrlContent } from './url.js'
import { chunkText } from './chunk.js'
import { extract } from './llm.js'
import { buildTree } from './tree.js'
import type { Extraction } from './llm.js'

export async function ingest(filePath: string, vaultPath: string): Promise<void> {
  const spinner = ora()

  const isUrl = filePath.startsWith('http://') || filePath.startsWith('https://')

  spinner.start(isUrl ? 'Fetching URL...' : 'Reading file...')
  const text = isUrl ? await fetchUrlContent(filePath) : await parseFile(filePath)
  spinner.succeed(isUrl ? `Fetched URL (${text.length.toLocaleString()} characters)` : `Read ${text.length.toLocaleString()} characters`)

  spinner.start('Chunking text...')
  const chunks = chunkText(text)
  spinner.succeed(`Split into ${chunks.length} chunks`)

  const extractions: Extraction[] = []
  for (let i = 0; i < chunks.length; i++) {
    spinner.start(`Extracting knowledge (${i + 1}/${chunks.length})...`)
    try {
      const extraction = await extract(chunks[i])
      extractions.push(extraction)
    } catch (err) {
      spinner.warn(`Chunk ${i + 1} failed: ${(err as Error).message}`)
    }
  }
  spinner.succeed(`Extracted knowledge from ${extractions.length} chunks`)

  spinner.start('Building knowledge tree...')
  buildTree(vaultPath, extractions, filePath)
  spinner.succeed(`Tree built at ${vaultPath}`)

  const totalConcepts = new Set(extractions.flatMap(e => e.concepts.map(c => c.name))).size
  const totalTopics = new Set(extractions.flatMap(e => e.topics)).size

  console.log(`
✅ Done!
   📚 ${totalConcepts} concepts extracted
   🏷️  ${totalTopics} topics identified
   📁 Vault: ${vaultPath}
   🔗 Open index.md in Obsidian to explore
`)
}
