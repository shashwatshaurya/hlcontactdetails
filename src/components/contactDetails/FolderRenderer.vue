<template>
  <div v-if="folders && folders.length" class="contact-details__sections">
    <HlCard
      v-for="(folder, idx) in folders"
      :key="`fld-${idx}`"
      collapsible
      :collapsed="isCollapsed(idx)"
      @update:collapsed="(v) => $emit('update-collapsed', idx, v)"
    >
      <template #left>
        <span class="folder-header-left">
          <Icon icon="mdi-light:folder" width="16" height="16" />
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
            stroke="var(--muted-600)"
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
                  v-model="localContact[fld.key]"
                  :isMulti="isMulti(fld)"
                  :placeholder="isMulti(fld) ? 'Comma separated' : ''"
                />
              </div>
            </div>
            <div class="field">
              <div class="field__label">
                {{ getFieldByKey(folder, 'lastName')?.label ?? 'Last Name' }}
              </div>
              <div class="field__value">
                <HlInput
                  :type="inputTypeFor(getFieldByKey(folder, 'lastName'))"
                  v-model="localContact['lastName']"
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
                v-model="localContact[fld.key]"
                :options="fld.key === 'owner' ? ownerOptions : getOptions(fld)"
                placeholder="Select"
                variant="input"
              />
              <HlInput
                v-else-if="!isAddressField(fld)"
                :type="inputTypeFor(fld)"
                v-model="localContact[fld.key]"
                :isMulti="isMulti(fld)"
                :placeholder="isMulti(fld) ? 'Comma separated' : ''"
              />
              <HlInput
                v-else
                textarea
                :placeholder="''"
                v-model="localContact[fld.key]"
              />
            </div>
          </template>
        </div>
      </div>
    </HlCard>
  </div>
</template>

<script>
import { defineComponent, watch, toRefs, reactive } from "vue";
import { HlCard, HlInput, HlSelect } from "@/base-components";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "FolderRenderer",
  components: { HlCard, HlInput, HlSelect, Icon },
  props: {
    folders: { type: Array, default: () => [] },
    contact: { type: Object, default: () => null },
    ownerOptions: { type: Array, default: () => [] },
    isCollapsed: { type: Function, required: true },
  },
  emits: ["update-contact", "update-collapsed"],
  setup(props, { emit }) {
    const { contact } = toRefs(props);
    const localContact = reactive({ ...(contact.value || {}) });

    watch(
      contact,
      (val) => {
        Object.keys(localContact).forEach((k) => delete localContact[k]);
        Object.assign(localContact, val || {});
      },
      { deep: true, immediate: true }
    );

    watch(
      localContact,
      (val) => {
        emit("update-contact", { ...val });
      },
      { deep: true }
    );

    function getFolderFields(folder) {
      return folder?.fields ?? [];
    }
    function isMulti(field) {
      return (field?.type ?? "").toLowerCase() === "multiselect";
    }
    function inputTypeFor(field) {
      const t = (field?.type ?? "text").toLowerCase();
      if (t === "email") return "email";
      if (t === "phone") return "tel";
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
      if (isLastName(field) && hasFirstName(folder)) return false;
      return true;
    }

    return {
      localContact,
      getFolderFields,
      isMulti,
      inputTypeFor,
      isSingleSelect,
      getOptions,
      isAddressField,
      isFirstName,
      hasLastName,
      shouldRenderField,
      getFieldByKey,
    };
  },
});
</script>

<style scoped>
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
.field__value { min-width: 0; }
.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: -16px;
}
.name-row > .field { min-width: 0; }
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
.field__value .field__control { font-size: inherit; }
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
.chevron { transition: transform 0.2s ease; }
.chevron--down { transform: rotate(180deg); }
</style>


