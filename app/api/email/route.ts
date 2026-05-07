import { Resend } from 'resend'
import type { ScoreResult } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

function scoreBar(label: string, score: number, max: number): string {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0
  const color = pct >= 75 ? '#22c55e' : pct >= 45 ? '#f59e0b' : '#f87171'
  const filled = Math.round(pct / 5)
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)
  return `<tr>
    <td style="padding:6px 0;font-size:13px;color:#6a87ab;width:200px;">${label}</td>
    <td style="padding:6px 0;font-family:monospace;font-size:12px;color:${color};">${bar}</td>
    <td style="padding:6px 0;font-size:13px;color:${color};font-weight:700;text-align:right;padding-left:12px;">${score}/${max}</td>
  </tr>`
}

export async function POST(req: Request) {
  try {
    const { scores, seller }: { scores: ScoreResult; seller: { name: string; email: string } } = await req.json()

    if (!seller.email) {
      return Response.json({ error: 'No email provided' }, { status: 400 })
    }

    const { total, totalWithBonus, buriedOpportunity, proposalReadiness, preCall, discovery, assignment, callCraft, coaching } = scores
    const scoreColor = totalWithBonus >= 85 ? '#22c55e' : totalWithBonus >= 60 ? '#f59e0b' : '#f87171'
    const readinessColor = proposalReadiness === 'pass' ? '#22c55e' : '#f87171'
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const coachingParagraphs = (coaching || '').split('\n\n').filter(Boolean)
      .map(p => `<p style="font-size:14px;color:#e2eaf6;line-height:1.8;margin:0 0 16px 0;">${p}</p>`)
      .join('')

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#070b14;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:#f59e0b;margin-bottom:8px;text-transform:uppercase;">IGI DRILLS</div>
      <h1 style="font-size:22px;font-weight:700;color:#e2eaf6;margin:0 0 4px 0;">Your Results — Reveal MedSpas</h1>
      <p style="font-size:13px;color:#6a87ab;margin:0;">${date}</p>
    </div>

    <!-- Score hero -->
    <div style="background:#0d1526;border:1px solid #1e3054;border-radius:10px;padding:32px;margin-bottom:20px;text-align:center;">
      <p style="font-size:11px;color:#6a87ab;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px 0;">OVERALL SCORE</p>
      <div style="font-size:72px;font-weight:800;color:${scoreColor};line-height:1;margin-bottom:8px;">${totalWithBonus}</div>
      <p style="font-size:13px;color:#6a87ab;margin:0 0 16px 0;">
        out of 100${buriedOpportunity.bonus > 0 ? ` &middot; base ${total} + ${buriedOpportunity.bonus} bonus` : ''}
      </p>
      <div style="display:inline-block;padding:8px 24px;border-radius:6px;font-size:14px;font-weight:700;
        background:${proposalReadiness === 'pass' ? 'rgba(34,197,94,0.12)' : 'rgba(248,113,113,0.12)'};
        color:${readinessColor};border:1px solid ${proposalReadiness === 'pass' ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)'};">
        Proposal Readiness: ${proposalReadiness.toUpperCase()}
      </div>
    </div>

    <!-- Section breakdown -->
    <div style="background:#0d1526;border:1px solid #1e3054;border-radius:10px;padding:24px;margin-bottom:20px;">
      <p style="font-size:11px;color:#6a87ab;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 20px 0;">SECTION BREAKDOWN</p>
      <table style="width:100%;border-collapse:collapse;">
        ${scoreBar('Pre-Call Prep', preCall.score, preCall.max)}
        ${scoreBar('Discovery Elements', discovery.score, discovery.max)}
        ${scoreBar('The Assignment', assignment.score, assignment.max)}
        ${scoreBar('Call Craft', callCraft.score, callCraft.max)}
        ${buriedOpportunity.bonus > 0 ? scoreBar('Buried Opportunity', buriedOpportunity.bonus, 5) : ''}
      </table>
    </div>

    <!-- Coaching -->
    <div style="background:#0d1526;border:1px solid #1e3054;border-radius:10px;padding:28px;margin-bottom:20px;">
      <p style="font-size:11px;color:#6a87ab;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 20px 0;">YOUR COACHING</p>
      ${coachingParagraphs}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:20px;">
      <p style="font-size:12px;color:#1e3054;margin:0;">IGI Drills &mdash; Townsquare Ignite Sales Training</p>
    </div>

  </div>
</body>
</html>`

    const { error } = await resend.emails.send({
      from: 'IGI Drills <onboarding@resend.dev>',
      to: seller.email,
      subject: 'Your IGI Drills Results — Reveal MedSpas',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return Response.json({ error }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Email route error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
