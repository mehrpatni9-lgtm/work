/* Promptly. Everything is computed here from data.js: no model call, no key,
   no network. Which means the sheet is the same every time and Mehr can
   defend every line of it. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var state = { role: null, jobs: [], other: '' };
  var MAX = 5;

  /* ── the blank ───────────────────────────────────────────────────── */
  var roleIn = $('role'), typed = '';

  // The placeholder cycles so the field reads as an invitation, and stops the
  // moment anyone touches it.
  var ei = 0, cyc = setInterval(function () {
    if (document.activeElement === roleIn || roleIn.value) { clearInterval(cyc); return; }
    ei = (ei + 1) % EXAMPLES.length; roleIn.placeholder = EXAMPLES[ei];
  }, 2200);

  function matchRole(t) {
    for (var i = 0; i < MATCH.length; i++) if (MATCH[i][0].test(t)) return MATCH[i][1];
    return null;
  }

  var settle;
  roleIn.addEventListener('input', function () {
    typed = this.value.trim();
    this.classList.toggle('long', typed.length > 18);
    this.classList.toggle('xlong', typed.length > 28);
    clearTimeout(settle);
    $('read').hidden = true;                 // say nothing while they are still typing
    $('jobstep').hidden = true;
    sync();
    settle = setTimeout(decide, 650);        // long enough to finish a job title
  });
  roleIn.addEventListener('blur', function () { clearTimeout(settle); decide(); });

  function decide() {
    state.other = typed;
    var hit = typed.length > 1 ? matchRole(typed) : null;
    if (hit !== state.role) {
      state.role = hit; state.jobs = [];
      if (hit) renderJobs(ROLES[hit].jobs);
      $('jobhint').textContent = 'Up to five. Fewer is sharper.';
    }
    $('jobstep').hidden = !hit;
    $('ctxstep').hidden = typed.length < 2;
    $('read').hidden = typed.length < 2;
    $('read').textContent = typed.length < 2 ? '' : hit
      ? 'Marketing. I can get specific.'
      : 'Outside my field, so you get the architecture instead.';
    $('ctxlabel').textContent = hit
      ? 'Optional \u00b7 anything else it should know'
      : 'Your three key responsibilities';
    $('ctx').placeholder = hit
      ? 'Who you work for, how you write, anything it would get wrong.'
      : 'One line each. What are the three things you are actually measured on?';
    sync();
  }


  /* ── step two: the tick list, only for roles Promptly can vouch for ─── */
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
      ? state.jobs.length + ' of ' + MAX + ' picked.' +
        (state.jobs.length === MAX ? ' That is the limit, and it is deliberate.' : '')
      : 'Up to five. Fewer is sharper.';
  });

  function ready() { return typed.length > 1; }
  function sync() {
    $('run').disabled = !ready();
    $('runhint').textContent = ready() ? '' : 'Type anything. Marketing or not.';
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
'HOW YOU WORK',
'1. Read your rules file first: how I write, what I will not claim, and',
'   which numbers are confirmed.',
'2. Research before you write, with a source beside every claim.',
'3. Draft, do not decide. Tell me what you were unsure about.',
'4. Never send, post or publish. Drafts only, every time.',
'5. Every correction I give you becomes a rule. Do not make me repeat it.',
'',
'WHAT I WILL NOT HAVE',
'- Invented numbers. If it is not sourced, say so.',
refuse,
'',
(ctx ? 'HOW I WRITE\n' + ctx + '\n' : ''),
'Start by telling me what you need from me to do this well.'
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
    var isOther = !state.role;                 // nothing matched, so take the other door
    var roleLabel = typed;
    var ctx = $('ctx').value.trim();
    var jobs = state.jobs.slice().sort(function (a, b) { return JOBS[b].hours - JOBS[a].hours; });
    var top = jobs.slice(0, 3);          // the sheet only ever argues for three
    var hours = top.reduce(function (n, id) { return n + JOBS[id].hours; }, 0);

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
      out += '<div class="blk"><h3>Install these three</h3><div class="sk">' +
        GENERIC.slice(0, 3).map(function (g) { return skillCard(g[0], g[1], g[2]); }).join('') + '</div></div>';
      out += '<div class="blk"><h3>Two worth your time</h3><div class="sk">' +
        ['wondel', 'corey'].map(function (r) {
          return '<a href="' + REPOS[r].url + '" target="_blank" rel="noopener">' +
            '<code>' + esc(REPOS[r].name) + '</code>' +
            '<div class="d">' + REPOS[r].count + ' free skills, MIT licensed</div>' +
            '<div class="r">by ' + esc(REPOS[r].by) + '</div></a>';
        }).join('') + '</div></div>';
      out += '<div class="closer">The architecture is the part that works in any job. ' +
        'Everything above it is detail you know better than I do.</div>';
    } else {
      /* 2. what to hand over, ranked */
      out += '<div class="blk"><h3>Hand these over first</h3><ol class="steps">' +
        top.map(function (id) {
          return '<li><div><b>' + esc(JOBS[id].label) + '</b><p>' + esc(JOBS[id].hand) +
                 ' <strong>About ' + JOBS[id].hours + ' hours a week.</strong></p></div></li>';
        }).join('') + '</ol>' +
        '<p class="hint" style="margin-top:var(--s4)">Roughly <b>' + hours +
        ' hours a week</b> once these three are running. Start at the top, not everywhere.</p></div>';

      /* 3. three skills, never more. A list of twelve is a list nobody installs. */
      var seen = {}, picked = [];
      jobs.forEach(function (id) {                 // one from each job first
        var s0 = JOBS[id].skills[0], k = s0[0] + '/' + s0[1];
        if (!seen[k] && picked.length < 3) { seen[k] = 1; picked.push([s0, JOBS[id].label]); }
      });
      jobs.forEach(function (id) {                 // then fill from the rest
        JOBS[id].skills.forEach(function (sk) {
          var k = sk[0] + '/' + sk[1];
          if (!seen[k] && picked.length < 3) { seen[k] = 1; picked.push([sk, JOBS[id].label]); }
        });
      });
      out += '<div class="blk"><h3>Install these three</h3><div class="sk">' +
        picked.map(function (x) { return skillCard(x[0][0], x[0][1], x[1]); }).join('') +
        '</div></div>';

      /* Two places to go next, chosen from the repos the skills came from. */
      var repos = [], rseen = {};
      picked.forEach(function (x) { if (!rseen[x[0][0]]) { rseen[x[0][0]] = 1; repos.push(x[0][0]); } });
      ['corey', 'wondel', 'notfair', 'lucas'].forEach(function (r) {
        if (!rseen[r] && repos.length < 2) { rseen[r] = 1; repos.push(r); }
      });
      out += '<div class="blk"><h3>Two worth your time</h3><div class="sk">' +
        repos.slice(0, 2).map(function (r) {
          return '<a href="' + REPOS[r].url + '" target="_blank" rel="noopener">' +
            '<code>' + esc(REPOS[r].name) + '</code>' +
            '<div class="d">' + REPOS[r].count + ' free skills, MIT licensed</div>' +
            '<div class="r">by ' + esc(REPOS[r].by) + '</div></a>';
        }).join('') + '</div></div>';

      /* 4. the part nobody else writes */
      out += '<div class="blk"><h3>Keep this off the machine</h3><ul class="keep">' +
        top.map(function (id) {
          return '<li>' + TICK + '<div><b>' + esc(JOBS[id].label) + '.</b> ' + esc(JOBS[id].keep) + '</div></li>';
        }).join('') + '</ul></div>';

      out += '<div class="closer">' + esc(CLOSERS[state.role] || '') + '</div>';
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
