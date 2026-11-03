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

  window.ULT = { token: token, read: read, act: act, show: show, setText: setText, reveal: reveal };
})();
