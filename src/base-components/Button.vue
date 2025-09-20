<template>
  <button
    :class="['hl-button', `hl-button--${variant}`, `hl-button--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HlButton",
  props: {
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    disabled: { type: Boolean, default: false },
  },
});
</script>

<style scoped>
.hl-button {
  border: none;
  border-radius: var(--component-radius);
  cursor: pointer;
  font-weight: 600;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.12s ease;
}
.hl-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.hl-button--primary { background: var(--primary-color); color: var(--color-white); }
.hl-button--secondary { background: var(--primary-bg-soft); color: var(--primary-color); }
.hl-button--md {
  font-size: 14px;
}
.hl-button--sm {
  font-size: 12px;
  padding: 6px 10px;
}
</style>
