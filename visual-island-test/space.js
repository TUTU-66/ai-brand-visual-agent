const $ = (selector) => document.querySelector(selector);
const DEMO_ACCOUNT_KEY = 'mengyu-public-test-account-v1';
const DEMO_SESSION_KEY = 'mengyu-public-test-session-v1';
let currentUser = null;
let publicDemo = false;

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) throw new Error('API_UNAVAILABLE');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || '请求失败');
  return data;
}

function providerName(value) { return value === 'phone' ? '手机号' : '微信'; }
function localProjects() {
  const keys = [
    ['mengyu-builder-state-v01', '网站组装器'],
    ['mengyu-comic-project-v01', '分格漫画'],
    ['mengyu-wechat-project-v01', '公众号排版'],
    ['mengyu-palette-project-v01', '五色配色卡'],
  ];
  return keys.filter(([key]) => localStorage.getItem(key)).map(([, label]) => label);
}

function demoUser() {
  const account = JSON.parse(localStorage.getItem(DEMO_ACCOUNT_KEY) || 'null');
  if (!account || localStorage.getItem(DEMO_SESSION_KEY) !== 'active') return null;
  return {
    displayName: account.displayName,
    membership: { isVip: false, vipExpiresAt: null },
    identities: [{ provider: 'phone', label: `+86 ${account.phone.slice(0, 3)}****${account.phone.slice(-4)}（体验）` }],
  };
}

function render(user) {
  currentUser = user;
  $('#sideName').textContent = user.displayName;
  $('#greeting').textContent = `你好，${user.displayName}`;
  $('#displayName').value = user.displayName;
  const vip = user.membership.isVip;
  $('#sideTier').textContent = vip ? 'VIP 会员' : '普通成员';
  $('#tierName').textContent = vip ? 'VIP' : 'FREE';
  if (vip) $('#vipNote').textContent = user.membership.vipExpiresAt ? `VIP 有效期至 ${user.membership.vipExpiresAt}` : 'VIP 已生效';
  if (publicDemo) $('#vipNote').textContent = '当前是公网体验账户，数据仅保存在这个浏览器；VIP 付费尚未接入。';
  const identities = $('#identityList');
  identities.innerHTML = '';
  user.identities.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'identity-item';
    row.innerHTML = `<b>${providerName(item.provider)}</b><span>${item.label} · ${publicDemo ? '体验状态' : '已验证'}</span>`;
    identities.append(row);
  });
  const projects = localProjects();
  if (projects.length) {
    $('#projectTitle').textContent = `本机找到 ${projects.length} 类项目记录`;
    $('#projectText').textContent = `${projects.join('、')}保存在当前浏览器。它们还不是云端项目，换设备不会自动出现。`;
  }
  $('#loading').classList.add('hide');
}

async function load() {
  try {
    const data = await api('/api/me');
    if (!data.authenticated || !data.user) {
      location.replace('/auth.html?returnTo=/space.html');
      return;
    }
    render(data.user);
  } catch {
    publicDemo = true;
    const user = demoUser();
    if (!user) {
      location.replace('auth.html?returnTo=/space.html');
      return;
    }
    render(user);
  }
}

$('#logout').addEventListener('click', async () => {
  if (publicDemo) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    location.replace('index.html');
    return;
  }
  try { await api('/api/logout', { method: 'POST', body: '{}' }); }
  finally { location.replace('/index.html'); }
});

$('#profileForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const msg = $('#profileMessage');
  button.disabled = true;
  msg.textContent = '正在保存…';
  try {
    if (publicDemo) {
      const account = JSON.parse(localStorage.getItem(DEMO_ACCOUNT_KEY) || 'null');
      account.displayName = $('#displayName').value.trim().slice(0, 24) || account.displayName;
      localStorage.setItem(DEMO_ACCOUNT_KEY, JSON.stringify(account));
      render(demoUser());
      msg.textContent = '名称已保存在当前浏览器';
    } else {
      const data = await api('/api/profile', { method: 'POST', body: JSON.stringify({ displayName: $('#displayName').value }) });
      render(data.user);
      msg.textContent = '名称已保存';
    }
  } catch (error) {
    msg.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

load();
