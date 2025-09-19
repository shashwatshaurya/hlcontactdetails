<template>
  <div class="hl-card" :class="{ 'hl-card--collapsed': isCollapsed }">
    <div
      v-if="header || $slots.left || $slots.right"
      class="hl-card__header"
      :class="{ 'hl-card__header--clickable': collapsible && headerClickable }"
      @click="onHeaderClick"
      v-bind="headerAttrs"
      @keydown.enter.space.prevent="onHeaderClick"
    >
      <div class="hl-card__header-left">
        <slot name="left">{{ header }}</slot>
      </div>
      <div class="hl-card__spacer"></div>
      <div class="hl-card__header-right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="hl-card__body" v-show="!isCollapsed">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'HlCard',
  props: {
    header: { type: String, default: '' },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: undefined },
    defaultCollapsed: { type: Boolean, default: false },
    headerClickable: { type: Boolean, default: true }
  },
  emits: ['update:collapsed', 'toggle'],
  setup(props, { emit }) {
    const internalCollapsed = ref(!!props.defaultCollapsed)
    const isControlled = computed(() => props.collapsed !== undefined)
    const isCollapsed = computed(() => (isControlled.value ? !!props.collapsed : internalCollapsed.value))

    function onHeaderClick() {
      if (!props.collapsible || !props.headerClickable) return
      const next = !isCollapsed.value
      if (!isControlled.value) internalCollapsed.value = next
      emit('update:collapsed', next)
      emit('toggle', next)
    }

    const headerAttrs = computed(() => {
      if (!(props.collapsible && props.headerClickable)) return {}
      return { role: 'button', 'aria-expanded': String(!isCollapsed.value), tabindex: 0 }
    })

    return { isCollapsed, onHeaderClick, headerAttrs }
  }
})
</script>

<style scoped>
.hl-card {
  border: 1px solid var(--border-color);
  border-radius: var(--card-radius);
  padding: 16px;
  background: var(--component-bg-color);
}
.hl-card__header {
  font-weight: 600;
  padding: 8px 12px;
  border-bottom: 1px solid var(--header-border-color);
  margin: -16px -16px 12px -16px;
  border-top-left-radius: var(--card-radius);
  border-top-right-radius: var(--card-radius);
  display: flex;
  align-items: center;
  gap: 8px;
}
.hl-card__header--clickable { cursor: pointer; user-select: none }
.hl-card__header-left { display: flex; align-items: center; gap: 8px }
.hl-card__header-right { display: flex; align-items: center; gap: 8px }
.hl-card__spacer { flex: 1 }
.hl-card__body { margin-top: 8px }
.hl-card--collapsed { padding-bottom: 0 }
.hl-card--collapsed .hl-card__header { margin-bottom: 0; border-bottom: 0 }
</style>


