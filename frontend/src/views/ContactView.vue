<script setup lang="ts">
import { reactive, onMounted, nextTick } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', form)
  // Aquí implementarás el envío del formulario al backend
  alert('Formulario enviado correctamente')
  // Reset form
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}

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
            <h1 class="mb-3 mt-5 bread">Contáctanos</h1>
            <p class="breadcrumbs"><span class="mr-2"><router-link to="/">Inicio</router-link></span> <span>Contacto</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="ftco-section contact-section">
    <div class="container mt-5">
      <div class="row block-9">
        <div class="col-md-4 contact-info ftco-animate">
          <div class="row">
            <div class="col-md-12 mb-4">
              <h2 class="h4">Información de Contacto</h2>
            </div>
            <div class="col-md-12 mb-3">
              <p><span>Dirección:</span> Calle 21 Oeste 198, Suite 721 New York NY 10016</p>
            </div>
            <div class="col-md-12 mb-3">
              <p><span>Teléfono:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
            </div>
            <div class="col-md-12 mb-3">
              <p><span>Email:</span> <a href="mailto:info@restaurante.com">info@restaurante.com</a></p>
            </div>
            <div class="col-md-12 mb-3">
              <p><span>Sitio Web:</span> <a href="#">restaurante.com</a></p>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-6 ftco-animate">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <input type="text" v-model="form.name" class="form-control" placeholder="Tu Nombre" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <input type="email" v-model="form.email" class="form-control" placeholder="Tu Email" required>
                </div>
              </div>
            </div>
            <div class="form-group">
              <input type="text" v-model="form.subject" class="form-control" placeholder="Asunto" required>
            </div>
            <div class="form-group">
              <textarea v-model="form.message" cols="30" rows="7" class="form-control" placeholder="Mensaje" required></textarea>
            </div>
            <div class="form-group">
              <input type="submit" value="Enviar Mensaje" class="btn btn-primary py-3 px-5">
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Map Section (opcional - puedes descomentar cuando tengas Google Maps API key) -->
  <!-- <div id="map" style="height: 400px;"></div> -->
</template>

<style scoped>
/* Los estilos ya están incluidos en el CSS global del template */
</style>
