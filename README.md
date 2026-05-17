# 🌳 personal-tree

> Turn any PDF or text into a structured personal knowledge tree. Local. Offline. Yours.

Drop a file. Get a structured knowledge base in your Obsidian vault. No account. No cloud. No setup beyond 2 commands.

```bash
npx personal-tree ingest research-paper.pdf
```

---

## How it works

```
Your file (PDF / .txt / .md)
       ↓
  Chunks the text
       ↓
  Local LLM (Ollama) or Claude API
       ↓
  Extracts: topics, concepts, relationships
       ↓
  Writes structured Markdown to your vault
       ↓
  Open in Obsidian — explore your knowledge graph
```

---

## Install

```bash
# Run directly (no install)
npx personal-tree ingest yourfile.pdf

# Or install globally
npm install -g personal-tree
personal-tree ingest yourfile.pdf
```

**Requirements:** Node.js 18+

---

## Usage

### Ingest a file
```bash
personal-tree ingest paper.pdf
personal-tree ingest notes.txt
personal-tree ingest article.md

# Custom vault location
personal-tree ingest paper.pdf --vault ~/my-obsidian-vault
```

### Check your tree stats
```bash
personal-tree status
personal-tree status --vault ~/my-obsidian-vault
```

---

## LLM Setup

### Option A — Fully local (offline, free)
```bash
# Install Ollama
brew install ollama   # macOS
# or: https://ollama.ai

# Pull a model
ollama pull llama3

# Start Ollama
ollama serve

# Run personal-tree — it auto-detects Ollama
personal-tree ingest yourfile.pdf
```

### Option B — Claude API (higher quality)
```bash
export ANTHROPIC_API_KEY=your_key_here
personal-tree ingest yourfile.pdf
```

personal-tree automatically uses Claude API if `ANTHROPIC_API_KEY` is set, otherwise falls back to Ollama.

---

## Output structure

```
vault/
├── index.md              ← your growing knowledge index
├── topics/
│   ├── machine-learning.md
│   └── neural-networks.md
└── concepts/
    ├── transformer-architecture.md
    ├── attention-mechanism.md
    └── backpropagation.md
```

Every file uses Obsidian wikilinks (`[[concept-name]]`) so your graph view lights up automatically.

---

## Why not NotebookLM / Mem / Notion AI?

| | personal-tree | NotebookLM | Mem | OpenHuman |
|---|---|---|---|---|
| Local / offline | ✅ | ❌ | ❌ | ✅ |
| No account needed | ✅ | ❌ | ❌ | ❌ |
| Obsidian output | ✅ | ❌ | ❌ | ✅ |
| Just a file drop | ✅ | ✅ | ❌ | ❌ |
| No heavy install | ✅ | ✅ | ✅ | ❌ |
| Growing tree | ✅ | ❌ | ✅ | ✅ |

---

## Roadmap

- [x] PDF / txt / md ingestion
- [x] Ollama (local) + Claude API support
- [x] Obsidian-compatible Markdown output
- [x] Growing tree (merge on re-ingest)
- [ ] Web UI (drag and drop, no CLI needed)
- [ ] URL ingestion
- [ ] Semantic search across vault
- [ ] Watch folder (auto-ingest new files)
- [ ] Voice input

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT
