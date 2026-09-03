/*!
 * Ann Arbor MI Wine Cellars - Lead Form Handler
 * File: form-handler.js
 */

/* ---------------------------------------------------------------------------
 * Google Apps Script web app that receives the leads.
 *
 * If leads ever stop arriving, check this URL first: redeploying an Apps
 * Script produces a NEW /exec URL unless you deploy over the existing
 * version, and the old one silently stops working.
 * ------------------------------------------------------------------------- */
var FORM_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxlh1OmY0B8Lja7mMmaRPoL749_s81QvfREO9NIeefpqqu319OpBxg6q9BpqhLmpnW8/exec';

(function () {
  'use strict';

  var SITE_NAME = 'Ann Arbor MI Wine Cellars';

  var SUCCESS_MESSAGE =
    'Thank you. Your wine cellar enquiry has been received. We will get back to you, usually the same working day.';

  var FAILURE_MESSAGE =
    'Something went wrong. Please try again or call us directly at 734-415-4984.';

  var MIN_FILL_MS = 3000;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function isValidEmail(email) {
    return /^[^\s@,;:<>()\[\]\\]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
  }

  function isValidPhone(phone) {
    if (!phone || /[a-zA-Z]/.test(phone)) {
      return false;
    }

    var digits = phone.replace(/\D/g, '');

    if (digits.length < 10 || digits.length > 15) {
      return false;
    }

    return !/^(\d)\1+$/.test(digits);
  }

  function setStatus(status, message, type) {
    if (!status) {
      return;
    }

    status.textContent = message;

    status.className =
      'form-status is-visible ' +
      (type === 'success' ? 'is-success' : 'is-error');

    /* Colours are handled in style.css so they stay legible on the dark
       form panel. Nothing is set inline here on purpose. */
  }

  function clearStatus(status) {
    if (!status) {
      return;
    }

    status.textContent = '';
    status.className = 'form-status';
  }

  function ensureHidden(form, name) {
    var field = form.querySelector('input[name="' + name + '"]');

    if (!field) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      form.appendChild(field);
    }

    return field;
  }

  /* This site uses extensionless directory URLs (/custom-wine-cellars/), so
     the last path segment is empty. Filter empties before reading the slug. */
  function currentSlug() {
    var parts = (window.location.pathname || '').split('/');
    var last = '';

    for (var i = parts.length - 1; i >= 0; i--) {
      if (parts[i]) {
        last = parts[i];
        break;
      }
    }

    return last.replace(/\.html$/i, '');
  }

  function inferredServiceName() {
    var slug = currentSlug();

    var services = {
      'custom-wine-cellars': 'Custom Wine Cellars',
      'wine-rooms': 'Wine Rooms',
      'glass-enclosed-wine-cellars': 'Glass-Enclosed Wine Cellars',
      'underground-wine-cellars': 'Underground Wine Cellars',
      'wine-cellar-conversions': 'Wine Cellar Conversions',
      'commercial-wine-cellars': 'Commercial Wine Cellars',
      'wine-tasting-rooms': 'Wine Tasting Rooms',
      'climate-controlled-wine-storage-rooms':
        'Climate-Controlled Wine Storage Rooms',
      'wine-cellar-additions': 'Wine Cellar Additions',
      'modern-contemporary-wine-cellars':
        'Modern & Contemporary Wine Cellars',
      'wine-cellar-design-build': 'Wine Cellar Design & Build',
      'wine-cellar-cooling-system-installation':
        'Wine Cellar Cooling System Installation',
      'wine-cellar-racking-storage-systems':
        'Wine Cellar Racking & Storage Systems',
      'wine-cellar-insulation-vapor-barrier-installation':
        'Wine Cellar Insulation & Vapor Barrier Installation',
      'wine-cellar-door-installation': 'Wine Cellar Door Installation',
      'wine-cellar-lighting-design': 'Wine Cellar Lighting Design',
      'wine-cellar-flooring-installation':
        'Wine Cellar Flooring Installation',
      'wine-cellar-renovation-remodeling':
        'Wine Cellar Renovation & Remodeling',
      'wine-cellar-humidity-control-systems':
        'Wine Cellar Humidity Control Systems',
      'wine-cellar-repair-maintenance': 'Wine Cellar Repair & Maintenance',
      'custom-wood-wine-racking': 'Custom Wood Wine Racking',
      'metal-modern-wine-racking-systems':
        'Metal & Modern Wine Racking Systems',
      'stone-brick-wine-cellar-construction':
        'Stone & Brick Wine Cellar Construction',
      'cable-wine-wall-systems': 'Wine Cellar Cable Wine Wall Systems',
      'wine-cellar-tasting-bar-installation':
        'Wine Cellar Tasting Bar Installation',
      'wine-cellar-backup-cooling-systems':
        'Wine Cellar Backup Cooling Systems',
      'wine-cellar-soundproofing': 'Wine Cellar Soundproofing',
      'wine-cellar-security-system-installation':
        'Wine Cellar Security System Installation',
      'wine-cellar-consultation-planning':
        'Wine Cellar Consultation & Planning',
      'wine-cellar-inventory-storage-layout-design':
        'Wine Cellar Inventory & Storage Layout Design'
    };

    return services[slug] || '';
  }

  /* Location pages carry a service selector, but recording which town the
     enquiry came from is genuinely useful for routing and for judging which
     location pages actually convert. */
  function inferredLocationName() {
    var slug = currentSlug();

    var locations = {
      'ypsilanti-mi': 'Ypsilanti, MI',
      'saline-mi': 'Saline, MI',
      'dexter-mi': 'Dexter, MI',
      'chelsea-mi': 'Chelsea, MI',
      'milan-mi': 'Milan, MI',
      'manchester-mi': 'Manchester, MI',
      'whitmore-lake-mi': 'Whitmore Lake, MI',
      'pittsfield-township-mi': 'Pittsfield Township, MI',
      'scio-township-mi': 'Scio Township, MI',
      'ann-arbor-township-mi': 'Ann Arbor Township, MI',
      'superior-township-mi': 'Superior Township, MI',
      'northfield-township-mi': 'Northfield Township, MI',
      'webster-township-mi': 'Webster Township, MI',
      'barton-hills-mi': 'Barton Hills, MI',
      'dixboro-mi': 'Dixboro, MI',
      'bridgewater-mi': 'Bridgewater, MI',
      'manchester-township-mi': 'Manchester Township, MI',
      'freedom-township-mi': 'Freedom Township, MI',
      'lima-township-mi': 'Lima Township, MI'
    };

    return locations[slug] || '';
  }

  function restoreButton(button, originalButtonText) {
    if (!button) {
      return;
    }

    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.innerHTML = originalButtonText;
  }

  function setupForm(form) {
    if (!form || form.dataset.leadHandlerReady === 'true') {
      return;
    }

    form.dataset.leadHandlerReady = 'true';

    var nameField =
      form.querySelector('#name') || form.querySelector('[name="name"]');

    var phoneField =
      form.querySelector('#phone') || form.querySelector('[name="phone"]');

    var emailField =
      form.querySelector('#email') || form.querySelector('[name="email"]');

    var addressField =
      form.querySelector('#address') || form.querySelector('[name="address"]');

    var serviceField =
      form.querySelector('#svc') ||
      form.querySelector('#service-select') ||
      form.querySelector('select[name="service"]');

    var detailsField =
      form.querySelector('#details') ||
      form.querySelector('#message') ||
      form.querySelector('textarea[name="details"]') ||
      form.querySelector('textarea[name="message"]');

    var button = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (nameField) {
      nameField.name = 'name';
    }

    if (phoneField) {
      phoneField.name = 'phone';
    }

    if (emailField) {
      emailField.name = 'email';
    }

    if (addressField) {
      addressField.name = 'address';
    }

    if (serviceField) {
      serviceField.name = 'service';
    }

    if (detailsField) {
      detailsField.name = 'message';
    }

    var loadedField = ensureHidden(form, 'formLoadedAt');
    var siteNameField = ensureHidden(form, 'siteName');
    var pageTitleField = ensureHidden(form, 'pageTitle');
    var pageUrlField = ensureHidden(form, 'pageUrl');
    var pagePathField = ensureHidden(form, 'pagePath');
    var locationField = ensureHidden(form, 'pageLocation');

    var inferredServiceField = null;

    if (!serviceField) {
      inferredServiceField = ensureHidden(form, 'service');
      inferredServiceField.value = inferredServiceName();
    }

    loadedField.value = String(Date.now());
    siteNameField.value = SITE_NAME;
    pageTitleField.value = document.title || '';
    pageUrlField.value = window.location.href || '';
    pagePathField.value = window.location.pathname || '';
    locationField.value = inferredLocationName();

    var honeypot = form.querySelector('input[name="website"]');

    if (!honeypot) {
      honeypot = document.createElement('input');

      honeypot.type = 'text';
      honeypot.name = 'website';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';

      honeypot.setAttribute('aria-hidden', 'true');

      honeypot.style.position = 'absolute';
      honeypot.style.left = '-9999px';
      honeypot.style.width = '1px';
      honeypot.style.height = '1px';
      honeypot.style.opacity = '0';
      honeypot.style.pointerEvents = 'none';

      form.appendChild(honeypot);
    }

    var status = form.querySelector('.form-status');

    if (!status) {
      status = document.createElement('div');

      status.className = 'form-status';

      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');

      if (button && button.parentNode) {
        button.parentNode.insertBefore(status, button.nextSibling);
      } else {
        form.appendChild(status);
      }
    }

    var sending = false;

    var originalButtonText = button ? button.innerHTML : '';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (sending) {
        return;
      }

      var name = nameField ? nameField.value.trim() : '';
      var phone = phoneField ? phoneField.value.trim() : '';
      var email = emailField ? emailField.value.trim() : '';

      if (name.length < 2) {
        setStatus(status, 'Please enter your name.', 'error');

        if (nameField) {
          nameField.focus();
        }

        return;
      }

      if (!isValidPhone(phone)) {
        setStatus(
          status,
          'Please enter a valid phone number so we can contact you.',
          'error'
        );

        if (phoneField) {
          phoneField.focus();
        }

        return;
      }

      if (email !== '' && !isValidEmail(email)) {
        setStatus(
          status,
          'Please enter a valid email address or leave it blank.',
          'error'
        );

        if (emailField) {
          emailField.focus();
        }

        return;
      }

      siteNameField.value = SITE_NAME;
      pageTitleField.value = document.title || '';
      pageUrlField.value = window.location.href || '';
      pagePathField.value = window.location.pathname || '';
      locationField.value = inferredLocationName();

      if (inferredServiceField) {
        inferredServiceField.value = inferredServiceName();
      }

      if (!FORM_ENDPOINT) {
        console.error(
          'form-handler.js: FORM_ENDPOINT is empty. Paste your Google Apps Script URL at the top of this file.'
        );

        setStatus(status, FAILURE_MESSAGE, 'error');

        return;
      }

      var loadedAt = parseInt(loadedField.value, 10);

      var elapsed = loadedAt ? Date.now() - loadedAt : MIN_FILL_MS;

      var delay =
        elapsed < MIN_FILL_MS ? MIN_FILL_MS - elapsed + 250 : 0;

      sending = true;

      clearStatus(status);

      if (button) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.textContent = 'Sending...';
      }

      window.setTimeout(function () {
        sendLead(
          form,
          button,
          status,
          originalButtonText,
          serviceField,
          loadedField,
          function () {
            sending = false;
          }
        );
      }, delay);
    });
  }

  function sendLead(
    form,
    button,
    status,
    originalButtonText,
    serviceField,
    loadedField,
    done
  ) {
    var data = new URLSearchParams();

    var elements = form.elements;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];

      if (!el.name || el.disabled) {
        continue;
      }

      if (
        el.type === 'submit' ||
        el.type === 'button' ||
        el.type === 'file'
      ) {
        continue;
      }

      if (
        (el.type === 'checkbox' || el.type === 'radio') &&
        !el.checked
      ) {
        continue;
      }

      if (
        el.name === 'service' &&
        serviceField &&
        serviceField.selectedIndex >= 0
      ) {
        var selectedOption =
          serviceField.options[serviceField.selectedIndex];

        if (selectedOption && selectedOption.value !== '') {
          data.append('service', selectedOption.text);
        }

        continue;
      }

      data.append(el.name, el.value);
    }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: data.toString()
    })
      .then(function () {
        form.reset();

        loadedField.value = String(Date.now());

        setStatus(status, SUCCESS_MESSAGE, 'success');

        restoreButton(button, originalButtonText);

        done();
      })
      .catch(function (error) {
        console.error('Lead submission failed:', error);

        setStatus(status, FAILURE_MESSAGE, 'error');

        restoreButton(button, originalButtonText);

        done();
      });
  }

  ready(function () {
    var forms = document.querySelectorAll('form[data-lead-form]');

    for (var i = 0; i < forms.length; i++) {
      setupForm(forms[i]);
    }
  });
})();
