'use client'

import { useEffect, useState } from 'react'
import { getRelatedProducts } from '@/lib/api'
import type { Product } from '@/lib/types'

export function useRelatedProducts(productId: string, limit = 4) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true)
        const response = await getRelatedProducts(productId, limit)

        if (response.error) {
          setError(response.error)
          setProducts([])
        } else {
          setProducts(response.data || [])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchRelated()
    }
  }, [productId, limit])

  return { products, loading, error }
}
