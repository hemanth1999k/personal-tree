import fs from 'fs'
import path from 'path'
import type { Extraction } from './llm.js'
import { urlToFilenameSlug } from './url.js'

export function buildTree(vaultPath: string, extractions: Extraction[], sourceFile: string): void {
  fs.mkdirSync(path.join(vaultPath, 'topics'), { recursive: true })
  fs.mkdirSync(path.join(vaultPath, 'concepts'), { recursive: true })

  const allTopics = new Set<string>()
  const allConcepts = new Map<string, string>()

  for (const extraction of extractions) {
    extraction.topics.forEach(t => allTopics.add(t))
    extraction.concepts.forEach(c => {
      if (!allConcepts.has(c.name)) {
        allConcepts.set(c.name, c.definition)
      }
    })
  }

  // Write concept files
  for (const [name, definition] of allConcepts) {
    const slug = slugify(name)
    const filePath = path.join(vaultPath, 'concepts', `${slug}.md`)
    const related = findRelatedConcepts(name, extractions)

    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
    const newContent = mergeConceptFile(existing, name, definition, related, sourceFile)
    fs.writeFileSync(filePath, newContent)
  }

  // Write topic files
  for (const topic of allTopics) {
    const slug = slugify(topic)
    const filePath = path.join(vaultPath, 'topics', `${slug}.md`)
    const relatedConcepts = extractions
      .flatMap(e => e.concepts.map(c => c.name))
      .filter((v, i, a) => a.indexOf(v) === i)

    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
    const newContent = mergeTopicFile(existing, topic, relatedConcepts, sourceFile)
    fs.writeFileSync(filePath, newContent)
  }

  // Write/update index
  updateIndex(vaultPath, extractions, sourceFile, allTopics, allConcepts)
}

function mergeConceptFile(
  existing: string,
  name: string,
  definition: string,
  related: string[],
  source: string
): string {
  const isUrl = source.startsWith('http://') || source.startsWith('https://')
  const sourceRefName = isUrl ? urlToFilenameSlug(source) : path.basename(source, path.extname(source))

  if (existing) {
    // Append new source reference if not already there
    if (!existing.includes(sourceRefName)) {
      return existing + `\n> Also referenced in: [[${sourceRefName}]]\n`
    }
    return existing
  }

  const relatedLinks = related.map(r => `- [[${slugify(r)}|${r}]]`).join('\n')
  return `# ${name}

${definition}

## Sources
- [[${sourceRefName}]]

## Related Concepts
${relatedLinks || '_None yet_'}
`
}

function mergeTopicFile(
  existing: string,
  topic: string,
  concepts: string[],
  source: string
): string {
  const isUrl = source.startsWith('http://') || source.startsWith('https://')
  const sourceRefName = isUrl ? urlToFilenameSlug(source) : path.basename(source, path.extname(source))

  if (existing) {
    if (!existing.includes(sourceRefName)) {
      return existing + `\n> Also covered in: [[${sourceRefName}]]\n`
    }
    return existing
  }

  const conceptLinks = concepts.map(c => `- [[${slugify(c)}|${c}]]`).join('\n')
  return `# ${topic}

## Sources
- [[${sourceRefName}]]

## Concepts in this Topic
${conceptLinks || '_None yet_'}
`
}

function updateIndex(
  vaultPath: string,
  extractions: Extraction[],
  sourceFile: string,
  topics: Set<string>,
  concepts: Map<string, string>
): void {
  const indexPath = path.join(vaultPath, 'index.md')
  const existing = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8') : ''

  const isUrl = sourceFile.startsWith('http://') || sourceFile.startsWith('https://')
  const sourceName = isUrl ? urlToFilenameSlug(sourceFile) : path.basename(sourceFile, path.extname(sourceFile))
  const summary = extractions[0]?.summary ?? ''
  const topicLinks = [...topics].map(t => `  - [[topics/${slugify(t)}|${t}]]`).join('\n')
  const conceptLinks = [...concepts.keys()].map(c => `  - [[concepts/${slugify(c)}|${c}]]`).join('\n')

  const entry = `
## ${sourceName}

> ${summary}

**Topics:**
${topicLinks}

**Concepts:**
${conceptLinks}

---
`

  if (existing.includes(`## ${sourceName}`)) return

  const header = existing || `# Personal Tree — Knowledge Index\n\nYour growing knowledge base.\n`
  fs.writeFileSync(indexPath, header + entry)
}

function findRelatedConcepts(name: string, extractions: Extraction[]): string[] {
  const related = new Set<string>()
  for (const e of extractions) {
    for (const r of e.relationships) {
      if (r.from === name) related.add(r.to)
      if (r.to === name) related.add(r.from)
    }
  }
  return [...related].filter(r => r !== name)
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
