<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['misTitulares', 'nombreRival', 'mediaRival'])
const emit = defineEmits(['finalizado'])

const mensajes = ref(["🏟️ ¡Los equipos saltan al campo!"])
const marcador = ref({ local: 0, visitante: 0 })
const minuto = ref(0)
const jugando = ref(false)

// Lógica para que el escudo cambie según el nombre del rival
const obtenerEscudo = (nombre) => {
  if (nombre.includes('Bayern')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1024px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png'
  if (nombre.includes('City')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png'
  if (nombre.includes('Real Madrid')) return 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png'
  return 'https://cdn-icons-png.flaticon.com/512/1165/1165248.png'
}

// Plantillas reales para los rivales
const plantillasRivales = {
  'Bayern de Múnich': ['Neuer', 'Kimmich', 'Upamecano', 'Kim Min-jae', 'Davies', 'Laimer', 'Goretzka', 'Sané', 'Musiala', 'Coman', 'Harry Kane'],
  'Manchester City': ['Ederson', 'Walker', 'Ruben Dias', 'Aké', 'Gvardiol', 'Rodri', 'De Bruyne', 'Bernardo Silva', 'Foden', 'Grealish', 'Haaland'],
  'Real Madrid': ['Courtois', 'Carvajal', 'Rüdiger', 'Militao', 'Mendy', 'Tchouaméni', 'Valverde', 'Bellingham', 'Rodrygo', 'Vinícius Jr', 'Mbappé']
}

const alineacionRival = ref(plantillasRivales[props.nombreRival] || [])

const jugar = () => {
  jugando.value = true
  const mediaMia = Math.round(props.misTitulares.reduce((acc, j) => acc + (j.media || 80), 0) / 11)
  
  const intervalo = setInterval(() => {
    minuto.value++ // Minutos de 1 en 1 como pediste
    
    const azar = Math.random() * 100
    if (azar > 98) { 
      const jugadoresCampo = props.misTitulares.filter(j => j.posicion !== 'Portero')
      const jugador = jugadoresCampo[Math.floor(Math.random() * jugadoresCampo.length)]
      marcador.value.local++
      mensajes.value.unshift(`Min ${minuto.value}: ⚽ ¡GOOOL de ${jugador.nombre}!`)
    } else if (azar < 2) {
      const jugadorRival = alineacionRival.value[Math.floor(Math.random() * alineacionRival.value.length)]
      marcador.value.visitante++
      mensajes.value.unshift(`Min ${minuto.value}: ❌ Gol de ${jugadorRival} para el ${props.nombreRival}`)
    }

    if (minuto.value >= 90) {
      clearInterval(intervalo)
      jugando.value = false
      setTimeout(() => emit('finalizado', marcador.value.local > marcador.value.visitante), 3000)
    }
  }, 100) 
}
</script>

<template>
  <div class="match-container">
    <div class="header-match">
      <div class="escudo-box">
        <img src="https://cdn-icons-png.flaticon.com/512/1165/1165248.png" width="60">
        <p>MI 11</p>
      </div>
      <div class="score-center">
        <div class="big-score">{{ marcador.local }} - {{ marcador.visitante }}</div>
        <div class="min-reloj">{{ minuto }}'</div>
      </div>
      <div class="escudo-box">
        <img :src="obtenerEscudo(nombreRival)" width="60">
        <p>{{ nombreRival }}</p>
      </div>
    </div>

    <div class="game-grid">
      <div class="lineup-col">
        <h3>🏠 LOCAL</h3>
        <div v-for="j in misTitulares" :key="j.id" class="player-row">
          <span class="p-name">{{ j.nombre }}</span>
          <span class="p-rating">{{ j.media }}</span>
        </div>
      </div>

      <div class="logs-col">
        <button v-if="minuto === 0" @click="jugar" class="btn-kickoff">PITA EL INICIO</button>
        <div class="log-messages">
          <p v-for="(m, i) in mensajes" :key="i" :class="{ isGoal: m.includes('⚽') }">{{ m }}</p>
        </div>
      </div>

      <div class="lineup-col">
        <h3>🚀 VISITANTE</h3>
        <div v-for="p in alineacionRival" :key="p" class="player-row rival">
          <span class="p-name">{{ p }}</span>
          <span class="p-rating">{{ mediaRival }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.match-container { background: #000; padding: 25px; border: 1px solid #d4af37; border-radius: 12px; width: 95%; max-width: 950px; }
.header-match { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; text-align: center; }
.big-score { font-size: 3.5rem; font-weight: bold; color: white; }
.min-reloj { color: #ffd700; font-size: 1.2rem; font-weight: bold; }
.game-grid { display: grid; grid-template-columns: 1fr 1.5fr 1fr; gap: 15px; }
.lineup-col { background: #111; padding: 10px; border-radius: 8px; border: 1px solid #222; }
.player-row { display: flex; justify-content: space-between; padding: 4px 8px; font-size: 0.85rem; border-bottom: 1px solid #222; }
.p-rating { color: #ffd700; font-weight: bold; }
.rival .p-rating { color: #ff4500; }
.log-messages { height: 280px; overflow-y: auto; background: #080808; padding: 10px; border-radius: 5px; text-align: left; }
.isGoal { color: #00ff00; font-weight: bold; background: rgba(0, 255, 0, 0.05); }
.btn-kickoff { width: 100%; padding: 12px; background: #ffd700; color: black; font-weight: bold; border: none; cursor: pointer; margin-bottom: 10px; border-radius: 5px; }
</style>