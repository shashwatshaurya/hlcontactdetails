<template>
  <div class="contact-header">
    <div class="contact-header__left">
      <span class="contact-header__title">Contact Details</span>
    </div>
    <div class="contact-header__spacer"></div>
    <div v-if="totalContacts" class="contact-header__right">
      <div class="contact-header__pager">
        <span class="contact-header__count">{{ displayIndex }} of {{ totalContacts }}</span>
        <button
          class="icon-btn"
          :disabled="!hasPrev"
          aria-label="Previous contact"
          title="Previous"
          @click="$emit('prev')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="var(--muted-700)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          class="icon-btn"
          :disabled="!hasNext"
          aria-label="Next contact"
          title="Next"
          @click="$emit('next')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="var(--muted-700)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContactDetailsHeader',
  props: {
    totalContacts: { type: Number, default: 0 },
    displayIndex: { type: Number, default: 0 },
    hasPrev: { type: Boolean, default: false },
    hasNext: { type: Boolean, default: false },
  },
  emits: ['prev', 'next'],
})
</script>

<style scoped>
.contact-header {
  padding: 8px 12px;
  margin: -16px -16px 12px -16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.contact-header__left,
.contact-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.contact-header__spacer {
  flex: 1;
}

.contact-header__title {
  font-weight: 600;
  padding-left: 4px;
}
.contact-header__pager {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.contact-header__count {
  color: var(--muted-color);
  font-size: 12px;
  font-weight: 400;
}
.icon-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--component-bg-color);
  cursor: pointer;
}
.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.contact-header__select {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px 8px;
  background: var(--component-bg-color);
}
</style>
