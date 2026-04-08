<script setup>
import { ref, computed, watch } from 'vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'

const jugadorArrastradoIndex = ref(null) 
const esSuplenteArrastrado = ref(false) 

const empiezaArrastre = (index) => {
  jugadorArrastradoIndex.value = index
  esSuplenteArrastrado.value = false
}

const empiezaArrastreSuplente = (index) => {
  jugadorArrastradoIndex.value = index
  esSuplenteArrastrado.value = true
}

const idJugadorEntrante = ref(null) 

const soltarJugador = (indexDestino) => {
  const indexOrigen = jugadorArrastradoIndex.value
  if (indexOrigen === null) return

  if (esSuplenteArrastrado.value) {
    // CASO: Suplente entra al campo
    const jugadorEntra = suplentes.value[indexOrigen]
    const jugadorSale = titularesPorSlot.value[indexDestino]

    if (jugadorEntra && jugadorSale) {
      idJugadorEntrante.value = jugadorEntra.id // Activamos flecha
      
      const idxIn = jugadores.value.findIndex(j => j.id === jugadorEntra.id)
      const idxOut = jugadores.value.findIndex(j => j.id === jugadorSale.id)
      
      jugadores.value[idxIn].titular = true
      jugadores.value[idxOut].titular = false

      setTimeout(() => { idJugadorEntrante.value = null }, 3000) // Desaparece en 3s
    }
  } else {
    // CASO: Intercambio entre titulares
    const jugadorOrigen = titularesPorSlot.value[indexOrigen]
    const jugadorDestino = titularesPorSlot.value[indexDestino]

    if (jugadorOrigen && jugadorDestino && jugadorOrigen.id !== jugadorDestino.id) {
      const realIdxOri = jugadores.value.findIndex(j => j.id === jugadorOrigen.id)
      const realIdxDes = jugadores.value.findIndex(j => j.id === jugadorDestino.id)
      
      const temp = jugadores.value[realIdxOri]
      jugadores.value[realIdxOri] = jugadores.value[realIdxDes]
      jugadores.value[realIdxDes] = temp
    }
  }
  
  jugadores.value = [...jugadores.value]
  jugadorArrastradoIndex.value = null
  esSuplenteArrastrado.value = false
}

const nombreEquipo = ref(localStorage.getItem('nombreMiEquipo') || 'MI 11 IDEAL')

const suplentes = computed(() => {
  return jugadores.value.filter(j => !j.titular)
})

const titulares = computed(() => jugadores.value.filter(j => j.titular))

const formacionActual = ref('4-3-3') 

const FORMACIONES = {
  '4-4-2': {
    slots: [
      { rol: 'Portero', left: 50, bottom: 5  },
      { rol: 'LI',      left: 15, bottom: 22 },
      { rol: 'DFC',     left: 38, bottom: 22 },
      { rol: 'DFC',     left: 62, bottom: 22 },
      { rol: 'LD',      left: 85, bottom: 22 },
      { rol: 'MI',      left: 15, bottom: 48 },
      { rol: 'MC',      left: 38, bottom: 48 },
      { rol: 'MC',      left: 62, bottom: 48 },
      { rol: 'MD',      left: 85, bottom: 48 },
      { rol: 'DC',      left: 33, bottom: 75 },
      { rol: 'DC',      left: 67, bottom: 75 },
    ]
  },
  '4-3-3': {
    slots: [
      { rol: 'Portero', left: 50, bottom: 5  },
      { rol: 'LI',      left: 15, bottom: 22 },
      { rol: 'DFC',     left: 38, bottom: 22 },
      { rol: 'DFC',     left: 62, bottom: 22 },
      { rol: 'LD',      left: 85, bottom: 22 },
      { rol: 'MC',      left: 22, bottom: 46 },
      { rol: 'MC',      left: 50, bottom: 42 },
      { rol: 'MC',      left: 78, bottom: 46 },
      { rol: 'EI',      left: 15, bottom: 75 },
      { rol: 'DC',      left: 50, bottom: 80 },
      { rol: 'ED',      left: 85, bottom: 75 },
    ]
  },
  '3-5-2': {
    slots: [
      { rol: 'Portero', left: 50, bottom: 5  },
      { rol: 'DFC',     left: 22, bottom: 20 },
      { rol: 'DFC',     left: 50, bottom: 20 },
      { rol: 'DFC',     left: 78, bottom: 20 },
      { rol: 'MI',      left: 10, bottom: 48 },
      { rol: 'MC',      left: 30, bottom: 48 },
      { rol: 'MC',      left: 50, bottom: 48 },
      { rol: 'MC',      left: 70, bottom: 48 },
      { rol: 'MD',      left: 90, bottom: 48 },
      { rol: 'DC',      left: 33, bottom: 76 },
      { rol: 'DC',      left: 67, bottom: 76 },
    ]
  },
}

