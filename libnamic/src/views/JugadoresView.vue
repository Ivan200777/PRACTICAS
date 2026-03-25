<script setup>
import TarjetaDeJugador from '@/components/TarjetaDeJugador.vue';
import {ref, computed} from 'vue' //ref sirve para actualizar la pantalla con nuevos datos
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'



const nuevoNombre = ref('')
const nuevaPosicion = ref('Portero')
const nuevoId = ref()
const busqueda = ref('')
const nuevosGoles = ref(0)
const nuevasAsistencias = ref(0)
const nuevasAmarillas = ref (0)
const nuevasRojas = ref (0)
const nuevosTitulos = ref(0)
const nuevaFoto = ref('')
const editandoId = ref(null)

  //Esto será para que el botón de fichar funcione
  const añadirFichaje=() => {
    if (nuevoNombre.value.trim() === '') return //El trim es para eliminar los espacios feos de un nombre

    if (editandoId.value) {
      // Si estamos editando, buscamos al jugador por su ID y actualizamos sus datos
      const index = jugadores.value.findIndex(j => j.id === editandoId.value)
      if (index !== -1) {
        jugadores.value[index].nombre = nuevoNombre.value
        jugadores.value[index].posicion = nuevaPosicion.value
        jugadores.value[index].foto = nuevaFoto.value.trim() !== '' ? nuevaFoto.value : null
      }
      editandoId.value = null // Resetear el estado de edición
    } else {
      // Creamos el nuevo objeto con todos los datos y el campo convocado para el examen
      const nuevo= {
        id: nuevoId.value || Date.now(), 
        nombre: nuevoNombre.value,
        posicion: nuevaPosicion.value,
        titular: false,
        convocado: false, 
        capitan: false,
        //Añado la foto, en caso de que haya texto en el input, lo guardamos y si no guarda un null
        foto:nuevaFoto.value.trim() !== '' ? nuevaFoto.value:null,
        goles: nuevosGoles.value,
        asistencias: nuevasAsistencias.value,
        amarillas: nuevasAmarillas.value,
        rojas: nuevasRojas.value,
        titulos: nuevosTitulos.value
      }
      jugadores.value.push(nuevo)
    }

    // Limpiar todos los inputs después de fichar o editar
    nuevoNombre.value = ''
    nuevoId.value = null //Esto es para limpiar inputs
    nuevosGoles.value = 0
    nuevasAsistencias.value = 0
    nuevasAmarillas.value = 0
    nuevasRojas.value = 0
    nuevosTitulos.value = 0
    nuevaPosicion.value = 'Portero'
    nuevaFoto.value = '';
}

  // Función para cargar los datos del jugador en el formulario de arriba
  const prepararEdicion = (j) => {
    nuevoNombre.value = j.nombre
    nuevaPosicion.value = j.posicion
    nuevaFoto.value = j.foto || ''
    editandoId.value = j.id
    window.scrollTo(0,0) // Subir el scroll para ver el formulario
  }

  //Como solo son 11, no podemos añadir jugadores sin quitar otros, por eso, vamos a poner una opción para mandar al banquillo y otra para mandar al 11 titular
const cambiarEstado = (id) => {
  const jugador = jugadores.value.find(j => j.id ===id)

  if (jugador){
    jugador.titular = !jugador.titular
  }
}

const borrarJugador = (id) => {
  if (confirm('¿Estás seguro de que quieres despedir a este jugador?')){
    jugadores.value= jugadores.value.filter(j => j.id !==id)
  }
}

const titularesFiltrados = computed(()=> {
  return jugadores.value
  .filter(j => j.titular)
  .filter(j => j.nombre.toLowerCase().includes(busqueda.value.toLowerCase())) //Filtramos por nombre
})

const elegirCapitan = (id) => {
  const jugador = jugadores.value.find(j => j.id === id)
  if (jugador) {
    if (!jugador.capitan) {
      // Limpiamos a todos los demás para que solo haya uno
      jugadores.value.forEach(j => {
        j.capitan = false
      })
      jugador.capitan = true
    } else {
      // Si ya era capitán, se lo quitamos
      jugador.capitan = false
    }
  }
}

</script>


