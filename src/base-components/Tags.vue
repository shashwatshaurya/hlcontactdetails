<template>
  <div class="hl-tags">
    <div class="hl-tags__list">
      <span
        v-for="(tag, idx) in visibleTags"
        :key="idx"
        class="hl-tags__item"
      >
        <span class="hl-tags__label">{{ tag }}</span>
        <button class="hl-tags__close" @click="closeTag(idx)" aria-label="remove tag">×</button>
      </span>

      <button
        v-if="overflowCount > 0"
        class="hl-tags__overflow"
        @click="emitShowOverflow"
      >
        +{{ overflowCount }}
      </button>

      <button class="hl-tags__add" @click="emitAdd" aria-label="add tag">+</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'HlTags',
  props: {
    tabs: { type: Array, default: () => [] },
    maxVisible: { type: Number, default: 3 }
  },
  emits: ['remove', 'add', 'show-overflow'],
  setup(props, { emit }) {
    function closeTag(idx) {
      const actualIndex = idx
      emit('remove', actualIndex)
    }

    function emitAdd() {
      emit('add')
    }

    function emitShowOverflow() {
      emit('show-overflow')
    }

    const visibleTags = computed(() => props.tabs.slice(0, props.maxVisible))
    const overflowCount = computed(() => Math.max(0, props.tabs.length - props.maxVisible))

    return { closeTag, emitAdd, emitShowOverflow, visibleTags, overflowCount }
  }
})
</script>

<style scoped>
.hl-tags__list { display:flex; gap:8px; align-items:center }
.hl-tags__item {
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding: 2px 6px;
  border-radius: 5px;
  /* border: 1px solid rgba(37, 99, 235, 0.18); */
  background: var(--page-bg-color, #e8f0ff);
  font-size: 12px;
  cursor: default;
}
.hl-tags__label { cursor: default; color: #2563eb; font-weight: 600 }
.hl-tags__close {
  background: transparent;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  font-size: 14px;
  color: #3b82f6;
}
.hl-tags__overflow {
  padding: 6px 10px;
  border-radius: 9999px;
  background: var(--page-bg-color, #e8f0ff);
  color: #2563eb;
  /* border: 1px solid rgba(37, 99, 235, 0.18); */
  cursor: pointer;
}
.hl-tags__add {
  padding: 2px 6px;
  border-radius: 9999px;
  background: var(--page-bg-color, #e8f0ff);
  color: #2563eb;
  /* border: 1px solid rgba(37, 99, 235, 0.18); */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}
</style>


