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

const soltarJugador = (indexDestino) => {
  const indexOrigen = jugadorArrastradoIndex.value
  
  if (indexOrigen !== null) {
    if (esSuplenteArrastrado.value) {
      // Cambio: Suplente por Titular
      const jugadorEntra = suplentes.value[indexOrigen]
      const jugadorSale = titulares.value[indexDestino]
      
      jugadorEntra.titular = true
      jugadorSale.titular = false
    } else if (indexOrigen !== indexDestino) {
      // Cambio: Titular por Titular (Posiciones)
      const idOrigen = titulares.value[indexOrigen].id
      const idDestino = titulares.value[indexDestino].id

      const realIndexOrigen = jugadores.value.findIndex(j => j.id === idOrigen)
      const realIndexDestino = jugadores.value.findIndex(j => j.id === idDestino)

      const itemTemp = jugadores.value[realIndexOrigen]
      jugadores.value[realIndexOrigen] = jugadores.value[realIndexDestino]
      jugadores.value[realIndexDestino] = itemTemp
    }
    
    // Forzar actualización visual
    jugadores.value = [...jugadores.value]
  }
  jugadorArrastradoIndex.value = null
  esSuplenteArrastrado.value = false
}

const nombreEquipo = ref(localStorage.getItem('nombreMiEquipo') || 'MI 11 IDEAL')

const suplentes = computed(() => {
  return jugadores.value.filter(j => !j.titular)
})

const titulares = computed(() => jugadores.value.filter(j => j.titular))

const formacionActual = ref('4-4-2') 

const FORMACIONES = {
  '4-4-2': {
    slots: [
      { posicion: 'Portero',        left: 50, bottom: 5  },
      { posicion: 'Defensa',        left: 15, bottom: 22 },
      { posicion: 'Defensa',        left: 38, bottom: 22 },
      { posicion: 'Defensa',        left: 62, bottom: 22 },
      { posicion: 'Defensa',        left: 85, bottom: 22 },
      { posicion: 'Centrocampista', left: 15, bottom: 48 },
      { posicion: 'Centrocampista', left: 38, bottom: 48 },
      { posicion: 'Centrocampista', left: 62, bottom: 48 },
      { posicion: 'Centrocampista', left: 85, bottom: 48 },
      { posicion: 'Delantero',      left: 33, bottom: 75 },
      { posicion: 'Delantero',      left: 67, bottom: 75 },
    ]
  },
  '4-3-3': {
    slots: [
      { posicion: 'Portero',        left: 50, bottom: 5  },
      { posicion: 'Defensa',        left: 15, bottom: 22 },
      { posicion: 'Defensa',        left: 38, bottom: 22 },
      { posicion: 'Defensa',        left: 62, bottom: 22 },
      { posicion: 'Defensa',        left: 85, bottom: 22 },
      { posicion: 'Centrocampista', left: 22, bottom: 46 },
      { posicion: 'Centrocampista', left: 50, bottom: 42 },
      { posicion: 'Centrocampista', left: 78, bottom: 46 },
      { posicion: 'Delantero',      left: 15, bottom: 75 },
      { posicion: 'Delantero',      left: 50, bottom: 80 },
      { posicion: 'Delantero',      left: 85, bottom: 75 },
    ]
  },
  '3-5-2': {
    slots: [
      { posicion: 'Portero',        left: 50, bottom: 5  },
      { posicion: 'Defensa',        left: 22, bottom: 20 },
      { posicion: 'Defensa',        left: 50, bottom: 20 },
      { posicion: 'Defensa',        left: 78, bottom: 20 },
      { posicion: 'Centrocampista', left: 10, bottom: 48 },
      { posicion: 'Centrocampista', left: 30, bottom: 48 },
      { posicion: 'Centrocampista', left: 50, bottom: 48 },
      { posicion: 'Centrocampista', left: 70, bottom: 48 },
      { posicion: 'Centrocampista', left: 90, bottom: 48 },
      { posicion: 'Delantero',      left: 33, bottom: 76 },
      { posicion: 'Delantero',      left: 67, bottom: 76 },
    ]
  },
}

