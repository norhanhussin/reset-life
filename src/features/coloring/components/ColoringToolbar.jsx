import { Eraser, PaintBucket, Paintbrush, Redo2, Save, Trash2, Undo2, Check } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'

const TOOLS = [
  { id: 'fill', labelKey: 'coloring.fill', tipKey: 'coloring.fillTip', Icon: PaintBucket },
  { id: 'brush', labelKey: 'coloring.brush', tipKey: 'coloring.brushTip', Icon: Paintbrush },
  { id: 'eraser', labelKey: 'coloring.eraser', tipKey: 'coloring.eraserTip', Icon: Eraser },
]

function ColoringToolbar({
  tool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onFinish,
  isSaving,
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h3 className="text-sm font-semibold text-[#354b41]">{t('coloring.tool')}</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TOOLS.map(({ id, labelKey, tipKey, Icon }) => (
            <button
              aria-label={t(labelKey)}
              aria-pressed={tool === id}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border px-2 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] ${tool === id ? 'border-[#78937c] bg-[#eaf1e9] text-[#285344]' : 'border-[#e2e7e0] bg-white text-[#718278] hover:bg-[#f5f7f3]'}`}
              key={id}
              onClick={() => onToolChange(id)}
              title={t(tipKey)}
              type="button"
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </section>

      {(tool === 'brush' || tool === 'eraser') && (
        <label className="block text-sm font-medium text-[#354b41]">
          <span className="flex items-center justify-between gap-3">
            {t('coloring.brushSize')}
            <span className="text-xs tabular-nums text-[#718278]">{brushSize}</span>
          </span>
          <input
            className="mt-2 w-full accent-[#5e8066]"
            max="26"
            min="3"
            onChange={(event) => onBrushSizeChange(Number(event.target.value))}
            type="range"
            value={brushSize}
          />
        </label>
      )}

      <div className="grid grid-cols-4 gap-2 border-t border-[#e7ebe4] pt-4">
        <button aria-label={t('coloring.undo')} className="flex h-10 items-center justify-center rounded-md border border-[#dce3dc] bg-white text-[#53695c] transition hover:bg-[#edf2ec] disabled:cursor-not-allowed disabled:opacity-40" disabled={!canUndo} onClick={onUndo} title={t('coloring.undo')} type="button"><Undo2 aria-hidden="true" size={17} /></button>
        <button aria-label={t('coloring.redo')} className="flex h-10 items-center justify-center rounded-md border border-[#dce3dc] bg-white text-[#53695c] transition hover:bg-[#edf2ec] disabled:cursor-not-allowed disabled:opacity-40" disabled={!canRedo} onClick={onRedo} title={t('coloring.redo')} type="button"><Redo2 aria-hidden="true" size={17} /></button>
        <button aria-label={t('coloring.clear')} className="flex h-10 items-center justify-center rounded-md border border-[#e6d5ce] bg-white text-[#8a5c4f] transition hover:bg-[#fbefeb]" onClick={onClear} title={t('coloring.clear')} type="button"><Trash2 aria-hidden="true" size={16} /></button>
        <button aria-label={t('coloring.save')} className="flex h-10 items-center justify-center rounded-md border border-[#dce3dc] bg-white text-[#53695c] transition hover:bg-[#edf2ec] disabled:opacity-50" disabled={isSaving} onClick={onSave} title={t('coloring.save')} type="button"><Save aria-hidden="true" size={16} /></button>
      </div>
      <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#285344] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-60" disabled={isSaving} onClick={onFinish} type="button">
        <Check aria-hidden="true" size={17} />
        {t('coloring.finish')}
      </button>
    </div>
  )
}

export default ColoringToolbar