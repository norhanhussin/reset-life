import { useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { useI18n } from '../../../i18n/useI18n.js'
import { translateError } from '../../../i18n/translateError.js'
import ColoringCanvas from './ColoringCanvas.jsx'
import ColoringToolbar from './ColoringToolbar.jsx'
import ColorPalette from './ColorPalette.jsx'

const EMPTY_ARTWORK = { fills: {}, strokes: [] }
const MAX_HISTORY = 31

function normalizeArtworkData(data) {
  return {
    fills: data?.fills && typeof data.fills === 'object' ? data.fills : {},
    strokes: Array.isArray(data?.strokes) ? data.strokes : [],
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    return `{${entries.join(',')}}`
  }
  return JSON.stringify(value)
}

function ColoringWorkspace({ design, artwork, sessionId, onClose, onSave }) {
  const { t } = useI18n()
  const initialData = normalizeArtworkData(artwork?.artwork_data || EMPTY_ARTWORK)
  const [history, setHistory] = useState([initialData])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [savedArtwork, setSavedArtwork] = useState(artwork)
  const [title, setTitle] = useState(artwork?.title || t(design.titleKey))
  const [tool, setTool] = useState('fill')
  const [color, setColor] = useState('#e7a9ad')
  const [brushSize, setBrushSize] = useState(9)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [savedData, setSavedData] = useState(() => stableStringify(initialData))
  const currentData = history[historyIndex] || EMPTY_ARTWORK
  const hasUnsavedChanges = stableStringify(currentData) !== savedData

  function commitArtwork(nextArtwork) {
    const nextHistory = [...history.slice(0, historyIndex + 1), nextArtwork]
    if (nextHistory.length > MAX_HISTORY) nextHistory.shift()
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
    setErrorMessage('')
    setFeedback('')
  }

  function handleFillRegion(regionId) {
    if (currentData.fills[regionId] === color) return
    commitArtwork({
      ...currentData,
      fills: { ...currentData.fills, [regionId]: color },
    })
  }

  function handleStrokesChange(strokes) {
    commitArtwork({ ...currentData, strokes })
  }

  function handleUndo() {
    if (historyIndex === 0) return
    setHistoryIndex((index) => index - 1)
    setFeedback('')
    setErrorMessage('')
  }

  function handleRedo() {
    if (historyIndex >= history.length - 1) return
    setHistoryIndex((index) => index + 1)
    setFeedback('')
    setErrorMessage('')
  }

  function handleClear() {
    if (!window.confirm(t('coloring.clearConfirm'))) return
    commitArtwork(EMPTY_ARTWORK)
  }

  function requestClose() {
    if (hasUnsavedChanges && !window.confirm(t('coloring.unsavedConfirm'))) return
    onClose()
  }

  async function saveCurrentArtwork(isCompleted) {
    if (isSaving) return
    setIsSaving(true)
    setErrorMessage('')
    setFeedback('')
    try {
      const saved = await onSave({
        id: savedArtwork?.id,
        design_id: design.id,
        title: title.trim() || t(design.titleKey),
        artwork_data: currentData,
        is_completed: isCompleted || Boolean(savedArtwork?.is_completed),
      }, sessionId)
      setSavedArtwork(saved)
      setSavedData(stableStringify(saved.artwork_data))
      setFeedback(isCompleted ? t('coloring.finishSuccess') : savedArtwork ? t('coloring.updateSuccess') : t('coloring.saveSuccess'))
      if (isCompleted) onClose()
    } catch (error) {
      setErrorMessage(translateError(error, t, 'coloring.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-0 flex-col bg-[#f5f6f0] text-[#20372f]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#dce3dc] bg-[#fbfcf8] px-3 py-3 sm:px-5">
        <button
          aria-label={t('coloring.closeWorkspace')}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#53695c] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]"
          onClick={requestClose}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="rtl:rotate-180" size={19} />
        </button>
        <label className="min-w-0 flex-1 sm:max-w-lg">
          <span className="sr-only">{t('coloring.artworkTitle')}</span>
          <input
            className="w-full min-w-0 border-0 border-b border-transparent bg-transparent px-1 py-1 text-center font-serif text-base font-semibold text-[#24483c] outline-none transition placeholder:text-[#819087] focus:border-[#9db29f] sm:text-lg"
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </label>
        <button
          aria-label={t('coloring.closeWorkspace')}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#53695c] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] sm:hidden"
          onClick={requestClose}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            className="min-h-10 rounded-md border border-[#cbd7cd] px-4 py-2 text-sm font-semibold text-[#285344] transition hover:bg-[#edf2ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-55"
            disabled={isSaving}
            onClick={() => saveCurrentArtwork(false)}
            type="button"
          >
            {isSaving ? t('coloring.saving') : t('coloring.save')}
          </button>
          <button
            className="min-h-10 rounded-md bg-[#285344] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e4336] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344] disabled:cursor-wait disabled:opacity-55"
            disabled={isSaving}
            onClick={() => saveCurrentArtwork(true)}
            type="button"
          >
            {t('coloring.finish')}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="flex min-h-[40vh] min-w-0 flex-1 items-center justify-center overflow-auto bg-[#edf0eb] p-3 sm:p-5 lg:min-h-0">
          <ColoringCanvas
            artworkData={currentData}
            brushSize={brushSize}
            color={color}
            design={design}
            onFillRegion={handleFillRegion}
            onStrokesChange={handleStrokesChange}
            tool={tool}
          />
        </main>

        <aside className="max-h-[45vh] shrink-0 overflow-y-auto border-t border-[#dce3dc] bg-[#fbfcf8] p-4 sm:p-5 lg:max-h-none lg:w-[19rem] lg:border-s lg:border-t-0">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1">
            <ColorPalette color={color} onChange={setColor} />
            <ColoringToolbar
              brushSize={brushSize}
              canRedo={historyIndex < history.length - 1}
              canUndo={historyIndex > 0}
              isSaving={isSaving}
              onBrushSizeChange={setBrushSize}
              onClear={handleClear}
              onFinish={() => saveCurrentArtwork(true)}
              onRedo={handleRedo}
              onSave={() => saveCurrentArtwork(false)}
              onToolChange={setTool}
              onUndo={handleUndo}
              tool={tool}
            />
          </div>
          {errorMessage && <p className="mt-4 rounded-md border border-[#e6c8bd] bg-[#fcf2ee] px-3 py-2.5 text-sm leading-5 text-[#7d3f32]" role="alert">{errorMessage}</p>}
          {feedback && <p className="mt-4 rounded-md border border-[#cdddcf] bg-[#edf5ee] px-3 py-2.5 text-sm leading-5 text-[#315c42]" role="status">{feedback}</p>}
        </aside>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#dce3dc] bg-[#fbfcf8] px-4 py-2.5 text-xs text-[#718278] sm:hidden">
        <span>{t('coloring.tool')}: {t(`coloring.${tool}`)}</span>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-[#cbd7cd] px-3 py-1.5 font-semibold text-[#285344]" disabled={isSaving} onClick={() => saveCurrentArtwork(false)} type="button">{t('coloring.save')}</button>
          <button className="rounded-md bg-[#285344] px-3 py-1.5 font-semibold text-white" disabled={isSaving} onClick={() => saveCurrentArtwork(true)} type="button">{t('coloring.finish')}</button>
        </div>
      </footer>
    </div>
  )
}

export default ColoringWorkspace