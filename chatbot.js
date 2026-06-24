/* ═══════════════════════════════════════════════════════
   VERSE — Brand Verse Worldwide Client Intake Bot
   Scripted guided flow → Formspree email to Ty
═══════════════════════════════════════════════════════ */
(function () {
  const GOLD   = '#C9A84C';
  const BG     = '#0f0f0f';
  const DARK   = '#080808';
  const BORDER = 'rgba(201,168,76,0.22)';
  const FORMSPREE = 'https://formspree.io/f/xqevkprv';

  /* ── inject styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #verse-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9000;
      display: flex; align-items: center; gap: 10px;
      padding: 13px 22px; background: ${GOLD}; color: #0a0a0a;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: .04em; border: none; border-radius: 100px; cursor: pointer;
      box-shadow: 0 8px 32px rgba(201,168,76,0.35); transition: transform .2s, box-shadow .2s;
    }
    #verse-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(201,168,76,0.45); }
    #verse-btn .verse-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #0a0a0a;
      animation: verse-pulse 2s ease infinite;
    }
    @keyframes verse-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(1.5);} }

    #verse-panel {
      position: fixed; bottom: 90px; right: 28px; z-index: 9000;
      width: 380px; max-width: calc(100vw - 40px);
      background: ${DARK}; border: 1px solid ${BORDER};
      border-radius: 20px; overflow: hidden; display: none; flex-direction: column;
      box-shadow: 0 24px 64px rgba(0,0,0,.8);
      font-family: 'Inter', sans-serif;
      animation: verse-slide-up .3s cubic-bezier(.22,1,.36,1);
    }
    @keyframes verse-slide-up { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
    #verse-panel.open { display: flex; }

    .verse-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; background: ${BG}; border-bottom: 1px solid ${BORDER};
    }
    .verse-header-left { display: flex; align-items: center; gap: 10px; }
    .verse-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(201,168,76,0.12); border: 1px solid ${BORDER};
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
    .verse-header-info .verse-name { font-size: 13px; font-weight: 700; color: #F2EFE9; }
    .verse-header-info .verse-status { font-size: 10px; color: ${GOLD}; letter-spacing: .08em; }
    .verse-close {
      background: none; border: none; color: rgba(255,255,255,.3);
      font-size: 20px; cursor: pointer; line-height: 1; padding: 4px;
      transition: color .2s;
    }
    .verse-close:hover { color: #fff; }

    .verse-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 12px;
      max-height: 360px; min-height: 200px;
      scrollbar-width: thin; scrollbar-color: rgba(201,168,76,.2) transparent;
    }

    .verse-msg {
      display: flex; gap: 8px; align-items: flex-end;
    }
    .verse-msg.bot { flex-direction: row; }
    .verse-msg.user { flex-direction: row-reverse; }

    .verse-bubble {
      max-width: 82%; padding: 11px 14px; border-radius: 16px;
      font-size: 13px; line-height: 1.6; letter-spacing: .01em;
    }
    .verse-msg.bot .verse-bubble {
      background: ${BG}; color: #F2EFE9;
      border: 1px solid rgba(255,255,255,.06);
      border-bottom-left-radius: 4px;
    }
    .verse-msg.user .verse-bubble {
      background: ${GOLD}; color: #0a0a0a; font-weight: 500;
      border-bottom-right-radius: 4px;
    }

    .verse-typing { display: flex; align-items: center; gap: 5px; padding: 11px 14px; }
    .verse-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(201,168,76,.5); animation: verse-bounce .9s ease infinite;
    }
    .verse-typing span:nth-child(2) { animation-delay: .15s; }
    .verse-typing span:nth-child(3) { animation-delay: .30s; }
    @keyframes verse-bounce { 0%,80%,100%{transform:translateY(0);} 40%{transform:translateY(-6px);} }

    .verse-choices {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 0 16px 14px;
    }
    .verse-choice {
      padding: 8px 14px; background: transparent;
      border: 1px solid rgba(201,168,76,.35); border-radius: 100px;
      font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
      color: ${GOLD}; cursor: pointer; transition: all .2s;
    }
    .verse-choice:hover { background: rgba(201,168,76,.12); border-color: ${GOLD}; }

    .verse-input-row {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,.06); background: ${BG};
    }
    .verse-input {
      flex: 1; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
      border-radius: 100px; padding: 10px 16px; color: #F2EFE9;
      font-family: 'Inter', sans-serif; font-size: 13px; outline: none;
      transition: border-color .2s;
    }
    .verse-input:focus { border-color: rgba(201,168,76,.5); }
    .verse-input::placeholder { color: rgba(255,255,255,.25); }
    .verse-send {
      width: 38px; height: 38px; border-radius: 50%;
      background: ${GOLD}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; transition: opacity .2s; flex-shrink: 0;
    }
    .verse-send:hover { opacity: .85; }
    .verse-input-row.hidden { display: none; }
  `;
  document.head.appendChild(style);

  /* ── build DOM ── */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="verse-btn" onclick="verseToggle()">
      <div class="verse-dot"></div>Start Your Project
    </button>

    <div id="verse-panel">
      <div class="verse-header">
        <div class="verse-header-left">
          <div class="verse-avatar">✦</div>
          <div class="verse-header-info">
            <div class="verse-name">Verse</div>
            <div class="verse-status">Brand Verse Assistant · Online</div>
          </div>
        </div>
        <button class="verse-close" onclick="verseToggle()">×</button>
      </div>
      <div class="verse-messages" id="verse-msgs"></div>
      <div class="verse-choices" id="verse-choices"></div>
      <div class="verse-input-row" id="verse-input-row">
        <input class="verse-input" id="verse-input" placeholder="Type your answer…" autocomplete="off" />
        <button class="verse-send" id="verse-send">→</button>
      </div>
    </div>
  `);

  /* ── state ── */
  let open = false;
  let step = 0;
  let started = false;
  const data = {};

  const msgs   = document.getElementById('verse-msgs');
  const choices = document.getElementById('verse-choices');
  const inputRow = document.getElementById('verse-input-row');
  const input  = document.getElementById('verse-input');
  const sendBtn = document.getElementById('verse-send');

  window.verseToggle = function () {
    open = !open;
    document.getElementById('verse-panel').classList.toggle('open', open);
    if (open && !started) { started = true; setTimeout(startFlow, 400); }
    if (open) setTimeout(() => input.focus(), 350);
  };

  sendBtn.addEventListener('click', handleInput);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(); });

  /* ── conversation flow ── */
  const STEPS = [
    /* 0 */ { type: 'choice', key: null,
      ask: "Hey there! 👋 I'm Verse, your guide at Brand Verse Worldwide.\n\nReady to get your new website started?",
      choices: ["Yes, let's do it! 🚀", 'I have a question first'] },

    /* 1 */ { type: 'text', key: 'businessName',
      ask: "Love it! First — what's the name of your business?" },

    /* 2 */ { type: 'text', key: 'industry',
      ask: "What type of business is it? *(e.g. barbershop, restaurant, gym, salon, boutique, contractor…)*" },

    /* 3 */ { type: 'choice', key: 'budget',
      ask: "What's your budget range? All plans include mobile-friendly design, contact form, and 3 rounds of revisions.",
      choices: ['Under $149 — Micro Site', '$149–$299 — Starter', '$299–$600 — Business', '$600+ — Premium / Custom'] },

    /* 4 */ { type: 'choice', key: 'pages',
      ask: "How many pages do you need?",
      choices: ['Just 1 page (landing page)', '2–3 pages', '4–6 pages', '6+ pages / not sure'] },

    /* 5 */ { type: 'choice', key: 'style',
      ask: "What vibe fits your brand best?",
      choices: ['Dark & premium', 'Clean & minimal', 'Bold & colorful', 'Warm & elegant'] },

    /* 6 */ { type: 'text', key: 'colors',
      ask: "Do you have specific colors or examples of sites you like? *(Skip if not sure — just say \"no\")*" },

    /* 7 */ { type: 'text', key: 'name',
      ask: "Got it! Now let's get your contact info. What's your name?" },

    /* 8 */ { type: 'text', key: 'email',
      ask: "What's the best email address to reach you?" },

    /* 9 */ { type: 'text', key: 'phone',
      ask: "Phone number? *(optional — skip with \"no\")*" },

    /* 10 */ { type: 'text', key: 'notes',
      ask: "Anything else you want Ty to know before he starts? *(special features, deadline, questions…)*" },

    /* 11 */ { type: 'submit', key: null,
      ask: null },
  ];

  function startFlow() {
    showStep(0);
  }

  function showStep(i) {
    step = i;
    const s = STEPS[i];
    if (!s) return;

    if (s.type === 'submit') {
      submitForm();
      return;
    }

    botMsg(s.ask, () => {
      if (s.type === 'choice') {
        showChoices(s.choices);
        inputRow.classList.add('hidden');
      } else {
        clearChoices();
        inputRow.classList.remove('hidden');
        setTimeout(() => input.focus(), 100);
      }
    });
  }

  function handleInput() {
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    userMsg(val);
    const s = STEPS[step];
    if (s && s.key) data[s.key] = val;
    setTimeout(() => showStep(step + 1), 600);
  }

  function handleChoice(val) {
    clearChoices();
    inputRow.classList.add('hidden');
    userMsg(val);

    /* step 0 — welcome branch */
    if (step === 0) {
      if (val.includes('question')) {
        setTimeout(() => {
          botMsg("Of course! Feel free to email Ty directly at tscales22@brand-verses.com or call (336) 210-6654. Or if you're ready now, click below to kick things off 👇", () => {
            showChoices(["I'm ready — let's start!"]);
            inputRow.classList.add('hidden');
          });
        }, 600);
        return;
      }
    }

    const s = STEPS[step];
    if (s && s.key) data[s.key] = val;
    setTimeout(() => showStep(step + 1), 600);
  }

  async function submitForm() {
    botMsg("Putting your brief together… give me one second ✨");

    const summary = `
NEW CLIENT INQUIRY — Brand Verse Worldwide

Business Name: ${data.businessName || '—'}
Industry: ${data.industry || '—'}
Budget Range: ${data.budget || '—'}
Pages Needed: ${data.pages || '—'}
Style / Vibe: ${data.style || '—'}
Colors / Inspiration: ${data.colors || '—'}

CLIENT CONTACT
Name: ${data.name || '—'}
Email: ${data.email || '—'}
Phone: ${data.phone || '—'}

NOTES
${data.notes || 'None provided'}
    `.trim();

    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Client — ${data.businessName || 'Unknown'} (${data.budget || 'Budget TBD'})`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: summary,
        })
      });

      if (res.ok) {
        setTimeout(() => {
          botMsg(`You're all set, ${data.name ? data.name.split(' ')[0] : 'friend'}! 🎉\n\nTy has your brief and will reach out within 24 hours to discuss your project.\n\nIn the meantime you can email him directly at tscales22@brand-verses.com`);
          inputRow.classList.add('hidden');
          clearChoices();
          // update button
          const btn = document.getElementById('verse-btn');
          btn.innerHTML = '<div class="verse-dot"></div>Request Sent ✓';
          btn.style.background = '#2a6b2a';
        }, 1200);
      } else {
        throw new Error('Send failed');
      }
    } catch {
      botMsg("Hmm, something went wrong sending your info. Please email Ty directly at tscales22@brand-verses.com — sorry about that!");
    }
  }

  /* ── helpers ── */
  function botMsg(text, cb) {
    /* typing indicator */
    const typing = document.createElement('div');
    typing.className = 'verse-msg bot';
    typing.innerHTML = `<div class="verse-bubble verse-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(typing);
    scrollBottom();

    const delay = Math.min(800 + text.length * 14, 2200);

    setTimeout(() => {
      typing.remove();
      const el = document.createElement('div');
      el.className = 'verse-msg bot';
      /* convert markdown-lite: **bold**, *italic*, \n */
      const html = text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      el.innerHTML = `<div class="verse-bubble">${html}</div>`;
      msgs.appendChild(el);
      scrollBottom();
      if (cb) cb();
    }, delay);
  }

  function userMsg(text) {
    const el = document.createElement('div');
    el.className = 'verse-msg user';
    el.innerHTML = `<div class="verse-bubble">${text}</div>`;
    msgs.appendChild(el);
    scrollBottom();
  }

  function showChoices(opts) {
    clearChoices();
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'verse-choice';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleChoice(opt));
      choices.appendChild(btn);
    });
  }

  function clearChoices() {
    choices.innerHTML = '';
  }

  function scrollBottom() {
    setTimeout(() => { msgs.scrollTop = msgs.scrollHeight; }, 50);
  }
})();
