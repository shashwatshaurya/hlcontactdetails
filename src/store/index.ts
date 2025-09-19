import { createStore } from 'vuex'
import contactData from './contactData'
import contactFields from './contactFields'
import type { ContactDataState } from './contactData/state'

export interface RootState {
  contactData: ContactDataState
  contactFields: any
}

const store = createStore<RootState>({
  modules: {
    contactData,
    contactFields,
  },
})

export default store

