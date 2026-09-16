// Product Types
export interface Product {
  id: string
  name: string
  nameEn: string
  slug: string
  category: 'matcha' | 'coffee' | 'dessert' | 'equipment'
  subcategory?: string
  price: number
  image: string
  description: string
  descriptionEn: string
  tags: string[]
  isNew?: boolean
  isBestseller?: boolean
  inStock: boolean
  ingredients?: string[]
  customizations?: ProductCustomization
}

export interface ProductCustomization {
  ice?: boolean
  sugar?: boolean
  milk?: ('Yến mạch' | 'Hạnh nhân' | 'Dừa' | 'Sữa tươi')[]
  size?: ('S' | 'M' | 'L')[]
}

// Cart Types
export interface CartItem {
  product: Product
  quantity: number
  customizations?: {
    ice?: string
    sugar?: string
    milk?: string
    size?: string
    note?: string
  }
}

// Location Types
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
  coordinates?: {
    lat: number
    lng: number
  }
}

// USP (Unique Selling Proposition) Types
export interface USP {
  id: string
  title: string
  description: string
  icon: string
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

// Order Types
export interface Order {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  deliveryMethod: 'delivery' | 'pickup'
  customer: CustomerInfo
  paymentMethod: 'vietqr' | 'momo' | 'zalopay' | 'card' | 'cod'
  ecoPackaging: boolean
  couponCode?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  email?: string
  address?: string
  district?: string
  city?: string
  note?: string
  deliveryTime?: string
}
