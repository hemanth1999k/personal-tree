#!/usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import fs from 'fs'
import { ingest } from './ingest.js'

const program = new Command()

program
  .name('personal-tree')
  .description('Turn any PDF or text into a structured personal knowledge tree. Local. Offline. Yours.')
  .version('0.1.0')

program
  .command('ingest <file>')
  .description('Ingest a file and build your knowledge tree')
  .option('-v, --vault <path>', 'Path to your vault folder', './vault')
  .action(async (file: string, options: { vault: string }) => {
    const filePath = path.resolve(file)
    const vaultPath = path.resolve(options.vault)

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`)
      process.exit(1)
    }

    fs.mkdirSync(vaultPath, { recursive: true })

    console.log(`\n🌳 personal-tree`)
    console.log(`   File:  ${filePath}`)
    console.log(`   Vault: ${vaultPath}`)
    console.log(`   LLM:   ${process.env.ANTHROPIC_API_KEY ? 'Claude API' : 'Ollama (local)'}\n`)

    await ingest(filePath, vaultPath)
  })

program
  .command('status')
  .description('Show your current knowledge tree stats')
  .option('-v, --vault <path>', 'Path to your vault folder', './vault')
  .action((options: { vault: string }) => {
    const vaultPath = path.resolve(options.vault)

    if (!fs.existsSync(vaultPath)) {
      console.log('No vault found. Run: personal-tree ingest <file>')
      return
    }

    const topics = fs.existsSync(path.join(vaultPath, 'topics'))
      ? fs.readdirSync(path.join(vaultPath, 'topics')).length
      : 0
    const concepts = fs.existsSync(path.join(vaultPath, 'concepts'))
      ? fs.readdirSync(path.join(vaultPath, 'concepts')).length
      : 0

    console.log(`\n🌳 Your Knowledge Tree`)
    console.log(`   📁 Vault:    ${vaultPath}`)
    console.log(`   🏷️  Topics:   ${topics}`)
    console.log(`   💡 Concepts: ${concepts}\n`)
  })

program.parse()
