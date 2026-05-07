import { createClient } from '@supabase/supabase-js'
import type { ScoreResult, TranscriptMessage } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const {
      scores,
      transcript,
      prepAnswers,
      seller,
    }: {
      scores: ScoreResult
      transcript: TranscriptMessage[]
      prepAnswers: string[]
      seller: { name: string; email: string }
    } = await req.json()

    const { error } = await supabase.from('drill_sessions').insert({
      seller_name: seller.name,
      seller_email: seller.email,
      persona: 'Reveal MedSpas',
      total_score: scores.total,
      total_with_bonus: scores.totalWithBonus,
      proposal_readiness: scores.proposalReadiness,
      pre_call_score: scores.preCall.score,
      discovery_score: scores.discovery.score,
      assignment_score: scores.assignment.score,
      call_craft_score: scores.callCraft.score,
      buried_opportunity_bonus: scores.buriedOpportunity.bonus,
      disqualifying_detected: scores.disqualifying.detected,
      coaching_narrative: scores.coaching,
      scores_json: scores,
      transcript: transcript,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Save session error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
