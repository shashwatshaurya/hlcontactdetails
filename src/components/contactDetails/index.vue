<template>
  <div class="contact-details-root">
    <div class="contact-header">
      <div class="contact-header__left">
        <span class="contact-header__title">Contact Details</span>
      </div>
      <div class="contact-header__spacer"></div>
      <div class="contact-header__right" v-if="totalContacts">
        <div class="contact-header__pager">
          <span class="contact-header__count"
            >{{ displayIndex }} of {{ totalContacts }}</span
          >
          <button
            class="icon-btn"
            :disabled="!hasPrev"
            @click="toPrev"
            aria-label="Previous contact"
            title="Previous"
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
                stroke="#374151"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="icon-btn"
            :disabled="!hasNext"
            @click="toNext"
            aria-label="Next contact"
            title="Next"
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
                stroke="#374151"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
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
        <div v-if="folders.length" class="contact-details__sections">
          <HlCard
            v-for="(folder, idx) in folders"
            :key="`fld-${idx}`"
            collapsible
            :collapsed="isCollapsed(idx)"
            @update:collapsed="setCollapsed(idx, $event)"
          >
            <template #left>
              <span class="folder-header-left">
                <svg
                  class="folder-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                    stroke="#4B5563"
                    stroke-width="1.5"
                    fill="#F9FAFB"
                  />
                </svg>
                {{ folder.name }}
              </span>
            </template>
            <template #right>
              <svg
                class="chevron"
                :class="{ 'chevron--down': isCollapsed(idx) }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 14l6-6 6 6"
                  stroke="#4B5563"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </template>
            <div class="fields-grid">
              <div
                v-for="fld in getFolderFields(folder)"
                :key="fld.key"
                :class="[
                  'field',
                  isFirstName(fld) && hasLastName(folder) ? 'name-row' : '',
                ]"
              >
                <template v-if="isFirstName(fld) && hasLastName(folder)">
                  <div class="field">
                    <div class="field__label">{{ fld.label }}</div>
                    <div class="field__value">
                      <HlInput
                        :type="inputTypeFor(fld)"
                        v-model="contact[fld.key]"
                        :isMulti="isMulti(fld)"
                        :placeholder="isMulti(fld) ? 'Comma separated' : ''"
                      />
                    </div>
                  </div>
                  <div class="field">
                    <div class="field__label">
                      {{
                        getFieldByKey(folder, "lastName")?.label ?? "Last Name"
                      }}
                    </div>
                    <div class="field__value">
                      <HlInput
                        :type="inputTypeFor(getFieldByKey(folder, 'lastName'))"
                        v-model="contact['lastName']"
                        :isMulti="isMulti(getFieldByKey(folder, 'lastName'))"
                        :placeholder="
                          isMulti(getFieldByKey(folder, 'lastName'))
                            ? 'Comma separated'
                            : ''
                        "
                      />
                    </div>
                  </div>
                </template>
                <template v-else-if="shouldRenderField(folder, fld)">
                  <div class="field__label">{{ fld.label }}</div>
                  <div class="field__value">
                    <HlSelect
                      v-if="isSingleSelect(fld)"
                      v-model="contact[fld.key]"
                      :options="
                        fld.key === 'owner' ? ownerOptions : getOptions(fld)
                      "
                      placeholder="Select"
                      variant="input"
                    />
                    <HlInput
                      v-else-if="!isAddressField(fld)"
                      :type="inputTypeFor(fld)"
                      v-model="contact[fld.key]"
                      :isMulti="isMulti(fld)"
                      :placeholder="isMulti(fld) ? 'Comma separated' : ''"
                    />
                    <HlInput
                      v-else
                      textarea
                      :placeholder="''"
                      v-model="contact[fld.key]"
                    />
                  </div>
                </template>
              </div>
            </div>
          </HlCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import ContactCard from "./contactCard.vue";
import HlCard from "../../base-components/Card.vue";
import HlInput from "../../base-components/Input.vue";
import HlSelect from "../../base-components/Select.vue";
import { fetchContactData, fetchContactFields } from "../../services/contact";

export default defineComponent({
  name: "ContactDetails",
  components: { ContactCard, HlCard, HlInput, HlSelect },
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

    function getFolderFields(folder) {
      return folder.fields ?? [];
    }

    function getValueText(key) {
      const value = contact.value?.[key];
      if (Array.isArray(value)) return value.join(", ");
      return value ?? "-";
    }

    function isMulti(field) {
      return (field?.type ?? "").toLowerCase() === "multiselect";
    }

    function inputTypeFor(field) {
      const t = (field?.type ?? "text").toLowerCase();
      if (t === "email") return "email";
      if (t === "phone") return "tel";
      // Treat radio and unknowns as simple text inputs for now
      return "text";
    }

    function isSingleSelect(field) {
      return (field?.type ?? "").toLowerCase() === "radio";
    }

    function getOptions(field) {
      return Array.isArray(field?.options)
        ? field.options.filter((v) => v !== null && v !== undefined)
        : [];
    }

    function isAddressField(field) {
      const key = (field?.key ?? "").toLowerCase();
      return key === "address" || key === "streetaddress";
    }

    // Helpers to group first and last name on one row
    function isFirstName(field) {
      const key = (field?.key ?? "").toLowerCase();
      return key === "firstname";
    }
    function isLastName(field) {
      const key = (field?.key ?? "").toLowerCase();
      return key === "lastname";
    }
    function getFieldByKey(folder, key) {
      const keyLc = String(key ?? "").toLowerCase();
      return (
        (folder?.fields ?? []).find(
          (f) => String(f?.key ?? "").toLowerCase() === keyLc
        ) || null
      );
    }
    function hasLastName(folder) {
      return !!getFieldByKey(folder, "lastName");
    }
    function hasFirstName(folder) {
      return !!getFieldByKey(folder, "firstName");
    }
    function shouldRenderField(folder, field) {
      // Skip rendering lastName as a standalone field if firstName exists in the same folder.
      if (isLastName(field) && hasFirstName(folder)) return false;
      // Otherwise render normally.
      return true;
    }

    function onMultiChange(key, e) {
      const raw = e?.target?.value ?? "";
      const parts = raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (!contact.value) contact.value = {};
      contact.value[key] = parts;
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
      getFolderFields,
      getValueText,
      inputTypeFor,
      isMulti,
      onMultiChange,
      isAddressField,
      isCollapsed,
      setCollapsed,
      totalContacts,
      displayIndex,
      hasPrev,
      hasNext,
      toPrev,
      toNext,
      onSelect,
      isSingleSelect,
      getOptions,
      isFirstName,
      isLastName,
      hasLastName,
      hasFirstName,
      getFieldByKey,
      shouldRenderField,
    };
  },
});
</script>

<style scoped>
.contact-details-root {
  border: 1px solid var(--border-color);
  border-radius: var(--card-radius);
  padding: 16px;
  background: var(--component-bg-color);
  height: 97vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
.contact-header__spacer { flex: 1 }

.contact-details {
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  overflow: auto;
}

.contact-details__block {
  width: 320px;
  background: var(--component-bg-color);
  border-radius: 12px;
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
