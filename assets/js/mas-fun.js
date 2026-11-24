/* MAS fun layer — cute robot mascot, prisoner's-dilemma mini game,
   herding playground, dice, robot parade easter egg.
   Self-contained: injects its own styles and DOM. No external deps. */
(function () {
  'use strict';
  if (window.__masFun) return;
  window.__masFun = true;

  var QUOTES = [
    'سکوت کن تا هر دو آزاد شویم! 🤫',
    'تعادل نش: هر دو اعتراف 🥲',
    'γ کوچک = کوته‌بین! 👀',
    'من خودمختارم؛ خودم تصمیم می‌گیرم 🤖',
    'هماهنگی یعنی صبر برای خروج از در کلاس 🚪',
    'No-Op هم یک کنش آگاهانه است 😌',
    'گله را به آغل برسان! 🐄',
    'عقلانیت محدود، ولی خوش‌حال! 😄',
    'AAMAS منتظر مقالهٔ توست 📄',
    'همکاری: هر دو یک نمرهٔ خوب می‌گیریم 🤝',
  ];
  var quoteIdx = 0;

  var STYLE = document.createElement('style');
  STYLE.textContent = [
    '#masbot{position:fixed;bottom:14px;inset-inline-start:14px;z-index:9999;cursor:pointer;user-select:none;-webkit-user-select:none;filter:drop-shadow(0 6px 18px rgba(0,0,0,.45));transition:transform .25s ease}',
    '#masbot:hover{transform:translateY(-6px) scale(1.04)}',
    '#masbot.wave{animation:maswave .9s ease}',
    '@keyframes maswave{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}55%{transform:rotate(10deg)}}',
    '#masbubble{position:fixed;bottom:118px;inset-inline-start:16px;z-index:9999;max-width:240px;background:#143325;border:1px solid rgba(110,231,183,.35);color:#e6f3ea;font-family:Vazirmatn,system-ui,sans-serif;font-size:13.5px;line-height:1.9;padding:10px 14px;border-radius:16px;border-end-start-radius:4px;box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .25s ease,transform .25s ease}',
    '#masbubble.show{opacity:1;transform:translateY(0)}',
    '#masbubble::after{content:"";position:absolute;bottom:-7px;inset-inline-start:18px;width:12px;height:12px;background:#143325;border-inline-end:1px solid rgba(110,231,183,.35);border-bottom:1px solid rgba(110,231,183,.35);transform:rotate(45deg)}',
    '#masparade{position:fixed;left:0;right:0;bottom:0;height:86px;z-index:10000;pointer-events:none;overflow:hidden}',
    '#masparade .parader{position:absolute;bottom:0;animation:masmarch 7s linear forwards}',
    '#masparade .msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#6ee7b7;font-family:Vazirmatn,system-ui,sans-serif;font-size:17px;font-weight:700;text-shadow:0 2px 12px rgba(0,0,0,.6);opacity:0;animation:masfade 7s ease forwards}',
    '@keyframes masmarch{0%{transform:translateX(-110%)}100%{transform:translateX(110vw)}}',
    '@keyframes masfade{0%,12%{opacity:0}20%,80%{opacity:1}100%{opacity:0}}',
    '.masfun-card{max-width:560px;margin:22px auto;background:linear-gradient(160deg,#10291d,#143325);border:1px solid rgba(110,231,183,.22);border-radius:18px;padding:22px;color:#e6f3ea;font-family:Vazirmatn,system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.35)}',
    '.masfun-card h3{margin:0 0 4px;font-size:1.15rem;color:#6ee7b7}',
    '.masfun-card .sub{margin:0 0 14px;font-size:12px;color:#9fb8a9}',
    '.masfun-card .btnrow{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}',
    '.masfun-btn{flex:1;min-width:130px;padding:10px 14px;border-radius:12px;border:1px solid rgba(110,231,183,.4);background:rgba(52,211,153,.1);color:#e6f3ea;font-family:inherit;font-size:14px;cursor:pointer;transition:background .2s,transform .15s}',
    '.masfun-btn:hover{background:rgba(52,211,153,.22);transform:translateY(-2px)}',
    '.masfun-btn.bad{border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.08)}',
    '.masfun-btn.bad:hover{background:rgba(248,113,113,.18)}',
    '.masfun-result{margin-top:12px;min-height:22px;font-size:14.5px;line-height:2}',
    '.payoff{width:100%;border-collapse:collapse;margin:12px 0;font-size:12.5px;direction:rtl}',
    '.payoff th,.payoff td{border:1px solid rgba(110,231,183,.25);padding:7px 8px;text-align:center;color:#cfe8da}',
    '.payoff th{background:rgba(52,211,153,.12);color:#6ee7b7}',
    '.payoff td.hl{background:rgba(251,191,36,.16);color:#fbbf24;font-weight:700}',
    '#herdgame{position:relative;width:100%;height:300px;border-radius:16px;border:1px solid rgba(110,231,183,.3);overflow:hidden;background:radial-gradient(1200px 500px at 50% -20%,rgba(52,211,153,.14),transparent),repeating-linear-gradient(45deg,rgba(110,231,183,.045) 0 12px,transparent 12px 24px),#0a1e15;cursor:crosshair;touch-action:none}',
    '#herdgame .pen{position:absolute;border:2px dashed rgba(251,191,36,.65);border-radius:12px;background:rgba(251,191,36,.08)}',
    '#herdgame .cow{position:absolute;width:13px;height:13px;margin:-6.5px;border-radius:50%;background:#e6f3ea;box-shadow:0 0 8px rgba(230,243,234,.6)}',
    '#herdgame .rob{position:absolute;width:16px;height:16px;margin:-8px;font-size:16px;line-height:1;pointer-events:none}',
    '#herdgame .hud{position:absolute;top:10px;inset-inline-start:12px;font-size:12.5px;color:#9fb8a9}',
    '#herdgame .hud b{color:#6ee7b7}',
    '.masdice{display:inline-block;font-size:34px;line-height:1;cursor:pointer;user-select:none;transition:transform .12s}',
    '.masdice.roll{animation:masdice .5s ease}',
    '@keyframes masdice{0%{transform:rotate(0) scale(1)}40%{transform:rotate(160deg) scale(1.25)}100%{transform:rotate(360deg) scale(1)}}',
    '@media (prefers-reduced-motion: reduce){#masbot,#masparade .parader,#masparade .msg,.masdice.roll{animation:none!important;transition:none!important}}',
  ].join('\n');
  document.head.appendChild(STYLE);

  /* ---------- robot mascot (عاملک) ---------- */
  var robot = document.createElement('div');
  robot.id = 'masbot';
  robot.setAttribute('aria-label', 'ربات عاملک — کلیک کنید');
  robot.innerHTML =
    '<svg width="72" height="84" viewBox="0 0 72 84" fill="none" aria-hidden="true">' +
    '<line x1="36" y1="12" x2="36" y2="4" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="36" cy="3.5" r="3" fill="#fbbf24"/>' +
    '<rect x="12" y="12" width="48" height="38" rx="12" fill="#143325" stroke="#34d399" stroke-width="2.4"/>' +
    '<g id="masbot-eyes">' +
    '<circle cx="27" cy="30" r="3.6" fill="#6ee7b7"/>' +
    '<circle cx="45" cy="30" r="3.6" fill="#6ee7b7"/>' +
    '</g>' +
    '<path d="M27 42q9 6 18 0" stroke="#34d399" stroke-width="2.2" stroke-linecap="round"/>' +
    '<rect x="18" y="52" width="36" height="24" rx="8" fill="#0f241a" stroke="#34d399" stroke-width="2.2"/>' +
    '<circle cx="30" cy="64" r="2.4" fill="#fbbf24"/><circle cx="36" cy="64" r="2.4" fill="#34d399"/><circle cx="42" cy="64" r="2.4" fill="#fbbf24"/>' +
    '<line x1="24" y1="80" x2="24" y2="76" stroke="#34d399" stroke-width="2.4" stroke-linecap="round"/>' +
    '<line x1="48" y1="80" x2="48" y2="76" stroke="#34d399" stroke-width="2.4" stroke-linecap="round"/>' +
    '</svg>';
  document.body.appendChild(robot);

  var bubble = document.createElement('div');
  bubble.id = 'masbubble';
  bubble.setAttribute('dir', 'rtl');
  document.body.appendChild(bubble);

  function say(txt, ms) {
    bubble.textContent = txt;
    bubble.classList.add('show');
    clearTimeout(say._t);
    say._t = setTimeout(function () { bubble.classList.remove('show'); }, ms || 3400);
  }

  robot.addEventListener('click', function () {
    robot.classList.remove('wave');
    void robot.offsetWidth;
    robot.classList.add('wave');
    say(QUOTES[quoteIdx % QUOTES.length]);
    quoteIdx++;
  });

  /* blinking + eyes follow cursor */
  var blink = setInterval(function () {
    var eyes = robot.querySelectorAll('#masbot-eyes circle');
    var closed = eyes[0].getAttribute('r') === '0.8';
    eyes.forEach(function (e) { e.setAttribute('r', closed ? '3.6' : '0.8'); });
  }, 3400);
  document.addEventListener('mousemove', function (ev) {
    var r = robot.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + 30;
    var dx = (ev.clientX - cx) / 140, dy = (ev.clientY - cy) / 140;
    var mx = Math.max(-3.4, Math.min(3.4, dx)), my = Math.max(-1.6, Math.min(1.6, dy));
    var eyes = robot.querySelectorAll('#masbot-eyes circle');
    eyes[0].setAttribute('transform', 'translate(' + mx + ' ' + my + ')');
    eyes[1].setAttribute('transform', 'translate(' + mx + ' ' + my + ')');
  });

  /* ---------- prisoner's dilemma mini game ---------- */
  function buildDilemmaCard() {
    var host = document.getElementById('mas-dilemma-host');
    if (!host) return;
    var card = document.createElement('div');
    card.className = 'masfun-card';
    card.innerHTML =
      '<h3>🎲 معمای زندانیان — خودت بازی کن</h3>' +
      '<p class="sub">Prisoner’s Dilemma · جلسهٔ ۱ — تو زندانی A هستی؛ ربات، زندانی B</p>' +
      '<table class="payoff"><thead><tr><th>سال‌های زندان (A، B)</th><th>B سکوت می‌کند</th><th>B اعتراف می‌کند</th></tr></thead><tbody>' +
      '<tr><th>A سکوت می‌کند</th><td class="hl">(۱-، ۱-)</td><td>(۲۰-، ۰)</td></tr>' +
      '<tr><th>A اعتراف می‌کند</th><td>(۰، ۲۰-)</td><td class="hl">(۵-، ۵-)</td></tr>' +
      '</tbody></table>' +
      '<div class="btnrow"><button class="masfun-btn" data-move="s">🤫 سکوت</button><button class="masfun-btn bad" data-move="c">🗣️ اعتراف</button></div>' +
      '<div class="masfun-result" aria-live="polite"></div>';
    host.appendChild(card);
    var out = card.querySelector('.masfun-result');
    card.querySelectorAll('[data-move]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var me = btn.getAttribute('data-move');
        var bot = Math.random() < 0.75 ? 'c' : 's'; /* عقلانیت فردی ربات: غالباً اعتراف */
        var txt, yrs;
        if (me === 'c' && bot === 'c') { txt = 'هر دو اعتراف کردید: تعادل نش! هر کدام ۵ سال. 🤝🥲'; yrs = 5; }
        else if (me === 's' && bot === 's') { txt = 'هر دو سکوت کردید: بهینهٔ پارتو! هر کدام فقط ۱ سال. آزادی نزدیک است! 🎉'; yrs = 1; }
        else if (me === 'c') { txt = 'تو اعتراف کردی و آزاد شدی؛ ربات ۲۰ سال گرفت. اما دفعهٔ بعد جبران می‌کند… 😬'; yrs = 0; }
        else { txt = 'تو سکوت کردی و ۲۰ سال گرفتی؛ ربات آزاد شد. عقلانیت جمعی سخت است! 🥺'; yrs = 20; }
        out.innerHTML = '<b>نتیجه:</b> ' + txt + ' <span class="mono" dir="ltr" style="color:#6ee7b7">(' + yrs + ' سال برای تو)</span>';
      });
    });
  }

  /* ---------- herding playground ---------- */
  function buildHerdGame() {
    var host = document.getElementById('mas-herd-host');
    if (!host) return;
    var wrap = document.createElement('div');
    wrap.className = 'masfun-card';
    wrap.innerHTML =
      '<h3>🐄 گله را به آغل برسان!</h3>' +
      '<p class="sub">Herding Benchmark · جلسهٔ ۳ — گاوها از نشانگر تو می‌گریزند؛ ربات‌ها هم کمک می‌کنند</p>' +
      '<div id="herdgame"><div class="hud">در آغل: <b id="herdscore">۰</b> / ۱۴</div></div>';
    host.appendChild(wrap);

    var field = wrap.querySelector('#herdgame');
    var scoreEl = wrap.querySelector('#herdscore');
    var W = field.clientWidth || 520, H = 300;
    var pen = { x: W - 96, y: H - 84, w: 72, h: 64 };
    var penEl = document.createElement('div');
    penEl.className = 'pen';
    penEl.style.cssText = 'left:' + pen.x + 'px;top:' + pen.y + 'px;width:' + pen.w + 'px;height:' + pen.h + 'px';
    field.appendChild(penEl);

    var cows = [];
    for (var i = 0; i < 14; i++) {
      var c = document.createElement('div');
      c.className = 'cow';
      field.appendChild(c);
      cows.push({ el: c, x: 30 + Math.random() * (W - 180), y: 20 + Math.random() * (H - 60), vx: 0, vy: 0, in: false });
    }
    var bots = [];
    ['🤖', '🤖', '🤖'].forEach(function (glyph, bi) {
      var r = document.createElement('div');
      r.className = 'rob';
      r.textContent = glyph;
      field.appendChild(r);
      bots.push({ el: r, x: W / 2 + bi * 34, y: H / 2 + bi * 22, vx: 0, vy: 0, t: bi });
    });

    var mouse = { x: -999, y: -999, on: false };
    field.addEventListener('pointermove', function (e) {
      var rect = field.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.on = true;
    });
    field.addEventListener('pointerleave', function () { mouse.on = false; });

    var inPen = 0;
    function tick() {
      cows.forEach(function (cw) {
        var fx = 0, fy = 0;
        if (mouse.on) {
          var dx = cw.x - mouse.x, dy = cw.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160 && d2 > 1) { var d = Math.sqrt(d2); fx += (dx / d) * 2.6; fy += (dy / d) * 2.6; }
        }
        /* جدایی گله (swarm separation) */
        cows.forEach(function (o) {
          if (o === cw) return;
          var dx = cw.x - o.x, dy = cw.y - o.y, d2 = dx * dx + dy * dy;
          if (d2 < 34 * 34 && d2 > 1) { var d = Math.sqrt(d2); fx += (dx / d) * 0.5; fy += (dy / d) * 0.5; }
        });
        cw.vx += fx * 0.3; cw.vy += fy * 0.3;
        cw.vx *= 0.82; cw.vy *= 0.82;
        cw.x += cw.vx; cw.y += cw.vy;
        if (cw.x < 8) { cw.x = 8; cw.vx = Math.abs(cw.vx) * 0.5; }
        if (cw.x > W - 8) { cw.x = W - 8; cw.vx = -Math.abs(cw.vx) * 0.5; }
        if (cw.y < 8) { cw.y = 8; cw.vy = Math.abs(cw.vy) * 0.5; }
        if (cw.y > H - 8) { cw.y = H - 8; cw.vy = -Math.abs(cw.vy) * 0.5; }
        var nowIn = cw.x > pen.x + 4 && cw.x < pen.x + pen.w - 4 && cw.y > pen.y + 4 && cw.y < pen.y + pen.h - 4;
        if (nowIn && !cw.in) { inPen++; }
        if (!nowIn && cw.in) { inPen--; }
        cw.in = nowIn;
        cw.el.style.left = cw.x + 'px';
        cw.el.style.top = cw.y + 'px';
        cw.el.style.opacity = nowIn ? '0.85' : '1';
      });
      /* ربات‌های چوپان: گاوهای خارج از آغل را به سمت آغل هل می‌دهند */
      bots.forEach(function (b, bi) {
        var tx = W / 2, ty = H / 2;
        var best = null, bd = 1e9;
        cows.forEach(function (cw) {
          if (cw.in) return;
          var d = Math.abs(cw.x - pen.x - pen.w / 2) + Math.abs(cw.y - pen.y - pen.h / 2);
          if (d < bd) { bd = d; best = cw; }
        });
        if (best) {
          var ang = Math.atan2(best.y - pen.y - pen.h / 2, best.x - pen.x - pen.w / 2);
          tx = best.x + Math.cos(ang) * 44; ty = best.y + Math.sin(ang) * 44;
        }
        b.t += 0.05;
        b.vx += (tx - b.x) * 0.02; b.vy += (ty - b.y) * 0.02;
        b.vx *= 0.9; b.vy *= 0.9;
        b.x += b.vx; b.y += b.vy;
        b.el.style.left = b.x + 'px';
        b.el.style.top = b.y + 'px';
        b.el.style.transform = 'rotate(' + (bi % 2 ? 10 : -10) * Math.sin(b.t) + 'deg)';
      });
      scoreEl.textContent = inPen;
      if (inPen === cows.length) {
        scoreEl.textContent = cows.length;
        say('همهٔ گاوها در آغل! تو یک سیستم چندعاملهٔ واقعی هستی 🏆', 5000);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- dice ---------- */
  function bindDice() {
    document.querySelectorAll('.masdice').forEach(function (d) {
      if (d.dataset.bound) return;
      d.dataset.bound = '1';
      d.setAttribute('role', 'button');
      d.setAttribute('tabindex', '0');
      d.setAttribute('aria-label', 'تاس بازی — بغلتان');
      var faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      function roll() {
        d.classList.remove('roll');
        void d.offsetWidth;
        d.classList.add('roll');
        var n = Math.floor(Math.random() * 6);
        d.textContent = faces[n];
        if (n === 5) say('شیش آوردی! سودمندی انتظاری‌ات بالا رفت 🎲', 2800);
      }
      d.addEventListener('click', roll);
      d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); roll(); } });
    });
  }

  /* ---------- easter egg: type "mas" ---------- */
  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    buf = (buf + (e.key || '')).toLowerCase().slice(-3);
    if (buf === 'mas') {
      buf = '';
      parade();
    }
  });

  function parade() {
    if (document.getElementById('masparade')) return;
    var p = document.createElement('div');
    p.id = 'masparade';
    var glyphs = ['🤖', '🤖', '🤖', '🤖', '🤖', '🤖', '🤖'];
    var html = '<div class="msg">سیستم چندعامله فعال شد: همهٔ ربات‌ها در حال حرکت‌اند! 🤖</div>';
    glyphs.forEach(function (g, i) {
      html += '<div class="parader" style="left:0;animation-delay:' + (i * 0.5) + 's;font-size:' + (26 + (i % 3) * 6) + 'px;bottom:' + (8 + (i % 4) * 18) + 'px">' + g + '</div>';
    });
    p.innerHTML = html;
    document.body.appendChild(p);
    var old = document.title;
    document.title = '🤖 همهٔ عامل‌ها فعال شدند!';
    setTimeout(function () {
      if (p.parentNode) p.parentNode.removeChild(p);
      document.title = old;
    }, 8000);
  }

  /* ---------- init ---------- */
  function init() {
    buildDilemmaCard();
    buildHerdGame();
    bindDice();
    setTimeout(function () { say('سلام! من عاملک هستم 🤖 کلیک کن تا برایت حرف بزنم', 5200); }, 2200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
