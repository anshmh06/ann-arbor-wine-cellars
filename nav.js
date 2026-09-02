/*!
 * Ann Arbor MI Wine Cellars - header navigation
 * File: nav.js
 *
 * The dropdowns work on hover alone via CSS, so they still function with
 * JavaScript disabled. This adds three things CSS cannot do:
 *   1. a short close delay, so the panel survives a sloppy diagonal mouse path
 *   2. click and tap to toggle, for touch and for people who prefer clicking
 *   3. Escape to close, and click-outside to dismiss
 */
(function () {
  'use strict';

  var CLOSE_DELAY = 220;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var wraps = [].slice.call(document.querySelectorAll('.mega-wrap'));

    if (!wraps.length) {
      return;
    }

    var timer = null;

    function closeAll(except) {
      wraps.forEach(function (w) {
        if (w === except) {
          return;
        }

        w.removeAttribute('data-open');

        var b = w.querySelector('.megabtn');

        if (b) {
          b.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function open(w) {
      window.clearTimeout(timer);
      closeAll(w);
      w.setAttribute('data-open', 'true');

      var b = w.querySelector('.megabtn');

      if (b) {
        b.setAttribute('aria-expanded', 'true');
      }
    }

    function scheduleClose() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        closeAll(null);
      }, CLOSE_DELAY);
    }

    wraps.forEach(function (w) {
      var btn = w.querySelector('.megabtn');

      w.addEventListener('mouseenter', function () {
        open(w);
      });

      w.addEventListener('mouseleave', scheduleClose);

      /* Keep the panel open while the pointer is inside it, even if it
         briefly leaves the wrapper on the way in. */
      var panel = w.querySelector('.mega');

      if (panel) {
        panel.addEventListener('mouseenter', function () {
          window.clearTimeout(timer);
        });
      }

      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();

          if (w.getAttribute('data-open') === 'true') {
            closeAll(null);
          } else {
            open(w);
          }
        });
      }

      /* Tabbing out of the last link in the panel should close it. */
      w.addEventListener('focusout', function (e) {
        if (!w.contains(e.relatedTarget)) {
          scheduleClose();
        }
      });

      w.addEventListener('focusin', function () {
        window.clearTimeout(timer);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAll(null);
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.mega-wrap')) {
        closeAll(null);
      }
    });
  });
})();
