'use client'

import { useEffect, useState } from 'react'
import { getProductAutocomplete } from '@/lib/api'

export function useAutocomplete(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const response = await getProductAutocomplete(query)

        if (response.error) {
          setError(response.error)
          setSuggestions([])
        } else {
          setSuggestions(response.suggestions || [])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions')
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  return { suggestions, loading, error }
}
