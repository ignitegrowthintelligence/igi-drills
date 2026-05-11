import Anthropic from '@anthropic-ai/sdk'
import { buildSbsPrompt } from '@/lib/scoring-prompts'
import { TranscriptMessage } from '@/lib/types'

export const maxDuration = 30

function transcriptToString(transcript: TranscriptMessage[]): string {
  return transcript.map(m => `${m.speaker === 'liz' ? 'LIZ' : 'SELLER'}: ${m.text}`).join('\n\n')
}

function safeParseJSON(text: string, fallback: any): any {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    return fallback
  }
}

export async function POST(req: Request) {
  try {
    const { transcript }: { transcript: TranscriptMessage[] } = await req.json()
    if (!transcript || !Array.isArray(transcript)) {
      return Response.json({ error: 'No transcript provided', moments: [] }, { status: 400 })
    }

    const client = new Anthropic()
    const txStr = transcriptToString(transcript)

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildSbsPrompt(txStr) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const parsed = safeParseJSON(text, [])

    return Response.json({ moments: Array.isArray(parsed) ? parsed : [] })
  } catch (err) {
    console.error('SBS API error:', String(err))
    return Response.json({ error: 'Could not generate key moments', moments: [] }, { status: 500 })
  }
}
