import fs from 'fs'
import path from 'path'

export function exportVault(vaultPath: string, outputPath: string): void {
  if (!fs.existsSync(vaultPath)) {
    console.error(`\n❌ Vault not found at: ${vaultPath}`)
    console.error('Run ingest first: personal-tree ingest <file>\n')
    process.exit(1)
  }

  const resolvedOutput = path.resolve(outputPath)
  console.log(`\n📦 Exporting vault from: ${vaultPath}`)
  console.log(`   Destination:         ${resolvedOutput}\n`)

  let concatenatedContent = `# Personal Tree Export\n\n`
  concatenatedContent += `This file contains a concatenated dump of all knowledge vault entries, optimized for consumption by AI agents.\n\n`

  // 1. Process index.md if it exists
  const indexPath = path.join(vaultPath, 'index.md')
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8')
    concatenatedContent += `---
## File: index.md

${indexContent.trim()}

`
  }

  // 2. Process topics
  const topicsDir = path.join(vaultPath, 'topics')
  if (fs.existsSync(topicsDir)) {
    const files = fs.readdirSync(topicsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
    
    for (const file of files) {
      const filePath = path.join(topicsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      concatenatedContent += `---
## File: topics/${file}

${content.trim()}

`
    }
  }

  // 3. Process concepts
  const conceptsDir = path.join(vaultPath, 'concepts')
  if (fs.existsSync(conceptsDir)) {
    const files = fs.readdirSync(conceptsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
    
    for (const file of files) {
      const filePath = path.join(conceptsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      concatenatedContent += `---
## File: concepts/${file}

${content.trim()}

`
    }
  }

  // 4. Process any other root/subfolder markdown files (excluding index, topics, concepts, and output file itself)
  function processOtherFiles(dir: string) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        if (file !== 'topics' && file !== 'concepts') {
          processOtherFiles(fullPath)
        }
      } else if (file.endsWith('.md') && fullPath !== indexPath && fullPath !== resolvedOutput) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const relativeName = path.relative(vaultPath, fullPath)
        concatenatedContent += `---
## File: ${relativeName}

${content.trim()}

`
      }
    }
  }

  processOtherFiles(vaultPath)

  // Write concatenated content to output file
  fs.writeFileSync(resolvedOutput, concatenatedContent)

  const sizeBytes = fs.statSync(resolvedOutput).size
  console.log(`✅ Done!`)
  console.log(`   Exported to: ${resolvedOutput}`)
  console.log(`   Size:        ${sizeBytes.toLocaleString()} bytes\n`)
}
