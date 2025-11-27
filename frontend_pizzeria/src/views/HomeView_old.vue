<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

let carouselInstance: any = null

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (typeof (window as any).$ !== 'undefined') {
        const $ = (window as any).$

        // Owl Carousel para el slider principal de pizza
        const $slider = $('.home-slider')
        if ($slider.length && !carouselInstance) {
          // Asegurar que no haya inicialización previa
          if ($slider.data('owl.carousel')) {
            $slider.trigger('destroy.owl.carousel')
            $slider.removeClass('owl-carousel owl-loaded owl-drag')
          }
          
          // Inicializar Owl Carousel con configuración completa
          carouselInstance = $slider.owlCarousel({
            loop: true,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplaySpeed: 800,
            autoplayHoverPause: false,
            nav: false,
            dots: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 800,
            navText: ["<span class='ion-ios-arrow-back'></span>","<span class='ion-ios-arrow-forward'></span>"],
            responsive: {
              0: { items: 1, nav: false },
              600: { items: 1, nav: false },
              1000: { items: 1, nav: false }
            }
          })
          
          console.log('Owl Carousel inicializado correctamente')
        }

        // Inicializar efectos parallax DESPUÉS de que el carousel esté listo
        setTimeout(() => {
          // Inicializar Stellar para efecto parallax
          if ($.fn.stellar) {
            $(window).stellar({
              responsive: true,
              parallaxBackgrounds: true,
              parallaxElements: true,
              horizontalScrolling: false,
              hideDistantElements: false,
              scrollProperty: 'scroll',
              horizontalOffset: 0,
              verticalOffset: 0
            })
            console.log('Stellar parallax inicializado')
          }

          // Inicializar Scrollax para efectos de scroll suave
          if ($.Scrollax) {
            $.Scrollax()
            console.log('Scrollax inicializado')
          }
        }, 500)

        // AOS Animation - refresh en lugar de init
        if (typeof (window as any).AOS !== 'undefined') {
          (window as any).AOS.refresh()
        }

        // Counter animation con IntersectionObserver para activar solo cuando sea visible
        if ($('.number').length) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const $this = $(entry.target)
                const targetNumber = $this.data('number')
                if (targetNumber && $this.text() === '0') {
                  $this.prop('Counter', 0).animate({
                    Counter: targetNumber
                  }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function(now: number) {
                      $this.text(Math.ceil(now))
                    }
                  })
                }
                observer.unobserve(entry.target)
              }
            })
          }, { threshold: 0.5 })

          $('.number').each(function(this: HTMLElement) {
            observer.observe(this)
          })
        }
      }
    }, 800)
  })
})

onUnmounted(() => {
  // Limpiar carousel al desmontar
  if (carouselInstance && typeof (window as any).$ !== 'undefined') {
    const $ = (window as any).$
    if ($('.home-slider').data('owl.carousel')) {
      $('.home-slider').trigger('destroy.owl.carousel')
      carouselInstance = null
    }
  }
})
</script>

