<script setup>
import { ref, computed } from 'vue'
import { listaCompartida } from '../DatosDeLosJugadores.js'
import SimuladorPartidos from '../components/SimuladorPartidos.vue'

const jugandoPartido = ref(false)
const faseActual = ref(0) // 0: Cuartos, 1: Semis, 2: Final
const resultadoMensaje = ref('')

const fases = ['CUARTOS DE FINAL', 'SEMIFINAL', 'GRAN FINAL']
const rivales = [
  { nombre: 'Bayern de Múnich', media: 84 },
  { nombre: 'Manchester City', media: 88 },
  { nombre: 'Real Madrid', media: 91 }
]

// Usamos el .value para filtrar correctamente
const misTitulares = computed(() => {
  return listaCompartida.value ? listaCompartida.value.filter(j => j.titular) : []
})

const iniciarEncuentro = () => {
  if (misTitulares.value.length < 11) {
    alert("Necesitas 11 titulares para jugar.")
    return
  }
  jugandoPartido.value = true
}

const procesarResultado = (ganado) => {
  jugandoPartido.value = false
  if (ganado) {
    // CORREGIDO: He cambiado .ref por .value
    if (faseActual.value < 2) { 
      faseActual.value++
      resultadoMensaje.value = '¡Avanzas a la siguiente ronda!'
    } else {
      resultadoMensaje.value = '¡ERES EL CAMPEÓN DEL MUNDO! 🏆'
    }
  } else {
    faseActual.value = 0
    resultadoMensaje.value = 'Has sido eliminado. Vuelve a empezar.'
  }
}
</script>

<template>
  <div class="torneo-wrapper">
    <div v-if="!jugandoPartido" class="bracket-container">
      <h2 class="fase-titulo">{{ fases[faseActual] }}</h2>
      
      <div class="bracket-visual">
        <div class="ronda" :class="{ activa: faseActual === 0 }">Cuartos</div>
        <div class="conector"></div>
        <div class="ronda" :class="{ activa: faseActual === 1 }">Semis</div>
        <div class="conector"></div>
        <div class="ronda" :class="{ activa: faseActual === 2 }">Final</div>
      </div>

      <div class="card-duelo">
        <div class="tu-equipo">
          <img src="https://cdn-icons-png.flaticon.com/512/1165/1165248.png" width="50">
          <h3>TU EQUIPO</h3>
        </div>
        <div class="vs">VS</div>
        <div class="rival-equipo">
          <img src="https://cdn-icons-png.flaticon.com/512/824/824727.png" width="50">
          <h3>{{ rivales[faseActual].nombre }}</h3>
          <p>Media: {{ rivales[faseActual].media }}</p>
        </div>
      </div>

      <button class="btn-jugar" @click="iniciarEncuentro">JUGAR PARTIDO</button>
      <p v-if="resultadoMensaje" class="msg-resultado">{{ resultadoMensaje }}</p>
    </div>

    <SimuladorPartidos 
      v-else 
      :misTitulares="misTitulares" 
      :nombreRival="rivales[faseActual].nombre"
      :mediaRival="rivales[faseActual].media"
      @finalizado="procesarResultado"
    />
  </div>
</template>

<style scoped>
.torneo-wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: 20px;}
.fase-titulo { color: #ffd700; letter-spacing: 2px; text-align: center;}

.bracket-visual { display: flex; align-items: center; justify-content: center; margin: 30px 0; }
.ronda { padding: 10px 20px; border: 1px solid #444; border-radius: 5px; color: #666; }
.ronda.activa { border-color: #ffd700; color: #ffd700; background: rgba(255, 215, 0, 0.1); font-weight: bold; transform: scale(1.1); }
.conector { width: 40px; height: 2px; background: #333; }

.card-duelo { 
  display: flex; align-items: center; background: #151515; 
  padding: 30px; border-radius: 15px; border: 1px solid #333; gap: 40px;
}
.tu-equipo, .rival-equipo { text-align: center; }
.vs { font-style: italic; font-weight: bold; color: #ffd700; font-size: 1.5rem; }
.btn-jugar { 
  margin: 20px auto; display: block; padding: 15px 50px; background: #ffd700; 
  border: none; font-weight: bold; border-radius: 50px; cursor: pointer; color: black;
}
.msg-resultado { margin-top: 20px; color: #00ff00; font-weight: bold; text-align: center;}
</style>