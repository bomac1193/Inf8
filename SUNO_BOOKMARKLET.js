// ∞8 ARCH - Suno Integration Bookmarklet
// Drag this to your bookmarks bar, then click it while on suno.com

javascript:(function(){
  // Check if we're on Suno
  if (!window.location.hostname.includes('suno')) {
    alert('⚠️ Please run this bookmarklet while on suno.com');
    return;
  }

  // Try to extract track information from Suno's UI
  // Note: Suno's DOM structure may change - this is best-effort extraction

  let title = '';
  let prompt = '';
  let model = 'Suno';

  // Try to find title (multiple selectors for robustness)
  const titleSelectors = [
    '[data-testid="song-title"]',
    '.song-title',
    'h1',
    '[class*="title"]'
  ];

  for (const selector of titleSelectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim()) {
      title = el.textContent.trim();
      break;
    }
  }

  // Try to find prompt
  const promptSelectors = [
    '[data-testid="prompt"]',
    '[class*="prompt"]',
    'textarea',
    '[placeholder*="describe"]'
  ];

  for (const selector of promptSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      prompt = el.value || el.textContent.trim();
      if (prompt) break;
    }
  }

  // Detect model version if possible
  const versionMatch = document.body.textContent.match(/v[0-9.]+/i);
  if (versionMatch) {
    model = 'Suno ' + versionMatch[0];
  }

  // Fallback: if no data found, use generic message
  if (!title && !prompt) {
    title = 'Untitled Track';
    prompt = 'Generated with Suno AI';
  }

  // Build URL with parameters
  const baseUrl = window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/new'
    : 'https://inf8.vercel.app/new';  // Update this to your actual Vercel URL

  const params = new URLSearchParams({
    title: title || 'Untitled Track',
    prompt: prompt || 'AI-generated track',
    model: model,
    artist: 'Your Name' // User will update this
  });

  const url = `${baseUrl}?${params.toString()}`;

  // Open in new tab
  window.open(url, '_blank');

  // Show confirmation
  alert('✅ Opening ∞8 ARCH declaration form with Suno data!');
})();
