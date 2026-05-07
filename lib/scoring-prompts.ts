export function buildPreCallPrompt(questions: Array<{tier: string; pts: number; question: string}>, answers: string[]): string {
  const pairs = questions.map((q, i) => `Question (${q.tier}, max ${q.pts} pts): ${q.question}\nAnswer: ${answers[i] || '(no answer)'}`).join('\n\n')
  return `You are scoring pre-call preparation for a sales training simulation. The seller researched Reveal MedSpas (Colorado Springs, CO med spa) before a discovery call.

Score each answer. Award full points for: specific, accurate research referencing the actual website (revealmedspas.com), services (Botox, fillers, medical weight loss, HRT, men's services, memberships), Colorado Springs market context, or competitors. Award partial points for generally correct but vague answers. Award zero for generic or wrong answers.

${pairs}

Return ONLY valid JSON in this exact format — no markdown, no explanation:
{
  "details": [
    {"question": "...", "score": 0, "max": 0, "reason": "one sentence"},
    {"question": "...", "score": 0, "max": 0, "reason": "one sentence"},
    {"question": "...", "score": 0, "max": 0, "reason": "one sentence"}
  ],
  "total": 0
}`
}

export function buildDiscoveryPrompt(transcript: string): string {
  return `You are scoring a discovery call transcript for a sales training simulation. The seller was calling Liz Rose, Marketing Director at Reveal MedSpas, Colorado Springs.

Score each of these 7 discovery elements based on what the seller actually asked or surfaced:

1. Current Marketing (max 6): 6=channels+vendors+spend+performance all covered, 4=channels+rough spend, 2=surface only, 0=not raised
2. Marketing Objective (max 6): 6=specific business outcome + consumer journey friction identified, 4=outcome captured, 2=surface answer ("more leads"), 0=not raised  
3. USP (max 6): 6=passes SUC test (Significant, Unique, Credible), 4=1-2 of SUC captured, 2=generic ("quality and service"), 0=not raised
4. Target Audience (max 6): 6=demographics+geography+behavior+heavy user identified, 4=demographics only, 2=generic, 0=not raised
5. Measurable KPI (max 6): 6=specific trackable number agreed, 4=soft metric, 2=vague, 0=not raised
6. Timing (max 6): 6=specific window+business reason, 4=general timing captured, 2=vague, 0=not raised
7. Budget (max 9): 9=monthly+total+past spend+willingness range all captured, 6=monthly+some total, 3=vague amount only, 0=avoided entirely

TRANSCRIPT:
${transcript}

Return ONLY valid JSON — no markdown, no explanation:
{
  "currentMarketing": {"score": 0, "max": 6, "reason": "one sentence"},
  "marketingObjective": {"score": 0, "max": 6, "reason": "one sentence"},
  "usp": {"score": 0, "max": 6, "reason": "one sentence"},
  "targetAudience": {"score": 0, "max": 6, "reason": "one sentence"},
  "measurableKpi": {"score": 0, "max": 6, "reason": "one sentence"},
  "timing": {"score": 0, "max": 6, "reason": "one sentence"},
  "budget": {"score": 0, "max": 9, "reason": "one sentence"}
}`
}

export function buildAssignmentPrompt(transcript: string): string {
  return `You are scoring the "assignment playback" — the moment near the end of a discovery call where the seller summarizes what they've learned and proposes a clear next step.

The 6 required elements are: (1) specific business outcome, (2) measurable KPI, (3) budget range, (4) launch window + campaign length, (5) target audience + geography, (6) confirmation of right next step (ask to move forward if budget ≤$5,500/mo, or ask to schedule a meeting with Liz's owners/co-founders if above that)

Scoring: 20=all 6 elements + appropriate next step, 12=4-5 elements + next step partially secured, 6=2-3 elements, 0=no real playback attempt

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{"score": 0, "max": 20, "elementsCount": 0, "reason": "two sentences describing what was present and what was missing"}`
}

export function buildCallCraftPrompt(transcript: string): string {
  return `You are scoring call craft elements for a sales training simulation. Analyze this discovery call transcript.

Score each element (0-3 each):
1. Talk-listen ratio: 3=Liz speaking 60%+ from message 3 onward, 2=roughly balanced, 1=seller dominated, 0=seller talked most of the time
2. Follow-up depth: 3=5+ meaningful follow-up pushes (not just "tell me more"), 2=3-4 follow-ups, 1=1-2, 0=mostly surface questions
3. Objection handling: 3=handled Liz's opening test well + any mid-call challenges, 2=handled opening ok, 1=stumbled, 0=failed both
4. Stakeholder mapping: 3=surfaced Liz's $5,500 signing authority + identified owners needed above that, 2=confirmed Liz is decision-maker but missed the cap, 1=asked who else is involved, 0=assumed Liz has full authority throughout
5. Pacing: 3=covered 6-7 discovery elements within call, 2=covered 4-5, 1=covered 2-3, 0=under 2

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{
  "talkListenRatio": {"score": 0, "max": 3, "reason": "one sentence"},
  "followUpDepth": {"score": 0, "max": 3, "reason": "one sentence"},
  "objectionHandling": {"score": 0, "max": 3, "reason": "one sentence"},
  "stakeholderMapping": {"score": 0, "max": 3, "reason": "one sentence"},
  "pacing": {"score": 0, "max": 3, "reason": "one sentence"}
}`
}

