
<script setup>
  import{ computed } from 'vue'
  import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'
  const props = defineProps(['id'])


//Ahora lo que busco es un jugador que coincida con el id
const jugadorEncontrado = computed(()=> {
  if (!jugadores.value) return null;

  return jugadores.value.find(j=>String(j.id) === String(props.id))
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
