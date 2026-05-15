// ── SignalForge Theme System ──
// Curated presets: each is a tested combination of color + font + background.
// The dice picks complete presets, not random parts.

const PRESETS = [
  // ── Dark ──
  { name: 'midnight',     accent: [0,201,167],   bg: [0,0,0],       light: false, bgImage: null,               font: 0 },
  { name: 'ember',        accent: [251,146,60],  bg: [12,8,4],      light: false, bgImage: null,               font: 1 },
  { name: 'violet',       accent: [168,130,255], bg: [8,6,16],      light: false, bgImage: null,               font: 2 },
  { name: 'forest',       accent: [52,211,153],  bg: [4,10,8],      light: false, bgImage: null,               font: 3 },
  { name: 'blood',        accent: [239,68,68],   bg: [14,4,4],      light: false, bgImage: null,               font: 4 },
  { name: 'arctic',       accent: [130,200,255], bg: [4,6,14],      light: false, bgImage: null,               font: 5 },
  { name: 'rose',         accent: [236,130,200], bg: [14,6,12],     light: false, bgImage: null,               font: 6 },
  { name: 'gold',         accent: [218,175,80],  bg: [10,8,2],      light: false, bgImage: null,               font: 7 },
  { name: 'terminal',     accent: [0,201,167],   bg: [0,0,0],       light: false, bgImage: null,               font: 8 },
  { name: 'slate',        accent: [0,201,167],   bg: [30,32,38],    light: false, bgImage: null,               font: 9 },
  { name: 'navy',         accent: [130,200,255], bg: [18,22,36],    light: false, bgImage: null,               font: 10 },
  { name: 'charcoal',     accent: [251,146,60],  bg: [38,36,34],    light: false, bgImage: null,               font: 11 },
  // ── Light ──
  { name: 'paper',        accent: [0,160,130],   bg: [250,250,248], light: true,  bgImage: null,               font: 0 },
  { name: 'cream',        accent: [180,100,40],  bg: [245,240,230], light: true,  bgImage: null,               font: 1 },
  { name: 'frost',        accent: [60,120,200],  bg: [240,244,250], light: true,  bgImage: null,               font: 2 },
  { name: 'bone',         accent: [140,90,200],  bg: [248,245,250], light: true,  bgImage: null,               font: 5 },
  { name: 'blush',        accent: [200,70,70],   bg: [252,250,248], light: true,  bgImage: null,               font: 6 },
  // ── With backgrounds ──
  { name: 'texture-1',     accent: [0,201,167],   bg: [0,0,0],       light: false, bgImage: 'images/backgrounds/bg-img-1.png',    font: 0 },
  { name: 'texture-2',     accent: [251,146,60],  bg: [12,8,4],      light: false, bgImage: 'images/backgrounds/bg-img-2.png',    font: 4 },
  { name: 'texture-1b',    accent: [168,130,255], bg: [8,6,16],      light: false, bgImage: 'images/backgrounds/bg-img-1.png',    font: 2 },
  { name: 'texture-2b',    accent: [130,200,255], bg: [4,6,14],      light: false, bgImage: 'images/backgrounds/bg-img-2.png',    font: 10 },
  // { name: 'night-canopy', accent: [52,211,153],  bg: [4,10,8],      light: false, bgImage: 'images/backgrounds/bg-forest.webp',   font: 3 },
  // { name: 'grain',        accent: [218,175,80],  bg: [10,8,2],      light: false, bgImage: 'images/backgrounds/bg-paper.webp',    font: 7 },
  // { name: 'volcanic',     accent: [239,68,68],   bg: [14,4,4],      light: false, bgImage: 'images/backgrounds/bg-sand.webp',     font: 12 },
  // { name: 'mist',         accent: [130,200,255], bg: [4,6,14],      light: false, bgImage: 'images/backgrounds/bg-fog.webp',      font: 5 },
  // { name: 'forge',        accent: [251,146,60],  bg: [12,8,4],      light: false, bgImage: 'images/backgrounds/bg-metal.webp',    font: 8 },
  // { name: 'cloth',        accent: [168,130,255], bg: [8,6,16],      light: false, bgImage: 'images/backgrounds/bg-fabric.webp',   font: 2 },
  // { name: 'light-paper',  accent: [0,160,130],   bg: [250,250,248], light: true,  bgImage: 'images/backgrounds/bg-paper.webp',    font: 0 },
  // { name: 'light-fog',    accent: [140,90,200],  bg: [248,245,250], light: true,  bgImage: 'images/backgrounds/bg-fog.webp',      font: 6 },
];

