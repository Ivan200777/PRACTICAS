
<script setup>
  import{ computed } from 'vue'
  const props = defineProps(['id'])
  const jugadores = [
  { id: 1, nombre: 'Courtois', posicion: 'Portero', titular: true },
  { id: 5, nombre: 'Nuno Mendes', posicion: 'Defensa', titular: true },
  { id: 2, nombre: 'William Saliba', posicion: 'Defensa', titular: true },
  { id: 3, nombre: 'Eric García', posicion: 'Defensa', titular: true },
  { id: 4, nombre: 'Achraf Hakimi', posicion: 'Defensa', titular: true },
  { id: 8, nombre: 'Pedri', posicion: 'Centrocampista', titular: true },
  { id: 7, nombre: 'Fermín López', posicion: 'Centrocampista', titular: true },
  { id: 6, nombre: 'Vitinha', posicion: 'Centrocampista', titular: true },
  { id: 11, nombre: 'Mbappe', posicion: 'Delantero', titular: true },
  { id: 9, nombre: 'Harry Kane', posicion: 'Delantero', titular: true },
  { id: 10, nombre: 'Lamine Yamal', posicion: 'Delantero', titular: true },
  { id: 12, nombre: 'De Jong', posicion: 'Centrocampista', titular: false },
  { id: 13, nombre: 'Gabriel Magalhaes', posicion: 'Defensa', titular: false },
  { id: 14, nombre: 'Dani Guiza', posicion: 'Delantero', titular: false }
]

//Ahora lo que busco es un jugador que coincida con el id
const jugadorEncontrado = computed(()=> {
    return jugadores.find(j=>j.id === parseInt(props.id))
})
</script>

<template>
  <div v-if="jugadorEncontrado" style=" text-align: center; color: white;">
    <h1>{{jugadorEncontrado.nombre}}</h1>
    <p>Posición: {{ jugadorEncontrado.posicion }}</p>
    <p>Estado: {{ jugadorEncontrado.titular ? 'Titular' : 'Suplente' }}</p>
    <p>Dorsal: {{ jugadorEncontrado.id }}</p>
    <router-link :to="{ name: 'jugadores' }">Volver a la lista</router-link>
  </div>
</template>
