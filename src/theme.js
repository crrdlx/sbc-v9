(function () {
  var key = 'sbc-theme';
  var saved = localStorage.getItem(key);
  var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.getElementById('themeColorMeta');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#e4e4e7' : '#0a0a0c');
})();

function toggleTheme() {
  var html = document.documentElement;
  var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sbc-theme', next);
  var meta = document.getElementById('themeColorMeta');
  if (meta) meta.setAttribute('content', next === 'light' ? '#e4e4e7' : '#0a0a0c');
  if (typeof handleCoinChange === 'function') handleCoinChange();
}
