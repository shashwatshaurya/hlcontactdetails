import { ContactDataState } from './state'

export const mutations = {
  setFormData(state: ContactDataState, payload: Record<string, any> | null) {
    state.formData = payload
  },
  updateFormField(state: ContactDataState, payload: { key: string; value: any }) {
    if (!state.formData) {
      state.formData = {}
    }
    state.formData[payload.key] = payload.value
  },
}

export type ContactDataMutations = typeof mutations


