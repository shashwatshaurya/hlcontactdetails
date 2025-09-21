<template>
  <main>
    <section class="layout-root">
      <aside v-if="sidebarItems.length > 0" class="layout-sidebar">
        <Sidebar
          :items="sidebarItems"
          :active-key="activeSidebarKey || ''"
          @update:active-key="setActiveKey"
          @select="onSelect"
        />
      </aside>

      <section class="layout-content" :style="displayContentStyle">
        <component :is="item.comp" v-for="item in content" v-bind="item.props" :key="item.key" />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import renderLayout from '@/utils/renderLayout'
import Sidebar from '@/components/sidebar/index.vue'

const route = useRoute()
const layout = route.meta.layout ?? undefined

const { content: initialContent, sidebar, contentStyle } = renderLayout(layout)
const content = ref(initialContent)
const activeSidebarKey = ref<string | undefined>(undefined)
const displayContentStyle = ref(contentStyle ?? {})

// map icon keys to Iconify icon names or fallbacks
const iconMap = {
  'icon-note': { icon: 'streamline-ultimate:notes-book' },
  'icon-editor': { icon: 'mdi:pencil-outline' },
} as const

const defaultIcon = iconMap['icon-note']

// items passed to the Sidebar component (title + svg)
type SidebarItem = { title: string; svg?: string; icon?: string; key?: string }
const sidebarItems: SidebarItem[] = sidebar.map((it) => {
  const iconKey = (it.icon ?? '') as keyof typeof iconMap
  const mapped = iconMap[iconKey] ?? defaultIcon
  return {
    icon: mapped.icon,
    key: it.key,
    title: it.title ?? '',
  }
})

function onSelect(selectedKey: string) {
  const selected = sidebar.find((it) => it.key === selectedKey)
  if (!selected) return
  const Comp = selected.comp ?? (() => h('div', `Missing component`))
  const baseProps = selected.componentProps ? selected.componentProps : {}
  const key = `selected-${selectedKey}-${Date.now()}`
  const props = {
    ...baseProps,
    onClose: () => {
      content.value = content.value.filter((it) => it.key !== key)
      // clear active state in sidebar when panel is closed
      activeSidebarKey.value = undefined
    },
  }
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
  padding: 0.8rem 0.5rem 0.8rem 0.8rem;
}
.layout-root {
  display: flex;
  gap: 0.5rem;
  flex-direction: row-reverse;
}
.layout-sidebar {
  /* width: 260px; */
  width: 32px;
}
.layout-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
