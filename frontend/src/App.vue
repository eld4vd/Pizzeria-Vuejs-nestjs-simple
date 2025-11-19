<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
import CartButton from './components/cart/CartButton.vue'
import CartModal from './components/cart/CartModal.vue'

const route = useRoute()
const showCart = ref(false)

// Rutas donde NO se debe mostrar header y footer
const routesWithoutLayout = computed(() => {
  const path = route.path
  return path.startsWith('/dashboard') || path === '/login'
})

const openCart = () => {
  showCart.value = true
}
</script>

<template>
  <MainHeader v-if="!routesWithoutLayout" />
  <RouterView />
  <MainFooter v-if="!routesWithoutLayout" />
  
  <!-- Carrito flotante (solo en vistas de cliente) -->
  <CartButton v-if="!routesWithoutLayout" @open-cart="openCart" />
  <CartModal 
    v-if="!routesWithoutLayout"
    :show="showCart"
    @close="showCart = false"
  />
</template>

<style>
/* Estilos mínimos de App.vue - el resto está en fix-styles.css */
#app {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
