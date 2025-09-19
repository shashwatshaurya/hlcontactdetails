<template>
  <div :class="['hl-avatar', `hl-avatar--${size}`]" :style="avatarStyle">
    <span class="hl-avatar__initials">{{ initials }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "HlAvatar",
  props: {
    name: { type: String, required: true },
    size: { type: String, default: "md" },
    backgroundColor: { type: String, default: "#e0e7ff" },
  },
  setup(props) {
    const initials = computed(() => {
      if (!props.name) return "";
      const parts = props.name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    });

    const avatarStyle = computed(() => ({ background: props.backgroundColor }));

    return { initials, avatarStyle };
  },
});
</script>

<style scoped>
.hl-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #0f172a;
  font-weight: 600;
}
.hl-avatar--md {
  width: 40px;
  height: 40px;
  font-size: 14px;
}
.hl-avatar--xs {
  width: 22px;
  height: 22px;
  font-size: 10px;
}
.hl-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: 12px;
}
.hl-avatar__initials {
  user-select: none;
}
</style>
