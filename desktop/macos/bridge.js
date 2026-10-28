(() => {
  const call = (action, values = {}) => window.webkit.messageHandlers.atlas.postMessage({ action, ...values });
  let sequence = 0;
  const request = async (action, values, progress) => {
    const requestId = `mac-${++sequence}`;
    const listener = event => { if (event.detail.requestId === requestId) progress?.(event.detail.progress); };
    window.addEventListener('atlas:native-progress', listener);
    try { return await call(action, { ...values, requestId }); }
    finally { window.removeEventListener('atlas:native-progress', listener); }
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.nativeFrame = 'true';
    document.documentElement.dataset.platform = 'macos';
  });
  window.atlasDesktop = Object.freeze({
    platform: 'macos',
    applicationUpdates: 'manual',
    automaticUpdatesEnabled: __AUTO_ENABLED__,
    minimize: () => { void call('minimize'); },
    maximize: () => { void call('maximize'); },
    close: () => { void call('close'); },
    copyText: text => call('clipboard', { text }),
    openSource: url => call('source', { url }),
    checkDocUpdates: progress => request('docs:check', {}, progress),
    cancelDocUpdateCheck: () => { void call('docs:cancel'); },
    runAutoUpdates: (options, progress) => request('auto:run', options, progress),
    openApplicationUpdate: () => { void call('application:download'); },
  });
})();
