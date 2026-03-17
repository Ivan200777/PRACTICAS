import { createApp } from 'vue'
import App from './App.vue'
import router from './rutas'

const app = createApp(App)

app.use(router) 

//Hemos introducido el router para utilizar nuestras rutas: Campo, jugadores y banquillo.

app.mount('#app')
