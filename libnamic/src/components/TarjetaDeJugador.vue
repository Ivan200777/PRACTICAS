<script setup>
defineProps(['jugador'])
</script>
<template>
<li class="TarjetaDeJugador">
<strong>{{ jugador.nombre }}</strong> - <small>{{ jugador.posicion }}</small>
<br>
<router-link :to="{ name: 'ficha-tecnica' , params: {id:jugador.id}}">
Ver ficha
</router-link>
</li>
</template>

<style scoped>
.TarjetaDeJugador {
  background: linear-gradient(45deg, #1a1a1a, #333);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: 15px;
  margin: 10px auto;
  width: 250px;
  transition: transform 0.3s;
  list-style: none;
  text-align: center;
  color: white;
}

.TarjetaDeJugador:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #d4af37;
}
</style>
