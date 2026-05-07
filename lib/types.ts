export interface TranscriptMessage {
  speaker: 'liz' | 'seller'
  text: string
}

export interface PrepQuestion {
  tier: string
  pts: number
  question: string
}

export interface QuestionScore {
  question: string
  score: number
  max: number
  reason: string
}

export interface DiscoveryElements {
  currentMarketing: { score: number; max: 6; reason: string }
  marketingObjective: { score: number; max: 6; reason: string }
  usp: { score: number; max: 6; reason: string }
  targetAudience: { score: number; max: 6; reason: string }
  measurableKpi: { score: number; max: 6; reason: string }
  timing: { score: number; max: 6; reason: string }
  budget: { score: number; max: 9; reason: string }
}

export interface CraftDetails {
  talkListenRatio: { score: number; max: 3; reason: string }
  followUpDepth: { score: number; max: 3; reason: string }
  objectionHandling: { score: number; max: 3; reason: string }
  stakeholderMapping: { score: number; max: 3; reason: string }
  pacing: { score: number; max: 3; reason: string }
}

export interface SbsMoment {
  label: string
  context: string
  lizSaid: string
  whatYouSaid: string
  whatGreatLooksLike: string
  theGap: string
}

export interface ScoreResult {
  preCall: { score: number; max: 20; details: QuestionScore[] }
  discovery: { score: number; max: 45; elements: DiscoveryElements }
  assignment: { score: number; max: 20; elementsCount: number; reason: string }
  callCraft: { score: number; max: 15; details: CraftDetails }
  buriedOpportunity: { bonus: number; surfaced: boolean; depth: string; reason: string }
  disqualifying: { detected: boolean; behaviors: string[] }
  coaching: string
  sideBySide: SbsMoment[]
  total: number
  totalWithBonus: number
  proposalReadiness: 'pass' | 'fail'
}

export interface DrillsSession {
  prepQuestions: PrepQuestion[]
  prepAnswers: string[]
  transcript: TranscriptMessage[]
  scores?: ScoreResult
  coaching?: string
  sideBySide?: SbsMoment[]
}
