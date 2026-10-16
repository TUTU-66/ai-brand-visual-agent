(() => {
  const page = document.body.dataset.page;
  const currentHref = page === 'home' ? 'index.html' : ['program-detail'].includes(page) ? 'programs.html' : page === 'article' ? 'content.html' : `${page}.html`;
  document.querySelectorAll('[data-nav] a').forEach(link => {
    if (link.getAttribute('href') === currentHref) link.setAttribute('aria-current', 'page');
  });
  const btn = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');
  if (btn && nav) btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-static-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const note = form.querySelector('.form-note');
    if (note) note.textContent = '演示页面不会提交或保存真实信息';
  }));
  const quotes = [...document.querySelectorAll('[data-quote]')];
  let index = 0;
  const show = n => quotes.forEach((q, i) => q.hidden = i !== n);
  if (quotes.length) {
    document.querySelector('[data-prev]')?.setAttribute('aria-label', '上一条评价');
    document.querySelector('[data-next]')?.setAttribute('aria-label', '下一条评价');
    show(0);
    document.querySelector('[data-prev]')?.addEventListener('click', () => { index = (index - 1 + quotes.length) % quotes.length; show(index); });
    document.querySelector('[data-next]')?.addEventListener('click', () => { index = (index + 1) % quotes.length; show(index); });
  }
})();