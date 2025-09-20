<template>
  <nav class="hl-sidebar">
    <ul class="hl-sidebar-list">
      <li
        v-for="(item, idx) in items"
        :key="item.key ?? idx"
        class="hl-sidebar-item"
        :title="item.title"
      >
        <button
          class="hl-icon-btn"
          :class="{ active: item.key === activeKey }"
          @click="onClick(item.key)"
        >
          <span class="hl-icon">
            <Icon v-if="item.icon" :icon="item.icon" width="18" height="18" />
            <span v-else v-html="item.svg"></span>
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from '@iconify/vue';

const props = defineProps<{
  items?: Array<{ title: string; svg?: string; icon?: string; key?: string }>;
  activeKey?: string;
}>();
const emit = defineEmits<{
  (e: "select", payload: string): void;
  (e: "update:activeKey", payload?: string): void;
}>();

// internal state for uncontrolled usage
const internalActiveKey = ref<string | undefined>(props.activeKey ?? props.items?.[0]?.key);
// expose a single source of truth to the template
const activeKey = computed(() => (props.activeKey !== undefined ? props.activeKey : internalActiveKey.value));

function onClick(key?: string) {
  internalActiveKey.value = key;
  // emit the selected key (string or undefined)
  emit("select", key ?? "");
  emit("update:activeKey", key);
}
</script>

<style scoped>
.hl-sidebar {
  /* position: fixed; */
  right: 0;
  top: 0;
  height: 97vh;
  width: 32px;
  background: transparent;
  border: none;
  /* Remove horizontal padding to prevent visual misalignment with reserved aside width */
  padding: 0;
  z-index: 50;
}
.hl-sidebar-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  height: 100%;
  justify-content: start;
}
.hl-icon-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--component-radius);
  background: transparent;
  border: none;
  cursor: pointer;
}
.hl-icon-btn .hl-icon svg {
  display: block;
}
.hl-icon-btn.active { background: var(--component-bg-color); box-shadow: 0 6px 14px var(--shadow-primary-12); }
.hl-icon { color: var(--muted-color); }
.hl-icon-btn.active .hl-icon { color: var(--primary-color-600); }
.hl-icon-btn.active .hl-icon svg path { stroke: var(--primary-color-600); }
</style>
