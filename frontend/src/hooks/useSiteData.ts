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

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null)

  useEffect(() => {
    let alive = true
    load()
      .then((d) => {
        if (alive) setData(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return { data, loading: data === null }
}
