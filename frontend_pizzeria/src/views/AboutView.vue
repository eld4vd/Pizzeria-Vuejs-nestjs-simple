<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (typeof (window as any).AOS !== 'undefined') {
        (window as any).AOS.refresh()
      }
    }, 500)
  })
})
</script>

<template>
  <!-- Hero Section -->
  <section class="home-slider owl-carousel img" style="background-image: url(/images/bg_1.jpg);">
    <div class="slider-item" style="background-image: url(/images/bg_3.jpg);">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text justify-content-center align-items-center">
          <div class="col-md-7 col-sm-12 text-center ftco-animate">
            <h1 class="mb-3 mt-5 bread">Acerca de Nosotros</h1>
            <p class="breadcrumbs"><span class="mr-2"><router-link to="/">Inicio</router-link></span> <span>Acerca</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Info Section -->
  <section class="ftco-intro">
    <div class="container-wrap">
      <div class="wrap d-md-flex">
        <div class="info">
          <div class="row no-gutters">
            <div class="col-md-4 d-flex ftco-animate">
              <div class="icon"><span class="icon-phone"></span></div>
              <div class="text">
                <h3>000 (123) 456 7890</h3>
                <p>Un pequeño río llamado Duden fluye</p>
              </div>
            </div>
            <div class="col-md-4 d-flex ftco-animate">
              <div class="icon"><span class="icon-my_location"></span></div>
              <div class="text">
                <h3>Calle 21 Oeste 198</h3>
                <p>Suite 721 New York NY 10016</p>
              </div>
            </div>
            <div class="col-md-4 d-flex ftco-animate">
              <div class="icon"><span class="icon-clock-o"></span></div>
              <div class="text">
                <h3>Abierto Lunes-Viernes</h3>
                <p>8:00am - 9:00pm</p>
              </div>
            </div>
          </div>
        </div>
        <div class="social d-md-flex pl-md-5 p-4 align-items-center">
          <ul class="social-icon">
            <li class="ftco-animate"><a href="#"><span class="icon-twitter"></span></a></li>
            <li class="ftco-animate"><a href="#"><span class="icon-facebook"></span></a></li>
            <li class="ftco-animate"><a href="#"><span class="icon-instagram"></span></a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="ftco-about d-md-flex">
    <div class="one-half img" style="background-image: url(/images/about.jpg);"></div>
    <div class="one-half ftco-animate">
      <div class="heading-section ftco-animate ">
        <h2 class="mb-4">Bienvenido a <span class="flaticon-pizza"></span> Nuestro Restaurante</h2>
      </div>
      <div>
        <p>En su camino se encontró con una copia. La copia advirtió al Texto Ciego Pequeño que, de donde venía, habría sido reescrita mil veces y todo lo que quedaba de su origen sería la palabra "y" y el Texto Ciego Pequeño debería dar la vuelta y regresar a su propio país seguro. Pero nada de lo que dijo la copia pudo convencerla, por lo que no pasó mucho tiempo hasta que unos insidiosos Escritores de Copias la emboscaron, la emborracharon con Longe y Parole y la arrastraron a su agencia, donde abusaron de ella.</p>
      </div>
    </div>
  </section>

  <!-- Chefs Section -->
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section ftco-animate text-center">
          <h2 class="mb-4">Nuestros Chefs</h2>
          <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
          <p class="mt-5">Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia, viven los textos ciegos.</p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 d-flex mb-sm-4 ftco-animate">
          <div class="staff">
            <div class="img mb-4" style="background-image: url(/images/person_1.jpg);"></div>
            <div class="info text-center">
              <h3><a href="#">Tom Smith</a></h3>
              <span class="position">Chef Principal</span>
              <div class="text">
                <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 d-flex mb-sm-4 ftco-animate">
          <div class="staff">
            <div class="img mb-4" style="background-image: url(/images/person_2.jpg);"></div>
            <div class="info text-center">
              <h3><a href="#">Mark Wilson</a></h3>
              <span class="position">Chef de Pasta</span>
              <div class="text">
                <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 d-flex mb-sm-4 ftco-animate">
          <div class="staff">
            <div class="img mb-4" style="background-image: url(/images/person_3.jpg);"></div>
            <div class="info text-center">
              <h3><a href="#">Patrick Jacobson</a></h3>
              <span class="position">Chef de Cocina</span>
              <div class="text">
                <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 d-flex mb-sm-4 ftco-animate">
          <div class="staff">
            <div class="img mb-4" style="background-image: url(/images/person_4.jpg);"></div>
            <div class="info text-center">
              <h3><a href="#">Ivan Dorchsner</a></h3>
              <span class="position">Chef Pastelero</span>
              <div class="text">
                <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Los estilos ya están incluidos en el CSS global del template */
</style>
