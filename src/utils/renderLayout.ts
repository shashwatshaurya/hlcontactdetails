import { h, type Component } from 'vue'
import componentMap from '@/components/componentMap'
import defaultLayout from '@/configs/jsonConfigs/layout.json'

export type RenderItem = { comp: Component; props?: Record<string, any>; componentProps?: Record<string, any>; icon?: string; title?: string; key: string }

export function renderLayout(layout: any = defaultLayout): { sidebar: RenderItem[]; content: RenderItem[]; contentStyle?: Record<string, any> } {
  const sidebarItems = layout?.layout?.sidebar ?? []
  const contentChildren = layout?.layout?.content?.children ?? []
  const contentStyle = layout?.layout?.content?.style ?? {}

  const sidebar: RenderItem[] = sidebarItems.map((item: any, idx: number) => {
    const Comp = componentMap[item.name]
    const props = item.props ?? {}
    const componentProps = item.componentProps ?? {}
    const icon = item.icon ?? ''
    const title = item.title ?? item.name
    if (Comp) return { comp: Comp as Component, props, componentProps, icon, title, key: `sidebar-${idx}` }
    return { comp: () => h('div', `Missing component: ${item.name}`), props: {}, key: `sidebar-${idx}` }
  })

  const content: RenderItem[] = contentChildren.map((child: any, idx: number) => {
    const Comp = componentMap[child.name]
    const props = child.props ?? {}
    if (Comp) return { comp: Comp as Component, props, key: `content-${idx}` }
    return { comp: () => h('div', `Missing component: ${child.name}`), props: {}, key: `content-${idx}` }
  })

  return { sidebar, content, contentStyle }
}

export default renderLayout


