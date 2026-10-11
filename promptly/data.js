/* Promptly's whole brain. No model call: the judgement lives here, in writing,
   which is why the sheet is the same every time and can be argued with. */

const REPOS = {
  corey:  { name: 'Marketing Skills',  by: 'Corey Haines',   url: 'https://github.com/coreyhaines31/marketingskills', count: 50 },
  notfair:{ name: 'NotFair',           by: 'NoWork Studio',  url: 'https://github.com/nowork-studio/notfair-plugin',  count: 48 },
  wondel: { name: 'Wondel Skills',     by: 'Wondel',         url: 'https://github.com/wondelai/skills',               count: 65 },
  lucas:  { name: 'GTM Skills',        by: 'Lucas Linares',  url: 'https://github.com/lucaslinares1/gtm-skills',       count: 6  },
};

/* Each job you tick returns: what to hand over, what it gives back, and the
   exact skills to install for it. Hours are a week, and deliberately modest. */
const JOBS = {
  blog:      { label: 'Writing blog posts and long form', hours: 6,
               hand: 'Outlines, the research pass, and a first draft that argues your line.',
               keep: 'The final read. A draft in your voice still is not your judgement.',
               skills: [['corey','content-strategy'],['corey','copywriting'],['notfair','content-writer']] },
  seo:       { label: 'SEO and search visibility', hours: 5,
               hand: 'Keyword research, the technical audit, and a brief for every page.',
               keep: 'What you refuse to write about. Traffic you cannot serve is a cost.',
               skills: [['notfair','keyword-research'],['corey','seo-audit'],['notfair','seo-analysis']] },
  social:    { label: 'Running social channels', hours: 5,
               hand: 'Repurposing one idea into ten, variant hooks, the calendar.',
               keep: 'The replies. A community notices who answers them.',
               skills: [['corey','social'],['corey','video'],['corey','image']] },
  email:     { label: 'Email and newsletters', hours: 4,
               hand: 'Sequence structure, subject-line variants, segmentation logic.',
               keep: 'The send button, and anything that sounds like a promise.',
               skills: [['corey','emails'],['corey','cold-email']] },
  ads:       { label: 'Paid media and performance', hours: 5,
               hand: 'Creative variants, the audit of what is underspending, launch checklists.',
               keep: 'The budget call. A model has never felt a wasted month.',
               skills: [['notfair','paid-ads'],['notfair','meta-ads-creative'],['corey','ad-creative']] },
  cro:       { label: 'Landing pages and conversion', hours: 4,
               hand: 'Page teardowns, hypothesis lists, test design and sample size.',
               keep: 'Which test ships. Most hypotheses are not worth the traffic.',
               skills: [['corey','cro'],['corey','ab-testing'],['wondel','conversion-optimization']] },
  community: { label: 'Building or running a community', hours: 4,
               hand: 'The calendar, the welcome sequence, the weekly digest.',
               keep: 'Every conversation. This is the one job that does not scale, by design.',
               skills: [['corey','community-marketing'],['corey','events']] },
  brand:     { label: 'Brand, positioning and tone of voice', hours: 3,
               hand: 'The audit of where the voice has drifted, surface by surface.',
               keep: 'The voice itself. Train the machine on it, never the reverse.',
               skills: [['wondel','storybrand-messaging'],['wondel','obviously-awesome'],['corey','marketing-psychology']] },
  research:  { label: 'Customer and competitor research', hours: 6,
               hand: 'Competitor sweeps, interview synthesis, a one-page summary with sources.',
               keep: 'The interviews. Nobody tells a form what they tell a person.',
               skills: [['corey','customer-research'],['corey','competitor-profiling'],['wondel','mom-test']] },
  analytics: { label: 'Reporting and analytics', hours: 4,
               hand: 'The weekly pull, the chart, and a first read of what moved.',
               keep: 'The second read. The first one is usually seasonality.',
               skills: [['corey','analytics'],['corey','attribution'],['wondel','lean-analytics']] },
  launch:    { label: 'Product launches and go to market', hours: 5,
               hand: 'The checklist, the messaging matrix, the asset list by channel.',
               keep: 'The date, and the one sentence the whole launch rests on.',
               skills: [['corey','launch'],['corey','product-marketing'],['wondel','crossing-the-chasm']] },
  outbound:  { label: 'Outbound and prospecting', hours: 6,
               hand: 'List building, enrichment, scoring, and a first-draft sequence.',
               keep: 'The first line of every email. That is the only part anyone reads.',
               skills: [['lucas','prospect-finder'],['lucas','email-writer'],['corey','prospecting']] },
  pr:        { label: 'PR, partnerships and creators', hours: 3,
               hand: 'The media list, pitch variants per outlet, the follow-up tracker.',
               keep: 'Who you ask. A badly chosen partner costs more than a quiet quarter.',
               skills: [['corey','public-relations'],['corey','co-marketing'],['corey','influencer-marketing']] },
  leadgen:   { label: 'Lead magnets and funnels', hours: 4,
               hand: 'The magnet outline, the nurture sequence, landing copy variants.',
               keep: 'Whether the magnet is worth an email address. Usually it is not.',
               skills: [['corey','lead-magnets'],['corey','offers'],['corey','popups']] },
  pricing:   { label: 'Pricing and packaging', hours: 3,
               hand: 'The competitor sweep, packaging options, the objection list.',
               keep: 'The number. Pricing is a positioning decision wearing a spreadsheet.',
               skills: [['corey','pricing'],['wondel','monetizing-innovation'],['wondel','hundred-million-offers']] },
  linkedin:  { label: 'Founder-led content on LinkedIn', hours: 5,
               hand: 'Hook variants, the post shaped into short lines, the comment replies drafted.',
               keep: 'The opinion. A take nobody can disagree with is not a take.',
               skills: [['corey','social'],['wondel','contagious'],['lucas','text-trainer']] },
  newsletter:{ label: 'A newsletter or Substack', hours: 5,
               hand: 'The outline, the subject lines, the recurring sections, the archive.',
               keep: 'The one thing you actually believe this week.',
               skills: [['corey','emails'],['corey','content-strategy'],['wondel','made-to-stick']] },
  calendar:  { label: 'The content calendar and editorial plan', hours: 4,
               hand: 'The grid, the repurposing map, the gaps nobody noticed.',
               keep: 'What gets killed. A full calendar is not a strategy.',
               skills: [['notfair','content-planner'],['corey','content-strategy'],['corey','marketing-loops']] },
  video:     { label: 'Short form video and YouTube', hours: 5,
               hand: 'Scripts, hook options, titles, descriptions, the thumbnail brief.',
               keep: 'The first three seconds. Watch them back yourself.',
               skills: [['corey','video'],['corey','image'],['corey','social']] },
  podcast:   { label: 'A podcast or interview series', hours: 4,
               hand: 'Guest research, question sets, show notes, the clip list.',
               keep: 'The follow-up question. That is where the episode happens.',
               skills: [['corey','content-strategy'],['corey','co-marketing'],['corey','customer-research']] },
  lifecycle: { label: 'Lifecycle, onboarding and retention', hours: 5,
               hand: 'The trigger map, the sequence, the win-back, the churn reasons sorted.',
               keep: 'The apology email. Write that one yourself.',
               skills: [['corey','onboarding'],['corey','churn-prevention'],['wondel','improve-retention']] },
  messaging: { label: 'Positioning and messaging', hours: 4,
               hand: 'Competitor messaging sweeps, the matrix, the alternatives you are really against.',
               keep: 'The sentence the whole company repeats. That one is a decision.',
               skills: [['wondel','obviously-awesome'],['wondel','storybrand-messaging'],['wondel','jobs-to-be-done']] },
  enablement:{ label: 'Sales enablement and decks', hours: 4,
               hand: 'The deck, the one-pager, the objection handling doc, the follow-up templates.',
               keep: 'The objection nobody wants written down. Ask sales what it is.',
               skills: [['corey','sales-enablement'],['corey','product-marketing'],['wondel','predictable-revenue']] },
  loops:     { label: 'Referrals and growth loops', hours: 3,
               hand: 'The loop map, the incentive maths, the share copy.',
               keep: 'Whether the loop is worth the favour you are asking of a customer.',
               skills: [['corey','referrals'],['corey','marketing-loops'],['wondel','cold-start-problem']] },
  team:      { label: 'Managing writers or a team', hours: 4,
               hand: 'The brief template, the first edit pass, the style check.',
               keep: 'The feedback conversation. Nobody grows from a diff.',
               skills: [['wondel','high-output-management'],['corey','copy-editing']] },
};

