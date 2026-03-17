// En este fichero inttroducimos las rutas que pusimos en el header y footer
// para que nos sirvan.

import{
    createRouter, createWebHistory
} from 'vue-router'

import CampoView from '../views/CampoView.vue'

const misRutas= [
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
    path: '/banquillo',
    name: 'banquillo',
    component: () => import('../views/BanquilloView.vue')

}

]

const router = createRouter({
    history:createWebHistory(),
    routes: misRutas
})

export default router;