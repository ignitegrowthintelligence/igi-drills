import Anthropic from '@anthropic-ai/sdk'
import { buildSbsPrompt } from '@/lib/scoring-prompts'
import { TranscriptMessage } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json()
    const client = new Anthropic()
    const txStr = transcript.map((m: TranscriptMessage) => `${m.speaker === 'liz' ? 'LIZ' : 'SELLER'}: ${m.text}`).join('\n\n')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildSbsPrompt(txStr) }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
    const moments = JSON.parse(cleaned)
    return Response.json({ moments: Array.isArray(moments) ? moments : [] })
  } catch (err) {
    return Response.json({ moments: [] }, { status: 500 })
  }
}