const ROLES = {
  content:   { label: 'Content marketer',        jobs: ['blog','seo','calendar','newsletter','social','video','research','analytics','brand','team'] },
  brand:     { label: 'Brand and communications',jobs: ['brand','messaging','pr','social','blog','research','launch','video','team','community'] },
  community: { label: 'Community manager',       jobs: ['community','social','newsletter','email','pr','podcast','research','analytics','loops'] },
  growth:    { label: 'Growth and performance',  jobs: ['ads','cro','analytics','lifecycle','email','leadgen','seo','loops','research','pricing'] },
  pmm:       { label: 'Product marketing',       jobs: ['launch','messaging','enablement','research','pricing','analytics','blog','cro','team'] },
  social:    { label: 'Social media manager',    jobs: ['social','video','linkedin','community','calendar','pr','analytics','brand'] },
  founder:   { label: 'Founder doing the marketing', jobs: ['linkedin','newsletter','outbound','launch','messaging','pricing','calendar','social','leadgen','loops'] },
};

/* The line that runs along the bottom of every sheet, by role. */
const CLOSERS = {
  content:   'Your advantage was never typing speed. It is knowing which sentence a reader will remember.',
  brand:     'A brand is the sum of what everyone decided to say when nobody was watching. Write the rules down and the machine can hold them.',
  community: 'Automate the admin of a community and none of the belonging. People can tell.',
  growth:    'The machine will run a hundred tests. Deciding which hundred is still the job.',
  pmm:       'A launch is one sentence, repeated. Everything else is logistics an agent can carry.',
  social:    'Volume is cheap now. Being worth following is not.',
  founder:   'You are the only one who can say what the company is for. Hand over everything else.',
};

