// ── YouAreMe Theme System ──
// Colors + fonts managed from one place.

const FONT_PAIRS = [
  { display: "'Cormorant Garamond', Georgia, serif",      body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { display: "'Playfair Display', Georgia, serif",         body: "'DM Sans', sans-serif" },
  { display: "'Libre Baskerville', Georgia, serif",        body: "'Inter', sans-serif" },
  { display: "'EB Garamond', Georgia, serif",              body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { display: "'Helvetica Neue', Helvetica, Arial, sans-serif", body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { display: "'DM Sans', sans-serif",                      body: "'DM Sans', sans-serif" },
  { display: "'Cormorant Garamond', Georgia, serif",       body: "'DM Sans', sans-serif" },
  { display: "'Playfair Display', Georgia, serif",         body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
];

const THEMES = [
  // Dark
  { name: 'teal',       accent: [0,201,167],   bg: [0,0,0],       light: false },
  { name: 'orange',     accent: [251,146,60],  bg: [12,8,4],      light: false },
  { name: 'purple',     accent: [168,130,255], bg: [8,6,16],      light: false },
  { name: 'green',      accent: [52,211,153],  bg: [4,10,8],      light: false },
  { name: 'red',        accent: [239,68,68],   bg: [14,4,4],      light: false },
  { name: 'ice',        accent: [130,200,255], bg: [4,6,14],      light: false },
  { name: 'pink',       accent: [236,130,200], bg: [14,6,12],     light: false },
  { name: 'gold',       accent: [218,175,80],  bg: [10,8,2],      light: false },
  // Mid
  { name: 'slate',      accent: [0,201,167],   bg: [30,32,38],    light: false },
  { name: 'navy',       accent: [130,200,255], bg: [18,22,36],    light: false },
  { name: 'charcoal',   accent: [251,146,60],  bg: [38,36,34],    light: false },
  // Light
  { name: 'white',      accent: [0,160,130],   bg: [250,250,248], light: true },
  { name: 'cream',      accent: [180,100,40],  bg: [245,240,230], light: true },
  { name: 'frost',      accent: [60,120,200],  bg: [240,244,250], light: true },
  { name: 'bone',       accent: [140,90,200],  bg: [248,245,250], light: true },
  { name: 'paper',      accent: [200,70,70],   bg: [252,250,248], light: true },
];

let _themeIdx = 0;
let _fontIdx = 0;

function applyTheme(tIdx, fIdx) {
  const t = THEMES[tIdx];
  const f = FONT_PAIRS[fIdx];
  const [r, g, b] = t.accent;
  const [br, bg, bb] = t.bg;
  const root = document.documentElement.style;

  // Fonts
  root.setProperty('--font-display', f.display);
  root.setProperty('--font-body', f.body);

  // Accent
  root.setProperty('--accent', `rgb(${r},${g},${b})`);
  root.setProperty('--accent-50', `rgba(${r},${g},${b},0.5)`);
  root.setProperty('--accent-20', `rgba(${r},${g},${b},0.2)`);
  root.setProperty('--accent-08', `rgba(${r},${g},${b},0.08)`);

  // Background
  root.setProperty('--bg', `rgb(${br},${bg},${bb})`);
  root.setProperty('--bg-overlay', `rgba(${br},${bg},${bb},0.96)`);

  // Text — flip for light/dark
  if (t.light) {
    root.setProperty('--white', '#1a1a1a');
    root.setProperty('--text-hi', 'rgba(0,0,0,0.85)');
    root.setProperty('--text-mid', 'rgba(0,0,0,0.5)');
    root.setProperty('--dim', 'rgba(0,0,0,0.5)');
    root.setProperty('--text-low', 'rgba(0,0,0,0.3)');
    root.setProperty('--dimmer', 'rgba(0,0,0,0.18)');
    root.setProperty('--line', 'rgba(0,0,0,0.3)');
    root.setProperty('--bg-overlay', `rgba(${br},${bg},${bb},0.92)`);
  } else {
    root.setProperty('--white', '#f0f0f0');
    root.setProperty('--text-hi', 'rgba(255,255,255,0.9)');
    root.setProperty('--text-mid', 'rgba(255,255,255,0.55)');
    root.setProperty('--dim', 'rgba(255,255,255,0.55)');
    root.setProperty('--text-low', 'rgba(255,255,255,0.3)');
    root.setProperty('--dimmer', 'rgba(255,255,255,0.2)');
    root.setProperty('--line', 'rgba(255,255,255,0.5)');
  }

  // Load Google Font if needed
  const fontName = f.display.split("'")[1];
  if (fontName && !document.querySelector(`link[href*="${fontName.replace(/ /g, '+')}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;600&display=swap`;
    document.head.appendChild(link);
  }
  const bodyFontName = f.body.split("'")[1];
  if (bodyFontName && bodyFontName !== fontName && !document.querySelector(`link[href*="${bodyFontName.replace(/ /g, '+')}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${bodyFontName.replace(/ /g, '+')}:wght@200;300;400;500&display=swap`;
    document.head.appendChild(link);
  }
}

function cycleTheme() {
  // Randomize both color and font
  _themeIdx = (_themeIdx + 1) % THEMES.length;
  _fontIdx = (_fontIdx + 1) % FONT_PAIRS.length;
  applyTheme(_themeIdx, _fontIdx);
}

function randomTheme() {
  _themeIdx = Math.floor(Math.random() * THEMES.length);
  _fontIdx = Math.floor(Math.random() * FONT_PAIRS.length);
  applyTheme(_themeIdx, _fontIdx);
}

// Apply default on load
applyTheme(0, 0);