const cambiarFormacion = (nueva) => {
  formacionActual.value = nueva
  const slots = FORMACIONES[nueva].slots

  // 1. Mapeamos los roles de los slots a las categorías de los jugadores
  // Esto traduce 'LI', 'DFC', 'LD' a 'Defensa', etc.
  const necesarios = {
    'Portero': 0,
    'Defensa': 0,
    'Centrocampista': 0,
    'Delantero': 0
  }

  slots.forEach(s => {
    if (s.rol === 'Portero') necesarios['Portero']++
    else if (['LI', 'LD', 'DFC', 'Defensa'].includes(s.rol)) necesarios['Defensa']++
    else if (['MC', 'MI', 'MD', 'Centrocampista'].includes(s.rol)) necesarios['Centrocampista']++
    else if (['DC', 'EI', 'ED', 'Delantero'].includes(s.rol)) necesarios['Delantero']++
  })

  // 2. Mandamos al banquillo a los que sobran
  const contadores = { 'Portero': 0, 'Defensa': 0, 'Centrocampista': 0, 'Delantero': 0 }
  
  jugadores.value.forEach(j => {
    if (!j.titular) return
    contadores[j.posicion]++
    if (contadores[j.posicion] > (necesarios[j.posicion] || 0)) {
      j.titular = false
    }
  })

  // 3. Subimos suplentes si faltan para completar los 11
  const yaHay = { 'Portero': 0, 'Defensa': 0, 'Centrocampista': 0, 'Delantero': 0 }
  jugadores.value.filter(j => j.titular).forEach(j => {
    yaHay[j.posicion]++
  })

  jugadores.value.forEach(j => {
    if (j.titular) return
    const necesita = necesarios[j.posicion] || 0
    const tiene = yaHay[j.posicion] || 0
    if (tiene < necesita) {
      j.titular = true
      yaHay[j.posicion]++
    }
  })

  jugadores.value = [...jugadores.value]
}
const titularesPorSlot = computed(() => {
  const slots = FORMACIONES[formacionActual.value].slots
  
  // Filtramos los titulares por la posición que tienen en DatosDeLosJugadores.js
  const pS = titulares.value.filter(j => j.posicion === 'Portero')
  const dS = titulares.value.filter(j => j.posicion === 'Defensa')
  const mS = titulares.value.filter(j => j.posicion === 'Centrocampista')
  const fS = titulares.value.filter(j => j.posicion === 'Delantero')

  let pIdx = 0, dIdx = 0, mIdx = 0, fIdx = 0

  return slots.map(slot => {
    if (slot.rol === 'Portero') return pS[pIdx++] || null
    if (['LI', 'LD', 'DFC', 'Defensa'].includes(slot.rol)) return dS[dIdx++] || null
    if (['MC', 'MI', 'MD', 'Centrocampista'].includes(slot.rol)) return mS[mIdx++] || null
    if (['DC', 'EI', 'ED', 'Delantero'].includes(slot.rol)) return fS[fIdx++] || null
    return null
  })
})

watch(nombreEquipo, (nuevoNombre) => {
  localStorage.setItem('nombreMiEquipo', nuevoNombre)
})

const hacerCapitan = (jugador) => {
  if (!jugador) return

  // 1. Buscamos al que ya es capitán y le quitamos el rango
  jugadores.value.forEach(j => {
    if (j.capitan) j.capitan = false
  })

  // 2. Buscamos al jugador clickeado en el array original y lo hacemos capitán
  const realIndex = jugadores.value.findIndex(j => j.id === jugador.id)
  if (realIndex !== -1) {
    jugadores.value[realIndex].capitan = true
  }

  jugadores.value = [...jugadores.value]
  
  localStorage.setItem('misJugadores', JSON.stringify(jugadores.value))
}

const limpiarCampo = () => {
  // Confirmamos para que no borren el equipo por error
  if (confirm('¿Quieres mandar a todos los jugadores al banquillo?')) {
    jugadores.value.forEach(j => {
      j.titular = false
    })
    // Forzamos la actualización
    jugadores.value = [...jugadores.value]
  }
}
</script>