<template>
  <div class="contenedor-principal">
    
    <div class="caja-fichaje">
      <h3 class="titulo-dorado">{{ editandoId ? 'EDITAR JUGADOR' : 'NUEVO FICHAJE' }}</h3>

      <div class="grupo-inputs-principales"> 
        <input v-model="nuevoNombre" type="text" placeholder="Nombre del jugador" class="input-base">

        <select v-model="nuevaPosicion" class="select-base">
          <option>Portero</option>
          <option>Defensa</option>
          <option>Centrocampista</option>
          <option>Delantero</option>
        </select>

        <input v-model.number="nuevoId" type="number" placeholder="Nº" class="input-dorsal">
        
        <input v-model="nuevaFoto" type="text" placeholder="URL de la foto (opcional)" class="input-base">
      </div>

      <button @click="añadirFichaje" class="boton-fichar">{{ editandoId ? 'GUARDAR CAMBIOS' : 'FICHAR' }}</button>
      
      <p class="preview-fichaje">
        {{ editandoId ? 'Editando a: ' : 'Vas a fichar a: ' }} <strong>{{ nuevoNombre }}</strong>
      </p>
    </div>

    <div class="contenedor-buscador">
     <input v-model="busqueda" type="text" placeholder="🔎 Buscar por nombre..." class="input-buscar">
    </div>

    <h2 class="titulo-dorado">PLANTILLA ACTUAL</h2>

    <ul class="lista-titulares">
      <li v-for="j in titularesFiltrados" 
    :key="j.id" 
    class="item-jugador" 
    :class="{ 'es-capitan': j.capitan }">
  
    <div v-if="j.capitan" class="brazalete-capitan">C</div>

    <button @click="borrarJugador(j.id)" class="Despedir">x</button>
    <button @click="prepararEdicion(j)" class="boton-editar">✏️</button>
  
    <button @click="elegirCapitan(j.id)" class="boton-capitan">
    {{ j.capitan ? '⭐ Capitán' : 'Nombrar Capitán' }}
    </button>

   <div class="contenedor-foto">
    <img v-if="j.foto" :src="j.foto" class="foto-real">
    <div v-else class="circulo-vacio">
      {{ j.nombre.charAt(0) }}
    </div>
  </div>

  <tarjeta-de-jugador :jugador="j"/>
  
  <button @click="cambiarEstado(j.id)" class="boton-banquillo">
    {{ j.titular ? '⬇️ Mandar al Banquillo' : '⬆️ Titular' }} 
  </button>

      </li>
    </ul>
  </div>
</template>

<style scoped>


.contenedor-principal {
  text-align: center;
  padding: 20px;
}

.caja-fichaje {
  margin-bottom: 30px;
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #d4af37;
}

.titulo-dorado {
  color: #d4af37;
  text-transform: uppercase;
}

/* Estilos de Formulario */
.grupo-inputs-principales {
  margin-bottom: 15px;
}

.input-base, .select-base, .input-dorsal, .input-buscar {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.input-base { margin-right: 10px; }
.input-dorsal { width: 60px; margin-right: 10px; }

/* Botones */
.boton-fichar {
  margin-top: 15px;
  padding: 10px 20px;
  background: #d4af37;
  color: black;
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
}

.boton-fichar:hover {
  background: #f1c40f;
  transform: scale(1.05);
}

.boton-banquillo {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: #444;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.boton-banquillo:hover {
  background: #d4af37;
  color: black;
}

/* Listas y Tarjetas */
.lista-titulares {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.item-jugador {
  margin: 15px;
  position: relative;
  display: inline-block;
}

.preview-fichaje {
  color: aliceblue;
  margin-top: 10px;
}

.contenedor-buscador {
  margin-bottom: 20px;
}

.input-buscar {
  width: 300px;
  border-radius: 20px;
  border: 1px solid #d4af37;
  background: #1a1a1a;
  color: white;
  text-align: center;
}

.Despedir{
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.8);
  color: #d4af37;
  border: 1px solid #d4af37;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boton-editar {
  position: absolute;
  top: 5px;
  right: 35px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.8);
  color: #d4af37;
  border: 1px solid #d4af37;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.foto-real, .circulo-vacio {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.foto-real {
  object-fit: cover;
}

.circulo-vacio {
  background-color: #333;
  color: #d4af37;      
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}

.es-capitan .foto-real, 
.es-capitan .circulo-vacio {
  border-color: #ffcc00; 
  box-shadow: 0 0 15px #ffcc00;
}

.brazalete-capitan {
  position: absolute;
  top: 10px;
  left: -5px;
  background: #d4af37;
  color: black;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  z-index: 20;
}

.boton-capitan {
  background: none;
  border: 1px solid #d4af37;
  color: #d4af37;
  font-size: 11px;
  cursor: pointer;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>