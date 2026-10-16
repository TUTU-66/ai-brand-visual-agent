/* Public endpoint only. Never put account names/passwords or fixed tokens here. */
(() => {
  'use strict';
  const origin = 'https://124.220.229.39';
  const key = 'mengyu-island-api-session-v1';
  const nativeFetch = window.fetch.bind(window);
  // Only the explicitly deployed GitHub origin uses this cross-site adapter.
  if (location.origin !== 'https://tutu-66.github.io') return;
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
