const menu = document.querySelector('#command-menu');
const trigger = document.querySelector('#command-trigger');
const input = document.querySelector('#command-input');
const list = document.querySelector('#command-options');
const empty = document.querySelector('#command-empty');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('[data-jump]')];
const normalize = value => value.toLowerCase()
  .replace(/fn(?=\d)/g, 'fn ')
  .replace(/[↑↓←→,\[\]\\]/g, key => ({'↑':' up ','↓':' down ','←':' left ','→':' right ', ',':' comma ', '[':' left bracket ', ']':' right bracket ', '\\':' backslash '}[key]))
  .replace(/(^|[^0-9])\.(?![0-9])/g, '$1 period ')
  .replace(/[^\p{L}\p{N}.]+/gu, ' ').trim();
let selected = 0;

const entries = sections.flatMap(section => {
  const entry = { target: section, label: section.dataset.jump, icon: section.dataset.icon, keys: '', search: section.dataset.search || '' };
  return [entry, ...[...section.querySelectorAll('[data-shortcut]')].map(row => ({ target: row, label: row.querySelector('th').textContent, icon: entry.icon, keys: row.querySelector('td').textContent, search: `${entry.label} ${row.dataset.search || ''}`, shortcut: true }))];
});
const options = entries.map(entry => {
  const option = document.createElement('button');
  option.id = `jump-${entry.target.id}`;
  option.type = 'button';
  option.tabIndex = -1;
  option.setAttribute('role', 'option');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS(svg.namespaceURI, 'use');
  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  use.setAttribute('href', `assets/icons.svg#${entry.icon}`);
  svg.append(use);
  const label = document.createElement('span');
  label.textContent = entry.label;
  const keys = document.createElement('span');
  keys.className = 'result-keys';
  keys.textContent = entry.keys;
  option.append(svg, label, keys);
  option.addEventListener('click', () => {
    menu.close();
    history.replaceState(null, '', `#${entry.target.id}`);
    revealTarget();
  });
  list.append(option);
  return option;
});

function updateSelection() {
  const visible = options.filter(option => !option.hidden);
  selected = visible.length ? (selected + visible.length) % visible.length : 0;
  options.forEach(option => option.setAttribute('aria-selected', String(option === visible[selected])));
  empty.hidden = visible.length > 0;
  if (visible.length) {
    input.setAttribute('aria-activedescendant', visible[selected].id);
    visible[selected].scrollIntoView({ block: 'nearest' });
  } else input.removeAttribute('aria-activedescendant');
}

function filterOptions() {
  const words = normalize(input.value).split(/\s+/).filter(Boolean);
  options.forEach((option, index) => {
    const entry = entries[index];
    option.hidden = words.length ? !words.every(word => normalize(`${entry.label} ${entry.keys} ${entry.search}`).includes(word)) : !!entry.shortcut;
  });
  selected = 0;
  updateSelection();
}

function openMenu() {
  input.value = '';
  menu.showModal();
  trigger.setAttribute('aria-expanded', 'true');
  filterOptions();
  input.focus();
}

function revealTarget() {
  const target = entries.find(entry => `#${entry.target.id}` === location.hash)?.target;
  if (!target) return;
  const disclosure = target.closest('details');
  if (disclosure) disclosure.open = true;
  requestAnimationFrame(() => {
    const focus = disclosure?.querySelector('summary') || target;
    if (!focus.hasAttribute('tabindex') && !disclosure) focus.tabIndex = -1;
    focus.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    if (!reducedMotion.matches) target.animate([{ backgroundColor: '#ffffff12' }, { backgroundColor: 'transparent' }], { duration: 1100 });
  });
}

input.addEventListener('input', filterOptions);
input.addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    selected += event.key === 'ArrowDown' ? 1 : -1;
    updateSelection();
  }
  if (event.key === 'Enter') options.find(option => option.getAttribute('aria-selected') === 'true')?.click();
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.isComposing) {
    event.preventDefault();
    if (!event.repeat) menu.open ? menu.close() : openMenu();
  }
});
trigger.addEventListener('click', openMenu);
document.querySelector('#command-close').addEventListener('click', () => menu.close());
menu.addEventListener('close', () => trigger.setAttribute('aria-expanded', String(menu.open)));
menu.addEventListener('click', event => {
  const rect = menu.getBoundingClientRect();
  if (event.target === menu && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) menu.close();
});
window.addEventListener('hashchange', revealTarget);
trigger.hidden = false;
revealTarget();

function sparkle(element) {
  if (reducedMotion.matches) return;
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const spark = document.createElement('i');
    spark.className = 'spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.style.cssText = `left:${rect.x + rect.width/2}px;top:${rect.y + rect.height/2}px;--hue:${150+i*25}`;
    document.body.append(spark);
    const angle = i * Math.PI * 2 / 7;
    spark.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(angle)*55}px,${Math.sin(angle)*55}px)`, opacity: 0 }], { duration: 650, easing: 'ease-out' }).finished.finally(() => spark.remove());
  }
  element.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: 220 });
}

document.querySelectorAll('kbd').forEach(key => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'key-toy';
  button.setAttribute('aria-label', `Animate ${key.textContent} key`);
  key.replaceWith(button);
  button.append(key);
  button.addEventListener('click', () => sparkle(button));
});
document.querySelectorAll('.hero-key').forEach(key => key.addEventListener('click', () => sparkle(key)));
const keyboard = document.querySelector('.keyboard-toy');
keyboard.addEventListener('click', () => {
  sparkle(keyboard);
  if (!reducedMotion.matches) document.querySelectorAll('.led-strip').forEach(strip => strip.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(3)', boxShadow: '0 0 28px var(--light)' }, { filter: 'brightness(1)' }], { duration: 900 }));
});
keyboard.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const r = keyboard.getBoundingClientRect();
  keyboard.style.transform = `perspective(700px) rotateY(${((event.clientX-r.x)/r.width-.5)*12}deg) rotateX(${((event.clientY-r.y)/r.height-.5)*-12}deg)`;
});
keyboard.addEventListener('pointerleave', () => { keyboard.style.transform = ''; });
document.querySelectorAll('.light-control').forEach(control => {
  const choices = [...control.querySelectorAll('[data-color]')];
  choices.forEach(choice => choice.addEventListener('click', () => {
    control.style.setProperty('--light', choice.dataset.color);
    choices.forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
    sparkle(choice);
  }));
  control.querySelector('.led-strip').addEventListener('click', () => choices[(choices.findIndex(c => c.getAttribute('aria-pressed') === 'true') + 1) % choices.length].click());
});
