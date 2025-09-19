export { default as HlAvatar } from './Avatar.vue'
export { default as HlButton } from './Button.vue'
export { default as HlTextPost } from './TextPost.vue'
export { default as HlInput } from './Input.vue'
export { default as HlSelect } from './Select.vue'

// re-exports for convenience
export default {
  HlAvatar: (await import('./Avatar.vue')).default,
  HlButton: (await import('./Button.vue')).default,
  HlTextPost: (await import('./TextPost.vue')).default,
  HlCard: (await import('./Card.vue')).default,
  HlTabs: (await import('./Tags.vue')).default,
  HlInput: (await import('./Input.vue')).default,
  HlSelect: (await import('./Select.vue')).default,
}


