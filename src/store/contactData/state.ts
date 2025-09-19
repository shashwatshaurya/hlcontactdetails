export type ContactDataState = {
  formData: Record<string, any> | null;
}

export const state = (): ContactDataState => ({
  formData: null,
});


