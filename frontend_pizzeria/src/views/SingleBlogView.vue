<template>
  <div class="bradcam_area breadcam_bg overlay d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="bradcam_text text-center">
            <h3>Blog Details</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="blog_area single-post-area section-padding">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <div class="single-post">
            <h2>Detalle del Blog Post</h2>
            <p>Aquí se mostrará el contenido completo del blog post seleccionado</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
// Aquí obtendrás el ID del blog desde route.params
</script>
