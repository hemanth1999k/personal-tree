import fs from 'fs'
import path from 'path'

export async function parseFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase()
  const content = fs.readFileSync(filePath)

  if (ext === '.pdf') {
    const pdfParse = await import('pdf-parse')
    const parser = (pdfParse as any).default ?? pdfParse
    const data = await parser(content)
    return data.text
  }

  if (ext === '.txt' || ext === '.md') {
    return content.toString('utf-8')
  }

  if (ext === '.docx') {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer: content })
    return result.value
  }

  throw new Error(`Unsupported file type: ${ext}. Supported: .pdf, .txt, .md, .docx`)
}
