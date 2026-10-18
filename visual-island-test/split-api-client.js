/* Public endpoint only. Never put account names/passwords or fixed tokens here. */
(() => {
  'use strict';
  const origin = 'https://124.220.229.39';
  const key = 'mengyu-island-api-session-v1';
  const nativeFetch = window.fetch.bind(window);
  // Only the explicitly deployed GitHub origin uses this cross-site adapter.
  if (location.origin !== 'https://tutu-66.github.io') return;

  // GitHub Pages serves the app from a repository subdirectory. Keep every
  // auth entry and its return target inside that directory, including links
  // inserted later by the shared workspace guard.
  const scriptUrl = document.currentScript?.src ? new URL(document.currentScript.src, location.href) : new URL('.', location.href);
  const appBase = scriptUrl.pathname.slice(0, scriptUrl.pathname.lastIndexOf('/') + 1);
  const authPages = new Set(['login.html', 'register.html', 'forgot-password.html', 'auth.html']);
  const inApp = value => {
    try {
      const target = new URL(value || 'space.html', location.origin + appBase);
      if (target.origin !== location.origin) return appBase + 'space.html';
      let pathname = target.pathname;
      if (!pathname.startsWith(appBase)) pathname = appBase + pathname.replace(/^\/+/, '');
      return pathname + target.search + target.hash;
    } catch {
      return appBase + 'space.html';
    }
  };
  const normalizeAuthLink = link => {
    if (!(link instanceof HTMLAnchorElement)) return;
    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(raw)) return;
    let target;
    try { target = new URL(raw, location.href); } catch { return; }
    const page = target.pathname.split('/').pop();
    if (target.origin !== location.origin || !authPages.has(page)) return;
    target.pathname = appBase + page;
    if (target.searchParams.has('returnTo')) target.searchParams.set('returnTo', inApp(target.searchParams.get('returnTo')));
    const next = target.pathname + target.search + target.hash;
    if (link.getAttribute('href') !== next) link.setAttribute('href', next);
  };
  const normalizeTree = root => {
    if (root instanceof HTMLAnchorElement) normalizeAuthLink(root);
    root.querySelectorAll?.('a[href]').forEach(normalizeAuthLink);
  };
  const startRouteGuard = () => {
    normalizeTree(document);
    new MutationObserver(records => records.forEach(record => {
      if (record.type === 'attributes') normalizeAuthLink(record.target);
      record.addedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) normalizeTree(node); });
    })).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['href']});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startRouteGuard, {once:true});
  else startRouteGuard();
  window.MengyuPublicRoutes = {appBase, inApp};

  window.fetch = async (input, options = {}) => {
    const url = new URL(input instanceof Request ? input.url : String(input), location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) {
      return nativeFetch(input, options);
    }
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(options.headers).forEach((v, k) => headers.set(k, v));
    const token = sessionStorage.getItem(key);
    if (token) headers.set('Authorization', 'Bearer ' + token);
    const request = input instanceof Request ? {
      method: input.method, body: ['GET', 'HEAD'].includes(input.method) ? undefined : await input.clone().arrayBuffer(),
      signal: input.signal
    } : {};
    let response;
    try {
      response = await nativeFetch(origin + url.pathname + url.search, {
        ...request, ...options, headers, credentials: 'omit', redirect: 'error', cache: 'no-store'
      });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new Error('暂时连不上账户服务，请稍后重试；你的原账号无需重新注册。');
    }
    const session = response.headers.get('X-Island-Session');
    if (session === 'cleared' || response.status === 401) sessionStorage.removeItem(key);
    else if (session && /^[A-Za-z0-9_-]{20,256}$/.test(session)) sessionStorage.setItem(key, session);
    return response;
  };
})();