<template>
  <div class="escenario">
    
    <div class="selector-tactico">
      <button @click="cambiarFormacion('4-4-2')" :class="{activo: formacionActual === '4-4-2'}">4-4-2</button>
      <button @click="cambiarFormacion('4-3-3')" :class="{activo: formacionActual === '4-3-3'}">4-3-3</button>
      <button @click="cambiarFormacion('3-5-2')" :class="{activo: formacionActual === '3-5-2'}">3-5-2</button>
      <button @click="limpiarCampo" class="btn-limpiar">🗑️ Limpiar</button>
    </div>

    <div :class="['campo-futbol', 'formacion-' + formacionActual]">
      <input v-model="nombreEquipo" type="text" placeholder="NOMBRE DE TU EQUIPO" class="input-nombre-equipo">

      <div class="linea-medio"></div>
      <div class="circulo-central"></div>
      <div class="area-grande"></div>
      <div class="area-pequeña"></div>

      <div v-if="titulares.length === 0" class="campo-vacio-msg">
        ARRASTRA JUGADORES PARA EMPEZAR
      </div>
      
      <div v-for="(slot, index) in FORMACIONES[formacionActual].slots"
           :key="index"
           class="jugador-posicionado"
           :style="{ left: slot.left + '%', bottom: slot.bottom + '%' }"
           @dragover.prevent
           @drop="soltarJugador(index)">

        <template v-if="titularesPorSlot[index]">
          <div class="ficha-campo" 
               :class="{'es-capitan': titularesPorSlot[index].capitan}"
               draggable="true"
               @dragstart="empiezaArrastre(index)"
               @dblclick="hacerCapitan(titularesPorSlot[index])"> 
            
            <div class="contenedor-avatar">
              <div v-if="idJugadorEntrante === titularesPorSlot[index].id" class="indicador-cambio">▲</div>
              <img v-if="titularesPorSlot[index].foto" :src="titularesPorSlot[index].foto" class="foto-miniatura">
              <div v-else class="inicial-miniatura">{{ titularesPorSlot[index].nombre.charAt(0) }}</div>
              <span v-if="titularesPorSlot[index].capitan" class="brazalete-capitan">C</span>
            </div>
            <span class="nombre-campo">{{ titularesPorSlot[index].nombre }}</span>
          </div>
        </template>
      </div>
    </div> 

    <div class="zona-banquillo-campo">
      <h3 class="titulo-banquillo">BANQUILLO</h3>
      <div class="contenedor-suplentes">
        <div v-for="(j, index) in suplentes" 
             :key="j.id" 
             class="mini-tarjeta-suplente"
             draggable="true"
             @dragstart="empiezaArrastreSuplente(index)">
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
  overflow: visible;
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
  cursor: grab;
  user-select: none;
}

.jugador-posicionado:active {
  cursor: grabbing;
  opacity: 0.5;
}

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
  position: relative;
  z-index: 1;
}

.marcador-info {
  margin-top: 20px;
  color: #d4af37;
  font-weight: bold;
  text-align: center;
}

.marcador-info.error { color: #ff4444; }
.aviso { font-size: 12px; margin-top: 5px; }

/* Estilos Banquillo */
.zona-banquillo-campo {
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #d4af37;
  border-radius: 15px;
  padding: 15px;
  width: 100%;
  max-width: 500px;
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
  cursor: grab;
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
}

.pos-suplente {
  color: #d4af37;
  font-size: 0.6rem;
}

/* Estilos de los botones */
.selector-tactico {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.selector-tactico button {
  padding: 8px 15px;
  cursor: pointer;
  background: #222;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 5px;
  font-weight: bold;
  transition: 0.3s;
}

.selector-tactico button.activo {
  background: #d4af37;
  color: black;
}

.jugador-posicionado {
  transition: all 0.6s ease-in-out;
}

.ficha-campo {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.ficha-campo:hover {
  transform: scale(1.1); /* Se hace un pelín más grande al pasar el ratón */
}

.brazalete-capitan {
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  animation: pulso-capitan 2s infinite;
}

@keyframes pulso-capitan {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Animación para la flecha de cambio */
.indicador-cambio {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ff00;
  font-size: 20px;
  filter: drop-shadow(0 0 5px #00ff00);
  animation: salto-flecha 0.6s infinite alternate;
  z-index: 30;
}

@keyframes salto-flecha {
  from { transform: translateX(-50%) translateY(0); }
  to { transform: translateX(-50%) translateY(-8px); }
}

/* Efecto al pasar el ratón por la ficha */
.ficha-campo {
  transition: transform 0.2s ease, filter 0.2s ease;
}

.ficha-campo:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}
.btn-limpiar {
  background: #441111 !important; /* Un rojo oscuro para indicar acción de borrar */
  color: #ffaaaa !important;
  border-color: #ff4444 !important;
  margin-left: 15px; /* Separación de las formaciones */
}

.btn-limpiar:hover {
  background: #661111 !important;
  transform: scale(1.05);
}
.campo-vacio-msg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  pointer-events: none; /* Importante para que no estorbe al soltar jugadores */
  border: 2px dashed rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
}

</style>