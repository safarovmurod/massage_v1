// Правила пароля должны совпадать с настройками Supabase
// (Authentication → Providers → Email):
// минимум 8 символов, строчная и заглавная латинская буква и цифра.
export function isStrongPassword(password) {
  if (!password || password.length < 8) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}
