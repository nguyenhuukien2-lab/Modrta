// Format currency to Vietnamese Dong
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + 'đ'
}

// Format phone number
export function formatPhone(phone: string): string {
  // Format: 0123 456 789
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

// Validate Vietnamese phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Calculate discount
export function calculateDiscount(
  subtotal: number,
  couponCode?: string
): number {
  if (!couponCode) return 0
  
  const discounts: Record<string, number> = {
    MODTRAFIRST: 0.15, // 15%
    MATCHA10: 0.10,    // 10%
    SUMMER20: 0.20,    // 20%
  }
  
  const discountPercent = discounts[couponCode.toUpperCase()] || 0
  return subtotal * discountPercent
}

// Slugify text (for URLs)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get delivery time slots
export function getDeliveryTimeSlots(): string[] {
  const slots: string[] = []
  const now = new Date()
  const currentHour = now.getHours()
  
  // Generate time slots from current time + 1 hour
  for (let hour = currentHour + 1; hour <= 22; hour++) {
    slots.push(`${hour}:00 - ${hour}:30`)
    if (hour < 22) {
      slots.push(`${hour}:30 - ${hour + 1}:00`)
    }
  }
  
  return slots
}

// Check if store is open
export function isStoreOpen(): boolean {
  const now = new Date()
  const hour = now.getHours()
  // Store hours: 7:00 - 22:00
  return hour >= 7 && hour < 22
}

// Generate order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `MOD-${timestamp}-${random}`.toUpperCase()
}
