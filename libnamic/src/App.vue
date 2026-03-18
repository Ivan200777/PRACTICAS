<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header/>>

  <main>
    <router-view/>
  </main>

  <Footer/>

</template>

<style>
/* Lo que voy a hacer por lo que he encontrado de información, es poner 
un estilo básico para que no salga todo pegado a los bordes*/

body {
  margin: 0px;
  padding: 0px;
  font-family: sans-serif;
  background-color: #1a1a1a; 
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
