<template>
  <section class="notes-root" :style="rootStyle">
    <HlCard header="Notes">
      <!-- @vue-ignore next-line: Volar can't infer slots from JS component -->
      <template #right>
        <button class="icon-button" aria-label="Close notes" @click="onCloseClick">✕</button>
      </template>

      <div class="notes-list">
        <article
          v-for="(note, idx) in notes"
          :key="idx"
          class="note-item"
        >
          <div class="note-content" v-html="formatNote(note.content)"></div>
          <div class="note-time">{{ timeAgo(note.createdAt) }}</div>
        </article>
      </div>
    </HlCard>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchNotes } from '@/services/notes'
import { HlCard } from '@/base-components'

const props = defineProps<{
  style?: Record<string, any>
  onClose?: () => void
}>()

const rootStyle = computed(() => props.style ?? {})

type NoteItem = { content: string; createdAt: string }
const notes = ref<NoteItem[]>([])

onMounted(async () => {
  const data = await fetchNotes(true, 50)
  // supports both { notes: [...] } and array directly
  notes.value = (Array.isArray((data as any).notes) ? (data as any).notes : (data as any)) as NoteItem[]
})

function timeAgo(iso: string): string {
  const created = new Date(iso)
  const seconds = Math.floor((Date.now() - created.getTime()) / 1000)
  const hours = Math.floor(seconds / 3600)
  if (hours < 1) return 'just now'
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  if (days >= 1) {
    const dayLabel = days === 1 ? '1 day' : `${days} days`
    if (remainingHours === 0) return `${dayLabel} ago`
    const hourLabel = remainingHours === 1 ? '1 hour' : `${remainingHours} hours`
    return `${dayLabel} ${hourLabel} ago`
  }
  if (hours === 1) return '1 hour ago'
  return `${hours} hours ago`
}

function formatNote(text: string): string {
  // simple mention highlight for patterns like @Name or {{@Name Site}}
  return text
    .replace(/\{\{([^}]+)\}\}/g, '<span class="note-special">$1</span>')
    .replace(/(^|\s)@([\w-]+)/g, '$1<span class="mention">@$2</span>')
}

function onCloseClick() {
  if (typeof props.onClose === 'function') props.onClose()
}
</script>

<style scoped>
.notes-root { width: 620px; height: 97vh }
.notes-root :deep(.hl-card) { height: 100%; display: flex; flex-direction: column; }
.notes-root :deep(.hl-card__header) { border: none }
.notes-root :deep(.hl-card__body) { flex: 1; display: flex; flex-direction: column; min-height: 0 }
.icon-button {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1;
  color: var(--muted-700);
}
.notes-list { display: flex; flex-direction: column; gap: 12px; flex: 1; min-height: 0; overflow: auto }
.note-item {
  background: var(--warning-100);
  border: 1px solid var(--warning-300);
  border-radius: var(--component-radius);
  padding: 12px;
  font-size: calc(var(--font-size-large) - 2px);
}
.note-content { color: var(--muted-700); }
.note-time { color: var(--muted-color); font-size: 12px; margin-top: 8px }
.note-content :deep(.mention) { color: var(--primary-color-700); font-weight: 600 }
.note-content :deep(.note-special) { color: var(--primary-color); font-weight: 600 }
.note-content :deep(.note-special .mention) { color: inherit; font-weight: inherit }
</style>


