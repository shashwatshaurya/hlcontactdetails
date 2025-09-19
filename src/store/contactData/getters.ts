import { ContactDataState } from './state'

export const getters = {
  hasFormData: (state: ContactDataState): boolean => !!state.formData,
}

export type ContactDataGetters = typeof getters


