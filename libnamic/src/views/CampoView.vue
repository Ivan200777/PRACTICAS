<script setup>
import { ref, computed, watch } from 'vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'


const nombreEquipo = ref(localStorage.getItem('nombreMiEquipo') || 'MI 11 IDEAL')
const suplentes = computed(() => {
  return jugadores.value.filter(j => !j.titular)
})


watch(nombreEquipo, (nuevoNombre) => {
  localStorage.setItem('nombreMiEquipo', nuevoNombre)
})

const titulares = computed(() => jugadores.value.filter(j => j.titular))
</script>

<template>
  <div class="escenario">
    <div class="campo-futbol">
      <div class="nombre-equipo-contenedor">
        <input 
          v-model="nombreEquipo" 
          type="text" 
          placeholder="NOMBRE DE TU EQUIPO" 
          class="input-nombre-equipo"
        >
      </div>

      <div class="linea-medio"></div>
      <div class="circulo-central"></div>
      <div class="area-grande"></div>
      <div class="area-pequeña"></div>
      
      <div v-for="j in titulares" 
           :key="j.id" 
           :class="['jugador-posicionado', j.posicion.toLowerCase()]">
        
        <div class="ficha-campo" :class="{'es-capitan' : j.capitan}">
          <div class="contenedor-avatar">
            <img v-if="j.foto" :src="j.foto" class="foto-miniatura">
            <div v-else class="inicial-miniatura">{{ j.nombre.charAt(0) }}</div>
            <span v-if="j.capitan" class="brazalete-capitan">C</span>
          </div>
        
          <span class="nombre-campo">{{ j.nombre }}</span>
        </div>
      </div>
    </div>

    <div class="zona-banquillo-campo">
      <h3 class="titulo-banquillo">BANQUILLO</h3>
      <div class="contenedor-suplentes">
        <div v-for="j in suplentes" :key="j.id" class="mini-tarjeta-suplente">
          <div class="foto-suplente">
            <img v-if="j.foto" :src="j.foto">
            <span v-else>{{ j.nombre.charAt(0) }}</span>
          </div>
          <p class="nombre-suplente">{{ j.nombre }}</p>
          <small class="pos-suplente">{{ j.posicion }}</small>
        </div>
      </div>
    </div>
    <div class="marcador-info" :class="{ 'error': titulares.length !== 11 }">
      Titulares: {{ titulares.length }} / 11
      <p v-if="titulares.length !== 11" class="aviso">Debes elegir exactamente 11 titulares</p>
    </div>
  </div>
</template>

<style scoped>
.escenario {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 80vh;
}

.campo-futbol {
  width: 100%;
  max-width: 500px;
  height: 650px;
  background-color: #2e7d32;
  border: 3px solid white;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-image: repeating-linear-gradient(
    0deg,
    #2e7d32,
    #2e7d32 10%,
    #388e3c 10%,
    #388e3c 20%
  );
}

.linea-medio {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background: white;
}

.circulo-central {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid white;
  border-radius: 50%;
}

.area-grande {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 90px;
  border: 2px solid white;
  border-bottom: none;
}

.jugador-posicionado {
  position: absolute;
  transform: translateX(-50%);
  transition: all 0.5s ease;
  z-index: 10;
}

.portero { bottom: 5%; left: 50%; }

.defensa { bottom: 22%; }
.defensa:nth-of-type(4n+1) { left: 20%; } /*el número que acompaña a la n es la cantidad de ese tipo y el otro número nos marca cuál es */
.defensa:nth-of-type(4n+2) { left: 40%; }
.defensa:nth-of-type(4n+3) { left: 60%; }
.defensa:nth-of-type(4n+4) { left: 80%; }

.centrocampista { bottom: 45%; }
.centrocampista:nth-of-type(3n+1) { left: 25%; }
.centrocampista:nth-of-type(3n+2) { left: 50%; }
.centrocampista:nth-of-type(3n+3) { left: 75%; }

.delantero { bottom: 70%; } 
.delantero:nth-of-type(3n+1) { left: 30%; }
.delantero:nth-of-type(3n+2) { left: 50%; }
.delantero:nth-of-type(3n+3) { left: 70%; }

.ficha-campo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contenedor-avatar {
  position: relative;
}

.foto-miniatura, .inicial-miniatura {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid white;
  background: #222;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.es-capitan .foto-miniatura, 
.es-capitan .inicial-miniatura {
  border-color: #ffcc00;
  box-shadow: 0 0 10px #ffcc00;
}

.brazalete-capitan {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ffcc00;
  color: black;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid black;
  z-index: 15;
}

.nombre-campo {
  font-size: 11px;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 1px 5px;
  border-radius: 3px;
  margin-top: 3px;
  text-align: center;
  white-space: nowrap;
}

.nombre-equipo-contenedor {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  z-index: 5; 
}

.input-nombre-equipo {
  background: transparent;
  border: none;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.3);
  color: #ffcc00; 
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  width: 85%;
  outline: none;
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: text;
}

.input-nombre-equipo:focus {
  border-bottom: 2px solid #ffcc00;
  background: rgba(0, 0, 0, 0.1);
}

.marcador-info {
  margin-top: 20px;
  color: #d4af37;
  font-weight: bold;
  text-align: center;
}

.marcador-info.error { 
  color: #ff4444; 
}
.aviso { 
  font-size: 12px; margin-top: 5px; 
}

.zona-banquillo-campo {
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #d4af37;
  border-radius: 15px;
  padding: 15px;
}

.titulo-banquillo {
  color: #d4af37;
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-align: left;
  border-bottom: 1px solid #d4af37;
}

.contenedor-suplentes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.mini-tarjeta-suplente {
  width: 80px;
  text-align: center;
}

.foto-suplente {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #d4af37;
  margin: 0 auto;
  overflow: hidden;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
}

.foto-suplente img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nombre-suplente {
  color: white;
  font-size: 0.8rem;
  margin: 5px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pos-suplente {
  color: #d4af37;
  font-size: 0.6rem;
}
</style>