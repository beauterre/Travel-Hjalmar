
(function() {
  // Create container div
  const container = document.createElement('div');
  container.id = 'lang-selector-widget';
  container.style.margin = '10px';

  // Create label
  const label = document.createElement('label');
  label.htmlFor = 'lang-select';
  label.textContent = 'Select Language: ';
  container.appendChild(label);

  // Create select element
  const select = document.createElement('select');
  select.id = 'lang-select';
  select.innerHTML = `
    <option value="nl">Dutch (Original)</option>
    <option value="en">English</option>
    <option value="bg">Bulgarian</option>
    <option value="zh">Chinese</option>
  `;
  container.appendChild(select);

  // Insert widget before the current script tag
  const thisScript = document.currentScript;
  thisScript.parentNode.insertBefore(container, thisScript);

  // Behavior for redirecting via Google Translate
  select.addEventListener('change', function() {
    const lang = this.value;
    if (lang === 'nl') return; // Dutch is original
    const url = encodeURIComponent(window.location.href);
    const translateURL = `https://translate.google.com/translate?sl=nl&tl=${lang}&u=${url}`;
    window.location.href = translateURL;
  });
})();

