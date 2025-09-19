import { Module } from 'vuex'
import { state, ContactFieldsState } from './state'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export type RootState = unknown

export const contactFields: Module<ContactFieldsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
}

export default contactFields


