import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home'
import Voting from './views/Voting'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/voting', name: 'Voting', component: Voting }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})