/* Promptly. Everything is computed here from data.js: no model call, no key,
   no network. Which means the sheet is the same every time and Mehr can
   defend every line of it. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var state = { role: null, jobs: [], other: '' };
  var MAX = 5;

  /* ── step one ─────────────────────────────────────────────────────── */
  var rolesEl = $('roles');
  Object.keys(ROLES).forEach(function (k) {
    rolesEl.insertAdjacentHTML('beforeend',
      '<label class="opt"><input type="radio" name="role" value="' + k + '">' +
      '<span>' + esc(ROLES[k].label) + '</span></label>');
  });
  rolesEl.insertAdjacentHTML('beforeend',
    '<label class="opt"><input type="radio" name="role" value="__other">' +
    '<span>Something else</span></label>');

  rolesEl.addEventListener('change', function (e) {
    state.role = e.target.value;
    state.jobs = [];
    var other = state.role === '__other';
    $('otherwrap').hidden = !other;
    $('jobstep').hidden = other;
    $('ctxstep').hidden = false;
    $('ctxlabel').textContent = other
      ? 'Step two \u00b7 your three key responsibilities'
      : 'Optional \u00b7 anything else it should know';
    $('ctx').placeholder = other
      ? 'One line each. What are the three things you are actually measured on?'
      : 'Who you work for, what you sell, how you write, anything it would get wrong.';
    if (!other) renderJobs(ROLES[state.role].jobs);
    sync();
  });
  $('otherrole').addEventListener('input', function () {
    state.other = this.value.trim(); sync();
  });

  /* ── step two ─────────────────────────────────────────────────────── */
  function renderJobs(ids) {
    $('jobs').innerHTML = ids.map(function (id) {
      return '<label class="opt"><input type="checkbox" value="' + id + '">' +
             '<span>' + esc(JOBS[id].label) + '</span></label>';
    }).join('');
  }
  $('jobs').addEventListener('change', function (e) {
    var v = e.target.value;
    if (e.target.checked) {
      // A sheet that recommends everything recommends nothing.
      if (state.jobs.length >= MAX) { e.target.checked = false; return; }
      state.jobs.push(v);
    } else {
      state.jobs = state.jobs.filter(function (x) { return x !== v; });
    }
    $('jobhint').textContent = state.jobs.length
      ? state.jobs.length + ' of ' + MAX + ' picked.' + (state.jobs.length === MAX ? ' That is the limit, and it is deliberate.' : '')
      : 'Tick up to five.';
    sync();
  });

  function ready() {
    return state.role === '__other' ? state.other.length > 1 : state.jobs.length > 0;
  }
  function sync() {
    $('run').disabled = !ready();
    $('runhint').textContent = ready() ? '' :
      state.role === '__other' ? 'Type your role to begin.' :
      state.role ? 'Tick at least one thing you own.' : 'Pick what you do to begin.';
  }

  /* ── the prompt. The hero of the sheet, so it is written long. ─────── */
  function buildPrompt(roleLabel, jobIds, ctx, ownText) {
    var owns = jobIds.length
      ? jobIds.map(function (id) { return '- ' + JOBS[id].label + '.'; }).join('\n')
      : (ownText ? ownText.split(/\n+/).filter(Boolean).map(function (l) {
            return '- ' + l.replace(/^[-*\u2022\s]+/, '').trim(); }).join('\n')
        : '- (tell me, in a sentence each, the three things you are actually measured on)');
    var refuse = jobIds.length
      ? jobIds.map(function (id) { return '- ' + JOBS[id].keep; }).join('\n')
      : '- Any judgement that decides where my attention goes this week.';

    return [
'You are my chief of staff. I am a ' + roleLabel + '.',
'',
'WHAT I OWN',
owns,
'',
'HOW YOU WORK, IN ORDER',
'1. Read your rules file before anything else. It holds everything I have',
'   corrected you on: how I write, what I will not claim, which numbers are',
'   confirmed and which are not. Start from what you already know about me.',
'2. Research before you write. Read the actual source, not your recollection',
'   of it. Put a citation beside every claim so I can check the ones that matter.',
'3. Work from one file of facts. If a number changes, change it there, so it',
'   changes everywhere at once.',
'4. Draft, do not decide. Bring me the version you would defend, and say what',
'   you were unsure about rather than smoothing it over.',
'5. Check yourself before you hand anything over. Tell me which claims you',
'   could not verify. An honest gap beats a confident guess every time.',
'6. Never send, post, publish or schedule anything. Drafts only, every time,',
'   no matter how certain you are.',
'',
'TWO THINGS THAT MATTER MORE THAN THE REST',
'- Ask before you guess. When two readings of my request would produce',
'  different work, stop and ask me which one I meant.',
'- Every correction becomes a rule. Tell me you have written it down, and do',
'  not make me say it twice.',
'',
'WHAT I WILL NOT HAVE',
'- Invented numbers, percentages or results. If it is not sourced, say so.',
'- Language that sounds like marketing about marketing.',
refuse,
'',
'HOW I WRITE',
(jobIds.length && ctx ? ctx :
 '(Paste two or three things I have written. Learn the shape of my sentences, not just my vocabulary.)'),
'',
'Start by telling me what you would need from me to do this well.'
    ].join('\n');
  }

  /* ── render ───────────────────────────────────────────────────────── */
  function skillCard(repoKey, skill, note) {
    var r = REPOS[repoKey];
    return '<a href="' + r.url + '" target="_blank" rel="noopener">' +
      '<code>' + esc(skill) + '</code>' +
      (note ? '<div class="d">' + esc(note) + '</div>' : '') +
      '<div class="r">' + esc(r.name) + ', by ' + esc(r.by) + '</div></a>';
  }
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.6 9.6 17 19 7"/></svg>';

  function build() {
    var isOther = state.role === '__other';
    var roleLabel = isOther ? state.other : ROLES[state.role].label;
    var ctx = $('ctx').value.trim();
    var jobs = state.jobs.slice().sort(function (a, b) { return JOBS[b].hours - JOBS[a].hours; });
    var hours = jobs.reduce(function (n, id) { return n + JOBS[id].hours; }, 0);

    var out = '';
    out += '<div class="top"><div><h2>' + (isOther ? 'Build your own chief of staff' : 'Your AI set-up') + '</h2>' +
           '<div class="who">' + esc(roleLabel) +
           (jobs.length ? ' &middot; ' + jobs.length + ' responsibilities' : '') + '</div></div>' +
           '<div class="stamp">Promptly<br>' + new Date().toLocaleDateString('en-GB',
             { day: 'numeric', month: 'short', year: 'numeric' }) + '</div></div>';

    /* 1. the prompt */
    out += '<div class="blk"><h3>Your agent&rsquo;s opening prompt</h3>' +
           '<pre id="pr">' + esc(buildPrompt(roleLabel, jobs, ctx, isOther ? ctx : '')) + '</pre>' +
           '<button class="cta ghost copy noprint" id="cp">Copy the prompt</button></div>';

    if (isOther) {
      /* 2. the architecture, which is the part that travels */
      out += '<div class="blk"><h3>The architecture it is built on</h3><ol class="steps">' +
        ARCH.map(function (a) { return '<li><div><b>' + esc(a.n) + '</b><p>' + esc(a.d) + '</p></div></li>'; }).join('') +
        '</ol></div>';
      out += '<div class="blk"><h3>The two loops that make it trustworthy</h3><ul class="keep">' +
        LOOPS.map(function (l) { return '<li>' + TICK + '<div><b>' + esc(l.n) + '.</b> ' + esc(l.d) + '</div></li>'; }).join('') +
        '</ul></div>';
      out += '<div class="blk"><h3>Skills worth having in any job</h3><div class="sk">' +
        GENERIC.map(function (g) { return skillCard(g[0], g[1], g[2]); }).join('') + '</div></div>';
      out += '<div class="closer">The architecture is the part that works in any job. ' +
        'Everything above it is detail you know better than I do.</div>';
    } else {
      /* 2. what to hand over, ranked */
      out += '<div class="blk"><h3>Hand these over first, in this order</h3><ol class="steps">' +
        jobs.map(function (id) {
          return '<li><div><b>' + esc(JOBS[id].label) + '</b><p>' + esc(JOBS[id].hand) +
                 ' <strong>About ' + JOBS[id].hours + ' hours a week.</strong></p></div></li>';
        }).join('') + '</ol>' +
        '<p class="hint" style="margin-top:var(--s4)">Roughly <b>' + hours +
        ' hours a week</b> if you set all of it up. Nobody does it all at once. Start at the top.</p></div>';

      /* 3. named skills */
      var seen = {}, cards = [];
      jobs.forEach(function (id) {
        JOBS[id].skills.forEach(function (s) {
          var k = s[0] + '/' + s[1];
          if (!seen[k]) { seen[k] = 1; cards.push(skillCard(s[0], s[1], JOBS[id].label)); }
        });
      });
      out += '<div class="blk"><h3>' + cards.length + ' skills to install, all free</h3>' +
        '<div class="sk">' + cards.join('') + '</div></div>';

      /* 4. the part nobody else writes */
      out += '<div class="blk"><h3>Keep this off the machine</h3><ul class="keep">' +
        jobs.map(function (id) {
          return '<li>' + TICK + '<div><b>' + esc(JOBS[id].label) + '.</b> ' + esc(JOBS[id].keep) + '</div></li>';
        }).join('') + '</ul></div>';

      out += '<div class="closer">' + esc(CLOSERS[state.role]) + '</div>';
    }

    $('sheet').innerHTML = out;
    $('sheet').hidden = false;
    $('after').hidden = false;
    $('cp').addEventListener('click', function () {
      var t = $('pr').textContent, b = this;
      navigator.clipboard.writeText(t).then(function () {
        b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy the prompt'; }, 1800);
      }).catch(function () { b.textContent = 'Select it and copy'; });
    });
    $('sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('run').addEventListener('click', build);
  $('restart').addEventListener('click', function () { location.reload(); });
})();
