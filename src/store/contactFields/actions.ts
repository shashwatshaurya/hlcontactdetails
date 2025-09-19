export const actions = {
  setOwnerOptions({ commit }: any, fields: any) {
    const folders = Array.isArray(fields?.folders) ? fields.folders : []
    const additional = folders.find((f: any) => String(f?.name || '').toLowerCase() === 'additional info')
    const rawFields = (additional?.fields ?? additional?.fileds) || []
    const ownerField = rawFields.find((x: any) => String(x?.key || '').toLowerCase() === 'owner')
    const options = Array.isArray(ownerField?.options) ? ownerField.options : []
    commit('setOwnerOptions', options)
  },
}

export type ContactFieldsActions = typeof actions


