import { useEffect, useState } from 'react'
import { getSiteData } from '../services/api'
import type { SiteData } from '../types'

// Satu request untuk seluruh halaman publik: promise di-cache di module scope.
let cache: Promise<SiteData> | null = null

const load = (): Promise<SiteData> => {
  if (!cache) {
    cache = getSiteData().catch((err) => {
      cache = null
      throw err
    })
  }
  return cache
}

// Admin CRUD memicu event ini; cache dibersihkan di level modul supaya
// halaman publik tidak memakai data basi walau belum ada komponen ter-mount.
if (typeof window !== 'undefined') {
  window.addEventListener('siteDataInvalidate', () => {
    cache = null
  })
}

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    // Listen untuk invalidation event dari admin CRUD
    const handleInvalidate = () => {
      setRefetchCount(c => c + 1)
    }
    window.addEventListener('siteDataInvalidate', handleInvalidate)
    return () => window.removeEventListener('siteDataInvalidate', handleInvalidate)
  }, [])

  useEffect(() => {
    let alive = true
    // Invalidate cache saat dependency berubah (refetchCount atau manual call)
    if (refetchCount > 0) {
      cache = null
    }
    load()
      .then((d) => {
        if (alive) setData(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [refetchCount])

  return { data, loading: data === null }
}
