import { ref, watch } from 'vue' //El watch para que si vue encuentra un dato nuevo que no esté guardado, lo use

const datosGuardados = localStorage.getItem('misJugadores')

export const listaCompartida = ref(
  datosGuardados ? JSON.parse(datosGuardados) : [
    // --- TITULARES ---
    
    // Portero
    { 
      id: 1, nombre: 'Courtois', posicion: 'Portero', titular: true, convocado: false, foto: "Imagenes/Courtois.jpg",
      goles: 0, asistencias: 0, amarillas: 5, rojas: 0, titulos: 22, capitan: false, clase: 'oro'
    },
    
    // Defensas
    { 
      id: 5, nombre: 'Nuno Mendes', posicion: 'Defensa', titular: true, convocado: false ,foto:"Imagenes/Nuno mendes.jpg",
      goles: 6, asistencias: 18, amarillas: 20, rojas: 0, titulos: 11, capitan: false, clase: 'fuego'
    },
    { 
      id: 2, nombre: 'William Saliba', posicion: 'Defensa', titular: true, convocado:false, foto:"Imagenes/Saliba.jpg",
      goles: 7, asistencias: 3, amarillas: 14, rojas: 1, titulos: 5, capitan: false, clase: 'oro'
    },
    { 
      id: 3, nombre: 'Eric García', posicion: 'Defensa', titular: true, convocado: false, foto:"Imagenes/Eric.jpg",
      goles: 2, asistencias: 5, amarillas: 22, rojas: 2, titulos: 8, capitan: false, clase: 'oro'
    },
    { 
      id: 4, nombre: 'Achraf Hakimi', posicion: 'Defensa', titular: true, convocado: false, foto:"Imagenes/Achraf.jpg",
      goles: 42, asistencias: 58, amarillas: 48, rojas: 2, titulos: 14, capitan: false, clase: 'fuego'
    },

    // Centrocampistas
    { 
      id: 8, nombre: 'Pedri', posicion: 'Centrocampista', titular: true, convocado: false, foto:"Imagenes/Pedri.jpg",
      goles: 28, asistencias: 22, amarillas: 15, rojas: 0, titulos: 9, capitan: false, clase: 'fuego'
    },
    { 
      id: 7, nombre: 'Fermín López', posicion: 'Centrocampista', titular: true, convocado: false, foto: "Imagenes/fermin.jpg",
      goles: 18, asistencias: 8, amarillas: 9, rojas: 0, titulos: 5, capitan: false, clase: 'oro'
    },
    { 
      id: 6, nombre: 'Vitinha', posicion: 'Centrocampista', titular: true, convocado: false, foto: "Imagenes/Vitinha.jpg",
      goles: 20, asistencias: 25, amarillas: 24, rojas: 0, titulos: 12, capitan: false, clase: 'oro'
    },

    // Delanteros
    { 
      id: 11, nombre: 'Mbappe', posicion: 'Delantero', titular: true, convocado: false, foto:"Imagenes/mbappe.jpg",
      goles: 395, asistencias: 165, amarillas: 52, rojas: 3, titulos: 21, capitan: false, clase: 'fuego'
    },
    { 
      id: 9, nombre: 'Harry Kane', posicion: 'Delantero', titular: true, convocado: false, foto:"Imagenes/kane.jpg",
      goles: 460, asistencias: 92, amarillas: 54, rojas: 0, titulos: 1, capitan: false, clase: 'fuego'
    },
    { 
      id: 10, nombre: 'Lamine Yamal', posicion: 'Delantero', titular: true, convocado: false, foto:"Imagenes/lamine.jpg",
      goles: 45, asistencias: 52, amarillas: 12, rojas: 0, titulos: 6, capitan: false, clase: 'fuego'
    },

    // --- BANQUILLO ---
    { 
      id: 12, nombre: 'De Jong', posicion: 'Centrocampista', titular: false, convocado: false, foto:"Imagenes/de jong.jpg",
      goles: 30, asistencias: 40, amarillas: 42, rojas: 1, titulos: 8, capitan: false, clase: 'oro'
    },
    { 
      id: 13, nombre: 'Gabriel Magalhaes', posicion: 'Defensa', titular: false,convocado: false, foto:"Imagenes/magalhaes.jpg",
      goles: 18, asistencias: 2, amarillas: 32, rojas: 2, titulos: 4, capitan: false, clase: 'oro'
    },
    { 
      id: 14, nombre: 'Dani Güiza', posicion: 'Delantero', titular: false, convocado: false, foto:"Imagenes/guiza.jpg",
      goles: 215, asistencias: 40, amarillas: 55, rojas: 4, titulos: 4, capitan: false, clase: 'leyenda'
    },
    { 
    id: 15, nombre: 'Olise', posicion: 'Delantero', titular: false, convocado: false, foto: "Imagenes/olise.jpg",
    goles: 45, asistencias: 30, amarillas: 8, rojas: 0, titulos: 3, capitan: false, clase: 'fuego'
    },
    { 
    id: 16, nombre: 'Kanté', posicion: 'Centrocampista', titular: false, convocado: false, foto: "Imagenes/kante.jpg",
    goles: 18, asistencias: 22, amarillas: 35, rojas: 1, titulos: 12, capitan: false, clase: 'leyenda' 
    },
    { 
    id: 17, nombre: 'Messi', posicion: 'Delantero', titular: false, convocado: false, foto: "Imagenes/messi.jpg",
    goles: 850, asistencias: 380, amarillas: 62, rojas: 3, titulos: 44, capitan: false, clase: 'leyenda'
    },
    { 
    id: 18, nombre: 'Militão', posicion: 'Defensa', titular: false, convocado: false, foto: "Imagenes/militao.jpg",
    goles: 12, asistencias: 4, amarillas: 28, rojas: 2, titulos: 16, capitan: false, clase: 'oro'
    }
    ]
)

