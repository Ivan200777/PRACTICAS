<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { listaCompartida as datosBase } from '@/DatosDeLosJugadores.js'


const jugadores = ref(JSON.parse(localStorage.getItem('miPlantillaGuardada')) || datosBase)


const canvasReferencia = ref(null)
const dibujando = ref(false)
const ctx= ref(null)
const modoPizarra = ref(false)

onMounted(()=> {
  ctx.value = canvasReferencia.value.getContext('2d')
  ctx.value.strokeStyle ='#ffff00'
  ctx.value.lineWidth=3
  ctx.value.lineJoin = 'round'
  ctx.value.lineCap = 'round'

})

const empezarDibujo = (e) => {
  if (!modoPizarra.value) return;
  dibujando.value = true;
  const {offsetX, offsetY} =e;
  ctx.value.beginPath();
  ctx.value.moveTo(offsetX, offsetY);
  
}

const dibujar = (e) =>{
  if(!dibujando.value) return
  const {offsetX, offsetY}=e
  ctx.value.lineTo(offsetX,offsetY)
  ctx.value.stroke()
}

const pararDibujo= () =>{
  dibujando.value=false
}

const borrarPizarra = () => {
  ctx.value.clearRect(0,0,canvasReferencia.value.width, canvasReferencia.value.height)
}

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
  const jugadorEntra = suplentes.value[indexOrigen];
  const jugadorSale = titularesPorSlot.value[indexDestino]; // Puede ser null

  if (jugadorEntra) {
    const idxIn = jugadores.value.findIndex(j => j.id === jugadorEntra.id);
    jugadores.value[idxIn].titular = true; // El suplente ahora es titular

    if (jugadorSale) {
      const idxOut = jugadores.value.findIndex(j => j.id === jugadorSale.id);
      jugadores.value[idxOut].titular = false;
    }
    
    idJugadorEntrante.value = jugadorEntra.id;
    setTimeout(() => { idJugadorEntrante.value = null }, 3000);
  }
}else {
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

  const contadores = { 'Portero': 0, 'Defensa': 0, 'Centrocampista': 0, 'Delantero': 0 }
  
  jugadores.value.forEach(j => {
    if (!j.titular) return
    contadores[j.posicion]++
    if (contadores[j.posicion] > (necesarios[j.posicion] || 0)) {
      j.titular = false
    }
  })

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
  

  return slots.map((_, index) => {
    return titulares.value[index] || null
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

watch(jugadores, (nuevosDatos) => {
  localStorage.setItem('miPlantillaGuardada', JSON.stringify(nuevosDatos))
}, { deep: true })


const busqueda = ref('')
const suplentesFiltrados = computed(() => {
  const listaSuplentes = jugadores.value.filter(j => !j.titular)
  if (!busqueda.value) return listaSuplentes
  
  return listaSuplentes.filter(j => 
    j.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

const idJugadorEnFoco = ref(null)

const resaltarPosiciones = (jugador) => {
  idJugadorEnFoco.value = jugador
}

const quitarResaltado = () => {
  idJugadorEnFoco.value = null
}

const esPosicionCorrecta = (rolSlot) => {
  if (!idJugadorEnFoco.value) return false
  
  const pos = idJugadorEnFoco.value.posicion
  if (pos === 'Portero' && rolSlot === 'Portero') return true
  if (pos === 'Defensa' && ['LI', 'LD', 'DFC'].includes(rolSlot)) return true
  if (pos === 'Centrocampista' && ['MC', 'MI', 'MD'].includes(rolSlot)) return true
  if (pos === 'Delantero' && ['DC', 'EI', 'ED'].includes(rolSlot)) return true
  
  return false
}

const obtenerEmojiPosicion = (posicion) => {
  const mapa = {
    'Portero': '🧤',
    'Defensa': '🛡️',
    'Centrocampista': '🪄',
    'Delantero': '🎯'
  }
  return mapa[posicion] || '🏃'
}

const guardarEnSlot = (numeroSlot) => {
  const nombreKey = `miPlantilla_Slot_${numeroSlot}`;
  localStorage.setItem(nombreKey, JSON.stringify(jugadores.value));
  localStorage.setItem(`${nombreKey}_formacion`, formacionActual.value);
  alert(`✅ Táctica guardada en el Slot ${numeroSlot}`);
}

const cargarSlot = (numeroSlot) => {
  const nombreKey = `miPlantilla_Slot_${numeroSlot}`;
  const datosGuardados = localStorage.getItem(nombreKey);
  const formacionGuardada = localStorage.getItem(`${nombreKey}_formacion`);
  
  if (datosGuardados) {
    jugadores.value = JSON.parse(datosGuardados);
    if (formacionGuardada) formacionActual.value = formacionGuardada;
    alert(`📂 Slot ${numeroSlot} cargado con éxito`);
  } else {
    alert(`❌ El Slot ${numeroSlot} está vacío`);
  }
}

const jugadorSeleccionado = ref(null);

const abrirDetalles = (jugador) => {
  if (!jugador) return;
  jugadorSeleccionado.value = jugador;
}

const cerrarDetalles = () => {
  jugadorSeleccionado.value = null;
}
</script>

<template>
  <div class="escenario">
    
    <div class="selector-tactico">
      <button @click="cambiarFormacion('4-4-2')" :class="{activo: formacionActual === '4-4-2'}">4-4-2</button>
      <button @click="cambiarFormacion('4-3-3')" :class="{activo: formacionActual === '4-3-3'}">4-3-3</button>
      <button @click="cambiarFormacion('3-5-2')" :class="{activo: formacionActual === '3-5-2'}">3-5-2</button>
      <button @click="limpiarCampo" class="btn-limpiar">🗑️ Limpiar</button>
      <div class="contenedor-slots">
        <div class="grupo-slot">
          <span>Slot 1:</span>
          <button @click="guardarEnSlot(1)">💾 Guardar</button>
          <button @click="cargarSlot(1)">📂 Cargar</button>
        </div>
        <div class="grupo-slot">
          <span>Slot 2:</span>
          <button @click="guardarEnSlot(2)">💾 Guardar</button>
          <button @click="cargarSlot(2)">📂 Cargar</button>
        </div>
      </div>

      <button 
        @click="modoPizarra = !modoPizarra" 
        :class="{ activo: modoPizarra }"
      >
        {{ modoPizarra ? '💾 Guardar Táctica' : '✏️ Dibujar' }}
      </button>

      <button v-if="modoPizarra" @click="borrarPizarra" class="btn-pizarra">
        🗑️ Borrar Dibujo
      </button>
    </div>

    <div :class="['campo-futbol', 'formacion-' + formacionActual]">
      <input v-model="nombreEquipo" type="text" placeholder="NOMBRE DE TU EQUIPO" class="input-nombre-equipo">

      <div class="linea-medio"></div>
      <div class="circulo-central"></div>
      <div class="area-grande"></div>
      <div class="area-pequeña"></div>

      <canvas 
        ref="canvasReferencia"
        width="500" 
        height="650"
        class="pizarra-tactica"
        :class="{ 'pizarra-activa': modoPizarra }"
        @mousedown="empezarDibujo"
        @mousemove="dibujar"
        @mouseup="pararDibujo"
        @mouseleave="pararDibujo"
      ></canvas>

      <button @click="borrarPizarra" class="btn-pizarra">✏️ Borrar Táctica</button>
      
      <div v-if="titulares.length === 0" class="campo-vacio-msg">
        ARRASTRA JUGADORES PARA EMPEZAR
      </div>
      
      <div v-for="(slot, index) in FORMACIONES[formacionActual].slots"
           :key="index"
           class="jugador-posicionado"
           :style="{ left: slot.left + '%', bottom: slot.bottom + '%' }"
           @dragover.prevent
           @drop="soltarJugador(index)"
           :class="{ 'posicion-recomendada': esPosicionCorrecta(slot.rol) }">

        <template v-if="titularesPorSlot[index]">
          <div class="ficha-campo" 
            :class="[
            {'es-capitan': titularesPorSlot[index].capitan}, 
            titularesPorSlot[index].clase 
            ]"
            draggable="true"
            @dragstart="empiezaArrastre(index)"
            @dblclick="hacerCapitan(titularesPorSlot[index])"
            @click="abrirDetalles(titularesPorSlot[index])">
            <div class="contenedor-avatar">
              <img v-if="titularesPorSlot[index].foto" :src="titularesPorSlot[index].foto" class="foto-miniatura">
              <div v-else class="inicial-miniatura">{{ titularesPorSlot[index].nombre.charAt(0) }}</div>
  
              <span class="dorsal-ficha">{{ titularesPorSlot[index].id || '?' }}</span>
  
              <div v-if="idJugadorEntrante === titularesPorSlot[index].id" class="indicador-cambio">▲</div>
            </div>
              <span class="nombre-campo">
                <span class="emoji-posicion">{{ obtenerEmojiPosicion(titularesPorSlot[index].posicion) }}</span>
                  {{ titularesPorSlot[index].nombre }}
              </span>          
              </div>
        </template>
      </div>
    </div> 

  <div class="zona-banquillo-campo">
  <h3 class="titulo-banquillo">BANQUILLO</h3>
  
  <input v-model="busqueda" type="text" placeholder="🔍 Buscar jugador..." class="buscador-suplentes">

  <div class="contenedor-suplentes">
    <div v-for="(j, index) in suplentesFiltrados" 
         :key="j.id" 
         class="mini-tarjeta-suplente"
         draggable="true"
         @dragstart="empiezaArrastreSuplente(index)"
         @mouseenter="resaltarPosiciones(j)"
         @mouseleave="quitarResaltado"
         @click="abrirDetalles(j)">
      <div class="foto-suplente">
        <img v-if="j.foto" :src="j.foto">
        <span v-else>{{ j.nombre.charAt(0) }}</span>
      </div>
      <p class="nombre-suplente">{{ j.nombre }}</p>
      <small class="pos-suplente">#{{ j.dorsal || '?' }} - {{ j.posicion }}</small>
       </div>
      </div>
    </div>
</div>

    <div class="marcador-info" :class="{ 'error': titulares.length !== 11 }">
      Titulares: {{ titulares.length }} / 11
      <p v-if="titulares.length !== 11" class="aviso">Debes elegir exactamente 11 titulares</p>

      <Transition name="fade">
  <div v-if="jugadorSeleccionado" class="capa-oscura" @click="cerrarDetalles">
    <div :class="['tarjeta-cromo-pro', jugadorSeleccionado.clase]" @click.stop>

    <div class="media-badge">{{ jugadorSeleccionado.media || '?' }}</div>
  
  <div class="contenido-cromo">
    </div>
      
      <div class="efecto-brillo"></div>
      <div class="textura-fondo"></div>

      <div class="contenido-cromo">
        <div class="cromo-header-pro">
          <div class="dorsal-pro">{{ jugadorSeleccionado.id }}</div>
          <img v-if="jugadorSeleccionado.foto" :src="jugadorSeleccionado.foto" class="foto-pro">
          <div v-else class="foto-pro-vacia">{{ jugadorSeleccionado.nombre.charAt(0) }}</div>
        </div>

        <div class="cromo-info-pro">
          <h2>{{ jugadorSeleccionado.nombre }}</h2>
          <span class="posicion-pro">{{ obtenerEmojiPosicion(jugadorSeleccionado.posicion) }} {{ jugadorSeleccionado.posicion }}</span>
          
          <div class="stats-premium">
            <div class="stat-box"><span>GOL</span><strong>{{ jugadorSeleccionado.goles || 0 }}</strong></div>
            <div class="stat-box"><span>ASI</span><strong>{{ jugadorSeleccionado.asistencias || 0 }}</strong></div>
            <div class="stat-box"><span>TIT</span><strong>{{ jugadorSeleccionado.titulos || 0 }}</strong></div>
            <div class="stat-box"><span>ROJ</span><strong>{{ jugadorSeleccionado.rojas || 0 }}</strong></div>
          </div>
        </div>

        <button class="btn-cerrar-pro" @click="cerrarDetalles">VOLVER AL CAMPO</button>
      </div>
    </div>
  </div>
</Transition>
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

.pizarra-tactica {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  cursor: crosshair;
  touch-action: none;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Esta clase se activará solo cuando modoPizarra sea true */
.pizarra-activa {
  pointer-events: auto;
  opacity: 1;
}

.btn-pizarra {
  background: #333 !important;
  color: #ffff00 !important;
  border-color: #ffff00 !important;
}

.jugador-posicionado {
  position: absolute;
  transform: translateX(-50%);
  z-index: 10;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
}


.jugador-posicionado:not(:has(.ficha-campo)) {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

/* Feedback visual al pasar un jugador por encima de un hueco */
.jugador-posicionado:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #ffcc00;
}

.dorsal-ficha {
  position: absolute;
  top: -5px;
  left: -5px;
  background: #ff4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid white;
  z-index: 20;
}

.buscador-suplentes {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 20px;
  background: #222;
  border: 1px solid #d4af37;
  border-radius: 8px;
  color: white;
}

.buscador-suplentes:focus {
  border-color: #ffffff;
  box-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
}

.posicion-recomendada {
  box-shadow: 0 0 20px #ffcc00 !important;
  border: 2px solid #ffcc00 !important;
  transform: translateX(-50%) scale(1.2) !important;
}

.ficha-campo {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.4));
  border-radius: 10px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.es-capitan {
  background: linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(0, 0, 0, 0.6)) !important;
  border: 1px solid #ffcc00 !important;
}

/* Estilos Slots */
.contenedor-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 8px;
}
.grupo-slot span { color: #d4af37; font-size: 12px; margin-right: 5px; }

.capa-oscura {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.tarjeta-cromo {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  border: 3px solid #d4af37;
  width: 280px; padding: 20px;
  border-radius: 20px; text-align: center;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
}

.cromo-foto { 
width: 120px; 
height: 120px; 
border-radius: 50%; 
border: 3px solid #d4af37; 
object-fit: cover; }

.stats-grid { 
display: grid; 
grid-template-columns: 1fr 1fr; 
gap: 10px; 
margin-top: 15px; }

.stat-item { 
background: rgba(255,255,255,0.1); 
padding: 5px; 
border-radius: 5px; 
font-size: 14px; 
color: white; }

.stat-item span { 
color: #d4af37; 
font-weight: bold; 
margin-right: 5px; }

.btn-cerrar-cromo { 
margin-top: 20px; 
background: #d4af37; 
border: none; 
padding: 10px 20px; 
font-weight: bold; 
cursor: pointer; 
border-radius: 5px; }

/* Una animación, para que no esté tan aburridete */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.etiqueta-capitan {
  background: #d4af37;
  color: black;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 10px;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

/* Oro */
.ficha-campo.oro {
  background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #aa771c 100%) !important;
  border: 2px solid #fff5b7 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.5) !important;
}
.ficha-campo.oro .nombre-campo {
  background: rgba(0, 0, 0, 0.8) !important;
  color: #f5d061 !important;
  border-top: 1px solid #f5d061;
}

/* Fuego (Goleadores o muy destacados) */
.ficha-campo.fuego {
  background: linear-gradient(180deg, #ff4500 0%, #b71c1c 100%) !important;
  border: 2px solid #ffab40 !important;
  animation: brillo-fuego 2s infinite alternate;
}
.ficha-campo.fuego .nombre-campo {
  background: #222 !important;
  color: #ff4500 !important;
  text-shadow: 0 0 5px #ff4500;
}

@keyframes brillo-fuego {
  from { box-shadow: 0 0 5px #ff4500, inset 0 0 5px #fff; }
  to { box-shadow: 0 0 20px #ff4500, inset 0 0 10px #ff4500; }
}

/* Leyenda (Jugadores con una gran trayectoria) */
.ficha-campo.leyenda {
  background: radial-gradient(circle, #434343 0%, #000 100%) !important;
  border: 2px solid #ffffff !important;
  box-shadow: 0 4px 15px rgba(255,255,255,0.2) !important;
}
.ficha-campo.leyenda .foto-miniatura {
  filter: grayscale(1) contrast(1.2);
}

@keyframes pulso-fuego {
  0% { box-shadow: 0 0 10px #ff4500; }
  50% { box-shadow: 0 0 30px #ff8c00; }
  100% { box-shadow: 0 0 10px #ff4500; }
}

/* Oro */
.oro {
  border: 2px solid #ffd700 !important;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.ficha-campo.oro .nombre-campo {
  background: #ffd700 !important;
  color: #000 !important;
}
.tarjeta-cromo.oro {
  background: linear-gradient(135deg, #bf953f, #fcf6ba, #aa771c) !important;
}

/* Fuego */
.fuego {
  border: 2px solid #ff4500 !important;
  animation: pulso-fuego-mini 2s infinite;
}
.ficha-campo.fuego .nombre-campo {
  background: #ff4500 !important;
}
.tarjeta-cromo.fuego {
  background: linear-gradient(180deg, #800000, #ff4500) !important;
}

/* Leyenda */
.leyenda {
  border: 2px solid #c0c0c0 !important;
}
.ficha-campo.leyenda .foto-miniatura {
  filter: sepia(0.5) contrast(1.2);
}
.tarjeta-cromo.leyenda {
  background: linear-gradient(135deg, #1a1a1a, #434343) !important;
}

/* Animación para el efecto de fuego */
@keyframes pulso-fuego-mini {
  0% { box-shadow: 0 0 5px #ff4500; }
  50% { box-shadow: 0 0 15px #ff8c00; }
  100% { box-shadow: 0 0 5px #ff4500; }
}

.tarjeta-cromo-pro {
  position: relative;
  width: 300px;
  border-radius: 15px;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 4px solid #fff;
  transition: transform 0.3s ease;
}

/* Metemos un efecto de estructura y brillo que nos ha prporcionado la IA */
.textura-fondo {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
  opacity: 0.1;
  z-index: 1;
}

.efecto-brillo {
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 70%);
  animation: brillo-pasante 4s infinite linear;
  z-index: 2;
  pointer-events: none;
}

@keyframes brillo-pasante {
  0% { transform: translate(-30%, -30%); }
  100% { transform: translate(30%, 30%); }
}

.tarjeta-cromo-pro.oro {
  background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
  border-color: #f5d061;
}
.tarjeta-cromo-pro.oro h2 { color: #4b3a07; }

.tarjeta-cromo-pro.fuego {
  background: linear-gradient(180deg, #b71c1c, #ff5722);
  border-color: #ffab40;
  animation: latido-fuego 2s infinite alternate;
}
@keyframes latido-fuego {
  from { box-shadow: 0 0 20px #ff5722; }
  to { box-shadow: 0 0 40px #ff5722, inset 0 0 20px rgba(255,255,255,0.3); }
}

.tarjeta-cromo-pro.leyenda {
  background: linear-gradient(135deg, #2c3e50, #000000);
  border-color: #bdc3c7;
}
.tarjeta-cromo-pro.leyenda .foto-pro { filter: grayscale(100%) contrast(1.2); }

.contenido-cromo { position: relative; z-index: 5; }

.foto-pro {
  width: 150px; height: 150px;
  border-radius: 50%;
  border: 5px solid rgba(255,255,255,0.8);
  object-fit: cover;
  background: #111;
}
.stats-premium {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; margin: 15px 0;
}
.stat-box {
  background: rgba(0,0,0,0.6);
  padding: 8px; border-radius: 8px;
  color: white; display: flex; justify-content: space-between;
}

.stat-box span { 
  color: #aaa; 
  font-size: 0.7rem; }

.btn-cerrar-pro {
  width: 100%; 
  padding: 10px; 
  border: none;
  border-radius: 5px; 
  font-weight: bold;
  background: white; 
  cursor: pointer;
}
</style>