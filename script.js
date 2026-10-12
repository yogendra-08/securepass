(() => {
  'use strict';
  const SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?'
  };
  const NAMES = { upper: 'Uppercase', lower: 'Lowercase', numbers: 'Numbers', symbols: 'Symbols' };
  const LEVELS = ['Weak', 'Fair', 'Strong', 'Very Strong'];
  const $ = (id) => document.getElementById(id);
  const el = {
    pw: $('password'), toggle: $('toggle'), copy: $('copy'), gen: $('generate'),
    len: $('length'), lenOut: $('lengthOut'), err: $('error'), toast: $('toast'),
    meter: $('meter'), label: $('strengthLabel'),
    iLen: $('infoLen'), iCats: $('infoCats'), iBits: $('infoBits')
  };
  let toastTimer;

  const hasCrypto = () => !!(window.crypto && typeof window.crypto.getRandomValues === 'function');

  // Unbiased integer in [0, max) via rejection sampling on 32-bit values.
  function randInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buf = new Uint32Array(1);
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
  }
  const pick = (s) => s[randInt(s.length)];

  // Fisher–Yates shuffle using secure randomness.
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generate(length, keys) {
    const pool = keys.map((k) => SETS[k]).join('');
    const out = keys.map((k) => pick(SETS[k])); // one guaranteed per category
    while (out.length < length) out.push(pick(pool));
    return shuffle(out).join('');
  }

  // Approximate: entropy = length * log2(pool size). Assumes uniform random selection.
  function estimate(length, keys) {
    const poolSize = keys.reduce((n, k) => n + SETS[k].length, 0);
    const bits = length * Math.log2(poolSize);
    const level = bits < 45 ? 0 : bits < 70 ? 1 : bits < 100 ? 2 : 3;
    return { bits, level };
  }

  function notify(msg, type) {
    clearTimeout(toastTimer);
    el.toast.textContent = (type === 'ok' ? '✓ ' : '✕ ') + msg;
    el.toast.className = 'toast show ' + type;
    toastTimer = setTimeout(() => { el.toast.className = 'toast'; }, 2500);
  }

  function showError(msg) {
    el.err.textContent = '⚠ ' + msg;
    el.err.hidden = false;
  }

  const selected = () => Object.keys(SETS).filter((k) => $(k).checked);

  function render(pw, keys) {
    const { bits, level } = estimate(pw.length, keys);
    el.pw.value = pw;
    el.iLen.textContent = pw.length;
    el.iCats.textContent = keys.map((k) => NAMES[k]).join(', ');
    el.iBits.textContent = '≈ ' + Math.round(bits) + ' bits';
    el.meter.dataset.level = level + 1;
    el.meter.setAttribute('aria-valuenow', level + 1);
    el.meter.setAttribute('aria-valuetext', LEVELS[level]);
    el.label.textContent = LEVELS[level] + ' (estimate)';
  }

  function onGenerate() {
    el.err.hidden = true;
    if (!hasCrypto()) {
      showError('Secure random generation is unavailable in this browser. Please use a modern browser.');
      notify('Secure randomness unavailable', 'err');
      return;
    }
    const length = parseInt(el.len.value, 10);
    const keys = selected();
    if (!Number.isInteger(length) || length < 8 || length > 64) {
      showError('Invalid length. Choose a value between 8 and 64.');
      notify('Invalid settings', 'err');
      return;
    }
    if (keys.length === 0) {
      showError('Select at least one character set to generate a password.');
      notify('No character sets selected', 'err');
      return;
    }
    render(generate(length, keys), keys);
    notify('New password generated', 'ok');
  }

  async function onCopy() {
    if (!el.pw.value) { notify('Generate a password first', 'err'); return; }
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('unsupported');
      await navigator.clipboard.writeText(el.pw.value);
      el.copy.textContent = 'Copied';
      el.copy.classList.add('done');
      notify('Password copied to clipboard', 'ok');
      setTimeout(() => { el.copy.textContent = 'Copy'; el.copy.classList.remove('done'); }, 1800);
    } catch (e) {
      notify('Copy failed. Select the password and copy manually.', 'err');
    }
  }

  function onToggle() {
    const show = el.pw.type === 'password';
    el.pw.type = show ? 'text' : 'password';
    el.toggle.textContent = show ? 'Hide' : 'Show';
    el.toggle.setAttribute('aria-pressed', String(show));
    el.toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }

  el.len.addEventListener('input', () => { el.lenOut.textContent = el.len.value; });
  el.gen.addEventListener('click', onGenerate);
  el.copy.addEventListener('click', onCopy);
  el.toggle.addEventListener('click', onToggle);
  Object.keys(SETS).forEach((k) => $(k).addEventListener('change', () => {
    if (selected().length === 0) showError('Select at least one character set to generate a password.');
    else el.err.hidden = true;
  }));

  if (!hasCrypto()) {
    showError('Secure random generation is unavailable in this browser.');
    el.gen.disabled = true;
  }
})();
