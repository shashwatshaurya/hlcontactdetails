import { ContactFieldsState } from './state'

export const mutations = {
  setOwnerOptions(state: ContactFieldsState, options: string[]) {
    state.ownerOptions = Array.isArray(options) ? options : []
  },
}

export type ContactFieldsMutations = typeof mutations


