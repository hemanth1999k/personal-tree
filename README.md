# 🌳 Personal Tree

> The simplest way to turn your files into AI memory. Inspired by Karpathy. No desktop app. No account. One command.

Drop any file. Get a structured, growing knowledge vault your AI agents can actually read and reference.

```bash
npx personal-tree ingest research-paper.pdf
```

**Personal Tree is not an agent. It's the memory layer your agents read from.**

Instead of pasting documents into every chat, ingest them once. Point Claude Code, Cursor, or any AI at your vault and it instantly has context across everything you've ever ingested.

---

## Philosophy

Andrej Karpathy tweeted about using an Obsidian wiki as a personal knowledge base — structured Markdown files your AI can read and reason over. OpenHuman built a whole agent harness around that idea.

Personal Tree asks: what's the smallest possible version of that?

No desktop app. No integrations. No account. Just drop a file and get a structured vault your existing AI tools can read. Your knowledge should be local, yours, and always accessible to the agents you already use.

---

## How it works

```
Your file (PDF / .txt / .md / .docx)
       ↓
  Chunks the text
       ↓
  Local LLM (Ollama) or Claude API
       ↓
  Extracts: topics, concepts, relationships
       ↓
  Writes structured Markdown to your vault
       ↓
  Point any AI agent at the folder — done
```

---

## Install

```bash
# Run directly (no global install needed)
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
personal-tree ingest report.docx

# Custom vault location
personal-tree ingest paper.pdf --vault ~/my-vault
```

### Check your vault stats
```bash
personal-tree status
personal-tree status --vault ~/my-vault
```

---

## Your vault is just a folder

No database. No proprietary format. Just plain Markdown files on your machine:

```
vault/
├── index.md              ← full knowledge index
├── topics/
│   ├── machine-learning.md
│   └── neural-networks.md
└── concepts/
    ├── transformer-architecture.md
    ├── attention-mechanism.md
    └── backpropagation.md
```

Open it in VS Code, Finder, or any text editor. Use Obsidian if you want the visual graph. Works either way — Obsidian is optional.

Every file uses wikilinks (`[[concept-name]]`) so Obsidian's graph view lights up automatically.

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

# Run Personal Tree — it auto-detects Ollama
personal-tree ingest yourfile.pdf
```

### Option B — Claude API (higher quality)
```bash
export ANTHROPIC_API_KEY=your_key_here
personal-tree ingest yourfile.pdf
```

Personal Tree automatically uses Claude API if `ANTHROPIC_API_KEY` is set, otherwise falls back to Ollama.

---

## Use your vault as AI agent memory

Once your vault is built, point any AI tool at it.

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

1. Open Cursor Settings → Features → Docs
2. Add your vault path: `~/vault`
3. Cursor indexes all `.md` files and uses them in every chat

---

### Any AI with file access (ChatGPT, Claude.ai)

```bash
# Export your full vault as a single context file
cat ~/vault/index.md ~/vault/topics/*.md ~/vault/concepts/*.md > my-knowledge-context.txt
```

Paste or upload `my-knowledge-context.txt` to any AI chat.

---

### Custom agent / MCP server

It's all plain Markdown — any MCP-compatible agent or tool that can read files can use your vault as a knowledge source.

```bash
ls ~/vault/concepts/    # individual concept files
cat ~/vault/index.md    # full knowledge index
```

---

## Who gets the most value

| User | What they ingest | What their agent can answer |
|---|---|---|
| **Student** | Research papers, textbooks | "What do I know about X topic across all my papers?" |
| **Developer** | Docs, RFCs, architecture notes | "What did we decide about the auth flow?" |
| **PM** | PRDs, meeting notes, competitor research | "What were our Q1 product decisions?" |
| **Researcher** | Papers, articles, field notes | "What gaps exist across everything I've read?" |
| **Writer** | Books, articles, interviews | "What sources support this argument?" |

---

## Personal Tree vs other tools

| | Personal Tree | OpenHuman | NotebookLM | Mem |
|---|---|---|---|---|
| **What it is** | Memory layer | Agent harness | Chat with docs | AI notes app |
| No account needed | ✅ | ❌ | ❌ | ❌ |
| Local / offline | ✅ | ✅ | ❌ | ❌ |
| No desktop app | ✅ | ❌ | ✅ | ✅ |
| Agents can read it | ✅ | ✅ | ❌ | ❌ |
| Plain files (portable) | ✅ | ✅ | ❌ | ❌ |
| Just file ingestion | ✅ | ❌ | ✅ | ❌ |
| No integrations to set up | ✅ | ❌ | ✅ | ✅ |

OpenHuman is powerful and shares the same Karpathy-inspired Obsidian vault idea — but it's a full desktop agent harness with 118+ integrations. Personal Tree is just the memory layer, nothing more.

---

## Roadmap

- [x] PDF / txt / md ingestion
- [x] .docx ingestion
- [x] Ollama (local) + Claude API support
- [x] Obsidian-compatible Markdown output
- [x] Growing tree (merge on re-ingest)
- [ ] `personal-tree search <query>` — keyword search across vault
- [ ] `personal-tree export` — dump vault to single file for any AI
- [ ] URL ingestion
- [ ] Web UI (drag and drop, no CLI needed)
- [ ] Watch folder (auto-ingest new files)
- [ ] Voice input

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT
