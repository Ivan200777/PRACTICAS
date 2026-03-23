<script setup>
import TarjetaDeJugador from '../components/TarjetaDeJugador.vue'
import { listaCompartida as jugadores } from '@/DatosDeLosJugadores.js'

const cambiarEstado = (id) => {
  // Buscamos al jugador por su ID en la lista compartida
  const j = jugadores.value.find(jug => jug.id === id)

  // Lógica para no pasarse de 11 titulares
  if (j && !j.titular) {
    const totalTitulares = jugadores.value.filter(jug => jug.titular).length
    if (totalTitulares >= 11) {
      alert("¡Ya tienes 11 titulares! Debes bajar a alguien al banquillo primero.")
      return 
    }
  }

  if (j) {
    // Si es titular pasa a ser falso, y viceversa
    j.titular = !j.titular
  }
}

// Nueva función para borrar jugadores desde el banquillo
const borrarJugador = (id) => {
  if (confirm('¿Estás seguro de que quieres despedir a este suplente?')) {
    jugadores.value = jugadores.value.filter(j => j.id !== id)
  }
}
</script>

<template>
  <div class="pagina-banquillo">
    <h2 class="titulo-dorado">ZONA DE SUPLENTES</h2>
    <div class="zona-reservas">
      <p v-if="jugadores.filter(j => !j.titular).length === 0" class="mensaje-vacio">
        No hay suplentes por ahora
      </p>

  <ul class="lista-suplentes">        
    <li v-for="jugador in jugadores.filter(j => !j.titular)" :key="jugador.id" class="suplente">
        <button @click="borrarJugador(jugador.id)" class="Despedir">
            x
          </button>
          
            <div class="contenedor-foto">
        <img v-if="jugador.foto" :src="jugador.foto" class="foto-real">
        <div v-else class="circulo-vacio">
          {{ jugador.nombre.charAt(0) }}
        </div>
     </div>

          <tarjeta-de-jugador :jugador="jugador"/>

          <button @click="cambiarEstado(jugador.id)" class="boton-subir">
            ⬆️ Subir a Titular
          </button>
     </li>
    </ul>
  </div>
</div>
</template> 
          
  <style scoped>
.pagina-banquillo {
  text-align: center;
  padding: 50px;
}

.titulo-dorado {
  color: #d4af37;
  text-transform: uppercase;
}

.zona-reservas {
  width: 100%;
  max-width: 900px; /* Un poco más ancho para que quepan mejor las tarjetas */
  border: 2px dashed #666;
  margin: 20px auto;
  padding: 30px;
  border-radius: 15px;
}

.mensaje-vacio {
  color: aliceblue;
  font-style: italic;
}

/* Estilos de la Lista */
.lista-suplentes {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Espaciado moderno entre tarjetas */
}

.suplente {
  position: relative;
  display: inline-block;
}

/* Botones */
.boton-subir {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: #d4af37;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.boton-subir:hover {
  background: #f1c40f;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
}

/* Estilo para el botón de borrar (X) */
.Despedir {
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
  transition: 0.3s;
}

.Despedir:hover {
  background: #d4af37;
  color: black;
  transform: scale(1.1);
}
.contenedor-foto {
  margin-bottom: 10px;
  display: flex;
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
  margin: 0 auto;
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
  box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.2);
}
</style>