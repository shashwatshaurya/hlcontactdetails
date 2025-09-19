<template>
  <div
    ref="rootRef"
    :class="[
      'hl-select',
      `hl-select--${variant}`,
      { 'hl-select--open': isOpen },
    ]"
    @click="toggleOpen"
  >
    <div
      v-if="variant === 'input'"
      class="hl-select__display"
      @click.stop="toggleOpen"
    >
      <span class="hl-select__text">{{ selectedLabel || placeholder }}</span>
      <svg
        class="hl-select__chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="#6B7280"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div v-else class="hl-select__display hl-select__display--avatar">
      <HlAvatar :name="selectedLabel || placeholder" size="xs" />
      <div class="hl-select__avatar-text">
        <span class="hl-select__avatar-name">{{
          selectedLabel || placeholder
        }}</span>
      </div>
      <svg
        class="hl-select__chevron"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="#6B7280"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div v-if="isOpen" class="hl-select__menu" @click.stop>
      <div
        v-for="opt in normalizedOptions"
        :key="opt.valueKey"
        class="hl-select__option"
        :class="{ 'is-selected': opt.value === modelValue }"
        @click="onSelect(opt.value)"
      >
        <template v-if="variant === 'avatar'">
          <HlAvatar :name="opt.label" size="xs" />
          <span class="hl-select__option-label">{{ opt.label }}</span>
        </template>
        <template v-else>
          <span class="hl-select__option-label">{{ opt.label }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import HlAvatar from "./Avatar.vue";

export default defineComponent({
  name: "HlSelect",
  components: { HlAvatar },
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: "" },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "" },
    variant: { type: String, default: "input" }, // 'input' | 'avatar'
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const rootRef = ref(null);

    const normalizedOptions = computed(() => {
      return (props.options || []).map((o, idx) => {
        if (o && typeof o === "object") {
          const label = String(o.label ?? o.value ?? "");
          const value = o.value ?? label;
          return { label, value, valueKey: `${idx}-${value}` };
        }
        const label = String(o ?? "");
        return { label, value: label, valueKey: `${idx}-${label}` };
      });
    });

    const selectedLabel = computed(() => {
      const found = normalizedOptions.value.find(
        (o) => o.value === props.modelValue
      );
      return found?.label ?? "";
    });

    function onSelect(value) {
      emit("update:modelValue", value);
      isOpen.value = false;
    }

    function toggleOpen() {
      isOpen.value = !isOpen.value;
    }

    function onClickOutside(e) {
      const el = rootRef.value;
      if (!el) return;
      if (!el.contains(e.target)) {
        isOpen.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });

    return {
      isOpen,
      rootRef,
      normalizedOptions,
      selectedLabel,
      onSelect,
      toggleOpen,
    };
  },
});
</script>

<style scoped>
.hl-select {
  position: relative;
  width: 100%;
}

.hl-select__display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}
.hl-select__text {
  color: var(--text-color);
  font-weight: 500;
}
.hl-select__chevron {
  flex: 0 0 auto;
}

/* Variant: input */
.hl-select--input {
  border: none;
  border-radius: 8px;
  padding: 6px 8px 6px 0;
  background: var(--component-bg-color);
  cursor: pointer;
  font-size: 14px;
}
.hl-select--input .hl-select__text {
  font-weight: 400;
}
.hl-select--input .hl-select__chevron {
  display: none;
}
.hl-select--input:focus-within {
  border-color: var(--primary-color, #3b82f6);
}

/* Variant: avatar */
.hl-select--avatar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px;
  border-radius: 9999px;
  background: var(--component-bg-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  width: fit-content;
  flex: 0 0 auto;
}
.hl-select__display--avatar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: auto;
  justify-content: flex-start;
  white-space: nowrap;
}
.hl-select__avatar-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.hl-select__avatar-name {
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
}
::deep(.hl-select__display--avatar .hl-avatar) {
  border-radius: 50%;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
}

/* Menu */
.hl-select__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--component-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  z-index: 20;
  max-height: 220px;
  overflow: auto;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.hl-select__option {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.hl-select__option:hover {
  background: #f3f4f6;
}
.hl-select__option.is-selected {
  background: #eef2ff;
}
.hl-select__option-label {
  color: var(--text-color);
  font-size: 12px;
  font-weight: 500;
}
</style>
