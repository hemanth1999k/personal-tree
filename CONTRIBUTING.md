# Contributing to personal-tree

Thanks for your interest! Here's how to get started.

## Setup

```bash
git clone https://github.com/hemanth1999k/personal-tree.git
cd personal-tree
npm install
```

## Development

```bash
# Run CLI directly without building
npm run dev ingest yourfile.pdf

# Build
npm run build

# Test the built CLI
node dist/cli.js ingest yourfile.pdf
```

## Project structure

```
src/
├── cli.ts      — Commander CLI entry point
├── ingest.ts   — Main ingestion pipeline
├── parse.ts    — PDF / text file parsing
├── chunk.ts    — Text chunking engine
├── llm.ts      — LLM abstraction (Ollama + Claude)
└── tree.ts     — Knowledge tree builder + Markdown writer
```

## Submitting a PR

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Build and test: `npm run build`
5. Open a PR with a clear description

## Good first issues

- Add URL ingestion support
- Add `.docx` file support
- Improve merge logic for duplicate concepts
- Add tests
