import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'virtual:file-router'
// import { routes } from './test'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
