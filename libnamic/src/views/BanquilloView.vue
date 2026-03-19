<script setup>
import TarjetaDeJugador from '../components/TarjetaDeJugador.vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'

const cambiarEstado = (id) => {
  // Buscamos al jugador por su ID en la lista compartida
  const j = jugadores.value.find(jug => jug.id === id)
  if (j) {
    // Si es titular pasa a ser falso, y viceversa
    j.titular = !j.titular
  }
}
</script>

<template>
  <div class="pagina-banquillo">
    <h2 style="color: #d4af37;">ZONA DE SUPLENTES</h2>
    <div class="zona-reservas">
      <p v-if="jugadores.filter(j => !j.titular).length === 0" style="color: aliceblue;">
        No hay suplentes por ahora
      </p>

      <ul style="list-style: none; padding: 0;">
        <li v-for="jugador in jugadores.filter(j => !j.titular)" :key="jugador.id" style="margin-bottom: 30px;">
          
          <tarjeta-de-jugador :jugador="jugador" />

          <button 
            @click="cambiarEstado(jugador.id)" 
            style="display: block; width: 100%; margin-top: 10px; padding: 8px; background: #d4af37; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;"
          >
            ⬆️ Subir a Titular
          </button>
          
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.pagina-banquillo {
  text-align: center;
  padding: 50px;
}
.zona-reservas {
  width: 400px;
  border: 2px dashed #666;
  margin: 20px auto;
  padding: 30px;
}
</style>