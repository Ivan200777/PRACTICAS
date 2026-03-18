<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>

<Header />

  <main>
    <router-view />
  </main>

  <Footer />
  
</template>

<style>
/* Lo que voy a hacer por lo que he encontrado de información, es poner 
un estilo básico para que no salga todo pegado a los bordes*/

.menu-navegacion{
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #000;
}
.menu-navegacion a{
  color: #d4af37;
  text-decoration: none;
  font-weight: bold;
  transform: 0.3s ;
}
body {
  margin: 0px;
  padding: 0px;
  font-family: sans-serif;
  background-color: #1a1a1a; 
}

.menu-navegacion a:hover{
  color: white
}
.contenedor-principal {
  min-height: 600px; /* Altura mínima para que la web no esté aplastada */
  padding: 40px 20px; /* 40px arriba/abajo y 20px a los lados */
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}
main{
  margin-top: 20px;
  margin-bottom: 20px;}


</style>
