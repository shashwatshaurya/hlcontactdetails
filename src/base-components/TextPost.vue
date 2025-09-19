<template>
  <div class="hl-text-post hl-text-post--compose">
    <div class="hl-text-post__left">
      <slot name="left">
        <!-- simple envelope icon -->
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 2h18v12H1z" stroke="#cbd5e1" stroke-width="1.2" fill="#fff"/>
          <path d="M1 2l9 7 9-7" stroke="#cbd5e1" stroke-width="1.2" fill="none"/>
        </svg>
      </slot>
    </div>

    <textarea
      class="hl-text-post__input"
      v-model="localValue"
      :placeholder="placeholder"
      @keydown="onKeydown"
      rows="1"
    />

    <div class="hl-text-post__right">
      <slot name="actions">
        <button class="hl-text-post__send" :disabled="!canSend" @click="sendMessage" aria-label="Send">
          <!-- paper plane icon -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21l20-9L2 3l4 7 10 2-10 2-4 7z" fill="currentColor" />
          </svg>
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed, nextTick } from 'vue'

export default defineComponent({
  name: 'HlTextPost',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Type your message...' },
  },
  emits: ['update:modelValue', 'send'],
  setup(props, { emit }) {
    const localValue = ref(props.modelValue)

    watch(() => props.modelValue, (v) => {
      if (v !== localValue.value) localValue.value = v
    })

    watch(localValue, (v) => emit('update:modelValue', v))

    const canSend = computed(() => (localValue.value || '').trim().length > 0)

    function sendMessage() {
      const text = (localValue.value || '').trim()
      if (!text) return
      emit('send', text)
      localValue.value = ''
      // keep textarea height small after clearing
      nextTick(() => {
        const ta = document.querySelector('.hl-text-post__input')
        if (ta && ta instanceof HTMLTextAreaElement) ta.style.height = 'auto'
      })
    }

    function onKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
      // auto-resize
      nextTick(() => {
        const ta = e.target
        if (ta && ta instanceof HTMLTextAreaElement) {
          ta.style.height = 'auto'
          ta.style.height = `${Math.min(120, ta.scrollHeight)}px`
        }
      })
    }

    return { localValue, canSend, sendMessage, onKeydown }
  }
})
</script>

<style scoped>
.hl-text-post--compose {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e6edf6;
  border-radius: 12px;
  padding: 8px 12px;
  background: white;
}
.hl-text-post__left { display:flex; align-items:center; }
.hl-text-post__input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  color: #0f172a;
  background: transparent;
  max-height: 120px;
}
.hl-text-post__right { display:flex; align-items:center; }
.hl-text-post__send {
  border: none;
  background: #1a73e8;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.hl-text-post__send:disabled { opacity: 0.5; cursor: not-allowed }
</style>


