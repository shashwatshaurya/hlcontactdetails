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
          <span class="hl-icon" v-html="item.svg"></span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  items?: Array<{ title: string; svg: string; key?: string }>;
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
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 72px;
  background: transparent;
  border: none;
  padding: 12px;
  z-index: 50;
}
.hl-sidebar-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  height: 100%;
  justify-content: start;
}
.hl-icon-btn {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.hl-icon-btn .hl-icon svg {
  display: block;
}
.hl-icon-btn.active {
  background: #fff;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.12);
}
.hl-icon-btn.active .hl-icon svg path {
  stroke: #2563eb;
}
</style>
