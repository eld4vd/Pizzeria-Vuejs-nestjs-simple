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
            <h1 class="mb-3 mt-5 bread">Lee Nuestro Blog</h1>
            <p class="breadcrumbs"><span class="mr-2"><router-link to="/">Inicio</router-link></span> <span>Blog</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Blog Section -->
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section ftco-animate text-center">
          <h2 class="mb-4">Lee Nuestro Blog</h2>
          <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia, viven los textos ciegos.</p>
        </div>
      </div>
      <div class="row d-flex">
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/1" class="block-20" style="background-image: url('/images/image_1.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/1">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/2" class="block-20" style="background-image: url('/images/image_2.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/2">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/3" class="block-20" style="background-image: url('/images/image_3.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/3">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/4" class="block-20" style="background-image: url('/images/image_4.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/4">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/5" class="block-20" style="background-image: url('/images/image_5.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/5">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <router-link to="/blog/6" class="block-20" style="background-image: url('/images/image_6.jpg');"></router-link>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sep 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><router-link to="/blog/6">La Deliciosa Pizza</router-link></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div class="row mt-5">
        <div class="col text-center">
          <div class="block-27">
            <ul>
              <li><a href="#">&lt;</a></li>
              <li class="active"><span>1</span></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li><a href="#">4</a></li>
              <li><a href="#">5</a></li>
              <li><a href="#">&gt;</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Los estilos ya están incluidos en el CSS global del template */
</style>
