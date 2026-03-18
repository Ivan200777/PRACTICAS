<script setup>
  const jugadores = [
    //Portero
  
  {
    id: 1, nombre: 'Courtois', posicion: 'Portero', titular: true
  },
  //Defensa
  
  
    {id: 5, nombre: 'Nuno Mendes', posicion: 'Defensa', titular: true},
    {id: 2, nombre: 'William Saliba', posicion: 'Defensa', titular: true},
    {id: 3, nombre: 'Eric García', posicion: 'Defensa', titular: true},
    {id:4, nombre:"Achraf Hakimi", posicion: 'Defensa', titular:true},
  
  //Centrocampoista
  
  {
    id: 8, nombre: 'Pedri', posicion: 'Centrocampista', titular: true
  },
  {
    id: 7, nombre: 'Fermín López', posicion: 'Centrocampista', titular: true
  },
  {
    id: 6, nombre: 'Vitinha', posicion: 'Centrocampista', titular: true
  },
  

  //Delantero
  {
    id:11, nombre: 'Mbappe', posicion: 'Delantero', titular: true
  },
  {
    id:9, nombre: 'Harry Kane', posicion: 'Delantero', titular: true
  },
  {
    id:10, nombre: 'Lamine Yamal', posicion: 'Delantero', titular: true
  },

  //Banquillo
  {
    id:12, nombre: 'De Jong', posicion: 'Centrocampista', titular: false
  },
  {
    id:13, nombre: 'Gabriel Magalhaes', posicion: 'Defensa', titular: false
  },
  {
    id:14, nombre: 'Dani Guiza', posicion: 'Delantero', titular: false
  },
  ]
</script>


<template>
  <div style="text-align: center; padding: 50px;">
    <h2 style="color: #d4af37;">MIS 11 TITULARES</h2>
    <ul style="list-style: none; padding: 0; color:aliceblue">
     <li v-for="jugador in jugadores.filter(j=>j.titular)"
    :key="jugador.id" 
    class="tarjeta-mini"> 
  <strong>{{ jugador.nombre }}</strong> - <small>{{ jugador.posicion }}</small>
  <br>
  <router-link :to="{ name: 'ficha-tecnica', params: { id: jugador.id } }"  style="color: #d4af37; font-size: 0.8em;">
    Ver ficha
  </router-link>
    </li>
    </ul>
  </div>
</template>

<style scoped>
.tarjeta-mini {
  background: linear-gradient(45deg, #1a1a1a, #333);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: 15px;
  margin: 10px auto;
  width: 250px;
  transition: transform 0.3s;
}
.tarjeta-mini:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #d4af37;
}
</style>