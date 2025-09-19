import { ActionContext } from 'vuex'
import { ContactDataState } from './state'

export type RootState = unknown

export const actions = {
  initFormData(
    { commit }: ActionContext<ContactDataState, RootState>,
    payload: Record<string, any> | null
  ) {
    commit('setFormData', payload)
  },
}

export type ContactDataActions = typeof actions


