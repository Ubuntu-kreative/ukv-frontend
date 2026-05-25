// src/lib/moxie/validation.ts
// Input validation for Moxie cart and reservation flows

export interface ValidationResult {
  valid: boolean
  error?: string
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }
  return { valid: true }
}

// Phone validation (supports +254, 07, etc.)
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^(\+254|0)[1-9]\d{8}$/
  if (!phone || !phoneRegex.test(phone)) {
    return { valid: false, error: 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)' }
  }
  return { valid: true }
}

// Guest count validation
export function validateGuestCount(count: number): ValidationResult {
  if (!count || count < 1 || count > 50) {
    return { valid: false, error: 'Guest count must be between 1 and 50' }
  }
  return { valid: true }
}

// Date validation (must be future date)
export function validateDate(dateStr: string): ValidationResult {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Please enter a valid date' }
  }

  if (date < today) {
    return { valid: false, error: 'Please select a future date' }
  }

  return { valid: true }
}

// Time validation (HH:MM format)
export function validateTime(timeStr: string): ValidationResult {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeStr || !timeRegex.test(timeStr)) {
    return { valid: false, error: 'Please enter a valid time (HH:MM)' }
  }
  return { valid: true }
}

// Name validation
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Please enter a valid name' }
  }
  return { valid: true }
}

// Special requests/notes validation
export function validateNotes(notes: string): ValidationResult {
  if (notes && notes.length > 500) {
    return { valid: false, error: 'Special requests must be 500 characters or less' }
  }
  return { valid: true }
}

// Combined booking validation
export interface BookingData {
  name?: string
  email?: string
  phone?: string
  date?: string
  time?: string
  guests?: number
  notes?: string
}

export function validateBooking(data: BookingData): ValidationResult {
  if (!data.name) {
    return { valid: false, error: 'Name is required' }
  }
  const nameValidation = validateName(data.name)
  if (!nameValidation.valid) return nameValidation

  if (!data.phone) {
    return { valid: false, error: 'Phone number is required' }
  }
  const phoneValidation = validatePhone(data.phone)
  if (!phoneValidation.valid) return phoneValidation

  if (data.email) {
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) return emailValidation
  }

  if (data.guests) {
    const guestValidation = validateGuestCount(data.guests)
    if (!guestValidation.valid) return guestValidation
  }

  if (data.date) {
    const dateValidation = validateDate(data.date)
    if (!dateValidation.valid) return dateValidation
  }

  if (data.time) {
    const timeValidation = validateTime(data.time)
    if (!timeValidation.valid) return timeValidation
  }

  if (data.notes) {
    const notesValidation = validateNotes(data.notes)
    if (!notesValidation.valid) return notesValidation
  }

  return { valid: true }
}
