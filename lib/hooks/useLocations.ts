'use client'

import { useEffect, useState } from 'react'
import { getLocations } from '@/lib/api'

export interface Location {
  id: string
  name: string
  address: string
  district: string
  city: string
  phone: string
  hours: string
  features: string[]
  image: string
  lat?: number
  lng?: number
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true)
        const data = await getLocations()
        setLocations(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch locations')
        setLocations([])
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  return { locations, loading, error }
}
