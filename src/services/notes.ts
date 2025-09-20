import notes from "@/configs/jsonConfigs/notes.json";
import { CACHE_KEYS, getFromCache, setInCache } from "@/utils/localStorage";

export function fetchNotes(useCache = true, delay = 200) {
  if (useCache) {
    const cachedNotes = getFromCache(CACHE_KEYS.NOTES);
    if (cachedNotes) {
      return cachedNotes;
    }
  }
  return new Promise<typeof notes>((resolve) => {
    setTimeout(() => {
      useCache && setInCache(CACHE_KEYS.NOTES, notes);
      resolve(notes);
    }, delay);
  });
}
