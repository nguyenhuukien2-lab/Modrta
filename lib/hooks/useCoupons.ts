'use client'

import { useEffect, useState } from 'react'
import { getCoupons, validateCoupon, Coupon } from '@/lib/api'

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCoupons() {
      try {
        setLoading(true)
        const response = await getCoupons()

        if (response.error) {
          setError(response.error)
          setCoupons([])
        } else {
          setCoupons(response.data || [])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coupons')
        setCoupons([])
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  return { coupons, loading, error }
}

export async function useValidateCoupon(code: string, subtotal: number) {
  try {
    const result = await validateCoupon(code, subtotal)
    return {
      success: true,
      data: result.data,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to validate coupon',
    }
  }
}
