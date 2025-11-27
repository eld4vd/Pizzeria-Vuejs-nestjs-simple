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
            {{ producto.categoria.nombre }}
          </span>
          <span v-if="producto.tamaño" class="badge badge-primary ml-1">
            {{ producto.tamaño.nombre }}
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
          {{ producto.categoria.nombre }}
        </span>
        <span v-if="producto.tamaño" class="badge badge-primary ml-1">
          {{ producto.tamaño.nombre }}
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
</style>
