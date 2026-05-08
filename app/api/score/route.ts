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

export const maxDuration = 60

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
    console.error('JSON parse failed:', text?.slice(0, 200))
    return fallback
  }
}

async function scoreWithClaude(client: Anthropic, prompt: string, fallback: any): Promise<any> {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return safeParseJSON(text, fallback)
  } catch (err) {
    console.error('scoreWithClaude failed:', String(err))
    return fallback
  }
}

export async function POST(req: Request) {
  try {
    const { transcript, prepQuestions, prepAnswers } = await req.json()
    const client = new Anthropic()
    const txStr = transcriptToString(transcript)

    const preCallFallback = { total: 0, details: [] }
    const discoveryFallback = {
      currentMarketing: { score: 0, max: 6, reason: 'Scoring unavailable' },
      marketingObjective: { score: 0, max: 6, reason: 'Scoring unavailable' },
      usp: { score: 0, max: 6, reason: 'Scoring unavailable' },
      targetAudience: { score: 0, max: 6, reason: 'Scoring unavailable' },
      measurableKpi: { score: 0, max: 6, reason: 'Scoring unavailable' },
      timing: { score: 0, max: 6, reason: 'Scoring unavailable' },
      budget: { score: 0, max: 9, reason: 'Scoring unavailable' },
    }
    const assignmentFallback = { score: 0, max: 20, elementsCount: 0, reason: 'Scoring unavailable' }
    const craftFallback = {
      talkListenRatio: { score: 0, max: 3, reason: 'Scoring unavailable' },
      followUpDepth: { score: 0, max: 3, reason: 'Scoring unavailable' },
      objectionHandling: { score: 0, max: 3, reason: 'Scoring unavailable' },
      stakeholderMapping: { score: 0, max: 3, reason: 'Scoring unavailable' },
      pacing: { score: 0, max: 3, reason: 'Scoring unavailable' },
    }
    const buriedFallback = { bonus: 0, surfaced: false, depth: 'none', reason: 'Scoring unavailable' }
    const disqualFallback = { detected: false, behaviors: [] }

    const [preCallRaw, discoveryRaw, assignmentRaw, craftRaw, buriedRaw, disqualRaw] = await Promise.all([
      scoreWithClaude(client, buildPreCallPrompt(prepQuestions, prepAnswers), preCallFallback),
      scoreWithClaude(client, buildDiscoveryPrompt(txStr), discoveryFallback),
      scoreWithClaude(client, buildAssignmentPrompt(txStr), assignmentFallback),
      scoreWithClaude(client, buildCallCraftPrompt(txStr), craftFallback),
      scoreWithClaude(client, buildBuriedOpportunityPrompt(txStr), buriedFallback),
      scoreWithClaude(client, buildDisqualifyingPrompt(txStr), disqualFallback),
    ])

    const preCallScore = preCallRaw.total || preCallRaw.details?.reduce((s: number, d: any) => s + (d.score || 0), 0) || 0
    const discoveryScore = Object.values(discoveryRaw).reduce((s: number, v: any) => s + ((v as any).score || 0), 0) as number
    const assignmentScore = assignmentRaw.score || 0
    const craftScore = Object.values(craftRaw).reduce((s: number, v: any) => s + ((v as any).score || 0), 0) as number
    const buriedBonus = buriedRaw.bonus || 0
    const disqualifying = disqualRaw.detected || false

    let total = preCallScore + discoveryScore + assignmentScore + craftScore
    if (disqualifying) total = Math.min(total, 60)
    const totalWithBonus = total + buriedBonus

    const proposalReadiness: 'pass' | 'fail' = (
      !disqualifying &&
      assignmentScore > 0 &&
      (discoveryRaw.budget?.score || 0) > 0 &&
      (discoveryRaw.timing?.score || 0) > 0
    ) ? 'pass' : 'fail'

    const partialScores = { total, totalWithBonus }

    let coaching = ''
    try {
      const coachingRaw = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: buildCoachingPrompt(txStr, partialScores, prepAnswers) }],
      })
      coaching = coachingRaw.content[0].type === 'text' ? coachingRaw.content[0].text : ''
    } catch (err) {
      console.error('Coaching generation failed:', String(err))
      coaching = 'Coaching narrative could not be generated for this session.'
    }

    let sideBySide: any[] = []
    try {
      const sbsResponse = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildSbsPrompt(txStr) }],
      })
      const sbsText = sbsResponse.content[0].type === 'text' ? sbsResponse.content[0].text : '[]'
      const sbsRaw = safeParseJSON(sbsText, [])
      sideBySide = Array.isArray(sbsRaw) ? sbsRaw : []
    } catch (err) {
      console.error('SBS generation failed:', String(err))
      sideBySide = []
    }

    const result: ScoreResult = {
      preCall: {
        score: preCallScore,
        max: 20,
        details: preCallRaw.details || prepQuestions.map((q: PrepQuestion) => ({
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
    console.error('Score API top-level error:', String(err))
    return Response.json({ error: 'Scoring failed', details: String(err) }, { status: 500 })
  }
}