/* ── the other door ───────────────────────────────────────────────────────
   Outside marketing, Promptly stops recommending skills it cannot vouch for
   and hands over the architecture instead. Six layers and two loops, lifted
   from the agent Mehr actually works with. Role-agnostic on purpose. */

const ARCH = [
  { n: 'It reads its own rules first',
    d: 'Before anything else it opens a memory file: everything you have ever corrected it on, how you write, what you will not claim, which numbers are confirmed. It starts from what it already knows about you rather than from nothing.' },
  { n: 'It researches, with a source on every line',
    d: 'It reads the actual thing, not its recollection of the thing. Findings go to a file with a citation beside each claim, so you can check the ones that matter.' },
  { n: 'It builds from one source of truth',
    d: 'Every output renders from one file of facts. A number corrected once is corrected everywhere, which is the only way a growing pile of documents stays honest.' },
  { n: 'It checks itself, and refuses',
    d: 'It tests its own work against cases with deliberate traps, and it tells you which claims it could not verify instead of quietly filling the gap. Below its own bar, it stops rather than ships.' },
  { n: 'You approve, then it ships',
    d: 'Nothing is sent, posted or published without you. Drafts every time. This is the layer that makes the rest safe to use.' },
  { n: 'Every correction becomes a rule',
    d: 'Tell it once that a phrase is not how you talk and it is written into memory. The system gets better at your job while you do your job.' },
];

const LOOPS = [
  { n: 'It asks before it guesses',
    d: 'When two readings of a request would produce different work, it stops and asks rather than picking one and hoping.' },
  { n: 'It says what it does not know',
    d: 'An unverifiable claim is flagged, not smoothed over. This is the habit that makes the other five layers worth trusting.' },
];

/* Skills worth having whatever the job. Named, not just linked. */
const GENERIC = [
  ['wondel','mom-test',              'Interview people without leading them'],
  ['wondel','good-strategy-bad-strategy','Tell a strategy from a list of hopes'],
  ['wondel','high-output-management','Run a team and its meetings'],
  ['corey','customer-research',      'Synthesise what people actually told you'],
  ['corey','analytics',              'Pull a weekly read without a dashboard'],
  ['wondel','technical-documentation','Write the thing down so it survives you'],
];

/* Typing beats picking from a wall of chips, so the role is a free field and
   this decides which door it opens. First match wins, order matters. */
const MATCH = [
  [/product\s*market|pmm/i,                                   'pmm'],
  [/growth|performance|paid|ppc|acquisition|demand\s*gen|crm/i,'growth'],
  [/community|moderat|forum|discord|slack\s*lead/i,           'community'],
  [/social\s*media|social$|instagram|tiktok|linkedin\s*lead/i, 'social'],
  [/brand|communicat|comms|pr\b|public\s*relations/i,         'brand'],
  [/founder|ceo|co.?founder|solopreneur|owner|freelanc/i,     'founder'],
  [/content|writer|copywrit|copy\b|editor|blog|seo|journalis|newsletter|substack/i,'content'],
  [/market/i,                                                 'content'],
];

/* The placeholder cycles, so the field reads as an invitation rather than a form. */
const EXAMPLES = ['content marketer','community manager','growth lead','product marketer',
  'brand strategist','founder doing my own marketing','hospital operations manager',
  'secondary school teacher','recruiter','product designer'];
