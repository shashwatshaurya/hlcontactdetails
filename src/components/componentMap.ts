import { defineComponent, defineAsyncComponent, h } from 'vue'
import type { Component } from 'vue'

const NotesComponent: Component = defineAsyncComponent(() => import('./notes/index.vue'))

const ContactDetailsComponent: Component = defineAsyncComponent(() => import('./contactDetails/index.vue'))
const ConnectionsComponent: Component = defineAsyncComponent(() => import('./connections/index.vue'))
const SidebarComponent: Component = defineAsyncComponent(() => import('./sidebar/index.vue'))

const componentMap: Record<string, Component> = {
  notes: NotesComponent,
  contactDetails: ContactDetailsComponent,
  connections: ConnectionsComponent,
  sidebar: SidebarComponent,
}

export default componentMap


