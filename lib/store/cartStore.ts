import { create } from 'zustand'
import { Product, CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, customizations?: CartItem['customizations']) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateCustomization: (productId: string, customizations: CartItem['customizations']) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Computed
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  
  addItem: (product, customizations) => {
    const currentItems = get().items
    const existingItem = currentItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      set({
        items: currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, customizations: customizations || item.customizations }
            : item
        )
      })
    } else {
      set({
        items: [...currentItems, { product, quantity: 1, customizations }]
      })
    }
  },
  
  removeItem: (productId) => {
    set({
      items: get().items.filter(item => item.product.id !== productId)
    })
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    })
  },
  
  updateCustomization: (productId, customizations) => {
    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? { ...item, customizations }
          : item
      )
    })
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  toggleCart: () => {
    set({ isOpen: !get().isOpen })
  },
  
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
  
  subtotal: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }
}))
