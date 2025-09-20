import { createRouter, createWebHistory } from 'vue-router'
import { fetchLayout } from '@/services/layout'

const Home = () => import('@/views/Home.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: async (to: any, from: any, next: any) => {
      try {
        const layout = await fetchLayout()
        // attach layout to route meta so views can consume it
        to.meta.layout = layout
        next()
      } catch (err) {
        // if layout fetch fails, still continue to route
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
