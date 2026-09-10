try {
  var preferences = JSON.parse(localStorage.getItem('utilbyte:tools:v1') || '{}');
  document.documentElement.dataset.toolCompact = String(preferences.compact === true);
  document.documentElement.dataset.toolFocus = String(preferences.focus === true);
} catch (_) {}
