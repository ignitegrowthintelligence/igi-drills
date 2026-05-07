export const QUESTIONS = {
  tier1: [
    { q: "What does this business do and who do they serve?", pts: 7 },
    { q: "Walk through this business as if you were a potential customer landing on their website for the first time. What do you notice in the first 30 seconds, and what does that tell you about who they are trying to reach?", pts: 7 },
    { q: "What scale of business is this — single location, multi-location, franchise? What staffing level and roughly what revenue range?", pts: 7 },
    { q: "What signals on their website tell you what they are most proud of, and what they are quietly hoping nobody notices?", pts: 7 },
  ],
  tier2: [
    { q: "What are they likely already spending money on for marketing?", pts: 6 },
    { q: "What channels do you think drive the most revenue for this business, and why?", pts: 6 },
    { q: "Who are their direct competitors in this market, and what does the competitive pressure look like?", pts: 6 },
    { q: "Why do you think this business agreed to take this meeting? What is most likely driving them to talk to us right now?", pts: 6 },
  ],
  tier3: [
    { q: "What is your working hypothesis for what this business actually needs?", pts: 7 },
    { q: "If you had to pick one service or revenue stream this business should be growing right now, which would it be and why?", pts: 7 },
    { q: "Where do you think they are leaving money on the table that they may not see themselves?", pts: 7 },
    { q: "Who are the decision makers in this business and what are their roles?", pts: 7 },
  ],
}

export function pickQuestions(): Array<{ tier: string; pts: number; question: string }> {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  const t1 = pick(QUESTIONS.tier1)
  const t2 = pick(QUESTIONS.tier2)
  const t3 = pick(QUESTIONS.tier3)
  return [
    { tier: 'Foundation', pts: t1.pts, question: t1.q },
    { tier: 'Marketing Context', pts: t2.pts, question: t2.q },
    { tier: 'Strategy', pts: t3.pts, question: t3.q },
  ]
}
