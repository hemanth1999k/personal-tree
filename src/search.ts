import fs from 'fs'
import path from 'path'

interface SearchResult {
  filePath: string
  relativeName: string
  titleMatch: boolean
  snippets: { lineNum: number; text: string }[]
}

export function searchVault(vaultPath: string, query: string): void {
  if (!fs.existsSync(vaultPath)) {
    console.error(`\n❌ Vault not found at: ${vaultPath}`)
    console.error('Run ingest first: personal-tree ingest <file>\n')
    process.exit(1)
  }

  console.log(`\n🔍 Searching vault for: "${query}"...\n`)

  const results: SearchResult[] = []
  const queryLower = query.toLowerCase()

  function traverse(dir: string) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const relativeName = path.relative(vaultPath, fullPath)
        const fileNameNoExt = path.basename(file, '.md')

        const titleMatch = fileNameNoExt.toLowerCase().includes(queryLower)
        const snippets: { lineNum: number; text: string }[] = []

        const lines = content.split('\n')
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(queryLower)) {
            snippets.push({
              lineNum: index + 1,
              text: line.trim()
            })
          }
        })

        if (titleMatch || snippets.length > 0) {
          results.push({
            filePath: fullPath,
            relativeName,
            titleMatch,
            snippets
          })
        }
      }
    }
  }

  traverse(vaultPath)

  if (results.length === 0) {
    console.log(`No matches found for "${query}".\n`)
    return
  }

  // Separate index, topics, concepts for clear presentation
  const indexMatches = results.filter(r => r.relativeName === 'index.md')
  const topicMatches = results.filter(r => r.relativeName.startsWith('topics/'))
  const conceptMatches = results.filter(r => r.relativeName.startsWith('concepts/'))
  const otherMatches = results.filter(
    r => r.relativeName !== 'index.md' &&
         !r.relativeName.startsWith('topics/') &&
         !r.relativeName.startsWith('concepts/')
  )

  const highlight = (text: string, q: string) => {
    const regex = new RegExp(`(${escapeRegExp(q)})`, 'gi')
    return text.replace(regex, '\x1b[33m\x1b[1m$1\x1b[0m') // Bold Yellow
  }

  if (conceptMatches.length > 0) {
    console.log(`\x1b[36m\x1b[1m💡 Concepts (${conceptMatches.length})\x1b[0m`)
    conceptMatches.forEach(r => {
      const title = path.basename(r.relativeName, '.md')
      console.log(`  • \x1b[1m${highlight(title, query)}\x1b[0m (${r.relativeName})`)
      r.snippets.forEach(s => {
        console.log(`    \x1b[90mLine ${s.lineNum}:\x1b[0m ${highlight(s.text, query)}`)
      })
    })
    console.log()
  }

  if (topicMatches.length > 0) {
    console.log(`\x1b[36m\x1b[1m🏷️  Topics (${topicMatches.length})\x1b[0m`)
    topicMatches.forEach(r => {
      const title = path.basename(r.relativeName, '.md')
      console.log(`  • \x1b[1m${highlight(title, query)}\x1b[0m (${r.relativeName})`)
      r.snippets.forEach(s => {
        console.log(`    \x1b[90mLine ${s.lineNum}:\x1b[0m ${highlight(s.text, query)}`)
      })
    })
    console.log()
  }

  if (indexMatches.length > 0) {
    console.log(`\x1b[36m\x1b[1m📇 Index Matches\x1b[0m`)
    indexMatches.forEach(r => {
      console.log(`  • \x1b[1mindex.md\x1b[0m`)
      r.snippets.forEach(s => {
        console.log(`    \x1b[90mLine ${s.lineNum}:\x1b[0m ${highlight(s.text, query)}`)
      })
    })
    console.log()
  }

  if (otherMatches.length > 0) {
    console.log(`\x1b[36m\x1b[1m📄 Other Files (${otherMatches.length})\x1b[0m`)
    otherMatches.forEach(r => {
      console.log(`  • \x1b[1m${highlight(r.relativeName, query)}\x1b[0m`)
      r.snippets.forEach(s => {
        console.log(`    \x1b[90mLine ${s.lineNum}:\x1b[0m ${highlight(s.text, query)}`)
      })
    })
    console.log()
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
