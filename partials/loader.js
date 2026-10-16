/* Loading screen for every page. Load this in <head> (before other scripts) with partials/loader.css.
   - Shows immediately when a page starts loading and when an internal link is clicked.
   - Hides when the page, header and footer have finished loading (or after 8 s at most). */
(function () {
  'use strict';
  var MIN_MS = 500, MAX_MS = 8000;
  var start = Date.now(), el = null, done = false;
  var hi = (document.documentElement.lang || '') === 'hi';
  var label = hi ? 'लोड हो रहा है…' : 'Loading…';

  function build() {
    if (el) return el;
    el = document.createElement('div');
    el.className = 'nepa-loader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('data-no-i18n', '');
    el.innerHTML = '<img class="nepa-loader__logo" src="images/logo/3.png" alt="" width="96" height="96" onerror="this.style.display=\'none\'">' +
      '<div class="nepa-loader__ring" aria-hidden="true"></div>' +
      '<div class="nepa-loader__text">' + label + '</div>';
    document.documentElement.appendChild(el);
    return el;
  }
  function show() { done = false; build().classList.remove('is-hidden'); }
  function hide() {
    if (done) return; done = true;
    var wait = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(function () { if (el) el.classList.add('is-hidden'); }, wait);
  }

  show();
  var loaded = document.readyState === 'complete', parts = !!window.__partialsLoaded;
  function check() { if (loaded && parts) hide(); }
  if (!loaded) window.addEventListener('load', function () { loaded = true; check(); });
  if (!parts) document.addEventListener('partials:loaded', function () { parts = true; check(); });
  check();
  setTimeout(hide, MAX_MS);

  /* Back/forward cache: never leave the loader stuck on a restored page */
  window.addEventListener('pageshow', function (e) { if (e.persisted) { start = 0; hide(); } });

  /* Show the loader when leaving through an internal link */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return;
    if (a.origin !== location.origin && location.protocol !== 'file:') return;
    if (a.pathname === location.pathname && a.search === location.search) return;
    start = Date.now(); show();
    setTimeout(hide, MAX_MS);
  });
})();
