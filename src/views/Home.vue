<template>
  <main>
    <section class="layout-root">
      <aside v-if="sidebarItems.length > 0" class="layout-sidebar">
        <Sidebar :items="sidebarItems" :activeKey="activeSidebarKey || ''" @update:activeKey="setActiveKey" @select="onSelect" />
      </aside>

      <section class="layout-content" :style="displayContentStyle">
        <component
          v-for="item in content"
          :is="item.comp"
          v-bind="item.props"
          :key="item.key"
        />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import renderLayout from '../utils/renderLayout'
import Sidebar from '../components/sidebar/index.vue'

const route = useRoute()
const layout = route.meta.layout ?? undefined

const { content: initialContent, sidebar, contentStyle } = renderLayout(layout)
const content = ref(initialContent)
const activeSidebarKey = ref<string | undefined>(undefined)
const displayContentStyle = ref(contentStyle ?? {})
console.log(displayContentStyle.value)

// map icon keys to svg strings (fallbacks provided)
const iconMap = {
  'icon-note': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'icon-editor': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}

const defaultSvg = iconMap['icon-note']

// items passed to the Sidebar component (title + svg)
type SidebarItem = { title: string; svg: string; key?: string }
const sidebarItems: SidebarItem[] = sidebar.map((it) => {
  const iconKey = (it.icon ?? '') as keyof typeof iconMap
  const svg = iconMap[iconKey] ?? defaultSvg
  return {
    svg,
    key: it.key,
    title: it.title ?? ''
  }
})

function onSelect(selectedKey: string) {
  const selected = sidebar.find((it) => it.key === selectedKey)
  if (!selected) return
  const Comp = selected.comp ?? (() => h('div', `Missing component`))
  const baseProps = selected.componentProps ? selected.componentProps : {}
  const key = `selected-${selectedKey}-${Date.now()}`
  const props = { ...baseProps, onClose: () => {
    content.value = content.value.filter((it) => it.key !== key)
    // clear active state in sidebar when panel is closed
    activeSidebarKey.value = undefined
  }}
  // Append the selected component to the right side of existing content
  content.value = [...initialContent, { comp: Comp, props, key }]
  // set active state in sidebar
  activeSidebarKey.value = selectedKey
}

function setActiveKey(val?: string) {
  activeSidebarKey.value = val
}
</script>

<style scoped>
main {
  padding: 0.8rem;
}
.layout-root {
  display: flex;
  gap: 1rem;
  flex-direction: row-reverse;
}
.layout-sidebar {
  /* width: 260px; */
  width: 42px;
}
.layout-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
