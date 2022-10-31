import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'virtual:file-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
