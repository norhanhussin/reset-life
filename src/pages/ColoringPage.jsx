import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Heart, Palette } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'
import { useI18n } from '../i18n/useI18n.js'
import { translateError } from '../i18n/translateError.js'
import { COLORING_DESIGNS, getColoringDesign } from '../features/coloring/designs.js'
import { useColoringData } from '../features/coloring/useColoringData.js'
import {
  attachArtworkToSession,
  deleteArtwork,
  saveArtwork,
  setDesignFavorite,
  startColoringSession,
} from '../features/coloring/coloringService.js'
import ArtworkCard from '../features/coloring/components/ArtworkCard.jsx'
import ColoringCard from '../features/coloring/components/ColoringCard.jsx'
import ColoringFilters from '../features/coloring/components/ColoringFilters.jsx'
import ColoringStats from '../features/coloring/components/ColoringStats.jsx'
import ColoringWorkspace from '../features/coloring/components/ColoringWorkspace.jsx'

function ColoringLoading() {
  const { t } = useI18n()
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f0] px-6 text-[#285344]">
      <div className="text-center" role="status">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#cdd9ce] border-t-[#285344]" />
        <p className="mt-4 text-sm font-medium">{t('coloring.loading')}</p>
      </div>
    </main>
  )
}

function ColoringPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const location = useLocation()
  const { artworks, favorites, stats, error, isLoading, reload } = useColoringData(user?.id)
  const [filter, setFilter] = useState('all')
  const [workspace, setWorkspace] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const pendingArtworkId = location.state?.artworkId
  const autoOpenedArtworkRef = useRef(null)

  const visibleDesigns = useMemo(() => {
    if (filter === 'favorites') return COLORING_DESIGNS.filter((design) => favorites.includes(design.id))
    if (filter === 'all') return COLORING_DESIGNS
    return COLORING_DESIGNS.filter((design) => design.category === filter)
  }, [favorites, filter])

  async function openDesign(design, artwork = null) {
    setActionError('')
    setNotice('')
    setIsStarting(true)
    try {
      const sessionId = await startColoringSession(user.id, design.id)
      setWorkspace({ design, artwork, sessionId })
    } catch (openError) {
      setActionError(translateError(openError, t, 'coloring.loadError'))
    } finally {
      setIsStarting(false)
    }
  }

  useEffect(() => {
    if (!pendingArtworkId || isLoading || !user || autoOpenedArtworkRef.current === pendingArtworkId) return
    const artwork = artworks.find((item) => item.id === pendingArtworkId)
    const design = artwork ? getColoringDesign(artwork.design_id) : null
    if (!artwork || !design) return
    autoOpenedArtworkRef.current = pendingArtworkId
    startColoringSession(user.id, design.id)
      .then((sessionId) => setWorkspace({ design, artwork, sessionId }))
      .catch((openError) => setActionError(translateError(openError, t, 'coloring.loadError')))
  }, [pendingArtworkId, isLoading, user, artworks, t])

  async function handleFavorite(design) {
    const wasFavorite = favorites.includes(design.id)
    setActionError('')
    setNotice('')
    try {
      await setDesignFavorite(user.id, design.id, wasFavorite)
      reload()
    } catch (favoriteError) {
      setActionError(translateError(favoriteError, t, 'coloring.favoriteError'))
    }
  }

  async function handleSaveArtwork(values, sessionId) {
    const saved = await saveArtwork(user.id, values)
    if (sessionId) {
      try {
        await attachArtworkToSession(user.id, sessionId, saved.id)
      } catch (sessionError) {
        setActionError(translateError(sessionError, t, 'coloring.saveError'))
      }
    }
    setNotice(values.is_completed
      ? t('coloring.finishSuccess')
      : values.id
        ? t('coloring.updateSuccess')
        : t('coloring.saveSuccess'))
    reload()
    return saved
  }

  async function handleDeleteArtwork(artwork) {
    if (!window.confirm(t('coloring.deleteConfirm'))) return
    setActionError('')
    setNotice('')
    try {
      await deleteArtwork(user.id, artwork.id)
      setNotice(t('coloring.deleteSuccess'))
      reload()
    } catch (deleteError) {
      setActionError(translateError(deleteError, t, 'coloring.deleteError'))
    }
  }

  if (isLoading) return <ColoringLoading />


  return (
    <div className="min-h-screen bg-[#f5f6f0] text-[#20372f]">
      <header className="border-b border-[#dce3dc] bg-[#fbfcf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#285344]">RESET</span>
          <Link className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#53695c] transition hover:bg-[#edf2ec] hover:text-[#285344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285344]" to="/dashboard">
            <ArrowLeft aria-hidden="true" className="rtl:rotate-180" size={16} />
            {t('common.backToDashboard')}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-8">
        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf0e8] text-[#52745b]">
            <Palette aria-hidden="true" size={21} strokeWidth={1.7} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718278]">{t('coloring.browse')}</p>
            <h1 className="mt-1 font-serif text-3xl text-[#24483c] sm:text-4xl">{t('coloring.title')}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#718278]">{t('coloring.subtitle')}</p>
          </div>
        </div>

        {(error || actionError) && (
          <section className="mt-6 flex flex-col gap-3 rounded-lg border border-[#e6c8bd] bg-[#fcf2ee] px-4 py-4 text-sm leading-5 text-[#7d3f32] sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">{actionError || translateError(error, t, 'coloring.loadError')}</p>
            {error && <button className="w-fit shrink-0 rounded-md border border-[#d9b4a8] px-3 py-2 text-sm font-semibold hover:bg-[#f8e5de]" onClick={reload} type="button">{t('common.tryAgain')}</button>}
          </section>
        )}
        {notice && <p className="mt-6 rounded-lg border border-[#cdddcf] bg-[#edf5ee] px-4 py-3 text-sm text-[#315c42]" role="status">{notice}</p>}
        {isStarting && <p className="mt-4 text-sm text-[#718278]" role="status">{t('coloring.loading')}</p>}

        {stats && <div className="mt-7"><ColoringStats stats={stats} /></div>}

        <section aria-labelledby="coloring-library-title" className="mt-9">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">{t('coloring.browse')}</p>
              <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="coloring-library-title">{t('coloring.libraryTitle')}</h2>
            </div>
            <ColoringFilters onChange={setFilter} value={filter} />
          </div>
          {visibleDesigns.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-10 text-center">
              <Heart aria-hidden="true" className="mx-auto text-[#a86e72]" size={24} />
              <h3 className="mt-3 text-base font-semibold text-[#354b41]">{t('coloring.noFavorites')}</h3>
              <p className="mt-2 text-sm leading-6 text-[#718278]">{t('coloring.noFavoritesDescription')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {visibleDesigns.map((design) => (
                <ColoringCard
                  design={design}
                  isFavorite={favorites.includes(design.id)}
                  key={design.id}
                  onFavorite={handleFavorite}
                  onStart={(selectedDesign) => openDesign(selectedDesign)}
                />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="my-artworks-title" className="mt-11 border-t border-[#dfe5dc] pt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718278]">{t('coloring.title')}</p>
              <h2 className="mt-1 text-xl font-semibold text-[#20372f]" id="my-artworks-title">{t('coloring.myArtworks')}</h2>
            </div>
            <span className="text-sm tabular-nums text-[#89978d]">{artworks.length.toLocaleString()}</span>
          </div>
          {artworks.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7cd] bg-[#fbfcf8] px-6 py-9 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0e8] text-[#4b7459]"><Palette aria-hidden="true" size={22} /></span>
              <h3 className="mt-4 max-w-lg font-serif text-xl text-[#354b41]">{t('coloring.noArtworks')}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#718278]">{t('coloring.noArtworksDescription')}</p>
              <button className="mt-5 rounded-md border border-[#bfcfc2] px-4 py-2.5 text-sm font-semibold text-[#285344] transition hover:bg-[#edf2ec]" onClick={() => openDesign(COLORING_DESIGNS[0])} type="button">{t('coloring.startCreating')}</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {artworks.map((artwork) => (
                <ArtworkCard artwork={artwork} key={artwork.id} onContinue={(item) => {
                  const design = getColoringDesign(item.design_id)
                  if (design) openDesign(design, item)
                }} onDelete={handleDeleteArtwork} />
              ))}
            </div>
          )}
        </section>
      </main>

      {workspace && (
        <ColoringWorkspace
          artwork={workspace.artwork}
          design={workspace.design}
          key={workspace.sessionId}
          onClose={() => setWorkspace(null)}
          onSave={handleSaveArtwork}
          sessionId={workspace.sessionId}
        />
      )}
    </div>
  )
}

export default ColoringPage