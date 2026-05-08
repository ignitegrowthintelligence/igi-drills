export function buildPreCallPrompt(questions: Array<{tier: string; pts: number; question: string; fullCredit?: string; partialCredit?: string; zeroCredit?: string}>, answers: string[]): string {
  const pairs = questions.map((q, i) => {
    const rubric = q.fullCredit
      ? `\nFull credit (${q.pts} pts): ${q.fullCredit}\nPartial credit (${Math.round(q.pts * 0.55)} pts): ${q.partialCredit}\nZero credit: ${q.zeroCredit}`
      : ''
    return `Question (${q.tier}, max ${q.pts} pts): ${q.question}${rubric}\nSeller Answer: ${answers[i] || '(no answer)'}`
  }).join('\n\n')

  return `You are scoring pre-call preparation for a sales training simulation. The seller researched Mooradians Furniture and Mattresses (two-location independent furniture and mattress retailer in Albany NY, Capital Region) before a discovery call with their Marketing Manager, Liz Rose.

Use the rubric criteria provided for each question to determine the correct score. Do not interpolate — assign full credit, partial credit, or zero based on which criteria the answer meets.

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
  return `You are scoring a discovery call transcript for a sales training simulation. The seller was calling Liz Rose, Marketing Manager at Mooradians Furniture and Mattresses in Albany NY.

Score each of these 7 discovery elements based on what the seller actually asked or surfaced:

1. Current Marketing (max 6): 6=channels+vendors+spend+performance all covered, 4=channels+rough spend, 2=surface only, 0=not raised
2. Marketing Objective (max 6): 6=specific business outcome + consumer journey friction identified, 4=outcome captured, 2=surface answer ("more traffic"), 0=not raised
3. USP (max 6): 6=passes SUC test (Significant, Unique, Credible), 4=1-2 of SUC captured, 2=generic ("quality and service"), 0=not raised
4. Target Audience (max 6): 6=demographics+geography+behavior+high-value customer profile identified, 4=demographics only, 2=generic, 0=not raised
5. Measurable KPI (max 6): 6=specific trackable number agreed, 4=soft metric, 2=vague, 0=not raised
6. Timing (max 6): 6=specific window+business reason (e.g., August live date before Q4), 4=general timing captured, 2=vague, 0=not raised
7. Budget (max 9): 9=monthly+total+past spend+willingness range all captured, 6=monthly+some context, 3=vague amount only, 0=avoided entirely

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

The 6 elements are: (1) business outcome, (2) measurable KPI, (3) budget range, (4) launch window + campaign length, (5) target audience + geography, (6) confirmation of right next step.

IMPORTANT — what counts as "present" for each element:
- Business outcome: directional counts ("drive qualified floor traffic" is fine; it doesn't need a specific number)
- Measurable KPI: naming a trackable category counts ("in-store visits," "form fills," "phone calls") — the seller does not need a specific agreed-upon target number
- Budget range: reflecting a range discussed during the call counts ("somewhere around $6-7K") — the seller does not need a single committed dollar figure
- Launch window + campaign length: directional timing counts ("live by August, 90-day test into Q4") — exact dates not required
- Target audience + geography: capturing the key descriptors from the call counts ("Capital Region homeowners, 35-55, in-market for furniture") — precise demo specs not required
- Right next step: this must be precise — the seller must correctly match their close to the proposed scope (see below)

For the next step: Liz Rose has authority to approve new vendor commitments in the range of $5,500 to $7,500/month. If the seller proposes a scope within that range AND no new strategic channels, the correct close is asking Liz to review a proposal directly. If the scope exceeds that range OR involves a strategic channel addition like CTV/OTT (regardless of dollar amount), the correct close is requesting a follow-up meeting that includes the family/ownership. Score the next step based on whether the seller correctly matched their close to their proposed scope.

Scoring:
20 = all 6 elements present (even if directional) + correct close
16 = 5 of 6 elements + correct close, OR all 6 elements + close was off
12 = 4-5 elements + close attempted (even if imperfect)
6  = 2-3 elements captured, limited or no close
0  = no real playback attempt

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{"score": 0, "max": 20, "elementsCount": 0, "reason": "two sentences describing what was present and what was missing"}`
}

export function buildCallCraftPrompt(transcript: string): string {
  return `You are scoring call craft elements for a sales training simulation. Analyze this discovery call transcript. The prospect is Liz Rose, Marketing Manager at Mooradians Furniture and Mattresses.

Score each element (0-3 each):
1. Talk-listen ratio: 3=Liz speaking 60%+ from message 3 onward, 2=roughly balanced, 1=seller dominated, 0=seller talked most of the time
2. Follow-up depth: 3=5+ meaningful follow-up pushes (not just "tell me more"), 2=3-4 follow-ups, 1=1-2, 0=mostly surface questions
3. Objection handling: 3=handled the persistence/opening moment well + any mid-call challenges, 2=handled opening ok, 1=stumbled, 0=failed
4. Stakeholder mapping: 3=surfaced Liz's authority range ($5,500-$7,500) AND identified that family/ownership is needed above that or for strategic channel additions, 2=confirmed Liz has authority but missed the range or family involvement threshold, 1=asked who else is involved without specifics, 0=assumed Liz has unlimited authority
5. Pacing: 3=covered 6-7 discovery elements within 16 minutes, 2=covered 4-5, 1=covered 2-3, 0=under 2

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
  return `You are checking whether the seller surfaced the buried opportunity in a sales discovery call with Liz Rose, Marketing Manager at Mooradians Furniture and Mattresses (Albany NY).

The buried opportunity is: Mooradians offers in-house design services (a designer visits the customer's home, takes measurements, creates floor plans). This service is operational and functional but is completely absent from all paid marketing creative. No designer-led content, no before-and-after social, no design-consultation-as-lead-magnet campaign. Customers who use design services almost certainly spend more and refer more — but the business has never amplified this as a marketing asset. The seller earns the bonus by surfacing this gap through their own questioning, not by Liz volunteering it.

Scoring:
- +5: Seller surfaced design services via their own questioning (asked about service mix, underutilized assets, what is on the floor the marketing does not amplify, or specifically about design), named it back specifically, and connected it to a campaign direction
- +3: Seller surfaced it but did not fully connect to a campaign direction or next steps
- +1: Seller noticed the design service (mentioned it) but did not push or develop it
- 0: Never came up, or only surfaced because Liz volunteered it unprompted

TRANSCRIPT:
${transcript}

Return ONLY valid JSON:
{"bonus": 0, "surfaced": false, "depth": "none|noticed|surfaced|developed", "reason": "one sentence"}`
}

export function buildDisqualifyingPrompt(transcript: string): string {
  return `You are checking for disqualifying behaviors in a sales discovery call. Any of these behaviors caps the score at 60.

Disqualifying behaviors:
1. Pitched specific products or packages before 5+ discovery elements were covered
2. Made specific performance promises ("50 leads a month," "guaranteed results")
3. Misrepresented Townsquare Ignite capabilities
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

  return `You are Justin Abbott, SVP of Digital Sales at Townsquare Ignite. You are writing coaching feedback after reviewing a sales rep's discovery call practice session with a simulated prospect (Liz Rose, Marketing Manager at Mooradians Furniture and Mattresses in Albany NY).

Overall score: ${total}/100. Tone calibration: ${tone}.

Write 3 paragraphs, 250-400 words total:
- Paragraph 1: What the seller did well — specific, references actual call moments or prep answers
- Paragraph 2: Where it broke down — direct, quote actual lines from the transcript if possible
- Paragraph 3: What to do differently — concrete and actionable

Style rules: Direct. Standards-not-ego. No fluff. Grounded in field reality. No "good job," no buzzwords, no hedging. Second-person ("you"). Reference Liz and Mooradians by name. Write like someone who runs a real sales floor and has seen this pattern a hundred times.

${total < 60 ? 'The score is low. Do not cushion it. Be direct about what went wrong.' : ''}
${total >= 85 ? 'The score is strong. Acknowledge it but immediately push for the next level.' : ''}

PRE-CALL PREP ANSWERS:
${prepAnswers.map((a, i) => `Answer ${i + 1}: ${a || '(blank)'}`).join('\n')}

TRANSCRIPT:
${transcript}

Write only the 3-paragraph coaching narrative. No headers, no bullets, no JSON.`
}

export function buildSbsPrompt(transcript: string): string {
  return `You are analyzing a sales discovery call to identify 2-3 "side by side" coaching moments. These are specific moments where the seller's response could have been meaningfully better.

Always include the opening moment (how the seller responded when Liz opened warmly after their persistent outreach). Then pick 1-2 additional moments where the gap between what was said and what great looks like is most instructive.

The prospect is Liz Rose, Marketing Manager at Mooradians Furniture and Mattresses, Albany NY. She is a competent digital marketer who built and runs their paid program.

TRANSCRIPT:
${transcript}

Return ONLY valid JSON array (no markdown):
[
  {
    "label": "The opening moment",
    "context": "One sentence describing the moment and why it mattered.",
    "lizSaid": "Exact quote from Liz (or close paraphrase)",
    "whatYouSaid": "What the seller actually said (paraphrase ok)",
    "whatGreatLooksLike": "A strong example response that would have moved the call forward",
    "theGap": "2-3 sentences explaining why the better version works and what the seller missed"
  }
]`
}
