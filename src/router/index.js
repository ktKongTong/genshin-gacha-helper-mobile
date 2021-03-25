import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import Show from '../views/Show.vue'
const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/Show',
    name: 'Show',
    component: Show
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
