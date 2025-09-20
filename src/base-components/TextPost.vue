<template>
  <div class="hl-text-post hl-text-post--compose">
    <div class="hl-text-post__left">
      <slot name="left">
        <!-- simple envelope icon -->
        <Icon icon="line-md:email" width="16" height="16" color="var(--primary-color-500)" />
        <!-- <Icon icon="mdi:chevron-down" width="16" height="16" color="var(--muted-700)" /> -->
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
        <Icon
          icon="fluent:sparkle-32-regular"
          width="16"
          height="16"
          :hFlip="true"
          color="var(--purple-700)"
          style="margin-right: 4px"
        />
        <button
          class="hl-text-post__send"
          :disabled="!canSend"
          @click="sendMessage"
          aria-label="Send"
        >
          <Icon icon="prime:send" width="16" height="16" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed, nextTick } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "HlTextPost",
  components: { Icon },
  props: {
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "Type your message..." },
  },
  emits: ["update:modelValue", "send"],
  setup(props, { emit }) {
    const localValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (v) => {
        if (v !== localValue.value) localValue.value = v;
      }
    );

    watch(localValue, (v) => emit("update:modelValue", v));

    const canSend = computed(() => (localValue.value || "").trim().length > 0);

    function sendMessage() {
      const text = (localValue.value || "").trim();
      if (!text) return;
      emit("send", text);
      localValue.value = "";
      // keep textarea height small after clearing
      nextTick(() => {
        const ta = document.querySelector(".hl-text-post__input");
        if (ta && ta instanceof HTMLTextAreaElement) ta.style.height = "auto";
      });
    }

    function onKeydown(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      // auto-resize
      nextTick(() => {
        const ta = e.target;
        if (ta && ta instanceof HTMLTextAreaElement) {
          ta.style.height = "auto";
          ta.style.height = `${Math.min(120, ta.scrollHeight)}px`;
        }
      });
    }

    return { localValue, canSend, sendMessage, onKeydown };
  },
});
</script>

<style scoped>
.hl-text-post--compose {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border-soft);
  border-radius: var(--component-radius);
  padding: 5px 12px;
  background: var(--color-white);
}
.hl-text-post__left {
  display: flex;
  align-items: center;
  align-self: stretch;
  border-right: 1px solid var(--border-soft);
  padding-right: 8px;
  margin-right: 6px;
  /* extend border through parent's vertical padding */
  margin-top: -6px;
  margin-bottom: -6px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.hl-text-post__input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-900);
  background: transparent;
  max-height: 120px;
}
.hl-text-post__right {
  display: flex;
  align-items: center;
  border-left: 1px solid var(--border-soft);
  padding-left: 8px;
  margin-left: 6px;
  /* extend border through parent's vertical padding */
  margin-top: -6px;
  margin-bottom: -6px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.hl-text-post__send {
  border: none;
  background: var(--primary-color);
  color: var(--color-white);
  width: 28px;
  height: 28px;
  border-radius: var(--component-radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.hl-text-post__send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
