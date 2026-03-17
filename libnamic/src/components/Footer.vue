<template>
<footer class="footer">
<div class="contenido-footer">
<p>&copy; 2026 - Mi 11 Ideal | Iván Sarmiento</p> <!-- El &copy es para que salga el símbolo de copyright-->
<div class="enlaces-footer">

<span>ESTADIO</span>
<span>•</span>
<span>PALMARÉS</span>
<span>•</span> <!-- Los puntos, o según google los 'bullet' sirven para separar-->
<span>CLUB</span>
</div>
</div>

</footer>
</template>

<style scoped>

.footer{
    background-color: black;
    padding: 20px 0;
    border-top: 2px solid #d4af37;
    text-align: center;
    margin-top: 50px;
}
.enlaces-footer{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 15px;
    font-size:12px;
    letter-spacing: 2px;
    color: #d4af37;
}

.enlaces-footer span{
    font-weight: bold;
}

p{
    color: aliceblue;
    font-size: 14px;
}
</style>