/* The guide, cut to what fits on a card you can swipe past. Everything that
   needed a paragraph has either become one line or gone. */
const CARDS = [
  // ── how to prompt ─────────────────────────────────────────────────────
  {c:'prompt', k:'list', t:'Every prompt has five lines',
   items:['<b>Role.</b> Who the AI should be.','<b>Reader.</b> Who it is writing for.',
          '<b>Facts.</b> What it may use. Nothing else.','<b>Voice.</b> How it sounds, and what it never says.',
          '<b>Output.</b> Exactly what to hand back.']},
  {c:'prompt', k:'vs', t:'Five lines beat one',
   a:'<b>Five lines</b><br>A draft you can actually use.',
   b:'<b>One line</b><br>An average answer, in an average voice.'},
  {c:'prompt', k:'hot', t:'The prompt is the brief',
   body:'If a human junior could not write from it, the AI cannot either.'},

  // ── website ───────────────────────────────────────────────────────────
  {c:'web', k:'big', t:'Say what changes for the customer.', body:'Then prove it.'},
  {c:'web', k:'list', t:'A landing page sells one promise',
   items:['Headline: the outcome, not the product.','Proof sits beside the claim, not three scrolls down.',
          'Three benefits, in your customer&rsquo;s words.','One ask, one button, one next step.']},
  {c:'web', k:'list', t:'A product page answers the last doubt',
   items:['Benefit first, then the fact behind it.','Size, fit, care, delivery, returns.',
          '&ldquo;Soft&rdquo; beats &ldquo;premium&rdquo;. Sensory beats adjective.','Check every claim with legal.']},
  {c:'web', k:'vs', t:'Same product, two writers',
   a:'<b>Apple, 2001</b><br>&ldquo;1,000 songs in your pocket.&rdquo;',
   b:'<b>The spec sheet</b><br>&ldquo;5GB MP3 player.&rdquo;'},
  {c:'web', k:'hot', t:'Premium is not a word',
   body:'&ldquo;Premium&rdquo;, &ldquo;innovative&rdquo; and &ldquo;seamless&rdquo; are placeholders. When I see one in a draft, I ask what we actually mean.'},
  {c:'web', k:'code', t:'Landing page prompt',
   code:'You are a senior conversion copywriter. Write a landing page for\n[PRODUCT].\n\nReader: [WHO], worried about [OBJECTION].\n\nUse only these facts: [FACTS, NUMBERS, REVIEWS]. If a claim is not\nbacked by them, flag it instead of writing it.\n\nVoice: [3 ADJECTIVES]. Never use: [BANNED WORDS].\n\nGive me: 5 headlines that state an outcome, 1 subhead, 3 benefits\nwith proof, and 1 call to action that says what happens next.'},

  // ── social ────────────────────────────────────────────────────────────
  {c:'social', k:'big', t:'Win the first line.', body:'The rest only has to keep the promise.'},
  {c:'social', k:'list', t:'Instagram: three seconds',
   items:['Put the payoff on screen and out loud, straight away.','The point goes in the first line. The feed cuts the rest.',
          'Show the real thing. A face, a number, the product.','One post, one point.']},
  {c:'social', k:'list', t:'LinkedIn: a few lines',
   items:['Hook: a result, a mistake, a contrarian take or a question.','Short lines. One idea each. A blank line between.',
          'The situation, the turn, the lesson.','End on one question they can answer in a line.']},
  {c:'social', k:'vs', t:'A hook, and a sentence',
   a:'<b>Oreo, 2013</b><br>&ldquo;You can still dunk in the dark.&rdquo;',
   b:'<b>The brand line</b><br>&ldquo;Our cookies are perfect for any occasion.&rdquo;'},
  {c:'social', k:'hot', t:'If anyone could post it, it is not a hook',
   body:'Make it so specific that only you could have written it.'},
  {c:'social', k:'code', t:'Sharpen the hook',
   code:'Here is my draft post: [PASTE].\n\nRewrite only the first line 5 ways: a result, a mistake, a\ncontrarian take, a question and a specific moment.\n\nScore each from 1 to 5 on: specific, surprising, would I stop\nscrolling?\n\nPick the best and say why in one sentence. Do not touch the rest.'},

  // ── brand voice ───────────────────────────────────────────────────────
  {c:'brand', k:'big', t:'A voice is not adjectives.', body:'It is decisions.'},
  {c:'brand', k:'list', t:'Ask the founder this',
   items:['What do we believe that our category does not?','What would we never say, and who do we hate sounding like?',
          'Five pieces of copy you are proud of.','Push past &ldquo;friendly and professional&rdquo;.']},
  {c:'brand', k:'list', t:'Then write it down',
   items:['Every trait gets a &ldquo;not&rdquo;. Warm, not chatty.','Show each trait in a before-and-after line.',
          'Plan the error, the apology and the refund.','One page a new writer can use today.']},
  {c:'brand', k:'vs', t:'Traits you can act on',
   a:'<b>Mailchimp</b><br>&ldquo;We are plainspoken. We are genuine. Our humor is dry.&rdquo;',
   b:'<b>Everyone else</b><br>&ldquo;We&rsquo;re friendly and professional.&rdquo;'},
  {c:'brand', k:'hot', t:'A voice is what you refuse to say',
   body:'The &ldquo;nots&rdquo; do more work than the adjectives. Never accept &ldquo;somewhere in between&rdquo;.'},
  {c:'brand', k:'code', t:'Turn answers into a guide',
   code:'You are a brand strategist and senior writer. Here are the\nfounder’s answers: [PASTE] and five pieces of copy they love:\n[PASTE].\n\nFind the three traits that show up in both. For each: what it\nsounds like, "we are X, not Y", a before-and-after sentence,\nthree words we use and three we avoid.\n\nThen add tone for a launch, an error and an apology.\n\nQuote the founder’s own words. Flag anything that contradicts.'},

  // ── your voice ────────────────────────────────────────────────────────
  {c:'you', k:'big', t:'You already have a voice.', body:'Notice it, then make it deliberate.'},
  {c:'you', k:'list', t:'Notice',
   items:['Read it aloud. Where you stumble, the sentence is wrong.','Count the words in your last five sentences.',
          'List the words you overuse. Just. Really. Very.','Find the three lines that sound most like you.']},
  {c:'you', k:'list', t:'Edit',
   items:['Put a short sentence next to a long one.','Cut &ldquo;just&rdquo;, &ldquo;I think&rdquo; and the warm-up.',
          'If a short word works, use it.','Keep the habits that sound like you.']},
  {c:'you', k:'vs', t:'The hedge and the ask',
   a:'<b>Say this</b><br>Can we talk Thursday?',
   b:'<b>Not this</b><br>I just wanted to quickly reach out to see if you might have some time to connect.'},
  {c:'you', k:'hot', t:'Stop sanding it down',
   body:'You do not need to find your voice. You need to stop smoothing it away.'},
  {c:'you', k:'code', t:'Let AI read your samples',
   code:'You are an editor who reads for voice, not grammar. Here are five\nsamples of my writing: [PASTE]. Do not rewrite them.\n\nDescribe my voice: average sentence length, words and openers I\nrepeat, how formal I am, how I use questions.\n\nQuote the 3 lines that sound most like me and the 3 that sound\nleast, and say why.\n\nThen give me 5 habits to keep and 3 to break. Evidence over praise.'},

  // ── before it ships ───────────────────────────────────────────────────
  {c:'ship', k:'check', t:'Website', items:['Headline states the outcome','Every claim has proof','One ask, one clear verb','Details match the product','Read aloud: sounds human']},
  {c:'ship', k:'check', t:'Social', items:['First line works alone','One idea, nothing extra','Cut for the platform','Ends on a real question','Facts and tags checked']},
  {c:'ship', k:'check', t:'Brand voice', items:['Every trait has a &ldquo;not&rdquo;','Real before-and-after lines','Hard moments planned','Fits on one page','Founder says &ldquo;that&rsquo;s us&rdquo;']},
  {c:'ship', k:'check', t:'Your voice', items:['Read aloud, no stumbles','Short next to long','Hedges and filler cut','Still sounds like you','Cut the first line: still works?']},
  {c:'ship', k:'hot', t:'Only a person can check it',
   body:'AI can draft it. Every fact, price and claim gets read by a human.'},
];

const CHAPTERS = [
  ['all','Everything'], ['prompt','How to prompt'], ['web','Website'],
  ['social','Social'], ['brand','Brand voice'], ['you','Your voice'], ['ship','Before it ships'],
];
