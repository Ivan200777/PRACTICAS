import { ref, watch } from 'vue' //El watch para que si vue encuentra un dato nuevo que no esté guardado, lo use

const datosGuardados = localStorage.getItem('misJugadores')

export const listaCompartida = ref(
  datosGuardados ? JSON.parse(datosGuardados) : [
    // --- TITULARES ---
    
    // Portero
    { 
      id: 1, nombre: 'Courtois', posicion: 'Portero', titular: true,
      goles: 0, asistencias: 0, amarillas: 5, rojas: 0, titulos: 22 
    },
    
    // Defensas
    { 
      id: 5, nombre: 'Nuno Mendes', posicion: 'Defensa', titular: true,
      goles: 6, asistencias: 18, amarillas: 20, rojas: 0, titulos: 11 
    },
    { 
      id: 2, nombre: 'William Saliba', posicion: 'Defensa', titular: true,
      goles: 7, asistencias: 3, amarillas: 14, rojas: 1, titulos: 5 
    },
    { 
      id: 3, nombre: 'Eric García', posicion: 'Defensa', titular: true,
      goles: 2, asistencias: 5, amarillas: 22, rojas: 2, titulos: 8 
    },
    { 
      id: 4, nombre: 'Achraf Hakimi', posicion: 'Defensa', titular: true,
      goles: 42, asistencias: 58, amarillas: 48, rojas: 2, titulos: 14 
    },

    // Centrocampistas
    { 
      id: 8, nombre: 'Pedri', posicion: 'Centrocampista', titular: true,
      goles: 28, asistencias: 22, amarillas: 15, rojas: 0, titulos: 9 
    },
    { 
      id: 7, nombre: 'Fermín López', posicion: 'Centrocampista', titular: true,
      goles: 18, asistencias: 8, amarillas: 9, rojas: 0, titulos: 5 
    },
    { 
      id: 6, nombre: 'Vitinha', posicion: 'Centrocampista', titular: true,
      goles: 20, asistencias: 25, amarillas: 24, rojas: 0, titulos: 12 
    },

    // Delanteros
    { 
      id: 11, nombre: 'Mbappe', posicion: 'Delantero', titular: true,
      goles: 395, asistencias: 165, amarillas: 52, rojas: 3, titulos: 21 
    },
    { 
      id: 9, nombre: 'Harry Kane', posicion: 'Delantero', titular: true,
      goles: 460, asistencias: 92, amarillas: 54, rojas: 0, titulos: 1 // ¡Su primera Bundesliga!
    },
    { 
      id: 10, nombre: 'Lamine Yamal', posicion: 'Delantero', titular: true,
      goles: 45, asistencias: 52, amarillas: 12, rojas: 0, titulos: 6 
    },

    // --- BANQUILLO ---
    { 
      id: 12, nombre: 'De Jong', posicion: 'Centrocampista', titular: false,
      goles: 30, asistencias: 40, amarillas: 42, rojas: 1, titulos: 8 
    },
    { 
      id: 13, nombre: 'Gabriel Magalhaes', posicion: 'Defensa', titular: false,
      goles: 18, asistencias: 2, amarillas: 32, rojas: 2, titulos: 4 
    },
    { 
      id: 14, nombre: 'Dani Güiza', posicion: 'Delantero', titular: false,
      goles: 215, asistencias: 40, amarillas: 55, rojas: 4, titulos: 4 
    }
  ]
)

//Cada vez que la lista cambie guardamos la versión actualizada automáticamente
watch(
  listaCompartida, 
  (nuevaLista) => {
    localStorage.setItem('misJugadores', JSON.stringify(nuevaLista))
  },
  { deep: true } //deep sirve para detectar cambios dentro de los objetos
)