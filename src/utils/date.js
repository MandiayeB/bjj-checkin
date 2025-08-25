// src/utils/date.js

export function todayKey() {
  // Returns YYYY-MM-DD in the device's local timezone (iPad).
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(tsOrStr) {
  if (!tsOrStr) return '-'
  try {
    if (typeof tsOrStr === 'string') {
      const parts = tsOrStr.split('-')
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }
    // Firestore Timestamp (with toDate)
    const d = tsOrStr.toDate ? tsOrStr.toDate() : new Date(tsOrStr)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return '-'
  }
}
