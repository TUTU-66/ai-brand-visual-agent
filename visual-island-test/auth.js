const $ = (selector) => document.querySelector(selector);
const phone = $('#phone');
const code = $('#code');
const send = $('#sendCode');
const form = $('#phoneForm');
const message = $('#formMessage');
const DEMO_ACCOUNT_KEY = 'mengyu-public-test-account-v1';
const DEMO_SESSION_KEY = 'mengyu-public-test-session-v1';

let countdown = 0;
let timer = null;
let config = null;
let publicDemo = false;
let demoCode = '';

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = `form-message${type ? ` ${type}` : ''}`;
}

function cleanPhone() {
  return phone.value.replace(/\D/g, '').slice(0, 11);
}

function tick() {
  if (countdown <= 0) {
    clearInterval(timer);
    send.disabled = false;
    send.textContent = '重新获取';
    return;
  }
  send.disabled = true;
  send.textContent = `${countdown}s 后重试`;
  countdown -= 1;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) throw new Error('API_UNAVAILABLE');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '请求失败，请稍后再试');
  return data;
}

function enablePublicDemo() {
  publicDemo = true;
  const note = $('#modeNote');
  note.hidden = false;
  $('#modeText').textContent = '公网体验模式：验证码会直接显示在本页，不会发送真实短信；账户只保存在当前浏览器。';
  const wechat = $('#wechatLogin');
  wechat.setAttribute('aria-disabled', 'true');
  wechat.removeAttribute('href');
  wechat.style.opacity = '.48';
  wechat.style.cursor = 'not-allowed';
  $('#wechatMessage').textContent = '微信扫码需要开放平台网站应用与已备案回调域，当前仅展示入口，不冒充真实扫码登录。';
}

async function loadConfig() {
  try {
    config = await api('/api/config');
    if (!config || !Object.prototype.hasOwnProperty.call(config, 'smsMode')) throw new Error('API_UNAVAILABLE');
    if (config.smsMode === 'dev') {
      $('#modeNote').hidden = false;
      $('#modeText').textContent = '当前是本地测试验证码模式，用来验证账户、会话和个人空间；它没有向手机发送真实短信。';
    } else if (config.smsMode !== 'tencent') {
      $('#modeNote').hidden = false;
      $('#modeText').textContent = '手机号短信服务尚未启用。';
      send.disabled = true;
    }
    if (!config.wechatEnabled) {
      const wechat = $('#wechatLogin');
      wechat.setAttribute('aria-disabled', 'true');
      wechat.removeAttribute('href');
      wechat.style.opacity = '.48';
      wechat.style.cursor = 'not-allowed';
      $('#wechatMessage').textContent = '微信开放平台网站应用和正式回调域尚未配置，当前不能冒充真实扫码登录。';
    }
  } catch {
    enablePublicDemo();
  }
}

phone.addEventListener('input', () => { phone.value = cleanPhone(); });
code.addEventListener('input', () => { code.value = code.value.replace(/\D/g, '').slice(0, 6); });

send.addEventListener('click', async () => {
  const value = cleanPhone();
  if (!/^1[3-9]\d{9}$/.test(value)) {
    setMessage('请输入正确的 11 位手机号', 'error');
    phone.focus();
    return;
  }
  send.disabled = true;
  setMessage('正在获取验证码…');
  try {
    if (publicDemo) {
      demoCode = String(Math.floor(100000 + Math.random() * 900000));
      $('#devCode').hidden = false;
      $('#devCodeValue').textContent = demoCode;
      code.value = demoCode;
      setMessage('体验验证码已生成并填入。它不会发送到手机。', 'success');
    } else {
      const data = await api('/api/auth/phone/start', {
        method: 'POST',
        body: JSON.stringify({ phone: value }),
      });
      setMessage(data.message, 'success');
      if (data.devCode) {
        $('#devCode').hidden = false;
        $('#devCodeValue').textContent = data.devCode;
        code.value = data.devCode;
      }
    }
    countdown = 60;
    tick();
    timer = setInterval(tick, 1000);
    code.focus();
  } catch (error) {
    send.disabled = false;
    setMessage(error.message === 'API_UNAVAILABLE' ? '账户服务暂不可用。' : error.message, 'error');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const p = cleanPhone();
  const c = code.value.trim();
  if (!/^1[3-9]\d{9}$/.test(p)) return setMessage('请输入正确的手机号', 'error');
  if (!/^\d{6}$/.test(c)) return setMessage('请输入 6 位验证码', 'error');
  const button = $('#submitPhone');
  button.disabled = true;
  button.textContent = '正在验证…';
  setMessage('');
  try {
    if (publicDemo) {
      if (!demoCode || c !== demoCode) throw new Error('验证码不正确，请重新获取');
      const existing = JSON.parse(localStorage.getItem(DEMO_ACCOUNT_KEY) || 'null');
      const created = !existing || existing.phone !== p;
      const account = {
        phone: p,
        displayName: created ? `成员${p.slice(-4)}` : existing.displayName,
        createdAt: created ? new Date().toISOString() : existing.createdAt,
      };
      localStorage.setItem(DEMO_ACCOUNT_KEY, JSON.stringify(account));
      localStorage.setItem(DEMO_SESSION_KEY, 'active');
      setMessage(created ? '体验账户已建立，正在进入个人空间' : '体验登录成功，正在进入个人空间', 'success');
      location.href = 'space.html';
      return;
    }
    const data = await api('/api/auth/phone/verify', {
      method: 'POST',
      body: JSON.stringify({ phone: p, code: c, returnTo: '/space.html' }),
    });
    setMessage(data.created ? '账户已建立，正在进入个人空间' : '登录成功，正在进入个人空间', 'success');
    location.href = data.redirect || '/space.html';
  } catch (error) {
    setMessage(error.message, 'error');
    button.disabled = false;
    button.textContent = '验证并进入';
  }
});

const errors = {
  wechat_not_configured: '微信扫码登录尚未完成正式配置。',
  wechat_state: '微信登录状态已过期，请重新发起。',
  wechat_failed: '微信授权没有完成，请稍后再试。',
};
const err = new URLSearchParams(location.search).get('error');
if (err && errors[err]) $('#wechatMessage').textContent = errors[err];

fetch('/api/me')
  .then((response) => response.headers.get('content-type')?.includes('application/json') && response.ok ? response.json() : null)
  .then((data) => {
    if (data?.authenticated && data.user) location.replace('/space.html');
  })
  .catch(() => {});

if (localStorage.getItem(DEMO_SESSION_KEY) === 'active' && localStorage.getItem(DEMO_ACCOUNT_KEY)) {
  location.replace('space.html');
} else {
  loadConfig();
}
