<template>
  <div class="connections-root">
    <div class="connections-header">
      <div class="connections-header__left">
        <Icon :icon="'bx:conversation'" width="18" height="18" />
      </div>
      <div class="connections-header__title">Conversations</div>
    </div>
    <div class="connections-list">
      <ConnectionCard
        v-for="(conn, idx) in items"
        :key="`conn-${idx}`"
        :name="conn.name"
        :title="conn.title"
        :header="conn.header"
        :message="conn.message"
        :time-ago="conn.timeAgo"
      />
    </div>

    <div class="connections-composer">
      <TextPost v-model="message" @send="sendMessage" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Icon } from '@iconify/vue'
import ConnectionCard from './ConnectionCard.vue'
import { HlTextPost } from '@/base-components'
import { CONNECTIONS_DUMMY } from './constants'

export default defineComponent({
  name: 'ConnectionsList',
  components: { ConnectionCard, TextPost: HlTextPost, Icon },
  setup() {
    const message = ref('')
    const store = useStore()

    const fullName = computed(() => {
      const formData = store.state.contactData?.formData || null
      const first = formData?.firstName ?? ''
      const last = formData?.lastName ?? ''
      const joined = `${first} ${last}`.trim()
      return joined || CONNECTIONS_DUMMY.name
    })

    const sendMessage = (message) => {
      console.log(message)
    }
    return {
      items: computed(() =>
        Array.from({ length: 3 }, () => ({
          ...CONNECTIONS_DUMMY,
          name: fullName.value,
        }))
      ),
      message,
      sendMessage,
    }
  },
})
</script>

<style scoped>
.connections-root {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--component-bg-color);
  padding: 1rem;
  border-radius: var(--root-container-radius);
  max-height: 97vh;
  box-shadow: 0 2px 8px var(--shadow-06);
}
.connections-root :deep(.hl-card__header) {
  font-weight: 500;
  font-size: calc(var(--font-size-large) - 2px);
}

.connections-header {
  padding: 8px 12px;
  margin: -13px -16px 2px -12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.connections-header__title {
  font-weight: 600;
  font-size: var(--font-size-large);
  flex: 1;
  padding: 0;
}
.connections-header__left {
  display: flex;
  align-items: center;
}
.connections-header__title-icon {
  color: var(--muted-color);
}
.connections-list {
  height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* Hide scrollbar but keep scroll functionality */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.connections-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
.connections-composer {
  position: sticky;
  bottom: 0;
  background: var(--component-bg-color);
}
</style>
