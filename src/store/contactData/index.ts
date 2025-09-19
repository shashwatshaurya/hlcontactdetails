import { Module } from 'vuex'
import { state, ContactDataState } from './state'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export type RootState = unknown

export const contactData: Module<ContactDataState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
}

export default contactData


