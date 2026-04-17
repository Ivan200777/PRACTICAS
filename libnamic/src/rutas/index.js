// En este fichero introducimos las rutas que pusimos en el header y footer
// para que nos sirvan.

import { createRouter, createWebHistory } from 'vue-router'
import CampoView from '../views/CampoView.vue'

const misRutas = [
  {
    path: '/',
    name: 'campo',
    component: CampoView
  },
  {
    path: '/jugadores',
    name: 'jugadores',
    component: () => import('../views/JugadoresView.vue')
  },
  {
    path: '/jugador/:id',
    name: 'ficha-tecnica',
    component: () => import('../views/FichaTecnicaView.vue'),
    props: true
  },
  {
    path: '/banquillo',
    name: 'banquillo',
    component: () => import('../views/BanquilloView.vue'),
    props: true // código más limpio y fácil gracias a props
  },
  {
    path: '/jugador/:id/edit',
    name: 'editar-jugador',
    component: () => import('../views/FichaTecnicaView.vue'), 
    props: true
  },
  {
    path: '/sobres',
    name: 'sobres',
    component: () => import('../views/SobresView.vue')
  },
  {
    path: '/torneo',
    name: 'torneo',
    component: () => import('../views/TorneoView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: misRutas
})

export default router;