import Anthropic from '@anthropic-ai/sdk'
import { LIZ_SYSTEM_PROMPT } from '@/lib/liz-prompt'
import { TranscriptMessage } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { transcript, messageCount } = await req.json()
    const client = new Anthropic()

    const messages = transcript.map((m: TranscriptMessage) => ({
      role: m.speaker === 'seller' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }))

    // API requires first message to be user role
    // If transcript starts with Liz (assistant), inject a dummy user message
    if (messages.length > 0 && messages[0].role === 'assistant') {
      messages.unshift({ role: 'user' as const, content: '[Call begins]' })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: [
        {
          type: 'text' as const,
          text: LIZ_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        } as any,
        {
          type: 'text' as const,
          text: `This is message ${messageCount} from the seller. Respond as Liz. 1-4 sentences maximum. Stay completely in character.`,
        },
      ] as any,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return Response.json({ response: text })
  } catch (err) {
    console.error('Liz API error:', err)
    return Response.json({ response: "I'm sorry, can you repeat that?" }, { status: 200 })
  }
}
