import Anthropic from '@anthropic-ai/sdk'
import {
  buildPreCallPrompt,
  buildDiscoveryPrompt,
  buildAssignmentPrompt,
  buildCallCraftPrompt,
  buildBuriedOpportunityPrompt,
  buildDisqualifyingPrompt,
  buildCoachingPrompt,
  buildSbsPrompt,
} from '@/lib/scoring-prompts'
import { TranscriptMessage, PrepQuestion, ScoreResult } from '@/lib/types'

function transcriptToString(transcript: TranscriptMessage[]): string {
  return transcript.map(m => `${m.speaker === 'liz' ? 'LIZ' : 'SELLER'}: ${m.text}`).join('\n\n')
}

async function scoreWithClaude(client: Anthropic, prompt: string): Promise<any> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  // Strip markdown code blocks if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(cleaned)
}

export async function POST(req: Request) {
  try {
    const { transcript, prepQuestions, prepAnswers } = await req.json()
    const client = new Anthropic()
    const txStr = transcriptToString(transcript)

    // Run all scoring in parallel
    const [preCallRaw, discoveryRaw, assignmentRaw, craftRaw, buriedRaw, disqualRaw] = await Promise.all([
      scoreWithClaude(client, buildPreCallPrompt(prepQuestions, prepAnswers)),
      scoreWithClaude(client, buildDiscoveryPrompt(txStr)),
      scoreWithClaude(client, buildAssignmentPrompt(txStr)),
      scoreWithClaude(client, buildCallCraftPrompt(txStr)),
      scoreWithClaude(client, buildBuriedOpportunityPrompt(txStr)),
      scoreWithClaude(client, buildDisqualifyingPrompt(txStr)),
    ])

    // Calculate totals
    const preCallScore = preCallRaw.total || preCallRaw.details?.reduce((s: number, d: any) => s + (d.score || 0), 0) || 0
    const discoveryScore = Object.values(discoveryRaw).reduce((s: number, v: any) => s + (v.score || 0), 0) as number
    const assignmentScore = assignmentRaw.score || 0
    const craftScore = Object.values(craftRaw).reduce((s: number, v: any) => s + (v.score || 0), 0) as number
    const buriedBonus = buriedRaw.bonus || 0
    const disqualifying = disqualRaw.detected || false

    let total = preCallScore + discoveryScore + assignmentScore + craftScore
    if (disqualifying) total = Math.min(total, 60)
    const totalWithBonus = total + buriedBonus

    // Proposal readiness
    const proposalReadiness: 'pass' | 'fail' = (
      !disqualifying &&
      assignmentScore > 0 &&
      (discoveryRaw.budget?.score || 0) > 0 &&
      (discoveryRaw.timing?.score || 0) > 0
    ) ? 'pass' : 'fail'

    // Build partial result for coaching prompt
    const partialScores = { total, totalWithBonus }

    // Coaching narrative (sequential — needs scores)
    const coachingRaw = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: buildCoachingPrompt(txStr, partialScores, prepAnswers) }],
    })
    const coaching = coachingRaw.content[0].type === 'text' ? coachingRaw.content[0].text : ''

    // Side-by-side moments
    const sbsRaw = await scoreWithClaude(client, buildSbsPrompt(txStr))
    const sideBySide = Array.isArray(sbsRaw) ? sbsRaw : []

    const result: ScoreResult = {
      preCall: {
        score: preCallScore,
        max: 20,
        details: preCallRaw.details || prepQuestions.map((q: PrepQuestion, i: number) => ({
          question: q.question,
          score: 0,
          max: q.pts,
          reason: 'Not scored',
        })),
      },
      discovery: {
        score: discoveryScore,
        max: 45,
        elements: discoveryRaw,
      },
      assignment: {
        score: assignmentScore,
        max: 20,
        elementsCount: assignmentRaw.elementsCount || 0,
        reason: assignmentRaw.reason || '',
      },
      callCraft: {
        score: craftScore,
        max: 15,
        details: craftRaw,
      },
      buriedOpportunity: {
        bonus: buriedBonus,
        surfaced: buriedRaw.surfaced || false,
        depth: buriedRaw.depth || 'none',
        reason: buriedRaw.reason || '',
      },
      disqualifying: {
        detected: disqualifying,
        behaviors: disqualRaw.behaviors || [],
      },
      coaching,
      sideBySide,
      total,
      totalWithBonus,
      proposalReadiness,
    }

    return Response.json(result)
  } catch (err) {
    console.error('Score API error:', err)
    return Response.json({ error: 'Scoring failed', details: String(err) }, { status: 500 })
  }
}
