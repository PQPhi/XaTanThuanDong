import { setAuthToken } from './api'

const KEY = 'xatanthuandong_token'

export function getToken() {
  return localStorage.getItem(KEY)
}

export function saveToken(token) {
  localStorage.setItem(KEY, token)
  setAuthToken(token)
}

export function clearToken() {
  localStorage.removeItem(KEY)
  setAuthToken(null)
}

export function initAuthFromStorage() {
  const token = getToken()
  if (token) setAuthToken(token)
  return token
}
