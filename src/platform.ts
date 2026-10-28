export const macPreview = import.meta.env.DEV && import.meta.env.MODE === 'mac-preview';
if (macPreview) {
  document.documentElement.dataset.platform = 'macos';
  document.title = 'V5 Atlas · Mac 界面预览';
}
export const isMac = macPreview || window.atlasDesktop?.platform === 'macos' || /Mac|iPhone|iPad/.test(navigator.platform);
export const searchShortcut = isMac ? '⌘ K' : 'Ctrl K';

export async function copyText(text: string) {
  if (window.atlasDesktop?.copyText) {
    if (!(await window.atlasDesktop.copyText(text))) throw new Error('Clipboard unavailable');
  } else await navigator.clipboard.writeText(text);
}
