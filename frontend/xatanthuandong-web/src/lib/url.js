import { api } from './api'

export function resolveApiUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = (api.defaults.baseURL || '').replace(/\/$/, '')
  const path = String(url).startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}