<template>
  <!-- Hero Slider -->
  <section class="home-slider img" style="background-image: url(/images/bg_1.jpg);">
    <div class="slider-item">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text align-items-center" data-scrollax-parent="true">
          <div class="col-md-6 col-sm-12 ftco-animate">
            <span class="subheading">Deliciosa</span>
            <h1 class="mb-4">Cocina Italiana</h1>
            <p class="mb-4 mb-md-5">Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            <p>
              <RouterLink to="/menu" class="btn btn-primary p-3 px-xl-4 py-xl-3">Ordenar Ahora</RouterLink>
              <RouterLink to="/menu" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3">Ver Menú</RouterLink>
            </p>
          </div>
          <div class="col-md-6 ftco-animate">
            <img src="/images/bg_1.png" class="img-fluid" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="slider-item">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text align-items-center" data-scrollax-parent="true">
          <div class="col-md-6 col-sm-12 order-md-last ftco-animate">
            <span class="subheading">Crujiente</span>
            <h1 class="mb-4">Pizza Italiana</h1>
            <p class="mb-4 mb-md-5">Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            <p>
              <RouterLink to="/menu" class="btn btn-primary p-3 px-xl-4 py-xl-3">Ordenar Ahora</RouterLink>
              <RouterLink to="/menu" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3">Ver Menú</RouterLink>
            </p>
          </div>
          <div class="col-md-6 ftco-animate">
            <img src="/images/bg_2.png" class="img-fluid" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="slider-item" style="background-image: url(/images/bg_3.jpg);">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text justify-content-center align-items-center" data-scrollax-parent="true">
          <div class="col-md-7 col-sm-12 text-center ftco-animate">
            <span class="subheading">Bienvenido</span>
            <h1 class="mb-4">Cocinamos tu receta de Pizza deseada</h1>
            <p class="mb-4 mb-md-5">Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            <p>
              <RouterLink to="/menu" class="btn btn-primary p-3 px-xl-4 py-xl-3">Ordenar Ahora</RouterLink>
              <RouterLink to="/menu" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3">Ver Menú</RouterLink>
            </p>
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
        <h2 class="mb-4">Bienvenido a <span class="flaticon-pizza">Pizza</span> Un Restaurante</h2>
      </div>
      <div>
        <p>En su camino se encontró con una copia. La copia advirtió al Texto Ciego Pequeño que, de donde venía, habría sido reescrita mil veces y todo lo que quedaba de su origen sería la palabra "y" y el Texto Ciego Pequeño debería dar la vuelta y regresar a su propio país seguro. Pero nada de lo que dijo la copia pudo convencerla, por lo que no pasó mucho tiempo hasta que unos insidiosos Escritores de Copias la emboscaron, la emborracharon con Longe y Parole y la arrastraron a su agencia, donde abusaron de ella.</p>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="ftco-section ftco-services">
    <div class="overlay"></div>
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section ftco-animate text-center">
          <h2 class="mb-4">Nuestros Servicios</h2>
          <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia, viven los textos ciegos.</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-5">
              <span class="flaticon-diet"></span>
            </div>
            <div class="media-body">
              <h3 class="heading">Comidas Saludables</h3>
              <p>Incluso el todopoderoso Pointing no tiene control sobre los textos ciegos, es casi no ortográfico.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-5">
              <span class="flaticon-bicycle"></span>
            </div>
            <div class="media-body">
              <h3 class="heading">Entrega Rápida</h3>
              <p>Incluso el todopoderoso Pointing no tiene control sobre los textos ciegos, es casi no ortográfico.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 ftco-animate">
          <div class="media d-block text-center block-6 services">
            <div class="icon d-flex justify-content-center align-items-center mb-5"><span class="flaticon-pizza-1"></span></div>
            <div class="media-body">
              <h3 class="heading">Recetas Originales</h3>
              <p>Incluso el todopoderoso Pointing no tiene control sobre los textos ciegos, es casi no ortográfico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Hot Pizza Meals -->
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section ftco-animate text-center">
          <h2 class="mb-4">Pizzas Calientes</h2>
          <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia, viven los textos ciegos.</p>
        </div>
      </div>
    </div>
    <div class="container-wrap">
      <div class="row no-gutters d-flex">
        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img" style="background-image: url(/images/pizza-1.jpg);"></a>
            <div class="text p-4">
              <h3>Pizza Italiana</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img" style="background-image: url(/images/pizza-2.jpg);"></a>
            <div class="text p-4">
              <h3>Pizza Griega</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img" style="background-image: url(/images/pizza-3.jpg);"></a>
            <div class="text p-4">
              <h3>Pizza Caucásica</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>

        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img order-lg-last" style="background-image: url(/images/pizza-4.jpg);"></a>
            <div class="text p-4">
              <h3>Pizza Americana</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img order-lg-last" style="background-image: url(/images/pizza-5.jpg);"></a>
            <div class="text p-4">
              <h3>Tarta de Tomate</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 d-flex ftco-animate">
          <div class="services-wrap d-flex">
            <a href="#" class="img order-lg-last" style="background-image: url(/images/pizza-6.jpg);"></a>
            <div class="text p-4">
              <h3>Margherita</h3>
              <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia</p>
              <p class="price"><span>$2.90</span> <a href="#" class="ml-2 btn btn-white btn-outline-white">Ordenar</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gallery -->
  <section class="ftco-gallery">
    <div class="container-wrap">
      <div class="row no-gutters">
        <div class="col-md-3 ftco-animate">
          <a href="#" class="gallery img d-flex align-items-center" style="background-image: url(/images/gallery-1.jpg);">
            <div class="icon mb-4 d-flex align-items-center justify-content-center">
              <span class="icon-search"></span>
            </div>
          </a>
        </div>
        <div class="col-md-3 ftco-animate">
          <a href="#" class="gallery img d-flex align-items-center" style="background-image: url(/images/gallery-2.jpg);">
            <div class="icon mb-4 d-flex align-items-center justify-content-center">
              <span class="icon-search"></span>
            </div>
          </a>
        </div>
        <div class="col-md-3 ftco-animate">
          <a href="#" class="gallery img d-flex align-items-center" style="background-image: url(/images/gallery-3.jpg);">
            <div class="icon mb-4 d-flex align-items-center justify-content-center">
              <span class="icon-search"></span>
            </div>
          </a>
        </div>
        <div class="col-md-3 ftco-animate">
          <a href="#" class="gallery img d-flex align-items-center" style="background-image: url(/images/gallery-4.jpg);">
            <div class="icon mb-4 d-flex align-items-center justify-content-center">
              <span class="icon-search"></span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Counter Section -->
  <section class="ftco-counter ftco-bg-dark img" id="section-counter" style="background-image: url(/images/bg_2.jpg);" data-stellar-background-ratio="0.5">
    <div class="overlay"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="row">
            <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
              <div class="block-18 text-center">
                <div class="text">
                  <div class="icon"><span class="flaticon-pizza-1"></span></div>
                  <strong class="number" data-number="100">0</strong>
                  <span>Sucursales de Pizza</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
              <div class="block-18 text-center">
                <div class="text">
                  <div class="icon"><span class="flaticon-medal"></span></div>
                  <strong class="number" data-number="85">0</strong>
                  <span>Número de Premios</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
              <div class="block-18 text-center">
                <div class="text">
                  <div class="icon"><span class="flaticon-laugh"></span></div>
                  <strong class="number" data-number="10567">0</strong>
                  <span>Clientes Felices</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
              <div class="block-18 text-center">
                <div class="text">
                  <div class="icon"><span class="flaticon-chef"></span></div>
                  <strong class="number" data-number="900">0</strong>
                  <span>Personal</span>
                </div>
              </div>
            </div>
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
          <h2 class="mb-4">Reciente del Blog</h2>
          <p>Muy muy lejos, detrás de las montañas de palabras, lejos de los países Vokalia y Consonantia, viven los textos ciegos.</p>
        </div>
      </div>
      <div class="row d-flex">
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <a href="#" class="block-20" style="background-image: url('/images/image_1.jpg');"></a>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sept 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><a href="#">La Deliciosa Pizza</a></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <a href="#" class="block-20" style="background-image: url('/images/image_2.jpg');"></a>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sept 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><a href="#">La Deliciosa Pizza</a></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 d-flex ftco-animate">
          <div class="blog-entry align-self-stretch">
            <a href="#" class="block-20" style="background-image: url('/images/image_3.jpg');"></a>
            <div class="text py-4 d-block">
              <div class="meta">
                <div><a href="#">Sept 10, 2018</a></div>
                <div><a href="#">Admin</a></div>
                <div><a href="#" class="meta-chat"><span class="icon-chat"></span> 3</a></div>
              </div>
              <h3 class="heading mt-2"><a href="#">La Deliciosa Pizza</a></h3>
              <p>Un pequeño río llamado Duden fluye junto a su lugar y lo abastece con la necesaria regelialia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
