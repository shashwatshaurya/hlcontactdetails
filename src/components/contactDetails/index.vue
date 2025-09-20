<template>
  <div class="contact-details-root">
    <Header
      :totalContacts="totalContacts"
      :displayIndex="displayIndex"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      @prev="toPrev"
      @next="toNext"
    />
    <div class="contact-details">
      <div class="contact-details__block">
        <ContactCard
          v-if="contact"
          :name="fullName"
          :owner="contact.owner"
          :followers="contact.followers"
          :tags="contact.tags"
          :ownerOptions="ownerOptions"
          @call="onCall"
          @update-owner="(val) => (contact.owner = val)"
        />

        <!-- Dynamic sections rendered from contactFields.json using values from contactData.json -->
        <FolderRenderer
          v-if="folders.length"
          :folders="folders"
          :contact="contact"
          :ownerOptions="ownerOptions"
          :isCollapsed="isCollapsed"
          @update-collapsed="setCollapsed"
          @update-contact="setContact"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import ContactCard from "./contactCard.vue";
import Header from "./Header.vue";
import FolderRenderer from "./FolderRenderer.vue";
import { fetchContactData, fetchContactFields } from "@/services/contact";

export default defineComponent({
  name: "ContactDetails",
  components: { ContactCard, Header, FolderRenderer },
  setup() {
    const store = useStore();
    const contact = ref(null);
    const contacts = ref([]);
    const selectedId = ref(null);
    const folders = ref([]);
    const fullName = computed(() => {
      if (!contact.value) return "";
      const first = contact.value.firstName ?? "";
      const last = contact.value.lastName ?? "";
      return `${first} ${last}`.trim();
    });

    // Track collapsed state for each section
    const collapsedMap = ref({});
    function isCollapsed(idx) {
      return !!collapsedMap.value[idx];
    }
    function setCollapsed(idx, value) {
      collapsedMap.value[idx] = !!value;
    }

    // Preload from store if available
    if (store.state.contactData?.formData) {
      contact.value = store.state.contactData.formData;
      selectedId.value = store.state.contactData.formData?.id ?? null;
    }

    onMounted(async () => {
      const [data, fields] = await Promise.all([
        fetchContactData(),
        fetchContactFields(),
      ]);
      const list = Array.isArray(data?.contacts) ? data.contacts : [];
      contacts.value = list;

      // Initialize selection
      if (!contact.value) {
        contact.value = list[0] ?? null;
      }
      selectedId.value = contact.value?.id ?? list[0]?.id ?? null;
      store.commit("contactData/setFormData", contact.value);
      store.dispatch("contactFields/setOwnerOptions", fields);
      // Some configs may have a typo "fileds"; support both
      const normalized = (fields?.folders ?? []).map((f) => ({
        name: f.name,
        fields: f.fields ?? f.fileds ?? [],
      }));
      folders.value = normalized;
    });

    // Keep Vuex store in sync with local contact edits
    watch(
      contact,
      (val) => {
        store.commit("contactData/setFormData", val);
      },
      { deep: true }
    );

    // Navigation helpers
    const currentIndex = computed(() => {
      if (!selectedId.value) return 0;
      return Math.max(
        0,
        contacts.value.findIndex((c) => c.id === selectedId.value)
      );
    });
    const totalContacts = computed(() => contacts.value.length);
    const displayIndex = computed(() => currentIndex.value + 1);
    const hasPrev = computed(() => currentIndex.value > 0);
    const hasNext = computed(
      () => currentIndex.value < contacts.value.length - 1
    );

    function setByIndex(index) {
      if (index < 0 || index >= contacts.value.length) return;
      const next = contacts.value[index];
      selectedId.value = next?.id ?? null;
      contact.value = next ?? null;
    }
    function toPrev() {
      if (hasPrev.value) setByIndex(currentIndex.value - 1);
    }
    function toNext() {
      if (hasNext.value) setByIndex(currentIndex.value + 1);
    }
    function onSelect() {
      const idx = contacts.value.findIndex((c) => c.id === selectedId.value);
      setByIndex(idx === -1 ? 0 : idx);
    }

    function onCall() {
      // placeholder for call click
      console.log("Call clicked");
    }

    function setContact(val) {
      contact.value = val;
    }

    const ownerOptions = computed(
      () => store.getters["contactFields/ownerOptions"] || []
    );

    return {
      contact,
      contacts,
      selectedId,
      fullName,
      folders,
      ownerOptions,
      onCall,
      isCollapsed,
      setCollapsed,
      totalContacts,
      displayIndex,
      hasPrev,
      hasNext,
      toPrev,
      toNext,
      onSelect,
      setContact,
    };
  },
});
</script>

<style scoped>
.contact-details-root {
  border: 1px solid var(--border-color);
  border-radius: var(--root-container-radius);
  padding: 16px;
  background: var(--component-bg-color);
  height: 97vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px var(--shadow-06);
}

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

.contact-details {
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  overflow: auto;
  /* Hide scrollbar but keep scroll functionality */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.contact-details::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.contact-details__block {
  width: 320px;
  background: var(--component-bg-color);
  border-radius: var(--component-radius);
  box-sizing: border-box;
  overflow: visible;
  /* padding: 16px; */
}

/* :deep(.hl-card__header) {
  border: none;
} */

.contact-details__sections {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fields-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.fields-grid,
.field,
.field__value {
  min-width: 0;
}
.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  /* Remove extra space below caused by parent grid row gap */
  margin-bottom: -16px;
}
.name-row > .field {
  min-width: 0;
}
.field__label {
  color: var(--muted-color);
  margin-bottom: 6px;
  font-size: 14px;
}
.field__value {
  word-break: break-word;
  overflow-x: hidden;
  font-size: 18px;
}
.field__value .hl-input-control,
.field__value .field__control {
  font-size: inherit;
}
.field__control {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--component-bg-color);
}

.folder-header-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
}
.folder-icon {
  display: inline-block;
}
.chevron {
  transition: transform 0.2s ease;
}
.chevron--down {
  transform: rotate(180deg);
}

.contact-header__title {
  font-weight: 600;
  padding-left: 4px;
}
.contact-header__controls {
  display: inline-flex;
  gap: 8px;
  align-items: center;
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
  /* border: 1px solid var(--border-color); */
  /* border-radius: 6px; */
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
