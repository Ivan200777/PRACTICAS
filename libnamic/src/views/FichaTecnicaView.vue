<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'

const props = defineProps(['id'])
const route = useRoute()
const router = useRouter()

// 1. Lógica de Estado y Rutas
const esModoEdicion = computed(() => route.name === 'editar-jugador')

const miJugadorOriginal = computed(() => {
  return jugadores.value.find(j => String(j.id) === String(props.id))
})

const form = ref({
  nombre: '',
  posicion: '',
  email: '',
  telefono: '',
  foto: '',
  titular: false
})

const errores = ref({})

// 2. Sincronización del formulario (para que no salga vacío)
const cargarDatosAlFormulario = () => {
  if (miJugadorOriginal.value) {
    // Copiamos los datos actuales al formulario
    form.value = { ...miJugadorOriginal.value }
  }
}

// Vigilamos cuando entramos a la ruta de edición o cambia el ID
watch(() => [route.name, props.id], cargarDatosAlFormulario, { immediate: true })

const guardarCambios = () => {
  errores.value = {}

  if (form.value.nombre.length < 3) {
    errores.value.nombre = "Mínimo 3 caracteres."
  }

  if (Object.keys(errores.value).length === 0) {
    const index = jugadores.value.findIndex(j => String(j.id) === String(props.id))
    
    if (index !== -1) {
      // MEZCLA DE DATOS: Mantenemos estadísticas antiguas + nuevos datos del form
      jugadores.value[index] = { 
        ...jugadores.value[index], 
        ...form.value 
      }
      
      jugadores.value = [...jugadores.value] // Forzamos reactividad en Vue
      alert("¡Jugador actualizado correctamente!")
      
      // Volvemos a la vista normal
      router.push({ name: 'ficha-tecnica', params: { id: props.id } })
    }
  }
}
</script>

<template>
  <div v-if="miJugadorOriginal" class="tarjeta-detallada">
    
    <div class="bloque-superior">
      <router-link :to="{ name: 'jugadores' }" class="boton-volver">← Volver</router-link>
      
      <router-link v-if="!esModoEdicion" 
        :to="{ name: 'editar-jugador', params: { id: id } }" class="boton-editar-toggle">
        ⚙️ Editar
      </router-link>
      <router-link v-else 
        :to="{ name: 'ficha-tecnica', params: { id: id } }" class="boton-editar-toggle">
        ❌ Cancelar
      </router-link>
    </div>

    <div v-if="!esModoEdicion">
      <h1 class="nombre-jugador">{{ miJugadorOriginal.nombre }}</h1>
      <p class="datos-secundarios">{{ miJugadorOriginal.posicion }} | Dorsal #{{ miJugadorOriginal.id }}</p>
      
      <div class="info-contacto" v-if="miJugadorOriginal.email">
        <p>📧 {{ miJugadorOriginal.email }}</p>
        <p>📞 {{ miJugadorOriginal.telefono }}</p>
      </div>

      <p class="texto-titularidad">ESTADO: {{ miJugadorOriginal.titular ? 'TITULAR' : 'SUPLENTE' }}</p>

      <div class="rejilla-numeros">
        <div class="cuadro-dato">
          <span class="icono">⚽</span>
          <span class="etiqueta">Goles</span>
          <span class="cifra">{{ miJugadorOriginal.goles || 0 }}</span>
        </div>
        
        <div class="cuadro-dato">
          <span class="icono">👟</span>
          <span class="etiqueta">Asistencias</span>
          <span class="cifra">{{ miJugadorOriginal.asistencias || 0 }}</span>
        </div>

        <div class="cuadro-dato">
          <span class="icono">🏆</span>
          <span class="etiqueta">Títulos</span>
          <span class="cifra brillo-oro">{{ miJugadorOriginal.titulos || 0 }}</span>
        </div>

        <div class="cuadro-dato fila-tarjetas">
          <span class="marca-tarjeta">🟨 {{ miJugadorOriginal.amarillas || 0 }}</span>
          <span class="marca-tarjeta">🟥 {{ miJugadorOriginal.rojas || 0 }}</span>
        </div>
      </div>
    </div>

    <div v-else class="formulario-edicion">
      <h2 class="titulo-edit">Editar Perfil</h2>
      
      <div class="grupo-input">
        <label>Nombre Completo</label>
        <input v-model="form.nombre" type="text" :class="{'input-error': errores.nombre}">
        <small class="error-txt" v-if="errores.nombre">{{ errores.nombre }}</small>
      </div>

      <div class="grupo-input">
        <label>Email</label>
        <input v-model="form.email" type="email">
      </div>

      <div class="grupo-input">
        <label>Teléfono</label>
        <input v-model="form.telefono" type="text">
      </div>

      <div class="grupo-input">
        <label>URL Foto</label>
        <input v-model="form.foto" type="text">
      </div>

      <div class="grupo-input check">
        <input type="checkbox" v-model="form.titular" id="tit">
        <label for="tit">¿Es Titular?</label>
      </div>

      <button @click="guardarCambios" class="btn-guardar">GUARDAR CAMBIOS</button>
    </div>

  </div> 

  <div v-else class="aviso-error">
    <h2>Jugador no encontrado...</h2>
    <router-link :to="{ name: 'jugadores' }" class="boton-volver">Volver</router-link>
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
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.boton-editar-toggle {
  text-decoration: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
}

.nombre-jugador {
  color: #d4af37;
  margin-bottom: 0px;
  text-transform: uppercase;
  font-size: 32px;
}

.datos-secundarios {
  color: #aaa;
  margin-top: 5px;
  font-size: 16px;
}

.texto-titularidad {
  font-weight: bold;
  color: #d4af37;
  margin-top: 15px;
  font-size: 14px;
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

.fila-tarjetas {
  grid-column: span 2;
  flex-direction: row;
  justify-content: space-around;
}

.cifra {
  font-size: 28px; 
  font-weight: bold;
  margin-top: 5px;
}

.brillo-oro { color: #d4af37; }

.etiqueta {
  font-size: 11px; 
  text-transform: uppercase;
  color: #888;
}

.marca-tarjeta {
  font-weight: bold;
  font-size: 18px;
}

.formulario-edicion {
  text-align: left;
  margin-top: 20px;
}

.titulo-edit {
  color: #d4af37;
  font-size: 20px; 
  text-align: center;
  margin-bottom: 20px;
}

.grupo-input {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.grupo-input label {
  color: #d4af37;
  font-size: 13px; 
  margin-bottom: 5px;
  font-weight: bold;
}

.grupo-input input {
  background: #222;
  border: 1px solid #444;
  padding: 10px;
  color: white;
  border-radius: 8px;
  font-size: 14px;
}

.input-error { border-color: #ff4444 !important; }

.error-txt {
  color: #ff4444;
  font-size: 11px; 
  margin-top: 4px;
}

.grupo-input.check {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.btn-guardar {
  width: 100%;
  padding: 12px;
  background: #d4af37;
  color: black;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
}

.boton-volver {
  text-decoration: none;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.aviso-error {
  text-align: center;
  color: white;
  margin-top: 50px;
  font-size: 18px;
}
</style>