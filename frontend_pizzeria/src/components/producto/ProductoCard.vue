<script setup lang="ts">
import { computed } from 'vue'
import type { Producto } from '@/models/producto'

interface Props {
  producto: Producto
  layout?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'grid'
})

const emit = defineEmits<{
  addToCart: [producto: Producto]
  viewDetails: [producto: Producto]
}>()

const imagenUrl = computed(() => {
  return props.producto.imagenUrl || '/images/pizza-1.jpg'
})

const precioFormateado = computed(() => {
  const precio = typeof props.producto.precio === 'string' 
    ? parseFloat(props.producto.precio) 
    : props.producto.precio
  return `Bs. ${precio.toFixed(2)}`
})

const handleAddToCart = () => {
  emit('addToCart', props.producto)
}

const handleViewDetails = () => {
  emit('viewDetails', props.producto)
}
</script>

<template>
  <div v-if="layout === 'grid'" class="col-lg-4 d-flex ftco-animate">
    <div class="services-wrap d-flex">
      <a 
        href="javascript:void(0)" 
        class="img" 
        :style="{ backgroundImage: `url(${imagenUrl})` }"
        @click="handleViewDetails"
      ></a>
      <div class="text p-4">
        <h3>{{ producto.nombre }}</h3>
        <p class="description">{{ producto.descripcion }}</p>
        <p class="price">
          <span>{{ precioFormateado }}</span>
          <button 
            @click="handleAddToCart"
            class="ml-2 btn btn-white btn-outline-white"
            :disabled="!producto.disponible"
          >
            {{ producto.disponible ? 'Añadir' : 'No disponible' }}
          </button>
        </p>
        <div class="product-badges">
          <span v-if="producto.categoria" class="badge badge-info">
            {{ producto.categoria }}
          </span>
          <span v-if="producto.destacado" class="badge badge-warning ml-1">Destacado</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="pricing-entry d-flex ftco-animate">
    <div 
      class="img" 
      :style="{ backgroundImage: `url(${imagenUrl})` }"
      @click="handleViewDetails"
      style="cursor: pointer;"
    ></div>
    <div class="desc pl-3">
      <div class="d-flex text align-items-center">
        <h3><span>{{ producto.nombre }}</span></h3>
        <span class="price">{{ precioFormateado }}</span>
      </div>
      <div class="d-block">
        <p>{{ producto.descripcion }}</p>
        <button 
          @click="handleAddToCart"
          class="btn btn-primary btn-sm"
          :disabled="!producto.disponible"
        >
          <i class="fa fa-shopping-cart"></i>
          {{ producto.disponible ? 'Añadir al carrito' : 'No disponible' }}
        </button>
        <span v-if="producto.categoria" class="badge badge-info ml-2">
          {{ producto.categoria }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.img:hover {
  transform: scale(1.05);
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
}

.badge-primary {
  background-color: #fca100 !important;
  color: white;
}

.product-badges {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* ===== RESPONSIVE MÓVIL ===== */
@media (max-width: 991px) {
  .col-lg-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 767px) {
  .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 0 10px;
  }

  .services-wrap {
    flex-direction: column !important;
    margin-bottom: 20px;
  }

  .services-wrap .img {
    height: 200px !important;
    min-height: 200px;
    width: 100% !important;
    border-radius: 12px 12px 0 0 !important;
  }

  .services-wrap .text {
    padding: 15px !important;
  }

  .services-wrap .text h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .description {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    margin-bottom: 10px;
  }

  .price {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .price span {
    font-size: 1.2rem;
    font-weight: 700;
  }

  .price .btn {
    flex: 1;
    min-width: 100px;
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  /* Lista view en móvil */
  .pricing-entry {
    flex-direction: column !important;
    padding: 15px;
    margin-bottom: 15px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .pricing-entry .img {
    width: 100% !important;
    height: 150px !important;
    min-height: 150px;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .pricing-entry .desc {
    padding-left: 0 !important;
    width: 100%;
  }

  .pricing-entry .d-flex.text {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 5px;
  }

  .pricing-entry .d-flex.text h3 {
    margin-bottom: 5px;
  }

  .pricing-entry .d-flex.text .price {
    font-size: 1.1rem;
    color: #fca100;
    font-weight: 700;
  }

  .pricing-entry .d-block {
    margin-top: 10px;
  }

  .pricing-entry .d-block p {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .pricing-entry .btn-sm {
    width: 100%;
    padding: 10px;
    font-size: 0.95rem;
  }

  .pricing-entry .badge {
    display: block;
    margin-top: 8px;
    margin-left: 0 !important;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .services-wrap .img {
    height: 180px !important;
  }

  .services-wrap .text h3 {
    font-size: 1rem;
  }

  .price span {
    font-size: 1.1rem;
  }
}
</style>
