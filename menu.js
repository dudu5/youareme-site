/**
 * Menu Generator — single source of truth for navigation
 * Edit the config below to update menus across all pages.
 */

var MENU_CONFIG = [
  { label: 'Router', href: 'router', level: 0 },
  { label: 'Your Map', href: 'yourmap', level: 1 },
  { label: 'Presence & Intention', href: 'awareness', level: 2 },
  { label: 'Meta-Observation', href: 'test-meta', level: 3, scoreKey: 'yam_test_meta_done' },
  { label: 'You Are Me', href: '/', level: 1 },
  { label: 'Collaborate', href: 'collaborate', level: 1 }
];

(function() {
  var currentPath = window.location.pathname;
  var currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
  // Map index to / (homepage is You Are Me)
  if (currentPage === 'index' || currentPage === '' || currentPage === 'explore') currentPage = '/';

  // ── DESKTOP SIDE MENU ──
  var sideMenu = document.getElementById('sideMenu');
  if (sideMenu) {
    var html = '';
    MENU_CONFIG.forEach(function(item) {
      var isActive = (item.href === currentPage) ? ' active' : '';
      var paddingLeft = item.level === 0 ? '0' : (item.level * 12) + 'px';
      var fontSize = item.level === 0 ? '12px' : (item.level === 1 ? '11px' : '10px');
      var hexSize = item.level === 0 ? '1em' : (item.level === 1 ? '9px' : '8px');
      var cls = item.level > 0 ? 'menu-child' : '';

      var activeColor = isActive ? ' color:var(--accent);' : '';
      html += '<a href="' + item.href + '" class="' + cls + isActive + '" style="padding-left:' + paddingLeft + '; font-size:' + fontSize + ';' + activeColor + '">';
      if (isActive) {
        html += '<span style="font-size:' + hexSize + '; color:var(--accent); text-decoration:none !important;">\u2B22</span> ';
      } else {
        html += '<span style="font-size:' + hexSize + '; color:var(--white); text-decoration:none !important;">\u2B21</span> ';
      }

      // Score badge for items with scoreKey
      if (item.scoreKey) {
        html += '<span id="menuMetaScore" style="font-weight:700; margin-right:4px; text-decoration:none !important;"></span>';
      }

      html += '<span>' + item.label + '</span></a>';
    });
    sideMenu.innerHTML = html;
  }

  // ── MOBILE MENU ──
  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    var mobileHtml = '';
    // Close button
    mobileHtml += '<button style="position:absolute; top:16px; left:16px; font-size:24px; color:var(--white); background:none; border:none; cursor:pointer;" onclick="document.getElementById(\'mobileMenu\').classList.remove(\'open\'); document.getElementById(\'mobileOverlay\').classList.remove(\'open\'); var h=document.querySelector(\'.hamburger-inline\'); if(h) h.textContent=\'\\u2630\';">\u2715</button>';

    MENU_CONFIG.forEach(function(item) {
      var isActive = (item.href === currentPage) ? ' mob-active' : '';
      var depthClass = '';
      if (item.level === 1) depthClass = ' mob-child';
      else if (item.level === 2) depthClass = ' mob-child-deep';
      else if (item.level >= 3) depthClass = ' mob-child-deepest';

      var hex = isActive ? '<span class="hex-active">\u2B22</span>' : '<span class="hex-outline">\u2B21</span>';

      mobileHtml += '<a href="' + item.href + '" class="' + depthClass + isActive + '">' + hex + ' ' + item.label + '</a>';
    });
    mobileMenu.innerHTML = mobileHtml;
  }

  // ── LOAD SCORES INTO MENU ──
  MENU_CONFIG.forEach(function(item) {
    if (!item.scoreKey) return;
    var saved = localStorage.getItem(item.scoreKey);
    if (!saved) return;
    try {
      var data = JSON.parse(saved);
      if (data.answers) {
        var sum = 0;
        for (var i = 0; i < data.answers.length; i++) sum += data.answers[i];
        var avg = Math.round(sum / data.answers.length);
        var el = document.getElementById('menuMetaScore');
        if (el) {
          el.textContent = avg;
          el.style.color = scoreColor(avg);
        }
      }
    } catch(e) {}
  });
})();
