'use client'

import { useEffect, useState } from 'react'
import { getOrders } from '@/lib/api'

export function useOrders(token: string | null, limit = 20, offset = 0) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit,
    offset,
    hasMore: false,
  })

  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getOrders(token, limit, offset)

        if (response.error) {
          setError(response.error)
          setOrders([])
        } else {
          setOrders(response.data || [])
          setPagination(response.pagination || {
            total: 0,
            limit,
            offset,
            hasMore: false,
          })
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token, limit, offset])

  return { orders, loading, error, pagination }
}
