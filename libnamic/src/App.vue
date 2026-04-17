<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />

  <main class="contenedor-principal">
    <router-view />
  </main>

  <Footer />
</template>

<style>
/* Estilos Globales */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #1a1a1a;
  color: white;
}

.contenedor-principal {
  min-height: 70vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Este estilo es por si quieres usarlo dentro del Header */
.link-torneo {
  color: #ffd700 !important;
  font-weight: bold;
  text-decoration: none;
  padding: 5px 12px;
  border: 1px solid #ffd700;
  border-radius: 5px;
  transition: 0.3s;
}

.link-torneo:hover {
  background: #ffd700;
  color: black !important;
}
</style>