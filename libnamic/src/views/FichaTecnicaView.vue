<script setup>
import { computed } from 'vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'
const props = defineProps(['id'])


//Ahora lo que busco es un jugador que coincida con el id
const miJugador = computed(()=> {
  if (!jugadores.value) return null;

  return jugadores.value.find(j=>String(j.id) === String(props.id))
})
</script>

<template>
  <div v-if="miJugador" class="tarjeta-detallada">
    <div class="bloque-superior">
      <router-link :to="{ name: 'jugadores' }" class="boton-volver">← Volver a la lista</router-link>
    </div>

    <h1 class="nombre-jugador">{{miJugador.nombre}}</h1>
    
    <p class="datos-secundarios">
      {{ miJugador.posicion }} | Dorsal #{{ miJugador.id }}
    </p>
    
    <p class="texto-titularidad">
      ESTADO: {{ miJugador.titular ? 'TITULAR' : 'SUPLENTE' }}
    </p>

    <div class="rejilla-numeros">
      
      <div class="cuadro-dato">
        <span class="icono">⚽</span>
        <span class="etiqueta">Goles</span>
        <span class="cifra">{{ miJugador.goles || 0 }}</span>
      </div>
      
      <div class="cuadro-dato">
        <span class="icono">👟</span>
        <span class="etiqueta">Asistencias</span>
        <span class="cifra">{{ miJugador.asistencias || 0 }}</span>
      </div>

      <div class="cuadro-dato">
        <span class="icono">🏆</span>
        <span class="etiqueta">Títulos</span>
        <span class="cifra brillo-oro">{{ miJugador.titulos || 0 }}</span>
      </div>

      <div class="cuadro-dato fila-completa">
        <div class="marca-tarjeta">🟨 {{ miJugador.amarillas || 0 }}</div>
        <div class="marca-tarjeta">🟥 {{ miJugador.rojas || 0 }}</div>
      </div>

    </div>
  </div>

  <div v-else class="aviso-error">
    <h2>Cargando o jugador no encontrado...</h2>
    <router-link :to="{ name: 'jugadores' }" class="link-retorno">Volver</router-link>
  </div>
</template>

<style scoped>
.tarjeta-detallada {
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

.bloque-superior {
  text-align: left;
  margin-bottom: 20px;
}

.nombre-jugador {
  color: #d4af37;
  margin-bottom: 0;
  text-transform: uppercase;
}

.datos-secundarios {
  color: #aaa;
  margin-top: 5px;
}

.texto-titularidad {
  font-weight: bold;
  color: #d4af37;
  letter-spacing: 1px;
  margin-top: 15px;
}

.rejilla-numeros {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 25px;
}

.cuadro-dato {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #333;
}

.cifra {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 5px;
}

.brillo-oro {
  color: #d4af37;
}

.etiqueta {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #888;
}

.fila-completa {
  grid-column: span 2;
  flex-direction: row;
  justify-content: space-around;
}

.boton-volver {
  text-decoration: none;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: 0.3s;
}

.boton-volver:hover {
  background: #d4af37;
  color: black;
}

.aviso-error {
  text-align: center;
  color: white;
  margin-top: 50px;
}

.link-retorno {
  color: #d4af37;
  text-decoration: none;
  font-weight: bold;
}

.marca-tarjeta {
  font-weight: bold;
}
</style>