const FONT_PAIRS = [
  /* 0  */ { display: "'Cormorant Garamond', Georgia, serif",            body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  /* 1  */ { display: "'Playfair Display', Georgia, serif",              body: "'DM Sans', sans-serif" },
  /* 2  */ { display: "'Libre Baskerville', Georgia, serif",             body: "'Inter', sans-serif" },
  /* 3  */ { display: "'EB Garamond', Georgia, serif",                   body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  /* 4  */ { display: "'Crimson Text', Georgia, serif",                  body: "'Inter', sans-serif" },
  /* 5  */ { display: "'Lora', Georgia, serif",                          body: "'DM Sans', sans-serif" },
  /* 6  */ { display: "'Merriweather', Georgia, serif",                  body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  /* 7  */ { display: "'Spectral', Georgia, serif",                      body: "'Inter', sans-serif" },
  /* 8  */ { display: "'JetBrains Mono', monospace",                     body: "'JetBrains Mono', monospace" },
  /* 9  */ { display: "'Space Grotesk', sans-serif",                     body: "'Space Grotesk', sans-serif" },
  /* 10 */ { display: "'Sora', sans-serif",                              body: "'Inter', sans-serif" },
  /* 11 */ { display: "'Outfit', sans-serif",                            body: "'Outfit', sans-serif" },
  /* 12 */ { display: "'Fraunces', Georgia, serif",                      body: "'Outfit', sans-serif" },
  /* 13 */ { display: "'DM Serif Display', Georgia, serif",              body: "'DM Sans', sans-serif" },
  /* 14 */ { display: "'Bodoni Moda', Georgia, serif",                   body: "'Space Grotesk', sans-serif" },
  /* 15 */ { display: "'Young Serif', Georgia, serif",                   body: "'Manrope', sans-serif" },
  /* 16 */ { display: "'Unbounded', sans-serif",                         body: "'Inter', sans-serif" },
  /* 17 */ { display: "'Bricolage Grotesque', sans-serif",               body: "'DM Sans', sans-serif" },
  /* 18 */ { display: "'Instrument Serif', Georgia, serif",              body: "'Outfit', sans-serif" },
  /* 19 */ { display: "'IBM Plex Mono', monospace",                      body: "'IBM Plex Mono', monospace" },
  /* 20 */ { display: "'Caveat', cursive",                               body: "'Inter', sans-serif" },
  /* 21 */ { display: "'Plus Jakarta Sans', sans-serif",                 body: "'Plus Jakarta Sans', sans-serif" },
  /* 22 */ { display: "'Manrope', sans-serif",                           body: "'Manrope', sans-serif" },
  /* 23 */ { display: "'Urbanist', sans-serif",                          body: "'Urbanist', sans-serif" },
  /* 24 */ { display: "'Fira Code', monospace",                          body: "'Fira Code', monospace" },
  /* 25 */ { display: "'Space Mono', monospace",                         body: "'Space Mono', monospace" },
  /* 26 */ { display: "'Helvetica Neue', Helvetica, Arial, sans-serif",  body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  /* 27 */ { display: "'DM Sans', sans-serif",                           body: "'DM Sans', sans-serif" },
  /* 28 */ { display: "'Inter', sans-serif",                             body: "'Inter', sans-serif" },
];

let _presetIdx = 0;
let _usedPresets = [];

function applyPreset(idx) {
  const p = PRESETS[idx];
  const f = FONT_PAIRS[p.font];
  const [r, g, b] = p.accent;
  const [br, bg, bb] = p.bg;
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

  // Background image
  const bgFixed = document.querySelector('.bg-fixed');
  if (bgFixed) {
    if (p.bgImage) {
      const opacity = 0.97 + Math.random() * 0.02;
      bgFixed.style.backgroundImage = `linear-gradient(rgba(${br},${bg},${bb},${opacity.toFixed(3)}), rgba(${br},${bg},${bb},${opacity.toFixed(3)})), url('${p.bgImage}')`;
    } else {
      // 35% chance of showing default texture at 1-3%
      if (Math.random() < 0.35) {
        const opacity = 0.97 + Math.random() * 0.02;
        bgFixed.style.backgroundImage = `linear-gradient(rgba(${br},${bg},${bb},${opacity.toFixed(3)}), rgba(${br},${bg},${bb},${opacity.toFixed(3)})), url('ground_background.webp')`;
      } else {
        bgFixed.style.backgroundImage = 'none';
        bgFixed.style.backgroundColor = `rgb(${br},${bg},${bb})`;
      }
    }
  }

  // Text — flip for light/dark
  // Accent derived
  root.setProperty('--accent-border', `rgba(${r},${g},${b},0.5)`);
  root.setProperty('--accent-bg', `rgba(${r},${g},${b},0.08)`);

  if (p.light) {
    root.setProperty('--white', '#1a1a1a');
    root.setProperty('--text-hi', 'rgba(0,0,0,0.85)');
    root.setProperty('--text-mid', 'rgba(0,0,0,0.5)');
    root.setProperty('--dim', 'rgba(0,0,0,0.5)');
    root.setProperty('--text-low', 'rgba(0,0,0,0.3)');
    root.setProperty('--dimmer', 'rgba(0,0,0,0.18)');
    root.setProperty('--line', 'rgba(0,0,0,0.3)');
    root.setProperty('--border', 'rgba(0,0,0,0.08)');
    root.setProperty('--border-light', 'rgba(0,0,0,0.12)');
    root.setProperty('--surface', 'rgba(0,0,0,0.04)');
    root.setProperty('--bg-overlay', `rgba(${br},${bg},${bb},0.92)`);
    root.setProperty('--img-opacity', '0.85');
  } else {
    root.setProperty('--white', '#f0f0f0');
    root.setProperty('--text-hi', 'rgba(255,255,255,0.9)');
    root.setProperty('--text-mid', 'rgba(255,255,255,0.55)');
    root.setProperty('--dim', 'rgba(255,255,255,0.55)');
    root.setProperty('--text-low', 'rgba(255,255,255,0.3)');
    root.setProperty('--dimmer', 'rgba(255,255,255,0.2)');
    root.setProperty('--line', 'rgba(255,255,255,0.5)');
    root.setProperty('--border', 'rgba(255,255,255,0.08)');
    root.setProperty('--border-light', 'rgba(255,255,255,0.12)');
    root.setProperty('--surface', 'rgba(255,255,255,0.04)');
    root.setProperty('--img-opacity', '1');
  }

  // Load Google Fonts
  [f.display, f.body].forEach(fontStr => {
    const name = fontStr.split("'")[1];
    if (name && !document.querySelector(`link[href*="${name.replace(/ /g, '+')}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300;1,400&display=swap`;
      document.head.appendChild(link);
    }
  });
}

// Cycle through presets in order
function cycleTheme() {
  _presetIdx = (_presetIdx + 1) % PRESETS.length;
  applyPreset(_presetIdx);
}

// Random preset — avoids repeats until all used
function randomTheme() {
  if (_usedPresets.length >= PRESETS.length) _usedPresets = [];
  let idx;
  do {
    idx = Math.floor(Math.random() * PRESETS.length);
  } while (_usedPresets.includes(idx) && _usedPresets.length < PRESETS.length);
  _usedPresets.push(idx);
  _presetIdx = idx;
  applyPreset(idx);
}

// Apply default on load
applyPreset(0);