export function buildBuriedOpportunityPrompt(transcript: string): string {
  return `You are checking whether a sales rep surfaced the "buried opportunity" during a discovery call with Liz Rose at Reveal MedSpas.

The buried opportunity is: Reveal MedSpas has a dedicated men's services track on their website (HRT, peptides, weight loss, aesthetics for men) but does almost zero deliberate men's acquisition marketing. Colorado Springs has a uniquely strong men's market: military bases (Air Force Academy, Peterson Space Force Base, Schriever SFB, Fort Carson, NORAD), high-income active/retired military men who are prime candidates for these services. This is a real growth gap Liz hasn't fully figured out how to present to the owners.

Scoring:
- +5: Seller surfaced men's services via their own questioning (asked about service mix, underperforming segments, or untapped audience), named it back specifically, and connected it to a campaign direction
- +3: Seller surfaced it but didn't fully connect to campaign direction or next steps
- +1: Seller noticed men's services (maybe mentioned it) but didn't push or develop it
- 0: Never came up at all

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{"bonus": 0, "surfaced": false, "depth": "none|noticed|surfaced|developed", "reason": "one sentence"}`
}

export function buildDisqualifyingPrompt(transcript: string): string {
  return `You are checking for disqualifying behaviors in a sales discovery call. Any of these behaviors caps the score at 60.

Disqualifying behaviors:
1. Pitched specific products/packages before 5+ discovery elements were covered
2. Made specific performance promises ("50 leads a month", "guaranteed results")
3. Misrepresented Townsquare/Ignite capabilities
4. Repeatedly talked over the client or interrupted
5. Ended call without confirming any next steps

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{"detected": false, "behaviors": ["list only behaviors actually detected — empty array if none"]}`
}

export function buildCoachingPrompt(transcript: string, scores: any, prepAnswers: string[]): string {
  const total = scores.totalWithBonus || scores.total || 0
  const tone = total >= 85 ? 'recognition + sharpening' : total >= 60 ? 'acknowledge + hold accountable' : 'direct, no soft pedaling'
  
  return `You are Justin Abbott, SVP of Digital Sales at Townsquare Ignite. You are writing coaching feedback after reviewing a sales rep's discovery call practice session with a simulated prospect (Liz Rose, Marketing Director at Reveal MedSpas in Colorado Springs, CO).

Overall score: ${total}/100. Tone calibration: ${tone}.

Write 3 paragraphs, 250-400 words total:
- Paragraph 1: What the seller did well — specific, references actual call moments or prep answers
- Paragraph 2: Where it broke down — direct, quote actual lines from the transcript
- Paragraph 3: What to do differently — concrete and actionable

Style rules: Direct. Standards-not-ego. No fluff. Grounded in field reality. No "good job," no buzzwords, no hedging. Second-person ("you"). Reference Liz and Reveal by name. Write like someone who runs a real sales floor and has seen this pattern a hundred times.

${total < 60 ? 'The score is low. Do not cushion it. Be direct about what went wrong.' : ''}
${total >= 85 ? 'The score is strong. Acknowledge it but immediately push for the next level.' : ''}

PRE-CALL PREP ANSWERS:
${prepAnswers.map((a, i) => `Answer ${i+1}: ${a || '(blank)'}`).join('\n')}

TRANSCRIPT:
${transcript}

Write only the 3-paragraph coaching narrative. No headers, no bullets, no JSON.`
}

export function buildSbsPrompt(transcript: string): string {
  return `You are analyzing a sales discovery call to identify 2-3 "side by side" coaching moments. These are specific moments where the seller's response could have been meaningfully better.

Always include the opening moment (Liz's test about med spa experience). Then pick 1-2 additional moments where the gap between what was said and what great looks like is most instructive.

TRANSCRIPT:
${transcript}

Return ONLY valid JSON array (no markdown):
[
  {
    "label": "The opening test",
    "context": "One sentence describing the moment and why it mattered.",
    "lizSaid": "Exact quote from Liz (or very close paraphrase if exact quote unclear)",
    "whatYouSaid": "What the seller actually said (paraphrase ok)",
    "whatGreatLooksLike": "A strong example response that would have moved the call forward",
    "theGap": "2-3 sentences explaining why the better version works and what the seller missed"
  }
]`
}
