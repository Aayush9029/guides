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
