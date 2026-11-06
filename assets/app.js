/*
 * Shared by every page: read the token, talk to the Apps Script API, show messages.
 *
 * The token lives in the URL's #fragment, which the browser never sends to this
 * host or in a Referer header. Requests to the API carry no cookies
 * (credentials: 'omit'), so Google treats every visitor as signed out, which is
 * the one case Apps Script web apps handle reliably on phones.
 */
(function () {
  var apiUrl = (window.ULT_CONFIG || {}).apiUrl;

  function token() {
    return decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
  }

  function read(api, tok) {
    var url = apiUrl + '?api=' + encodeURIComponent(api) + '&token=' + encodeURIComponent(tok);
    return fetch(url, { credentials: 'omit', redirect: 'follow' }).then(asJson);
  }

  // A string body goes out as text/plain, which needs no CORS preflight.
  function act(body) {
    return fetch(apiUrl, { method: 'POST', credentials: 'omit', redirect: 'follow', body: JSON.stringify(body) })
      .then(asJson);
  }

  function asJson(res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  function show(message, ok) {
    var el = document.getElementById('result');
    el.textContent = message;
    el.className = 'status ' + (ok ? 'ok' : 'err');
    el.hidden = false;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function reveal(id) {
    document.querySelectorAll('[data-state]').forEach(function (el) { el.hidden = true; });
    var el = document.getElementById(id);
    if (el) el.hidden = false;
  }

  // A laundromat page remembers its own link on the phone that opened it, so a
  // pickup code scanned on that phone is recorded as confirmed by the laundromat.
  // Only ever a convenience: nothing requires it, and a cleared browser loses it.
  var SITE_KEY = 'ult-site';
  function rememberSite(tok) { try { localStorage.setItem(SITE_KEY, tok); } catch (e) {} }
  function forgetSite(tok) { try { if (localStorage.getItem(SITE_KEY) === tok) localStorage.removeItem(SITE_KEY); } catch (e) {} }
  function rememberedSite() { try { return localStorage.getItem(SITE_KEY) || ''; } catch (e) { return ''; } }

  // The attendant's name, kept on the phone between visits.
  var NAME_KEY = 'ult-attendant';
  function bindAttendant(input) {
    try { input.value = localStorage.getItem(NAME_KEY) || ''; } catch (e) {}
    input.addEventListener('change', function () {
      try { localStorage.setItem(NAME_KEY, input.value); } catch (e) {}
    });
  }

  window.ULT = { token: token, read: read, act: act, show: show, setText: setText, reveal: reveal,
    rememberSite: rememberSite, forgetSite: forgetSite, rememberedSite: rememberedSite, bindAttendant: bindAttendant };
})();
