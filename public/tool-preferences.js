try {
  var preferences = JSON.parse(localStorage.getItem('utilbyte:tools:v1') || '{}');
  document.documentElement.dataset.toolCompact = "false";
  document.documentElement.dataset.toolFocus = String(preferences.focus === true);
} catch (_) {}
