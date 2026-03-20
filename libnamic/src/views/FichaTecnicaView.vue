<script setup>
  import { computed } from 'vue'
  import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'
  const props = defineProps(['id'])


//Ahora lo que busco es un jugador que coincida con el id
const jugadorEncontrado = computed(()=> {
  if (!jugadores.value) return null;

  return jugadores.value.find(j=>String(j.id) === String(props.id))
})
</script>

<template>
  <div v-if="jugadorEncontrado" class="ficha-avanzada">
    <div style="text-align: left; margin-bottom: 20px;">
      <router-link :to="{ name: 'jugadores' }" class="btn-volver">← Volver a la lista</router-link>
    </div>

    <h1 style="color: #d4af37; margin-bottom: 0;">{{jugadorEncontrado.nombre}}</h1>
    <p style="color: #aaa; margin-top: 5px;">
      {{ jugadorEncontrado.posicion }} | Dorsal #{{ jugadorEncontrado.id }}
    </p>
    <p style="font-weight: bold; color: #d4af37; letter-spacing: 1px;">
      ESTADO: {{ jugadorEncontrado.titular ? 'TITULAR' : 'SUPLENTE' }}
    </p>

    <div class="stats-grid">
      
      <div class="stat-card">
        <span class="icon">⚽</span>
        <span class="label">Goles</span>
        <span class="value">{{ jugadorEncontrado.goles || 0 }}</span>
      </div>
      
      <div class="stat-card">
        <span class="icon">👟</span>
        <span class="label">Asistencias</span>
        <span class="value">{{ jugadorEncontrado.asistencias || 0 }}</span>
      </div>

      <div class="stat-card">
        <span class="icon">🏆</span>
        <span class="label">Títulos</span>
        <span class="value" style="color: #d4af37;">{{ jugadorEncontrado.titulos || 0 }}</span>
      </div>

      <div class="stat-card cards">
        <div class="card-box">🟨 {{ jugadorEncontrado.amarillas || 0 }}</div>
        <div class="card-box">🟥 {{ jugadorEncontrado.rojas || 0 }}</div>
      </div>

    </div>
  </div>

  <div v-else style="text-align: center; color: white; margin-top: 50px;">
    <h2>Cargando o jugador no encontrado...</h2>
    <router-link :to="{ name: 'jugadores' }" style="color: #d4af37;">Volver</router-link>
  </div>
</template>

<style scoped>
.ficha-avanzada {
  background: #1a1a1a;
  border: 2px solid #d4af37;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  font-family: Arial, sans-serif;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 25px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #333;
}

.stat-card .value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 5px;
}

.stat-card .label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #888;
}

.cards {
  grid-column: span 2;
  flex-direction: row;
  justify-content: space-around;
}

.btn-volver {
  text-decoration: none;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: 0.3s;
}

.btn-volver:hover {
  background: #d4af37;
  color: black;
}

.card-box {
  font-weight: bold;
}
</style>