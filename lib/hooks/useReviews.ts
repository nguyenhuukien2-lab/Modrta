'use client'

import { useEffect, useState } from 'react'
import { getReviews, Review } from '@/lib/api'

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const response = await getReviews(productId)

        if (response.error) {
          setError(response.error)
          setReviews([])
        } else {
          setReviews(response.data || [])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId])

  return { reviews, loading, error }
}