// Estos NO están en la lista inicial, solo se consiguen abriendo sobres.
export const poolExclusivos = [
  { id: 201, nombre: 'Zidane', posicion: 'Centrocampista', clase: 'leyenda', goles: 125, asistencias: 110, titulos: 15, foto: "Imagenes/zidane.jpg", titular: false, convocado: false },
  { id: 202, nombre: 'Ronaldo', posicion: 'Delantero', clase: 'leyenda', goles: 352, asistencias: 70, titulos: 18, foto: "Imagenes/ronaldo.jpg", titular: false, convocado: false },
  { id: 203, nombre: 'Ronaldinho', posicion: 'Delantero', clase: 'leyenda', goles: 196, asistencias: 160, titulos: 13, foto: "Imagenes/ronaldinho.jpg", titular: false, convocado: false },
  { id: 204, nombre: 'Casillas', posicion: 'Portero', clase: 'leyenda', goles: 0, asistencias: 1, titulos: 24, foto: "Imagenes/casillas.jpg", titular: false, convocado: false },
  { id: 205, nombre: 'Vinícius Jr', posicion: 'Delantero', clase: 'fuego', goles: 95, asistencias: 82, titulos: 12, foto: "Imagenes/vini.jpg", titular: false, convocado: false },
  { id: 206, nombre: 'Haaland', posicion: 'Delantero', clase: 'fuego', goles: 250, asistencias: 45, titulos: 7, foto: "Imagenes/haaland.jpg", titular: false, convocado: false },
  { id: 207, nombre: 'De Bruyne', posicion: 'Centrocampista', clase: 'fuego', goles: 102, asistencias: 202, titulos: 20, foto: "Imagenes/debruyne.jpg", titular: false, convocado: false },
  { id: 208, nombre: 'Bellingham', posicion: 'Centrocampista', clase: 'fuego', goles: 55, asistencias: 40, titulos: 5, foto: "Imagenes/jude.jpg", titular: false, convocado: false },
  { id: 209, nombre: 'Salah', posicion: 'Delantero', clase: 'fuego', goles: 210, asistencias: 95, titulos: 9, foto: "Imagenes/salah.jpg", titular: false, convocado: false },
  { id: 210, nombre: 'Wirtz', posicion: 'Centrocampista', clase: 'fuego', goles: 45, asistencias: 55, titulos: 3, foto: "Imagenes/wirtz.jpg", titular: false, convocado: false },
  { id: 211, nombre: 'Rodri', posicion: 'Centrocampista', clase: 'oro', goles: 25, asistencias: 30, titulos: 12, foto: "Imagenes/rodri.jpg", titular: false, convocado: false },
  { id: 212, nombre: 'Saka', posicion: 'Delantero', clase: 'oro', goles: 60, asistencias: 55, titulos: 2, foto: "Imagenes/saka.jpg", titular: false, convocado: false },
  { id: 213, nombre: 'Davies', posicion: 'Defensa', clase: 'oro', goles: 15, asistencias: 35, titulos: 14, foto: "Imagenes/davies.jpg", titular: false, convocado: false },
  { id: 214, nombre: 'Ruben Dias', posicion: 'Defensa', clase: 'oro', goles: 12, asistencias: 5, titulos: 10, foto: "Imagenes/dias.jpg", titular: false, convocado: false },
  { id: 215, nombre: 'Ter Stegen', posicion: 'Portero', clase: 'oro', goles: 0, asistencias: 2, titulos: 16, foto: "Imagenes/terstegen.jpg", titular: false, convocado: false },
  { id: 216, nombre: 'Gavi', posicion: 'Centrocampista', clase: 'oro', goles: 10, asistencias: 15, titulos: 3, foto: "Imagenes/gavi.jpg", titular: false, convocado: false },
  { id: 217, nombre: 'Theo Hdez', posicion: 'Defensa', clase: 'oro', goles: 30, asistencias: 40, titulos: 5, foto: "Imagenes/theo.jpg", titular: false, convocado: false },
  { id: 218, nombre: 'Griezmann', posicion: 'Delantero', clase: 'oro', goles: 240, asistencias: 110, titulos: 8, foto: "Imagenes/griezmann.jpg", titular: false, convocado: false },
  { id: 219, nombre: 'Valverde', posicion: 'Centrocampista', clase: 'oro', goles: 25, asistencias: 25, titulos: 11, foto: "Imagenes/valverde.jpg", titular: false, convocado: false },
  { id: 220, nombre: 'Bernardo Silva', posicion: 'Centrocampista', clase: 'oro', goles: 65, asistencias: 75, titulos: 15, foto: "Imagenes/bernardo.jpg", titular: false, convocado: false }
]
watch(
  listaCompartida, 
  (nuevaLista) => {
    localStorage.setItem('misJugadores', JSON.stringify(nuevaLista))
  },
  { deep: true } //deep sirve para detectar cambios dentro de los objetos

  
)







