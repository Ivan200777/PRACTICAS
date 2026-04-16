<script setup>
import { ref, computed } from 'vue'
// Asegúrate de que este nombre de archivo sea el correcto en tu proyecto
import { poolExclusivos, listaCompartida } from '../DatosDeLosJugadores.js'

const abierto = ref(false)
const vibrando = ref(false)
const recompensa = ref([])

const hayLeyenda = computed(() => {
  return recompensa.value.some(j => j.clase === 'leyenda')
})

const abrirPack = () => {
  vibrando.value = true
  recompensa.value = []
  abierto.value = false; // Aseguramos que esté cerrado al empezar

  setTimeout(() => {
    vibrando.value = false
    abierto.value = true

    for (let i = 0; i < 3; i++) {
      const p = Math.random() * 100
      let filtro = []
      
      if (p < 5) {
        filtro = poolExclusivos.filter(j => j.clase === 'leyenda')
      } else if (p < 25) {
        filtro = poolExclusivos.filter(j => j.clase === 'fuego')
      } else {
        filtro = poolExclusivos.filter(j => j.clase === 'oro')
      }
      
      const listaABuscar = filtro.length > 0 ? filtro : poolExclusivos
      const elegido = listaABuscar[Math.floor(Math.random() * listaABuscar.length)]
      
      recompensa.value.push({ ...elegido, id: Date.now() + i }) 
    }
  }, 2000) // Aumentamos un poco el tiempo para que se vea la animación del sobre
}

const guardarYSalir = () => {
  recompensa.value.forEach(nuevo => {
    listaCompartida.value.push({ ...nuevo });
  });

  recompensa.value = [];
  abierto.value = false;
};
</script>

<template>
  <div class="contenedor-sobres">
    <div v-if="!vibrando && !abierto" class="tienda-inicio">
      <h1 class="titulo-tienda">PACK <span>PREMIUM</span></h1>
      <button class="btn-comprar" @click="abrirPack">
        🛒 ABRIR SOBRE
      </button>
    </div>

    <div v-if="vibrando || abierto" 
         class="pantalla-apertura" 
         :class="{ 'destello-leyenda': hayLeyenda && abierto }">
      
      <div v-if="vibrando" class="escena-sobre">
        <div class="sobre-css" :class="{ 'shake': vibrando }">
          <div class="solapa"></div>
          <div class="cuerpo">
            <span class="logo-pack">P</span>
          </div>
        </div>
      </div>

      <div v-if="abierto" class="resultado-pack">
        <div class="cartas-container">
          <div v-for="j in recompensa" :key="j.id" :class="['ficha-cromo', j.clase]">
             <img :src="j.foto" class="foto-cromo">
             <div class="nombre-cromo">{{ j.nombre }}</div>
          </div>
        </div>
        <button class="btn-confirmar" @click="guardarYSalir">ENVIAR AL CLUB</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor-sobres {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  font-family: sans-serif;
}

.titulo-tienda { color: white; font-size: 3rem; margin-bottom: 20px; text-align: center; }
.titulo-tienda span { color: #ffd700; }

.btn-comprar {
  padding: 20px 50px;
  font-size: 1.2rem;
  background: #ffd700;
  border: none;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

.pantalla-apertura {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, #1a1a1a, #000);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* --- DISEÑO DEL SOBRE CON CSS --- */
.escena-sobre {
  perspective: 1000px; /* Para dar sensación 3D */
}

.sobre-css {
  width: 250px;
  height: 180px;
  background: #bf953f; /* Color base dorado */
  background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 45%, #b38728 100%);
  border-radius: 8px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.solapa {
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  border-left: 125px solid transparent;
  border-right: 125px solid transparent;
  border-top: 100px solid #fcf6ba; /* Color más claro para la solapa */
  border-radius: 8px 8px 0 0;
  z-index: 2;
  transform-origin: top;
}

.cuerpo {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: rgba(0,0,0,0.1);
  border-radius: 0 0 8px 8px;
}

.logo-pack {
  font-size: 5rem;
  font-weight: bold;
  color: rgba(255, 215, 0, 0.7);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

/* --- DISEÑO DE LAS CARTAS --- */
.ficha-cromo {
  width: 130px;
  height: 180px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border: 3px solid #fff;
  animation: entrada-carta 0.5s ease-out forwards;
}

.ficha-cromo.oro { border-color: #ffd700; background: linear-gradient(135deg, #bf953f, #fcf6ba); }
.ficha-cromo.fuego { border-color: #ff4500; background: linear-gradient(145deg, #ff4500, #b71c1c); }
.ficha-cromo.leyenda { border-color: #fff; background: linear-gradient(145deg, #434343, #000); color: white; }

.foto-cromo { width: 90px; height: 90px; border-radius: 50%; border: 2px solid white; object-fit: cover; background: #222; }
.nombre-cromo { background: rgba(0,0,0,0.8); color: white; width: 100%; text-align: center; padding: 5px 0; border-radius: 5px; font-weight: bold; font-size: 0.9rem; }

/* --- ANIMACIONES --- */
.shake { animation: shake-animation 0.1s infinite; }
@keyframes shake-animation {
  0% { transform: translate(2px, 2px) rotate(0deg); }
  50% { transform: translate(-2px, -2px) rotate(1deg); }
  100% { transform: translate(2px, 2px) rotate(0deg); }
}

@keyframes entrada-carta {
  from { transform: scale(0) translateY(100px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.cartas-container { display: flex; gap: 20px; }

.btn-confirmar {
  margin-top: 40px;
  padding: 15px 40px;
  background: #28a745;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
}

.destello-leyenda {
  background: radial-gradient(circle, #ffd700 0%, #000 80%) !important;
}
</style>