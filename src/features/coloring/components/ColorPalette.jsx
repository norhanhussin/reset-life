import { useState } from 'react'
import { useI18n } from '../../../i18n/useI18n.js'

const PALETTES = {
  soft: ['#e7a9ad', '#b8a9d5', '#9ec9df', '#a9cdb6', '#f1b88f', '#efdfa9'],
  nature: ['#8caf78', '#456b50', '#a5a066', '#8f6f58', '#5b93b7', '#d5c58d'],
  classic: ['#cf5d59', '#e68d4f', '#e5c84f', '#629866', '#4e82b6', '#8b69ab', '#d47ca0'],
}

const PALETTE_KEYS = {
  soft: 'coloring.softPalette',
  nature: 'coloring.naturePalette',
  classic: 'coloring.classicPalette',
}

function ColorPalette({ color, onChange }) {
  const { t } = useI18n()
  const [palette, setPalette] = useState('soft')

  return (
    <section aria-label={t('coloring.color')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#354b41]">{t('coloring.color')}</h3>
        <label className="inline-flex items-center gap-2 rounded-md border border-[#dce3dc] bg-white px-2.5 py-1.5 text-xs font-medium text-[#53695c]">
          <span>{t('coloring.customColor')}</span>
          <input
            aria-label={t('coloring.customColor')}
            className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            onChange={(event) => onChange(event.target.value)}
            type="color"
            value={color}
          />
        </label>
      </div>
      <div aria-label={t('coloring.colorPalettes')} className="mt-3 flex gap-1 rounded-md bg-[#edf0eb] p-1" role="tablist">
        {Object.entries(PALETTE_KEYS).map(([id, key]) => (
          <button
            aria-selected={palette === id}
            className={`min-h-8 flex-1 rounded px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${palette === id ? 'bg-white text-[#285344] shadow-sm' : 'text-[#718278] hover:text-[#354b41]'}`}
            key={id}
            onClick={() => setPalette(id)}
            role="tab"
            type="button"
          >
            {t(key)}
          </button>
        ))}
      </div>
      <div aria-label={t('coloring.color')} className="mt-3 flex flex-wrap gap-2" role="radiogroup">
        {PALETTES[palette].map((swatch) => (
          <button
            aria-checked={color.toLowerCase() === swatch}
            aria-label={swatch}
            className={`h-8 w-8 rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${color.toLowerCase() === swatch ? 'border-[#284438] ring-2 ring-[#284438]/25 ring-offset-2' : 'border-black/10 hover:scale-105'}`}
            key={swatch}
            onClick={() => onChange(swatch)}
            role="radio"
            style={{ backgroundColor: swatch }}
            type="button"
          />
        ))}
      </div>
    </section>
  )
}

export default ColorPalette