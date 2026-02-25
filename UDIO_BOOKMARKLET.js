// ∞8 ARCH - Udio Integration Bookmarklet
// Drag this to your bookmarks bar, then click it while on udio.com
//
// Extracts from Udio track pages:
//   - Track title
//   - Prompt/description
//   - Tags (genre, mood, style)
//   - Lyrics
//   - Model version (v1, v1.5, v1.5 Allegro)
//   - Creator/artist name
//   - Audio file URL (if accessible)
//   - Duration (if accessible)
//
// Then redirects to inf8.vercel.app/new with URL params to pre-fill
// the declaration form.

javascript:(function(){
  // Check if we're on Udio
  if (!window.location.hostname.includes('udio')) {
    alert('Please run this bookmarklet while on udio.com');
    return;
  }

  let title = '';
  let prompt = '';
  let lyrics = '';
  let tags = '';
  let artist = '';
  let model = '';
  let duration = '';
  let audioUrl = '';

  // --- TITLE EXTRACTION ---
  // Udio is a Next.js app. Try multiple strategies to find the track title.
  // Strategy 1: Look for h1 elements (common for track title)
  const h1Els = document.querySelectorAll('h1');
  for (const el of h1Els) {
    const text = el.textContent.trim();
    if (text && text.length > 0 && text.length < 120
        && !text.toLowerCase().includes('udio')
        && !text.toLowerCase().includes('create')
        && !text.toLowerCase().includes('sign in')
        && !text.toLowerCase().includes('log in')) {
      title = text;
      break;
    }
  }

  // Strategy 2: Look for title-like elements by class
  if (!title) {
    const titleSelectors = [
      '[class*="songTitle"]',
      '[class*="SongTitle"]',
      '[class*="song-title"]',
      '[class*="trackTitle"]',
      '[class*="TrackTitle"]',
      '[class*="track-title"]',
      '[data-testid="song-title"]',
      '[data-testid="track-title"]',
      'h2'
    ];
    for (const selector of titleSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim() && el.textContent.trim().length < 120) {
        title = el.textContent.trim();
        break;
      }
    }
  }

  // Strategy 3: Use the page's document.title and strip " | Udio" suffix
  if (!title) {
    const docTitle = document.title;
    if (docTitle && !docTitle.toLowerCase().startsWith('udio')) {
      title = docTitle.replace(/\s*[\|–—-]\s*Udio.*$/i, '').trim();
    }
  }

  // --- PROMPT EXTRACTION ---
  // Udio shows the generation prompt in song details.
  // Look for elements containing "Prompt" labels, then grab adjacent content.
  const allElements = document.querySelectorAll('*');
  for (const el of allElements) {
    const text = el.textContent.trim();
    // Look for small label elements that say "Prompt"
    if (el.children.length === 0 && text === 'Prompt') {
      // The prompt text is likely in a sibling or parent's next child
      const parent = el.parentElement;
      if (parent) {
        const siblings = parent.querySelectorAll('*');
        for (const sib of siblings) {
          const sibText = sib.textContent.trim();
          if (sibText && sibText !== 'Prompt' && sibText.length > 5 && sibText.length < 1000) {
            prompt = sibText;
            break;
          }
        }
        // Also try next sibling element
        if (!prompt && parent.nextElementSibling) {
          const nextText = parent.nextElementSibling.textContent.trim();
          if (nextText && nextText.length > 5) {
            prompt = nextText;
          }
        }
      }
      if (prompt) break;
    }
  }

  // Fallback: Look for textareas or elements with prompt-related classes
  if (!prompt) {
    const promptSelectors = [
      '[class*="prompt"]',
      '[class*="Prompt"]',
      '[class*="description"]',
      '[data-testid="prompt"]',
      'textarea'
    ];
    for (const selector of promptSelectors) {
      const els = document.querySelectorAll(selector);
      for (const el of els) {
        const text = (el.value || el.textContent || '').trim();
        if (text && text.length > 5 && text.length < 1000
            && text !== 'Prompt' && !text.includes('Sign')) {
          prompt = text;
          break;
        }
      }
      if (prompt) break;
    }
  }

  // --- TAGS EXTRACTION ---
  // Udio shows tags as clickable elements (often links to /tags/[tagname])
  const tagLinks = document.querySelectorAll('a[href*="/tags/"]');
  const tagSet = new Set();
  for (const link of tagLinks) {
    const tagText = link.textContent.trim();
    if (tagText && tagText.length < 50) {
      tagSet.add(tagText);
    }
  }

  // Also look for elements with tag-related classes
  if (tagSet.size === 0) {
    const tagSelectors = [
      '[class*="tag"]',
      '[class*="Tag"]',
      '[class*="genre"]',
      '[class*="Genre"]',
      '[class*="chip"]',
      '[class*="Chip"]',
      '[class*="badge"]'
    ];
    for (const selector of tagSelectors) {
      const els = document.querySelectorAll(selector);
      for (const el of els) {
        const text = el.textContent.trim();
        if (text && text.length < 50 && text.length > 1
            && !text.includes('Sign') && !text.includes('Log')) {
          tagSet.add(text);
        }
      }
    }
  }
  tags = Array.from(tagSet).join(', ');

  // --- LYRICS EXTRACTION ---
  // Udio shows lyrics in the song details section
  for (const el of allElements) {
    const text = el.textContent.trim();
    if (el.children.length === 0 && text === 'Lyrics') {
      const parent = el.parentElement;
      if (parent) {
        const siblings = parent.querySelectorAll('*');
        for (const sib of siblings) {
          const sibText = sib.textContent.trim();
          if (sibText && sibText !== 'Lyrics' && sibText.length > 20) {
            lyrics = sibText;
            break;
          }
        }
        if (!lyrics && parent.nextElementSibling) {
          const nextText = parent.nextElementSibling.textContent.trim();
          if (nextText && nextText.length > 20) {
            lyrics = nextText;
          }
        }
      }
      if (lyrics) break;
    }
  }

  // Fallback: look for lyrics-related classes
  if (!lyrics) {
    const lyricsSelectors = [
      '[class*="lyrics"]',
      '[class*="Lyrics"]',
      '[class*="lyric"]'
    ];
    for (const selector of lyricsSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.textContent.trim();
        if (text && text.length > 20) {
          lyrics = text;
          break;
        }
      }
    }
  }

  // --- ARTIST/CREATOR EXTRACTION ---
  // Udio shows creator names, often as links to /creators/[name]
  const creatorLinks = document.querySelectorAll('a[href*="/creators/"]');
  for (const link of creatorLinks) {
    const text = link.textContent.trim();
    if (text && text.length < 50 && text.length > 0) {
      artist = text.replace('@', '').trim();
      break;
    }
  }

  // Fallback: look for @username patterns
  if (!artist) {
    const spans = document.querySelectorAll('span, a, div, p');
    for (const el of spans) {
      const text = el.textContent.trim();
      if (text.startsWith('@') && text.length < 30 && text.length > 1) {
        artist = text.replace('@', '').trim();
        break;
      }
    }
  }

  // --- MODEL VERSION EXTRACTION ---
  // Udio model versions: v1, v1.5, v1.5 Allegro
  const pageText = document.body.textContent || '';
  const pageHTML = document.body.innerHTML || '';

  // Look for explicit version mentions
  const versionPatterns = [
    /v1\.5\s*Allegro/i,
    /v1\.5/i,
    /v1\.0/i,
    /v1/i,
    /version\s*1\.5/i,
    /version\s*1/i,
    /model[:\s]*v?[0-9.]+/i
  ];

  for (const pattern of versionPatterns) {
    const match = pageText.match(pattern) || pageHTML.match(pattern);
    if (match) {
      let versionStr = match[0].trim();
      // Normalize
      if (versionStr.toLowerCase().includes('allegro')) {
        model = 'Udio v1.5 Allegro';
      } else if (versionStr.includes('1.5')) {
        model = 'Udio v1.5';
      } else if (versionStr.includes('1.0') || versionStr === 'v1') {
        model = 'Udio v1';
      } else {
        model = 'Udio ' + versionStr;
      }
      break;
    }
  }

  // Default model if not detected
  if (!model) {
    model = 'Udio v1.5';
  }

  // --- AUDIO URL EXTRACTION ---
  // Try to find audio elements on the page
  const audioEls = document.querySelectorAll('audio, audio source');
  for (const el of audioEls) {
    const src = el.src || el.getAttribute('src');
    if (src && src.startsWith('http')) {
      audioUrl = src;
      break;
    }
  }

  // Also check for audio sources in source elements within audio tags
  if (!audioUrl) {
    const sourceEls = document.querySelectorAll('audio source');
    for (const el of sourceEls) {
      const src = el.getAttribute('src');
      if (src) {
        audioUrl = src;
        break;
      }
    }
  }

  // --- DURATION EXTRACTION ---
  // Look for duration display elements (common formats: "3:42", "03:42")
  const durationPattern = /\b(\d{1,2}:\d{2})\b/;
  const timeElements = document.querySelectorAll('[class*="time"], [class*="Time"], [class*="duration"], [class*="Duration"], [class*="length"]');
  for (const el of timeElements) {
    const match = el.textContent.match(durationPattern);
    if (match) {
      duration = match[1];
      break;
    }
  }

  // --- FALLBACKS ---
  if (!title) {
    title = 'Untitled Track';
  }

  // If we found lyrics but no prompt, derive a description
  if (!prompt && lyrics) {
    const firstLine = lyrics.split('\n').find(function(l) { return l.trim().length > 0; });
    if (firstLine) {
      prompt = 'Song with lyrics: ' + firstLine.substring(0, 100) + '...';
    }
  }

  if (!prompt && tags) {
    prompt = 'AI-generated track. Tags: ' + tags;
  }

  if (!prompt) {
    prompt = 'Generated with Udio AI';
  }

  // Build methodology string
  var methodology = 'AI-generated track with Udio (' + model + ').';
  if (tags) {
    methodology += ' Tags: ' + tags + '.';
  }
  if (duration) {
    methodology += ' Duration: ' + duration + '.';
  }
  methodology += ' Review and describe your actual creative process.';

  // --- BUILD URL ---
  var baseUrl = window.location.hostname.includes('localhost')
    ? 'http://localhost:3000/new'
    : 'https://inf8.vercel.app/new';

  var params = new URLSearchParams({
    title: title,
    aiPrompt: prompt,
    methodology: methodology,
    model: model,
    artist: artist || 'Your Name',
    aiModels: model,
    daws: 'N/A',
    plugins: 'N/A',
    hardware: 'N/A',
    aiComp: '100',
    aiArr: '100',
    aiProd: '100',
    aiMix: '100',
    aiMaster: '100'
  });

  var url = baseUrl + '?' + params.toString();

  // Open in new tab
  window.open(url, '_blank');

  // Show confirmation with extracted data summary
  var summary = 'Opening declaration form with Udio data:\n\n';
  summary += 'Title: ' + title + '\n';
  summary += 'Model: ' + model + '\n';
  if (artist) summary += 'Artist: ' + artist + '\n';
  if (tags) summary += 'Tags: ' + tags + '\n';
  if (duration) summary += 'Duration: ' + duration + '\n';
  if (audioUrl) summary += 'Audio URL found\n';
  alert(summary);
})();
