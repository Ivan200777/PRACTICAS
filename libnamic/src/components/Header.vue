
<!-- TEMPLATE = HTML (LOS COMENARIOS SON ACLARACIONES PARA MÍ) !-->
<template>
  <header class="header">
    <div class="logo">
      
        <h1>MI 11 <span>IDEAL</span></h1>
      
    </div>

    <nav>
        <ul class="nav-menu">
        <li><router-link to="/">Campo</router-link></li>
        <li><router-link to="/jugadores">Mis 11 elegidos</router-link></li>
        <li><router-link to="/banquillo">Banquillo</router-link></li>
        <li><router-link to="/sobres">SOBRES</router-link></li>
        <li><router-link to="/torneo" class="link-torneo-header">🏆 TORNEO</router-link></li>
        </ul>

    </nav>

  </header>
</template>
<!-- STYLE == CSS, Y ponemos scoped para que el estilo solo se aplique al header-->
<style scoped>
.header {
  background: #0b0a0a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  border-bottom: 2px solid #d4af37;
  color: white;
}
.logo h1 {
  font-size: 24px;
  letter-spacing: 2px;
}
.logo span{
  color: #d4af37;
}
.nav-menu{
 display: flex;
 list-style: none;
 gap: 30px;
}

/* ponemos a porque es lo equivalente al router-link que usamos anteriormente*/
.nav-menu a{
color: white;
text-decoration: none;
font-weight: bold;
text-transform: uppercase;
transition: 0.3s; /* es el tiempo que tarda en cambiar de color con el hover.
Se pone aquí y no dentro del hover.*/

}

.nav-menu a:hover{
    color:#d4af37;
}

.link-torneo-header {
  color: #d4af37 !important; 
  border: 1px solid #d4af37;
  padding: 5px 15px;
  border-radius: 5px;
}

.link-torneo-header:hover {
  background: #d4af37;
  color: black !important;
}
</style>