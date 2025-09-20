<template>
  <div
    :class="[
      'hl-input-wrap',
      isTextarea ? 'hl-input-wrap--textarea' : 'hl-input-wrap--line',
      $attrs.class,
    ]"
  >
    <slot name="prefix" />
    <input
      v-if="!isTextarea"
      class="hl-input-control"
      :type="resolvedType"
      :placeholder="placeholder"
      :value="inputValue"
      @input="onInput"
    />
    <textarea
      v-else
      ref="textareaRef"
      class="hl-input-control hl-input-control--textarea"
      :placeholder="placeholder"
      :value="inputValue"
      rows="1"
      @input="onInput"
    />
    <slot name="suffix" />
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted, nextTick } from 'vue'

export default defineComponent({
  name: 'HlInput',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, Array], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    isMulti: { type: Boolean, default: false },
    textarea: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isTextarea = computed(() => props.textarea === true)
    const textareaRef = ref(null)

    const resolvedType = computed(() => {
      if (props.isMulti) return 'text'
      const t = String(props.type || 'text').toLowerCase()
      if (t === 'email') return 'email'
      if (t === 'phone') return 'tel'
      return 'text'
    })

    const inputValue = computed(() => {
      if (Array.isArray(props.modelValue)) return props.modelValue.join(', ')
      if (props.modelValue === null || props.modelValue === undefined) return ''
      return String(props.modelValue)
    })

    function onInput(e) {
      const raw = e?.target?.value ?? ''
      if (props.isMulti) {
        const parts = raw
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
        emit('update:modelValue', parts)
        nextTick(() => autoResize())
        return
      }
      emit('update:modelValue', raw)
      nextTick(() => autoResize())
    }

    function autoResize() {
      const el = textareaRef.value
      if (!el) return
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }

    onMounted(() => nextTick(() => autoResize()))
    watch(() => props.modelValue, () => nextTick(() => autoResize()))

    return { resolvedType, inputValue, onInput, isTextarea, textareaRef }
  },
})
</script>

<style scoped>
.hl-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.hl-input-wrap--line {
  border-bottom: 1px solid transparent;
  padding: 2px 0;
}
.hl-input-wrap--line:focus-within { border-bottom-color: var(--primary-color); }

.hl-input-wrap--textarea {
  border-bottom: 1px solid transparent;
  padding: 6px 0;
  background: var(--component-bg-color);
}
.hl-input-wrap--textarea:focus-within { border-bottom-color: var(--primary-color); }

.hl-input-control {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 6px 0;
  color: var(--text-color);
  outline: none;
  box-shadow: none;
}
.hl-input-control:focus { outline: none; box-shadow: none; }
.hl-input-control:focus-visible { outline: none; box-shadow: none; }
/* Explicitly disable WebKit focus ring */
.hl-input-control::-webkit-focus-ring-color { outline: none; }

.hl-input-control--textarea {
  padding: 0;
  resize: none;
  min-height: 0;
  height: auto;
  overflow: hidden;
  outline: none;
  box-shadow: none;
  border: none;
}
.hl-input-control--textarea:focus { outline: none; box-shadow: none; }
.hl-input-control--textarea:focus-visible { outline: none; box-shadow: none; }
</style>

