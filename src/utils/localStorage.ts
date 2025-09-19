export const CACHE_KEYS = {
  LAYOUT: 'layout',
  CONTACT_DATA: 'contactData',
  CONTACT_FIELDS: 'contactFields',
  NOTES: 'notes'
}

export function setInCache(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getFromCache(key: string) {
  return JSON.parse(localStorage.getItem(key) || 'null')
}