<template>
  <HlCard>
    <div class="contact-card__header">
      <div class="contact-card__title">
        <HlAvatar :name="name" />
        <div class="contact-card__name">{{ name }}</div>
      </div>

      <button
        class="contact-card__call"
        @click="$emit('call')"
        aria-label="call contact"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.31 1.76.57 2.6a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.57-1.23a2 2 0 0 1 2.11-.45c.84.26 1.71.45 2.6.57A2 2 0 0 1 22 16.92z"
            fill="#059669"
          />
        </svg>
      </button>
    </div>

    <div class="contact-card__meta">
      <div class="contact-card__field">
        <div class="contact-card__label">Owner</div>
        <HlSelect
          class="contact-card__owner"
          :options="ownerOptions"
          :modelValue="owner"
          @update:modelValue="$emit('update-owner', $event)"
          placeholder="Select owner"
          variant="avatar"
        />
      </div>

      <div class="contact-card__field">
        <div class="contact-card__label">Followers</div>
        <div class="contact-card__followers">
          <div
            v-if="followers && followers.length"
            ref="followersWrap"
            class="contact-card__followers-pill-wrap"
          >
            <div
              class="contact-card__followers-pill"
              role="button"
              aria-label="Show followers"
              tabindex="0"
              @click.stop="toggleFollowers"
              @keydown.enter.prevent="toggleFollowers"
              @keydown.space.prevent="toggleFollowers"
            >
              <div class="pill-avatars">
                <div
                  v-for="(f, i) in followers.slice(0, 2)"
                  :key="`pill-${i}`"
                  class="pill-avatar"
                  :style="{ zIndex: 2 - i }"
                >
                  <HlAvatar :name="f" size="xs" />
                </div>
              </div>
              <svg
                class="pill-chevron"
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
            <div v-if="isFollowersOpen" class="contact-card__followers-menu" @click.stop>
              <div
                v-for="(f, i) in followers"
                :key="`menu-${i}`"
                class="followers-menu__item"
              >
                <HlAvatar :name="f" size="xs" />
                <span class="followers-menu__label">{{ f }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-card__tags">
      <div class="contact-card__label">Tags</div>
      <HlTags
        :tabs="tags"
        :maxVisible="3"
        @add="$emit('add-tag')"
        @remove="$emit('remove-tag', $event)"
        @show-overflow="$emit('show-tags')"
      />
    </div>
  </HlCard>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import HlCard from "../../base-components/Card.vue";
import HlAvatar from "../../base-components/Avatar.vue";
import HlSelect from "../../base-components/Select.vue";
import HlTags from "../../base-components/Tags.vue";

export default defineComponent({
  name: "ContactCard",
  components: { HlCard, HlAvatar, HlTags, HlSelect },
  props: {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    followers: { type: Array, default: () => [] },
    tags: { type: Array, default: () => [] },
    ownerOptions: { type: Array, default: () => [] },
  },
  emits: ["call", "add-tag", "remove-tag", "show-tags", "update-owner"],
  setup() {
    const isFollowersOpen = ref(false);
    const followersWrap = ref(null);

    function toggleFollowers() {
      isFollowersOpen.value = !isFollowersOpen.value;
    }

    function onClickOutside(e) {
      const el = followersWrap.value;
      if (!el) return;
      if (!el.contains(e.target)) {
        isFollowersOpen.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener("click", onClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", onClickOutside);
    });

    return { isFollowersOpen, followersWrap, toggleFollowers };
  },
});
</script>

<style scoped>
.contact-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.contact-card__title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.contact-card__name {
  font-weight: 600;
  font-size: 16px;
}
.contact-card__call {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.contact-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
.contact-card__label {
  color: var(--muted-color);
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
}
.contact-card__owner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 9999px;
  background: var(--component-bg-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
}
.contact-card__owner-name {
  font-weight: 500;
}

.contact-card__followers {
  display: flex;
  align-items: center;
}
.contact-card__followers-pill-wrap {
  position: relative;
}
.contact-card__follower {
  margin-left: -8px;
}
.contact-card__follower:first-child {
  margin-left: 0;
}

.contact-card__followers-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border-color);
  background: var(--component-bg-color);
  border-radius: 9999px;
  padding: 2px 6px 2px 4px;
}
.pill-avatars {
  display: inline-flex;
  align-items: center;
}
.pill-avatar {
  margin-left: -8px;
}
.pill-avatar:first-child {
  margin-left: 0;
}
.pill-chevron {
  flex: 0 0 auto;
}

.contact-card__followers-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: var(--component-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  min-width: 120px;
  z-index: 30;
  padding: 6px 0;
}
.followers-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
}
.followers-menu__item:hover {
  background: #f3f4f6;
}
.followers-menu__label {
  font-size: 12px;
}

.contact-card__tags {
  margin-top: 16px;
}
:deep(.hl-card__body) {
  margin-top: 0;
}
</style>
