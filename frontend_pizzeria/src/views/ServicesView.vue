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
    <div class="slider-item" style="background-image: url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200);">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text justify-content-center align-items-center">
          <div class="col-md-7 col-sm-12 text-center ftco-animate">
            <h1 class="mb-3 mt-5 bread">Nuestros Servicios</h1>
            <p class="breadcrumbs"><span class="mr-2"><router-link to="/">Inicio</router-link></span> <span>Servicios</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Services Section -->
  <section class="ftco-section ftco-services">
    <div class="overlay"></div>
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-9 heading-section ftco-animate text-center">
          <h2 class="mb-4">Servicios Premium</h2>
          <p class="lead">En Restaurante Delicious, ofrecemos una experiencia gastronómica completa con servicios diseñados para satisfacer todas tus necesidades culinarias.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="flaticon-pizza-1"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Pizzas Artesanales</h3>
              <p>Elaboradas con masa fresca diaria, ingredientes premium y horneadas en horno de piedra a 450°C. Más de 15 variedades únicas.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="flaticon-bicycle"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Delivery Express</h3>
              <p>Entrega en 30 minutos o menos. Sistema de rastreo en tiempo real y empaque térmico que mantiene tu comida caliente.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="flaticon-diet"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Opciones Saludables</h3>
              <p>Masa integral, vegana y sin gluten disponible. Ingredientes orgánicos y opciones bajas en calorías sin sacrificar sabor.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="icon-user"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Eventos Privados</h3>
              <p>Catering para fiestas, cumpleaños y eventos corporativos. Menús personalizados y servicio profesional a domicilio.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="icon-credit-card"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Pagos Flexibles</h3>
              <p>Aceptamos efectivo, tarjetas, QR y pagos online. Programa de puntos de recompensa y promociones especiales.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 mb-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-4">
              <span class="icon-star"></span>
            </div>
            <div class="media-body">
              <h3 class="heading mb-3">Garantía de Calidad</h3>
              <p>Si no quedas satisfecho, te devolvemos tu dinero. Nuestro compromiso es tu satisfacción total.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Special Features Section -->
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section text-center ftco-animate">
          <h2 class="mb-4">¿Por Qué Elegirnos?</h2>
          <p>Nos distinguimos por nuestra pasión, calidad y compromiso con cada cliente</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4 ftco-animate">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body p-4">
              <div class="d-flex align-items-start">
                <div class="feature-icon mr-3">
                  <i class="fas fa-fire text-danger" style="font-size: 2.5rem;"></i>
                </div>
                <div>
                  <h4 class="card-title">Horno de Piedra</h4>
                  <p class="card-text">Nuestro horno italiano de piedra alcanza 450°C, creando una corteza perfectamente crujiente y un interior suave. La tradición napolitana en cada bocado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4 ftco-animate">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body p-4">
              <div class="d-flex align-items-start">
                <div class="feature-icon mr-3">
                  <i class="fas fa-leaf text-success" style="font-size: 2.5rem;"></i>
                </div>
                <div>
                  <h4 class="card-title">Ingredientes Frescos</h4>
                  <p class="card-text">Seleccionamos diariamente los mejores ingredientes locales. Tomates San Marzano, mozzarella di bufala y albahaca fresca cultivada orgánicamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4 ftco-animate">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body p-4">
              <div class="d-flex align-items-start">
                <div class="feature-icon mr-3">
                  <i class="fas fa-award text-warning" style="font-size: 2.5rem;"></i>
                </div>
                <div>
                  <h4 class="card-title">Chefs Certificados</h4>
                  <p class="card-text">Nuestros pizzaiolos han sido entrenados en Nápoles, Italia. Cada pizza es una obra de arte culinaria creada con técnicas tradicionales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4 ftco-animate">
          <div class="card h-100 border-0 shadow-sm hover-lift">
            <div class="card-body p-4">
              <div class="d-flex align-items-start">
                <div class="feature-icon mr-3">
                  <i class="fas fa-clock text-info" style="font-size: 2.5rem;"></i>
                </div>
                <div>
                  <h4 class="card-title">Servicio 24/7</h4>
                  <p class="card-text">Abiertos todos los días. Pedidos online disponibles las 24 horas con delivery nocturno los fines de semana. Tu antojo, cuando lo desees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Process Section -->
  <section class="ftco-section bg-light">
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section text-center ftco-animate">
          <h2 class="mb-4">Nuestro Proceso</h2>
          <p>De la cocina a tu mesa en 4 simples pasos</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 text-center ftco-animate">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-icon mb-3">
              <i class="fas fa-laptop" style="font-size: 3rem; color: #fca100;"></i>
            </div>
            <h5>Haz tu Pedido</h5>
            <p>Online o por teléfono, rápido y fácil</p>
          </div>
        </div>

        <div class="col-md-3 text-center ftco-animate">
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-icon mb-3">
              <i class="fas fa-pizza-slice" style="font-size: 3rem; color: #fca100;"></i>
            </div>
            <h5>Preparación</h5>
            <p>Nuestros chefs crean tu pizza perfecta</p>
          </div>
        </div>

        <div class="col-md-3 text-center ftco-animate">
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-icon mb-3">
              <i class="fas fa-shipping-fast" style="font-size: 3rem; color: #fca100;"></i>
            </div>
            <h5>Delivery</h5>
            <p>Entrega rápida a tu puerta</p>
          </div>
        </div>

        <div class="col-md-3 text-center ftco-animate">
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-icon mb-3">
              <i class="fas fa-smile-beam" style="font-size: 3rem; color: #fca100;"></i>
            </div>
            <h5>¡Disfruta!</h5>
            <p>Sabor auténtico italiano en casa</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="ftco-section ftco-no-pt ftco-no-pb">
    <div class="container-fluid px-0">
      <div class="row no-gutters">
        <div class="col-md-12">
          <div class="cta-box" style="background-image: url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200'); background-size: cover; background-position: center; position: relative; padding: 100px 0;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
            <div class="container" style="position: relative; z-index: 2;">
              <div class="row justify-content-center">
                <div class="col-md-8 text-center text-white">
                  <h2 class="mb-4" style="font-size: 2.5rem; font-weight: bold;">¿Listo para disfrutar?</h2>
                  <p class="mb-4" style="font-size: 1.2rem;">Haz tu pedido ahora y recibe un 15% de descuento en tu primera orden online</p>
                  <router-link to="/menu" class="btn btn-primary btn-lg px-5 py-3">
                    <i class="fas fa-utensils mr-2"></i>Ver Menú y Ordenar
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<style scoped>
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
  min-width: 60px;
}

.process-step {
  position: relative;
  padding: 20px;
}

.step-number {
  position: absolute;
  top: -10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: #fca100;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.process-step h5 {
  font-weight: 700;
  margin-top: 1rem;
  color: #2c3e50;
}

.process-step p {
  color: #6c757d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .process-step {
    margin-bottom: 2rem;
  }
}
</style>
