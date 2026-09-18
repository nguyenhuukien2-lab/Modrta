export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword?: string
  agreedTerms: boolean
  newsletter: boolean
}

export interface ValidationErrors {
  [field: string]: string
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase()
}

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  const national = digits.startsWith('84') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits
  return `+84${national}`
}

export function isValidName(input: string): boolean {
  const name = input.trim()
  return name.length >= 2 && name.length <= 50 && /\p{L}/u.test(name) && /^[\p{L}\p{N}\s-]+$/u.test(name)
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

export function isValidPhone(input: string): boolean {
  const normalized = normalizePhone(input)
  return /^\+84[35789]\d{8}$/.test(normalized)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
}

export function hasWeakPasswordSemantics(password: string, name: string, phone: string, email: string): boolean {
  const lower = password.toLowerCase()
  const normalizedPhone = normalizePhone(phone).replace(/\D/g, '')
  const emailLocal = email.split('@')[0].toLowerCase()
  const nameParts = name.toLowerCase().trim().split(/\s+/).filter(Boolean)

  return nameParts.some(part => part.length >= 3 && lower.includes(part))
    || (normalizedPhone.length >= 8 && lower.includes(normalizedPhone.slice(-8)))
    || (emailLocal.length >= 3 && lower.includes(emailLocal))
    || /123456|password|qwerty/i.test(password)
}

export function validateRegisterInput(input: Partial<RegisterInput>): ValidationErrors {
  const errors: ValidationErrors = {}
  const name = String(input.name || '').trim()
  const email = normalizeEmail(String(input.email || ''))
  const phone = String(input.phone || '').trim()
  const password = String(input.password || '')

  if (!name || name.length < 2 || name.length > 50) errors.name = 'Tên phải từ 2-50 ký tự'
  else if (!isValidName(name)) errors.name = 'Tên không được chứa ký tự đặc biệt'

  if (!email) errors.email = 'Email là bắt buộc'
  else if (!isValidEmail(email)) errors.email = 'Email không hợp lệ'

  if (!phone) errors.phone = 'Số điện thoại là bắt buộc'
  else if (!isValidPhone(phone)) errors.phone = 'Số điện thoại không hợp lệ (vd: 0913548678)'

  if (!password || password.length < 8 || password.length > 128) errors.password = 'Mật khẩu tối thiểu 8 ký tự'
  else if (!isValidPassword(password)) errors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường, số'
  else if (hasWeakPasswordSemantics(password, name, phone, email)) errors.password = 'Mật khẩu không được chứa tên hoặc email của bạn'

  if (input.confirmPassword !== undefined && password !== input.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không trùng khớp'
  }

  if (input.agreedTerms !== true) errors.agreedTerms = 'Phải chấp nhận điều khoản để tiếp tục'

  return errors
}

export function validateLoginInput(identifier: string, password: string): ValidationErrors {
  const errors: ValidationErrors = {}
  const value = identifier.trim()

  if (!value) errors.identifier = 'Email hoặc số điện thoại là bắt buộc'
  else if (!isValidEmail(value) && !isValidPhone(value)) errors.identifier = 'Email hoặc số điện thoại không hợp lệ'
  if (!password) errors.password = 'Mật khẩu là bắt buộc'

  return errors
}