const cambiarFormacion = (nueva) => {
  formacionActual.value = nueva
  const slots = FORMACIONES[nueva].slots

  // Contamos cuántos de cada posición necesita la formación
  const necesarios = {}
  slots.forEach(s => {
    necesarios[s.posicion] = (necesarios[s.posicion] || 0) + 1
  })

  // Mandamos al banquillo a los titulares que sobran por posición
  const contadores = {}
  jugadores.value.forEach(j => {
    if (!j.titular) return
    contadores[j.posicion] = (contadores[j.posicion] || 0) + 1
    if (contadores[j.posicion] > (necesarios[j.posicion] || 0)) {
      j.titular = false
    }
  })

  // Subimos suplentes de la posición que falte
  const yaHay = {}
  jugadores.value.filter(j => j.titular).forEach(j => {
    yaHay[j.posicion] = (yaHay[j.posicion] || 0) + 1
  })
  jugadores.value.filter(j => !j.titular).forEach(j => {
    const necesita = necesarios[j.posicion] || 0
    const tiene    = yaHay[j.posicion]      || 0
    if (tiene < necesita) {
      j.titular = true
      yaHay[j.posicion] = tiene + 1
    }
  })

  jugadores.value = [...jugadores.value]
}

const titularesPorSlot = computed(() => {
  const slots = FORMACIONES[formacionActual.value].slots
  const contadores = {}
  const porPosicion = {}

  titulares.value.forEach(j => {
    if (!porPosicion[j.posicion]) porPosicion[j.posicion] = []
    porPosicion[j.posicion].push(j)
  })

  return slots.map(slot => {
    if (!contadores[slot.posicion]) contadores[slot.posicion] = 0
    const jugador = (porPosicion[slot.posicion] || [])[contadores[slot.posicion]]
    contadores[slot.posicion]++
    return jugador || null
  })
})

watch(nombreEquipo, (nuevoNombre) => {
  localStorage.setItem('nombreMiEquipo', nuevoNombre)
})
</script>

<template>
  <div class="escenario">
    <div class="selector-tactico">
      <button @click="cambiarFormacion('4-4-2')" :class="{activo: formacionActual === '4-4-2'}">4-4-2</button>
      <button @click="cambiarFormacion('4-3-3')" :class="{activo: formacionActual === '4-3-3'}">4-3-3</button>
      <button @click="cambiarFormacion('3-5-2')" :class="{activo: formacionActual === '3-5-2'}">3-5-2</button>
    </div>

    <div :class="['campo-futbol', 'formacion-' + formacionActual]">
      <input 
        v-model="nombreEquipo" 
        type="text" 
        placeholder="NOMBRE DE TU EQUIPO" 
        class="input-nombre-equipo"
      >
      <div class="linea-medio"></div>
      <div class="circulo-central"></div>
      <div class="area-grande"></div>
      <div class="area-pequeña"></div>
      
      <div
        v-for="(slot, index) in FORMACIONES[formacionActual].slots"
        :key="index"
        class="jugador-posicionado"
        :style="{ left: slot.left + '%', bottom: slot.bottom + '%' }"
        @dragover.prevent
        @drop="soltarJugador(index)"
      >
        <template v-if="titularesPorSlot[index]">
          <div class="ficha-campo" :class="{'es-capitan': titularesPorSlot[index].capitan}"
               draggable="true"
               @dragstart="empiezaArrastre(index)">
            <div class="contenedor-avatar">
              <img v-if="titularesPorSlot[index].foto" :src="titularesPorSlot[index].foto" class="foto-miniatura">
              <div v-else class="inicial-miniatura">{{ titularesPorSlot[index].nombre.charAt(0) }}</div>
              <span v-if="titularesPorSlot[index].capitan" class="brazalete-capitan">C</span>
            </div>
            <span class="nombre-campo">{{ titularesPorSlot[index].nombre }}</span>
          </div>
        </template>
      </div>

    </div> <!-- cierre campo-futbol -->


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
  cursor: grab;
  user-select: none;
}

.jugador-posicionado:active {
  cursor: grabbing;
  opacity: 0.5;
}

/* Posiciones */
.portero { bottom: 5%; left: 50%; }
.defensa { bottom: 22%; }
.defensa:nth-of-type(4n+1) { left: 20%; }
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

/* --- MOVIMIENTOS SEGÚN LA FORMACIÓN --- */

/* Si es 4-3-3, adelantamos un poco a los delanteros y centrocampistas */
.formacion-4-3-3 .centrocampista { bottom: 48%; }
.formacion-4-3-3 .delantero { bottom: 75%; }

/* Si es 3-5-2, reubicamos defensas y centrocampistas */
.formacion-3-5-2 .defensa { bottom: 18%; }
/* Ajuste para que solo haya 3 defensas visualmente */
.formacion-3-5-2 .defensa:nth-of-type(4) { display: none; } 

.formacion-3-5-2 .centrocampista { bottom: 50%; }
.formacion-3-5-2 .delantero { bottom: 78%; }

/* Transición suave para que "vuelen" a su sitio */
.jugador-posicionado {
  transition: all 0.6s ease-in-out;
}
</style>