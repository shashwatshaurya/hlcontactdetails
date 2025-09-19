<template>
  <HlCard :header="header" class="connection-card">
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
      <HlButton @click="$emit('reply')">Reply</HlButton>
    </div>
  </HlCard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HlAvatar from "../../base-components/Avatar.vue";
import HlButton from "../../base-components/Button.vue";
import HlCard from "../../base-components/Card.vue";
import HlTabs from "../../base-components/Tags.vue";

export default defineComponent({
  name: "ConnectionCard",
  components: { HlAvatar, HlButton, HlCard, HlTabs },
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
  border-radius: var(--card-radius);
  padding: 16px;
  background: var(--component-bg-color); */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  /* max-width: 760px; */
  /* overflow: hidden; */
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
</style>
