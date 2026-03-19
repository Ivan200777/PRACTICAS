<script setup>
import TarjetaDeJugador from '@/components/TarjetaDeJugador.vue';
import {ref} from 'vue' //ref sirve para actualizar la pantalla con nuevos datos
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'
const nuevoNombre = ref('')
const nuevaPosicion = ref('Portero')
const nuevoId = ref()

  //Esto será para que el botón de fichar funcione
  const añadirFichaje=() => {
    if (nuevoNombre.value.trim() === '') return //El trim es para eliminar los espacios feos de un nombre

    const nuevo= {
      id: nuevoId.value || Date.now(), 
      nombre: nuevoNombre.value,
      posicion: nuevaPosicion.value,
      titular: false
    }
    jugadores.value.push(nuevo)

    nuevoNombre.value = ''
    nuevoId.value = null //Esto es para limpiar inputs
   nuevaPosicion.value = 'Portero';
}

  //Como solo son 11, no podemos añadir jugadores sin quitar otros, por eso, vamos a poner una opción para mandar al banquillo y otra para mandar al 11 titular
const cambiarEstado = (id) => {
  const jugador = jugadores.value.find(j => j.id ===id)

  if (jugador){
    jugador.titular = !jugador.titular
  }
}

</script>


<template>
<div style="text-align: center; padding: 20px;" >
<div style="margin-bottom: 30px; background-color: black; padding: 20px; border-radius: 10px;
border: 1px solid #d4af37;">
<h3 style="color:#d4af37"> NUEVO FICHAJE</h3>

<input 
v-model="nuevoNombre"
type="text"
placeholder="Nombre del jugador"
style="padding: 10px; border-radius: 5px; margin-right: 10px;">

<select v-model="nuevaPosicion" style="padding: 10px; border-radius: 5px;">
<option>Portero</option>
<option>Defensa</option>
<option>Centrocampista</option>
<option>Delantero</option>
</select>

<input
v-model="nuevoId"
type="number"
placeholder="Nº"
style="padding: 10px; width:50px;border-radius: 5px; margin-right: 10px;">
  
<button @click="añadirFichaje" style="margin-left: 10px; padding: 10px 20px; background: #d4af37;font-weight: bold; cursor: pointer; ">
FICHAR
</button>

<p style="color: aliceblue; margin-top: 10px;">
  Vas a fichar a: <strong>{{ nuevoNombre }}</strong> como {{ nuevaPosicion }} con el dorsal {{ nuevoId }}
</p>
</div>

<h2 style="color: #d4af37;">MIS 11 TITULARES</h2>
<ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; justify-content: center;">
  
  <li v-for="j in jugadores.filter(jug => jug.titular)" :key="j.id" style="margin: 15px;">
    
    <tarjeta-de-jugador :jugador="j" />
    
    <button 
      @click="cambiarEstado(j.id)" 
      style="display: block; width: 100%; margin-top: 10px; padding: 8px; background: #444; color: #d4af37; border: 1px solid #d4af37; border-radius: 5px; cursor: pointer; font-weight: bold;"
    >
      ⬇️ Mandar al Banquillo
    </button>

  </li>
</ul>
</div>

</template>

<style scoped>
.tarjetaDeJugador{
  background: linear-gradient(45deg, #1a1a1a, #333);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: 15px;
  margin: 10px auto;
  width: 250px;
  transition: transform 0.3s;
}
.tarjetaDeJugador:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #d4af37;
}
</style>