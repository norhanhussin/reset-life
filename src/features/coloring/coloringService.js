import { supabase } from '../../lib/supabase/client.js'

function requireUserId(userId) {
  if (!userId) throw new Error('Sign in to use your creative space.')
}

function validateArtwork(artwork) {
  if (!artwork.design_id) throw new Error('Choose a design before saving.')
  if (!artwork.title?.trim()) throw new Error('Artwork title is required.')

  const serialized = JSON.stringify(artwork.artwork_data || {})
  if (serialized.length > 700_000) {
    throw new Error('This artwork is too large to save. Try undoing a few brush strokes.')
  }

  return {
    design_id: artwork.design_id,
    title: artwork.title.trim(),
    artwork_data: artwork.artwork_data || { fills: {}, strokes: [] },
    is_completed: Boolean(artwork.is_completed),
  }
}

export async function getColoringData(userId) {
  requireUserId(userId)

  const [artworksResult, favoritesResult, sessionsResult] = await Promise.all([
    supabase
      .from('coloring_artworks')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false }),
    supabase
      .from('coloring_favorites')
      .select('design_id')
      .eq('user_id', userId),
    supabase
      .from('coloring_sessions')
      .select('id')
      .eq('user_id', userId),
  ])

  const error = artworksResult.error || favoritesResult.error || sessionsResult.error
  if (error) throw error

  const artworks = artworksResult.data || []
  const favorites = (favoritesResult.data || []).map((favorite) => favorite.design_id)
  const sessions = sessionsResult.data || []

  return {
    artworks,
    favorites,
    stats: {
      artworksCreated: artworks.length,
      completed: artworks.filter((artwork) => artwork.is_completed).length,
      favorites: favorites.length,
      sessions: sessions.length,
    },
  }
}

export async function getArtwork(userId, artworkId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('coloring_artworks')
    .select('*')
    .eq('user_id', userId)
    .eq('id', artworkId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getLatestUnfinishedArtwork(userId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('coloring_artworks')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function saveArtwork(userId, artwork) {
  requireUserId(userId)
  const values = validateArtwork(artwork)

  const query = artwork.id
    ? supabase
      .from('coloring_artworks')
      .update(values)
      .eq('user_id', userId)
      .eq('id', artwork.id)
    : supabase
      .from('coloring_artworks')
      .insert({ ...values, user_id: userId })

  const { data, error } = await query.select('*').single()
  if (error) throw error
  return data
}

export async function deleteArtwork(userId, artworkId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('coloring_artworks')
    .delete()
    .eq('user_id', userId)
    .eq('id', artworkId)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('This artwork could not be found or deleted.')
}

export async function setDesignFavorite(userId, designId, isFavorite) {
  requireUserId(userId)

  if (isFavorite) {
    const { error } = await supabase
      .from('coloring_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('design_id', designId)
    if (error) throw error
    return false
  }

  const { error } = await supabase
    .from('coloring_favorites')
    .insert({ user_id: userId, design_id: designId })
  if (error) throw error
  return true
}

export async function startColoringSession(userId, designId) {
  requireUserId(userId)
  const { data, error } = await supabase
    .from('coloring_sessions')
    .insert({ user_id: userId, design_id: designId })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function attachArtworkToSession(userId, sessionId, artworkId) {
  requireUserId(userId)
  const { error } = await supabase
    .from('coloring_sessions')
    .update({ artwork_id: artworkId })
    .eq('user_id', userId)
    .eq('id', sessionId)

  if (error) throw error
}