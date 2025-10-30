<template>
  <div class="bradcam_area breadcam_bg overlay d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="bradcam_text text-center">
            <h3>Contacto</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="contact-section section-padding">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="contact-title">Contáctanos</h2>
        </div>
        <div class="col-lg-8">
          <form class="form-contact contact_form" @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <textarea
                    class="form-control w-100"
                    name="message"
                    v-model="form.message"
                    cols="30"
                    rows="9"
                    placeholder="Ingresa tu mensaje"
                  ></textarea>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input
                    class="form-control"
                    name="name"
                    v-model="form.name"
                    type="text"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input
                    class="form-control"
                    name="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Tu email"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <input
                    class="form-control"
                    name="subject"
                    v-model="form.subject"
                    type="text"
                    placeholder="Asunto"
                  />
                </div>
              </div>
            </div>
            <div class="form-group mt-3">
              <button type="submit" class="button button-contactForm btn_4">Enviar Mensaje</button>
            </div>
          </form>
        </div>
        <div class="col-lg-4">
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-home"></i></span>
            <div class="media-body">
              <h3>Dirección</h3>
              <p>Santa Cruz, Bolivia</p>
            </div>
          </div>
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-tablet"></i></span>
            <div class="media-body">
              <h3>+10 367 453 7382</h3>
              <p>Lun a Vie 9am a 6pm</p>
            </div>
          </div>
          <div class="media contact-info">
            <span class="contact-info__icon"><i class="ti-email"></i></span>
            <div class="media-body">
              <h3>info@burger.com</h3>
              <p>¡Envíanos tu consulta!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', form)
  // Aquí implementarás el envío del formulario al backend
  alert('Formulario enviado (implementar backend)')
}
</script>
