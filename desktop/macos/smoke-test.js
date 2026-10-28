void (async () => {
  const call = (action, values = {}) => window.webkit.messageHandlers.atlas.postMessage({ action, ...values });
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const until = async test => {
    for (let i = 0; i < 160; i++) { const result = test(); if (result) return result; await new Promise(resolve => setTimeout(resolve, 100)); }
    throw new Error('Timed out: ' + test.toString());
  };
  const button = text => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === text);
  const appearance = () => {
    const root = getComputedStyle(document.documentElement);
    const shell = getComputedStyle(document.querySelector('.app-shell'));
    return { theme: document.documentElement.dataset.theme, rootColor: root.color, rootBackground: root.backgroundColor,
      ink: root.getPropertyValue('--ink').trim(), surface: root.getPropertyValue('--surface').trim(), shellColor: shell.color,
      shellBackground: shell.backgroundColor, titleColor: getComputedStyle(document.querySelector('.brand strong')).color,
      pageOpacity: getComputedStyle(document.querySelector('.page')).opacity,
      headingColor: getComputedStyle(document.querySelector('.settings-title h2, .document-card h2')).color,
      titleAncestors: [...function* () { for (let node = document.querySelector('.brand strong'); node; node = node.parentElement) yield node; }()]
        .map(node => ({ tag: node.tagName, classes: node.className, color: getComputedStyle(node).color })) };
  };
  try {
    await until(() => document.querySelector('.hero h1'));
    assert(window.atlasDesktop.platform === 'macos', 'Missing native macOS bridge');
    assert(document.documentElement.dataset.platform === 'macos', 'Missing native frame');
    assert(document.querySelector('.shortcut-button kbd').textContent === '⌘ K', 'Incorrect Mac shortcut');
    const catalog = await (await fetch('./docs/catalog.json')).json();
    assert(catalog.documents.length === 66, 'Offline corpus did not load');
    if ('__TEST_PHASE__' === 'first') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      await until(() => document.querySelector('[role=dialog] input'));
      const input = document.querySelector('[role=dialog] input');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'spinFor'); input.dispatchEvent(new Event('input', { bubbles: true }));
      await until(() => [...document.querySelectorAll('.search-result')].find(el => el.textContent.includes('电机与电机组')));
      [...document.querySelectorAll('.search-result')].find(el => el.textContent.includes('电机与电机组')).click();
      await until(() => document.querySelector('.doc-content pre code') && document.querySelector('.copy-code'));
      const code = document.querySelector('.doc-content pre code').textContent;
      document.querySelector('.copy-code').click();
      await until(() => document.querySelector('[role=status]')?.textContent.includes('代码已复制'));
      assert(await call('test:clipboard') === code, 'Native clipboard differs from the original C++');
      document.querySelector('button[aria-label="收藏文档"]').click();
      button('对照').click(); await until(() => document.querySelectorAll('.doc-column').length === 2);
      const columns = [...document.querySelectorAll('.doc-column')].map(col => [...col.querySelectorAll('pre code')].map(el => el.textContent));
      assert(JSON.stringify(columns[0]) === JSON.stringify(columns[1]), 'Bilingual C++ differs');
      location.hash = '#settings'; await until(() => button('深色')); button('深色').click();
      const hex = document.querySelector('input[aria-label="颜色值"]');
      setter.call(hex, '#ffcc00'); hex.dispatchEvent(new Event('input', { bubbles: true }));
      await until(() => document.documentElement.dataset.accent === 'custom');
      await until(() => JSON.parse(localStorage.getItem('atlas:settings')).customColor === '#ffcc00');
      assert(document.documentElement.dataset.theme === 'dark', 'Dark mode failed');
    } else {
      assert(document.documentElement.dataset.theme === 'dark', 'Theme was lost after process restart');
      assert(document.documentElement.dataset.accent === 'custom', 'Custom color was lost after process restart');
      assert(JSON.parse(localStorage.getItem('atlas:settings')).customColor === '#ffcc00', 'Color was lost');
      location.hash = '#favorites'; await until(() => document.querySelector('.document-card'));
      assert(document.querySelectorAll('.document-card').length === 1, 'Bookmark was lost after process restart');
      assert(document.querySelector('.document-card h2').textContent.includes('电机与电机组'), 'Wrong bookmark');
    }
    await until(() => Number(appearance().pageOpacity) >= .99 && appearance().titleColor === 'rgb(224, 232, 217)' && appearance().headingColor === 'rgb(224, 232, 217)');
    await until(() => appearance().rootBackground === 'rgb(20, 29, 24)' && appearance().shellColor === 'rgb(224, 232, 217)');
    if ('__TEST_PHASE__' === 'first') document.querySelectorAll('.settings-card')[1].scrollIntoView({ behavior: 'instant', block: 'start' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await call('test:complete', { result: { ok: true, phase: '__TEST_PHASE__', documents: catalog.documents.length, appearance: appearance() } });
  } catch (error) {
    await call('test:complete', { result: { ok: false, error: String(error), stack: error.stack, appearance: appearance() } });
  }
})();
