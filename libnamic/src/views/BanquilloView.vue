<script setup>
import TarjetaDeJugador from '../components/TarjetaDeJugador.vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'

const cambiarEstado = (id) => {
  // Buscamos al jugador por su ID en la lista compartida
  const j = jugadores.value.find(jug => jug.id === id)

  // Lógica para no pasarse de 11 titulares
  if (j && !j.titular) {
    const totalTitulares = jugadores.value.filter(jug => jug.titular).length
    if (totalTitulares >= 11) {
      alert("¡Ya tienes 11 titulares! Debes bajar a alguien al banquillo primero.")
      return 
    }
  }

  if (j) {
    // Si es titular pasa a ser falso, y viceversa
    j.titular = !j.titular
  }
}

// Nueva función para borrar jugadores desde el banquillo
const borrarJugador = (id) => {
  if (confirm('¿Estás seguro de que quieres despedir a este suplente?')) {
    jugadores.value = jugadores.value.filter(j => j.id !== id)
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

      <ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; justify-content: center;">
        <li v-for="jugador in jugadores.filter(j => !j.titular)" :key="jugador.id" style="margin: 15px; position: relative; display: inline-block;">
          
          <button @click="borrarJugador(jugador.id)" class="Despedir">
            x
          </button>

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
  width: 100%;
  max-width: 800px;
  border: 2px dashed #666;
  margin: 20px auto;
  padding: 30px;
}

/* Estilo para el botón de borrar */
.Despedir {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.8);
  color: #d4af37;
  border: 1px solid #d4af37;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.Despedir:hover {
  background: #d4af37;
  color: black;
  transform: scale(1.1);
}
</style>