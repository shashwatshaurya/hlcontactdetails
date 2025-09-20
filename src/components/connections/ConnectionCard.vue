<template>
  <HlCard class="connection-card">
    <!-- @vue-ignore next-line: Volar can't infer slots from JS component -->
    <template #left>
      <span class="connection-card__subject">{{ header }}</span>
    </template>

    <!-- @vue-ignore next-line: Volar can't infer slots from JS component -->
    <template #right>
      <button class="icon-btn" aria-label="Open in new">
        <Icon icon="mdi:arrow-top-right" width="18" height="18" />
      </button>
      <button class="icon-btn" aria-label="Star">
        <Icon icon="mdi:star" width="18" height="18" :style="{ color: 'var(--amber-700)' }" />
      </button>
      <button class="icon-btn" aria-label="Reply" @click="$emit('reply')">
        <Icon icon="mdi:reply" width="18" height="18" />
      </button>
      <button class="icon-btn" aria-label="More">
        <Icon icon="mdi:dots-vertical" width="18" height="18" />
      </button>
    </template>

    <div class="connection-card__header">
      <HlAvatar :name="name" />
      <div class="connection-card__meta">
        <div class="connection-card__name">{{ name }}</div>
        <div class="connection-card__title">{{ title }}</div>
      </div>
      <div class="connection-card__time">{{ timeAgo }}</div>
    </div>

    <div class="connection-card__body">
      <p class="connection-card__greeting">Hey {{ name.split(" ")[0] }},</p>
      <p class="connection-card__message">{{ message }}</p>
      <a href="#" class="connection-card__track">Track Your Order</a>
    </div>

    <div class="connection-card__actions">
      <HlButton @click="$emit('reply')">
        <Icon class="connection-card__reply-icon" icon="mdi:reply" width="18" height="18" />
        <span>Reply</span>
      </HlButton>
    </div>
  </HlCard>
</template>

<script lang="ts">
// @vue-ignore-next-line - using named slots 'left' and 'right' provided by HlCard
import { defineComponent } from "vue";
import { Icon } from '@iconify/vue'
import { HlAvatar, HlButton, HlCard } from "@/base-components";

export default defineComponent({
  name: "ConnectionCard",
  components: { HlAvatar, HlButton, HlCard, Icon },
  props: {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    header: { type: String, default: "" },
    message: { type: String, default: "" },
    timeAgo: { type: String, default: "" },
  },
});
</script>

<style scoped>
.connection-card {
  /* border: 1px solid var(--border-color);
  border-radius: var(--component-radius);
  padding: 16px;
  background: var(--component-bg-color); */
  box-shadow: 0 2px 8px var(--shadow-06);
  /* max-width: 760px; */
  /* overflow: hidden; */
}

.connection-card__subject {
  font-weight: 600;
}

.connection-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.connection-card__meta {
  flex: 1;
}
.connection-card__name {
  font-weight: 400;
  font-size: calc(var(--font-size-large) - 2px);
}
.connection-card__title {
  font-size: var(--font-size-small);
  color: var(--muted-color);
}
.connection-card__time {
  color: var(--muted-color);
  font-size: var(--font-size-small);
}

.connection-card__body {
  margin-top: 12px;
  font-size: calc(var(--font-size-large) - 2px);
  font-weight: 400;
}
.connection-card__greeting {
  margin: 0 0 8px 0;
}
.connection-card__message {
  margin: 0 0 12px 0;
  color: var(--text-color);
}
.connection-card__track {
  color: var(--link-color);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 12px;
}

.connection-card__actions {
  margin-top: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.connection-card__reply-icon { margin-right: 6px; }
</style>
