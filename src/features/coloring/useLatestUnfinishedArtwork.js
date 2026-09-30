import { useEffect, useState } from 'react'
import { getLatestUnfinishedArtwork } from './coloringService.js'

export function useLatestUnfinishedArtwork(userId) {
  const [snapshot, setSnapshot] = useState({ userId: null, artwork: null, error: null })

  useEffect(() => {
    let isMounted = true
    if (!userId) return () => { isMounted = false }

    getLatestUnfinishedArtwork(userId)
      .then((artwork) => {
        if (isMounted) setSnapshot({ userId, artwork, error: null })
      })
      .catch((error) => {
        if (isMounted) setSnapshot({ userId, artwork: null, error })
      })

    return () => { isMounted = false }
  }, [userId])

  return {
    artwork: snapshot.userId === userId ? snapshot.artwork : null,
    error: snapshot.userId === userId ? snapshot.error : null,
    isLoading: Boolean(userId) && snapshot.userId !== userId,
  }
}