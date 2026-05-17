# 🌳 personal-tree

> Your personal knowledge vault — so your AI agents always know what you know.

Drop any file. Get a structured, growing knowledge base your AI agents can actually read and reference. No account. No cloud. No setup beyond 2 commands.

```bash
npx personal-tree ingest research-paper.pdf
```

The real power isn't the Markdown files — it's that your vault becomes a **persistent memory layer** for any AI agent you use. Instead of pasting documents into every chat, your agents already know everything you've ingested. Point Claude Code, Cursor, or any AI at your vault and it instantly has context across all your knowledge.

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

## Use your vault as AI agent memory

Once your vault is built, point any AI tool at it. Your agents now have instant context across everything you've ever ingested.

---

### Claude Code

Add this to your project's `CLAUDE.md` or drop a `.claude/CLAUDE.md` in your vault folder:

```markdown
## My Knowledge Vault

My personal knowledge base is located at `~/vault` (or wherever you set --vault).

When I ask questions about topics I've researched, read the relevant files in:
- `~/vault/index.md` — full index of everything ingested
- `~/vault/topics/` — topic-level summaries
- `~/vault/concepts/` — individual concept definitions with relationships

Always check the vault before answering questions about my research, notes, or documents.
```

Then just talk to Claude Code naturally:
```
"What do I know about transformer architecture?"
"Summarize everything I've ingested about machine learning"
"What are the gaps in my research on neural networks?"
```

---

### Cursor / VS Code

Add your vault path to Cursor's context:

1. Open Cursor Settings → Features → Docs
2. Add your vault path: `~/vault`
3. Cursor indexes all `.md` files and uses them in every chat

---

### Any AI with file access (ChatGPT, Claude.ai)

```bash
# Export your full index as a single context file
cat ~/vault/index.md ~/vault/topics/*.md ~/vault/concepts/*.md > my-knowledge-context.txt
```

Paste or upload `my-knowledge-context.txt` to any AI chat. It now has your full knowledge base as context.

---

### Custom agent / MCP server (advanced)

Point any MCP-compatible agent at your vault folder — it's all plain Markdown, so any tool that can read files can use it as a knowledge source.

```bash
# Your vault is just files — any agent can read it
ls ~/vault/concepts/    # individual concept files
cat ~/vault/index.md    # full knowledge index
```

---

### Who gets the most value

| User | What they ingest | What their agent can answer |
|---|---|---|
| **Student** | Research papers, textbooks | "What do I know about X topic across all my papers?" |
| **Developer** | Docs, RFCs, architecture notes | "What did we decide about the auth flow?" |
| **PM** | PRDs, meeting notes, competitor research | "What were our Q1 product decisions?" |
| **Researcher** | Papers, articles, field notes | "What gaps exist across everything I've read?" |
| **Writer** | Books, articles, interviews | "What sources support this argument?" |

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
