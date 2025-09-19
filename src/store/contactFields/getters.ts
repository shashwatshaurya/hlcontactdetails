import { ContactFieldsState } from './state'

export const getters = {
  ownerOptions(state: ContactFieldsState): string[] {
    return state.ownerOptions
  },
}

export type ContactFieldsGetters = typeof getters


