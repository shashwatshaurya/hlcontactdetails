import contactData from '@/configs/jsonConfigs/contactData.json'
import contactFields from '@/configs/jsonConfigs/contactFields.json'
import { CACHE_KEYS, getFromCache, setInCache } from '@/utils/localStorage'

export function fetchContactData(useCache = true, delay = 250) {
  if (useCache) {
    const cachedContactData = getFromCache(CACHE_KEYS.CONTACT_DATA);
    if (cachedContactData) {
      return cachedContactData;
    }
  }
  return new Promise<typeof contactData>((resolve) => {
    setTimeout(() => {
      useCache && setInCache(CACHE_KEYS.CONTACT_DATA, contactData);
      resolve(contactData);
    }, delay);
  })
}

export function fetchContactFields(useCache = true, delay = 250) {
  if (useCache) {
    const cachedContactFields = getFromCache(CACHE_KEYS.CONTACT_FIELDS);
    if (cachedContactFields) {
      return cachedContactFields;
    }
  }
  return new Promise<typeof contactFields>((resolve) => {
    setTimeout(() => {
      useCache && setInCache(CACHE_KEYS.CONTACT_FIELDS, contactFields);
      resolve(contactFields);
    }, delay);
  })
}


