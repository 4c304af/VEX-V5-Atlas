import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { ACCENTS, normalizeColor } from './theme';
import type { Settings } from './types';

export default function AccentSettings({ settings, preset, custom, t }: {
  settings: Settings;
  preset: (id: string) => void;
  custom: (color: string) => void;
  t: (zh: string, en: string) => string;
}) {
  const color = normalizeColor(settings.customColor ?? '') ?? '#006b57';
  const [draft, setDraft] = useState(color);
  useEffect(() => setDraft(color), [color]);
  const valid = normalizeColor(draft);
  return <div className="accent-settings">
    <div className="accent-row"><span>{t('强调色', 'Accent color')}</span>{ACCENTS.map(a =>
      <button key={a.id} style={{ background: a.color }} className={'color-choice ' + (settings.accent === a.id ? 'selected' : '')}
        onClick={() => preset(a.id)} aria-label={t(a.zh, a.en)} aria-pressed={settings.accent === a.id}>
        {settings.accent === a.id && <Check size={16} />}
      </button>)}
    </div>
    <div className="custom-color-controls">
      <label className="color-picker-label"><input type="color" value={color} aria-label={t('自定义强调色', 'Custom accent color')}
        onChange={e => custom(e.target.value)} /><span>{t('自定义颜色', 'Custom color')}</span></label>
      <input className="color-hex" type="text" value={draft} spellCheck={false} maxLength={7}
        aria-label={t('颜色值', 'Hex color')} aria-invalid={!valid} aria-describedby={!valid ? 'color-error' : undefined}
        onChange={e => { setDraft(e.target.value); const next = normalizeColor(e.target.value); if (next && e.target.value.length === 7) custom(next); }}
        onBlur={() => { if (valid) { setDraft(valid); if (draft !== color) custom(valid); } }} />
      <button className="text-button small" onClick={() => { setDraft('#006b57'); custom('#006b57'); preset('jade'); }}>{t('恢复默认', 'Reset color')}</button>
    </div>
    {!valid && <p id="color-error" className="color-error">{t('请输入 #RGB 或 #RRGGBB 格式的颜色。', 'Use a #RGB or #RRGGBB color.')}</p>}
    <div className="accent-preview" aria-label={t('配色预览', 'Color preview')}><span>{t('配色预览', 'Color preview')}</span><span className="accent-preview-tag">API</span><span className="accent-preview-button">{t('示例按钮', 'Sample button')}</span></div>
  </div>;
}
