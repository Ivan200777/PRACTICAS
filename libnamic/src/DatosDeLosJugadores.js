import { ref } from 'vue'


export const listaCompartida = ref([
  //Portero
  {
    id: 1, nombre: 'Courtois', posicion: 'Portero', titular: true
  },
  //Defensa
    {id: 5, nombre: 'Nuno Mendes', posicion: 'Defensa', titular: true},
    {id: 2, nombre: 'William Saliba', posicion: 'Defensa', titular: true},
    {id: 3, nombre: 'Eric García', posicion: 'Defensa', titular: true},
    {id:4, nombre:"Achraf Hakimi", posicion: 'Defensa', titular:true},

  //Centrocampoista
  {
    id: 8, nombre: 'Pedri', posicion: 'Centrocampista', titular: true
  },
  {
    id: 7, nombre: 'Fermín López', posicion: 'Centrocampista', titular: true
  },
  {
    id: 6, nombre: 'Vitinha', posicion: 'Centrocampista', titular: true
  },

  //Delantero
  {
    id:11, nombre: 'Mbappe', posicion: 'Delantero', titular: true
  },
  {
    id:9, nombre: 'Harry Kane', posicion: 'Delantero', titular: true
  },
  {
    id:10, nombre: 'Lamine Yamal', posicion: 'Delantero', titular: true
  },

  //Banquillo
  {
    id:12, nombre: 'De Jong', posicion: 'Centrocampista', titular: false
  },
  {
    id:13, nombre: 'Gabriel Magalhaes', posicion: 'Defensa', titular: false
  },
  {
    id:14, nombre: 'Dani Guiza', posicion: 'Delantero', titular: false
  },
  ])
