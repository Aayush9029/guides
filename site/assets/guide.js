const search = document.querySelector('#shortcut-search');
const clear = document.querySelector('#clear-search');
const status = document.querySelector('#search-status');
const rows = [...document.querySelectorAll('[data-shortcut]')];
const groups = [...document.querySelectorAll('[data-group]')];
function filterShortcuts() {
  const query = search.value.toLowerCase().trim();
  const words = query.split(/\s+/).filter(Boolean);
  let count = 0;
  for (const row of rows) {
    const category = row.closest('[data-group]').dataset.group;
    const searchable = row.dataset.search + (['backlight', 'side lights'].includes(category) ? ' rgb lighting' : '');
    row.hidden = !words.every(word => searchable.includes(word));
    if (!row.hidden) count++;
  }
  for (const group of groups) group.hidden = ![...group.querySelectorAll('[data-shortcut]')].some(row => !row.hidden);
  clear.hidden = !query;
  status.hidden = !query;
  status.textContent = count ? `${count} shortcut${count === 1 ? '' : 's'}` : 'No shortcuts found. Try another word.';
}
search.addEventListener('input', filterShortcuts);
clear.addEventListener('click', () => { search.value = ''; filterShortcuts(); search.focus(); });
filterShortcuts();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const colors = ['#35d6a0', '#72b8fa', '#b69aff', '#f395c3', '#f3cf68'];
let partyTimer;
let lastFnPress = 0;
let logoClicks = 0;
let logoTimer;

function sparkle(element) {
  if (reducedMotion.matches) return;
  const bounds = element.getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement('span');
    spark.className = 'key-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.style.setProperty('--spark-color', colors[i % colors.length]);
    spark.style.left = `${bounds.left + bounds.width / 2}px`;
    spark.style.top = `${bounds.top + bounds.height / 2}px`;
    document.body.append(spark);
    const angle = Math.PI * 2 * i / 10;
    const distance = 45 + Math.random() * 40;
    const animation = spark.animate([
      { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(100deg)`, opacity: 0 }
    ], { duration: 700, easing: 'cubic-bezier(.2,.7,.3,1)' });
    animation.finished.then(() => spark.remove()).catch(() => spark.remove());
  }
}

function party(element) {
  document.body.classList.add('party');
  clearTimeout(partyTimer);
  partyTimer = setTimeout(() => document.body.classList.remove('party'), 5000);
  sparkle(element);
  document.querySelectorAll('.led-strip').forEach(strip => wave(strip));
}

function wave(strip) {
  if (reducedMotion.matches) return;
  strip.querySelectorAll('.led-pixel').forEach((pixel, index) => {
    pixel.getAnimations().forEach(animation => animation.cancel());
    pixel.animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.8)', background: colors[index % colors.length] },
      { filter: 'brightness(1)' }
    ], { duration: 650, delay: index * 35, easing: 'ease-in-out' });
  });
}

function setLight(kind, choice) {
  const strip = document.querySelector(`[data-led="${kind}"]`);
  strip.style.setProperty('--led-color', choice.dataset.color);
  document.querySelectorAll(`[data-light="${kind}"]`).forEach(button => {
    button.setAttribute('aria-pressed', String(button === choice));
  });
  wave(strip);
}

document.querySelectorAll('[data-light]').forEach(choice => {
  choice.addEventListener('click', () => setLight(choice.dataset.light, choice));
});

document.querySelectorAll('[data-led]').forEach(strip => {
  strip.addEventListener('click', () => {
    const choices = [...document.querySelectorAll(`[data-light="${strip.dataset.led}"]`)];
    const current = choices.findIndex(choice => choice.getAttribute('aria-pressed') === 'true');
    setLight(strip.dataset.led, choices[(current + 1) % choices.length]);
  });
});

document.querySelectorAll('.hero-key').forEach(key => {
  key.addEventListener('click', () => {
    key.classList.add('is-pressed');
    setTimeout(() => key.classList.remove('is-pressed'), 160);
    if (key.dataset.egg === 'fn') {
      lastFnPress = Date.now();
      sparkle(key);
    } else if (Date.now() - lastFnPress < 3000) {
      lastFnPress = 0;
      party(key);
    } else {
      sparkle(key);
    }
  });
});

document.querySelector('[data-egg="keyboard"]').addEventListener('click', event => {
  const keyboard = event.currentTarget;
  sparkle(keyboard);
  if (!reducedMotion.matches) {
    keyboard.getAnimations().forEach(animation => animation.cancel());
    keyboard.animate([
      { transform: 'rotate(0) translateY(0)' },
      { transform: 'rotate(-2deg) translateY(-5px)' },
      { transform: 'rotate(1deg) translateY(1px)' },
      { transform: 'rotate(0) translateY(0)' }
    ], { duration: 500, easing: 'ease-out' });
  }
});

document.querySelector('[data-egg="logo"]').addEventListener('click', event => {
  logoClicks++;
  clearTimeout(logoTimer);
  logoTimer = setTimeout(() => { logoClicks = 0; }, 1800);
  if (logoClicks >= 5) {
    logoClicks = 0;
    party(event.currentTarget);
  }
});

const keyboardToy = document.querySelector('[data-egg="keyboard"]');
keyboardToy.addEventListener('dblclick', () => party(keyboardToy));
keyboardToy.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const bounds = keyboardToy.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  keyboardToy.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
});
keyboardToy.addEventListener('pointerleave', () => { keyboardToy.style.transform = ''; });

document.querySelectorAll('.led-strip').forEach(strip => {
  strip.querySelectorAll('.led-pixel').forEach((pixel, index) => {
    pixel.style.setProperty('--pixel-delay', `${index * 90}ms`);
  });
  strip.addEventListener('pointerenter', () => wave(strip));
});

document.querySelectorAll('kbd').forEach(key => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shortcut-toy';
  button.setAttribute('aria-label', `Animate ${key.title || key.textContent} key`);
  key.replaceWith(button);
  button.append(key);
  button.addEventListener('click', () => {
    sparkle(button);
    if (reducedMotion.matches) return;
    key.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(3px)', boxShadow: '0 0 0 transparent' },
      { transform: 'translateY(-2px)' },
      { transform: 'translateY(0)' }
    ], { duration: 280, easing: 'ease-out' });
  });
});
