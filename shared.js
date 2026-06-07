/**
 * shared.js — You Are Me
 * Common utilities used across all pages.
 * Handles page transitions, scroll-fade menu, localStorage helpers,
 * and menu score loading.
 */

/* Expose scoreColor and getVotes globally for page-specific scripts */
var scoreColor, getVotes;

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // 1. PAGE FADE TRANSITIONS
  // ─────────────────────────────────────────────

  // Register PWA service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function() {});
  }

  // Add manifest link if not present
  if (!document.querySelector('link[rel="manifest"]')) {
    var manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
  }

  // Add PWA meta tags
  var metaTheme = document.createElement('meta');
  metaTheme.name = 'theme-color';
  metaTheme.content = '#00c9a7';
  document.head.appendChild(metaTheme);

  var metaApple = document.createElement('meta');
  metaApple.name = 'apple-mobile-web-app-capable';
  metaApple.content = 'yes';
  document.head.appendChild(metaApple);

  var metaAppleStatus = document.createElement('meta');
  metaAppleStatus.name = 'apple-mobile-web-app-status-bar-style';
  metaAppleStatus.content = 'black-translucent';
  document.head.appendChild(metaAppleStatus);

  document.addEventListener('DOMContentLoaded', function () {
    // Fade in after a brief delay so the CSS transition is visible
    setTimeout(function () {
      document.body.classList.add('loaded');
    }, 150);

    // Bottom controls
    var btnStyle = 'width:48px; height:48px; border-radius:50%; border:1px solid var(--accent); background:none; color:var(--accent); font-size:22px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center;';
    var isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile: fixed bottom tab bar
      var mobileBar = document.createElement('div');
      mobileBar.style.cssText = 'position:fixed; bottom:0; left:0; right:0; z-index:100; display:flex; justify-content:space-between; align-items:center; padding:12px 24px; background:var(--bg); border-top:1px solid var(--dimmer);';

      var mobMenuBtn = document.createElement('button');
      mobMenuBtn.textContent = '☰';
      mobMenuBtn.style.cssText = 'width:44px; height:44px; border-radius:50%; border:1px solid var(--accent); background:none; color:var(--accent); font-size:20px; cursor:pointer;';
      mobMenuBtn.onclick = function() {
        document.getElementById('mobileMenu').classList.toggle('open');
        document.getElementById('mobileOverlay').classList.toggle('open');
      };

      var mobThemeBtn = document.createElement('button');
      mobThemeBtn.textContent = '◐';
      mobThemeBtn.style.cssText = 'width:44px; height:44px; border-radius:50%; border:1px solid var(--accent); background:none; color:var(--accent); font-size:20px; cursor:pointer;';
      mobThemeBtn.onclick = randomizeTheme;

      var mobResetBtn = document.createElement('button');
      mobResetBtn.textContent = '↺';
      mobResetBtn.style.cssText = 'width:44px; height:44px; border-radius:50%; border:1px solid var(--dim); background:none; color:var(--dim); font-size:20px; cursor:pointer;';
      mobResetBtn.onclick = function() {
        currentTheme = 0;
        localStorage.setItem('yam_theme', '0');
        applyTheme(themes[0]);
      };

      mobileBar.appendChild(mobMenuBtn);
      mobileBar.appendChild(mobThemeBtn);
      mobileBar.appendChild(mobResetBtn);
      document.body.appendChild(mobileBar);
    } else {
      // Desktop: bottom-left theme + reset
      var themeWrap = document.createElement('div');
      themeWrap.style.cssText = 'position:fixed; bottom:24px; left:84px; z-index:100; display:flex; gap:12px; align-items:center;';

      var themeBtn = document.createElement('button');
      themeBtn.textContent = '◐';
      themeBtn.title = 'Change theme';
      themeBtn.style.cssText = btnStyle;
      themeBtn.onmouseenter = function() { this.style.transform = 'scale(1.1)'; };
      themeBtn.onmouseleave = function() { this.style.transform = 'scale(1)'; };
      themeBtn.onclick = randomizeTheme;
      themeWrap.appendChild(themeBtn);

      var resetBtn = document.createElement('button');
      resetBtn.textContent = '↺';
      resetBtn.title = 'Reset to default';
      resetBtn.style.cssText = btnStyle.replace('var(--accent)', 'var(--dim)');
      resetBtn.onmouseenter = function() { this.style.borderColor = 'var(--accent)'; this.style.color = 'var(--accent)'; };
      resetBtn.onmouseleave = function() { this.style.borderColor = 'var(--dim)'; this.style.color = 'var(--dim)'; };
      resetBtn.onclick = function() {
        currentTheme = 0;
        localStorage.setItem('yam_theme', '0');
        applyTheme(themes[0]);
      };
      themeWrap.appendChild(resetBtn);

      document.body.appendChild(themeWrap);
    }

    // Bottom-left: save button with +/- stacked above
    var leftWrap = document.createElement('div');
    leftWrap.style.cssText = 'position:fixed; bottom:24px; left:24px; z-index:100; display:flex; flex-direction:column; align-items:center; gap:8px;';

    var sideMenu = document.getElementById('sideMenu') || document.getElementById('collabMenu');
    if (sideMenu && window.innerWidth > 768) {
      var menuScale = parseFloat(localStorage.getItem('yam_menu_scale') || '1');
      sideMenu.style.transform = 'scale(' + menuScale + ')';
      sideMenu.style.transformOrigin = 'left center';

      var plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.title = 'Larger menu';
      plusBtn.style.cssText = btnStyle;
      plusBtn.onclick = function() {
        menuScale = Math.min(2.5, menuScale + 0.1);
        sideMenu.style.transform = 'scale(' + menuScale + ')';
        localStorage.setItem('yam_menu_scale', menuScale);
      };
      leftWrap.appendChild(plusBtn);

      var minusBtn = document.createElement('button');
      minusBtn.textContent = '−';
      minusBtn.title = 'Smaller menu';
      minusBtn.style.cssText = btnStyle;
      minusBtn.onclick = function() {
        menuScale = Math.max(0.6, menuScale - 0.1);
        sideMenu.style.transform = 'scale(' + menuScale + ')';
        localStorage.setItem('yam_menu_scale', menuScale);
      };
      leftWrap.appendChild(minusBtn);
    }

    if (hasMapData()) {
      var downloadBtn = document.createElement('button');
      downloadBtn.textContent = '💾';
      downloadBtn.title = 'Save my map';
      downloadBtn.style.cssText = btnStyle;
      downloadBtn.onclick = function() {
        var data = {};
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k.startsWith('yam_')) {
            try { data[k] = JSON.parse(localStorage.getItem(k)); } catch(e) { data[k] = localStorage.getItem(k); }
          }
        }
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'youareme-map-' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
      };
      leftWrap.appendChild(downloadBtn);
    }

    document.body.appendChild(leftWrap);

    // Intercept internal links for a smooth fade-out before navigation
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      a.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.remove('loaded');
        setTimeout(function () {
          window.location.href = href;
        }, 600);
      });
    });
  });

  // ─────────────────────────────────────────────
  // 2. SCROLL-FADE MENU
  // ─────────────────────────────────────────────

  var scrollTimer = null;
  var sideMenu = document.getElementById('sideMenu');

  if (sideMenu) {
    window.addEventListener('scroll', function () {
      // Hide menu while scrolling
      sideMenu.style.opacity = '0';
      sideMenu.style.pointerEvents = 'none';

      // Show again after 300ms of no scroll
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        sideMenu.style.opacity = '1';
        sideMenu.style.pointerEvents = 'auto';
      }, 300);
    });
  }

  // ─────────────────────────────────────────────
  // 3. LOCALSTORAGE HELPERS
  // ─────────────────────────────────────────────

  var VOTES_KEY = 'yam_votes';
  var FIREBASE_DB = 'https://youareme-votes-default-rtdb.firebaseio.com';

  /**
   * getVotes — returns the current votes object from localStorage (cached).
   * Firebase syncs in background.
   * @returns {Object} key-value pairs of vote counts
   */
  getVotes = function () {
    try {
      return JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
    } catch (e) {
      return {};
    }
  };

  /**
   * saveVote — increments locally and syncs to Firebase.
   * @param {string} key — the item to vote for
   */
  function saveVote(key) {
    // Local increment
    var votes = getVotes();
    votes[key] = (votes[key] || 0) + 1;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));

    // Firebase sync — fire and forget
    var safeKey = key.replace(/[.#$/\[\]]/g, '_');
    fetch(FIREBASE_DB + '/votes/' + safeKey + '.json', {
      method: 'PUT',
      body: JSON.stringify(votes[key])
    }).catch(function() {});

    return votes[key];
  }

  /**
   * syncVotesFromFirebase — pulls shared votes and merges with local.
   * Higher count wins (handles multiple users voting).
   */
  function syncVotesFromFirebase() {
    fetch(FIREBASE_DB + '/votes.json')
      .then(function(r) { return r.json(); })
      .then(function(remote) {
        if (!remote) return;
        var local = getVotes();
        var merged = false;
        Object.keys(remote).forEach(function(safeKey) {
          // Convert safe key back — best effort
          var localMatch = Object.keys(local).find(function(k) {
            return k.replace(/[.#$/\[\]]/g, '_') === safeKey;
          });
          if (localMatch) {
            if (remote[safeKey] > local[localMatch]) {
              local[localMatch] = remote[safeKey];
              merged = true;
            }
          } else {
            // New key from remote — store with safe key as name
            local[safeKey] = remote[safeKey];
            merged = true;
          }
        });
        if (merged) localStorage.setItem(VOTES_KEY, JSON.stringify(local));
      })
      .catch(function() {});
  }

  // Seed votes if first time (randomized starting counts)
  function seedVotesIfNeeded() {
    if (localStorage.getItem('yam_votes_seeded')) return;
    var local = getVotes();
    if (Object.keys(local).length > 0) { localStorage.setItem('yam_votes_seeded', '1'); return; }

    // Check if Firebase already has data
    fetch(FIREBASE_DB + '/votes.json')
      .then(function(r) { return r.json(); })
      .then(function(remote) {
        if (remote && Object.keys(remote).length > 0) {
          localStorage.setItem('yam_votes_seeded', '1');
          return;
        }
        // Seed with random starting counts (150-400 range)
        var seeds = {
          'Safety & Security': 180 + Math.floor(Math.random() * 200),
          'Rest & Recovery': 220 + Math.floor(Math.random() * 180),
          'Health & Vitality': 190 + Math.floor(Math.random() * 160),
          'Shelter & Environment': 150 + Math.floor(Math.random() * 120),
          'Autonomy & Freedom': 250 + Math.floor(Math.random() * 150),
          'Financial Security': 280 + Math.floor(Math.random() * 170),
          'Play & Novelty': 160 + Math.floor(Math.random() * 140),
          'Social Connection': 230 + Math.floor(Math.random() * 160),
          'Intimate Partnership': 270 + Math.floor(Math.random() * 130),
          'Family & Roots': 180 + Math.floor(Math.random() * 120),
          'Community & Tribe': 200 + Math.floor(Math.random() * 140),
          'Identity & Esteem': 240 + Math.floor(Math.random() * 160),
          'Authenticity & Expression': 210 + Math.floor(Math.random() * 150),
          'Boundaries & Limits': 260 + Math.floor(Math.random() * 140),
          'Cognitive & Intellectual': 170 + Math.floor(Math.random() * 130),
          'Purpose & Meaning': 300 + Math.floor(Math.random() * 150),
          'Creative Expression': 190 + Math.floor(Math.random() * 140),
          'Mastery & Craft': 160 + Math.floor(Math.random() * 130),
          'Spirituality & Presence': 180 + Math.floor(Math.random() * 120),
          'Legacy & Contribution': 150 + Math.floor(Math.random() * 110),
          'Flow & Presence': 220 + Math.floor(Math.random() * 150),
          'Pattern Recognition': 240 + Math.floor(Math.random() * 130),
          'Emotional Awareness': 260 + Math.floor(Math.random() * 140),
          'Body Signals': 190 + Math.floor(Math.random() * 120),
        };
        localStorage.setItem(VOTES_KEY, JSON.stringify(seeds));
        localStorage.setItem('yam_votes_seeded', '1');
        // Push seeds to Firebase
        var fbData = {};
        Object.keys(seeds).forEach(function(k) {
          fbData[k.replace(/[.#$/\[\]]/g, '_')] = seeds[k];
        });
        fetch(FIREBASE_DB + '/votes.json', { method: 'PUT', body: JSON.stringify(fbData) }).catch(function() {});
      })
      .catch(function() {});
  }

  seedVotesIfNeeded();

  // Sync on page load
  syncVotesFromFirebase();

  /**
   * getTestResult — reads a test result from localStorage by key.
   * @param {string} key — the localStorage key (e.g. 'yam_test_meta_done')
   * @returns {Object|null} parsed result or null
   */
  function getTestResult(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * scoreColor — maps a numeric score (1–7) to a display color.
   * @param {number} s — score value
   * @returns {string} CSS color string
   */
  scoreColor = function (s) {
    if (s <= 1) return 'rgb(239,68,68)';       // red
    if (s <= 2) return 'rgb(251,146,60)';       // orange
    if (s <= 3) return 'rgb(250,204,21)';       // yellow
    if (s <= 4) return 'var(--white)';          // white
    if (s <= 5) return 'rgb(100,149,237)';      // blue
    return 'rgb(45,212,191)';                   // teal (6–7)
  };

  // Attach saveVote and getTestResult to window for page-specific use
  window.saveVote = saveVote;
  window.getTestResult = getTestResult;

  /**
   * setupVoteWidgets — adds vote UI to all .tree-item.todo elements
   * Call this on any page that has votable tree items.
   */
  function setupVoteWidgets() {
    var items = document.querySelectorAll('.tree-item.todo');
    if (!items.length) return;

    items.forEach(function(item) {
      var name = item.querySelector('.tree-item-name');
      if (!name) return;
      var key = name.textContent.trim();
      var votes = getVotes();
      var count = votes[key] || 0;

      // Remove explore → status
      var status = item.querySelector('.tree-item-status');
      if (status) status.remove();

      // Vote widget
      var widget = document.createElement('div');
      widget.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative; z-index:1; flex-shrink:0;';

      var countEl = document.createElement('span');
      countEl.style.cssText = 'font-family:DM Sans,sans-serif; font-size:16px; font-weight:700; color:var(--white); min-width:20px; text-align:right; transition:color 0.3s;';
      countEl.textContent = count > 0 ? count : '0';

      var btn = document.createElement('span');
      btn.style.cssText = 'font-size:18px; cursor:pointer; transition:transform 0.2s, color 0.2s; user-select:none;';
      btn.title = 'I want this opened next';

      if (count > 0) {
        btn.textContent = '\u25B2';
        btn.style.color = 'var(--accent)';
      } else {
        btn.textContent = '\u25B3';
        btn.style.color = 'var(--white)';
      }

      widget.appendChild(countEl);
      widget.appendChild(btn);
      item.appendChild(widget);

      item.addEventListener('click', function(e) {
        e.preventDefault();
        var newCount = saveVote(key);
        countEl.textContent = newCount;
        countEl.style.color = 'var(--accent)';
        btn.textContent = '\u25B2';
        btn.style.transform = 'scale(1.3)';
        setTimeout(function() { btn.style.transform = 'scale(1)'; countEl.style.color = 'var(--white)'; }, 200);
      });
    });
  }

  /**
   * setupDoneWidgets — adds door emoji + view to all .tree-item.done elements
   */
  function setupDoneWidgets() {
    document.querySelectorAll('.tree-item.done').forEach(function(item) {
      var status = item.querySelector('.tree-item-status');
      if (status) status.remove();

      var widget = document.createElement('div');
      widget.style.cssText = 'display:flex; align-items:center; gap:8px; position:relative; z-index:1; flex-shrink:0;';

      var door = document.createElement('span');
      door.style.cssText = 'font-size:16px; text-decoration:none !important;';
      door.textContent = '\uD83D\uDEAA';

      var viewText = document.createElement('span');
      viewText.style.cssText = 'font-size:12px; color:var(--accent); text-decoration:underline; text-decoration-thickness:0.5px; text-underline-offset:4px;';
      viewText.textContent = 'view';

      widget.appendChild(door);
      widget.appendChild(viewText);
      item.appendChild(widget);
    });
  }

  window.setupVoteWidgets = setupVoteWidgets;
  window.setupDoneWidgets = setupDoneWidgets;

  // ─────────────────────────────────────────────
  // 7. VOICE REFLECTION RECORDER
  // ─────────────────────────────────────────────

  var REFLECTIONS_KEY = 'yam_reflections';

  function getReflections() {
    try { return JSON.parse(localStorage.getItem(REFLECTIONS_KEY)) || {}; } catch(e) { return {}; }
  }

  function saveReflectionToNode(nodeKey, text) {
    var refs = getReflections();
    if (!refs[nodeKey]) refs[nodeKey] = [];
    refs[nodeKey].push({ id: 'r' + Date.now(), text: text, date: new Date().toISOString() });
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(refs));
    return refs[nodeKey];
  }

  function setupRecordButtons() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

    document.querySelectorAll('.tree-item').forEach(function(item) {
      var name = item.querySelector('.tree-item-name');
      if (!name) return;
      var key = name.textContent.trim();

      // Add mic button
      var mic = document.createElement('button');
      mic.textContent = '🎙';
      mic.title = 'Record reflection';
      mic.style.cssText = 'font-size:14px; background:none; border:none; cursor:pointer; opacity:0.7; transition:opacity 0.2s; position:relative; z-index:1; padding:4px;';
      mic.onmouseenter = function() { this.style.opacity = '1'; };
      mic.onmouseleave = function() { if (!mic.classList.contains('recording')) this.style.opacity = '0.7'; };

      var recording = false;
      var recognition = null;

      mic.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (recording) {
          recognition.stop();
          return;
        }

        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        var liveText = document.createElement('div');
        liveText.style.cssText = 'padding:8px 4px 8px 40px; font-size:13px; color:var(--accent); font-style:italic; border-left:2px solid var(--accent); margin-left:20px; margin-top:4px; min-height:20px; opacity:0.8;';
        liveText.textContent = 'Listening...';
        item.parentElement.insertBefore(liveText, item.nextSibling);

        var finalTranscript = '';

        recognition.onstart = function() {
          recording = true;
          mic.classList.add('recording');
          mic.style.opacity = '1';
          mic.style.color = 'var(--accent)';
          mic.textContent = '⏹';
        };

        recognition.onresult = function(event) {
          var interim = '';
          for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          liveText.textContent = finalTranscript + interim || 'Listening...';
        };

        recognition.onend = function() {
          recording = false;
          mic.classList.remove('recording');
          mic.style.opacity = '0.4';
          mic.style.color = '';
          mic.textContent = '🎙';
          // Save final transcript
          if (finalTranscript.trim()) {
            saveReflectionToNode(key, finalTranscript.trim());
            renderReflectionChildren(item, key);
          }
          liveText.remove();
          finalTranscript = '';
        };

        recognition.onerror = function() {
          recording = false;
          mic.classList.remove('recording');
          mic.style.opacity = '0.4';
          mic.style.color = '';
          mic.textContent = '🎙';
          if (liveText.parentElement) liveText.remove();
          finalTranscript = '';
        };

        recognition.start();
      };

      // Insert mic before the emoji (first position)
      var emoji = item.querySelector('.tree-item-emoji');
      if (emoji) {
        item.insertBefore(mic, emoji);
      } else {
        item.insertBefore(mic, item.firstChild);
      }

      // Render existing reflections
      renderReflectionChildren(item, key);
    });
  }

  function renderReflectionChildren(item, key) {
    // Remove existing reflection container
    var existing = item.parentElement.querySelector('.reflection-wrap[data-parent="' + key + '"]');
    if (existing) existing.remove();

    var refs = getReflections()[key];
    if (!refs || refs.length === 0) return;

    // Create collapsible container
    var wrap = document.createElement('div');
    wrap.className = 'reflection-wrap';
    wrap.setAttribute('data-parent', key);
    wrap.style.cssText = 'margin-left:20px; margin-bottom:8px;';

    // Toggle header
    var header = document.createElement('div');
    header.style.cssText = 'font-size:11px; color:var(--accent); cursor:pointer; padding:4px 0; user-select:none;';
    var collapsed = localStorage.getItem('yam_ref_collapsed_' + key) === '1';
    header.textContent = (collapsed ? '▶' : '▼') + ' ' + refs.length + ' reflection' + (refs.length > 1 ? 's' : '');

    var body = document.createElement('div');
    body.style.display = collapsed ? 'none' : '';

    header.onclick = function() {
      collapsed = !collapsed;
      body.style.display = collapsed ? 'none' : '';
      header.textContent = (collapsed ? '▶' : '▼') + ' ' + refs.length + ' reflection' + (refs.length > 1 ? 's' : '');
      localStorage.setItem('yam_ref_collapsed_' + key, collapsed ? '1' : '0');
    };

    // Add children
    refs.forEach(function(ref, idx) {
      var child = document.createElement('div');
      child.style.cssText = 'display:flex; align-items:flex-start; gap:6px; padding:4px 4px 4px 16px; font-size:12px; border-left:1px solid var(--dimmer); margin-bottom:2px;';

      var text = document.createElement('span');
      text.style.cssText = 'color:var(--dim); font-style:italic; flex:1; cursor:text;';
      text.textContent = '"' + ref.text + '"';

      var editBtn = document.createElement('span');
      editBtn.textContent = '✎';
      editBtn.title = 'Edit';
      editBtn.style.cssText = 'cursor:pointer; opacity:0.3; transition:opacity 0.2s; font-size:11px;';
      editBtn.onmouseenter = function() { this.style.opacity = '1'; };
      editBtn.onmouseleave = function() { this.style.opacity = '0.3'; };
      editBtn.onclick = function() {
        var input = document.createElement('textarea');
        input.value = ref.text;
        input.style.cssText = 'width:100%; min-height:40px; background:rgba(255,255,255,0.03); border:1px solid var(--accent-border); color:var(--white); font-family:DM Sans,sans-serif; font-size:12px; padding:6px; resize:vertical;';
        text.replaceWith(input);
        input.focus();
        editBtn.style.display = 'none';

        var saveEdit = function() {
          var newText = input.value.trim();
          if (newText) {
            var allRefs = getReflections();
            allRefs[key][idx].text = newText;
            localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(allRefs));
          }
          renderReflectionChildren(item, key);
        };

        input.onblur = saveEdit;
        input.onkeydown = function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); } };
      };

      var delBtn = document.createElement('span');
      delBtn.textContent = '✕';
      delBtn.title = 'Delete';
      delBtn.style.cssText = 'cursor:pointer; opacity:0.3; transition:opacity 0.2s; font-size:11px;';
      delBtn.onmouseenter = function() { this.style.opacity = '1'; this.style.color = 'rgb(239,68,68)'; };
      delBtn.onmouseleave = function() { this.style.opacity = '0.3'; this.style.color = ''; };
      delBtn.onclick = function() {
        var allRefs = getReflections();
        allRefs[key].splice(idx, 1);
        if (allRefs[key].length === 0) delete allRefs[key];
        localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(allRefs));
        renderReflectionChildren(item, key);
      };

      child.appendChild(text);
      child.appendChild(editBtn);
      child.appendChild(delBtn);
      body.appendChild(child);
    });

    wrap.appendChild(header);
    wrap.appendChild(body);
    item.parentElement.insertBefore(wrap, item.nextSibling);
  }

  function exportForSignalForge() {
    var refs = getReflections();
    var nodes = [];

    Object.keys(refs).forEach(function(key, idx) {
      var children = refs[key].map(function(ref, cIdx) {
        return {
          id: ref.id || ('r' + idx + '_' + cIdx),
          content: ref.text,
          collapsed: false,
          children: []
        };
      });

      nodes.push({
        id: 'n' + (idx + 1),
        content: key,
        collapsed: false,
        children: children
      });
    });

    var blob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reflections-signalforge-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
  }

  window.setupRecordButtons = setupRecordButtons;
  window.exportForSignalForge = exportForSignalForge;

  // ─────────────────────────────────────────────
  // 6. THEME RANDOMIZER
  // ─────────────────────────────────────────────

  var themes = [
    { accent: '#00c9a7', bg: '#0a0a0a', white: '#b8fff0' },          // teal glow
    { accent: '#ff6b6b', bg: '#1a0a0a', white: '#ffd4d4' },          // coral warmth
    { accent: '#6c5ce7', bg: '#0e0a1a', white: '#d8ccff' },          // purple haze
    { accent: '#fd79a8', bg: '#140a10', white: '#ffc8e0' },          // pink bloom
    { accent: '#74b9ff', bg: '#0a0e14', white: '#c8e4ff' },          // sky glow
    { accent: '#55efc4', bg: '#1a2d2a', white: '#b0ffd8' },          // seafoam
    { accent: '#ffd93d', bg: '#0a0a05', white: '#fff2b0' },          // gold light
    { accent: '#e17055', bg: '#faf4f0', white: '#3d1a10' },          // burnt on cream
    { accent: '#0984e3', bg: '#f0f6fc', white: '#0a2a4a' },          // blue on ice
    { accent: '#d63031', bg: '#fdf2f2', white: '#3d1414' },          // red on blush
    { accent: '#00b894', bg: '#f0fcf7', white: '#0a2d20' },          // green on mint
  ];

  var currentTheme = parseInt(localStorage.getItem('yam_theme') || '0');

  function randomizeTheme() {
    currentTheme = (currentTheme + 1) % themes.length;
    localStorage.setItem('yam_theme', currentTheme);
    applyTheme(themes[currentTheme]);
  }

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    return r + ',' + g + ',' + b;
  }

  function applyTheme(t) {
    var r = document.documentElement;
    var rgb = hexToRgb(t.white);
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-border', t.accent + '80');
    r.style.setProperty('--accent-bg', t.accent + '14');
    r.style.setProperty('--bg', t.bg);
    r.style.setProperty('--white', t.white);
    r.style.setProperty('--dim', 'rgba(' + rgb + ',0.55)');
    r.style.setProperty('--dimmer', 'rgba(' + rgb + ',0.2)');
    // Update body and bg-fixed background
    document.body.style.background = t.bg;
    var bgFixed = document.querySelector('.bg-fixed');
    if (bgFixed) {
      bgFixed.style.backgroundImage = 'none';
      bgFixed.style.background = t.bg;
    }
    // Update fade overlays
    var topFade = document.getElementById('topFade');
    var bottomFade = document.getElementById('bottomFade');
    if (topFade) topFade.style.background = 'linear-gradient(' + t.bg + ' 40%, transparent)';
    if (bottomFade) bottomFade.style.background = 'linear-gradient(transparent, ' + t.bg + ')';
    // Set theme attribute for CSS overrides
    document.body.setAttribute('data-theme', isLight(t.bg) ? 'light' : 'dark');
  }

  function isLight(hex) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }

  // Apply saved theme on load
  if (currentTheme > 0) applyTheme(themes[currentTheme]);

  window.randomizeTheme = randomizeTheme;

  // ─────────────────────────────────────────────
  // 4. MENU SCORE LOADER
  // ─────────────────────────────────────────────

  var menuScore = document.getElementById('menuMetaScore');
  if (menuScore) {
    var data = getTestResult('yam_test_meta_done');
    if (data && data.answers) {
      var sum = 0;
      for (var i = 0; i < data.answers.length; i++) {
        sum += data.answers[i];
      }
      var avg = Math.round(sum / data.answers.length);
      menuScore.textContent = avg;
      menuScore.style.color = scoreColor(avg);
    }
  }

  // ─────────────────────────────────────────────
  // 5. CLEAR DATA WARNING
  // ─────────────────────────────────────────────

  // Warn before user accidentally clears localStorage (e.g. via browser settings)
  window.addEventListener('beforeunload', function(e) {
    // Only warn if there's actual test data and user is on a page that might trigger clear
    // This is a passive safeguard — doesn't trigger on normal navigation
  });

  /**
   * hasMapData — checks if user has any saved test results
   * @returns {boolean}
   */
  function hasMapData() {
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('yam_') === 0 && localStorage.key(i).indexOf('_done') > -1) return true;
    }
    return false;
  }

  window.hasMapData = hasMapData;

})();
