'use client'

import { useEffect, useState } from 'react'
import { getProducts, ProductFilters } from '@/lib/api'
import type { Product } from '@/lib/types'


export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 100,
    offset: 0,
    hasMore: false,
  })

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await getProducts(filters)

        if (response.error) {
          setError(response.error)
          setProducts([])
        } else {
          // Map raw API response: category có thể là object {slug} hoặc string
          const mapped = (response.data || []).map((p: any) => ({
            ...p,
            category: typeof p.category === 'object' ? p.category?.slug ?? p.category : p.category,
          })) as Product[]
          setProducts(mapped)
          setPagination(response.pagination || {
            total: 0,
            limit: 100,
            offset: 0,
            hasMore: false,
          })
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [
    filters.category,
    filters.q,
    filters.limit,
    filters.offset,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.sort,
  ])

  return { products, loading, error, pagination }
}
