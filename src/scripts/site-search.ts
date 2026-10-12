import { findSearchResults, prepareSearch, searchExcerpt, searchTerms, type SearchEntry } from '../utils/search';

const dialog = document.querySelector<HTMLDialogElement>('#site-search');
const input = dialog?.querySelector<HTMLInputElement>('#site-search-input');
const results = dialog?.querySelector<HTMLOListElement>('#search-results');
const status = dialog?.querySelector<HTMLElement>('#search-status');
const retry = dialog?.querySelector<HTMLButtonElement>('[data-search-retry]');
const more = dialog?.querySelector<HTMLButtonElement>('[data-search-more]');

if (dialog && input && results && status && retry && more) {
  let index: ReturnType<typeof prepareSearch> | undefined;
  let pending: Promise<void> | undefined;
  let limit = 20;
  let composing = false;
  let timer: number;
  let previousOverflow = '';
  let opener: HTMLElement | null = null;

  // Build highlights with text nodes, never by injecting content or queries as HTML.
  function highlight(target: HTMLElement, text: string, query: string) {
    const terms = searchTerms(query).sort((a, b) => b.length - a.length);
    if (!terms.length) { target.textContent = text; return; }
    const pattern = new RegExp(terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'giu');
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      target.append(document.createTextNode(text.slice(cursor, match.index)));
      const mark = document.createElement('mark');
      mark.textContent = match[0];
      target.append(mark);
      cursor = match.index! + match[0].length;
    }
    target.append(document.createTextNode(text.slice(cursor)));
  }

  function render() {
    if (!input || !results || !status || !more || !index) return;
    const query = input.value.trim();
    results.replaceChildren();
    more.hidden = true;
    if (!query) {
      status.textContent = '输入关键词，搜索文章全文与生活记录。';
      return;
    }
    const matches = findSearchResults(index, query);
    const visible = matches.slice(0, limit);
    status.textContent = matches.length
      ? `找到 ${matches.length} 条结果${matches.length > limit ? `，已显示 ${visible.length} 条` : ''}`
      : '没有找到相关内容，试试更短的关键词或标签。';
    for (const entry of visible) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = entry.url;
      const meta = document.createElement('p');
      meta.className = 'result-meta';
      meta.textContent = [entry.kind, ...entry.tags.slice(0, 3).map((tag) => `#${tag}`)].join(' · ');
      const title = document.createElement('h3');
      highlight(title, entry.title, query);
      const excerpt = document.createElement('p');
      excerpt.className = 'result-excerpt';
      highlight(excerpt, searchExcerpt(entry, query), query);
      link.append(meta, title, excerpt);
      item.append(link);
      results.append(item);
    }
    more.hidden = matches.length <= limit;
  }

  async function loadIndex() {
    if (index) { render(); return; }
    if (pending) return pending;
    retry.hidden = true;
    status.textContent = '正在加载搜索…';
    results.setAttribute('aria-busy', 'true');
    pending = (async () => {
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) throw new Error('Search index unavailable');
        index = prepareSearch(await response.json() as SearchEntry[]);
        render();
      } catch {
        status.textContent = '搜索暂时无法加载，请检查网络后重试。';
        retry.hidden = false;
      } finally {
        results.removeAttribute('aria-busy');
        pending = undefined;
      }
    })();
    return pending;
  }

  function openSearch() {
    if (dialog.open) return;
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    input.focus();
    input.select();
    void loadIndex();
  }

  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    // The navbar may have been hidden by scrolling before the shortcut was used.
    document.getElementById('navbar')?.classList.remove('hidden');
    opener?.focus({ preventScroll: true });
  });

  const queueSearch = () => {
    if (composing) return;
    window.clearTimeout(timer);
    limit = 20;
    timer = window.setTimeout(render, 120);
  };
  input.addEventListener('input', queueSearch);
  input.addEventListener('compositionstart', () => { composing = true; window.clearTimeout(timer); });
  input.addEventListener('compositionend', () => { composing = false; queueSearch(); });
  retry.addEventListener('click', () => { void loadIndex(); });
  more.addEventListener('click', () => {
    const previousCount = results.childElementCount;
    limit += 20;
    render();
    results.querySelectorAll('a')[previousCount]?.focus();
  });

  dialog.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (composing) return;
    window.clearTimeout(timer);
    render();
    results.querySelector('a')?.click();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.isComposing || composing) return;
    // Search inputs consume Escape to clear themselves in some browsers.
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    if (document.activeElement !== input && !results.contains(document.activeElement)) return;
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === 'ArrowDown' ? current + 1 : current - 1;
    if (next < 0) input.focus();
    else links[Math.min(next, links.length - 1)].focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.isComposing || event.altKey || event.repeat) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    const editing = target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
    const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    const slash = event.key === '/' && !editing && !event.ctrlKey && !event.metaKey;
    if ((shortcut || slash) && !document.querySelector('.image-lightbox.open') && !document.querySelector('dialog[open]')) {
      event.preventDefault();
      openSearch();
    }
  });
}
