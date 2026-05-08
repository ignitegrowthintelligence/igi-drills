export interface Question {
  q: string
  pts: number
  fullCredit: string
  partialCredit: string
  zeroCredit: string
}

export const QUESTIONS: Record<string, Question[]> = {
  tier1: [
    {
      q: "What does Mooradians Furniture do, and what are the two locations?",
      pts: 7,
      fullCredit: "Identifies it as a multi-location independent furniture and mattress retailer in the Albany NY Capital Region. Names both Albany (800 Central Avenue) and Clifton Park (1758A Route 9, Parkwood Plaza). Notes they are family-owned.",
      partialCredit: "Identifies it as a furniture store in Albany. Mentions multiple locations but cannot name both accurately.",
      zeroCredit: "Generic answer like 'they sell furniture' with no location specifics or business context."
    },
    {
      q: "How long has Mooradians been in business, and what is the family ownership story?",
      pts: 7,
      fullCredit: "References the 1931 founding by Mihran Mooradian. Mentions the evolution from meat market to appliance store to furniture business. Notes multi-generational family ownership (four generations).",
      partialCredit: "Knows it has been around a long time (90+ years) and is family-owned but does not capture the multi-generation history or the meat market origin.",
      zeroCredit: "Cannot speak to tenure or ownership structure."
    },
    {
      q: "Walk me through the major manufacturer brands they carry. Why does that brand mix matter for a marketing conversation?",
      pts: 7,
      fullCredit: "Names at least four major brands accurately from: Tempur-Pedic, Beautyrest, Stearns & Foster, Sealy, La-Z-Boy, Stressless by Ekornes, Canadel, Craftmaster, Bradington-Young, Fjords. Connects the brand mix to co-op funding dynamics, customer profile differences, or signals about the retailer's market position.",
      partialCredit: "Names two or three brands but misses the connection to marketing strategy.",
      zeroCredit: "Cannot name specific brands or makes up brands they do not carry."
    },
    {
      q: "What is Mooradians' stated brand positioning? What do they claim to stand for?",
      pts: 7,
      fullCredit: "References the MVP claim (Mooradians Value Promise) and names the three pillars: Always Top Quality, Always the Latest Styles, Always the Lowest Possible Price. Optionally notes that claiming all three simultaneously is a positioning weakness.",
      partialCredit: "References 'value' or 'quality' or 'best price' as the positioning but cannot name the MVP framework specifically.",
      zeroCredit: "Cannot describe their stated positioning at all."
    },
  ],
  tier2: [
    {
      q: "What does Mooradians' active paid social program look like? What are they running, what brands are featured, and what does the cadence tell you?",
      pts: 6,
      fullCredit: "References an active Meta paid social program with multiple ads running concurrently (Meta Ad Library shows 40+ active ads during sale windows). Names specific brands featured in creative (e.g., Tempur-Pedic, Stearns & Foster, Sealy, La-Z-Boy, Fjords, Stressless). Notes the cadence is sale-event driven.",
      partialCredit: "Knows they run Meta paid social. Either knows it is sale-event driven OR knows specific brands featured, but not both.",
      zeroCredit: "Did not check the Meta Ad Library or cannot speak to what their paid social looks like."
    },
    {
      q: "What does their Google paid program look like, and what does it tell you about their digital sophistication?",
      pts: 6,
      fullCredit: "References Google paid search and display including brand defense ads, category-targeted dynamic search, and display banner retargeting. Connects this to a conclusion that someone competent is running this program.",
      partialCredit: "Knows they run Google paid ads but cannot describe the program structure or differentiate search from display.",
      zeroCredit: "Did not check the Google Ads Transparency Center or cannot speak to their Google paid presence."
    },
    {
      q: "How does their organic social presence compare to a business their size and tenure? What does the gap tell you?",
      pts: 6,
      fullCredit: "References specific social numbers (main Facebook page around 2,000 likes, Instagram around 600 followers, location-specific Facebook pages under 200 followers each). Notes this is anemic for a 90+ year old business. Connects the gap to a strategic observation about their paid-vs-organic investment.",
      partialCredit: "References that the social presence is small or weak but cannot cite specific numbers or draw the strategic implication.",
      zeroCredit: "Cannot speak to their social presence or assumes it is bigger than it is."
    },
    {
      q: "Who are Mooradians' major competitors in the Capital Region, and how does Mooradians position against them?",
      pts: 6,
      fullCredit: "Names at least three real Capital Region competitors from: Old Brick Furniture, Raymour & Flanigan, Huck Finn Home, Ethan Allen, Bob's Discount Furniture, Big Lots. Describes Mooradians as a mid-to-upper market independent with strong manufacturer relationships and family heritage.",
      partialCredit: "Names one or two competitors but cannot describe Mooradians' positioning relative to them.",
      zeroCredit: "Cannot name specific local competitors."
    },
  ],
  tier3: [
    {
      q: "Given what you can see publicly, where do you think the growth opportunity is for Mooradians in the next 12 months?",
      pts: 7,
      fullCredit: "Identifies a specific, defensible growth hypothesis grounded in public evidence. Strong answers: adding CTV/OTT to complement the current paid mix; building a structured CRM and lifecycle remarketing program; amplifying the design services capability through dedicated creative; rebuilding the location-specific social presence.",
      partialCredit: "Identifies a generic growth opportunity without grounding it in specific evidence about Mooradians.",
      zeroCredit: "Cannot articulate any growth hypothesis or makes recommendations that contradict what is publicly visible (e.g., suggesting they start Google ads when they clearly already run them)."
    },
    {
      q: "What channel gap stands out to you when you look at their current marketing program?",
      pts: 7,
      fullCredit: "Identifies at least one specific channel gap with reasoning. Strong answers: connected TV/OTT (they run programmatic display via Ekornes co-op but no streaming TV of their own); CRM/lifecycle email beyond promotional blasts; brand-building creative between sale events; location-specific organic social.",
      partialCredit: "Identifies a gap but the reasoning is shallow or could apply to any business.",
      zeroCredit: "Cannot identify any specific channel gap or suggests something they already run."
    },
    {
      q: "Based on what you can see, what kind of buyer do you think you'll be talking to? What should you prepare for?",
      pts: 7,
      fullCredit: "Hypothesizes accurately that the buyer is a marketing manager who runs a real active paid program and is competent at digital. Notes the seller should NOT pitch beginner concepts, should respect what the buyer already runs, and should expect tough questioning from someone who has been pitched many times.",
      partialCredit: "Identifies that there is likely a marketing manager but does not draw the implication for how to approach the call.",
      zeroCredit: "Assumes they will be talking to the family owner directly with no marketing expertise."
    },
    {
      q: "What is one thing about this business you want to test or validate during the discovery call?",
      pts: 7,
      fullCredit: "Articulates a specific, sharp hypothesis to test. Strong answers: how attribution works across their channels; how heavily they lean on co-op vs. own strategic spend; what the design service customer spend looks like vs. walk-in; what the customer database situation looks like for retargeting.",
      partialCredit: "Identifies a generic discovery topic without sharpening it into a testable hypothesis.",
      zeroCredit: "Cannot articulate anything specific to validate or test."
    },
  ],
}

export function pickQuestions(): Array<{ tier: string; pts: number; question: string; fullCredit: string; partialCredit: string; zeroCredit: string }> {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  const t1 = pick(QUESTIONS.tier1)
  const t2 = pick(QUESTIONS.tier2)
  const t3 = pick(QUESTIONS.tier3)
  return [
    { tier: 'Foundation', pts: t1.pts, question: t1.q, fullCredit: t1.fullCredit, partialCredit: t1.partialCredit, zeroCredit: t1.zeroCredit },
    { tier: 'Marketing Context', pts: t2.pts, question: t2.q, fullCredit: t2.fullCredit, partialCredit: t2.partialCredit, zeroCredit: t2.zeroCredit },
    { tier: 'Strategic Hypothesis', pts: t3.pts, question: t3.q, fullCredit: t3.fullCredit, partialCredit: t3.partialCredit, zeroCredit: t3.zeroCredit },
  ]
}
