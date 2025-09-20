import layout from '@/configs/jsonConfigs/layout.json'
import { setInCache, getFromCache, CACHE_KEYS } from '@/utils/localStorage'

export function fetchLayout(useCache = true, delay = 250) {
  if (useCache) {
    const cachedLayout = getFromCache(CACHE_KEYS.LAYOUT)
    if (cachedLayout) {
      return cachedLayout;
    }
  }
  return new Promise<typeof layout>((resolve) => {
    setTimeout(() => {
      useCache && setInCache(CACHE_KEYS.LAYOUT, layout);
      resolve(layout);
    }, delay);
  });
}
